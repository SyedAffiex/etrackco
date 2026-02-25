
export enum ActivityType {
  UNIFORM = 'Badan Beruniform',
  CLUB = 'Kelab & Persatuan',
  SPORT = 'Sukan & Permainan'
}

export enum RecordStatus {
  DRAFT = 'Draf',
  SUBMITTED = 'Dihantar',
  VERIFIED = 'Disahkan'
}

export interface Student {
  id: string;
  name: string;
  class: string;
}

export interface AdvisorAttendance {
  name: string;
  isPresent: boolean;
  reason?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  advisorHead?: string;
  advisors: string[]; // List of all advisors including head
  location?: string;
}

export interface AttendanceRecord {
  id: string;
  activityId: string;
  activityType: ActivityType;
  date: string;
  topic: string;
  absenteeIds: string[]; // List of IDs of students who are ABSENT
  advisorAttendance: AdvisorAttendance[]; // Presence record for teachers
  status: RecordStatus;
  createdAt: string;
  teacherName: string;
  location?: string;
  advisorHead?: string;
}

export type AppRole = 'GURU' | 'SU';

export type NavPage = 
  | 'RECORD_ATTENDANCE' 
  | 'VIEW_REPORTS' 
  | 'DASHBOARD'
  | 'MAINTENANCE' 
  | 'SECRETARY_REPORTS'
  | 'STUDENT_RECORDS';
