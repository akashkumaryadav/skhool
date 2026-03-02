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
import { AxiosError } from "axios";
import { GoogleGenAI } from "@google/genai";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axiosInstance";

interface SchedulePayload {
  subjectId: number;
  classroomId: number;
  weekday: string; // "monday", "tuesday", etc.
  startTime: string; // "HH:mm" format in local timezone
  endTime: string; // "HH:mm" format in local timezone
  teacherId: number;
}

const SchedulePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Record<
    string,
    number
  > | null>(null);
  const [timetable, setTimetable] = useState([
    {
      startTime: "09:00",
      endTime: "10:00",
      periods: [
        { subject: "Mathematics", teacher: "Demo", teacherId: 1, subjectId: 1 },
        {
          subject: "Mathematics",
          teacher: "Demo1",
          teacherId: 2,
          subjectId: 1,
        },
        { subject: "English", teacher: "Demo2", teacherId: 3, subjectId: 2 },
        { subject: "Indonesian", teacher: "Demo3", teacherId: 4, subjectId: 3 },
        { subject: "History", teacher: "Demo4", teacherId: 5, subjectId: 4 },
      ],
    },
    {
      startTime: "10:00",
      endTime: "11:00",
      periods: [
        { subject: "Mathematics", teacher: "Demo", teacherId: 1, subjectId: 1 },
        { subject: "Biology", teacher: "Demo1", teacherId: 2, subjectId: 5 },
        { subject: "Biology", teacher: "Demo2", teacherId: 3, subjectId: 5 },
        {
          subject: "Mathematics",
          teacher: "Demo3",
          teacherId: 4,
          subjectId: 1,
        },
        { subject: "Religion", teacher: "Demo4", teacherId: 5, subjectId: 6 },
      ],
    },
    {
      startTime: "11:00",
      endTime: "12:00",
      periods: [
        {
          subject: "Art and Culture",
          teacher: "Demo",
          teacherId: 6,
          subjectId: 7,
        },
        { subject: "Indonesian", teacher: "Demo1", teacherId: 7, subjectId: 3 },
        { subject: "Physics", teacher: "Demo2", teacherId: 8, subjectId: 8 },
        { subject: "Crafts", teacher: "Demo3", teacherId: 9, subjectId: 9 },
        {
          subject: "Mathematics",
          teacher: "Demo4",
          teacherId: 10,
          subjectId: 1,
        },
      ],
    },
    {
      startTime: "12:00",
      endTime: "13:00",
      periods: [
        { subject: "Rest", teacher: "", teacherId: 0, subjectId: 0 },
        { subject: "Rest", teacher: "", teacherId: 0, subjectId: 0 },
        { subject: "Rest", teacher: "", teacherId: 0, subjectId: 0 },
        { subject: "Rest", teacher: "", teacherId: 0, subjectId: 0 },
        { subject: "Rest", teacher: "", teacherId: 0, subjectId: 0 },
      ],
    },
    {
      startTime: "13:00",
      endTime: "14:00",
      periods: [
        { subject: "Mathematics", teacher: "Demo", teacherId: 1, subjectId: 1 },
        { subject: "Religion", teacher: "Demo1", teacherId: 5, subjectId: 6 },
        { subject: "Physics", teacher: "Demo2", teacherId: 8, subjectId: 8 },
        {
          subject: "Mathematics",
          teacher: "Demo3",
          teacherId: 4,
          subjectId: 1,
        },
        {
          subject: "Art and Culture",
          teacher: "Demo4",
          teacherId: 6,
          subjectId: 7,
        },
      ],
    },
    {
      startTime: "14:00",
      endTime: "15:00",
      periods: [
        { subject: "Mathematics", teacher: "Demo", teacherId: 1, subjectId: 1 },
        { subject: "Religion", teacher: "Demo1", teacherId: 5, subjectId: 6 },
        { subject: "Physics", teacher: "Demo2", teacherId: 8, subjectId: 8 },
        {
          subject: "Mathematics",
          teacher: "Demo3",
          teacherId: 4,
          subjectId: 1,
        },
        {
          subject: "Art and Culture",
          teacher: "Demo4",
          teacherId: 6,
          subjectId: 7,
        },
      ],
    },
  ]);

  const [timeSlots] = useState([
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
    queryFn: async () =>
      (await axiosInstance.get("/schdeule/all-classroom")).data,
    placeholderData: [],
  });
  const subjects = subjectData?.map((s) => ({
    name: s.name,
    id: s.id,
    code: s.code,
  }));
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/teachers/subjects")).data,
    placeholderData: [],
  });
  const classOptions = classData
    ?.map((c) => ({ name: `Class ${c.className}${c.section}`, id: c.id }))
    .flat();
  const { data: teacherSchedules } = useQuery({
    queryKey: ["teacherSchedules"],
    queryFn: async () =>
      (await axiosInstance.get("/admin/teacher/schedule-full")).data,
  });
  const subjectOptions = [...(subjects || []), { name: "Rest", id: 0 }];

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

  // Find subject ID by name
  const getSubjectIdByName = (subjectName: string): number => {
    if (subjectName === "Rest") return 0;
    const subject = subjects?.find((s) => s.name === subjectName);
    return subject?.id || 0;
  };

  // Find teacher ID by name
  const getTeacherIdByName = (teacherName: string): number => {
    const teacher = teachers?.find(
      (t) =>
        t.name === teacherName ||
        `${t.firstName} ${t.lastName}` === teacherName,
    );
    return teacher?.id || 0;
  };

  // Convert timetable to API payload
  const buildSchedulePayload = (): SchedulePayload[] => {
    const dayNames = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const payload: SchedulePayload[] = [];

    // Assuming we have classroom selection, using default for now
    const classroomId = selectedClass?.id;

    timetable.forEach((timeSlot) => {
      dayNames.forEach((day, dayIndex) => {
        const period = timeSlot.periods[dayIndex];

        // Skip Rest periods
        if (period.subject === "Rest") {
          return;
        }

        const subjectId =
          (period.subjectId as number) || getSubjectIdByName(period.subject);
        const teacherId = period.teacherId
          ? (period.teacherId as number)
          : getTeacherIdByName(period.teacher);

        if (subjectId === 0) {
          console.warn(`Subject not found: ${period.subject}`);
          return;
        }

        if (teacherId === 0 && period.teacher) {
          console.warn(`Teacher not found: ${period.teacher}`);
          return;
        }

        // Keep start and end times as local time strings (HH:mm format)
        const startTime = timeSlot.startTime; // "HH:mm"
        const endTime = timeSlot.endTime; // "HH:mm"

        payload.push({
          subjectId,
          classroomId,
          weekday: day,
          startTime,
          endTime,
          teacherId,
        });
      });
    });

    return payload;
  };

  // Mutation for saving timetable
  const saveScheduleMutation = useMutation({
    mutationFn: async (payload: SchedulePayload[]) => {
      const response = await axiosInstance.post(
        "/api/class/schedule/",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Timetable saved successfully!", {
        position: "bottom-right",
      });
    },
    onError: (error: AxiosError<Record<string, unknown>>) => {
      const errorMessage =
        (error.response?.data as Record<string, unknown>)?.message ||
        error.message ||
        "Failed to save timetable";
      toast.error(String(errorMessage), {
        position: "bottom-right",
      });
    },
  });

  const handleSave = () => {
    try {
      const payload = buildSchedulePayload();

      if (payload.length === 0) {
        toast.warning("No valid schedule entries to save", {
          position: "bottom-right",
        });
        return;
      }

      saveScheduleMutation.mutate(payload);
    } catch (error) {
      console.error("Error building schedule payload:", error);
      toast.error("Error preparing schedule for save", {
        position: "bottom-right",
      });
    }
  };

  const handleTimeChange = (
    index: number,
    type: "startTime" | "endTime",
    newTime: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[index][type] = newTime ? newTime.format("HH:mm") : "";
    setTimetable(updatedTimetable);
  };

  const handleSubjectChange = (
    rowIndex: number,
    colIndex: number,
    newSubject: string,
  ) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[rowIndex].periods[colIndex].subject = newSubject;
    setTimetable(updatedTimetable);
  };

  const handleTeacherChange = (
    rowIndex: number,
    colIndex: number,
    newTeacher: string,
  ) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[rowIndex].periods[colIndex].teacher = newTeacher;
    // Clear teacherId when teacher is manually changed to allow fresh lookup
    updatedTimetable[rowIndex].periods[colIndex].teacherId = Number(newTeacher);
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
    // ai.models.list().then((models) => {
    //   console.log("Available models:", models);
    // });

    return ai.chats.create({
      model: "gemini-2.5-flash-lite",
      config: {
        systemInstruction: `You are Skhool AI, a specialized assistant for generating school schedules.

        STRICT OUTPUT FORMAT RULES:
        1. Return ONLY valid JSON, no markdown, no explanation
        2. JSON structure must be:
        {
          "class": "string",
          "classId:"string",
          "schedule": [
            {
              "day": "string (Monday-Saturday)",
              "periods": [
                {
                  "timeSlot": {
                    "startTime": "HH:mm",
                    "endTime": "HH:mm"
                  },
                  "subject": "string (subject code from provided subject list only)",
                  "teacher":"string (teacher id with name from provided teacher list)",
                  "teacherId":"string (teacher idfrom provided teacher list)" ,
                  "subjectId":"string (subject id from provided subject list)"
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
        14. Use the teacher schedule to determine if the teacher is already occupied for that time
        15. If the teacher is already occupied do not overlap his class
        16. Nerver assign same classes to to same teacher in same time for 2 different classes.
        17. Analyze the  Previous Time slots before generating 

        `,
      },
    });
  };

  const validateAIResponse = (response) => {
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

      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const validSubjects = new Set([...subjects.map((s) => s.name), "Rest"]);
      // Validate schedule array
      if (parsedResponse.schedule.length !== 6) {
        throw new Error("Schedule must contain exactly 6 days");
      }

      // Validate each day's schedule
      parsedResponse.schedule.forEach((day) => {
        if (!day.day || !dayNames.includes(day.day)) {
          throw new Error(`Invalid day name: ${day.day}`);
        }

        if (
          day.day.toUpperCase() !== "SATURDAY" &&
          (!Array.isArray(day.periods) ||
            day.periods.length !== timeSlots.length)
        ) {
          throw new Error(`Invalid periods array for ${day.day}`);
        }

        // Validate each period
        day.periods.forEach((period, periodIndex) => {
          // Validate time slot
          const expectedTimeSlot = timeSlots[periodIndex];
          console.log(period);
          if (
            day.day.toUpperCase() !== "SATURDAY" &&
            (!period.timeSlot ||
              period.timeSlot.startTime !== expectedTimeSlot.startTime ||
              period.timeSlot.endTime !== expectedTimeSlot.endTime)
          ) {
            throw new Error(
              `Invalid time slot for ${day.day}, period ${periodIndex + 1}`,
            );
          }

          // Validate subject
          if (!validSubjects.has(period.subject)) {
            throw new Error(
              `Invalid subject "${period.subject}" for ${day.day}, period ${
                periodIndex + 1
              }`,
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

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const prompt = {
    constraints: {
      maximumConsecutivePeriods: 2,
      maximumPeriodsOfSubjectPerDay: 2,
      subjectsPerDay: {
        min: 3,
        max: 6,
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
        Previous Time slots for teachers: ${JSON.stringify(teacherSchedules)}
        Teacher list: ${JSON.stringify(teachers)}
        Teacher Schedules: ${JSON.stringify(teacherSchedules)}
        classData: ${JSON.stringify(classData)}
        weekdays: ${JSON.stringify(dayNames)}

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
        5. Higher frequency subjects should appear more frequently throughout the week
        6. Ensure even distribution of subjects across the week
        7. Consider teacher availability (no parallel classes of the same subject)
        8. Physical activities and lab work should preferably be in morning slots
        9. Maximum number of classes of same subject per day: ${prompt.constraints.maximumPeriodsOfSubjectPerDay}
        10. Saturday will have classes only till rest period.
        11.Analyze this ${JSON.stringify(teacherSchedules)} before generating schedule so that you dont assign parallel class to a teacher in different classes

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
          "class": "${selectedClass.name}",
          "classId":"${selectedClass.id}",
          "schedule": [
            {
              "day": "Monday",
              "periods": [Array of periods]
            },
            ... (for all 6 days)
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
            (subjectFrequency.get(period.subject) || 0) + 1,
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
        const periods = dayNames.map((dayName) => {
          const daySchedule = generatedSchedule.schedule.find(
            (day) => day.day === dayName,
          );
          const period = daySchedule.periods.find(
            (p) =>
              p.timeSlot.startTime === timeSlot.startTime &&
              p.timeSlot.endTime === timeSlot.endTime,
          );
          return {
            subject: period?.subject || "Rest",
            teacher: period?.teacher || "",
            teacherId: period?.teacherId || 0,
            subjectId: period?.subjectId || 0,
          };
        });

        return {
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          periods,
        };
      });
      console.log("Updated Timetable:", updatedTimetable);
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
        },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  console.log({ timetable });

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
            value={selectedClass?.id || ""}
            onChange={(e) =>
              setSelectedClass(
                classOptions.find((c) => c.id === Number(e.target.value)),
              )
            }
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            {classOptions.map((classOption) => (
              <option key={classOption.id} value={classOption.id}>
                {classOption.name}
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
                <th className="border border-gray-300 p-3">Saturday</th>
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
                  {row.periods.map((period, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-300 p-3 rounded-md ${
                        subjectColors[period.subject] || ""
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <select
                          value={period.subject}
                          onChange={(e) =>
                            handleSubjectChange(
                              rowIndex,
                              colIndex,
                              e.target.value,
                            )
                          }
                          className="border-none bg-transparent w-full font-semibold text-sm"
                        >
                          {subjectOptions.map((option) => (
                            <option key={option.id} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        {period.subject !== "Rest" && (
                          <select
                            value={period.teacherId}
                            onChange={(e) =>
                              handleTeacherChange(
                                rowIndex,
                                colIndex,
                                e.target.value,
                              )
                            }
                            className="border border-gray-400 bg-white text-xs rounded px-1 py-1 w-full"
                          >
                            <option value="">Select Teacher</option>
                            {teachers?.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {`${teacher.name}`}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
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
