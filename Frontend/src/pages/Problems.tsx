import React from 'react';
import { BookOpen, Star, Clock, Award } from 'lucide-react';

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
    <div className="h-full p-8 bg-[var(--color-bg-primary)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Learning Center</h1>
        <p className="text-[var(--color-text-secondary)]">Master coding concepts through structured courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-indigo-500" />
                <span className={`px-3 py-1 rounded-full text-sm ${
                  course.level === 'Beginner' ? 'bg-green-500/20 text-green-500' :
                  course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {course.level}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{course.title}</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {course.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {course.students} students
                </div>
              </div>
              <button className="button button-primary w-full">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;