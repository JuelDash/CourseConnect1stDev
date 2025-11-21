export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  syllabus?: string;
  instructorId: string;
  instructorName: string;
  schedule: string; // e.g., "Mon/Wed 10:00 AM"
  capacity: number;
  enrolledIds: string[];
  category: 'CS' | 'MATH' | 'ENG' | 'SCI' | 'ART';
  image?: string;
}

export interface Announcement {
  id: string;
  courseId: string | null; // null for global
  title: string;
  message: string;
  date: string;
  authorName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CATALOG = 'CATALOG',
  MY_COURSES = 'MY_COURSES',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  MANAGE_COURSES = 'MANAGE_COURSES'
}