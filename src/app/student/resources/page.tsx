// app/student/resources/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { LearningResource, ResourceType } from '../../types/types';
import { 
  MagnifyingGlassIcon, EyeIcon, DocumentTextIcon, VideoCameraIcon, 
  LinkIcon, FunnelIcon, ChevronUpDownIcon, BookOpenIcon,
  DocumentDuplicateIcon, PhotoIcon, MusicalNoteIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon, PencilIcon
} from '../../constants';

// Mock Data - Same as teacher's, but filtering will be student-centric
const MOCK_SUBJECTS_LIST = ['Maths', 'Science', 'English', 'History', 'Hindi', 'Geography', 'General'];
// const MOCK_CLASSES_LIST = ['All', '6th', '7th', '8th', '9th', '10th']; // Student might only see their class

const mockResources: LearningResource[] = [
  {
    id: 'res1', key: 'res1', title: 'Algebra Basics PDF - Class 7', description: 'Comprehensive guide to basic algebra concepts.',
    type: ResourceType.PDF, subject: 'Maths', classApplicable: ['7th'], uploadDate: '2023-10-15', uploaderName: 'Mrs. Sharma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/algebra7/300/200', tags: ['algebra', 'maths', 'basics', 'class7']
  },
  {
    id: 'res2', key: 'res2', title: 'Photosynthesis Explained (Video) - Class 7', description: 'Engaging video lecture on photosynthesis.',
    type: ResourceType.VIDEO, subject: 'Science', classApplicable: ['7th'], uploadDate: '2023-11-01', uploaderName: 'Mr. Verma',
    externalLink: 'https://www.youtube.com/watch?v=example', thumbnailUrl: 'https://picsum.photos/seed/sciencevideo7/300/200', tags: ['biology', 'photosynthesis', 'class7']
  },
  {
    id: 'res3', key: 'res3', title: 'Indian History Timeline - General', description: 'Interactive timeline of major events in Indian history.',
    type: ResourceType.LINK, subject: 'History', classApplicable: ['All'], uploadDate: '2023-09-20', uploaderName: 'Admin',
    externalLink: '#', thumbnailUrl: 'https://picsum.photos/seed/historyall/300/200', tags: ['history', 'timeline', 'india']
  },
   {
    id: 'res4', key: 'res4', title: 'Grammar Worksheet - Tenses - Class 7', description: 'Practice worksheet for English grammar tenses.',
    type: ResourceType.WORKSHEET, subject: 'English', classApplicable: ['7th'], uploadDate: '2023-11-05', uploaderName: 'Mrs. Sharma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/grammar7/300/200', tags: ['english', 'grammar', 'worksheet', 'class7']
  },
  // Add a resource not applicable to class 7 to test filtering
   {
    id: 'res9', key: 'res9', title: 'Advanced Physics Problems - Class 10', description: 'Challenging problems for Class 10 Physics.',
    type: ResourceType.PDF, subject: 'Science', classApplicable: ['10th'], uploadDate: '2023-11-12', uploaderName: 'Mr. Verma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/physics10/300/200', tags: ['physics', 'advanced', 'class10']
  },
];

const getResourceTypeIcon = (type: ResourceType) => {
  switch (type) {
    case ResourceType.PDF: return <DocumentTextIcon className="w-6 h-6 text-red-500" />;
    case ResourceType.VIDEO: return <VideoCameraIcon className="w-6 h-6 text-blue-500" />;
    case ResourceType.LINK: return <LinkIcon className="w-6 h-6 text-green-500" />;
    case ResourceType.DOCUMENT: return <DocumentDuplicateIcon className="w-6 h-6 text-purple-500" />;
    case ResourceType.WORKSHEET: return <PencilIcon className="w-6 h-6 text-orange-500" />; 
    case ResourceType.IMAGE: return <PhotoIcon className="w-6 h-6 text-indigo-500" />;
    case ResourceType.AUDIO: return <MusicalNoteIcon className="w-6 h-6 text-pink-500" />;
    default: return <QuestionMarkCircleIcon className="w-6 h-6 text-gray-500" />;
  }
};


const StudentLearningResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('uploadDate_desc');
  const [isLoading, setIsLoading] = useState(false);

  // Student's class for filtering - using a mock class since auth is removed.
  const mockStudentClass = '7th'; 

  const filteredAndSortedResources = useMemo(() => {
    setIsLoading(true);
    let resources = mockResources.filter(res => 
      res.classApplicable.includes(mockStudentClass) || res.classApplicable.includes('All')
    );

    if (searchTerm) {
      resources = resources.filter(res => 
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    if (selectedType) {
      resources = resources.filter(res => res.type === selectedType);
    }
    if (selectedSubject) {
      resources = resources.filter(res => res.subject === selectedSubject);
    }

    const [sortField, sortOrder] = sortBy.split('_');
    resources.sort((a, b) => {
      let compareValueA: string | number;
      let compareValueB: string | number;

      if (sortField === 'title') {
        compareValueA = a.title.toLowerCase();
        compareValueB = b.title.toLowerCase();
      } else if (sortField === 'uploadDate') {
        compareValueA = new Date(a.uploadDate).getTime();
        compareValueB = new Date(b.uploadDate).getTime();
      } else {
        const valA = a[sortField as keyof LearningResource];
        const valB = b[sortField as keyof LearningResource];
        compareValueA = typeof valA === 'string' ? valA.toLowerCase() : (typeof valA === 'number' ? valA : String(valA ?? '').toLowerCase());
        compareValueB = typeof valB === 'string' ? valB.toLowerCase() : (typeof valB === 'number' ? valB : String(valB ?? '').toLowerCase());
      }
      
      if (compareValueA < compareValueB) return sortOrder === 'asc' ? -1 : 1;
      if (compareValueA > compareValueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setTimeout(() => setIsLoading(false), 300);
    return resources;
  }, [searchTerm, selectedType, selectedSubject, sortBy, mockStudentClass]);

  const resourceTypes = Object.values(ResourceType);
  const availableSubjects = Array.from(new Set(filteredAndSortedResources.map(r => r.subject))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpenIcon className="w-10 h-10 text-skhool-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Learning Resources for {mockStudentClass}</h1>
      </div>

      <div className="p-4 bg-white shadow rounded-lg space-y-4">
        <div className="relative">
            <label htmlFor="search-student-resource" className="sr-only">Search Resources</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-student-resource"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources by title, description, or tags..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="filter-student-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id="filter-student-type" value={selectedType} onChange={e => setSelectedType(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm">
              <option value="">All Types</option>
              {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-student-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select id="filter-student-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm">
              <option value="">All Subjects</option>
              {availableSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort-student-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="relative">
              <select id="sort-student-by" value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="appearance-none block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm pr-8">
                <option value="uploadDate_desc">Upload Date (Newest)</option>
                <option value="uploadDate_asc">Upload Date (Oldest)</option>
                <option value="title_asc">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
              </select>
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <FunnelIcon className="w-12 h-12 mx-auto text-gray-400 animate-pulse mb-2" />
          <p className="text-gray-500">Loading resources...</p>
        </div>
      ) : filteredAndSortedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResources.map(res => (
            <div key={res.key} className="bg-white shadow-lg rounded-xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl group">
              {res.thumbnailUrl && (
                <img src={res.thumbnailUrl} alt={res.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
              )}
               {!res.thumbnailUrl && (
                 <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                   {getResourceTypeIcon(res.type)}
                 </div>
              )}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center mb-2">
                  {getResourceTypeIcon(res.type)}
                  <span className="ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{res.type}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-skhool-blue-600 transition-colors">{res.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">{res.description.substring(0,100)}{res.description.length > 100 ? '...' : ''}</p>
                
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p><strong>Subject:</strong> {res.subject}</p>
                  <p><strong>Uploaded:</strong> {new Date(res.uploadDate).toLocaleDateString()}</p>
                </div>
                {res.tags && res.tags.length > 0 && (
                  <div className="mb-3">
                    {res.tags.slice(0,3).map(tag => (
                      <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 mr-1 mb-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-auto pt-3 border-t border-gray-200 flex justify-end space-x-2">
                  <a 
                    href={res.fileUrl || res.externalLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => alert(`Accessing ${res.title}`)} // Placeholder for actual navigation or download trigger
                    className="flex items-center text-skhool-blue-600 hover:text-skhool-blue-800 p-1.5 rounded-full hover:bg-skhool-blue-50 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500" title="Access Resource"
                  >
                    {res.type === ResourceType.LINK || res.type === ResourceType.VIDEO ? <EyeIcon className="w-5 h-5"/> : <ArrowDownTrayIcon className="w-5 h-5"/>}
                    <span className="ml-1 text-xs">Access</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resources Found</h3>
          <p className="text-gray-500">There are no learning materials matching your current class or filters.</p>
        </div>
      )}
    </div>
  );
};

export default StudentLearningResourcesPage;