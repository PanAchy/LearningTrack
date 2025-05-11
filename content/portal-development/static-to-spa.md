# Converting a Static Site to a Single Page Application

## Introduction

In this lesson, you'll learn how to transform a static HTML/CSS/JavaScript website into a dynamic Single Page Application (SPA) using Vue.js. This is a practical exercise that will directly improve this learning portal while reinforcing your frontend skills.

## Why Convert to an SPA?

Static websites load an entirely new page whenever a user navigates to a different section. In contrast, SPAs load a single HTML page and dynamically update the content as users interact with the app. This approach offers several advantages:

- **Improved User Experience**: Faster page transitions and no full-page reloads
- **Smoother Animations**: Transitions between views can be animated smoothly
- **State Persistence**: Application state can be maintained between "page" changes
- **Reduced Server Load**: Only data, not entire pages, is transferred after the initial load
- **Enhanced Interactivity**: More responsive user interface

## Current Structure

Our current learning portal is built with the following technologies:

- **HTML**: Structure of the website
- **CSS**: Styling and layout
- **JavaScript**: Interactivity and functionality
- **Markdown**: Lesson content (rendered to HTML)

The site follows a component-based architecture even though it's a static site:

```
index.html                 # Main HTML structure
css/
  style.css                # Global styles
js/
  curriculum-data.js       # Curriculum structure
  progress-tracker.js      # Progress tracking functionality
  content-loader.js        # Content loading and rendering
  exercise-handler.js      # Exercise functionality
  app.js                   # Main application logic
content/
  module-name/
    lesson-name.md         # Lesson content in Markdown
```

## Conversion Strategy

We'll take an incremental approach to converting our static site to a Vue.js SPA:

1. **Setup a Vue.js Project**: Create a new Vue project using Vue CLI
2. **Migrate Component Structure**: Convert our existing DOM structure to Vue components
3. **Implement Routing**: Add Vue Router for navigation
4. **State Management**: Use Vuex or the Composition API for state management
5. **Data Handling**: Convert our current data loading to Vue's data management
6. **Progressive Enhancement**: Keep the portal functional during the transition

## Key Components to Create

Here are the main Vue components we'll need to create:

```
App.vue                  # Root component
components/
  Sidebar.vue            # Navigation sidebar
  ContentViewer.vue      # Lesson content area
  LessonNavigation.vue   # Previous/next buttons
  NotesPanel.vue         # Notes functionality
  ExerciseModal.vue      # Exercise modal
  ProgressTracker.vue    # Progress display
views/
  Home.vue               # Welcome screen
  Lesson.vue             # Lesson display
  Exercise.vue           # Exercise view
  NotFound.vue           # 404 page
```

## Implementing Vue Router

Vue Router allows us to create a single-page application with navigation without refreshing the page. Here's how we'll implement it:

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Lesson from '@/views/Lesson.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/module/:moduleId/lesson/:lessonId',
    name: 'Lesson',
    component: Lesson,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

## State Management with Vuex

We'll use Vuex to manage the application state, particularly for tracking progress and handling notes:

```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    curriculum: {}, // Curriculum data
    progress: {}, // User progress
    notes: {}, // User notes
    currentModule: null,
    currentLesson: null
  },
  mutations: {
    SET_CURRICULUM(state, curriculum) {
      state.curriculum = curriculum
    },
    SET_PROGRESS(state, progress) {
      state.progress = progress
    },
    SET_CURRENT_LESSON(state, { moduleId, lessonId }) {
      state.currentModule = moduleId
      state.currentLesson = lessonId
    },
    // Add more mutations...
  },
  actions: {
    loadCurriculum({ commit }) {
      // Load curriculum data
      commit('SET_CURRICULUM', curriculumData)
    },
    loadProgress({ commit }) {
      // Load progress from localStorage
      const savedProgress = localStorage.getItem('learningProgress')
      if (savedProgress) {
        commit('SET_PROGRESS', JSON.parse(savedProgress))
      }
    },
    // Add more actions...
  },
  getters: {
    getModuleById: state => id => {
      return state.curriculum.modules.find(module => module.id === id)
    },
    getLessonById: (state, getters) => (moduleId, lessonId) => {
      const module = getters.getModuleById(moduleId)
      return module ? module.lessons.find(lesson => lesson.id === lessonId) : null
    },
    // Add more getters...
  }
})
```

## Data Loading with Axios

We'll use Axios to load our lesson content:

```javascript
// services/contentService.js
import axios from 'axios'

export default {
  async getLessonContent(path) {
    try {
      const response = await axios.get(path)
      return response.data
    } catch (error) {
      console.error('Error loading lesson content:', error)
      throw error
    }
  }
}
```

## Converting the Progress Tracker

Our existing progress tracker will be converted to a Vuex module:

```javascript
// store/modules/progress.js
const state = {
  modules: {},
  lastVisited: null
}

const mutations = {
  VISIT_LESSON(state, { moduleId, lessonId }) {
    if (!state.modules[moduleId]) return
    
    state.lastVisited = { moduleId, lessonId }
    state.modules[moduleId].lessons[lessonId].started = true
    state.modules[moduleId].started = true
  },
  COMPLETE_LESSON(state, { moduleId, lessonId }) {
    if (!state.modules[moduleId]) return
    
    const moduleProgress = state.modules[moduleId]
    const lessonProgress = moduleProgress.lessons[lessonId]
    
    if (!lessonProgress.completed) {
      lessonProgress.completed = true
      moduleProgress.completedLessons++
      
      if (moduleProgress.completedLessons === moduleProgress.totalLessons) {
        moduleProgress.completed = true
      }
    }
  },
  // Add more mutations...
}

const actions = {
  visitLesson({ commit }, { moduleId, lessonId }) {
    commit('VISIT_LESSON', { moduleId, lessonId })
    // Save to localStorage
  },
  completeLesson({ commit }, { moduleId, lessonId }) {
    commit('COMPLETE_LESSON', { moduleId, lessonId })
    // Save to localStorage
  },
  // Add more actions...
}

const getters = {
  getOverallProgress: state => {
    let totalLessons = 0
    let completedLessons = 0
    
    Object.values(state.modules).forEach(module => {
      totalLessons += module.totalLessons
      completedLessons += module.completedLessons
    })
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  },
  // Add more getters...
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

## Exercise: Convert to a Vue.js SPA

Now it's your turn to put this knowledge into practice. In this exercise, you'll convert our static learning portal to a Vue.js SPA:

1. Create a new Vue.js project using Vue CLI
2. Set up the basic component structure
3. Implement routing for the home page and lesson pages
4. Create a Vuex store for tracking progress
5. Migrate the content loading functionality
6. Ensure that all existing features work in the new SPA

## Conclusion

Converting a static site to a Vue.js SPA is a valuable skill that lets you enhance user experience while maintaining all the functionality of your original site. This approach also gives you a solid foundation for adding more advanced features in the future.

In the next lesson, we'll build on this SPA by adding a backend API to support more advanced features like user authentication, cloud-based progress tracking, and collaborative features.

## Additional Resources

- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vuex Documentation](https://vuex.vuejs.org/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Vue CLI Documentation](https://cli.vuejs.org/)
