// app/resources/page.tsx
"use client";

import {
    ArrowDownTrayIcon,
    BookOpenIcon,
    ChevronUpDownIcon,
    CloudArrowUpIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    EyeIcon,
    FunnelIcon,
    LinkIcon,
    MagnifyingGlassIcon,
    MusicalNoteIcon,
    PencilIcon,
    PhotoIcon,
    QuestionMarkCircleIcon,
    TrashIcon,
    VideoCameraIcon
} from '@/app/components/icons';
import { LearningResource, ResourceType } from '@/app/types/types';
import React, { useMemo, useState } from 'react';

const MOCK_SUBJECTS_LIST = ['Maths', 'Science', 'English', 'History', 'Hindi', 'Geography', 'General'];
const MOCK_CLASSES_LIST = ['All', '6th', '7th', '8th', '9th', '10th'];

const mockResources: LearningResource[] = [
  {
    id: 'res1', key: 'res1', title: 'Algebra Basics PDF', description: 'Comprehensive guide to basic algebra concepts for beginners.',
    type: ResourceType.PDF, subject: 'Maths', classApplicable: ['7th', '8th'], uploadDate: '2023-10-15', uploaderName: 'Mrs. Sharma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/algebra/300/200', tags: ['algebra', 'maths', 'basics']
  },
  {
    id: 'res2', key: 'res2', title: 'Photosynthesis Explained (Video)', description: 'Engaging video lecture on the process of photosynthesis.',
    type: ResourceType.VIDEO, subject: 'Science', classApplicable: ['8th'], uploadDate: '2023-11-01', uploaderName: 'Mr. Verma',
    externalLink: 'https://www.youtube.com/watch?v=example', thumbnailUrl: 'https://picsum.photos/seed/sciencevideo/300/200', tags: ['biology', 'photosynthesis']
  },
  {
    id: 'res3', key: 'res3', title: 'Indian History Timeline', description: 'Interactive timeline of major events in Indian history.',
    type: ResourceType.LINK, subject: 'History', classApplicable: ['All'], uploadDate: '2023-09-20', uploaderName: 'Admin',
    externalLink: '#', thumbnailUrl: 'https://picsum.photos/seed/history/300/200', tags: ['history', 'timeline', 'india']
  },
  {
    id: 'res4', key: 'res4', title: 'Grammar Worksheet - Tenses', description: 'Practice worksheet for English grammar tenses.',
    type: ResourceType.WORKSHEET, subject: 'English', classApplicable: ['6th', '7th'], uploadDate: '2023-11-05', uploaderName: 'Mrs. Sharma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/grammar/300/200', tags: ['english', 'grammar', 'worksheet']
  },
  {
    id: 'res5', key: 'res5', title: 'Cell Structure Document', description: 'Detailed notes on animal and plant cell structures.',
    type: ResourceType.DOCUMENT, subject: 'Science', classApplicable: ['8th', '9th'], uploadDate: '2023-10-28', uploaderName: 'Mr. Verma',
    fileUrl: '#', tags: ['biology', 'cell', 'notes']
  },
  {
    id: 'res6', key: 'res6', title: 'Geometry Formulas Sheet', description: 'Quick reference sheet for common geometry formulas.',
    type: ResourceType.PDF, subject: 'Maths', classApplicable: ['9th', '10th'], uploadDate: '2023-11-10', uploaderName: 'Mrs. Sharma',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/geometry/300/200', tags: ['maths', 'geometry', 'formulas']
  },
  {
    id: 'res7', key: 'res7', title: 'World Map (High Res)', description: 'A high-resolution image of the world map.',
    type: ResourceType.IMAGE, subject: 'Geography', classApplicable: ['All'], uploadDate: '2023-10-01', uploaderName: 'Admin',
    fileUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/map/300/200', tags: ['map', 'world', 'geography']
  },
  {
    id: 'res8', key: 'res8', title: 'Audio Story: The Clever Fox', description: 'An engaging audio story for young learners.',
    type: ResourceType.AUDIO, subject: 'English', classApplicable: ['6th'], uploadDate: '2023-09-15', uploaderName: 'Mrs. Das',
    fileUrl: '#', tags: ['story', 'audio', 'english']
  }
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


const LearningResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('uploadDate_desc'); // e.g., 'title_asc', 'uploadDate_desc'
  const [isLoading, setIsLoading] = useState(false);

  const filteredAndSortedResources = useMemo(() => {
    setIsLoading(true);
    let resources = mockResources;

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
    if (selectedClass && selectedClass !== 'All') {
      resources = resources.filter(res => res.classApplicable.includes(selectedClass) || res.classApplicable.includes('All'));
    }

    const [sortField, sortOrder] = sortBy.split('_');
    resources.sort((a, b) => {
      let valA, valB;
      if (sortField === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortField === 'uploadDate') {
        valA = new Date(a.uploadDate).getTime();
        valB = new Date(b.uploadDate).getTime();
      } else { // default to title
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 300);
    return resources;
  }, [searchTerm, selectedType, selectedSubject, selectedClass, sortBy]);


  const resourceTypes = Object.values(ResourceType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Learning Resources</h1>
        <button 
          onClick={() => alert('Upload New Resource Clicked!')}
          className="flex items-center bg-skhool-blue-600 hover:bg-skhool-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-skhool-blue-500 focus:ring-opacity-75"
        >
          <CloudArrowUpIcon className="w-5 h-5 mr-2" />
          Upload New Resource
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 bg-white shadow rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2 lg:col-span-3">
             <label htmlFor="search-resource" className="sr-only">Search Resources</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-resource"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or tags..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select id="filter-type" value={selectedType} onChange={e => setSelectedType(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm">
              <option value="">All Types</option>
              {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select id="filter-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm">
              <option value="">All Subjects</option>
              {MOCK_SUBJECTS_LIST.map(subject => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select id="filter-class" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-skhool-blue-500 focus:border-skhool-blue-500 sm:text-sm">
              {MOCK_CLASSES_LIST.map(c => <option key={c} value={c}>{c === "All" ? "All Classes" : c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="relative">
              <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value)}
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

      {/* Resources Grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <FunnelIcon className="w-12 h-12 mx-auto text-gray-400 animate-pulse mb-2" />
          <p className="text-gray-500">Loading resources...</p>
        </div>
      ) : filteredAndSortedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedResources.map(res => (
            <div key={res.key} className="bg-white shadow-lg rounded-xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl group">
              {res.thumbnailUrl && (
                <img src={res.thumbnailUrl} alt={res.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
              )}
              {!res.thumbnailUrl && (
                 <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                   <BookOpenIcon className="w-16 h-16 text-gray-300" />
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
                  <p><strong>Class:</strong> {res.classApplicable.join(', ')}</p>
                  <p><strong>Uploaded:</strong> {new Date(res.uploadDate).toLocaleDateString()}</p>
                  <p><strong>By:</strong> {res.uploaderName}</p>
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
                  <button onClick={() => alert(`View/Download ${res.title}`)} className="text-skhool-blue-600 hover:text-skhool-blue-800 p-1.5 rounded-full hover:bg-skhool-blue-50 focus:outline-none focus:ring-2 focus:ring-skhool-blue-500" title="View/Download">
                    {res.type === ResourceType.LINK || res.type === ResourceType.VIDEO ? <EyeIcon className="w-5 h-5"/> : <ArrowDownTrayIcon className="w-5 h-5"/>}
                  </button>
                  <button onClick={() => alert(`Edit ${res.title}`)} className="text-skhool-orange-500 hover:text-skhool-orange-700 p-1.5 rounded-full hover:bg-skhool-orange-50 focus:outline-none focus:ring-2 focus:ring-skhool-orange-500" title="Edit Resource">
                    <PencilIcon className="w-5 h-5"/>
                  </button>
                  <button onClick={() => alert(`Delete ${res.title}`)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete Resource">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resources Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      {!isLoading && filteredAndSortedResources.length > 0 && (
         <p className="text-sm text-gray-500 text-center mt-4">Showing {filteredAndSortedResources.length} of {mockResources.length} total resources.</p>
      )}
    </div>
  );
};

export default LearningResourcesPage;