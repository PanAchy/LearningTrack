// Progress Tracker - Manages user progress through the curriculum

class ProgressTracker {
    constructor(curriculum) {
        this.curriculum = curriculum;
        this.progressData = this.loadProgress();
        this.initializeProgress();
    }

    // Load progress from localStorage
    loadProgress() {
        const savedProgress = localStorage.getItem('learningProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('learningProgress', JSON.stringify(this.progressData));
        this.updateProgressDisplay();
    }

    // Initialize or patch progress data to match the curriculum
    initializeProgress() {
        let changed = false;
        // If empty, initialize from scratch
        if (Object.keys(this.progressData).length === 0) {
            this.progressData = {
                modules: {},
                lastVisited: null,
                
            };
        }
        if (!this.progressData.modules) {
            this.progressData.modules = {};
            changed = true;
        }
        // Patch in any missing modules, lessons, or exercises
        this.curriculum.modules.forEach(module => {
            if (!this.progressData.modules[module.id]) {
                this.progressData.modules[module.id] = {
                    completed: false,
                    started: false,
                    completedLessons: 0,
                    totalLessons: module.lessons.length,
                    lessons: {}
                };
                changed = true;
            }
            const moduleProgress = this.progressData.modules[module.id];
            // Patch totalLessons in case curriculum changed
            if (moduleProgress.totalLessons !== module.lessons.length) {
                moduleProgress.totalLessons = module.lessons.length;
                changed = true;
            }
            if (!moduleProgress.lessons) {
                moduleProgress.lessons = {};
                changed = true;
            }
            module.lessons.forEach(lesson => {
                if (!moduleProgress.lessons[lesson.id]) {
                    moduleProgress.lessons[lesson.id] = {
                        completed: false,
                        started: false,
                        completedExercises: 0,
                        totalExercises: lesson.exercises ? lesson.exercises.length : 0,
                        lastVisited: null,
                        exercises: {}
                    };
                    changed = true;
                }
                const lessonProgress = moduleProgress.lessons[lesson.id];
                // Patch totalExercises in case curriculum changed
                if (lessonProgress.totalExercises !== (lesson.exercises ? lesson.exercises.length : 0)) {
                    lessonProgress.totalExercises = lesson.exercises ? lesson.exercises.length : 0;
                    changed = true;
                }
                if (!lessonProgress.exercises) {
                    lessonProgress.exercises = {};
                    changed = true;
                }
                if (lesson.exercises) {
                    lesson.exercises.forEach(exercise => {
                        if (!lessonProgress.exercises[exercise.id]) {
                            lessonProgress.exercises[exercise.id] = {
                                completed: false,
                                started: false,
                                lastAttempt: null
                            };
                            changed = true;
                        }
                    });
                }
            });
        });
        if (changed) {
            this.saveProgress();
        }
    }

    // Mark a lesson as visited
    visitLesson(moduleId, lessonId) {
        if (!this.progressData.modules[moduleId]) return;
        
        // Update last visited
        this.progressData.lastVisited = {
            moduleId: moduleId,
            lessonId: lessonId
        };
        
        // Mark lesson as started
        if (!this.progressData.modules[moduleId].lessons[lessonId].started) {
            this.progressData.modules[moduleId].lessons[lessonId].started = true;
            this.progressData.modules[moduleId].started = true;
        }
        
        this.progressData.modules[moduleId].lessons[lessonId].lastVisited = new Date().toISOString();
        this.saveProgress();
    }

    // Mark a lesson as completed
    completeLesson(moduleId, lessonId) {
        if (!this.progressData.modules[moduleId]) return;
        
        const moduleProgress = this.progressData.modules[moduleId];
        const lessonProgress = moduleProgress.lessons[lessonId];
        
        if (!lessonProgress.completed) {
            lessonProgress.completed = true;
            moduleProgress.completedLessons++;
            
            // Check if module is completed
            if (moduleProgress.completedLessons === moduleProgress.totalLessons) {
                moduleProgress.completed = true;
            }
            
            this.saveProgress();
        }
    }

    // Mark a lesson as incomplete (undo complete)
    uncompleteLesson(moduleId, lessonId) {
        if (!this.progressData.modules[moduleId]) return;
        const moduleProgress = this.progressData.modules[moduleId];
        const lessonProgress = moduleProgress.lessons[lessonId];
        if (lessonProgress.completed) {
            lessonProgress.completed = false;
            if (moduleProgress.completedLessons > 0) {
                moduleProgress.completedLessons--;
            }
            // Unmark module as completed if it was
            if (moduleProgress.completed) {
                moduleProgress.completed = false;
            }
            this.saveProgress();
        }
    }

    // Mark an exercise as started
    startExercise(moduleId, lessonId, exerciseId) {
        if (!this.progressData.modules[moduleId]?.lessons[lessonId]?.exercises[exerciseId]) return;
        
        this.progressData.modules[moduleId].lessons[lessonId].exercises[exerciseId].started = true;
        this.saveProgress();
    }

    // Mark an exercise as completed
    completeExercise(moduleId, lessonId, exerciseId) {
        if (!this.progressData.modules[moduleId]?.lessons[lessonId]?.exercises[exerciseId]) return;
        
        const exerciseProgress = this.progressData.modules[moduleId].lessons[lessonId].exercises[exerciseId];
        const lessonProgress = this.progressData.modules[moduleId].lessons[lessonId];
        
        if (!exerciseProgress.completed) {
            exerciseProgress.completed = true;
            exerciseProgress.lastAttempt = new Date().toISOString();
            lessonProgress.completedExercises++;
            
            // If all exercises are completed, mark the lesson as completed
            if (lessonProgress.completedExercises === lessonProgress.totalExercises) {
                this.completeLesson(moduleId, lessonId);
            }
            
            this.saveProgress();
        }
    }

    // Get the overall completion percentage
    getOverallProgress() {
        let totalLessons = 0;
        let completedLessons = 0;
        
        Object.values(this.progressData.modules).forEach(module => {
            totalLessons += module.totalLessons;
            completedLessons += module.completedLessons;
        });
        
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    }

    // Get the completion status of a module
    getModuleStatus(moduleId) {
        const moduleProgress = this.progressData.modules[moduleId];
        if (!moduleProgress) return 'not-started';
        
        if (moduleProgress.completed) return 'completed';
        if (moduleProgress.started) return 'in-progress';
        return 'not-started';
    }

    // Get the completion status of a lesson
    getLessonStatus(moduleId, lessonId) {
        const lessonProgress = this.progressData.modules[moduleId]?.lessons[lessonId];
        if (!lessonProgress) return 'not-started';
        
        if (lessonProgress.completed) return 'completed';
        if (lessonProgress.started) return 'in-progress';
        return 'not-started';
    }

    // Get the completion status of an exercise
    getExerciseStatus(moduleId, lessonId, exerciseId) {
        const exerciseProgress = this.progressData.modules[moduleId]?.lessons[lessonId]?.exercises[exerciseId];
        if (!exerciseProgress) return 'not-started';
        
        if (exerciseProgress.completed) return 'completed';
        if (exerciseProgress.started) return 'in-progress';
        return 'not-started';
    }

    // Get the next lesson to study
    getNextLesson() {
        // First check if we have a last visited lesson
        if (this.progressData.lastVisited) {
            return this.progressData.lastVisited;
        }
        
        // If no last visited lesson, return the first lesson of the first module
        if (this.curriculum.modules && this.curriculum.modules.length > 0) {
            const firstModule = this.curriculum.modules[0];
            if (firstModule.lessons && firstModule.lessons.length > 0) {
                return { moduleId: firstModule.id, lessonId: firstModule.lessons[0].id };
            }
        }
        
        // Fallback to a hardcoded value if all else fails
        return { moduleId: 'essential-skills', lessonId: 'git-fundamentals' };
    }

    // Update the progress display in the UI
    updateProgressDisplay() {
        const overallPercentage = Math.round(this.getOverallProgress());
        
        // Update progress circle
        document.getElementById('progress-percentage').textContent = `${overallPercentage}%`;
        document.querySelector('.progress-circle').style.background = 
            `conic-gradient(var(--completed-color) ${overallPercentage}%, var(--primary-dark) 0%)`;
        
        // Update completed modules count
        const completedModules = Object.values(this.progressData.modules).filter(m => m.completed).length;
        const totalModules = this.curriculum.modules.length;
        document.getElementById('completed-modules').textContent = `${completedModules}/${totalModules} Modules`;
        
        // Update module and lesson status indicators in the navigation
        this.curriculum.modules.forEach(module => {
            const moduleStatus = this.getModuleStatus(module.id);
            const moduleElement = document.querySelector(`.module-header[data-module-id="${module.id}"]`);
            
            if (moduleElement) {
                // Update module status dot
                const statusDot = moduleElement.querySelector('.module-status');
                statusDot.className = `module-status status-${moduleStatus}`;
                
                // Update lesson status dots
                module.lessons.forEach(lesson => {
                    const lessonStatus = this.getLessonStatus(module.id, lesson.id);
                    const lessonElement = document.querySelector(`.lesson-item[data-lesson-id="${lesson.id}"]`);
                    
                    if (lessonElement) {
                        const lessonStatusDot = lessonElement.querySelector('.lesson-status');
                        lessonStatusDot.className = `lesson-status status-${lessonStatus}`;
                    }
                });
            }
        });
    }

    // Export progress data
    exportProgress() {
        const dataStr = JSON.stringify(this.progressData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import progress data
    importProgress(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            this.progressData = importedData;
            this.saveProgress();
            return true;
        } catch (error) {
            console.error('Error importing progress data:', error);
            return false;
        }
    }
}

// Initialize progress tracker when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker(curriculum);
});
