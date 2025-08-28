"use client";
import DashboardCard from "@/app/components/DashboardCard";
import Button from "@/app/components/common/Button";
import { CalendarHeart } from "lucide-react";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { GoogleGenAI } from "@google/genai";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axiosInstance";

const SchedulePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("Class 9A");
  const [timetable, setTimetable] = useState([
    {
      startTime: "09:00",
      endTime: "10:00",
      subjects: [
        "Mathematics",
        "Mathematics",
        "English",
        "Indonesian",
        "History",
      ],
    },
    {
      startTime: "10:00",
      endTime: "11:00",
      subjects: [
        "Mathematics",
        "Biology",
        "Biology",
        "Mathematics",
        "Religion",
      ],
    },
    {
      startTime: "11:00",
      endTime: "12:00",
      subjects: [
        "Art and Culture",
        "Indonesian",
        "Physics",
        "Crafts",
        "Mathematics",
      ],
    },
    {
      startTime: "12:00",
      endTime: "13:00",
      subjects: ["Rest", "Rest", "Rest", "Rest", "Rest"],
    },
    {
      startTime: "13:00",
      endTime: "14:00",
      subjects: [
        "Mathematics",
        "Indonesian",
        "Physics",
        "Mathematics",
        "Mathematics",
      ],
    },
    {
      startTime: "14:00",
      endTime: "15:00",
      subjects: [
        "Mathematics",
        "Religion",
        "Physics",
        "Mathematics",
        "Art and Culture",
      ],
    },
  ]);

  const [weightages, setWeightages] = useState([3, 2, 2, 1, 1]);
  const [timeSlots, setTimeSlots] = useState([
    { startTime: "09:00", endTime: "10:00" },
    { startTime: "10:00", endTime: "11:00" },
    { startTime: "11:00", endTime: "12:00" },
    { startTime: "12:00", endTime: "13:00" },
    { startTime: "13:00", endTime: "14:00" },
    { startTime: "14:00", endTime: "15:00" },
  ]);

  const [isGenerating, setIsGenerating] = useState(false); // Added state for loader.

  const { data: subjectData } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await axiosInstance.get("/subject/")).data,
    placeholderData: [],
  });
  const { data: classData } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await axiosInstance.get("/class/")).data,
    placeholderData:[]
  });
  const subjects = subjectData?.map((s) => s.name);
  const classOptions = classData?.map((c)=>new Array(Number(c.sections)).fill(0).map((_c,i)=>`Class ${c.name}${String.fromCharCode(65 + i)}`)).flatmap()
  const subjectOptions = subjects;

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-800",
    Biology: "bg-green-100 text-green-800",
    Physics: "bg-purple-100 text-purple-800",
    Indonesian: "bg-yellow-100 text-yellow-800",
    "Art and Culture": "bg-pink-100 text-pink-800",
    Religion: "bg-red-100 text-red-800",
    Crafts: "bg-teal-100 text-teal-800",
    Rest: "bg-gray-100 text-gray-800",
  };

  const animationProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleSave = () => {
    toast.success("Timetable saved successfully!", {
      position: "bottom-right",
    });
  };

  const handleTimeChange = (
    index: number,
    type: "startTime" | "endTime",
    newTime: any
  ) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index][type] = newTime ? newTime.format("HH:mm") : "";
    setTimetable(updatedTimetable);
  };

  const handleSubjectChange = (
    rowIndex: number,
    colIndex: number,
    newSubject: string
  ) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[rowIndex].subjects[colIndex] = newSubject;
    setTimetable(updatedTimetable);
  };

  const initializeAI = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY) {
      console.error("API_KEY is not set in environment variables.");
      toast.error("AI service is not configured. Please contact support.", {
        position: "bottom-right",
      });
      return null;
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY,
    });

    return ai.chats.create({
      model: "gemini-2.5-flash-preview-04-17",
      config: {
        systemInstruction: `You are Skhool AI, a specialized assistant for generating school schedules.

        STRICT OUTPUT FORMAT RULES:
        1. Return ONLY valid JSON, no markdown, no explanation
        2. JSON structure must be:
        {
          "class": "string",
          "schedule": [
            {
              "day": "string (Monday-Friday)",
              "periods": [
                {
                  "timeSlot": {
                    "startTime": "HH:mm",
                    "endTime": "HH:mm"
                  },
                  "subject": "string (from provided subject list only)",
                  "teacher:string (from provided subject list)
                }
              ]
            }
          ]
        }
        
        SCHEDULE GENERATION RULES:
        1. 12:00-13:00 slot MUST be "Rest" period every day
        2. No more than 2 consecutive periods of the same subject
        3. Respect subject weightages for frequency
        4. Use only provided subject names exactly as given
        5. Each time slot must match the provided time slots exactly
        6. Use exactly one subject per time slot.
7. Subjects with higher weekly frequency must appear more often.
8. Teachers must not be double-booked at the same time.
9. Ensure at least one free period/day for each teacher.
10. Avoid assigning the same subject more than once a day unless necessary.
11. Balance teacher load across the week.
12. Include subject name for each time range.
13. Do not assign classes to a teacher back to back in same class
        `,
      },
    });
  };

  const validateAIResponse = (response: string) => {
    // First, try to clean the response
    const cleanedResponse = response
      .replace(/```json|```/g, "")
      .replace(/\n/g, "")
      .replace(/\s+/g, " ")
      .trim();

    try {
      const parsedResponse = JSON.parse(cleanedResponse);

      // Validate basic structure
      if (!parsedResponse.class || !Array.isArray(parsedResponse.schedule)) {
        throw new Error("Invalid response structure");
      }

      const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const validSubjects = new Set([...subjects, "Rest"]);

      // Validate schedule array
      if (parsedResponse.schedule.length !== 5) {
        throw new Error("Schedule must contain exactly 5 days");
      }

      // Validate each day's schedule
      parsedResponse.schedule.forEach((day) => {
        if (!day.day || !dayNames.includes(day.day)) {
          throw new Error(`Invalid day name: ${day.day}`);
        }

        if (
          !Array.isArray(day.periods) ||
          day.periods.length !== timeSlots.length
        ) {
          throw new Error(`Invalid periods array for ${day.day}`);
        }

        // Validate each period
        day.periods.forEach((period, periodIndex) => {
          // Validate time slot
          const expectedTimeSlot = timeSlots[periodIndex];
          if (
            !period.timeSlot ||
            period.timeSlot.startTime !== expectedTimeSlot.startTime ||
            period.timeSlot.endTime !== expectedTimeSlot.endTime
          ) {
            throw new Error(
              `Invalid time slot for ${day.day}, period ${periodIndex + 1}`
            );
          }

          // Validate subject
          if (!validSubjects.has(period.subject)) {
            throw new Error(
              `Invalid subject "${period.subject}" for ${day.day}, period ${
                periodIndex + 1
              }`
            );
          }

          // Validate Rest period at 12:00
          if (
            period.timeSlot.startTime === "12:00" &&
            period.subject !== "Rest"
          ) {
            throw new Error(`Period at 12:00 must be Rest for ${day.day}`);
          }
        });
      });

      return parsedResponse;
    } catch (error) {
      console.error("Validation error:", error);
      throw new Error(`Invalid AI response: ${error.message}`);
    }
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const prompt = {
    constraints: {
      maximumConsecutivePeriods: 2,
      subjectsPerDay: {
        min: 3,
        max: 5,
      },
      restPeriod: {
        startTime: "12:00",
        endTime: "13:00",
      },
    },
  };

  const handleGenerateScheduleWithAI = async () => {
    const chatSession = initializeAI();
    if (!chatSession) return;

    setIsGenerating(true);

    try {
      // Enhanced prompt with more specific constraints
      const response = await chatSession.sendMessage({
        message: `Generate a school schedule following these STRICT requirements:

        Available subjects: ${JSON.stringify(subjects)}
        Time slots: ${JSON.stringify(timeSlots)}

        Critical rules to follow:
        1. Use ONLY these exact subject names: ${subjects.join(", ")}
        2. Every day MUST have "Rest" period at ${
          prompt.constraints.restPeriod.startTime
        }-${prompt.constraints.restPeriod.endTime}
        3. Maximum ${
          prompt.constraints.maximumConsecutivePeriods
        } consecutive periods for the same subject
        4. Each day must have ${prompt.constraints.subjectsPerDay.min}-${
          prompt.constraints.subjectsPerDay.max
        } different subjects
        5. Higher weightage subjects (${weightages
          .map((w, i) => `${subjects[i]}:${w}`)
          .join(", ")}) should appear more frequently
        6. Ensure even distribution of subjects across the week
        7. Consider teacher availability (no parallel classes of the same subject)
        8. Physical activities and lab work should preferably be in morning slots

        Example of VALID period format:
        {
          "timeSlot": {
            "startTime": "12:00",
            "endTime": "13:00"
          },
          "subject": "Rest"
        }

        Full response must be valid JSON matching exactly:
        {
          "class": "${selectedClass}",
          "schedule": [
            {
              "day": "Monday",
              "periods": [Array of periods]
            },
            ... (for all 5 days)
          ]
        }`,
      });

      const generatedSchedule = validateAIResponse(response.text);

      // Enhanced validation to ensure subject distribution
      const subjectFrequency = new Map();
      let consecutiveCount = 0;
      let lastSubject = "";

      generatedSchedule.schedule.forEach((day) => {
        day.periods.forEach((period) => {
          // Count subject frequency
          subjectFrequency.set(
            period.subject,
            (subjectFrequency.get(period.subject) || 0) + 1
          );

          // Check consecutive periods
          if (period.subject === lastSubject) {
            consecutiveCount++;
            if (
              consecutiveCount > prompt.constraints.maximumConsecutivePeriods
            ) {
              throw new Error(`Too many consecutive ${period.subject} periods`);
            }
          } else {
            consecutiveCount = 1;
          }
          lastSubject = period.subject;
        });
        lastSubject = ""; // Reset for next day
        consecutiveCount = 0;
      });

      // Process and update the timetable
      const updatedTimetable = timeSlots.map((timeSlot) => {
        const subjects = dayNames.map((dayName) => {
          const daySchedule = generatedSchedule.schedule.find(
            (day) => day.day === dayName
          );
          const period = daySchedule.periods.find(
            (p) =>
              p.timeSlot.startTime === timeSlot.startTime &&
              p.timeSlot.endTime === timeSlot.endTime
          );
          return period.subject;
        });

        return {
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          subjects,
        };
      });

      setTimetable(updatedTimetable);
      toast.success("AI-generated schedule successfully!", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error generating schedule with AI:", error);
      toast.error(
        error.message || "Failed to generate schedule. Please try again.",
        {
          position: "bottom-right",
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <animated.div style={animationProps} className="space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Manage Schedules
      </h1>

      <DashboardCard
        title="Class Schedules"
        icon={<CalendarHeart className="w-8 h-8 text-blue-500" />}
      >
        {isGenerating && (
          <div className="flex justify-center items-center mb-4">
            <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
            <span className="ml-2 text-blue-500 font-medium">
              Generating schedule...
            </span>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-lg">
            Select Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border border-gray-300 p-3">Start Time</th>
                <th className="border border-gray-300 p-3">End Time</th>
                <th className="border border-gray-300 p-3">Monday</th>
                <th className="border border-gray-300 p-3">Tuesday</th>
                <th className="border border-gray-300 p-3">Wednesday</th>
                <th className="border border-gray-300 p-3">Thursday</th>
                <th className="border border-gray-300 p-3">Friday</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3 font-medium text-gray-700">
                    <TimePicker
                      value={
                        row.startTime ? dayjs(row.startTime, "HH:mm") : null
                      }
                      onChange={(newTime) =>
                        handleTimeChange(rowIndex, "startTime", newTime)
                      }
                      format="HH:mm"
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-3 font-medium text-gray-700">
                    <TimePicker
                      value={row.endTime ? dayjs(row.endTime, "HH:mm") : null}
                      onChange={(newTime) =>
                        handleTimeChange(rowIndex, "endTime", newTime)
                      }
                      format="HH:mm"
                      className="w-full"
                    />
                  </td>
                  {row.subjects.map((subject, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 p-3 rounded-md ${
                        subjectColors[subject] || ""
                      }`}
                    >
                      <select
                        value={subject}
                        onChange={(e) =>
                          handleSubjectChange(
                            rowIndex,
                            colIndex,
                            e.target.value
                          )
                        }
                        className="border-none bg-transparent w-full"
                      >
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            onClick={handleGenerateScheduleWithAI}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            disabled={isGenerating} // Disable button while generating.
          >
            Generate Schedule
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Save Timetable
          </Button>
        </div>
      </DashboardCard>
    </animated.div>
  );
};

export default SchedulePage;
