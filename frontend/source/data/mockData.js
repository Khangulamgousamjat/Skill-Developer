import { 
  BookOpen, Video, Briefcase, TrendingUp 
} from 'lucide-react';

export const internData = {
  name: "Alex Sharma",
  department: "IT Dept",
  role: "Software Engineering Intern"
};

export const skillGaps = [
  { id: 1, name: "React.js", current: 40, required: 80 },
  { id: 2, name: "Node.js", current: 20, required: 70 },
  { id: 3, name: "Database Design", current: 60, required: 75 },
  { id: 4, name: "Git & Version Control", current: 85, required: 80 }
];

export const upcomingLectures = [
  { id: 1, title: "How we built our company dashboard", Teacher: "Sarah Jenkins (Lead Frontend)", time: "Today, 3:00 PM" },
  { id: 2, title: "Real client project walkthrough", Teacher: "Raj Patel (Product Manager)", time: "Thursday, 11:00 AM" }
];

export const activeProjects = [
  { id: 1, title: "Build inventory system module", status: "In Progress", progress: 45 },
  { id: 2, title: "Analyze quarterly sales data", status: "Assigned", progress: 0 }
];

export const navItems = [
  { id: 'skills', label: 'Skill Dashboard', icon: BookOpen },
  { id: 'lectures', label: 'Live Lectures', icon: Video },
  { id: 'projects', label: 'Real-World Projects', icon: Briefcase },
  { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
];
