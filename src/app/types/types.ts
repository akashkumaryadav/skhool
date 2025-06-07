
export interface User {
    name: string;
    avatarUrl?: string;
    role: string;
  }
  
  export interface ChartDataPoint {
    name: string;
    value: number;
  }
  
  export interface AnnouncementItem {
    id: string;
    title: string;
    date: string;
    summary: string;
  }
  
  export interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType; // For SVG components
    current?: boolean;
  }
  
  export enum AttendanceStatus {
    PRESENT = "Present",
    ABSENT = "Absent",
    LATE = "Late",
  }
  
  export interface StudentAttendance {
    id: string;
    name: string;
    status: AttendanceStatus;
  }
      