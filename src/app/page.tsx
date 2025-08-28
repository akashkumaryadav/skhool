// app/landing/page.tsx
"use client";

import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  SparklesIcon,
  UsersIcon,
} from "@/app/components/icons";
import { APP_NAME } from "@/app/constants";
import React, { useState } from "react";
import { animated, useSpring, useTrail } from "react-spring";

// Helper: Section Component
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}
const Section: React.FC<SectionProps> = ({ children, className = "", id }) => (
  <section
    id={id}
    className={`py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}
  >
    <div className="container mx-auto max-w-screen-xl">{children}</div>
  </section>
);

// Helper: AnimatedTitle
const AnimatedTitle: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const props = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 600 }, // Simplified config
  });
  return (
    <animated.h1
      style={props}
      className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center ${className}`}
    >
      {text}
    </animated.h1>
  );
};

// Helper: AnimatedText
const AnimatedText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className, delay = 0 }) => {
  const props = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay,
    config: { duration: 500 }, // Simplified config
  });
  return (
    <animated.p
      style={props}
      className={`text-lg md:text-xl text-center ${className}`}
    >
      {text}
    </animated.p>
  );
};

// --- Landing Navigation ---
const LandingNavigation: React.FC = () => {
  const navAnimation = useSpring({
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0 },
    config: { tension: 280, friction: 60 },
  });

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const navItems = [
    { name: "Features", href: `${basePath}#features` },
    { name: "How It Works", href: `${basePath}#how-it-works` },
    {
      name: "Login",
      href: `${process.env.API_URL}/auth/login?redirect=${basePath}/teacher`,
    },
  ];

  return (
    <animated.nav
      style={navAnimation}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-blue-800">{APP_NAME}</span>
          </a>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
            >
              Sign Up
            </a>
          </div>
          <div className="md:hidden">
            <button className="text-gray-700">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </animated.nav>
  );
};

// --- Hero Section ---
const HeroSection: React.FC = () => {
  const ctaProps = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    delay: 1200,
    config: { tension: 200, friction: 12 },
  });

  const appNameSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 300,
    config: { duration: 600 },
  });

  return (
    <Section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      {/* Removed HeroThreeScene */}
      <div className="relative z-10 flex flex-col items-center">
        <animated.div style={appNameSpring}>
          <h2 className="text-6xl md:text-7xl font-app-secondary font-bold text-blue-700 mb-8 tracking-tight">
            {APP_NAME}
          </h2>
        </animated.div>
        <AnimatedTitle
          text={`Empowering Educators, Inspiring Students`}
          className="text-blue-800 mb-6"
        />
        <AnimatedText
          text="Discover a smarter way to manage classrooms, track performance, and engage with students using AI-powered tools."
          className="text-gray-600 max-w-2xl mb-10"
          delay={600}
        />
        <animated.button
          style={ctaProps}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-xl hover:shadow-2xl transition text-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Explore Features
        </animated.button>
      </div>
    </Section>
  );
};

// --- Features Section ---
interface FeatureItem {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: "f1",
    icon: UsersIcon,
    title: "Student Management",
    description:
      "Effortlessly manage student profiles, attendance, and information.",
  },
  {
    id: "f2",
    icon: DocumentChartBarIcon,
    title: "Performance Tracking",
    description:
      "Visualize student grades and progress with insightful analytics.",
  },
  {
    id: "f3",
    icon: SparklesIcon,
    title: "AI Helper",
    description:
      "Get instant support for lesson planning, quiz generation, and more.",
  },
  {
    id: "f4",
    icon: BookOpenIcon,
    title: "Learning Resources",
    description:
      "Centralized hub for accessing and sharing educational materials.",
  },
  {
    id: "f5",
    icon: CalendarDaysIcon,
    title: "Attendance System",
    description: "Quick and easy attendance marking with insightful reports.",
  },
  {
    id: "f6",
    icon: AcademicCapIcon,
    title: "Comprehensive Grading",
    description: "Flexible grading system adaptable to various exam types.",
  },
];

const FeatureCard: React.FC<{
  feature: FeatureItem;
  style: React.CSSProperties;
}> = ({ feature, style }) => {
  const [hovered, setHovered] = useState(false);
  const iconSpring = useSpring({
    transform: hovered ? "scale(1.2) rotate(5deg)" : "scale(1) rotate(0deg)",
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.div
      style={style as unknown as React.CSSProperties}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <animated.div
        style={iconSpring}
        className="mb-6 p-4 bg-blue-100 rounded-full inline-block"
      >
        <feature.icon className="w-10 h-10 text-blue-600" />
      </animated.div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-600 text-sm">{feature.description}</p>
    </animated.div>
  );
};

const FeaturesSection: React.FC = () => {
  const trail = useTrail(features.length, {
    from: { opacity: 0, transform: "translateY(50px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { mass: 1, tension: 280, friction: 25 },
    delay: 200,
  });

  return (
    <Section id="features" className="bg-gray-50">
      <AnimatedTitle
        text="Powerful Features, Seamlessly Integrated"
        className="text-gray-800 mb-4"
      />
      <AnimatedText
        text={`Explore how ${APP_NAME} simplifies your teaching workflow and enhances student engagement.`}
        className="text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16"
        delay={300}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trail.map((style, index) => (
          <FeatureCard
            key={features[index].id}
            feature={features[index]}
            style={style as unknown as React.CSSProperties}
          />
        ))}
      </div>
    </Section>
  );
};

// --- How It Works Section ---
const steps = [
  {
    id: "h1",
    icon: UsersIcon,
    title: "Sign Up & Setup",
    description:
      "Quickly register your school and set up your teacher profile.",
  },
  {
    id: "h2",
    icon: CalendarDaysIcon,
    title: "Manage Classes",
    description:
      "Add students, organize classes, and schedule timetables with ease.",
  },
  {
    id: "h3",
    icon: SparklesIcon,
    title: "Teach & Track",
    description:
      "Utilize AI tools, record grades, and monitor student progress.",
  },
  {
    id: "h4",
    icon: DocumentChartBarIcon,
    title: "Gain Insights",
    description:
      "Access reports and analytics to understand performance trends.",
  },
];

const HowItWorksSection: React.FC = () => {
  const trail = useTrail(steps.length, {
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 300,
  });

  return (
    <Section id="how-it-works" className="bg-blue-800 text-white">
      <AnimatedTitle
        text="Get Started in Minutes"
        className="text-white mb-4"
      />
      <AnimatedText
        text={`Follow these simple steps to integrate ${APP_NAME} into your daily routine.`}
        className="text-blue-100 max-w-xl mx-auto mb-12 md:mb-16"
        delay={300}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {trail.map((style, index) => {
          const step = steps[index];
          return (
            <animated.div
              key={step.id}
              style={style}
              className="flex flex-col items-center text-center p-6 bg-blue-700 rounded-lg shadow-xl"
            >
              <div className="mb-4 p-3 bg-orange-500 rounded-full">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-blue-200 text-sm">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 w-16">
                  <svg
                    width="100%"
                    height="20"
                    viewBox="0 0 64 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10H56L48 2M56 10L48 18"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              )}
            </animated.div>
          );
        })}
      </div>
    </Section>
  );
};

// --- Testimonials Section (Placeholder) ---
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  style?: React.CSSProperties;
}> = ({ quote, author, style }) => (
  <animated.div
    style={style}
    className="bg-white p-8 rounded-xl shadow-lg text-center"
  >
    <p className="text-gray-700 italic text-lg mb-4">&ldquo{quote}&rdquo</p>
    <p className="font-semibold text-blue-700">- {author}</p>
  </animated.div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: `${APP_NAME} has transformed how I manage my classroom. The AI tools are a lifesaver!`,
      author: "A. Kaur, Science Teacher",
    },
    {
      quote:
        "Tracking student performance has never been easier. Highly recommended!",
      author: "R. Patel, Maths Coordinator",
    },
    {
      quote:
        "Our teachers love the intuitive interface and the time it saves them.",
      author: "Principal V. Singh",
    },
  ];
  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <Section id="testimonials" className="bg-gray-100">
      <AnimatedTitle
        text="Loved by Educators Like You"
        className="text-gray-800 mb-4"
      />
      <AnimatedText
        text={`Hear what teachers and administrators are saying about ${APP_NAME}.`}
        className="text-gray-600 max-w-xl mx-auto mb-12 md:mb-16"
        delay={300}
      />
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <TestimonialCard
            key={i}
            quote={testimonial.quote}
            author={testimonial.author}
            style={props as unknown as React.CSSProperties}
          />
        ))}
      </div>
    </Section>
  );
};

// --- Footer CTA ---
const FooterCTASection: React.FC = () => {
  const ctaProps = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 180, friction: 12 },
  });
  return (
    <Section
      id="footer-cta"
      className="bg-gradient-to-r from-blue-700 to-purple-700 text-white"
    >
      <animated.div style={ctaProps} className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Elevate Your Teaching Experience?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto mb-10">
          Join hundreds of educators who are making a difference with {APP_NAME}
          . Sign up today for a free trial or request a personalized demo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg shadow-xl hover:shadow-2xl transition text-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Get Started Free
          </a>
          <a
            href="/contact"
            className="bg-transparent hover:bg-white/20 border-2 border-white text-white font-bold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transition text-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-opacity-50"
          >
            Request a Demo
          </a>
        </div>
      </animated.div>
    </Section>
  );
};

// --- Footer ---
const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-screen-xl text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="/about" className="hover:text-white transition-colors">
            About Us
          </a>
          <a href="/contact" className="hover:text-white transition-colors">
            Contact
          </a>
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <SparklesIcon className="h-6 w-6 text-orange-500" />
          <p className="text-lg font-semibold">{APP_NAME}</p>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built with passion for education in India.
        </p>
      </div>
    </footer>
  );
};

// --- Main Landing Page Component ---
const LandingPage: React.FC = () => {
  return (
    <div className="font-app-primary antialiased">
      <LandingNavigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FooterCTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
// Revalidate every 60 seconds
