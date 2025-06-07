
import React from 'react';
import { BookOpenIcon } from '@/app/components/icons';

const resources = [
  { name: 'Class 8 Maths Notes', type: 'PDF', link: '#' },
  { name: 'Science Video Lectures', type: 'Videos', link: '#' },
  { name: 'Interactive Quizzes', type: 'Platform', link: '#' },
];

const LearningResourcesLink: React.FC = () => {
  return (
    <div className="space-y-3">
      {resources.map(resource => (
        <a 
          key={resource.name}
          href={resource.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-all"
        >
          <div>
            <p className="font-medium text-teal-700">{resource.name}</p>
            <p className="text-xs text-teal-500">{resource.type}</p>
          </div>
          <BookOpenIcon className="w-5 h-5 text-teal-600" />
        </a>
      ))}
      <button
          type="button"
          className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
        >
          Explore All Resources
        </button>
    </div>
  );
};

export default LearningResourcesLink;
    