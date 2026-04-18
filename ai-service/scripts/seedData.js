import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor } from '../models/index.js';

dotenv.config();

const sampleVendors = [
  {
    name: "TechCraft Solutions",
    email: "contact@techcraft.com",
    phone: "+91-9876543210",
    password: "$2b$10$hashedPassword123",
    vendorType: "Company",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Full-stack development experts specializing in modern web technologies",
      avatar: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=TC",
      website: "https://techcraft.com"
    },
    skills: [
      { name: "React", experience: 5, proficiency: "Expert" },
      { name: "Node.js", experience: 4, proficiency: "Expert" },
      { name: "MongoDB", experience: 3, proficiency: "Intermediate" },
      { name: "TypeScript", experience: 4, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Web Development",
        description: "Custom web applications using React and Node.js",
        price: { min: 25000, max: 150000, currency: "INR" },
        duration: "2-8 weeks"
      },
      {
        name: "API Development",
        description: "RESTful and GraphQL APIs",
        price: { min: 15000, max: 80000, currency: "INR" },
        duration: "1-4 weeks"
      }
    ],
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India"
    },
    rating: {
      average: 4.8,
      totalReviews: 45
    },
    availability: {
      isAvailable: true,
      responseTime: "2 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution",
        technologies: ["React", "Node.js", "MongoDB"],
        imageUrl: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=E-commerce"
      }
    ]
  },
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91-8765432109",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Mobile app development specialist with 6+ years experience in React Native and Flutter",
      avatar: "https://via.placeholder.com/150/50C878/FFFFFF?text=RS",
      website: "https://rahulsharma.dev"
    },
    skills: [
      { name: "React Native", experience: 6, proficiency: "Expert" },
      { name: "Flutter", experience: 4, proficiency: "Expert" },
      { name: "Firebase", experience: 5, proficiency: "Expert" },
      { name: "Dart", experience: 4, proficiency: "Intermediate" }
    ],
    services: [
      {
        name: "Mobile App Development",
        description: "Cross-platform mobile applications",
        price: { min: 50000, max: 300000, currency: "INR" },
        duration: "4-12 weeks"
      },
      {
        name: "App Maintenance",
        description: "Ongoing app support and updates",
        price: { min: 10000, max: 50000, currency: "INR" },
        duration: "Monthly"
      }
    ],
    location: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India"
    },
    rating: {
      average: 4.9,
      totalReviews: 38
    },
    availability: {
      isAvailable: true,
      responseTime: "1 hour",
      workingHours: "10 AM - 7 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Food Delivery App",
        description: "React Native app with real-time tracking",
        technologies: ["React Native", "Firebase", "Google Maps"],
        imageUrl: "https://via.placeholder.com/300x200/50C878/FFFFFF?text=Food+App"
      }
    ]
  },
  {
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91-7654321098",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "UI/UX design expert creating beautiful and functional interfaces",
      avatar: "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=PP",
      website: "https://priyapatel.design"
    },
    skills: [
      { name: "Figma", experience: 5, proficiency: "Expert" },
      { name: "Adobe XD", experience: 4, proficiency: "Expert" },
      { name: "Sketch", experience: 3, proficiency: "Intermediate" },
      { name: "Prototyping", experience: 5, proficiency: "Expert" }
    ],
    services: [
      {
        name: "UI/UX Design",
        description: "Complete design solutions for web and mobile",
        price: { min: 20000, max: 120000, currency: "INR" },
        duration: "2-6 weeks"
      },
      {
        name: "Design System",
        description: "Comprehensive design systems and style guides",
        price: { min: 30000, max: 100000, currency: "INR" },
        duration: "3-8 weeks"
      }
    ],
    location: {
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    rating: {
      average: 4.7,
      totalReviews: 52
    },
    availability: {
      isAvailable: true,
      responseTime: "4 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Banking App Design",
        description: "Modern banking interface design",
        technologies: ["Figma", "Adobe XD", "Prototyping"],
        imageUrl: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Banking+UI"
      }
    ]
  },
  {
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91-6543210987",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Blockchain development expert specializing in DeFi and smart contracts",
      avatar: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=AK",
      website: "https://amitkumar.dev"
    },
    skills: [
      { name: "Solidity", experience: 4, proficiency: "Expert" },
      { name: "Ethereum", experience: 5, proficiency: "Expert" },
      { name: "Web3.js", experience: 4, proficiency: "Expert" },
      { name: "Smart Contracts", experience: 5, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Smart Contract Development",
        description: "Secure and audited smart contracts",
        price: { min: 40000, max: 200000, currency: "INR" },
        duration: "3-10 weeks"
      },
      {
        name: "DeFi Protocol Development",
        description: "Decentralized finance applications",
        price: { min: 80000, max: 500000, currency: "INR" },
        duration: "6-16 weeks"
      }
    ],
    location: {
      city: "Hyderabad",
      state: "Telangana",
      country: "India"
    },
    rating: {
      average: 4.6,
      totalReviews: 28
    },
    availability: {
      isAvailable: true,
      responseTime: "6 hours",
      workingHours: "10 AM - 8 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "DeFi Lending Protocol",
        description: "Decentralized lending platform",
        technologies: ["Solidity", "Ethereum", "Web3.js"],
        imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=DeFi+Protocol"
      }
    ]
  },
  {
    name: "Neha Singh",
    email: "neha.singh@email.com",
    phone: "+91-5432109876",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Cloud infrastructure and DevOps expert with AWS and Kubernetes expertise",
      avatar: "https://via.placeholder.com/150/06B6D4/FFFFFF?text=NS",
      website: "https://nehasingh.dev"
    },
    skills: [
      { name: "AWS", experience: 6, proficiency: "Expert" },
      { name: "Docker", experience: 5, proficiency: "Expert" },
      { name: "Kubernetes", experience: 4, proficiency: "Expert" },
      { name: "Terraform", experience: 3, proficiency: "Intermediate" }
    ],
    services: [
      {
        name: "Cloud Infrastructure",
        description: "Scalable cloud solutions on AWS/Azure/GCP",
        price: { min: 30000, max: 150000, currency: "INR" },
        duration: "2-8 weeks"
      },
      {
        name: "DevOps Automation",
        description: "CI/CD pipelines and automation",
        price: { min: 25000, max: 100000, currency: "INR" },
        duration: "2-6 weeks"
      }
    ],
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India"
    },
    rating: {
      average: 4.5,
      totalReviews: 41
    },
    availability: {
      isAvailable: true,
      responseTime: "3 hours",
      workingHours: "9 AM - 7 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Microservices Architecture",
        description: "Scalable microservices deployment",
        technologies: ["AWS", "Docker", "Kubernetes"],
        imageUrl: "https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Microservices"
      }
    ]
  },
  {
    name: "Vikram Mehta",
    email: "vikram.mehta@email.com",
    phone: "+91-4321098765",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Data science and machine learning specialist with Python expertise",
      avatar: "https://via.placeholder.com/150/10B981/FFFFFF?text=VM",
      website: "https://vikrammehta.ai"
    },
    skills: [
      { name: "Python", experience: 7, proficiency: "Expert" },
      { name: "TensorFlow", experience: 5, proficiency: "Expert" },
      { name: "PyTorch", experience: 4, proficiency: "Expert" },
      { name: "Data Analysis", experience: 6, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Machine Learning Models",
        description: "Custom ML models and AI solutions",
        price: { min: 50000, max: 300000, currency: "INR" },
        duration: "4-12 weeks"
      },
      {
        name: "Data Analysis",
        description: "Comprehensive data analysis and insights",
        price: { min: 20000, max: 100000, currency: "INR" },
        duration: "2-6 weeks"
      }
    ],
    location: {
      city: "Pune",
      state: "Maharashtra",
      country: "India"
    },
    rating: {
      average: 4.8,
      totalReviews: 35
    },
    availability: {
      isAvailable: true,
      responseTime: "4 hours",
      workingHours: "10 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Predictive Analytics Platform",
        description: "ML-powered prediction system",
        technologies: ["Python", "TensorFlow", "Scikit-learn"],
        imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=ML+Platform"
      }
    ]
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91-3210987654",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: false,
    profile: {
      bio: "Frontend development specialist focusing on modern JavaScript frameworks",
      avatar: "https://via.placeholder.com/150/F59E0B/FFFFFF?text=SR",
      website: "https://snehareddy.dev"
    },
    skills: [
      { name: "Vue.js", experience: 4, proficiency: "Expert" },
      { name: "Angular", experience: 3, proficiency: "Intermediate" },
      { name: "JavaScript", experience: 6, proficiency: "Expert" },
      { name: "CSS3", experience: 5, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Frontend Development",
        description: "Modern responsive web applications",
        price: { min: 15000, max: 80000, currency: "INR" },
        duration: "2-6 weeks"
      },
      {
        name: "UI Component Libraries",
        description: "Reusable component systems",
        price: { min: 20000, max: 60000, currency: "INR" },
        duration: "3-8 weeks"
      }
    ],
    location: {
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India"
    },
    rating: {
      average: 4.3,
      totalReviews: 22
    },
    availability: {
      isAvailable: true,
      responseTime: "5 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "E-commerce Frontend",
        description: "Modern e-commerce interface",
        technologies: ["Vue.js", "JavaScript", "CSS3"],
        imageUrl: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=E-commerce+UI"
      }
    ]
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-2109876543",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Backend development expert specializing in scalable APIs and databases",
      avatar: "https://via.placeholder.com/150/EF4444/FFFFFF?text=RK",
      website: "https://rajeshkumar.dev"
    },
    skills: [
      { name: "Java", experience: 5, proficiency: "Expert" },
      { name: "Spring Boot", experience: 4, proficiency: "Expert" },
      { name: "PostgreSQL", experience: 5, proficiency: "Expert" },
      { name: "Redis", experience: 3, proficiency: "Intermediate" }
    ],
    services: [
      {
        name: "Backend API Development",
        description: "Scalable REST and GraphQL APIs",
        price: { min: 25000, max: 120000, currency: "INR" },
        duration: "3-10 weeks"
      },
      {
        name: "Database Design",
        description: "Optimized database architecture",
        price: { min: 15000, max: 60000, currency: "INR" },
        duration: "2-5 weeks"
      }
    ],
    location: {
      city: "Kolkata",
      state: "West Bengal",
      country: "India"
    },
    rating: {
      average: 4.7,
      totalReviews: 33
    },
    availability: {
      isAvailable: true,
      responseTime: "2 hours",
      workingHours: "10 AM - 7 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "High-Performance API",
        description: "Scalable microservices API",
        technologies: ["Java", "Spring Boot", "PostgreSQL"],
        imageUrl: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=API+Backend"
      }
    ]
  },
  {
    name: "Anjali Desai",
    email: "anjali.desai@email.com",
    phone: "+91-1098765432",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "WordPress development and customization specialist",
      avatar: "https://via.placeholder.com/150/21759B/FFFFFF?text=AD",
      website: "https://anjalidesai.com"
    },
    skills: [
      { name: "WordPress", experience: 8, proficiency: "Expert" },
      { name: "PHP", experience: 6, proficiency: "Expert" },
      { name: "MySQL", experience: 5, proficiency: "Expert" },
      { name: "WooCommerce", experience: 4, proficiency: "Expert" }
    ],
    services: [
      {
        name: "WordPress Development",
        description: "Custom WordPress themes and plugins",
        price: { min: 20000, max: 100000, currency: "INR" },
        duration: "2-6 weeks"
      },
      {
        name: "E-commerce Solutions",
        description: "WooCommerce and Shopify development",
        price: { min: 30000, max: 150000, currency: "INR" },
        duration: "3-8 weeks"
      }
    ],
    location: {
      city: "Indore",
      state: "Madhya Pradesh",
      country: "India"
    },
    rating: {
      average: 4.4,
      totalReviews: 67
    },
    availability: {
      isAvailable: true,
      responseTime: "3 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "E-commerce WordPress Site",
        description: "Custom WooCommerce store",
        technologies: ["WordPress", "WooCommerce", "PHP"],
        imageUrl: "https://via.placeholder.com/300x200/21759B/FFFFFF?text=WordPress+Store"
      }
    ]
  },
  {
    name: "Arjun Malhotra",
    email: "arjun.malhotra@email.com",
    phone: "+91-0987654321",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Game development expert specializing in Unity and Unreal Engine",
      avatar: "https://via.placeholder.com/150/000000/FFFFFF?text=AM",
      website: "https://arjunmalhotra.dev"
    },
    skills: [
      { name: "Unity", experience: 6, proficiency: "Expert" },
      { name: "Unreal Engine", experience: 4, proficiency: "Expert" },
      { name: "C#", experience: 5, proficiency: "Expert" },
      { name: "3D Modeling", experience: 3, proficiency: "Intermediate" }
    ],
    services: [
      {
        name: "Game Development",
        description: "2D and 3D game development",
        price: { min: 80000, max: 500000, currency: "INR" },
        duration: "8-20 weeks"
      },
      {
        name: "VR/AR Development",
        description: "Virtual and augmented reality applications",
        price: { min: 100000, max: 800000, currency: "INR" },
        duration: "12-24 weeks"
      }
    ],
    location: {
      city: "Jaipur",
      state: "Rajasthan",
      country: "India"
    },
    rating: {
      average: 4.6,
      totalReviews: 29
    },
    availability: {
      isAvailable: true,
      responseTime: "4 hours",
      workingHours: "10 AM - 7 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Mobile Puzzle Game",
        description: "Unity-based mobile game",
        technologies: ["Unity", "C#", "Android SDK"],
        imageUrl: "https://via.placeholder.com/300x200/000000/FFFFFF?text=Mobile+Game"
      }
    ]
  },
  {
    name: "Kavya Sharma",
    email: "kavya.sharma@email.com",
    phone: "+91-9876543211",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Cybersecurity expert providing comprehensive security solutions",
      avatar: "https://via.placeholder.com/150/DC2626/FFFFFF?text=KS",
      website: "https://kavyasharma.security"
    },
    skills: [
      { name: "Penetration Testing", experience: 7, proficiency: "Expert" },
      { name: "Network Security", experience: 6, proficiency: "Expert" },
      { name: "Cryptography", experience: 5, proficiency: "Expert" },
      { name: "Security Auditing", experience: 6, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Security Auditing",
        description: "Comprehensive security assessments",
        price: { min: 50000, max: 200000, currency: "INR" },
        duration: "2-8 weeks"
      },
      {
        name: "Penetration Testing",
        description: "Vulnerability assessment and testing",
        price: { min: 30000, max: 150000, currency: "INR" },
        duration: "1-4 weeks"
      }
    ],
    location: {
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India"
    },
    rating: {
      average: 4.9,
      totalReviews: 18
    },
    availability: {
      isAvailable: true,
      responseTime: "1 hour",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Banking Security Audit",
        description: "Comprehensive security assessment",
        technologies: ["Penetration Testing", "Network Security", "Cryptography"],
        imageUrl: "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Security+Audit"
      }
    ]
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@email.com",
    phone: "+91-8765432108",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: false,
    profile: {
      bio: "Quality assurance and test automation specialist",
      avatar: "https://via.placeholder.com/150/059669/FFFFFF?text=RV",
      website: "https://rohanverma.qa"
    },
    skills: [
      { name: "Selenium", experience: 5, proficiency: "Expert" },
      { name: "Cypress", experience: 4, proficiency: "Expert" },
      { name: "Jest", experience: 3, proficiency: "Intermediate" },
      { name: "Test Automation", experience: 6, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Test Automation",
        description: "Automated testing solutions",
        price: { min: 25000, max: 120000, currency: "INR" },
        duration: "2-8 weeks"
      },
      {
        name: "Quality Assurance",
        description: "Comprehensive QA services",
        price: { min: 20000, max: 80000, currency: "INR" },
        duration: "2-6 weeks"
      }
    ],
    location: {
      city: "Nagpur",
      state: "Maharashtra",
      country: "India"
    },
    rating: {
      average: 4.2,
      totalReviews: 31
    },
    availability: {
      isAvailable: true,
      responseTime: "6 hours",
      workingHours: "10 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "E-commerce Test Suite",
        description: "Comprehensive test automation",
        technologies: ["Selenium", "Cypress", "Jest"],
        imageUrl: "https://via.placeholder.com/300x200/059669/FFFFFF?text=Test+Automation"
      }
    ]
  },
  {
    name: "Digital Marketing Hub",
    email: "contact@digitalmarketinghub.com",
    phone: "+91-7654321097",
    password: "$2b$10$hashedPassword123",
    vendorType: "Company",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Digital marketing and SEO experts driving online growth",
      avatar: "https://via.placeholder.com/150/7C3AED/FFFFFF?text=DM",
      website: "https://digitalmarketinghub.com"
    },
    skills: [
      { name: "SEO", experience: 8, proficiency: "Expert" },
      { name: "Google Ads", experience: 6, proficiency: "Expert" },
      { name: "Social Media Marketing", experience: 5, proficiency: "Expert" },
      { name: "Content Marketing", experience: 7, proficiency: "Expert" }
    ],
    services: [
      {
        name: "SEO Optimization",
        description: "Search engine optimization services",
        price: { min: 15000, max: 80000, currency: "INR" },
        duration: "3-6 months"
      },
      {
        name: "Digital Marketing",
        description: "Comprehensive digital marketing campaigns",
        price: { min: 25000, max: 150000, currency: "INR" },
        duration: "1-3 months"
      }
    ],
    location: {
      city: "Chandigarh",
      state: "Chandigarh",
      country: "India"
    },
    rating: {
      average: 4.7,
      totalReviews: 89
    },
    availability: {
      isAvailable: true,
      responseTime: "2 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "E-commerce SEO Campaign",
        description: "Successful SEO optimization",
        technologies: ["SEO", "Google Analytics", "Content Marketing"],
        imageUrl: "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=SEO+Campaign"
      }
    ]
  },
  {
    name: "Meera Iyer",
    email: "meera.iyer@email.com",
    phone: "+91-6543210986",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Professional content creation and copywriting specialist",
      avatar: "https://via.placeholder.com/150/F97316/FFFFFF?text=MI",
      website: "https://meeraiyer.com"
    },
    skills: [
      { name: "Content Writing", experience: 6, proficiency: "Expert" },
      { name: "Copywriting", experience: 5, proficiency: "Expert" },
      { name: "Technical Writing", experience: 4, proficiency: "Intermediate" },
      { name: "Blog Writing", experience: 7, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Content Creation",
        description: "High-quality content for websites and blogs",
        price: { min: 5000, max: 50000, currency: "INR" },
        duration: "1-4 weeks"
      },
      {
        name: "Copywriting",
        description: "Compelling copy for marketing materials",
        price: { min: 8000, max: 40000, currency: "INR" },
        duration: "1-3 weeks"
      }
    ],
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India"
    },
    rating: {
      average: 4.5,
      totalReviews: 156
    },
    availability: {
      isAvailable: true,
      responseTime: "3 hours",
      workingHours: "9 AM - 6 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Tech Blog Content",
        description: "Technical content for software company",
        technologies: ["Content Writing", "SEO", "Technical Writing"],
        imageUrl: "https://via.placeholder.com/300x200/F97316/FFFFFF?text=Content+Creation"
      }
    ]
  },
  {
    name: "Aditya Joshi",
    email: "aditya.joshi@email.com",
    phone: "+91-5432109875",
    password: "$2b$10$hashedPassword123",
    vendorType: "Individual",
    isActive: true,
    isVerified: true,
    profile: {
      bio: "Professional video production and editing specialist",
      avatar: "https://via.placeholder.com/150/EC4899/FFFFFF?text=AJ",
      website: "https://adityajoshi.video"
    },
    skills: [
      { name: "Video Editing", experience: 8, proficiency: "Expert" },
      { name: "Adobe Premiere", experience: 7, proficiency: "Expert" },
      { name: "After Effects", experience: 6, proficiency: "Expert" },
      { name: "Motion Graphics", experience: 5, proficiency: "Expert" }
    ],
    services: [
      {
        name: "Video Production",
        description: "Complete video production services",
        price: { min: 30000, max: 200000, currency: "INR" },
        duration: "2-8 weeks"
      },
      {
        name: "Video Editing",
        description: "Professional video editing and post-production",
        price: { min: 15000, max: 100000, currency: "INR" },
        duration: "1-4 weeks"
      }
    ],
    location: {
      city: "Vadodara",
      state: "Gujarat",
      country: "India"
    },
    rating: {
      average: 4.8,
      totalReviews: 73
    },
    availability: {
      isAvailable: true,
      responseTime: "4 hours",
      workingHours: "10 AM - 7 PM IST",
      timezone: "IST (UTC+5:30)",
      communicationPreferences: ["email", "phone", "whatsapp"]
    },
    portfolio: [
      {
        title: "Product Launch Video",
        description: "Corporate product launch video",
        technologies: ["Adobe Premiere", "After Effects", "Motion Graphics"],
        imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Video+Production"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing existing vendor data...');
    await Vendor.deleteMany({});
    console.log('✅ Cleared existing data');

    console.log('📝 Inserting sample vendors...');
    const insertedVendors = await Vendor.insertMany(sampleVendors);
    console.log(`✅ Inserted ${insertedVendors.length} vendors successfully`);

    console.log('\n📊 Sample Data Summary:');
    console.log(`- Total Vendors: ${insertedVendors.length}`);
    console.log(`- Verified Vendors: ${insertedVendors.filter(v => v.isVerified).length}`);
    console.log(`- Active Vendors: ${insertedVendors.filter(v => v.isActive).length}`);
    
    const individualVendors = insertedVendors.filter(v => v.vendorType === 'Individual').length;
    const companyVendors = insertedVendors.filter(v => v.vendorType === 'Company').length;
    console.log(`- Individual Vendors: ${individualVendors}`);
    console.log(`- Company Vendors: ${companyVendors}`);

    const skills = new Set();
    insertedVendors.forEach(vendor => {
      vendor.skills.forEach(skill => skills.add(skill.name));
    });
    console.log(`- Unique Skills: ${skills.size}`);
    console.log('- Skills:', Array.from(skills).join(', '));

    const cities = new Set();
    insertedVendors.forEach(vendor => {
      cities.add(vendor.location.city);
    });
    console.log(`- Cities: ${Array.from(cities).join(', ')}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🚀 Your AI Search Engine is ready to use!');

  } catch (error) {
    console.error('❌ Database seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase(); 
