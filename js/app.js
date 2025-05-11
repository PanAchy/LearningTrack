// Main Application JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    
    
    // Initialize exercise handling
    initExercises();
    
    // Check for initial route
    handleInitialRoute();
});

// Helper: Show welcome screen
function showWelcomeScreen() {
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        contentArea.innerHTML = '';
        // Hardcoded welcome screen markup (matches index.html)
        const welcome = document.createElement('div');
        welcome.className = 'welcome-screen';
        welcome.innerHTML = `
            <h1>Welcome to Your Software Engineering Learning Portal</h1>
            <p>Start your structured learning journey with interactive exercises and progress tracking.</p>
            <div class="tech-tracks">
                <div class="track-card">
                    <h3>Technology Track</h3>
                    <div class="tech-icons">
                        <div class="tech-icon">
                            <i class="fab fa-vuejs fa-2x" style="color:#42b883;"></i>
                            <span>Vue.js</span>
                        </div>
                        <div class="tech-icon">
                            <i class="fas fa-code fa-2x" style="color:#68217A;"></i>
                            <span>C#</span>
                        </div>
                        <div class="tech-icon">
                            <i class="fas fa-database fa-2x" style="color:#003B57;"></i>
                            <span>SQLite</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="getting-started">
                <h2>Getting Started</h2>
                <p>Choose a module from the sidebar to begin your learning journey!</p>
                <button id="start-learning" class="cta-button">Start Learning</button>
            </div>
        `;
        contentArea.appendChild(welcome);
    }
    // Remove module/lesson params from URL
    window.history.replaceState({}, '', window.location.pathname);
    // Clear current lesson/module state if possible
    if (window.contentLoader) {
        window.contentLoader.currentModule = null;
        window.contentLoader.currentLesson = null;
    }
}

// Initialize the sidebar navigation
function initNavigation() {
    const moduleNavigation = document.getElementById('module-navigation');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Create navigation items
    curriculum.modules.forEach(module => {
        const moduleItem = document.createElement('div');
        moduleItem.className = 'module-item';
        
        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'module-header';
        moduleHeader.dataset.moduleId = module.id;
        
        const moduleStatus = window.progressTracker.getModuleStatus(module.id);
        
        moduleHeader.innerHTML = `
            <div class="module-title-wrapper">
                <i class="module-icon fas ${module.icon}"></i>
                <span class="module-title">${module.title}</span>
            </div>
            <div class="module-right">
                <span class="module-status status-${moduleStatus}"></span>
                <i class="icon fas fa-chevron-right"></i>
            </div>
        `;
        
        // Create lessons list
        const lessonsList = document.createElement('div');
        lessonsList.className = 'lessons-list';
        
        module.lessons.forEach(lesson => {
            const lessonItem = document.createElement('div');
            lessonItem.className = 'lesson-item';
            lessonItem.dataset.lessonId = lesson.id;
            
            const lessonStatus = window.progressTracker.getLessonStatus(module.id, lesson.id);
            
            lessonItem.innerHTML = `
                <i class="fas fa-book-open"></i>
                <span class="lesson-title">${lesson.title}</span>
                <span class="lesson-status status-${lessonStatus}"></span>
            `;
            
            // Add click event to load the lesson
            lessonItem.addEventListener('click', () => {
                window.contentLoader.loadLesson(module.id, lesson.id);
            });
            
            lessonsList.appendChild(lessonItem);
        });
        
        // Add click event to toggle the module expansion
        moduleHeader.addEventListener('click', () => {
            moduleItem.classList.toggle('expanded');
            moduleHeader.classList.toggle('expanded');
        });
        
        moduleItem.appendChild(moduleHeader);
        moduleItem.appendChild(lessonsList);
        moduleNavigation.appendChild(moduleItem);
    });
    
    // Home button click: Show welcome screen and clear state
    const homeButton = document.querySelector('.home-button');
    if (homeButton) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault();
            showWelcomeScreen();
        });
    }
    // Handle sidebar toggle for mobile
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Initialize exercise handling
function initExercises() {
    // TODO: Implement exercise functionality
    // This will be expanded in future iterations of the portal
}

// Handle initial route (e.g., direct link to a lesson)
function handleInitialRoute() {
    // Check if there's a route in the URL
    const params = new URLSearchParams(window.location.search);
    const moduleId = params.get('module');
    const lessonId = params.get('lesson');
    
    if (moduleId && lessonId) {
        // Try to load the specified lesson
        window.contentLoader.loadLesson(moduleId, lessonId);
    } else {
        // Check if there's a last visited lesson
        const lastVisited = window.progressTracker.progressData.lastVisited;
        if (lastVisited) {
            window.contentLoader.loadLesson(lastVisited.moduleId, lastVisited.lessonId);
        }
        // Otherwise, the welcome screen will remain visible
    }
}

// Show a toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300); // Wait for the fade-out transition
    }, duration);
}

// Add a simple exercise handler
function openExercise(exerciseId) {
    // Find the exercise
    let targetExercise = null;
    let moduleId = null;
    let lessonId = null;
    
    // Search through the curriculum to find the exercise
    outerLoop:
    for (const module of curriculum.modules) {
        for (const lesson of module.lessons) {
            if (lesson.exercises) {
                const exercise = lesson.exercises.find(ex => ex.id === exerciseId);
                if (exercise) {
                    targetExercise = exercise;
                    moduleId = module.id;
                    lessonId = lesson.id;
                    break outerLoop;
                }
            }
        }
    }
    
    if (!targetExercise) {
        showToast('Exercise not found', 3000);
        return;
    }
    
    // Open the exercise modal
    const modal = document.getElementById('exercise-modal');
    const modalTitle = document.getElementById('exercise-title');
    const descriptionArea = document.getElementById('exercise-description');
    
    // Set exercise content
    modalTitle.textContent = targetExercise.title;
    descriptionArea.innerHTML = `
        <h3>${targetExercise.title}</h3>
        <p>${targetExercise.description}</p>
        <div class="exercise-meta">
            <span class="difficulty-badge difficulty-${targetExercise.difficulty}">
                ${targetExercise.difficulty.charAt(0).toUpperCase() + targetExercise.difficulty.slice(1)}
            </span>
            <span class="type-badge">
                ${targetExercise.type.charAt(0).toUpperCase() + targetExercise.type.slice(1)}
            </span>
        </div>
    `;
    
    // Mark exercise as started
    window.progressTracker.startExercise(moduleId, lessonId, exerciseId);
    
    // Show the modal
    modal.classList.add('open');
    
    // Set up close button
    document.getElementById('close-modal').onclick = () => {
        modal.classList.remove('open');
    };
    
    // TODO: Implement actual code editor, preview, and testing functionality
    // This will be expanded in future portal versions
}
