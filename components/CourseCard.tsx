import React from 'react';
import { Course, User, UserRole } from '../types';

interface CourseCardProps {
  course: Course;
  currentUser: User;
  onRegister?: (courseId: string) => void;
  onUnregister?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  currentUser,
  onRegister,
  onUnregister,
  onDelete
}) => {
  const isEnrolled = course.enrolledIds.includes(currentUser.id);
  const isFull = course.enrolledIds.length >= course.capacity;
  const canManage = currentUser.role === UserRole.ADMIN || (currentUser.role === UserRole.INSTRUCTOR && course.instructorId === currentUser.id);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{course.title}</h3>
            <p className="text-sm text-slate-500 font-medium">{course.code}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm text-slate-600 flex-grow">
           <p className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {course.instructorName}
          </p>
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {course.schedule}
          </p>
          <p className="flex items-center">
             <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {course.enrolledIds.length} / {course.capacity} Enrolled
          </p>
        </div>

        <p className="text-xs text-slate-500 line-clamp-3 mb-4 bg-slate-50 p-2 rounded">
            {course.description.split('---')[0]}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
          {currentUser.role === UserRole.STUDENT && (
            <>
              {isEnrolled ? (
                 <button
                  onClick={() => onUnregister?.(course.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Drop Course
                </button>
              ) : (
                <button
                  onClick={() => onRegister?.(course.id)}
                  disabled={isFull}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    isFull
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isFull ? 'Full' : 'Register'}
                </button>
              )}
            </>
          )}

          {canManage && (
            <button
              onClick={() => onDelete?.(course.id)}
              className="flex-1 bg-slate-100 text-slate-600 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Manage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};