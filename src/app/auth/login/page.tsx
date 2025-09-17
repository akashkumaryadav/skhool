"use client";
import React, { useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/lib/api/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Rive animation setup
  const STATE_MACHINE_NAME = "Chump State Machine"; // Ensure this matches your Rive file's state machine name
  const { rive, RiveComponent } = useRive({
    src: "/state_machines/chump_state_machine.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  // Get state machine inputs
  // look is number type and value should be the current input cursor position
  const lookInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "Look");
  const checkInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "Check");
  const handsUpInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "hands_up"
  );
  const successInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "success"
  );
  const failInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "fail");

  const handleUsernameFocus = () => {
    if (lookInput) {
      lookInput.value = username.length * 10; // Set the cursor position based on the current input length
    }
    if (checkInput) checkInput.value = true;
  };

  const handleUsernameBlur = () => {
    if (lookInput) {
      lookInput.value = 0; // Reset cursor position when input loses focus
    }
    if (checkInput) checkInput.value = false;
    if (!password && handsUpInput) handsUpInput.value = false;
  };

  const handlePasswordFocus = () => {
    if (handsUpInput) handsUpInput.value = true;
  };

  const handlePasswordBlur = () => {
    if (handsUpInput) handsUpInput.value = false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      if (failInput) failInput.fire();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      if (failInput) failInput.fire();
      return;
    }

    // Simulate login
    setIsLoading(true);
    //perform login here using react query and axios and store the token to use as bearer token for future requests
    try {
      const response = await loginUser(username, password);
      const { access_token, refresh_token } = response;
      // const response = await axios.post(`${process.env.API_URL}/auth/login`, {
      //   username,
      //   password,
      // });
      // const { access_token, refresh_token } = response.data;

      // //decode the token to get user details
      // const user = JSON.parse(atob(access_token.split(".")[1]));
      // console.log(user);

      // Store the token for future requests
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      // // Optionally, set up axios to use this token as a default header
      // axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      // (await cookies()).set("auth_token", access_token, {
      //   httpOnly: true, // JS cannot read
      //   secure: true, // only over HTTPS
      //   sameSite: "lax",
      //   path: "/",
      // });

      // Fire success animation
      if (successInput) successInput.fire();

      setIsLoading(false);
      // Redirect to dashboard or another page
      router.push("/");
    } catch (err) {
      console.log(err);
      setError("Invalid username or password");
      if (failInput) failInput.fire();
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#d5e4ed]">
      <div className="w-full max-w-md h-svh">
        <RiveComponent />
      </div>
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl flex items-center justify-center font-bold text-center mb-6">
          Login to{" "}
          <Image
            src="/images/logo-dark.png"
            alt="Skhool Logo"
            width={100}
            height={100}
            className="m-0"
          />
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skhool-blue-500"
              placeholder="Enter your username"
            />
            <label className="block text-sm font-medium text-red-500 mt-1">
              {error && error.includes("username") ? error : ""}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skhool-blue-500"
              placeholder="Enter your password"
            />
            <label className="block text-sm font-medium text-red-500 mt-1">
              {error && error.includes("password") ? error : ""}
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-skhool-blue-600 focus:ring-skhool-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>
            <a
              href="#"
              className="text-sm text-skhool-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className={`w-full bg-success hover:bg-skhool-blue-700 text-white  font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&&apos;t have an account?{" "}
            <a href="#" className="text-skhool-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
