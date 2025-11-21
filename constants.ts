import { Course, User, UserRole, Announcement } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Student', role: UserRole.STUDENT, email: 'alice@uni.edu' },
  { id: 'u2', name: 'Bob Student', role: UserRole.STUDENT, email: 'bob@uni.edu' },
  { id: 'u3', name: 'Dr. Smith', role: UserRole.INSTRUCTOR, email: 'smith@uni.edu' },
  { id: 'u4', name: 'Prof. Johnson', role: UserRole.INSTRUCTOR, email: 'johnson@uni.edu' },
  { id: 'u5', name: 'Admin User', role: UserRole.ADMIN, email: 'admin@uni.edu' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'CS101',
    title: 'Introduction to Python',
    description: 'A comprehensive dive into Python programming fundamentals, data structures, and algorithms.',
    instructorId: 'u3',
    instructorName: 'Dr. Smith',
    schedule: 'Mon/Wed 10:00 AM',
    capacity: 30,
    enrolledIds: ['u2'],
    category: 'CS',
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 'c2',
    code: 'CS202',
    title: 'Java for Enterprise',
    description: 'Advanced Java concepts focusing on Spring Boot and enterprise application architecture.',
    instructorId: 'u4',
    instructorName: 'Prof. Johnson',
    schedule: 'Tue/Thu 02:00 PM',
    capacity: 25,
    enrolledIds: [],
    category: 'CS',
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 'c3',
    code: 'MATH101',
    title: 'Calculus I',
    description: 'Limits, derivatives, and integrals. The foundation of modern mathematics.',
    instructorId: 'u3',
    instructorName: 'Dr. Smith',
    schedule: 'Fri 09:00 AM',
    capacity: 50,
    enrolledIds: ['u1'],
    category: 'MATH',
    image: 'https://picsum.photos/400/200?random=3'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    courseId: null,
    title: 'Welcome to Fall Semester',
    message: 'Registration is now open for all students. Please check your schedule.',
    date: new Date().toISOString(),
    authorName: 'Admin User'
  },
  {
    id: 'a2',
    courseId: 'c1',
    title: 'Python Setup',
    message: 'Please ensure you have Python 3.10 installed before the first class.',
    date: new Date().toISOString(),
    authorName: 'Dr. Smith'
  }
];