import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

const SKILLS = {
  "Languages & Scripting": ["C", "C++", "Java", "Python", "Bash", "SQL"],
  "Frameworks & Databases": ["React.js", "Node.js", "Express.js", "MongoDB", "MySQL", "Tailwind CSS"],
  "Tools & Platforms": ["Git", "Arduino", "Google Cloud Platform", "Docker", "REST API"],
  "Cybersecurity Tools": ["SIEM (Wazuh)", "Cyberchef", "Wireshark"],
  "Soft Skills": ["Active Listening", "Problem Solving", "Critical Thinking", "Leadership", "Time Management"],
};

const TECH_ICONS: Record<string, string> = {
  "C": "🔷", "C++": "🔷", "Java": "☕", "Python": "🐍", "Bash": "💻", "SQL": "🗄️",
  "React.js": "⚛️", "Node.js": "🟢", "Express.js": "🚂", "MongoDB": "🍃",
  "MySQL": "🐬", "Tailwind CSS": "🌊", "Git": "🌿", "Arduino": "🔌",
  "Google Cloud Platform": "☁️", "Docker": "🐳", "REST API": "🔗",
  "SIEM (Wazuh)": "🛡️", "Cyberchef": "🔐", "Wireshark": "🦈",
};

const EXPERIENCE = [
  {
    title: "Social Media Ad Relevance Strategist & Analyst",
    type: "Remote",
    company: "Appen (Project for Meta)",
    period: "Mar 2025 – Jan 26",
    color: "from-blue-500 to-cyan-500",
    points: [
      "Improved ad targeting precision by evaluating 2,000+ social media advertisements, analyzing content quality, contextual relevance, and user intent across diverse demographics.",
      "Maintained 90%+ accuracy in ad evaluation tasks, directly contributing to machine learning model training for better ad delivery and audience alignment.",
    ],
  },
  {
    title: "AI Quality Analyst",
    type: "Remote",
    company: "Soul.AI (Project for Google Gemini)",
    period: "Aug 2025 – Dec 25",
    color: "from-violet-500 to-purple-500",
    points: [
      "Reviewed and refined 1000+ AI-generated responses to improve contextual accuracy and alignment with defined evaluation rubrics and user intent.",
      "Conducted structured error analysis to identify recurring failure patterns, logical inconsistencies, and edge cases.",
      "Applied standardized quality benchmarks to ensure consistency, clarity, and factual reliability across outputs.",
      "Collaborated with cross-review and technical teams to streamline evaluation workflows.",
    ],
  },
  {
    title: "AI / Machine Learning Translated Output Analyst",
    type: "Remote",
    company: "Appen",
    period: "Aug 2025 – Jan 25",
    color: "from-pink-500 to-rose-500",
    points: [
      "Reviewed and refined 1,000+ machine-translated and AI-generated records, achieving 90%+ quality accuracy.",
      "Translated complex guidelines into actionable review processes and collaborated with cross-functional technical teams to streamline evaluation cycles.",
    ],
  },
  {
    title: "Full Stack Developer Intern",
    type: "Internship",
    company: "Zidio Development",
    period: "Mar 2025 – May 2025",
    color: "from-emerald-500 to-teal-500",
    points: [
      "Boosted front-end performance by 20% through modular, responsive design using MERN stack.",
      "Reduced backend query time by 15% and data flow for real-time app performance.",
    ],
  },
  {
    title: "SOC Intern",
    type: "Internship",
    company: "Industrial Training Program at IntelVerse Academy",
    period: "Jun 2025 – Sept 2025",
    color: "from-orange-500 to-amber-500",
    points: [
      "Monitored and analyzed alerts using SIEM (Wazuh), identifying phishing and malware patterns.",
      "Triaged and escalated incidents, improving detection accuracy by 15% through IOC enrichment with CyberChef and Wireshark.",
    ],
  },
];

const PROJECTS = [
  {
    title: "DemiSense.AI",
    subtitle: "AI-Powered Healthcare & Brain Disorder Detection Platform",
    description: "Led requirement analysis and translated healthcare business needs into a scalable full-stack architecture (React, Node.js, MySQL), integrating AI-driven CT scan analysis, multi-role user workflows (patients/doctors), secure authentication (JWT), and real-time appointment management.",
    tags: ["React", "Node.js", "MySQL", "JWT", "AI/ML", "REST API"],
    color: "from-violet-600 to-indigo-600",
    icon: "🧠",
    github: "https://github.com/Subh41/DemiSense.AI",
    highlight: "Published at ICDCIT 2026 – KIIT University",
  },
  {
    title: "TeeStyle",
    subtitle: "MERN-Based E-Commerce & Admin Management Platform",
    description: "Analyzed business requirements and designed a scalable MERN-based e-commerce architecture with separate client and admin applications, implementing secure authentication (JWT), role-based access control, payment gateway integration, and structured order management workflows.",
    tags: ["React", "Node.js", "MongoDB", "Express.js", "JWT", "E-Commerce"],
    color: "from-pink-600 to-rose-600",
    icon: "👕",
    github: "https://github.com/Subh41/TeeStyle",
    highlight: "★ 1 Star on GitHub",
  },
  {
    title: "PreSense",
    subtitle: "Early Disease Detection System (Asthma & Pneumonia Classification)",
    description: "Analyzed clinical requirements and designed an end-to-end machine learning pipeline for lung sound classification, implementing spectral feature extraction and multi-model evaluation (SVM, KNN, Decision Trees), achieving 96.7% accuracy in early disease detection.",
    tags: ["Python", "Machine Learning", "SVM", "KNN", "Streamlit", "Healthcare"],
    color: "from-emerald-600 to-teal-600",
    icon: "🫁",
    github: "https://github.com/Subh41/PreSense",
    highlight: "96.7% Accuracy",
  },
  {
    title: "MedConsult",
    subtitle: "Medical Consultation System with Built-in AI",
    description: "Implemented a medical consultation system along with built-in AI for personal assistance for users/patients. Features include consultation scheduling, AI-powered health advice, and a user-friendly interface.",
    tags: ["PHP", "HTML", "CSS", "MySQL", "AI Integration"],
    color: "from-cyan-600 to-blue-600",
    icon: "🏥",
    github: "https://github.com/Subh41/MedConsult",
    highlight: "MIT License",
  },
  {
    title: "HostelCypher 2.0",
    subtitle: "Advanced Hostel Allocation & Management System",
    description: "Updated the HostelCypher project to the next level with more efficiency and user-friendliness. A comprehensive hostel room allocation and deallocation system for students.",
    tags: ["PHP", "HTML", "CSS", "MySQL", "System Design"],
    color: "from-orange-600 to-amber-600",
    icon: "🏠",
    github: "https://github.com/Subh41/HostelCypher-2.0",
    highlight: "Enhanced v2.0",
  },
  {
    title: "Time-in-Box",
    subtitle: "Time Management System for Students",
    description: "A comprehensive tool designed to boost productivity and academic success for students. Enables students to prioritize tasks, set realistic goals, and manage their schedules effectively.",
    tags: ["HTML", "CSS", "JavaScript", "Productivity"],
    color: "from-purple-600 to-violet-600",
    icon: "⏰",
    github: "https://github.com/Subh41/Time-Management-System",
    highlight: "Student Productivity Tool",
  },
  {
    title: "AutoPASS",
    subtitle: "Automatic Fire Extinguisher – Arduino IoT Project",
    description: "An Arduino-based IoT project on Fire Extinguisher to make it more accessible for common people who aren't aware of the working procedure of a manual Fire Extinguisher. Automated fire detection and suppression.",
    tags: ["C++", "Arduino", "IoT", "Hardware", "Embedded Systems"],
    color: "from-red-600 to-orange-600",
    icon: "🔥",
    github: "https://github.com/Subh41/Automatic-Fire-Extinguisher",
    highlight: "IoT Hardware Project",
  },
  {
    title: "Sea of C",
    subtitle: "C Programming Repository",
    description: "A curated dump of C programming codes covering various algorithms, data structures, and problem-solving approaches. Useful for learning and reference.",
    tags: ["C", "Algorithms", "Data Structures", "Programming"],
    color: "from-slate-600 to-gray-600",
    icon: "🌊",
    github: "https://github.com/Subh41/sea-of-C",
    highlight: "Open Source Learning",
  },
];

const CERTIFICATIONS = [
  { name: "The Joy of Computing using Python (Elite)", issuer: "NPTEL, IIT Madras", date: "Jan–Apr 2025", icon: "🐍" },
  { name: "C Essential Training", issuer: "LinkedIn Learning", date: "Nov 2024", icon: "🔷" },
  { name: "Java Object-Oriented Programming", issuer: "LinkedIn Learning", date: "Nov 2024", icon: "☕" },
  { name: "Memorization & Rehearsal Tips for Public Speaking", issuer: "LinkedIn Learning", date: "May 2024", icon: "🎤" },
  { name: "Global Employability Test 2025", issuer: "ETS", date: "Oct 2025", icon: "🌐" },
  { name: "Cyber Security Fundamentals", issuer: "University of London", date: "Oct 2025", icon: "🛡️" },
  { name: "Advanced System Security Topics", issuer: "University of Colorado System", date: "Oct 2024", icon: "🔐" },
  { name: "Information Theory", issuer: "The Chinese University of Hong Kong", date: "Mar 2025", icon: "📡" },
  { name: "Google Cloud & Cloud Computing Specializations", issuer: "United Latino Students Association", date: "2024", icon: "☁️" },
];

const ACHIEVEMENTS = [
  {
    title: "Research Paper Published – ICDCIT 2026",
    org: "International Conference, KIIT University",
    description: 'Published "DemiSense.AI" in "Project Innovations in Distributed Computing and Intelligent Technology (1st Edition)", recognized for innovation in AI-driven healthcare system design and intelligent distributed architecture.',
    icon: "📄",
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Smart India Hackathon (SIH) 2024 – Participant",
    org: "Government of India",
    description: "Contributed to requirement analysis, system architecture design, and solution strategy under national-level competitive evaluation.",
    icon: "🏆",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Best Performing SOC Analyst – Appreciation Award",
    org: "IntelVerse Academy",
    description: "Recognized for excellence in threat monitoring, incident analysis, and security event investigation compared to peer participants.",
    icon: "🥇",
    color: "from-emerald-500 to-teal-500",
  },
];

// ─── Animated Background ──────────────────────────────────────────────────────
function AnimatedBackground({ section }: { section: string }) {
  const gradients: Record<string, string> = {
    hero: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.15) 0%, transparent 60%)",
    about: "radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.2) 0%, transparent 60%)",
    skills: "radial-gradient(ellipse at 50% 20%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.15) 0%, transparent 60%)",
    experience: "radial-gradient(ellipse at 30% 60%, rgba(249,115,22,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.2) 0%, transparent 60%)",
    projects: "radial-gradient(ellipse at 60% 40%, rgba(236,72,153,0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(99,102,241,0.2) 0%, transparent 60%)",
    certifications: "radial-gradient(ellipse at 40% 30%, rgba(245,158,11,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.2) 0%, transparent 60%)",
    achievements: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 60%)",
    contact: "radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.2) 0%, transparent 60%)",
  };

  return (
    <motion.div
      key={section}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{ background: "#0a0a14" }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ backgroundImage: gradients[section] || gradients.hero }}
      />
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.5, 1] }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </motion.div>
  );
}

// ─── Floating Orbs ────────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {[
        { cx: "10%", cy: "20%", color: "rgba(99,102,241,0.15)", size: 300, dur: 20 },
        { cx: "80%", cy: "60%", color: "rgba(139,92,246,0.12)", size: 400, dur: 25 },
        { cx: "50%", cy: "80%", color: "rgba(236,72,153,0.1)", size: 250, dur: 18 },
        { cx: "70%", cy: "10%", color: "rgba(6,182,212,0.1)", size: 200, dur: 22 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.cx,
            top: orb.cy,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-xl font-bold text-gradient cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollTo("hero")}
        >
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`nav-link text-sm font-medium transition-colors ${
                active === s.id ? "text-indigo-400 active" : "text-gray-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden glass border-t border-white/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`text-left text-sm font-medium py-1 ${
                    active === s.id ? "text-indigo-400" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function SectionWrapper({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`min-h-screen py-24 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ─── Animated Text ────────────────────────────────────────────────────────────
function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const current = texts[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, sub + 1));
        setSub(sub + 1);
        if (sub + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setText(current.substring(0, sub - 1));
        setSub(sub - 1);
        if (sub - 1 === 0) {
          setIsDeleting(false);
          setIndex((index + 1) % texts.length);
        }
      }
    }, isDeleting ? 60 : 100);
    return () => clearTimeout(timeout);
  }, [sub, isDeleting, index, texts]);

  return (
    <span>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-indigo-400 ml-1 align-middle"
      />
    </span>
  );
}

// ─── Fade In ──────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = "up", className = "" }: {
  children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" | "none"; className?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const dirs = {
    up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
    none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={dirs[direction]}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <FadeIn className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
      <div className="section-divider mt-6" />
    </FadeIn>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[200, 350, 500, 650].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-indigo-500/10"
            style={{ width: size, height: size }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Avatar */}
        <motion.div
          className="w-36 h-36 md:w-44 md:h-44 mx-auto mb-8 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full h-full rounded-full p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-pulse-glow">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-900">
              <img
                src="/images/profile.jpg"
                alt="Subhojit Das"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<div class="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-bold text-white">SD</div>';
                }}
              />
            </div>
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="text-indigo-400 font-mono text-sm md:text-base mb-3 tracking-widest uppercase">
            👋 Hello, I'm
          </p>
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Subhojit{" "}
            <span className="text-gradient">Das</span>
          </motion.h1>
          <div className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6 h-10">
            <TypewriterText texts={[
              "Full Stack Developer",
              "MERN Stack Engineer",
              "AI/ML Enthusiast",
              "Cybersecurity Analyst",
              "Problem Solver",
            ]} />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
            Software Developer with experience in building scalable, secure, and high-performance
            web applications using the MERN stack, SQL databases, and cloud platforms.
            Based in <span className="text-white">📍 Kolkata, India</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.a
            href="https://github.com/Subh41"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/subhojit-das"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full glass border border-indigo-500/30 text-white font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05, background: "rgba(99,102,241,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </motion.a>
          <motion.a
            href="mailto:subhojitdas0019@gmail.com"
            className="px-8 py-3 rounded-full glass border border-pink-500/30 text-white font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05, background: "rgba(236,72,153,0.15)" }}
            whileTap={{ scale: 0.95 }}
          >
            ✉️ Contact Me
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs font-mono tracking-widest">SCROLL DOWN</span>
          <motion.div
            className="w-0.5 h-12 bg-gradient-to-b from-indigo-500 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const stats = [
    { label: "CGPA", value: "8.0/10", icon: "🎓" },
    { label: "Projects", value: "8+", icon: "🚀" },
    { label: "Experience", value: "5+", icon: "💼" },
    { label: "Certifications", value: "9+", icon: "📜" },
  ];

  return (
    <SectionWrapper id="about">
      <SectionTitle title="About Me" subtitle="My background & education" />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <FadeIn direction="left">
          <div className="glass-strong rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">👨‍💻</span> Summary
            </h3>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              Software Developer with experience in building <span className="text-indigo-400 font-semibold">scalable, secure, and high-performance</span> web
              applications using the MERN stack, SQL databases, and cloud platforms. Skilled in designing
              RESTful APIs, implementing secure authentication mechanisms, and optimizing backend performance.
            </p>
            <p className="text-gray-300 leading-relaxed text-base">
              Strong in translating functional requirements into efficient technical solutions while maintaining
              clean, maintainable, and production-ready code aligned with modern software engineering standards.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              {["MERN Stack", "Cloud Platforms", "Cybersecurity", "AI/ML", "System Design"].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="right">
          <div className="space-y-4">
            <div className="glass-strong rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎓</span> Education
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-indigo-500 pl-4">
                  <p className="text-white font-semibold">B.Tech in Computer Science Engineering</p>
                  <p className="text-indigo-400 text-sm">University of Engineering and Management, Kolkata</p>
                  <p className="text-gray-400 text-sm">2023 – Present</p>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                    CGPA: 8.0/10
                  </span>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-white font-semibold">Higher Secondary (WBCHSE)</p>
                  <p className="text-gray-400 text-sm">Jodhpur Park Boys School, Kolkata | 2020–2022</p>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">86%</span>
                </div>
                <div className="border-l-2 border-pink-500 pl-4">
                  <p className="text-white font-semibold">Secondary (WBBSE)</p>
                  <p className="text-gray-400 text-sm">Jodhpur Park Boys School, Kolkata | Till 2020</p>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold">87.14%</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <FadeIn key={stat.label} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-4 text-center card-hover">
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-black text-gradient">{stat.value}</div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────
function SkillsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="skills">
      <SectionTitle title="Skills" subtitle="My technical arsenal" />
      <div ref={ref} className="grid md:grid-cols-2 gap-6">
        {Object.entries(SKILLS).map(([category, skills], catIndex) => (
          <FadeIn key={category} delay={catIndex * 0.1}>
            <div className="glass-strong rounded-3xl p-6 h-full card-hover">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" />
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium glass border border-white/10 text-gray-200 flex items-center gap-1.5 cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: catIndex * 0.1 + i * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.1, borderColor: "rgba(99,102,241,0.5)", color: "#a5b4fc" }}
                  >
                    <span>{TECH_ICONS[skill] || "⚡"}</span>
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Experience Section ───────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <SectionWrapper id="experience">
      <SectionTitle title="Experience" subtitle="My professional journey" />
      <div className="relative pl-10">
        <div className="timeline-line" />
        <div className="space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <FadeIn key={i} delay={i * 0.15} direction="left">
              <div className="relative">
                <div className="timeline-dot" style={{ top: "1.5rem" }} />
                <div className="glass-strong rounded-3xl p-6 card-hover ml-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300">
                        {exp.period}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300">
                        {exp.type}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.points.map((pt, j) => (
                      <li key={j} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-indigo-400 mt-1 shrink-0">▸</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "React", "Python", "PHP", "C++", "AI/ML"];

  const filtered = filter === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.tags.some((t) => t.includes(filter)));

  return (
    <SectionWrapper id="projects">
      <SectionTitle title="Projects" subtitle="Things I've built" />

      {/* Filter tabs */}
      <FadeIn>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "glass border border-white/10 text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      <motion.div
        layout
        className="grid md:grid-cols-2 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence>
          {filtered.map((proj, i) => (
            <motion.div
              key={proj.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="glass-strong rounded-3xl overflow-hidden card-hover h-full flex flex-col">
                {/* Header */}
                <div className={`bg-gradient-to-r ${proj.color} p-6 relative overflow-hidden`}>
                  <div className="text-5xl mb-2">{proj.icon}</div>
                  <h3 className="text-xl font-black text-white">{proj.title}</h3>
                  <p className="text-white/80 text-sm mt-1">{proj.subtitle}</p>
                  {proj.highlight && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                      {proj.highlight}
                    </span>
                  )}
                  {/* Decorative circles */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-lg text-xs bg-white/10 text-gray-300 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    View on GitHub →
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
}

// ─── Certifications Section ───────────────────────────────────────────────────
function CertificationsSection() {
  return (
    <SectionWrapper id="certifications">
      <SectionTitle title="Certifications" subtitle="Continuous learning & growth" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATIONS.map((cert, i) => (
          <FadeIn key={cert.name} delay={i * 0.08}>
            <div className="glass-strong rounded-2xl p-5 card-hover border border-white/5 hover:border-indigo-500/30 transition-colors h-full">
              <div className="text-3xl mb-3">{cert.icon}</div>
              <h3 className="text-white font-bold text-sm mb-1 leading-snug">{cert.name}</h3>
              <p className="text-indigo-400 text-xs mb-1">{cert.issuer}</p>
              <p className="text-gray-500 text-xs">{cert.date}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Achievements Section ─────────────────────────────────────────────────────
function AchievementsSection() {
  return (
    <SectionWrapper id="achievements">
      <SectionTitle title="Achievements" subtitle="Milestones & recognition" />
      <div className="grid md:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((ach, i) => (
          <FadeIn key={ach.title} delay={i * 0.15}>
            <div className="glass-strong rounded-3xl p-6 card-hover h-full relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${ach.color} opacity-5`} />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{ach.icon}</div>
                <h3 className="text-white font-bold text-base mb-1">{ach.title}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${ach.color} bg-clip-text text-transparent mb-3`}>
                  {ach.org}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">{ach.description}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const contacts = [
    { icon: "✉️", label: "Email", value: "subhojitdas0019@gmail.com", href: "mailto:subhojitdas0019@gmail.com" },
    { icon: "📱", label: "Phone", value: "+918910250019", href: "tel:+918910250019" },
    { icon: "📍", label: "Location", value: "Kolkata, India", href: null },
    { icon: "🐙", label: "GitHub", value: "github.com/Subh41", href: "https://github.com/Subh41" },
  ];

  return (
    <SectionWrapper id="contact">
      <SectionTitle title="Contact" subtitle="Let's work together" />
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="glass-strong rounded-3xl p-8 md:p-12 text-center mb-8">
            <div className="text-6xl mb-6">🤝</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Let's Build Something <span className="text-gradient">Amazing</span>
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed mb-8">
              I'm always open to new opportunities, collaborations, and exciting projects.
              Whether it's a job offer, a freelance gig, or just a chat — feel free to reach out!
            </p>
            <motion.a
              href="mailto:subhojitdas0019@gmail.com"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              ✉️ Send Me an Email
            </motion.a>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contacts.map((c, i) => (
            <FadeIn key={c.label} delay={i * 0.1}>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="glass-strong rounded-2xl p-5 text-center card-hover block hover:border-indigo-500/30 border border-transparent transition-colors"
                >
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className="text-white text-xs font-semibold truncate">{c.value}</p>
                </a>
              ) : (
                <div className="glass-strong rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className="text-white text-xs font-semibold">{c.value}</p>
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 text-center border-t border-white/5">
      <p className="text-gray-500 text-sm">
        Crafted with <span className="text-red-400">❤️</span> by{" "}
        <span className="text-gradient font-semibold">Subhojit Das</span>
        {" "} · {new Date().getFullYear()}
      </p>
      <p className="text-gray-600 text-xs mt-1">Built with React + TypeScript + Tailwind CSS + Framer Motion</p>
    </footer>
  );
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
      }}
    />
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="bg-[#0a0a14] min-h-screen text-white overflow-x-hidden">
      <ScrollProgress />
      <FloatingOrbs />
      <AnimatedBackground section={activeSection} />
      <Navbar active={activeSection} />

      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificationsSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
