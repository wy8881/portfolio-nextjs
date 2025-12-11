import { TimelineItem } from '@/types/about';

export const timelineData: TimelineItem[] = [
  {
    id: 1,
    period: "2023 — 2024",
    title: "Master of Computer Science",
    organization: "University of Adelaide",
    location: "Adelaide",
    highlights: [
      "Focus on full-stack engineering, software development, and machine learning",
      "Built end-to-end full-stack applications using React, TypeScript, and Spring Boot",
      "Developed ML-driven experiments on medical imaging data (XV feature analysis)"
    ],
    type: "education"
  },
  {
    id: 2,
    period: "2024",
    title: "Research Intern",
    organization: "Australian Institute for Machine Learning (AIML)",
    location: "Adelaide",
    highlights: [
      "Worked on chest X-ray velocimetry (XV) for cystic fibrosis studies",
      "Performed feature engineering, model training, and evaluation",
      "Collaborated with clinical partners and produced research analyses"
    ],
    type: "work"
  },
  {
    id: 3,
    period: "2024",
    title: "Full-Stack Voting System",
    organization: "Personal Project",
    location: "",
    highlights: [
      "Built with React, Spring Boot, and MongoDB",
      "Implemented JWT authentication and role-based access control",
      "Deployed to Vercel (frontend) and Railway (backend)"
    ],
    type: "project"
  },
  {
    id: 4,
    period: "2025",
    title: "IT Support Intern",
    organization: "Bank of China",
    location: "Sydney",
    highlights: [
      "Troubleshooting, documentation, and user support",
      "Improved escalation workflows and created guides for recurring issues"
    ],
    type: "work"
  }

];

