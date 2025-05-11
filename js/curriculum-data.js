// This file defines the structure of the curriculum
const curriculum = {
    modules: [
        {
            id: "essential-skills",
            title: "Essential Skills",
            icon: "fa-toolbox",
            description: "Fundamental skills that should be practiced continuously throughout your learning journey.",
            lessons: [
                {
                    id: "git-fundamentals",
                    title: "Git Fundamentals",
                    content: "content/essential-skills/git-fundamentals.md",
                    exercises: [
                        {
                            id: "git-exercise-1",
                            title: "Basic Git Workflow",
                            description: "Learn the core Git commands and workflow.",
                            type: "terminal",
                            difficulty: "beginner"
                        },
                        {
                            id: "git-exercise-2",
                            title: "Branching and Merging",
                            description: "Practice creating branches and merging changes.",
                            type: "terminal",
                            difficulty: "intermediate"
                        }
                    ]
                },
                {
                    id: "docker-basics",
                    title: "Docker Fundamentals",
                    content: "content/essential-skills/docker-basics.md",
                    exercises: [
                        {
                            id: "docker-exercise-1",
                            title: "Your First Container",
                            description: "Create and run your first Docker container.",
                            type: "terminal",
                            difficulty: "beginner"
                        }
                    ]
                },
                {
                    id: "design-patterns",
                    title: "Design Patterns",
                    content: "content/essential-skills/design-patterns.md",
                    exercises: [
                        {
                            id: "design-patterns-exercise-1",
                            title: "Factory Pattern Implementation",
                            description: "Implement the Factory design pattern.",
                            type: "code",
                            language: "javascript",
                            difficulty: "intermediate"
                        }
                    ]
                },
                {
                    id: "data-visualization",
                    title: "Data Visualization",
                    content: "content/essential-skills/data-visualization.md",
                    exercises: [
                        {
                            id: "data-viz-exercise-1",
                            title: "Basic Chart Creation",
                            description: "Create a bar chart using Chart.js.",
                            type: "code",
                            language: "javascript",
                            difficulty: "beginner"
                        }
                    ]
                },
                {
                    id: "testing-fundamentals",
                    title: "Testing Fundamentals",
                    content: "content/essential-skills/testing-fundamentals.md",
                    exercises: [
                        {
                            id: "testing-exercise-1",
                            title: "Writing Unit Tests",
                            description: "Create basic unit tests for a function.",
                            type: "code",
                            language: "javascript",
                            difficulty: "intermediate"
                        }
                    ]
                }
            ]
        },
        {
            id: "frontend-fundamentals",
            title: "Frontend Fundamentals",
            icon: "fa-desktop",
            description: "Core concepts and skills for frontend development with JavaScript, TypeScript, and component frameworks.",
            lessons: [
                {
                    id: "javascript-essentials",
                    title: "JavaScript Essentials",
                    content: "content/frontend-fundamentals/javascript-essentials.md",
                    exercises: [
                        {
                            id: "js-exercise-1",
                            title: "Working with Arrays",
                            description: "Practice array methods and transformations.",
                            type: "code",
                            language: "javascript",
                            difficulty: "beginner"
                        }
                    ]
                },
                {
                    id: "typescript-basics",
                    title: "TypeScript Basics",
                    content: "content/frontend-fundamentals/typescript-basics.md",
                    exercises: [
                        {
                            id: "ts-exercise-1",
                            title: "Type Definitions",
                            description: "Create interfaces and type definitions.",
                            type: "code",
                            language: "typescript",
                            difficulty: "beginner"
                        }
                    ]
                },
                {
                    id: "vue-fundamentals",
                    title: "Vue.js Fundamentals",
                    content: "content/frontend-fundamentals/vue-fundamentals.md",
                    exercises: [
                        {
                            id: "vue-exercise-1",
                            title: "Component Basics",
                            description: "Create your first Vue component.",
                            type: "code",
                            language: "vue",
                            difficulty: "beginner"
                        }
                    ]
                },

            ]
        },
        {
            id: "backend-development",
            title: "Backend Development",
            icon: "fa-server",
            description: "Server-side development with C#/.NET and Golang, including API design and authentication.",
            lessons: [
                {
                    id: "csharp-basics",
                    title: "C# Basics",
                    content: "content/backend-development/csharp-basics.md",
                    exercises: [
                        {
                            id: "csharp-exercise-1",
                            title: "C# Classes and Objects",
                            description: "Create classes with properties and methods.",
                            type: "code",
                            language: "csharp",
                            difficulty: "beginner"
                        }
                    ]
                },

                {
                    id: "api-design",
                    title: "API Design",
                    content: "content/backend-development/api-design.md",
                    exercises: [
                        {
                            id: "api-exercise-1",
                            title: "RESTful Endpoints",
                            description: "Design a set of RESTful API endpoints.",
                            type: "design",
                            difficulty: "intermediate"
                        }
                    ]
                }
            ]
        },
        {
            id: "database-design",
            title: "Database Design",
            icon: "fa-database",
            description: "Database design, optimization, and integration with SQLite and PostgreSQL.",
            lessons: [
                {
                    id: "sql-fundamentals",
                    title: "SQL Fundamentals",
                    content: "content/database-design/sql-fundamentals.md",
                    exercises: [
                        {
                            id: "sql-exercise-1",
                            title: "Basic SQL Queries",
                            description: "Write SELECT, INSERT, UPDATE, and DELETE queries.",
                            type: "code",
                            language: "sql",
                            difficulty: "beginner"
                        }
                    ]
                },
                {
                    id: "sqlite-basics",
                    title: "SQLite Basics",
                    content: "content/database-design/sqlite-basics.md",
                    exercises: [
                        {
                            id: "sqlite-exercise-1",
                            title: "Setting Up SQLite",
                            description: "Create a database and tables with SQLite.",
                            type: "code",
                            language: "sql",
                            difficulty: "beginner"
                        }
                    ]
                },

            ]
        },
        {
            id: "system-design",
            title: "System Design",
            icon: "fa-sitemap",
            description: "Architecture patterns, API design, scalability, and clean architecture principles.",
            lessons: [
                {
                    id: "architecture-patterns",
                    title: "Architecture Patterns",
                    content: "content/system-design/architecture-patterns.md",
                    exercises: [
                        {
                            id: "architecture-exercise-1",
                            title: "Implementing MVC",
                            description: "Build a simple application using MVC pattern.",
                            type: "project",
                            difficulty: "intermediate"
                        }
                    ]
                }
            ]
        },
        {
            id: "devops",
            title: "DevOps & Deployment",
            icon: "fa-rocket",
            description: "CI/CD, containerization, monitoring, and deployment strategies.",
            lessons: [
                {
                    id: "cicd-pipelines",
                    title: "CI/CD Pipelines",
                    content: "content/devops/cicd-pipelines.md",
                    exercises: [
                        {
                            id: "cicd-exercise-1",
                            title: "GitHub Actions Workflow",
                            description: "Create a basic CI/CD workflow with GitHub Actions.",
                            type: "code",
                            language: "yaml",
                            difficulty: "intermediate"
                        }
                    ]
                }
            ]
        },
        {
            id: "advanced-topics",
            title: "Advanced Topics",
            icon: "fa-graduation-cap",
            description: "Advanced topics including security, performance optimization, and more.",
            lessons: [
                {
                    id: "security-best-practices",
                    title: "Security Best Practices",
                    content: "content/advanced-topics/security-best-practices.md",
                    exercises: [
                        {
                            id: "security-exercise-1",
                            title: "Security Audit",
                            description: "Perform a security audit on a simple application.",
                            type: "analysis",
                            difficulty: "advanced"
                        }
                    ]
                }
            ]
        },
        {
            id: "ai-engineering",
            title: "AI Engineering",
            icon: "fa-robot",
            description: "AI integration, LLM fine-tuning, RAG systems, and agentic workflows.",
            lessons: [
                {
                    id: "llm-basics",
                    title: "LLM Basics",
                    content: "content/ai-engineering/llm-basics.md",
                    exercises: [
                        {
                            id: "llm-exercise-1",
                            title: "Prompt Engineering",
                            description: "Design effective prompts for LLMs.",
                            type: "exercise",
                            difficulty: "intermediate"
                        }
                    ]
                }
            ]
        },
        {
            id: "portal-development",
            title: "Portal Development",
            icon: "fa-code",
            description: "Upgrading this learning portal as you progress through the curriculum.",
            lessons: [
                {
                    id: "static-to-spa",
                    title: "From Static to SPA",
                    content: "content/portal-development/static-to-spa.md",
                    exercises: [
                        {
                            id: "portal-exercise-1",
                            title: "Vue.js Portal Conversion",
                            description: "Convert the static portal to a Vue.js SPA.",
                            type: "project",
                            difficulty: "intermediate"
                        }
                    ]
                },
                {
                    id: "adding-backend",
                    title: "Adding a Backend",
                    content: "content/portal-development/adding-backend.md",
                    exercises: [
                        {
                            id: "portal-exercise-2",
                            title: "API Development",
                            description: "Create a backend API for the learning portal.",
                            type: "project",
                            difficulty: "advanced"
                        }
                    ]
                }
            ]
        }
    ]
};
