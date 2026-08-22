// Your deployed Google Apps Script Web App URL (see APPS_SCRIPT/Code.gs + ADMIN_SETUP.md).
// Powers: (1) the contact form, (2) live projects/experience/profile data,
// (3) the /admin CMS. Everything below in this file is only the OFFLINE
// FALLBACK used if the script is unreachable or hasn't been deployed yet.
export const scriptEndpoint = "https://script.google.com/macros/s/AKfycbwc-bTdBcf6Xd5qJr4Ng1LiKOzKtM6GK1WsIr4Ds6hfNr_EzA9lmegZr01ohb_U9HvzzA/exec";

export const profile = {
  name: "Kumaran M",
  role: "Full-Stack Developer  ·  AI/RAG Systems  ·  Cloud & DevOps",
  location: "Madurai, Tamil Nadu, India",
  email: "kumarkumaran6253@gmail.com",
  phone: "+91 79041 69530",
  linkedin: "https://linkedin.com/in/kumaran-m-077135411",
  github: "https://github.com/Kumaran69",
  resumeUrl: "/Kumaran_M_Resume.pdf",
  availability: "Open for Full-Time, Freelance & Contract",
  summary:
    "Computer Science undergraduate (CGPA 8.45) specializing in production-grade full-stack web applications and AI-powered systems end-to-end — from schema design and REST APIs to React interfaces, local RAG pipelines, and containerized cloud deployment. AWS Certified Cloud Practitioner equipped with industry-tested internship experience.",
  recruiterBadges: [
    { label: "CGPA 8.45 / 10", icon: "🎓", detail: "BE Computer Science (2023 - 2027)" },
    { label: "AWS Certified", icon: "☁️", detail: "Cloud Practitioner" },
    { label: "2 Developer Internships", icon: "💼", detail: "MERN Stack & Mobile Flutter" },
    { label: "3 Production Builds", icon: "⚡", detail: "AI, Web & Machine Learning" }
  ]
};

export const stack = [
  {
    layer: "01",
    name: "Frontend",
    category: "frontend",
    items: ["React.js", "React Native", "Flutter", "HTML/CSS", "JavaScript", "Vite", "TailwindCSS"],
  },
  {
    layer: "02",
    name: "Backend",
    category: "backend",
    items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT Auth", "Java", "Python"],
  },
  {
    layer: "03",
    name: "AI & RAG",
    category: "ai",
    items: ["LangChain", "ChromaDB", "Ollama", "Vector Databases", "LLM Integration", "Streamlit", "Embeddings"],
  },
  {
    layer: "04",
    name: "Data & ML",
    category: "ml",
    items: ["Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Random Forest", "Gradient Boosting"],
  },
  {
    layer: "05",
    name: "Databases",
    category: "db",
    items: ["MongoDB Atlas", "MySQL", "Vector Stores"],
  },
  {
    layer: "06",
    name: "DevOps & Cloud",
    category: "devops",
    items: ["Docker", "Docker Compose", "GitHub Actions (CI/CD)", "Nginx", "AWS EC2 / S3 / IAM / RDS"],
  },
];

export const projectCategories = ["All", "AI & RAG", "Full-Stack", "ML & Data"];

export const projects = [
  {
    id: "rag-suite",
    code: "DWG-01",
    category: "AI & RAG",
    name: "RAG Projects Suite",
    tagline: "Five local, cost-free RAG applications built on one shared pipeline",
    description:
      "A comprehensive retrieval-augmented generation ecosystem featuring 5 distinct use-case applications — PDF Q&A, Knowledge-base chatbot, AI Resume Screener, College FAQ assistant, and GitHub Codebase Inspector. Executes zero-cost local LLM inference with vector index retrieval and conversational memory state.",
    highlights: [
      "Vector embeddings + semantic search across 5 distinct real-world applications",
      "Local, cost-free inference via Ollama — zero per-token API expenditure",
      "Interactive multi-app user interfaces shipped with Streamlit and FastAPI",
    ],
    architecture: [
      "Vector DB: ChromaDB with persistent collection storage",
      "Embedding Model: SentenceTransformers / Local HuggingFace",
      "LLM Runtime: Ollama local instance (Llama 3 / Mistral)",
      "API Layer: FastAPI endpoints with streaming response"
    ],
    metrics: "5 Apps Built · 0 Token Cost · Local Inference",
    stack: ["LangChain", "ChromaDB", "Ollama", "Streamlit", "FastAPI", "Python"],
    link: "https://rag-1-5b3e.onrender.com",
    githubLink: "https://github.com/Kumaran69",
    linkLabel: "Live Demo",
    date: "2026",
    featured: true,
  },
  {
    id: "cv-genix",
    code: "DWG-02",
    category: "Full-Stack",
    name: "CV-Genix",
    tagline: "Full-stack resume builder with automated AWS deployment pipeline",
    description:
      "A full-stack resume crafting platform equipped with secure JWT user authentication, persistent draft saving, and real-time live preview rendering. Fully containerized with Docker and continuously delivered to AWS EC2 via automated GitHub Actions CI/CD workflows.",
    highlights: [
      "Secure JWT-based authentication & encrypted user profile storage",
      "RESTful API architecture on AWS EC2 backed by MongoDB Atlas cluster",
      "Docker + GitHub Actions CI/CD for single-command zero-downtime releases",
    ],
    architecture: [
      "Frontend: React.js SPA with stateful dynamic layout preview",
      "Backend: Node.js & Express REST API with JWT middleware",
      "Database: MongoDB Atlas with schema validation",
      "DevOps: Docker containerization, Nginx reverse proxy, AWS EC2, GitHub Actions"
    ],
    metrics: "AWS EC2 Deployed · CI/CD Automated · Dockerized",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB Atlas", "Docker", "AWS EC2", "GitHub Actions"],
    link: "https://github.com/Kumaran69/CV-Genix",
    githubLink: "https://github.com/Kumaran69/CV-Genix",
    linkLabel: "View Source Code",
    date: "2025",
    featured: true,
  },
  {
    id: "student-performance",
    code: "DWG-03",
    category: "ML & Data",
    name: "Student Performance Measurement System",
    tagline: "Ensemble ML model predicting academic risk & performance",
    description:
      "An analytical regression and ensemble machine learning framework integrating Gradient Boosting and Random Forest algorithms to predict student academic outcomes. Paired with intuitive visual analytics dashboards designed for educators to identify at-risk students early.",
    highlights: [
      "Gradient Boosting + Random Forest ensemble model achieving high prediction accuracy",
      "Matplotlib & Seaborn interactive dashboard for non-technical academic supervisors",
      "Engineered early-warning signals that isolate actionable intervention metrics",
    ],
    architecture: [
      "Data Pipeline: Pandas & NumPy data cleaning, feature encoding, scaling",
      "ML Model: Scikit-learn Random Forest & Gradient Boosting Regressor",
      "Web Dashboard: Interactive Streamlit UI with Matplotlib visualizer"
    ],
    metrics: "Ensemble Accuracy · Interactive Analytics · Early-Warning Signals",
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Streamlit"],
    link: "https://vyvjsun4mryvxmpupf8pam.streamlit.app/",
    githubLink: "https://github.com/Kumaran69",
    linkLabel: "Live Demo",
    date: "2024",
    featured: true,
  },
];

export const experience = [
  {
    role: "MERN Stack Developer Intern",
    org: "Phoenix Softech",
    date: "June 2024",
    location: "Tamil Nadu, India",
    type: "Internship",
    points: [
      "Engineered and optimized high-performance RESTful APIs utilizing Node.js and Express.js, decreasing query response times by 30% through index design and middleware optimization.",
      "Designed indexed MongoDB database schemas and reusable React.js custom hook components to elevate state management efficiency and frontend responsiveness.",
      "Established structured Git feature-branching workflows and comprehensive Postman API automated testing suites, eliminating integration bugs prior to staging deployment.",
    ],
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Postman", "Git"]
  },
  {
    role: "Mobile Application Developer Intern — Flutter",
    org: "Dot Com Infoway (DCI)",
    date: "December 2023",
    location: "Madurai, India",
    type: "Internship",
    points: [
      "Developed modular cross-platform mobile components in Flutter & Dart for a unified iOS/Android codebase, standardizing layout styling and responsiveness.",
      "Diagnosed and resolved critical rendering glitches, memory bottlenecks, and navigation state issues ahead of scheduled store releases.",
      "Streamlined application launch flow and page load speeds via lazy loading techniques and state management refactoring.",
    ],
    skills: ["Flutter", "Dart", "Android", "iOS", "State Management", "Performance Optimization"]
  },
];

export const credentials = {
  education: {
    school: "Kamaraj College of Engineering and Technology",
    degree: "B.E. Computer Science & Engineering",
    score: "CGPA 8.45 / 10.0",
    date: "2023 – 2027",
    highlights: ["Data Structures & Algorithms", "Database Management", "Cloud Computing", "Software Engineering"]
  },
  certification: {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services / iSysway Technologies",
    date: "December 2025",
    verification: "Cloud Architecture, EC2, S3, IAM, CloudWatch, Billing & Security",
  },
};

export const stats = [
  { value: 3, suffix: "", label: "Production Builds Shipped" },
  { value: 2, suffix: "", label: "Developer Internships" },
  { value: stack.reduce((acc, s) => acc + s.items.length, 0), suffix: "+", label: "Technologies & Frameworks" },
  { value: 1, suffix: "", label: "AWS Cloud Certification" },
];

export const process = [
  {
    step: "Architecture & Scope",
    detail: "Define system requirements, API specifications, and cloud deployment targets before typing line one.",
  },
  {
    step: "Agile Development",
    detail: "Iterative full-stack execution with clean commits, modular components, and constant code reviews.",
  },
  {
    step: "Rigorous Testing",
    detail: "API validation with Postman, cross-browser visual checks, and failure handling verification.",
  },
  {
    step: "CI/CD & Cloud Shipping",
    detail: "Automated container builds with Docker and GitHub Actions, deployed to AWS with complete documentation.",
  },
];

