
import React from 'react';
import { AnnouncementItem } from '@/app/types/types'; 

const announcements: AnnouncementItem[] = [
  { id: '1', title: 'Annual Sports Day Postponed', date: 'Oct 26, 2023', summary: 'Due to weather conditions, the Annual Sports Day has been postponed to next Friday.' },
  { id: '2', title: 'Parent-Teacher Meeting Schedule', date: 'Oct 24, 2023', summary: 'The PTM for classes 6-8 will be held on Nov 4th. Check school portal for slots.' },
  { id: '3', title: 'Diwali Vacation होमवर्क', date: 'Oct 22, 2023', summary: 'Holiday homework has been uploaded to the student portal. Happy Diwali!' },
];

const Announcements: React.FC = () => {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2"> {/* Added max-height and scroll */}
      {announcements.length > 0 ? (
        announcements.map((item) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-800">{item.title}</h4>
            <p className="text-xs text-gray-500 mb-1">{item.date}</p>
            <p className="text-sm text-gray-600">{item.summary}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recent announcements.</p>
      )}
    </div>
  );
};

export default Announcements;
    