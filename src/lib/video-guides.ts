export interface VideoGuide {
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  type: 'quick' | 'deep-dive' | 'full-course';
}

const VIDEO_GUIDES: Record<string, VideoGuide[]> = {
  fundamentals: [
    { videoId: 'iYM2zFP3Zn0', title: 'HTTP Crash Course & Exploration', channel: 'Traversy Media', duration: '36 min', type: 'deep-dive' },
    { videoId: 'erEgovGs9Rs', title: 'How the Internet Works in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'ys_oap-wBjE', title: 'CS50W Web Programming with Python & JS', channel: 'CS50 Harvard', duration: '20+ hr', type: 'full-course' },
  ],
  html: [
    { videoId: 'ok-plXXHlWw', title: 'HTML in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'UB1O30fR-EE', title: 'HTML Crash Course For Absolute Beginners', channel: 'Traversy Media', duration: '1 hr', type: 'deep-dive' },
    { videoId: 'pQN-pnXPaVg', title: 'HTML Full Course — Build a Website Tutorial', channel: 'freeCodeCamp', duration: '2 hr', type: 'full-course' },
  ],
  css: [
    { videoId: 'OEV8gMkCHXQ', title: 'CSS in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'phWxA89Dy94', title: 'CSS Flexbox Tutorial — Responsive Layouts', channel: 'Kevin Powell', duration: '20 min', type: 'deep-dive' },
    { videoId: '1Rs2ND1ryYc', title: 'CSS Tutorial — Zero to Hero', channel: 'freeCodeCamp', duration: '6.5 hr', type: 'full-course' },
  ],
  javascript: [
    { videoId: 'DHjqpvDnNGE', title: 'JavaScript in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'hdI2bqOjy3c', title: 'JavaScript Crash Course For Beginners', channel: 'Traversy Media', duration: '1.5 hr', type: 'deep-dive' },
    { videoId: 'PkZNo7MFNFg', title: 'Learn JavaScript — Full Course for Beginners', channel: 'freeCodeCamp', duration: '3.5 hr', type: 'full-course' },
  ],
  typescript: [
    { videoId: 'zQnBQ4tB3ZA', title: 'TypeScript in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'ahCwqrYpIuM', title: 'TypeScript — The Basics', channel: 'Fireship', duration: '12 min', type: 'deep-dive' },
    { videoId: 'BwuLxPH8IDs', title: 'TypeScript Course for Beginners', channel: 'Academind', duration: '3 hr', type: 'full-course' },
  ],
  python: [
    { videoId: 'x7X9w_GIm1s', title: 'Python in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'rfscVS0vtbw', title: 'Learn Python — Full Course for Beginners', channel: 'freeCodeCamp', duration: '4.5 hr', type: 'full-course' },
    { videoId: 'OvKCESUCWII', title: 'CS50P Introduction to Programming with Python', channel: 'CS50 Harvard', duration: '16 hr', type: 'full-course' },
  ],
  git: [
    { videoId: 'hwP7WQkmECE', title: 'Git in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'RGOj5yH7evk', title: 'Git and GitHub for Beginners — Crash Course', channel: 'freeCodeCamp', duration: '1 hr', type: 'deep-dive' },
    { videoId: 'USjZcfj8yxE', title: 'Learn Git In 15 Minutes', channel: 'Traversy Media', duration: '15 min', type: 'deep-dive' },
  ],
  sql: [
    { videoId: 'zsjvFFKOm3c', title: 'SQL Explained in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'Cz3WcZLRaWc', title: 'SQL Window Functions — Step by Step', channel: 'TechTFQ', duration: '45 min', type: 'deep-dive' },
    { videoId: 'HXV3zeQKqGY', title: 'SQL Tutorial — Full Database Course for Beginners', channel: 'freeCodeCamp', duration: '4.5 hr', type: 'full-course' },
  ],
  react: [
    { videoId: 'Tn6-PIqc4UM', title: 'React in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'w7ejDZ8SWv8', title: 'React JS Crash Course', channel: 'Traversy Media', duration: '1.5 hr', type: 'deep-dive' },
    { videoId: 'nTeuhbP7wdE', title: 'React Course — Beginner\'s Tutorial', channel: 'freeCodeCamp', duration: '8 hr', type: 'full-course' },
  ],
  nodejs: [
    { videoId: 'ENrzD9HAZK4', title: 'Node.js in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'fBNz5xF-Kx4', title: 'Node.js Crash Course', channel: 'Traversy Media', duration: '1.5 hr', type: 'deep-dive' },
    { videoId: 'Oe421EPjeBE', title: 'Node.js and Express.js — Full Course', channel: 'freeCodeCamp', duration: '8 hr', type: 'full-course' },
  ],
  apis: [
    { videoId: 'ByGJQzlzxQg', title: 'RESTful APIs in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: '0sOvCWFmrtA', title: 'REST API Crash Course — Introduction + Full Example', channel: 'Traversy Media', duration: '30 min', type: 'deep-dive' },
    { videoId: 'GZvSYJDk-us', title: 'APIs for Beginners — Full Course', channel: 'freeCodeCamp', duration: '2 hr', type: 'full-course' },
  ],
  postgresql: [
    { videoId: 'n2Vlkn-hBiA', title: 'PostgreSQL in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'qw--VYLpxG4', title: 'Learn PostgreSQL Tutorial — Full Course for Beginners', channel: 'freeCodeCamp', duration: '4 hr', type: 'full-course' },
  ],
  mongodb: [
    { videoId: '-bt_y4Loofg', title: 'MongoDB in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'ofme2o29ngU', title: 'MongoDB Crash Course', channel: 'Traversy Media', duration: '30 min', type: 'deep-dive' },
    { videoId: '4yqu8YF29cU', title: 'MongoDB Complete Tutorial', channel: 'freeCodeCamp', duration: '4 hr', type: 'full-course' },
  ],
  redis: [
    { videoId: 'G1rOthIU-eo', title: 'Redis in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'jgpVdJB2sKQ', title: 'Redis Crash Course — The What, Why and How', channel: 'TechWorld with Nana', duration: '1 hr', type: 'deep-dive' },
  ],
  linux: [
    { videoId: 'rrB13utjYV4', title: 'Linux in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'l0QB_8ynV5A', title: 'Linux for Hackers — Getting Comfortable', channel: 'NetworkChuck', duration: '30 min', type: 'deep-dive' },
    { videoId: 'ZtqBQ68cfJc', title: 'The Linux Command Line Bootcamp', channel: 'freeCodeCamp', duration: '14 hr', type: 'full-course' },
  ],
  docker: [
    { videoId: 'Gjnup-PuquQ', title: 'Docker in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: '3c-iBn73dDE', title: 'Docker Tutorial for Beginners — Full Course', channel: 'TechWorld with Nana', duration: '3 hr', type: 'full-course' },
  ],
  cicd: [
    { videoId: 'scEDHsr3APg', title: 'GitHub Actions in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'R8_veQiYBjI', title: 'DevOps CI/CD Explained in 100 Seconds', channel: 'TechWorld with Nana', duration: '100 sec', type: 'quick' },
    { videoId: 'mFFXuXjVgkU', title: 'GitHub Actions Tutorial — From Zero to Hero', channel: 'TechWorld with Nana', duration: '1.5 hr', type: 'deep-dive' },
  ],
  deployment: [
    { videoId: 'ixOd4yXfwBY', title: '5 Ways to Deploy a React App', channel: 'Fireship', duration: '10 min', type: 'quick' },
    { videoId: 'r8itljW3UgA', title: 'Full Stack App Deployment to a VPS (Nginx + SSL)', channel: 'Traversy Media', duration: '1 hr', type: 'deep-dive' },
  ],
  aws: [
    { videoId: '9_4bms7lMFI', title: 'AWS in 100 Seconds', channel: 'Fireship', duration: '2 min', type: 'quick' },
    { videoId: 'k1RI5locZE4', title: 'AWS Services Explained for Beginners', channel: 'TechWorld with Nana', duration: '1 hr', type: 'deep-dive' },
    { videoId: 'SOTamWNgDKc', title: 'AWS Certified Cloud Practitioner Training — Full Course', channel: 'freeCodeCamp', duration: '13 hr', type: 'full-course' },
  ],
  ml: [
    { videoId: 'aircAruvnKk', title: 'But what is a Neural Network?', channel: '3Blue1Brown', duration: '19 min', type: 'quick' },
    { videoId: 'i_LwzRVP7bg', title: 'StatQuest: Machine Learning Fundamentals', channel: 'StatQuest / Josh Starmer', duration: '15 min', type: 'deep-dive' },
    { videoId: 'NWONeJKn9Kc', title: 'Machine Learning with Python — Full Course', channel: 'freeCodeCamp', duration: '6 hr', type: 'full-course' },
  ],
  llms: [
    { videoId: 'zjkBMFhNj_g', title: 'Intro to Large Language Models', channel: 'Andrej Karpathy (ex-OpenAI)', duration: '1 hr', type: 'quick' },
    { videoId: 'hhiLw5Q_UFg', title: 'Large Language Models Explained', channel: 'Fireship', duration: '5 min', type: 'quick' },
    { videoId: 'dOxUroR57xs', title: 'ChatGPT Prompt Engineering for Developers', channel: 'DeepLearning.AI × OpenAI', duration: '1.5 hr', type: 'full-course' },
  ],
  websecurity: [
    { videoId: 'F-sFp_AvHc8', title: '100+ Web Security Concepts in 10 Minutes', channel: 'Fireship', duration: '10 min', type: 'quick' },
    { videoId: 'sdpxddDzXfE', title: 'Ethical Hacking in 12 Hours — Full Course', channel: 'TCM Security', duration: '12 hr', type: 'full-course' },
    { videoId: 'MQSjSFxBfpI', title: 'CS50 Cybersecurity (Official Harvard Course)', channel: 'CS50 Harvard', duration: '3 hr', type: 'full-course' },
  ],
  cryptography: [
    { videoId: 'AQDCe585Lnc', title: 'How does HTTPS work? TLS & SSL Explained', channel: '3Blue1Brown', duration: '7 min', type: 'quick' },
    { videoId: 'jhXCTbFnK8o', title: 'Cryptography: Crash Course Computer Science', channel: 'CrashCourse', duration: '13 min', type: 'deep-dive' },
    { videoId: 'MQSjSFxBfpI', title: 'CS50 Cybersecurity — Cryptography Module', channel: 'CS50 Harvard', duration: '3 hr', type: 'full-course' },
  ],
  embedded: [
    { videoId: '_PCBFlMcJCE', title: 'Arduino Tutorial for Beginners — Lesson 1', channel: 'Paul McWhorter', duration: '30 min', type: 'deep-dive' },
    { videoId: 'x9Mdkde-S5Q', title: 'IoT Full Course — Internet of Things', channel: 'freeCodeCamp', duration: '4 hr', type: 'full-course' },
  ],
};

export function getVideoGuides(tech: string): VideoGuide[] {
  return VIDEO_GUIDES[tech] ?? [];
}
