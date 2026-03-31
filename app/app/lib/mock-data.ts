import { Project } from "./types";

function logo(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export const projects: Project[] = [
  {
    id: "accessible-component-lib",
    title: "Accessible Component Library",
    companyName: "Stripe",
    logoUrl: logo("stripe.com"),
    tagline: "Build reusable UI components that work for everyone.",
    description:
      "Design and develop a small library of accessible React components following WAI-ARIA guidelines.",
    category: "Engineering",
    skillTags: ["React", "TypeScript", "Accessibility", "CSS"],
    difficulty: "Intermediate",
    timeCommitment: "15–20 hours",
    details: {
      overview:
        "Create a set of 5–8 reusable React components (Button, Modal, Dropdown, Tabs, Toast, Tooltip) that meet WCAG 2.1 AA standards. Each component must support keyboard navigation, screen readers, and high-contrast mode. Write documentation with usage examples.",
      learningOutcomes: [
        "Apply WAI-ARIA roles, states, and properties correctly",
        "Implement keyboard navigation patterns for common widgets",
        "Write unit and integration tests for accessibility compliance",
        "Document component APIs with live examples",
      ],
      prerequisites: [
        "Comfortable with React and TypeScript",
        "Basic understanding of HTML semantics",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder:
          "Tell us what draws you to accessibility work...",
        required: true,
      },
      {
        id: "experience",
        label: "What relevant experience do you have?",
        type: "textarea",
        placeholder:
          "Any previous work with component libraries, accessibility, or design systems...",
        required: true,
      },
      {
        id: "learning",
        label: "What do you hope to learn?",
        type: "textarea",
        placeholder: "Skills or knowledge you want to gain...",
        required: false,
      },
    ],
  },
  {
    id: "public-data-insights",
    title: "Public Data Insights Dashboard",
    companyName: "Datadog",
    logoUrl: logo("datadoghq.com"),
    tagline: "Turn raw open data into actionable visual stories.",
    description:
      "Analyse a public dataset and produce an interactive dashboard that surfaces meaningful insights.",
    category: "Data & Analytics",
    skillTags: ["Python", "Pandas", "Data Viz", "SQL"],
    difficulty: "Beginner",
    timeCommitment: "10–15 hours",
    details: {
      overview:
        "Pick a dataset from a public repository (e.g. city open data, World Bank, Kaggle). Clean and transform the data, perform exploratory analysis, and build an interactive dashboard that tells a compelling story. Deliver a write-up explaining your methodology and key findings.",
      learningOutcomes: [
        "Clean and transform messy real-world datasets",
        "Identify and communicate meaningful patterns in data",
        "Build interactive visualisations with a charting library",
        "Write a clear analytical narrative for a non-technical audience",
      ],
      prerequisites: [
        "Basic Python or SQL knowledge",
        "Familiarity with spreadsheets or notebooks",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What excites you about working with data...",
        required: true,
      },
      {
        id: "dataset-idea",
        label: "Do you have a dataset or topic in mind?",
        type: "textarea",
        placeholder:
          "Any public dataset you find interesting, or a question you want to answer with data...",
        required: false,
      },
    ],
  },
  {
    id: "onboarding-redesign",
    title: "Product Onboarding Redesign",
    companyName: "Figma",
    logoUrl: logo("figma.com"),
    tagline: "Reimagine how new users experience a product.",
    description:
      "Research, prototype, and test a redesigned onboarding flow for an existing product.",
    category: "Design",
    skillTags: ["UX Research", "Figma", "Prototyping", "User Testing"],
    difficulty: "Intermediate",
    timeCommitment: "12–18 hours",
    details: {
      overview:
        "Choose a real product with a sub-optimal onboarding experience. Conduct competitive analysis and user interviews, create user journey maps, design wireframes and high-fidelity prototypes in Figma, and validate with usability tests. Deliver a case study documenting your process and outcomes.",
      learningOutcomes: [
        "Conduct user research interviews and synthesise findings",
        "Map user journeys and identify friction points",
        "Design and iterate on prototypes using Figma",
        "Plan and run moderated usability tests",
      ],
      prerequisites: [
        "Basic familiarity with Figma or similar design tool",
        "Interest in user-centred design",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What draws you to UX design and research...",
        required: true,
      },
      {
        id: "product-idea",
        label: "Which product would you like to redesign?",
        type: "text",
        placeholder: "Name of an app or product with a weak onboarding flow...",
        required: true,
      },
      {
        id: "approach",
        label: "How would you approach user research for this?",
        type: "textarea",
        placeholder: "Your initial thoughts on methodology...",
        required: false,
      },
    ],
  },
  {
    id: "rest-api-bookstore",
    title: "Bookstore REST API",
    companyName: "Shopify",
    logoUrl: logo("shopify.com"),
    tagline: "Design a clean API that powers a digital bookshop.",
    description:
      "Build a fully documented RESTful API for a bookstore with auth, CRUD, and search.",
    category: "Engineering",
    skillTags: ["Node.js", "Express", "PostgreSQL", "REST"],
    difficulty: "Intermediate",
    timeCommitment: "15–20 hours",
    details: {
      overview:
        "Design and implement a REST API for a bookstore application. Endpoints should cover books, authors, categories, and user reviews. Include JWT authentication, input validation, pagination, filtering, and full-text search. Write API docs using OpenAPI/Swagger and include a Postman collection.",
      learningOutcomes: [
        "Design RESTful endpoints following best practices",
        "Implement authentication and authorisation with JWT",
        "Write efficient database queries with an ORM",
        "Document APIs with OpenAPI specification",
      ],
      prerequisites: [
        "Comfortable with JavaScript or TypeScript",
        "Basic understanding of HTTP and databases",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What interests you about backend development...",
        required: true,
      },
      {
        id: "experience",
        label: "What backend experience do you have?",
        type: "textarea",
        placeholder:
          "Previous API work, database experience, or relevant projects...",
        required: true,
      },
    ],
  },
  {
    id: "habit-tracker-mobile",
    title: "Habit Tracker Mobile App",
    companyName: "Headspace",
    logoUrl: logo("headspace.com"),
    tagline: "Help people build better habits, one day at a time.",
    description:
      "Design and build a cross-platform mobile app for tracking daily habits with streaks and reminders.",
    category: "Mobile",
    skillTags: ["React Native", "Mobile", "UI Design", "State Management"],
    difficulty: "Advanced",
    timeCommitment: "20–30 hours",
    details: {
      overview:
        "Build a cross-platform mobile app using React Native that lets users create habits, log daily completions, view streaks, and receive push-notification reminders. Focus on a delightful UI with smooth animations and offline support. Deliver a working prototype for iOS and Android.",
      learningOutcomes: [
        "Build cross-platform UIs with React Native",
        "Implement local notifications and background scheduling",
        "Manage complex state with persistent offline storage",
        "Design fluid micro-interactions and animations",
      ],
      prerequisites: [
        "Solid React experience",
        "Familiarity with mobile development concepts",
        "Comfortable with state management patterns",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What excites you about mobile development...",
        required: true,
      },
      {
        id: "experience",
        label: "Describe your mobile development experience.",
        type: "textarea",
        placeholder:
          "React Native, Flutter, Swift, Kotlin — anything relevant...",
        required: true,
      },
      {
        id: "design-approach",
        label: "How would you approach the habit UI/UX?",
        type: "textarea",
        placeholder:
          "Any ideas for making habit tracking engaging and delightful...",
        required: false,
      },
    ],
  },
  {
    id: "containerize-deploy",
    title: "Containerize & Deploy a Web App",
    companyName: "Vercel",
    logoUrl: logo("vercel.com"),
    tagline: "Take an app from localhost to the cloud.",
    description:
      "Dockerize an existing web application and set up a CI/CD pipeline for automated deployment.",
    category: "DevOps",
    skillTags: ["Docker", "CI/CD", "GitHub Actions", "Cloud"],
    difficulty: "Intermediate",
    timeCommitment: "10–15 hours",
    details: {
      overview:
        "Take a provided sample web application and containerize it with Docker. Write a multi-stage Dockerfile, set up Docker Compose for local development, configure a GitHub Actions CI/CD pipeline for automated testing and deployment, and deploy to a cloud platform. Document the entire infrastructure setup.",
      learningOutcomes: [
        "Write efficient multi-stage Dockerfiles",
        "Configure Docker Compose for multi-service development",
        "Build CI/CD pipelines with GitHub Actions",
        "Deploy and manage containers on a cloud platform",
      ],
      prerequisites: [
        "Comfortable with the command line",
        "Basic understanding of web servers",
        "A GitHub account",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What draws you to DevOps and infrastructure...",
        required: true,
      },
      {
        id: "cloud-experience",
        label: "Any experience with Docker or cloud platforms?",
        type: "textarea",
        placeholder:
          "AWS, GCP, Azure, DigitalOcean, or Docker experience...",
        required: false,
      },
    ],
  },
  {
    id: "recommendation-engine",
    title: "Movie Recommendation Engine",
    companyName: "Netflix",
    logoUrl: logo("netflix.com"),
    tagline: "Build an ML system that predicts what people love.",
    description:
      "Develop a collaborative-filtering recommendation engine using real movie rating data.",
    category: "Data & Analytics",
    skillTags: ["Python", "Machine Learning", "scikit-learn", "Pandas"],
    difficulty: "Advanced",
    timeCommitment: "20–25 hours",
    details: {
      overview:
        "Build a recommendation engine using the MovieLens dataset. Implement both user-based and item-based collaborative filtering, evaluate models with appropriate metrics (RMSE, precision@k), and expose predictions through a simple API. Write a report comparing approaches and discussing cold-start strategies.",
      learningOutcomes: [
        "Implement collaborative filtering algorithms from scratch",
        "Evaluate recommendation quality with standard metrics",
        "Handle sparse matrices and large-scale similarity computations",
        "Reason about cold-start and scalability challenges",
      ],
      prerequisites: [
        "Solid Python and NumPy/Pandas skills",
        "Basic understanding of linear algebra",
        "Familiarity with machine learning concepts",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder:
          "What excites you about recommendation systems or ML...",
        required: true,
      },
      {
        id: "ml-background",
        label: "Describe your machine learning background.",
        type: "textarea",
        placeholder:
          "Courses, projects, or self-study in ML or data science...",
        required: true,
      },
    ],
  },
  {
    id: "technical-blog-series",
    title: "Technical Blog Series",
    companyName: "Medium",
    logoUrl: logo("medium.com"),
    tagline: "Explain complex topics so anyone can understand.",
    description:
      "Write a 3-part technical blog series that teaches a complex topic through clear, engaging prose.",
    category: "Content",
    skillTags: ["Technical Writing", "Communication", "Research"],
    difficulty: "Beginner",
    timeCommitment: "8–12 hours",
    details: {
      overview:
        "Choose a technical topic you're passionate about and write a 3-part blog series aimed at beginners. Each post should be 800–1,200 words with diagrams, code snippets, or analogies that make the concept accessible. Topics could include: how DNS works, intro to containerization, understanding OAuth, or how databases store data.",
      learningOutcomes: [
        "Break down complex topics into digestible explanations",
        "Structure long-form technical content with clear progression",
        "Create supporting diagrams and visual aids",
        "Edit and refine prose for clarity and engagement",
      ],
      prerequisites: [
        "Strong grasp of at least one technical domain",
        "Comfortable writing in English",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder: "What draws you to technical writing...",
        required: true,
      },
      {
        id: "topic-idea",
        label: "What topic would you like to write about?",
        type: "text",
        placeholder: "A technical concept you could explain well...",
        required: true,
      },
      {
        id: "writing-sample",
        label: "Link to any previous writing (optional)",
        type: "text",
        placeholder: "Blog post, tutorial, documentation, etc.",
        required: false,
      },
    ],
  },
  {
    id: "prd-feature",
    title: "Write a Product Requirements Doc",
    companyName: "Notion",
    logoUrl: logo("notion.so"),
    tagline: "Define what to build and why before anyone writes code.",
    description:
      "Research a product opportunity and deliver a professional PRD with user stories, acceptance criteria, and success metrics.",
    category: "Product",
    skillTags: ["Product Management", "User Stories", "Research", "Strategy"],
    difficulty: "Beginner",
    timeCommitment: "8–12 hours",
    details: {
      overview:
        "Pick a product you use daily and identify a missing feature or improvement opportunity. Conduct lightweight competitive research and user interviews, then write a comprehensive PRD that includes problem statement, user personas, user stories with acceptance criteria, wireframes, success metrics, and a prioritised roadmap. Present your PRD as if pitching to a product team.",
      learningOutcomes: [
        "Frame product problems with clear problem statements",
        "Write user stories with measurable acceptance criteria",
        "Define success metrics and KPIs for a feature",
        "Prioritise features using a structured framework",
      ],
      prerequisites: [
        "Interest in product thinking and user problems",
        "Basic familiarity with any digital product",
      ],
    },
    applicationQuestions: [
      {
        id: "motivation",
        label: "Why are you interested in this project?",
        type: "textarea",
        placeholder:
          "What draws you to product management...",
        required: true,
      },
      {
        id: "product-idea",
        label: "Which product and feature would you focus on?",
        type: "textarea",
        placeholder:
          "Name the product and the opportunity you've identified...",
        required: true,
      },
    ],
  },
];
