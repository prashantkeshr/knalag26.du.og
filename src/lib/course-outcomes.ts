export interface TechOutcome {
  builds: string[];
  careers: string[];
  skills: string[];
  emoji: string;
}

export const TECH_OUTCOMES: Record<string, TechOutcome> = {
  fundamentals: {
    emoji: '🌐',
    builds: ['Understand any website', 'Debug browser network calls', 'Explain how the internet works to anyone'],
    careers: ['Any web developer role', 'Technical support', 'Product manager', 'QA engineer'],
    skills: ['HTTP & DNS', 'Browser DevTools', 'URLs, domains & hosting', 'Request/response cycle'],
  },
  html: {
    emoji: '🏗️',
    builds: ['Semantic web pages', 'Accessible forms', 'SEO-ready layouts', 'Email templates'],
    careers: ['Frontend Developer', 'Web Designer', 'Email Template Developer', 'Content Manager'],
    skills: ['Semantic markup', 'Accessibility (ARIA)', 'Forms & inputs', 'Meta tags & SEO'],
  },
  css: {
    emoji: '🎨',
    builds: ['Responsive layouts', 'Animations & transitions', 'Dark mode UIs', 'Component design systems'],
    careers: ['UI Developer', 'Frontend Engineer', 'Web Designer', 'UX Engineer'],
    skills: ['Flexbox & Grid', 'CSS variables & tokens', 'Media queries', 'Keyframe animations'],
  },
  javascript: {
    emoji: '⚡',
    builds: ['Interactive web apps', 'Browser games', 'API-powered dashboards', 'Form validators'],
    careers: ['Frontend Developer', 'Full-stack Developer', 'JavaScript Engineer', 'Web App Developer'],
    skills: ['DOM manipulation', 'Async / await & Promises', 'Fetch API & REST', 'Event-driven programming'],
  },
  typescript: {
    emoji: '🔷',
    builds: ['Type-safe applications', 'Large-scale codebases', 'React + TS projects', 'SDK libraries'],
    careers: ['Senior Frontend Engineer', 'Full-stack Developer', 'Software Engineer', 'Open-source contributor'],
    skills: ['Type safety & inference', 'Interfaces & generics', 'Utility types', 'IDE & tooling benefits'],
  },
  react: {
    emoji: '⚛️',
    builds: ['SPAs & dashboards', 'Component libraries', 'Production React apps', 'Admin portals'],
    careers: ['React Developer', 'Frontend Engineer', 'UI/UX Engineer', 'Product engineer'],
    skills: ['Components & hooks', 'State management', 'React Router', 'React ecosystem (Vite, Zustand)'],
  },
  python: {
    emoji: '🐍',
    builds: ['Automation scripts', 'Data analysis tools', 'Web scrapers & APIs', 'Discord & Telegram bots'],
    careers: ['Python Developer', 'Data Scientist', 'Backend Engineer', 'Automation Engineer'],
    skills: ['OOP & modules', 'File & system I/O', 'Standard library', 'Virtual environments'],
  },
  nodejs: {
    emoji: '🟢',
    builds: ['REST APIs', 'CLI tools', 'Real-time servers', 'Webhooks & integrations'],
    careers: ['Backend Developer', 'Full-stack Engineer', 'Node.js Developer', 'API Developer'],
    skills: ['Express.js', 'File system & streams', 'HTTP servers', 'npm ecosystem'],
  },
  sql: {
    emoji: '🗄️',
    builds: ['Relational databases', 'Data reporting queries', 'App backends', 'Analytics dashboards'],
    careers: ['Database Developer', 'Data Analyst', 'Backend Engineer', 'BI Developer'],
    skills: ['SELECT & JOINs', 'Aggregations & window fns', 'Schema design & normalization', 'Indexes & query tuning'],
  },
  git: {
    emoji: '🔀',
    builds: ['Version-controlled projects', 'Collaborative workflows', 'Open source contributions', 'Release pipelines'],
    careers: ['Any software role (essential)', 'Open-source contributor', 'DevOps Engineer', 'Team lead'],
    skills: ['Branching & merging', 'Pull requests & code review', 'Git workflows (GitFlow, trunk-based)', 'Conflict resolution'],
  },
  docker: {
    emoji: '🐳',
    builds: ['Containerised apps', 'Reproducible dev environments', 'Multi-service stacks', 'Microservices'],
    careers: ['DevOps Engineer', 'Site Reliability Engineer', 'Backend Developer', 'Platform Engineer'],
    skills: ['Containers & images', 'Dockerfile best practices', 'Docker Compose', 'Networking & volumes'],
  },
  linux: {
    emoji: '🐧',
    builds: ['Shell scripts', 'Automated server tasks', 'System administration', 'Cron jobs & monitoring'],
    careers: ['DevOps Engineer', 'SRE', 'System Administrator', 'Cloud Engineer'],
    skills: ['Shell commands', 'File system & permissions', 'Process management', 'Bash scripting'],
  },
  ml: {
    emoji: '🤖',
    builds: ['Prediction models', 'Classification systems', 'Data pipelines', 'Recommendation engines'],
    careers: ['ML Engineer', 'Data Scientist', 'AI Researcher', 'Analytics Engineer'],
    skills: ['scikit-learn', 'Model evaluation & metrics', 'Feature engineering', 'pandas & numpy'],
  },
  llms: {
    emoji: '🧠',
    builds: ['AI-powered apps', 'Chatbots & assistants', 'RAG systems', 'Document Q&A tools'],
    careers: ['AI Engineer', 'Prompt Engineer', 'LLM Application Developer', 'AI Product engineer'],
    skills: ['Prompt engineering', 'LangChain / LlamaIndex', 'RAG & embeddings', 'OpenAI & Claude APIs'],
  },
  mongodb: {
    emoji: '🍃',
    builds: ['NoSQL-backed APIs', 'Document stores', 'Real-time apps', 'CMS backends'],
    careers: ['Backend Developer', 'Full-stack Engineer', 'Database Engineer', 'MERN stack developer'],
    skills: ['CRUD with Mongoose', 'Aggregation pipeline', 'Indexing & performance', 'Schema design'],
  },
  postgresql: {
    emoji: '🐘',
    builds: ['Production databases', 'Analytics systems', 'App backends', 'Data warehouses'],
    careers: ['Database Engineer', 'Backend Developer', 'Data Engineer', 'Analytics Engineer'],
    skills: ['Advanced SQL & CTEs', 'Transactions & ACID', 'JSON in Postgres', 'Full-text search'],
  },
  redis: {
    emoji: '🔴',
    builds: ['Caching layers', 'Session stores', 'Real-time leaderboards', 'Job queues'],
    careers: ['Backend Developer', 'Performance Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
    skills: ['Key-value operations', 'Pub/Sub messaging', 'Cache strategies (TTL, LRU)', 'Redis Streams'],
  },
  apis: {
    emoji: '🔌',
    builds: ['API integrations', 'Webhook handlers', 'API-powered dashboards', 'Third-party automation'],
    careers: ['API Developer', 'Integration Engineer', 'Full-stack Developer', 'Automation engineer'],
    skills: ['REST & HTTP verbs', 'Auth headers & tokens', 'Error handling & retries', 'API documentation'],
  },
  cryptography: {
    emoji: '🔐',
    builds: ['Secure auth systems', 'Encrypted storage', 'Hash-based verification', 'JWT implementations'],
    careers: ['Security Engineer', 'Backend Developer', 'Cryptographer', 'Platform engineer'],
    skills: ['Hashing (SHA, bcrypt)', 'Symmetric & asymmetric encryption', 'TLS/SSL basics', 'Key management'],
  },
  websecurity: {
    emoji: '🛡️',
    builds: ['Hardened web apps', 'Security audit reports', 'Secure authentication flows', 'CSP configurations'],
    careers: ['Security Engineer', 'Penetration Tester', 'DevSecOps', 'Full-stack Developer'],
    skills: ['OWASP Top 10', 'XSS & CSRF defence', 'Secure headers & CSP', 'SQL injection prevention'],
  },
  embedded: {
    emoji: '🔧',
    builds: ['Microcontroller firmware', 'IoT sensors', 'Hardware interfaces', 'Smart home devices'],
    careers: ['Embedded Systems Engineer', 'Firmware Developer', 'IoT Engineer', 'Hardware engineer'],
    skills: ['C programming', 'GPIO & interrupts', 'I2C/SPI/UART protocols', 'Real-time constraints'],
  },
  cicd: {
    emoji: '🚀',
    builds: ['Automated pipelines', 'Zero-downtime deploys', 'GitHub Actions workflows', 'Test automation'],
    careers: ['DevOps Engineer', 'Platform Engineer', 'Site Reliability Engineer', 'Software engineer'],
    skills: ['GitHub Actions', 'Testing automation', 'Deployment strategies (blue/green)', 'Secrets management'],
  },
  deployment: {
    emoji: '☁️',
    builds: ['Deployed apps on cloud', 'Serverless functions', 'Production infrastructure', 'Custom domains'],
    careers: ['DevOps Engineer', 'Cloud Engineer', 'Full-stack Developer', 'Platform Engineer'],
    skills: ['Cloud platforms (Vercel, Railway)', 'DNS & domains', 'Environment variables', 'Monitoring & logs'],
  },
  aws: {
    emoji: '🌩️',
    builds: ['Scalable cloud apps', 'Serverless APIs', 'Cloud infrastructure', 'Multi-region systems'],
    careers: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer', 'AWS Certified Developer'],
    skills: ['EC2 & S3', 'Lambda & API Gateway', 'IAM & security', 'VPC & networking'],
  },
};

export function getOutcome(techId: string): TechOutcome {
  return TECH_OUTCOMES[techId] ?? {
    emoji: '📚',
    builds: ['Real-world projects', 'Portfolio pieces'],
    careers: ['Software Developer', 'Engineer'],
    skills: ['Core concepts', 'Practical skills'],
  };
}
