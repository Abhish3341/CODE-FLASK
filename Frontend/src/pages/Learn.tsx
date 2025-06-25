import React from 'react';
import { BookOpen, Star, Clock, Award, Code2 } from 'lucide-react';

const Learn = () => {
  const courses = [
    {
      id: 1,
      title: 'Data Structures Fundamentals',
      description: 'Learn essential data structures used in coding interviews',
      level: 'Beginner',
      duration: '6 hours',
      rating: 4.8,
      students: 1234,
    },
    {
      id: 2,
      title: 'Algorithm Techniques',
      description: 'Master common algorithmic patterns and techniques',
      level: 'Intermediate',
      duration: '8 hours',
      rating: 4.9,
      students: 987,
    },
    {
      id: 3,
      title: 'System Design',
      description: 'Learn how to design scalable systems',
      level: 'Advanced',
      duration: '10 hours',
      rating: 4.7,
      students: 756,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Learning Center</h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">Master coding concepts through structured courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card course-card">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-button-primary)]" />
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                    course.level === 'Beginner' ? 'bg-green-500/20 text-green-500' :
                    course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[var(--color-text-primary)]">{course.title}</h3>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4">{course.description}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--color-text-secondary)] mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                    {course.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    {course.students} students
                  </div>
                </div>
                <button className="button button-primary w-full text-sm sm:text-base">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="py-6 sm:py-8 border-t border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
              <span className="text-[var(--color-text-primary)] font-semibold">CodeFlask</span>
            </div>
            <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Learn;