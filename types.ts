
export interface BioInfo {
  name: string;
  profession: string;
  description: string;
  email: string;
  linkedin: string;
  location: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Interest {
  id: string;
  category: 'Movie' | 'Game' | 'Music' | 'Serie';
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum Section {
  Home = 'Home',
  About = 'About',
  Projects = 'Projects',
  Interests = 'Interests',
  Contact = 'Contact',
  Admin = 'Admin'
}
