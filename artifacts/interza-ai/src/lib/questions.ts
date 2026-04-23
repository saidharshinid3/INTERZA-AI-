export interface Question {
  id: string;
  text: string;
}

const db: Record<string, { practice: string[]; technical: string[]; behavioural: string[] }> = {
  "Software Engineer": {
    practice: [
      "Tell me about a time you had to learn a new technology quickly.",
      "How do you handle disagreements with team members about technical decisions?",
      "Can you explain the difference between processes and threads?",
      "Describe a project where you had to optimize performance.",
      "What is your approach to writing testable code?",
      "How do you stay updated with the latest software engineering trends?",
      "Explain the concept of dependency injection.",
      "Tell me about a challenging bug you fixed.",
      "How do you design a scalable microservices architecture?",
      "What's your experience with CI/CD pipelines?",
      "Describe a time you failed to meet a deadline.",
      "How do you ensure the security of a web application?",
      "Explain REST vs. GraphQL.",
      "What are the solid principles of object-oriented design?",
      "Tell me about your experience leading a technical initiative.",
      "How do you balance technical debt with delivering features?",
      "Explain the concept of a closure in JavaScript.",
      "Describe a time you had to refactor a large codebase.",
      "How do you handle a production incident?",
      "What is your favorite programming language and why?",
      "Explain indexing in databases.",
      "Tell me about a time you mentored a junior developer.",
      "How do you approach code reviews?",
      "What are the benefits of using containers like Docker?",
      "Explain the difference between SQL and NoSQL databases.",
      "Describe a time you had to work with ambiguous requirements.",
      "How do you handle state management in React?",
      "What are the trade-offs of server-side rendering?",
      "Tell me about a complex algorithmic problem you solved.",
      "How do you document your code?"
    ],
    technical: [
      "Design a URL shortening service like bit.ly.",
      "How would you implement a rate limiter?",
      "Explain how a garbage collector works in modern languages.",
      "What is the time complexity of searching in a binary search tree?",
      "How would you detect a cycle in a directed graph?",
      "Explain the differences between optimistic and pessimistic locking.",
      "How would you build a real-time chat application?",
      "Design an elevator system for a skyscraper."
    ],
    behavioural: [
      "Tell me about a time you disagreed with your manager.",
      "Describe a situation where you had to influence without authority.",
      "How do you handle receiving negative feedback?",
      "Tell me about a time you had to deliver bad news to a stakeholder.",
      "Describe a conflict you had with a co-worker and how you resolved it.",
      "Tell me about a time you stepped outside your comfort zone.",
      "How do you prioritize multiple competing deadlines?",
      "Describe a time you proposed a new idea that was initially rejected."
    ]
  },
  "UI/UX Designer": {
    practice: [
      "Tell me about your design process.",
      "How do you balance business goals with user needs?",
      "Explain your approach to accessibility in design.",
      "Describe a time you had to design for a complex user workflow.",
      "How do you conduct user research?",
      "Tell me about a design you are particularly proud of.",
      "How do you handle negative feedback on your designs?",
      "Explain the difference between UX and UI.",
      "What are your favorite design tools and why?",
      "How do you stay updated with design trends?",
      "Describe a time you had to advocate for the user.",
      "How do you create a design system?",
      "Tell me about a time you failed in a design project.",
      "How do you collaborate with developers?",
      "Explain your experience with wireframing and prototyping.",
      "How do you measure the success of a design?",
      "Describe a challenging interaction you designed.",
      "What is your approach to mobile-first design?",
      "Tell me about a time you had to compromise on a design.",
      "How do you handle scope creep in a design project?",
      "Explain the importance of white space in design.",
      "How do you approach typography in your designs?",
      "Tell me about a time you used data to inform a design decision.",
      "How do you ensure consistency across different platforms?",
      "Describe a time you had to work with a difficult stakeholder.",
      "What is your process for creating user personas?",
      "How do you handle usability testing?",
      "Explain your approach to micro-interactions.",
      "Tell me about a time you had to learn a new domain quickly.",
      "How do you present your designs to non-designers?"
    ],
    technical: [
      "Walk me through how you would redesign the checkout flow for an e-commerce app.",
      "How would you approach designing a dashboard for a data-heavy application?",
      "Critique the design of a popular app you use.",
      "Explain how you structure a Figma file for handoff.",
      "How do you test the accessibility of your designs?",
      "Describe your process for conducting a heuristic evaluation.",
      "How do you decide between a modal and a new page for a specific action?",
      "Explain your approach to designing error states and empty states."
    ],
    behavioural: [
      "Tell me about a time you received harsh criticism on a design.",
      "Describe a situation where you had to push back against a feature request.",
      "How do you handle working with developers who don't follow the design?",
      "Tell me about a time you had to meet a tight deadline for a design deliverable.",
      "Describe a conflict within a design team and your role in it.",
      "Tell me about a time you advocated for accessibility.",
      "How do you handle ambiguity in design requirements?",
      "Describe a time you had to pivot your design strategy mid-project."
    ]
  },
  "Business Analyst": {
    practice: [
      "Tell me about a time you had to gather requirements from difficult stakeholders.",
      "How do you prioritize requirements?",
      "Explain your approach to creating a business case.",
      "Describe a time you identified a process improvement.",
      "How do you handle changing requirements?",
      "Tell me about a successful project you worked on.",
      "How do you translate business needs into technical specifications?",
      "Explain your experience with data analysis and visualization.",
      "What tools do you use for modeling processes?",
      "How do you ensure stakeholders agree on the requirements?",
      "Describe a time you had to mediate a conflict between stakeholders.",
      "How do you measure the success of a project?",
      "Tell me about a time a project failed to meet its objectives.",
      "How do you handle scope creep?",
      "Explain your approach to risk management.",
      "How do you communicate complex technical concepts to business users?",
      "Tell me about a time you had to learn a new business domain.",
      "How do you validate that a solution meets the business needs?",
      "Explain your experience with agile methodologies.",
      "How do you handle a situation where stakeholders have conflicting requirements?",
      "Describe a time you had to work with incomplete data.",
      "How do you create user stories?",
      "Tell me about a time you had to present a challenging recommendation.",
      "How do you track project progress?",
      "Explain your approach to vendor evaluation.",
      "How do you handle a stakeholder who is unresponsive?",
      "Describe a time you had to analyze a large dataset.",
      "How do you facilitate a requirement gathering workshop?",
      "Tell me about a time you had to say no to a stakeholder.",
      "How do you ensure requirements are traceable?"
    ],
    technical: [
      "How would you approach modeling the process for a new customer onboarding workflow?",
      "Walk me through how you would create a data dictionary.",
      "Explain how you use SQL for data analysis.",
      "How do you structure a functional specification document?",
      "Describe your process for conducting a gap analysis.",
      "How do you evaluate the ROI of a proposed solution?",
      "Explain your approach to UAT (User Acceptance Testing).",
      "How do you handle mapping legacy data to a new system?"
    ],
    behavioural: [
      "Tell me about a time you had to influence a senior executive.",
      "Describe a situation where a project requirement was misunderstood.",
      "How do you handle a stakeholder who constantly changes their mind?",
      "Tell me about a time you had to deliver a project under budget constraints.",
      "Describe a conflict with a project manager and how it was resolved.",
      "Tell me about a time you discovered a significant error in your analysis.",
      "How do you handle multiple projects with competing priorities?",
      "Describe a time you had to navigate a politically sensitive project."
    ]
  }
};

export function getQuestions(role: string, mode: string, round: string | null): Question[] {
  const rolePools = db[role];
  if (!rolePools) return [];

  let pool: string[] = [];

  if (mode === "Practice") {
    pool = [...rolePools.practice].sort(() => Math.random() - 0.5).slice(0, 10);
  } else if (mode === "Interview") {
    if (round === "Technical") {
      pool = [...rolePools.technical].sort(() => Math.random() - 0.5).slice(0, 8);
    } else {
      pool = [...rolePools.behavioural].sort(() => Math.random() - 0.5).slice(0, 8);
    }
  }

  return pool.map((q, i) => ({
    id: `${role}-${mode}-${round}-${i}`,
    text: q,
  }));
}
