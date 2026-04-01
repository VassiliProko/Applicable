export interface ProjectMilestone {
  title: string;
  deadline?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
  companyName: string;
  category: string;
  skillTags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeCommitment: string;
  details: {
    overview: string;
    learningOutcomes: string[];
    prerequisites: string[];
  };
  applicationQuestions: ApplicationQuestion[];
  milestones?: ProjectMilestone[];
}

export interface ApplicationQuestion {
  id: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
  required: boolean;
}
