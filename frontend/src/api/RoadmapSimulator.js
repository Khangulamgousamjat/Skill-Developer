/**
 * Strategic Roadmap Generation Simulation
 * This provides structured JSON roadmaps for various technology tracks.
 */

const ROADMAPS = {
  'React': [
    { step: 1, title: 'Tactical Foundations: Hooks & JSX', status: 'Active' },
    { step: 2, title: 'State Management Synthesis (Redux/Zustand)', status: 'Pending' },
    { step: 3, title: 'Protocol Integration with React Query', status: 'Pending' },
    { step: 4, title: 'Architectural Performance Optimization', status: 'Pending' }
  ],
  'Node.js': [
    { step: 1, title: 'Server-Side Core: Event Loop & Streams', status: 'Active' },
    { step: 2, title: 'Database Connectivity (SQL/NoSQL)', status: 'Pending' },
    { step: 3, title: 'JWT Authentication & Security Proxies', status: 'Pending' },
    { step: 4, title: 'Microservices & Tactical Scaling', status: 'Pending' }
  ],
  'Python': [
    { step: 1, title: 'Operational Core: Data Structures', status: 'Active' },
    { step: 2, title: 'Scientific Computing with NumPy/Pandas', status: 'Pending' },
    { step: 3, title: 'AI Integration & Model Synthesis', status: 'Pending' },
    { step: 4, title: 'Backend Development (FastAPI/Django)', status: 'Pending' }
  ],
  'Cybersecurity': [
    { step: 1, title: 'Network Reconnaissance & Protocol Analysis', status: 'Active' },
    { step: 2, title: 'Vulnerability Synthesis & Exploitation', status: 'Pending' },
    { step: 3, title: 'Incident Response Coordination', status: 'Pending' },
    { step: 4, title: 'Compliance & Tactical Auditing', status: 'Pending' }
  ],
  'DEFAULT': [
    { step: 1, title: 'Initial Skillset Acquisition', status: 'Active' },
    { step: 2, title: 'Intermediate Phase: Project Building', status: 'Pending' },
    { step: 3, title: 'Advanced Concepts Synthesis', status: 'Pending' },
    { step: 4, title: 'Production-Level Mastery', status: 'Pending' }
  ]
};

export const generateRoadmapData = (topic) => {
  return ROADMAPS[topic] || ROADMAPS['DEFAULT'];
};
