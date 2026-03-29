export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  skillTags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeCommitment: string;
  details: {
    overview: string;
    learningOutcomes: string[];
    prerequisites: string[];
  };
  applicationQuestions: ApplicationQuestion[];
}

export interface ApplicationQuestion {
  id: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
  required: boolean;
}
