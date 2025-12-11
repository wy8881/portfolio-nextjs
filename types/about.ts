export interface SkillCategory {
  id: number;
  title: string;
  skills: string[];
}

export interface TimelineItem {
  id: number;
  period: string;
  title: string;
  organization: string;
  location?: string;
  highlights: string[];
  type: 'work' | 'education' | 'project';
}

