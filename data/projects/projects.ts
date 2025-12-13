import { Project } from '@/types/projects'

export const projects: Project[] = [
  {
    id: 1,
    title: "Full-Stack Voting System",
    description: "End-to-end voting app with role-based access control and real-time results",
    tags: ["React", "Spring Boot", "MongoDB", "JWT"],
    category: "Full-Stack",
    github: "https://github.com/wy8881/voting-system",
    liveDemo: "https://voting.wyprojects.com/",
    featured: true
  },
  {
    id: 2,
    title: "XV Feature Engineering",
    description: "ML pipeline for cystic fibrosis imaging analysis using deep learning",
    tags: ["Python", "scikit-learn", "DenseNet", "TensorFlow"],
    category: "ML / Data",
    github: null,
    liveDemo: null,
    featured: true
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "A personal portfolio built with React.js, featuring a pink, circus-inspired theme and a Ferris wheel animation. The site focuses on responsive design and smooth UI animations using Framer Motion.",
    tags: ["React.js", "Framer Motion", "React-Bootstrap"],
    category: "Frontend",
    github: "https://github.com/wy8881/personal-portfolio/",
    liveDemo: "https://wy8881.github.io/personal-portfolio/",
    featured: true
  },  
  
  {
    id: 4,
    title: "Tic Tac Toe Game",
    description: "A simple Tic-Tac-Toe game built with React, allowing two players to take turns marking X and O on a 3x3 grid. The game automatically detects a winner or declares a draw when all cells are filled.",
    tags: ["React", "JavaScript", "Game Logic"],
    category: "Frontend",
    github: "https://github.com/wy8881/tic-tac-toe-game/",
    liveDemo: "https://wy8881.github.io/tic-tac-toe-game/",
    featured: false
  },
  {
    id: 5,
    title: "Recipe Book",
    description: "A recipe management application built with Angular. Users can add, edit, and delete recipes and ingredients, with an integrated shopping list feature to manage required items.",
    tags: ["Angular", "TypeScript", "CRUD"],
    category: "Frontend",
    github: "https://github.com/wy8881/RecipeBook/recipes",
    liveDemo: "https://wy8881.github.io/RecipeBook/recipes",
    featured: false
  },
  
  
]

