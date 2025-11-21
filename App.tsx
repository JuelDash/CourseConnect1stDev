import React, { useState, useEffect } from 'react';
import { 
  User, 
  Course, 
  Announcement, 
  UserRole, 
  ViewState 
} from './types';
import { 
  MOCK_USERS, 
  INITIAL_COURSES, 
  INITIAL_ANNOUNCEMENTS 
} from './constants';
import { generateCourseSyllabus } from './services/geminiService';
import { Modal } from './components/Modal';
import { CourseCard } from './components/CourseCard';
import { AIChat } from './components/AIChat';

function App() {
  // --- State ---
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  
  // Modal States
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  
  // Add Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('CS');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseSchedule, setNewCourseSchedule] = useState('');
  const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);

  // Announcement Form State
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceMsg, setNewAnnounceMsg] = useState('');

  // --- Handlers ---

  const handleRegister = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId && c.enrolledIds.length < c.capacity && !c.enrolledIds.includes(currentUser.id)) {
        return { ...c, enrolledIds: [...c.enrolledIds, currentUser.id] };
      }
      return c;
    }));
  };

  const handleUnregister = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledIds: c.enrolledIds.filter(id => id !== currentUser.id) };
      }
      return c;
    }));
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };

  const handleGenerateSyllabus = async () => {
    if (!newCourseTitle) return;
    setIsGeneratingSyllabus(true);
    const generated = await generateCourseSyllabus(newCourseTitle, newCourseCategory);
    setNewCourseDesc(generated);
    setIsGeneratingSyllabus(false);
  };

  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: `c${Date.now()}`,
      title: newCourseTitle,
      code: newCourseCode,
      category: newCourseCategory as any,
      description: newCourseDesc,
      schedule: newCourseSchedule,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      capacity: 30,
      enrolledIds: [],
      image: `https://picsum.photos/400/200?random=${Date.now()}`
    };
    setCourses([...courses, newCourse]);
    setIsAddCourseOpen(false);
    // Reset form
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseDesc('');
    setNewCourseSchedule('');
  };

  const handleCreateAnnouncement = () => {
    const newAnn: Announcement = {
      id: `a${Date.now()}`,
      courseId: null,
      title: newAnnounceTitle,
      message: newAnnounceMsg,
      date: new Date().toISOString(),
      authorName: currentUser.name
    };
    setAnnouncements([newAnn, ...announcements]);
    setIsAnnouncementOpen(false);
    setNewAnnounceTitle('');
    setNewAnnounceMsg('');
  };

  // --- Derived Data ---
  const myCourses = courses.filter(c => 
    currentUser.role === UserRole.STUDENT 
      ? c.enrolledIds.includes(currentUser.id)
      : c.instructorId === currentUser.id
  );

  const displayedCourses = view === ViewState.MY_COURSES ? myCourses : courses;

  const canAddCourse = currentUser.role === UserRole.INSTRUCTOR || currentUser.role === UserRole.ADMIN;
  const canAnnounce = currentUser.role === UserRole.INSTRUCTOR || currentUser.role === UserRole.ADMIN;

  // --- Render ---

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 z-20">
        <div className="p-6 flex items-center justify-center border-b border-slate-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-indigo-200 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">CourseConnect</h1>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === ViewState.DASHBOARD ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.CATALOG)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === ViewState.CATALOG ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>All Courses</span>
          </button>

          <button 
            onClick={() => setView(ViewState.MY_COURSES)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === ViewState.MY_COURSES ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <span>{currentUser.role === UserRole.STUDENT ? 'My Schedule' : 'My Teaching'}</span>
          </button>

          <button 
            onClick={() => setView(ViewState.ANNOUNCEMENTS)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === ViewState.ANNOUNCEMENTS ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span>Announcements</span>
          </button>
        </nav>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Logged in as</p>
            <select 
              value={currentUser.id} 
              onChange={(e) => {
                const user = MOCK_USERS.find(u => u.id === e.target.value);
                if (user) setCurrentUser(user);
              }}
              className="w-full text-sm bg-white border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {MOCK_USERS.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center z-10">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">
               {view === ViewState.DASHBOARD && 'Dashboard'}
               {view === ViewState.CATALOG && 'Course Catalog'}
               {view === ViewState.MY_COURSES && (currentUser.role === UserRole.STUDENT ? 'My Schedule' : 'My Teaching')}
               {view === ViewState.ANNOUNCEMENTS && 'Announcements'}
             </h2>
             <p className="text-slate-500 text-sm">Welcome back, {currentUser.name}</p>
           </div>

           <div className="flex items-center space-x-4">
             {canAddCourse && (
               <button 
                onClick={() => setIsAddCourseOpen(true)}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
               >
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 New Course
               </button>
             )}
             {canAnnounce && view === ViewState.ANNOUNCEMENTS && (
                <button 
                onClick={() => setIsAnnouncementOpen(true)}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
               >
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                 Post Announcement
               </button>
             )}
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          {/* VIEW: ANNOUNCEMENTS */}
          {view === ViewState.ANNOUNCEMENTS && (
             <div className="space-y-4 max-w-3xl mx-auto">
               {announcements.length === 0 && (
                 <div className="text-center text-slate-400 py-10">No announcements yet.</div>
               )}
               {announcements.map(ann => (
                 <div key={ann.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-slate-800">{ann.title}</h3>
                     <span className="text-xs text-slate-400">{new Date(ann.date).toLocaleDateString()}</span>
                   </div>
                   <p className="text-slate-600 mb-4">{ann.message}</p>
                   <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">
                     Posted by {ann.authorName}
                   </div>
                 </div>
               ))}
             </div>
          )}

          {/* VIEW: DASHBOARD / CATALOG / MY_COURSES */}
          {view !== ViewState.ANNOUNCEMENTS && (
            <>
              {/* Quick Stats (Only on Dashboard) */}
              {view === ViewState.DASHBOARD && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
                    <h4 className="opacity-80 text-sm font-medium mb-1">Total Courses Available</h4>
                    <p className="text-3xl font-bold">{courses.length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">
                      {currentUser.role === UserRole.STUDENT ? 'Enrolled Courses' : 'Teaching Courses'}
                    </h4>
                    <p className="text-3xl font-bold text-slate-800">{myCourses.length}</p>
                  </div>
                   <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Latest Announcement</h4>
                    <p className="text-sm font-semibold text-slate-800 truncate">{announcements[0]?.title || "None"}</p>
                    <p className="text-xs text-slate-400 mt-1">Check announcements tab</p>
                  </div>
                </div>
              )}

              {/* Grid of Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    currentUser={currentUser}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onDelete={handleDeleteCourse}
                  />
                ))}
                {displayedCourses.length === 0 && (
                  <div className="col-span-full text-center py-20 text-slate-400">
                    No courses found in this view.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      
      {/* ADD COURSE MODAL */}
      <Modal 
        isOpen={isAddCourseOpen} 
        onClose={() => setIsAddCourseOpen(false)}
        title="Create New Course"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
              <input 
                value={newCourseCode}
                onChange={e => setNewCourseCode(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. CS101"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={newCourseCategory}
                onChange={e => setNewCourseCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="CS">Computer Science</option>
                <option value="MATH">Mathematics</option>
                <option value="ENG">Engineering</option>
                <option value="SCI">Science</option>
                <option value="ART">Arts</option>
              </select>
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
              <input 
                value={newCourseTitle}
                onChange={e => setNewCourseTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Intro to Python"
              />
          </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
              <input 
                value={newCourseSchedule}
                onChange={e => setNewCourseSchedule(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Mon/Wed 10 AM"
              />
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Description & Syllabus</label>
                <button 
                  onClick={handleGenerateSyllabus}
                  disabled={isGeneratingSyllabus || !newCourseTitle}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md hover:bg-indigo-200 transition-colors flex items-center disabled:opacity-50"
                >
                  {isGeneratingSyllabus ? (
                    <>
                      <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Auto-Generate with AI
                    </>
                  )}
                </button>
             </div>
              <textarea 
                value={newCourseDesc}
                onChange={e => setNewCourseDesc(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none h-40"
                placeholder="Course description..."
              />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleCreateCourse}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Course
            </button>
          </div>
        </div>
      </Modal>

       {/* POST ANNOUNCEMENT MODAL */}
      <Modal 
        isOpen={isAnnouncementOpen} 
        onClose={() => setIsAnnouncementOpen(false)}
        title="Post Announcement"
      >
         <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              value={newAnnounceTitle}
              onChange={e => setNewAnnounceTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Announcement Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea 
              value={newAnnounceMsg}
              onChange={e => setNewAnnounceMsg(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none h-32"
              placeholder="Type your message..."
            />
          </div>
          <div className="pt-4">
            <button 
              onClick={handleCreateAnnouncement}
              disabled={!newAnnounceTitle || !newAnnounceMsg}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
            >
              Post Announcement
            </button>
          </div>
         </div>
      </Modal>

      {/* Floating AI Chat Component */}
      <AIChat availableCourses={courses} />
    </div>
  );
}

export default App;