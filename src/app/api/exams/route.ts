import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - replace with actual database calls
const mockExams = [
  {
    id: "1",
    name: "Mathematics Mid-Term",
    description: "Mid-term examination for Mathematics",
    subject: "Mathematics",
    className: "10th",
    section: "A",
    totalMarks: 100,
    passingMarks: 35,
    examDate: "2024-09-15",
    duration: 180,
    examType: "Mid Term",
    status: "Scheduled",
    createdBy: "teacher1",
    createdAt: "2024-08-29T00:00:00Z",
    updatedAt: "2024-08-29T00:00:00Z",
  },
  {
    id: "2",
    name: "Science Unit Test",
    description: "Unit test for Physics chapter",
    subject: "Science",
    className: "10th",
    section: "B",
    totalMarks: 50,
    passingMarks: 18,
    examDate: "2024-09-10",
    duration: 90,
    examType: "Unit Test",
    status: "Completed",
    createdBy: "teacher2",
    createdAt: "2024-08-25T00:00:00Z",
    updatedAt: "2024-08-25T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch from database
    // const exams = await db.exam.findMany();
    
    return NextResponse.json(mockExams);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["name", "subject", "className", "totalMarks", "passingMarks", "examDate", "duration", "examType"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // In a real application, you would save to database
    const newExam = {
      id: Date.now().toString(),
      ...body,
      status: "Scheduled",
      createdBy: "current-user-id", // Get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // mockExams.push(newExam);

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}
