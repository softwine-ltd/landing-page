export const conversationFlow = {
    start: {
        message: "Hello! I'm here to understand your software architecture needs. Would you like to start a quick consultation?",
        options: ["Yes, let's begin", "I'd prefer to browse first"],
        next: {
            "Yes, let's begin": "project_type",
            "I'd prefer to browse first": "browse_info"
        }
    },
    browse_info: {
        message: "No problem! You can explore our services anytime. When you're ready to discuss your project, just click any option.",
        options: ["Start consultation", "Tell me about your expertise"],
        next: {
            "Start consultation": "project_type",
            "Tell me about your expertise": "expertise_info"
        }
    },
    expertise_info: {
        message: "We specialize in modern software architecture and infrastructure, including:\n- Cloud-native solutions\n- Microservices architecture\n- DevOps implementation\n- Scalable system design\nWould you like to discuss your specific needs?",
        options: ["Yes, let's discuss my project", "I have more questions"],
        next: {
            "Yes, let's discuss my project": "project_type",
            "I have more questions": "contact_expert"
        }
    },
    project_type: {
        message: "What would you like to achieve with our help?",
        options: [
            "Build a new software solution",
            "Add AI capabilities to existing systems",
            "Improve existing software",
            "Move systems to the cloud",
            "Make current systems faster and better",
            "Build an AI-powered solution from scratch",
            "Not sure - need guidance"
        ],
        next: {
            "Build a new software solution": "new_system_details",
            "Add AI capabilities to existing systems": "ai_enhancement_needs",
            "Improve existing software": "project_scale",
            "Move systems to the cloud": "project_scale",
            "Make current systems faster and better": "project_scale",
            "Build an AI-powered solution from scratch": "ai_solution_details",
            "Not sure - need guidance": "guidance_needed"
        }
    },
    ai_enhancement_needs: {
        message: "What kind of AI capabilities are you interested in adding? (Select all that apply)",
        options: [
            "Automated customer support",
            "Data analysis and insights",
            "Process automation",
            "Document processing and understanding",
            "Predictive analytics",
            "Image or video analysis",
            "Other/Custom solution",
            "Continue to next step"
        ],
        next: "data_availability",
        allowMultiple: true
    },
    data_availability: {
        message: "Do you already have data that could be used to train AI models?",
        options: [
            "Yes, we have structured data",
            "Yes, but it needs organization",
            "No, we need to start collecting",
            "Not sure what data we need",
            "Would like to discuss data requirements"
        ],
        next: "project_scale"
    },
    ai_solution_details: {
        message: "Tell us about the AI-powered solution you envision:",
        type: "form",
        fields: [
            { name: "description", label: "What problem should the AI solve?" },
            { name: "expected_outcome", label: "What outcomes are you looking for?" }
        ],
        next: "ai_inspiration"
    },
    ai_inspiration: {
        message: "Have you seen similar AI solutions that inspired your idea?",
        options: [
            "Yes, I can share examples",
            "No, but interested in possibilities",
            "This would be something unique",
            "Not sure - need guidance"
        ],
        next: "data_availability"
    },
    new_system_details: {
        message: "Could you briefly describe what kind of software solution you're looking to build? (For example: customer portal, internal tool, mobile app, etc.)",
        type: "form",
        fields: [
            { name: "description", label: "Brief description of your idea" }
        ],
        next: "similar_solutions"
    },
    similar_solutions: {
        message: "Are you aware of any similar solutions in the market that inspire your idea?",
        options: [
            "Yes, I know similar solutions",
            "No, but I'd like to learn about existing options",
            "This would be something unique"
        ],
        next: "project_scale"
    },
    guidance_needed: {
        message: "No problem! Let's start with understanding your business needs. What's the main challenge you're trying to solve?",
        type: "form",
        fields: [
            { name: "challenge", label: "What business challenge are you facing?" }
        ],
        next: "project_scale"
    },
    project_scale: {
        message: "How would you describe the size of your organization?",
        options: [
            "Small business or startup",
            "Growing company",
            "Large organization",
            "Public sector / Non-profit",
            "Personal project",
            "Not sure / Other"
        ],
        next: "timeline"
    },
    timeline: {
        message: "What's your expected timeline for this project?",
        options: [
            "Immediate start (1-2 months)",
            "Near future (3-6 months)",
            "Long-term planning (6+ months)",
            "Not sure yet"
        ],
        next: "current_challenges"
    },
    current_challenges: {
        message: "What challenges are you facing? (Select all that apply)",
        options: [
            "Missing in technical expertise",
            "System is too slow",
            "Need better security",
            "Hard to add new features",
            "High maintenance costs",
            "System crashes or errors",
            "Difficulty managing data",
            "Need automation",
            "Manual processes taking too long",
            "Need better insights from data",
            "Continue to next step"
        ],
        next: "budget_range",
        allowMultiple: true
    },
    budget_range: {
        message: "Do you have a budget range in mind for this project?",
        options: [
            "Under $50,000",
            "Between $50,000 - $200,000",
            "Over $200,000",
            "Not decided yet",
            "Would like to discuss options"
        ],
        next: "contact_info"
    },
    contact_info: {
        message: "Great! To schedule a detailed consultation, I'll need some contact information. Could you provide:",
        type: "form",
        fields: [
            { name: "name", label: "Your Name" },
            { name: "email", label: "Email Address" },
            { name: "company", label: "Company Name" }
        ],
        next: "summary"
    },
    summary: {
        message: "Thank you! I've collected all the necessary information. Would you like to:",
        options: [
            "Schedule a meeting",
            "See consultation summary",
            "End consultation"
        ],
        next: {
            "Schedule a meeting": "farewell",
            "See consultation summary": "show_summary",
            "End consultation": "farewell"
        }
    },

    show_summary: {
        message: "Here's a summary of your consultation:",
        options: ["Schedule a meeting", "End consultation"],
        next: {
            "Schedule a meeting": "farewell",
            "End consultation": "farewell"
        }
    },

    farewell: {
        message: "Thank you for your interest! Feel free to reach out if you have any questions. Have a great day!",
        options: ["Start a new consultation"],
        next: {
            "Start a new consultation": "start"
        }
    },
};
