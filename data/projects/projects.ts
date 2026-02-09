import { Project } from '@/types/projects'

export const projects: Project[] = [
    {
    id: 7,
    title: "Aura Solutions Business Website",
    description: "A custom-developed business solution leveraging WordPress and Divi to deliver a sophisticated web experience. The project focuses on high-quality design consistency and optimized asset delivery for superior performance. Deployed on Amazon Lightsail via a virtual private server, the architecture is configured for reliability and scalability to support professional corporate operations.",
    tags: ["CMS Development", "WordPress", "Divi", "Amazon Lightsail"],
    category: "Frontend",
    github: "",
    liveDemo: "https://aurasolutions.wyprojects.com/",
    featured: true,
    coverImage: "/images/projects/aurosolutions-cover.png",
    shortTitle: "Aura Solutions"
  },
  {
    id: 1,
    title: "Full-Stack Voting System",
    description: "A comprehensive full-stack voting platform engineered with Spring Boot and MongoDB. It features a robust security layer using JWT for role-based access control, ensuring secure user sessions and data integrity. The system leverages WebSocket or reactive updates to deliver real-time polling results through a dynamic, responsive interface.",
    tags: ["Spring Boot", "MongoDB", "JWT"],
    
    category: "Full-Stack",
    github: "https://github.com/wy8881/voting",
    liveDemo: "https://voting.wyprojects.com/",
    featured: true,
    coverImage: "/images/projects/voting-system-cover.png",
    shortTitle: "Voting System"
  },
  {
    id: 2,
    title: "Research Internship",
    description: "Research internship focused on data analysis and machine learning methods applied to X-ray velocimetry (XV) imaging for cystic fibrosis research. Contributed to quantitative feature analysis across preclinical and clinical datasets, supporting a peer-reviewed publication.",
    tags: ["Machine Learning", "Data Analysis", "Medical Imaging", "X-ray Velocimetry"],
    category: "ML / Data",
    github: null,
    liveDemo: null,
    publication:"https://www.researchgate.net/publication/396104789_124_Of_mice_and_men_Novel_methods_for_understanding_cystic_fibrosis_using_preclinical_and_clinical_X-ray_velocimetry_imaging",
    featured: false
  },
  
  {
    id: 3,
    title: "Personal Portfolio",
    description: "A personal portfolio built with React.js, featuring a pink, circus-inspired theme and a Ferris wheel animation. The site focuses on responsive design and smooth UI animations using Framer Motion.",
    tags: ["React.js", "Framer Motion", "React-Bootstrap"],
    category: "Frontend",
    github: "https://github.com/wy8881/personal-portfolio/",
    liveDemo: "https://wy8881.github.io/personal-portfolio/",
    featured: false,
    coverImage: "/images/projects/portfolio-cover.png",
    shortTitle: "Personal Portfolio"
  },  
  
  {
    id: 4,
    title: "Tic Tac Toe Game",
    description: "Online Tic-Tac-Toe game with Vite + Node.js + Socket.IO. Players can create or join rooms, match online, and play multiple rounds. After each game, they can choose to continue or leave.",
    tags: ["Vite", "TypeScript", "Socket.IO", "Game Logic"],
    category: "Frontend",
    github: "https://github.com/wy8881/tic-tac-toe-game/",
    liveDemo: "https://tic-tac-toe.wyprojects.com",
    featured: true,
    coverImage: "/images/projects/tic-tac-toe-cover.png",
    shortTitle: "Tic Tac Toe"
  },
  {
    id: 5,
    title: "Recipe Book",
    description: "A recipe management application built with Angular. Users can add, edit, and delete recipes and ingredients, with an integrated shopping list feature to manage required items.",
    tags: ["Angular", "TypeScript", "CRUD"],
    category: "Frontend",
    github: "https://github.com/wy8881/RecipeBook",
    liveDemo: "https://wy8881.github.io/RecipeBook/recipes",
    featured: false
  },
  {
    id: 6,
    title: "IT Support Experience",
    description: "IT support experience gained during an internship in Australia, involving system upgrades and first-line user support. Responsibilities included handling phone-based support, troubleshooting issues, and escalating incidents to senior teams when required.",
    tags: [ "System Upgrade", "Phone Support", "Incident Escalation", "Documentation"],
    category: "IT Support",
    github: null,
    liveDemo: null,
    featured: false
  },


  
  
  
]

