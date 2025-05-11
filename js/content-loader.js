// Content Loader - Manages loading and displaying lesson content

class ContentLoader {
    constructor(curriculum) {
        this.curriculum = curriculum;
        this.currentModule = null;
        this.currentLesson = null;
        this.contentArea = document.getElementById('content-area');
        this.setupEventListeners();
    }

    // Set up event listeners
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('previous-lesson').addEventListener('click', () => this.navigateToPreviousLesson());
        document.getElementById('next-lesson').addEventListener('click', () => this.navigateToNextLesson());
        
        // Mark as complete button
        document.getElementById('mark-complete').addEventListener('click', () => this.markCurrentLessonComplete());
        
        // Handle the start learning button on the welcome screen
        document.getElementById('start-learning').addEventListener('click', () => {
            const nextLesson = window.progressTracker.getNextLesson();
            if (nextLesson) {
                this.loadLesson(nextLesson.moduleId, nextLesson.lessonId);
            }
        });
    }

    // Load a lesson's content
    async loadLesson(moduleId, lessonId) {
        // Find the module and lesson
        const module = this.curriculum.modules.find(m => m.id === moduleId);
        if (!module) return false;
        
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (!lesson) return false;
        
        // Update current module and lesson
        this.currentModule = module;
        this.currentLesson = lesson;
        
        // Mark the lesson as visited in the progress tracker
        window.progressTracker.visitLesson(moduleId, lessonId);
        
        // Update navigation UI
        this.updateNavigation();
        
        // Load the content
        try {
            const response = await fetch(lesson.content);
            if (!response.ok) throw new Error(`Failed to load content: ${response.status}`);
            
            const markdown = await response.text();
            const htmlContent = marked.parse(markdown);
            
            // Create lesson container
            const lessonContainer = document.createElement('div');
            lessonContainer.className = 'lesson-content';
            lessonContainer.innerHTML = htmlContent;
            
            // Clear and update content area
            this.contentArea.innerHTML = '';
            this.contentArea.appendChild(lessonContainer);
            
            // Apply syntax highlighting
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            // Update breadcrumb
            this.updateBreadcrumb(module.title, lesson.title);
            
            // Update lesson status
            this.updateLessonStatus();
            
            // Update navigation active states
            this.updateActiveNavItems(moduleId, lessonId);
            
            return true;
        } catch (error) {
            console.error('Error loading lesson content:', error);
            this.contentArea.innerHTML = `
                <div class="error-message">
                    <h2>Error Loading Content</h2>
                    <p>Sorry, there was a problem loading the lesson content.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
            return false;
        }
    }

    // Update the breadcrumb navigation
    updateBreadcrumb(moduleTitle, lessonTitle) {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item">${moduleTitle}</span>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item">${lessonTitle}</span>
        `;
    }

    // Update the next/previous lesson navigation buttons
    updateNavigation() {
        const prevButton = document.getElementById('previous-lesson');
        const nextButton = document.getElementById('next-lesson');
        
        const { prevLesson, nextLesson } = this.getAdjacentLessons();
        
        // Update previous button
        if (prevLesson) {
            prevButton.disabled = false;
            prevButton.onclick = () => this.loadLesson(prevLesson.moduleId, prevLesson.lessonId);
        } else {
            prevButton.disabled = true;
        }
        
        // Update next button
        if (nextLesson) {
            nextButton.disabled = false;
            nextButton.onclick = () => this.loadLesson(nextLesson.moduleId, nextLesson.lessonId);
        } else {
            nextButton.disabled = true;
        }
    }

    // Get the previous and next lessons
    getAdjacentLessons() {
        if (!this.currentModule || !this.currentLesson) return { prevLesson: null, nextLesson: null };
        
        const modules = this.curriculum.modules;
        const currentModuleIndex = modules.findIndex(m => m.id === this.currentModule.id);
        const currentLessonIndex = this.currentModule.lessons.findIndex(l => l.id === this.currentLesson.id);
        
        let prevLesson = null;
        let nextLesson = null;
        
        // Find previous lesson
        if (currentLessonIndex > 0) {
            // Previous lesson in the same module
            prevLesson = {
                moduleId: this.currentModule.id,
                lessonId: this.currentModule.lessons[currentLessonIndex - 1].id
            };
        } else if (currentModuleIndex > 0) {
            // Last lesson of the previous module
            const prevModule = modules[currentModuleIndex - 1];
            prevLesson = {
                moduleId: prevModule.id,
                lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
            };
        }
        
        // Find next lesson
        if (currentLessonIndex < this.currentModule.lessons.length - 1) {
            // Next lesson in the same module
            nextLesson = {
                moduleId: this.currentModule.id,
                lessonId: this.currentModule.lessons[currentLessonIndex + 1].id
            };
        } else if (currentModuleIndex < modules.length - 1) {
            // First lesson of the next module
            const nextModule = modules[currentModuleIndex + 1];
            nextLesson = {
                moduleId: nextModule.id,
                lessonId: nextModule.lessons[0].id
            };
        }
        
        return { prevLesson, nextLesson };
    }

    // Navigate to the previous lesson
    navigateToPreviousLesson() {
        const { prevLesson } = this.getAdjacentLessons();
        if (prevLesson) {
            this.loadLesson(prevLesson.moduleId, prevLesson.lessonId);
        }
    }

    // Navigate to the next lesson
    navigateToNextLesson() {
        const { nextLesson } = this.getAdjacentLessons();
        if (nextLesson) {
            this.loadLesson(nextLesson.moduleId, nextLesson.lessonId);
        }
    }

    // Update the active states in the navigation sidebar
    updateActiveNavItems(moduleId, lessonId) {
        // Remove active classes
        document.querySelectorAll('.module-header.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.lesson-item.active').forEach(el => el.classList.remove('active'));
        
        // Add active class to current module
        const moduleHeader = document.querySelector(`.module-header[data-module-id="${moduleId}"]`);
        if (moduleHeader) {
            moduleHeader.classList.add('active');
            
            // Expand the module if it's not already expanded
            const moduleItem = moduleHeader.closest('.module-item');
            if (moduleItem && !moduleItem.classList.contains('expanded')) {
                moduleItem.classList.add('expanded');
                moduleHeader.classList.add('expanded');
            }
        }
        
        // Add active class to current lesson
        const lessonItem = document.querySelector(`.lesson-item[data-lesson-id="${lessonId}"]`);
        if (lessonItem) {
            lessonItem.classList.add('active');
        }
    }

    // Update the lesson completion status display
    updateLessonStatus() {
        if (!this.currentModule || !this.currentLesson) return;
        
        const statusElement = document.getElementById('lesson-status');
        const lessonStatus = window.progressTracker.getLessonStatus(this.currentModule.id, this.currentLesson.id);
        
        // Update the status text
        let statusText = '';
        let statusClass = '';
        
        switch (lessonStatus) {
            case 'completed':
                statusText = 'Completed';
                statusClass = 'status-completed';
                break;
            case 'in-progress':
                statusText = 'In Progress';
                statusClass = 'status-in-progress';
                break;
            default:
                statusText = 'Not Started';
                statusClass = 'status-not-started';
        }
        
        statusElement.innerHTML = `
            <span class="lesson-status-dot ${statusClass}"></span>
            <span class="lesson-status-text">${statusText}</span>
        `;
        
        // Update the button text
        const completeButton = document.getElementById('mark-complete');
        completeButton.textContent = lessonStatus === 'completed' ? 'Mark as Incomplete' : 'Mark as Complete';
    }

    // Mark the current lesson as complete or incomplete
    markCurrentLessonComplete() {
        if (!this.currentModule || !this.currentLesson) return;
        
        const moduleId = this.currentModule.id;
        const lessonId = this.currentLesson.id;
        const currentStatus = window.progressTracker.getLessonStatus(moduleId, lessonId);
        
        if (currentStatus === 'completed') {
            window.progressTracker.uncompleteLesson(moduleId, lessonId);
            this.updateLessonStatus();
        } else {
            window.progressTracker.completeLesson(moduleId, lessonId);
            this.updateLessonStatus();
        }
    }
}


    

// Initialize content loader when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contentLoader = new ContentLoader(curriculum);
});
