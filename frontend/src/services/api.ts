import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_gig_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Initial Gigs for immediate rich experience
export const INITIAL_GIGS = [
  {
    id: 'gig-1',
    title: 'Full-Stack MERN & Next.js Web Application Development',
    description: 'Clean modular code with REST APIs, authentication, MongoDB/PostgreSQL database, and responsive modern UI.',
    price: 4500,
    deliveryTime: 3,
    status: 'APPROVED',
    rating: 4.9,
    reviewsCount: 28,
    category: 'Development',
    tasker: {
      id: 'tasker-1',
      fullName: 'Hamza Malik',
      email: 'hamza.malik@ucp.edu.pk',
      department: 'Computer Science',
      semester: 7,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
  {
    id: 'gig-2',
    title: 'UI/UX Design in Figma: Mobile App & Web Dashboard',
    description: 'Interactive high-fidelity prototypes, design system with reusable components, wireframes, and developer handoff.',
    price: 3200,
    deliveryTime: 2,
    status: 'APPROVED',
    rating: 5.0,
    reviewsCount: 19,
    category: 'Design',
    tasker: {
      id: 'tasker-2',
      fullName: 'Ayesha Khan',
      email: 'ayesha.khan@ucp.edu.pk',
      department: 'Software Engineering',
      semester: 6,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
  {
    id: 'gig-3',
    title: 'Python Machine Learning, Data Analysis & Pandas Scripting',
    description: 'Jupyter notebooks, data cleaning, exploratory analysis, classification/regression models, and Matplotlib visuals.',
    price: 4000,
    deliveryTime: 2,
    status: 'APPROVED',
    rating: 4.8,
    reviewsCount: 14,
    category: 'AI & Data',
    tasker: {
      id: 'tasker-3',
      fullName: 'Bilal Tariq',
      email: 'bilal.tariq@ucp.edu.pk',
      department: 'Data Science',
      semester: 8,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
  {
    id: 'gig-4',
    title: 'Academic Report, Thesis Formatting & Technical Writing',
    description: 'IEEE & APA style formatting, LaTeX document composition, plagiarism check preparation, and literature reviews.',
    price: 2000,
    deliveryTime: 1,
    status: 'APPROVED',
    rating: 5.0,
    reviewsCount: 32,
    category: 'Writing',
    tasker: {
      id: 'tasker-4',
      fullName: 'Zainab Noor',
      email: 'zainab.noor@ucp.edu.pk',
      department: 'Business Administration',
      semester: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
  {
    id: 'gig-5',
    title: 'C++ & Data Structures (DSA) Assignment Consultation & Tutoring',
    description: 'Trees, Graphs, Pointers, Linked Lists, Big-O algorithm analysis with step-by-step logic explanation.',
    price: 2500,
    deliveryTime: 1,
    status: 'APPROVED',
    rating: 4.9,
    reviewsCount: 41,
    category: 'Tutoring',
    tasker: {
      id: 'tasker-5',
      fullName: 'Ali Raza',
      email: 'ali.raza@ucp.edu.pk',
      department: 'Computer Science',
      semester: 6,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
  {
    id: 'gig-6',
    title: 'Short Form Video Editing for TikTok, Reels & Presentations',
    description: 'Dynamic captions, sound design, color grading, motion graphics, and 1080p/4k final export ready for social upload.',
    price: 2800,
    deliveryTime: 2,
    status: 'APPROVED',
    rating: 4.7,
    reviewsCount: 16,
    category: 'Video & Media',
    tasker: {
      id: 'tasker-6',
      fullName: 'Mustafa Ahmed',
      email: 'mustafa.ahmed@ucp.edu.pk',
      department: 'Media & Communications',
      semester: 4,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
    },
  },
];
