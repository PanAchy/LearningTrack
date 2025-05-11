// Exercise Handler - Manages code exercises and their execution

class ExerciseHandler {
    constructor() {
        this.currentExercise = null;
        this.currentModuleId = null;
        this.currentLessonId = null;
        
        // Elements
        this.modal = document.getElementById('exercise-modal');
        this.titleElement = document.getElementById('exercise-title');
        this.descriptionElement = document.getElementById('exercise-description');
        this.codeEditor = document.getElementById('code-editor');
        this.previewFrame = document.getElementById('preview-frame');
        this.testResults = document.getElementById('test-results');
        
        // Buttons
        this.closeButton = document.getElementById('close-modal');
        this.runCodeButton = document.getElementById('run-code');
        this.runTestsButton = document.getElementById('run-tests');
        this.submitButton = document.getElementById('submit-exercise');
        
        // Tabs
        this.editorTabs = document.querySelectorAll('.editor-tab');
        this.editorPanes = document.querySelectorAll('.editor-pane');
        
        this.setupEventListeners();
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Close button
        this.closeButton.addEventListener('click', () => this.closeExercise());
        
        // Tab switching
        this.editorTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        // Run code button
        this.runCodeButton.addEventListener('click', () => this.runCode());
        
        // Run tests button
        this.runTestsButton.addEventListener('click', () => this.runTests());
        
        // Submit button
        this.submitButton.addEventListener('click', () => this.submitExercise());
    }
    
    // Open an exercise
    openExercise(exerciseId, moduleId, lessonId) {
        // Find the exercise in the curriculum
        let exercise = null;
        const module = curriculum.modules.find(m => m.id === moduleId);
        if (module) {
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (lesson && lesson.exercises) {
                exercise = lesson.exercises.find(e => e.id === exerciseId);
            }
        }
        
        if (!exercise) {
            console.error(`Exercise not found: ${exerciseId}`);
            return;
        }
        
        // Set current exercise and context
        this.currentExercise = exercise;
        this.currentModuleId = moduleId;
        this.currentLessonId = lessonId;
        
        // Update modal content
        this.titleElement.textContent = exercise.title;
        this.descriptionElement.innerHTML = `
            <h3>${exercise.title}</h3>
            <p>${exercise.description}</p>
            <div class="exercise-meta">
                <span class="difficulty-badge difficulty-${exercise.difficulty}">
                    ${exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                </span>
                <span class="type-badge">
                    <i class="fas fa-code"></i> ${exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                    ${exercise.language ? ` (${exercise.language})` : ''}
                </span>
            </div>
        `;
        
        // Load starter code if available
        this.loadStarterCode(exercise);
        
        // Reset tabs
        this.switchTab('code');
        
        // Show the modal
        this.modal.classList.add('open');
        
        // Mark exercise as started in progress tracker
        window.progressTracker.startExercise(moduleId, lessonId, exerciseId);
    }
    
    // Close the exercise modal
    closeExercise() {
        this.modal.classList.remove('open');
        this.currentExercise = null;
    }
    
    // Switch between tabs (code, preview, tests)
    switchTab(tabId) {
        // Update active tab
        this.editorTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update active pane
        this.editorPanes.forEach(pane => {
            if (pane.id === `${tabId}-pane`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
        
        // If switching to preview, update it
        if (tabId === 'preview') {
            this.updatePreview();
        }
    }
    
    // Load starter code for an exercise
    async loadStarterCode(exercise) {
        // Default empty code
        let starterCode = '// Write your code here';
        
        // If there's a language, add appropriate starter code
        if (exercise.language) {
            switch (exercise.language) {
                case 'javascript':
                    starterCode = '// JavaScript Exercise\n\nfunction solution() {\n  // Your code here\n}\n';
                    break;
                case 'typescript':
                    starterCode = '// TypeScript Exercise\n\nfunction solution(): void {\n  // Your code here\n}\n';
                    break;
                case 'html':
                    starterCode = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Exercise</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>';
                    break;
                case 'css':
                    starterCode = '/* CSS Exercise */\n\nbody {\n  /* Your styles here */\n}\n';
                    break;
                case 'vue':
                    starterCode = '<template>\n  <div>\n    <!-- Your template here -->\n  </div>\n</template>\n\n<script>\nexport default {\n  // Your component code here\n}\n</script>\n\n<style>\n/* Your styles here */\n</style>';
                    break;
                case 'svelte':
                    starterCode = '<script>\n  // Your component code here\n</script>\n\n<!-- Your template here -->\n\n<style>\n  /* Your styles here */\n</style>';
                    break;
                case 'csharp':
                    starterCode = 'using System;\n\npublic class Solution {\n  public void Main() {\n    // Your code here\n  }\n}';
                    break;
                case 'go':
                    starterCode = 'package main\n\nimport "fmt"\n\nfunc main() {\n  // Your code here\n}\n';
                    break;
                case 'sql':
                    starterCode = '-- SQL Exercise\n\nSELECT * FROM table_name WHERE condition;\n';
                    break;
                default:
                    // Generic starter code
                    starterCode = `// ${exercise.language} Exercise\n\n// Your code here\n`;
            }
        }
        
        // Try to load exercise-specific starter code if available
        try {
            const starterCodePath = `exercises/${exercise.id}/starter.${exercise.language || 'txt'}`;
            const response = await fetch(starterCodePath);
            if (response.ok) {
                starterCode = await response.text();
            }
        } catch (error) {
            console.log('No custom starter code found, using default');
        }
        
        // Set the editor content
        this.codeEditor.value = starterCode;
    }
    
    // Run the code in the editor
    runCode() {
        const code = this.codeEditor.value;
        
        // Update preview for visual exercises
        if (this.currentExercise.language === 'html' || 
            this.currentExercise.language === 'css' ||
            this.currentExercise.language === 'vue' ||
            this.currentExercise.language === 'svelte') {
            this.updatePreview();
            this.switchTab('preview');
            return;
        }
        
        // For non-visual code, we'll show the output in the test results area
        try {
            // This is a simplified implementation that just shows the code
            // In a real implementation, we would use a sandboxed environment to run the code
            this.testResults.innerHTML = `
                <div class="test-output">
                    <h3>Code Output</h3>
                    <pre><code>${this.escapeHtml(code)}</code></pre>
                    <p class="test-message">
                        <i class="fas fa-info-circle"></i>
                        Code execution is simulated in this demo version. In the full implementation, 
                        your code would be executed in a sandboxed environment.
                    </p>
                </div>
            `;
            
            this.switchTab('tests');
        } catch (error) {
            this.showError(error);
        }
    }
    
    // Update the preview pane
    updatePreview() {
        const code = this.codeEditor.value;
        
        // Create a new document in the iframe
        const preview = this.previewFrame.contentWindow.document;
        preview.open();
        
        // For HTML, use the code directly
        if (this.currentExercise.language === 'html') {
            preview.write(code);
        } 
        // For CSS, create a basic HTML wrapper
        else if (this.currentExercise.language === 'css') {
            preview.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>${code}</style>
                </head>
                <body>
                    <div class="container">
                        <h1>CSS Preview</h1>
                        <p>This is a paragraph to demonstrate your CSS styles.</p>
                        <button>Button Element</button>
                        <ul>
                            <li>List Item 1</li>
                            <li>List Item 2</li>
                            <li>List Item 3</li>
                        </ul>
                    </div>
                </body>
                </html>
            `);
        }
        // For Vue and Svelte, we'd need a more complex implementation
        // This is a simplified placeholder
        else if (this.currentExercise.language === 'vue' || this.currentExercise.language === 'svelte') {
            preview.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <h2>Component Preview</h2>
                    <p>Preview for ${this.currentExercise.language} components requires compilation.</p>
                    <p>In the full implementation, this would render your component.</p>
                    <h3>Your Code:</h3>
                    <pre>${this.escapeHtml(code)}</pre>
                </body>
                </html>
            `);
        }
        // Default fallback
        else {
            preview.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                    </style>
                </head>
                <body>
                    <h2>Preview not available</h2>
                    <p>Preview is not available for ${this.currentExercise.language || 'this type of'} exercises.</p>
                </body>
                </html>
            `);
        }
        
        preview.close();
    }
    
    // Run tests for the current exercise
    runTests() {
        const code = this.codeEditor.value;
        
        // This is a simplified implementation
        // In a real implementation, we would run actual tests against the code
        
        // Simulate test results
        const passed = Math.random() > 0.5; // Randomly pass or fail for demo
        
        this.testResults.innerHTML = `
            <div class="test-output">
                <h3>Test Results</h3>
                <div class="test-summary ${passed ? 'pass' : 'fail'}">
                    <i class="fas ${passed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${passed ? 'All tests passed!' : 'Some tests failed'}
                </div>
                <div class="test-details">
                    <div class="test-case ${passed ? 'pass' : 'fail'}">
                        <div class="test-name">Basic functionality</div>
                        <div class="test-result">${passed ? 'Passed' : 'Failed'}</div>
                    </div>
                </div>
                <p class="test-message">
                    <i class="fas fa-info-circle"></i>
                    Testing is simulated in this demo version. In the full implementation, 
                    your code would be tested against actual test cases.
                </p>
            </div>
        `;
        
        this.switchTab('tests');
    }
    
    // Submit the exercise solution
    submitExercise() {
        // Mark the exercise as completed in the progress tracker
        window.progressTracker.completeExercise(
            this.currentModuleId, 
            this.currentLessonId, 
            this.currentExercise.id
        );
        
        // Show a success message
        this.testResults.innerHTML = `
            <div class="test-output">
                <h3>Exercise Completed</h3>
                <div class="test-summary pass">
                    <i class="fas fa-check-circle"></i>
                    Exercise marked as completed!
                </div>
                <p class="test-message">
                    Your progress has been saved. You can continue to the next exercise or lesson.
                </p>
            </div>
        `;
        
        this.switchTab('tests');
        
        // Update UI to reflect completion
        window.progressTracker.updateProgressDisplay();
    }
    
    // Show an error message
    showError(error) {
        this.testResults.innerHTML = `
            <div class="test-output">
                <h3>Error</h3>
                <div class="test-summary fail">
                    <i class="fas fa-times-circle"></i>
                    An error occurred
                </div>
                <div class="error-details">
                    <pre>${this.escapeHtml(error.toString())}</pre>
                </div>
            </div>
        `;
        
        this.switchTab('tests');
    }
    
    // Helper function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize exercise handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exerciseHandler = new ExerciseHandler();
    
    // Add global function to open exercises
    window.openExercise = (exerciseId, moduleId, lessonId) => {
        window.exerciseHandler.openExercise(exerciseId, moduleId, lessonId);
    };
});
