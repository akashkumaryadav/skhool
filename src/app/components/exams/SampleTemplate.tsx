// Sample HTML template for student report generation
export const sampleStudentReportTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Report - {{exam.name}}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .school-logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .header p {
            margin: 5px 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
        }
        .info-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #343a40;
        }
        .exam-details {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #343a40;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
        }
        .exam-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .exam-card {
            padding: 15px;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            text-align: center;
        }
        .exam-card-value {
            font-size: 24px;
            font-weight: bold;
            color: #495057;
        }
        .exam-card-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            margin-top: 5px;
        }
        .performance-section {
            margin-bottom: 30px;
        }
        .performance-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        .performance-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
            transition: width 0.3s ease;
        }
        .performance-percentage {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
        }
        .grade-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .grade-a { background: #d4edda; color: #155724; }
        .grade-b { background: #d1ecf1; color: #0c5460; }
        .grade-c { background: #fff3cd; color: #856404; }
        .grade-d { background: #f8d7da; color: #721c24; }
        .grade-f { background: #f5c6cb; color: #721c24; }
        .remarks {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            border-radius: 0 6px 6px 0;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 12px;
        }
        .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }
        .signature-box {
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #343a40;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <div class="school-logo">S</div>
            <h1>Academic Performance Report</h1>
            <p>{{exam.name}} - {{exam.subject}}</p>
        </div>
        
        <div class="content">
            <!-- Student Information -->
            <div class="student-info">
                <div class="info-item">
                    <div class="info-label">Student Name</div>
                    <div class="info-value">{{student.firstName}} {{student.lastName}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Roll Number</div>
                    <div class="info-value">{{student.rollNumber}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Class</div>
                    <div class="info-value">{{exam.className}} {{exam.section}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Exam Date</div>
                    <div class="info-value">{{exam.examDate}}</div>
                </div>
            </div>

            <!-- Exam Details -->
            <div class="exam-details">
                <h2 class="section-title">Exam Information</h2>
                <div class="exam-grid">
                    <div class="exam-card">
                        <div class="exam-card-value">{{exam.totalMarks}}</div>
                        <div class="exam-card-label">Total Marks</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value">{{exam.passingMarks}}</div>
                        <div class="exam-card-label">Passing Marks</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value">{{exam.duration}}</div>
                        <div class="exam-card-label">Duration (min)</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value">{{exam.examType}}</div>
                        <div class="exam-card-label">Exam Type</div>
                    </div>
                </div>
            </div>

            <!-- Performance Section -->
            <div class="performance-section">
                <h2 class="section-title">Performance Analysis</h2>
                <div class="exam-grid">
                    <div class="exam-card">
                        <div class="exam-card-value">{{result.marksObtained}}</div>
                        <div class="exam-card-label">Marks Obtained</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value performance-percentage">{{result.percentage}}%</div>
                        <div class="exam-card-label">Percentage</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value">{{result.grade}}</div>
                        <div class="exam-card-label">Grade</div>
                    </div>
                    <div class="exam-card">
                        <div class="exam-card-value">{{result.rank}}</div>
                        <div class="exam-card-label">Class Rank</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span>Performance Score</span>
                        <span class="performance-percentage">{{result.percentage}}%</span>
                    </div>
                    <div class="performance-bar">
                        <div class="performance-fill" style="width: {{result.percentage}}%"></div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <span class="grade-badge grade-{{result.gradeClass}}">Grade: {{result.grade}}</span>
                </div>
            </div>

            <!-- Remarks Section -->
            <div class="remarks">
                <h3 style="margin-top: 0; color: #007bff;">Teacher's Remarks</h3>
                <p style="margin-bottom: 0;">{{result.remarks}}</p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line">Class Teacher</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">Principal</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">Parent/Guardian</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This is a computer-generated report. For any queries, please contact the school administration.</p>
            <p>Generated on: {{generatedDate}}</p>
        </div>
    </div>
</body>
</html>
`;

export const sampleTemplateVariables = [
    { key: "student.firstName", label: "Student First Name", type: "text", required: true },
    { key: "student.lastName", label: "Student Last Name", type: "text", required: true },
    { key: "student.rollNumber", label: "Roll Number", type: "text", required: true },
    { key: "exam.name", label: "Exam Name", type: "text", required: true },
    { key: "exam.subject", label: "Subject", type: "text", required: true },
    { key: "exam.className", label: "Class Name", type: "text", required: true },
    { key: "exam.section", label: "Section", type: "text", required: true },
    { key: "exam.examDate", label: "Exam Date", type: "date", required: true },
    { key: "exam.totalMarks", label: "Total Marks", type: "number", required: true },
    { key: "exam.passingMarks", label: "Passing Marks", type: "number", required: true },
    { key: "exam.duration", label: "Duration", type: "number", required: true },
    { key: "exam.examType", label: "Exam Type", type: "text", required: true },
    { key: "result.marksObtained", label: "Marks Obtained", type: "number", required: true },
    { key: "result.percentage", label: "Percentage", type: "number", required: true },
    { key: "result.grade", label: "Grade", type: "text", required: true },
    { key: "result.gradeClass", label: "Grade Class (for styling)", type: "text", required: false, defaultValue: "a" },
    { key: "result.rank", label: "Class Rank", type: "number", required: false },
    { key: "result.remarks", label: "Teacher's Remarks", type: "text", required: false, defaultValue: "Good performance. Keep up the excellent work!" },
    { key: "generatedDate", label: "Generated Date", type: "date", required: true }
];
