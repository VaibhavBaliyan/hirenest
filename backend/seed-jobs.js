import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import User from "./models/User.js";
import Company from "./models/Company.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedJobs = async () => {
  try {
    await connectDB();

    // Find an employer user (or create one)
    let employer = await User.findOne({ role: "employer" });

    if (!employer) {
      console.log(
        "No employer found. Please create an employer account first."
      );
      process.exit(1);
    }

    // Find or create a company
    let company = await Company.findOne({ employerId: employer._id });

    if (!company) {
      company = await Company.create({
        companyName: "Tech Solutions Inc",
        description: "Leading technology solutions provider",
        website: "https://techsolutions.com",
        location: "Mumbai, Maharashtra",
        employerId: employer._id,
      });
      console.log("Company created");
    }

    // Clear existing jobs (optional)
    await Job.deleteMany({});
    console.log("Existing jobs cleared");

    const jobs = [
      // Software Development
      {
        title: "Senior Full Stack Developer",
        description:
          "We are looking for an experienced Full Stack Developer to join our team. You will work on cutting-edge web applications using React, Node.js, and MongoDB.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 120000, max: 180000, currency: "INR" },
        skills: [
          "React",
          "Node.js",
          "MongoDB",
          "Express",
          "JavaScript",
          "TypeScript",
        ],
        experience: { min: 5, max: 8 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Frontend Developer",
        description:
          "Join our frontend team to build beautiful, responsive user interfaces using modern frameworks.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: [
          "React",
          "Vue.js",
          "HTML",
          "CSS",
          "JavaScript",
          "Tailwind CSS",
        ],
        experience: { min: 2, max: 4 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Backend Developer",
        description:
          "Build scalable backend services and APIs using Node.js and Python.",
        location: "Hyderabad, Telangana",
        jobType: "full-time",
        salary: { min: 70000, max: 120000, currency: "INR" },
        skills: [
          "Node.js",
          "Python",
          "Django",
          "PostgreSQL",
          "Redis",
          "Docker",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Mobile App Developer",
        description:
          "Develop cross-platform mobile applications using React Native and Flutter.",
        location: "Chennai, Tamil Nadu",
        jobType: "full-time",
        salary: { min: 80000, max: 130000, currency: "INR" },
        skills: [
          "React Native",
          "Flutter",
          "Dart",
          "Firebase",
          "iOS",
          "Android",
        ],
        experience: { min: 3, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "DevOps Engineer",
        description:
          "Manage CI/CD pipelines, cloud infrastructure, and deployment automation.",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        salary: { min: 100000, max: 160000, currency: "INR" },
        skills: [
          "AWS",
          "Docker",
          "Kubernetes",
          "Jenkins",
          "Terraform",
          "Linux",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },

      // Data Science & AI
      {
        title: "Data Scientist",
        description:
          "Analyze large datasets and build machine learning models to drive business insights.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 110000, max: 170000, currency: "INR" },
        skills: [
          "Python",
          "Machine Learning",
          "TensorFlow",
          "Pandas",
          "SQL",
          "Statistics",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Machine Learning Engineer",
        description:
          "Build and deploy ML models at scale using modern frameworks.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 120000, max: 180000, currency: "INR" },
        skills: [
          "Python",
          "PyTorch",
          "TensorFlow",
          "Scikit-learn",
          "MLOps",
          "AWS",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "AI Research Engineer",
        description:
          "Conduct research in deep learning and natural language processing.",
        location: "Hyderabad, Telangana",
        jobType: "full-time",
        salary: { min: 130000, max: 200000, currency: "INR" },
        skills: [
          "Deep Learning",
          "NLP",
          "Computer Vision",
          "Python",
          "Research",
          "Publications",
        ],
        experience: { min: 5, max: 10 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Data Analyst",
        description:
          "Transform data into actionable insights using analytics tools.",
        location: "Delhi, NCR",
        jobType: "full-time",
        salary: { min: 50000, max: 80000, currency: "INR" },
        skills: ["SQL", "Excel", "Tableau", "Power BI", "Python", "Statistics"],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Big Data Engineer",
        description:
          "Design and implement big data solutions using Hadoop and Spark.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 100000, max: 150000, currency: "INR" },
        skills: ["Hadoop", "Spark", "Kafka", "Scala", "Python", "Hive"],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },

      // Design
      {
        title: "UI/UX Designer",
        description:
          "Create beautiful and intuitive user interfaces for web and mobile applications.",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: [
          "Figma",
          "Adobe XD",
          "Sketch",
          "Prototyping",
          "User Research",
          "Wireframing",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Product Designer",
        description: "Lead product design from concept to launch.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 80000, max: 130000, currency: "INR" },
        skills: [
          "Product Design",
          "Figma",
          "User Research",
          "Design Systems",
          "Prototyping",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Graphic Designer",
        description:
          "Create visual content for marketing campaigns and brand identity.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 40000, max: 70000, currency: "INR" },
        skills: [
          "Adobe Photoshop",
          "Illustrator",
          "InDesign",
          "Branding",
          "Typography",
        ],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },

      // Marketing & Sales
      {
        title: "Digital Marketing Manager",
        description:
          "Plan and execute digital marketing campaigns across multiple channels.",
        location: "Delhi, NCR",
        jobType: "full-time",
        salary: { min: 70000, max: 110000, currency: "INR" },
        skills: [
          "SEO",
          "SEM",
          "Google Analytics",
          "Social Media",
          "Content Marketing",
          "Email Marketing",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Content Writer",
        description:
          "Create engaging content for blogs, websites, and social media.",
        location: "Remote",
        jobType: "full-time",
        salary: { min: 35000, max: 60000, currency: "INR" },
        skills: [
          "Content Writing",
          "SEO",
          "Copywriting",
          "Research",
          "WordPress",
        ],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Sales Executive",
        description: "Drive sales growth and build relationships with clients.",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        salary: { min: 40000, max: 80000, currency: "INR" },
        skills: [
          "Sales",
          "Communication",
          "CRM",
          "Negotiation",
          "Lead Generation",
        ],
        experience: { min: 1, max: 4 },
        company: company._id,
        employerId: employer._id,
      },

      // Product Management
      {
        title: "Product Manager",
        description:
          "Define product strategy and roadmap for our flagship products.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 120000, max: 180000, currency: "INR" },
        skills: [
          "Product Management",
          "Agile",
          "Roadmapping",
          "Analytics",
          "Stakeholder Management",
        ],
        experience: { min: 5, max: 8 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Technical Product Manager",
        description: "Bridge the gap between engineering and business.",
        location: "Hyderabad, Telangana",
        jobType: "full-time",
        salary: { min: 110000, max: 160000, currency: "INR" },
        skills: [
          "Product Management",
          "Technical Skills",
          "APIs",
          "SQL",
          "Agile",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },

      // QA & Testing
      {
        title: "QA Engineer",
        description:
          "Ensure product quality through manual and automated testing.",
        location: "Chennai, Tamil Nadu",
        jobType: "full-time",
        salary: { min: 50000, max: 80000, currency: "INR" },
        skills: [
          "Manual Testing",
          "Selenium",
          "Test Automation",
          "JIRA",
          "API Testing",
        ],
        experience: { min: 2, max: 4 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Automation Test Engineer",
        description: "Build and maintain automated test frameworks.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: [
          "Selenium",
          "Cypress",
          "Jest",
          "Python",
          "CI/CD",
          "Test Automation",
        ],
        experience: { min: 3, max: 5 },
        company: company._id,
        employerId: employer._id,
      },

      // Cybersecurity
      {
        title: "Security Engineer",
        description: "Protect our systems and data from security threats.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 100000, max: 150000, currency: "INR" },
        skills: [
          "Cybersecurity",
          "Penetration Testing",
          "Network Security",
          "SIEM",
          "Compliance",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Ethical Hacker",
        description:
          "Identify and fix security vulnerabilities through ethical hacking.",
        location: "Mumbai, Maharashtra",
        jobType: "contract",
        salary: { min: 90000, max: 140000, currency: "INR" },
        skills: [
          "Ethical Hacking",
          "Penetration Testing",
          "Kali Linux",
          "OWASP",
          "Security Audits",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },

      // Cloud & Infrastructure
      {
        title: "Cloud Architect",
        description: "Design and implement cloud infrastructure solutions.",
        location: "Hyderabad, Telangana",
        jobType: "full-time",
        salary: { min: 130000, max: 190000, currency: "INR" },
        skills: [
          "AWS",
          "Azure",
          "GCP",
          "Cloud Architecture",
          "Microservices",
          "Terraform",
        ],
        experience: { min: 6, max: 10 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Site Reliability Engineer",
        description:
          "Ensure high availability and performance of production systems.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 110000, max: 160000, currency: "INR" },
        skills: [
          "SRE",
          "Kubernetes",
          "Monitoring",
          "Linux",
          "Python",
          "Incident Management",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },

      // Blockchain & Web3
      {
        title: "Blockchain Developer",
        description: "Build decentralized applications and smart contracts.",
        location: "Remote",
        jobType: "full-time",
        salary: { min: 100000, max: 160000, currency: "INR" },
        skills: [
          "Solidity",
          "Ethereum",
          "Web3.js",
          "Smart Contracts",
          "Blockchain",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Smart Contract Developer",
        description: "Develop and audit smart contracts for DeFi applications.",
        location: "Bangalore, Karnataka",
        jobType: "contract",
        salary: { min: 90000, max: 150000, currency: "INR" },
        skills: ["Solidity", "Hardhat", "Truffle", "DeFi", "Security Audits"],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },

      // Game Development
      {
        title: "Game Developer",
        description: "Create engaging games using Unity and Unreal Engine.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 70000, max: 120000, currency: "INR" },
        skills: [
          "Unity",
          "Unreal Engine",
          "C#",
          "C++",
          "3D Modeling",
          "Game Design",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Unity Developer",
        description: "Build mobile and PC games using Unity engine.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: ["Unity", "C#", "Game Development", "Mobile Games", "AR/VR"],
        experience: { min: 2, max: 4 },
        company: company._id,
        employerId: employer._id,
      },

      // HR & Recruitment
      {
        title: "HR Manager",
        description:
          "Manage recruitment, employee relations, and HR operations.",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: [
          "HR Management",
          "Recruitment",
          "Employee Relations",
          "HRIS",
          "Compliance",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Technical Recruiter",
        description: "Source and hire top technical talent.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 50000, max: 80000, currency: "INR" },
        skills: [
          "Technical Recruitment",
          "Sourcing",
          "Interviewing",
          "LinkedIn",
          "ATS",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },

      // Business & Finance
      {
        title: "Business Analyst",
        description: "Analyze business processes and recommend improvements.",
        location: "Delhi, NCR",
        jobType: "full-time",
        salary: { min: 60000, max: 100000, currency: "INR" },
        skills: [
          "Business Analysis",
          "Requirements Gathering",
          "SQL",
          "Excel",
          "Documentation",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Financial Analyst",
        description: "Provide financial insights and forecasting.",
        location: "Mumbai, Maharashtra",
        jobType: "full-time",
        salary: { min: 70000, max: 110000, currency: "INR" },
        skills: [
          "Financial Analysis",
          "Excel",
          "Forecasting",
          "Modeling",
          "SQL",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Accountant",
        description: "Manage financial records and ensure compliance.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 40000, max: 70000, currency: "INR" },
        skills: [
          "Accounting",
          "Tally",
          "GST",
          "Taxation",
          "Financial Reporting",
        ],
        experience: { min: 2, max: 4 },
        company: company._id,
        employerId: employer._id,
      },

      // Customer Support
      {
        title: "Customer Support Executive",
        description: "Provide excellent customer service and resolve issues.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 25000, max: 45000, currency: "INR" },
        skills: [
          "Customer Service",
          "Communication",
          "Problem Solving",
          "CRM",
          "Email Support",
        ],
        experience: { min: 0, max: 2 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Technical Support Engineer",
        description: "Provide technical assistance to customers.",
        location: "Hyderabad, Telangana",
        jobType: "full-time",
        salary: { min: 35000, max: 60000, currency: "INR" },
        skills: [
          "Technical Support",
          "Troubleshooting",
          "Linux",
          "Networking",
          "Customer Service",
        ],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },

      // Internships
      {
        title: "Software Development Intern",
        description: "Learn and contribute to real-world projects.",
        location: "Bangalore, Karnataka",
        jobType: "internship",
        salary: { min: 15000, max: 25000, currency: "INR" },
        skills: [
          "Programming",
          "JavaScript",
          "Python",
          "Git",
          "Problem Solving",
        ],
        experience: { min: 0, max: 1 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Data Science Intern",
        description: "Work on data analysis and machine learning projects.",
        location: "Mumbai, Maharashtra",
        jobType: "internship",
        salary: { min: 12000, max: 20000, currency: "INR" },
        skills: [
          "Python",
          "Pandas",
          "Machine Learning",
          "Statistics",
          "Jupyter",
        ],
        experience: { min: 0, max: 1 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "UI/UX Design Intern",
        description: "Assist in designing user interfaces and experiences.",
        location: "Pune, Maharashtra",
        jobType: "internship",
        salary: { min: 10000, max: 18000, currency: "INR" },
        skills: ["Figma", "Adobe XD", "Design", "Prototyping", "User Research"],
        experience: { min: 0, max: 1 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Digital Marketing Intern",
        description: "Learn digital marketing strategies and execution.",
        location: "Delhi, NCR",
        jobType: "internship",
        salary: { min: 8000, max: 15000, currency: "INR" },
        skills: [
          "Social Media",
          "Content Writing",
          "SEO",
          "Analytics",
          "Marketing",
        ],
        experience: { min: 0, max: 1 },
        company: company._id,
        employerId: employer._id,
      },

      // Remote Jobs
      {
        title: "Remote Full Stack Developer",
        description: "Work remotely on exciting projects from anywhere.",
        location: "Remote",
        jobType: "full-time",
        salary: { min: 80000, max: 140000, currency: "INR" },
        skills: ["React", "Node.js", "MongoDB", "REST APIs", "Git", "Agile"],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Remote Content Strategist",
        description: "Plan and execute content strategy remotely.",
        location: "Remote",
        jobType: "full-time",
        salary: { min: 50000, max: 90000, currency: "INR" },
        skills: [
          "Content Strategy",
          "SEO",
          "Writing",
          "Analytics",
          "Marketing",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Remote Project Manager",
        description: "Manage projects and teams remotely.",
        location: "Remote",
        jobType: "full-time",
        salary: { min: 90000, max: 140000, currency: "INR" },
        skills: [
          "Project Management",
          "Agile",
          "Scrum",
          "JIRA",
          "Communication",
        ],
        experience: { min: 4, max: 7 },
        company: company._id,
        employerId: employer._id,
      },

      // Part-time
      {
        title: "Part-time React Developer",
        description: "Work part-time on frontend development projects.",
        location: "Bangalore, Karnataka",
        jobType: "part-time",
        salary: { min: 30000, max: 50000, currency: "INR" },
        skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Part-time Graphic Designer",
        description: "Create designs on a part-time basis.",
        location: "Mumbai, Maharashtra",
        jobType: "part-time",
        salary: { min: 25000, max: 45000, currency: "INR" },
        skills: ["Photoshop", "Illustrator", "Design", "Creativity"],
        experience: { min: 1, max: 3 },
        company: company._id,
        employerId: employer._id,
      },

      // Specialized Roles
      {
        title: "IoT Developer",
        description: "Build Internet of Things solutions and embedded systems.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 70000, max: 120000, currency: "INR" },
        skills: [
          "IoT",
          "Embedded Systems",
          "C",
          "Python",
          "MQTT",
          "Raspberry Pi",
        ],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "AR/VR Developer",
        description:
          "Create immersive augmented and virtual reality experiences.",
        location: "Pune, Maharashtra",
        jobType: "full-time",
        salary: { min: 80000, max: 130000, currency: "INR" },
        skills: ["Unity", "Unreal Engine", "AR", "VR", "C#", "3D Graphics"],
        experience: { min: 2, max: 5 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Robotics Engineer",
        description: "Design and program robotic systems.",
        location: "Chennai, Tamil Nadu",
        jobType: "full-time",
        salary: { min: 90000, max: 140000, currency: "INR" },
        skills: [
          "Robotics",
          "ROS",
          "Python",
          "C++",
          "Computer Vision",
          "Control Systems",
        ],
        experience: { min: 3, max: 6 },
        company: company._id,
        employerId: employer._id,
      },
      {
        title: "Quantum Computing Researcher",
        description: "Research and develop quantum computing algorithms.",
        location: "Bangalore, Karnataka",
        jobType: "full-time",
        salary: { min: 150000, max: 220000, currency: "INR" },
        skills: [
          "Quantum Computing",
          "Physics",
          "Mathematics",
          "Python",
          "Qiskit",
        ],
        experience: { min: 5, max: 10 },
        company: company._id,
        employerId: employer._id,
      },
    ];

    // Insert all jobs
    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ ${createdJobs.length} jobs created successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
