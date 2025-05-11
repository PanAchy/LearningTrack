# Vue.js Fundamentals

## Introduction

Vue.js is a progressive JavaScript framework for building user interfaces. It's designed to be incrementally adoptable, which means you can integrate it into existing projects gradually or use it to build sophisticated Single-Page Applications (SPAs) from scratch. For developers building internal tools, Vue offers an excellent balance of power, simplicity, and performance. This lesson covers the core concepts and features of Vue.js.

## Why Vue.js?

Vue offers several benefits for internal tool development:

1. **Gentle Learning Curve**: Easy to learn for developers with HTML, CSS, and JavaScript knowledge
2. **Flexible Architecture**: Can be used for everything from simple widgets to complex applications
3. **Excellent Performance**: Fast rendering and small bundle size
4. **Rich Ecosystem**: Extensive tooling, libraries, and community support
5. **Single-File Components**: Encapsulate template, logic, and styles in one file
6. **Reactivity System**: Automatically updates the UI when data changes
7. **Strong TypeScript Support**: Works well with TypeScript for type safety

## Getting Started with Vue.js

### Vue 3 vs Vue 2

This lesson focuses on Vue 3, the latest major version of Vue.js. Vue 3 introduced several improvements over Vue 2, including:

- Enhanced performance with a rewritten virtual DOM
- Improved TypeScript support
- Composition API (alongside the Options API)
- Better support for large-scale applications
- Smaller bundle size

### Setting Up a Vue Project

There are multiple ways to start a Vue project:

#### Using CDN for Simple Projects

For simple projects, you can include Vue directly from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue CDN Example</title>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>
  
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script>
    const { createApp } = Vue
    
    createApp({
      data() {
        return {
          message: 'Hello from Vue!'
        }
      }
    }).mount('#app')
  </script>
</body>
</html>
```

#### Using Vue CLI for Full Projects

For more complete projects, it's recommended to use Vue CLI:

```bash
# Install Vue CLI
npm install -g @vue/cli

# Create a new project
vue create my-project

# Or use the graphical interface
vue ui
```

#### Using Vite (Recommended for New Projects)

Vite is a newer, faster build tool that works excellently with Vue:

```bash
# Create a Vue project with Vite
npm init vite@latest my-vue-app -- --template vue

# Navigate to project directory
cd my-vue-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Core Vue.js Concepts

### 1. Application Instance

Every Vue application starts with creating an application instance:

```javascript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Mount the app to a DOM element
app.mount('#app')
```

### 2. Template Syntax

Vue uses an HTML-based template syntax that allows you to declaratively bind the DOM to your data:

```html
<template>
  <!-- Text interpolation -->
  <p>{{ message }}</p>
  
  <!-- Raw HTML (use with caution) -->
  <p v-html="rawHtml"></p>
  
  <!-- Attributes -->
  <div v-bind:id="dynamicId"></div>
  <div :id="dynamicId"></div> <!-- Shorthand -->
  
  <!-- Conditional rendering -->
  <p v-if="seen">Now you see me</p>
  <p v-else-if="maybe">Maybe you see me</p>
  <p v-else>Now you don't</p>
  
  <!-- Show/hide (keeps element in DOM) -->
  <p v-show="isVisible">Toggle visibility</p>
  
  <!-- List rendering -->
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </ul>
  
  <!-- Event handling -->
  <button v-on:click="handleClick">Click me</button>
  <button @click="handleClick">Click me</button> <!-- Shorthand -->
  
  <!-- Two-way binding -->
  <input v-model="message">
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
      rawHtml: '<span style="color: red">Red text</span>',
      dynamicId: 'my-element',
      seen: true,
      maybe: false,
      isVisible: true,
      items: [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' }
      ]
    }
  },
  methods: {
    handleClick() {
      alert('Button clicked!')
    }
  }
}
</script>
```

### 3. Reactivity Fundamentals

Vue's reactivity system automatically tracks dependencies and updates the DOM when data changes:

```html
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <p>Double count: {{ doubleCount }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

### 4. Computed Properties

Computed properties are cached and only re-evaluated when their dependencies change:

```html
<template>
  <div>
    <p>Original message: {{ message }}</p>
    <p>Reversed message: {{ reversedMessage }}</p>
    <input v-model="message">
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  computed: {
    reversedMessage() {
      // This will be recalculated only when message changes
      return this.message.split('').reverse().join('')
    }
  }
}
</script>
```

### 5. Watchers

Watchers let you perform side effects when data changes:

```html
<template>
  <div>
    <p>
      Ask a yes/no question:
      <input v-model="question">
    </p>
    <p>{{ answer }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark ;-)'
    }
  },
  watch: {
    // Watch for changes to the question property
    question(newQuestion, oldQuestion) {
      if (newQuestion.indexOf('?') > -1) {
        this.getAnswer()
      }
    }
  },
  methods: {
    getAnswer() {
      this.answer = 'Thinking...'
      setTimeout(() => {
        const answers = [
          'Yes', 'No', 'Maybe', 'Ask again later'
        ]
        this.answer = answers[Math.floor(Math.random() * answers.length)]
      }, 1000)
    }
  }
}
</script>
```

### 6. Lifecycle Hooks

Vue components have lifecycle hooks that let you run code at specific stages:

```html
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Loading...'
    }
  },
  // Called before the component is created
  beforeCreate() {
    console.log('beforeCreate')
  },
  // Called after the component is created
  created() {
    console.log('created')
    // Good place to fetch data
    setTimeout(() => {
      this.message = 'Data loaded!'
    }, 1000)
  },
  // Called before the component is mounted to the DOM
  beforeMount() {
    console.log('beforeMount')
  },
  // Called after the component is mounted to the DOM
  mounted() {
    console.log('mounted')
    // Good place to interact with the DOM
  },
  // Called before the component is updated
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  // Called after the component is updated
  updated() {
    console.log('updated')
    // Good place to perform operations that depend on the updated DOM
  },
  // Called before the component is unmounted
  beforeUnmount() {
    console.log('beforeUnmount')
    // Good place to clean up (e.g., remove event listeners)
  },
  // Called after the component is unmounted
  unmounted() {
    console.log('unmounted')
  }
}
</script>
```

## Components

Components are reusable Vue instances with a name. They help organize your application into manageable pieces.

### 1. Single-File Components (SFCs)

Vue encourages the use of Single-File Components with the `.vue` extension:

```html
<!-- Button.vue -->
<template>
  <button
    class="button"
    :class="{ 'button--primary': primary }"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    primary: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.button--primary {
  background-color: #4a8df8;
  color: white;
  border-color: #4a8df8;
}
</style>
```

### 2. Component Registration

Components can be registered globally or locally:

```javascript
// Global registration
import { createApp } from 'vue'
import App from './App.vue'
import Button from './components/Button.vue'

const app = createApp(App)
app.component('Button', Button)
app.mount('#app')

// Local registration
import Button from './components/Button.vue'

export default {
  components: {
    Button
  },
  // rest of the component
}
```

### 3. Props

Props allow components to receive data from their parent:

```html
<!-- Parent component -->
<template>
  <div>
    <UserProfile 
      :user-id="123" 
      :name="'John Doe'" 
      :email="'john@example.com'"
      :is-admin="true"
    />
  </div>
</template>

<!-- Child component: UserProfile.vue -->
<template>
  <div class="user-profile">
    <h2>{{ name }}</h2>
    <p>ID: {{ userId }}</p>
    <p>Email: {{ email }}</p>
    <p v-if="isAdmin">Admin User</p>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    userId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

### 4. Emitting Events

Components can communicate with their parents by emitting events:

```html
<!-- Child component: SearchInput.vue -->
<template>
  <div>
    <input 
      type="text" 
      v-model="searchText" 
      @keyup.enter="emitSearch"
      placeholder="Search..."
    >
    <button @click="emitSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchText)
    }
  }
}
</script>

<!-- Parent component -->
<template>
  <div>
    <SearchInput @search="handleSearch" />
    <div v-if="results.length">
      <h3>Search Results</h3>
      <ul>
        <li v-for="result in results" :key="result.id">
          {{ result.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchInput from './components/SearchInput.vue'

export default {
  components: {
    SearchInput
  },
  data() {
    return {
      results: []
    }
  },
  methods: {
    handleSearch(query) {
      // Perform search with the query
      console.log('Searching for:', query)
      // Mock results
      this.results = [
        { id: 1, name: 'Result 1' },
        { id: 2, name: 'Result 2' }
      ]
    }
  }
}
</script>
```

### 5. Slots

Slots allow components to receive content from their parent:

```html
<!-- Modal.vue -->
<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header">
          <h3>Default Header</h3>
        </slot>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button @click="$emit('close')">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 80%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 10px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</script>

<!-- Using the Modal component -->
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>
    
    <Modal :is-open="showModal" @close="showModal = false">
      <template #header>
        <h3>Custom Header</h3>
      </template>
      
      <p>This is the main content of the modal.</p>
      <p>You can add any elements here.</p>
      
      <template #footer>
        <button @click="handleSave">Save</button>
        <button @click="showModal = false">Cancel</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from './components/Modal.vue'

export default {
  components: {
    Modal
  },
  data() {
    return {
      showModal: false
    }
  },
  methods: {
    handleSave() {
      console.log('Saving...')
      this.showModal = false
    }
  }
}
</script>
```

## Options API vs. Composition API

Vue 3 introduced the Composition API alongside the Options API. Both approaches are valid and can be used based on your preference and project requirements.

### Options API

The traditional way to structure Vue components:

```html
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'CounterComponent',
  props: {
    title: {
      type: String,
      default: 'Counter'
    }
  },
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('Component mounted')
  }
}
</script>
```

### Composition API

A more flexible way to organize component logic:

```html
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <p>Double count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'CounterComponent',
  props: {
    title: {
      type: String,
      default: 'Counter'
    }
  },
  setup() {
    // State
    const count = ref(0)
    
    // Computed properties
    const doubleCount = computed(() => count.value * 2)
    
    // Methods
    function increment() {
      count.value++
    }
    
    // Lifecycle hooks
    onMounted(() => {
      console.log('Component mounted')
    })
    
    // Return the values to make them available in the template
    return {
      count,
      doubleCount,
      increment
    }
  }
}
</script>
```

### Script Setup (Vue 3.2+)

An even more concise Composition API syntax:

```html
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <p>Double count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props declaration with defineProps
const props = defineProps({
  title: {
    type: String,
    default: 'Counter'
  }
})

// State
const count = ref(0)

// Computed properties
const doubleCount = computed(() => count.value * 2)

// Methods
function increment() {
  count.value++
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})

// Emits declaration with defineEmits
const emit = defineEmits(['increment'])
</script>
```

## State Management

For small to medium-sized applications, you can manage state within components or use the built-in features of Vue. For larger applications, Pinia (recommended) or Vuex can be used.

### 1. Simple State Management with Composition API

```javascript
// src/composables/useCounter.js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = 0
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}

// Using the counter in a component
import { useCounter } from '@/composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter()
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
```

### 2. Shared State with Provide/Inject

```javascript
// Parent component
import { ref, provide } from 'vue'

export default {
  setup() {
    const theme = ref('light')
    
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    
    provide('theme', {
      theme,
      toggleTheme
    })
    
    return {
      theme,
      toggleTheme
    }
  }
}

// Child component (can be deeply nested)
import { inject } from 'vue'

export default {
  setup() {
    const { theme, toggleTheme } = inject('theme')
    
    return {
      theme,
      toggleTheme
    }
  }
}
```

### 3. Pinia (Recommended for Vue 3)

Pinia is the new official state management library for Vue:

```bash
# Install Pinia
npm install pinia
```

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

// src/stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  // Getters (like computed properties)
  getters: {
    doubleCount: (state) => state.count * 2,
    countPlusName: (state) => `${state.count} (${state.name})`
  },
  
  // Actions (like methods)
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    },
    setName(name) {
      this.name = name
    }
  }
})

// Using the store in a component
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double count: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">Increment</button>
    <button @click="counter.decrement">Decrement</button>
    <button @click="counter.reset">Reset</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>
```

## Routing with Vue Router

Vue Router is the official router for Vue.js:

```bash
# Install Vue Router
npm install vue-router@4
```

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/users/:id',
    name: 'User',
    component: User,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

// src/App.vue
<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

// src/views/User.vue
<template>
  <div>
    <h2>User Profile</h2>
    <p>User ID: {{ id }}</p>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  },
  beforeRouteEnter(to, from, next) {
    // Called before the component is created
    console.log('Before route enter')
    next()
  },
  beforeRouteUpdate(to, from) {
    // Called when the route changes but the component is reused
    console.log('Route updated', to.params.id)
  },
  beforeRouteLeave(to, from) {
    // Called when navigating away from this route
    const answer = window.confirm('Are you sure you want to leave?')
    if (!answer) return false
  }
}
</script>
```

## Forms and Validation

Working with forms is a common task in internal tools. Vue provides v-model for two-way binding, and you can use libraries like Vuelidate or VeeValidate for validation.

### Basic Form Handling

```html
<template>
  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="department">Department</label>
      <select id="department" v-model="form.department">
        <option value="">Select a department</option>
        <option value="engineering">Engineering</option>
        <option value="sales">Sales</option>
        <option value="marketing">Marketing</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>
        <input type="checkbox" v-model="form.subscribe">
        Subscribe to newsletter
      </label>
    </div>
    
    <div class="form-group">
      <label>Preferred Contact Method</label>
      <div>
        <label>
          <input type="radio" v-model="form.contactMethod" value="email">
          Email
        </label>
        <label>
          <input type="radio" v-model="form.contactMethod" value="phone">
          Phone
        </label>
      </div>
    </div>
    
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        department: '',
        subscribe: false,
        contactMethod: 'email'
      }
    }
  },
  methods: {
    submitForm() {
      console.log('Form submitted:', this.form)
      // Send data to server
      // ...
      
      // Reset form
      this.form = {
        name: '',
        email: '',
        department: '',
        subscribe: false,
        contactMethod: 'email'
      }
    }
  }
}
</script>
```

### Form Validation with VeeValidate

```bash
# Install VeeValidate
npm install vee-validate@next yup
```

```html
<template>
  <div>
    <h2>User Registration</h2>
    
    <Form @submit="onSubmit" v-slot="{ errors }">
      <div class="form-group">
        <label for="name">Name</label>
        <Field
          id="name"
          name="name"
          type="text"
          :class="{ 'is-invalid': errors.name }"
        />
        <ErrorMessage name="name" class="error-message" />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <Field
          id="email"
          name="email"
          type="email"
          :class="{ 'is-invalid': errors.email }"
        />
        <ErrorMessage name="email" class="error-message" />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <Field
          id="password"
          name="password"
          type="password"
          :class="{ 'is-invalid': errors.password }"
        />
        <ErrorMessage name="password" class="error-message" />
      </div>
      
      <button type="submit" :disabled="Object.keys(errors).length > 0">
        Register
      </button>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup() {
    // Define validation schema
    const schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup
        .string()
        .required('Email is required')
        .email('Email is invalid'),
      password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
    })
    
    // Form submit handler
    const onSubmit = (values) => {
      console.log('Form submitted:', values)
      // Submit to server
      // ...
    }
    
    return {
      schema,
      onSubmit
    }
  }
})
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

.is-invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
```

## Making API Requests

Vue applications often need to communicate with backend services. You can use the Fetch API or Axios for this purpose.

### Using Fetch API

```html
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <h2>Users</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} ({{ user.email }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      this.users = await response.json()
    } catch (error) {
      this.error = error.message
    } finally {
      this.loading = false
    }
  }
}
</script>
```

### Using Axios

```bash
# Install Axios
npm install axios
```

```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Redirect to login
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api

// src/services/userService.js
import api from './api'

export default {
  getUsers() {
    return api.get('/users')
  },
  
  getUser(id) {
    return api.get(`/users/${id}`)
  },
  
  createUser(userData) {
    return api.post('/users', userData)
  },
  
  updateUser(id, userData) {
    return api.put(`/users/${id}`, userData)
  },
  
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  }
}

// Using the service in a component
<script>
import userService from '@/services/userService'

export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const response = await userService.getUsers()
      this.users = response.data
    } catch (error) {
      this.error = error.response?.data?.message || error.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    async createUser(userData) {
      try {
        const response = await userService.createUser(userData)
        this.users.push(response.data)
      } catch (error) {
        console.error('Failed to create user:', error)
      }
    }
  }
}
</script>
```

## Testing Vue Applications

Testing is crucial for maintaining reliable applications. Vue applications can be tested using various tools:

### 1. Unit Testing with Vitest

Vitest is a modern test runner for Vue applications:

```bash
# Install Vitest
npm install -D vitest @vue/test-utils
```

```javascript
// tests/components/Counter.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('renders the correct initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('Count: 0')
  })
  
  it('increments the count when button is clicked', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Count: 1')
  })
  
  it('accepts an initial count prop', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 5
      }
    })
    expect(wrapper.text()).toContain('Count: 5')
  })
})
```

### 2. End-to-End Testing with Cypress

```bash
# Install Cypress
npm install -D cypress
```

```javascript
// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('/login')
    
    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    // Verify redirection to dashboard
    cy.url().should('include', '/dashboard')
    
    // Verify user is logged in
    cy.get('.user-info').should('contain', 'user@example.com')
  })
  
  it('should show error message with invalid credentials', () => {
    cy.visit('/login')
    
    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    // Verify error message
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Invalid credentials')
    
    // Verify URL is still login page
    cy.url().should('include', '/login')
  })
})
```

## Vue.js Best Practices

### 1. Component Organization

Organize components by feature or functionality:

```
src/
  components/
    common/
      Button.vue
      Card.vue
      Modal.vue
    users/
      UserList.vue
      UserForm.vue
      UserDetails.vue
    products/
      ProductList.vue
      ProductForm.vue
      ProductDetails.vue
  views/
    Home.vue
    About.vue
    Dashboard.vue
    UserPage.vue
    ProductPage.vue
```

### 2. Keep Components Small and Focused

Each component should have a single responsibility:

```html
<!-- Bad: Too many responsibilities -->
<template>
  <div>
    <h2>Users</h2>
    <div class="filters">
      <!-- Complex filtering logic -->
    </div>
    <table>
      <!-- User list with many features -->
    </table>
    <div class="pagination">
      <!-- Pagination controls -->
    </div>
  </div>
</template>

<!-- Good: Split into smaller components -->
<template>
  <div>
    <h2>Users</h2>
    <UserFilters @filter="applyFilters" />
    <UserTable :users="filteredUsers" />
    <Pagination
      :total="totalUsers"
      :current-page="currentPage"
      @page-change="changePage"
    />
  </div>
</template>
```

### 3. Use Props and Events for Communication

```html
<!-- Parent component -->
<template>
  <div>
    <ChildComponent
      :data="parentData"
      @update="handleUpdate"
    />
  </div>
</template>

<!-- Child component -->
<template>
  <div>
    <button @click="updateData">Update</button>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateData() {
      this.$emit('update', { id: 1, value: 'Updated' })
    }
  }
}
</script>
```

### 4. Use Computed Properties for Derived Data

```html
<template>
  <div>
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'Apple', category: 'fruit' },
        { id: 2, name: 'Banana', category: 'fruit' },
        { id: 3, name: 'Carrot', category: 'vegetable' }
      ],
      selectedCategory: 'fruit'
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.category === this.selectedCategory)
    }
  }
}
</script>
```

### 5. Use Composition API for Complex Logic

Extract reusable logic into composables:

```javascript
// src/composables/useFetch.js
import { ref, computed } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  
  const fetch = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
      data.value = null
    } finally {
      loading.value = false
    }
  }
  
  // Initial fetch
  fetch()
  
  return {
    data,
    error,
    loading,
    refetch: fetch
  }
}

// Using the composable
import { useFetch } from '@/composables/useFetch'

export default {
  setup() {
    const { data, error, loading, refetch } = useFetch('/api/users')
    
    return {
      users: data,
      error,
      loading,
      refreshUsers: refetch
    }
  }
}
```

## Vue.js for Internal Tools

Vue.js is particularly well-suited for building internal tools due to its flexibility, ease of use, and excellent component model. Here are some patterns specific to internal tool development:

### 1. Data Tables with Filtering and Sorting

```html
<template>
  <div>
    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        @input="applyFilters"
      />
      <select v-model="statusFilter" @change="applyFilters">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" @click="sortBy(column.key)">
            {{ column.label }}
            <span v-if="sortKey === column.key">
              {{ sortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedAndFilteredData" :key="item.id">
          <td v-for="column in columns" :key="column.key">
            <template v-if="column.formatter">
              {{ column.formatter(item[column.key], item) }}
            </template>
            <template v-else>
              {{ item[column.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      sortKey: this.columns[0].key,
      sortOrder: 'asc',
      currentPage: 1,
      filteredData: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },
    sortedAndFilteredData() {
      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredData.slice(start, end)
    }
  },
  created() {
    this.applyFilters()
  },
  methods: {
    applyFilters() {
      // Filter by search query and status
      this.filteredData = this.data.filter(item => {
        const matchesQuery = !this.searchQuery || 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        
        const matchesStatus = !this.statusFilter || 
          item.status === this.statusFilter
        
        return matchesQuery && matchesStatus
      })
      
      // Apply sorting
      this.filteredData.sort((a, b) => {
        const aValue = a[this.sortKey]
        const bValue = b[this.sortKey]
        
        if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })
      
      // Reset to first page when filters change
      this.currentPage = 1
    },
    sortBy(key) {
      // Toggle sort order if clicking the same column
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
      
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  cursor: pointer;
  background-color: #f3f4f6;
}

.data-table th, .data-table td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.filters {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
```

### 2. Dashboard Layouts

```html
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>{{ title }}</h1>
      <div class="dashboard-actions">
        <slot name="actions"></slot>
      </div>
    </header>
    
    <div class="dashboard-grid">
      <div
        v-for="(widget, index) in widgets"
        :key="widget.id"
        :class="`widget widget-${widget.size}`"
      >
        <div class="widget-header">
          <h3>{{ widget.title }}</h3>
          <div class="widget-controls">
            <button @click="refreshWidget(index)">
              <i class="icon-refresh"></i>
            </button>
          </div>
        </div>
        <div class="widget-content" v-if="!widget.loading">
          <component
            :is="widget.component"
            v-bind="widget.props"
          ></component>
        </div>
        <div class="widget-loading" v-else>
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Dashboard'
    },
    widgets: {
      type: Array,
      required: true
    }
  },
  methods: {
    refreshWidget(index) {
      this.$emit('refresh-widget', index)
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

.widget {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.widget-small {
  grid-column: span 3;
}

.widget-medium {
  grid-column: span 6;
}

.widget-large {
  grid-column: span 9;
}

.widget-full {
  grid-column: span 12;
}

.widget-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.widget-content {
  padding: 16px;
  min-height: 200px;
}

.widget-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .widget {
    grid-column: span 1 !important;
  }
}
</style>
```

### 3. Advanced Form Layout

```html
<template>
  <div class="form-container">
    <div class="form-header">
      <h2>{{ title }}</h2>
      <div class="form-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-section" v-for="section in sections" :key="section.id">
        <h3 v-if="section.title">{{ section.title }}</h3>
        
        <div class="form-row" v-for="row in section.rows" :key="row.id">
          <div
            v-for="field in row.fields"
            :key="field.id"
            :class="`form-field field-span-${field.span || 1}`"
          >
            <label :for="field.id">
              {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            
            <div class="field-input">
              <!-- Text input -->
              <input
                v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'"
                :id="field.id"
                :type="field.type"
                v-model="formData[field.id]"
                :placeholder="field.placeholder"
                :required="field.required"
              />
              
              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.id"
                v-model="formData[field.id]"
                :placeholder="field.placeholder"
                :required="field.required"
              ></textarea>
              
              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                :id="field.id"
                v-model="formData[field.id]"
                :required="field.required"
              >
                <option value="" disabled>{{ field.placeholder }}</option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Checkbox -->
              <div v-else-if="field.type === 'checkbox'" class="checkbox-field">
                <input
                  :id="field.id"
                  type="checkbox"
                  v-model="formData[field.id]"
                />
                <span>{{ field.checkboxLabel }}</span>
              </div>
              
              <!-- Radio buttons -->
              <div v-else-if="field.type === 'radio'" class="radio-group">
                <div v-for="option in field.options" :key="option.value" class="radio-option">
                  <input
                    :id="`${field.id}-${option.value}`"
                    type="radio"
                    :name="field.id"
                    :value="option.value"
                    v-model="formData[field.id]"
                  />
                  <label :for="`${field.id}-${option.value}`">{{ option.label }}</label>
                </div>
              </div>
              
              <!-- Custom component -->
              <component
                v-else-if="field.type === 'custom'"
                :is="field.component"
                v-model="formData[field.id]"
                v-bind="field.props"
              ></component>
            </div>
            
            <div v-if="errors[field.id]" class="field-error">
              {{ errors[field.id] }}
            </div>
            
            <div v-if="field.helpText" class="field-help">
              {{ field.helpText }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-footer">
        <slot name="footer">
          <button type="button" class="btn-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ submitButtonText }}
          </button>
        </slot>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    sections: {
      type: Array,
      required: true
    },
    initialData: {
      type: Object,
      default: () => ({})
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: { ...this.initialData },
      errors: {}
    }
  },
  watch: {
    initialData: {
      handler(newValue) {
        this.formData = { ...newValue }
      },
      deep: true
    }
  },
  methods: {
    validate() {
      const errors = {}
      let isValid = true
      
      // Basic validation example - enhance as needed
      this.sections.forEach(section => {
        section.rows.forEach(row => {
          row.fields.forEach(field => {
            if (field.required && !this.formData[field.id]) {
              errors[field.id] = `${field.label} is required`
              isValid = false
            }
            
            if (field.type === 'email' && this.formData[field.id] && 
                !this.isValidEmail(this.formData[field.id])) {
              errors[field.id] = 'Please enter a valid email address'
              isValid = false
            }
            
            // Add more validation rules as needed
          })
        })
      })
      
      this.errors = errors
      return isValid
    },
    
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    
    handleSubmit() {
      if (this.validate()) {
        this.$emit('submit', this.formData)
      }
    },
    
    resetForm() {
      this.formData = { ...this.initialData }
      this.errors = {}
    }
  }
}
</script>

<style scoped>
.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.field-span-1 { grid-column: span 1; }
.field-span-2 { grid-column: span 2; }
.field-span-3 { grid-column: span 3; }
.field-span-4 { grid-column: span 4; }
.field-span-6 { grid-column: span 6; }
.field-span-12 { grid-column: span 12; }

label {
  font-weight: 500;
  margin-bottom: 4px;
}

.required {
  color: #f44336;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
textarea,
select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.checkbox-field,
.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-error {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.field-help {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.form-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-field {
    grid-column: span 1 !important;
  }
}
</style>
```

## Exercises

Complete the following exercises to practice your Vue.js skills:

1. Create a simple counter component using the Options API

<details>
<summary>💡 Hint 1</summary>

Start with a basic Vue component structure using the Options API. You'll need a data property to store the counter value and methods to increase and decrease it.
</details>

<details>
<summary>💡 Hint 2</summary>

Don't forget to implement the template with buttons for incrementing and decrementing, and a display for the current count.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider adding features like a reset button, max/min limits, or the ability to set an initial count via props.
</details>

2. Rebuild the same counter component using the Composition API

<details>
<summary>💡 Hint 1</summary>

Use `ref` from Vue to create a reactive counter value, and functions for incrementing and decrementing it.
</details>

<details>
<summary>💡 Hint 2</summary>

Structure your component with either the `setup()` method or the more concise `<script setup>` syntax introduced in Vue 3.2.
</details>

<details>
<summary>💡 Hint 3</summary>

Make sure to return all the values and methods you need to access in the template from your setup function, or declare them in the `<script setup>` block.
</details>

3. Create a data table component that displays a list of items with sorting and filtering

<details>
<summary>💡 Hint 1</summary>

Start by defining the props your component will accept, such as the data array, column definitions, and optional configuration settings.
</details>

<details>
<summary>💡 Hint 2</summary>

Implement a basic table structure first, then add a search input for filtering. Use computed properties to filter the data based on the search term.
</details>

<details>
<summary>💡 Hint 3</summary>

Add column sorting functionality by keeping track of the sort field and direction in your component's state, and using computed properties to sort the data accordingly.
</details>

4. Build a form with validation that collects user information

<details>
<summary>💡 Hint 1</summary>

Create form fields for basic user information (name, email, etc.) using v-model for two-way binding. Implement data properties to store form values and validation errors.
</details>

<details>
<summary>💡 Hint 2</summary>

Add validation logic to check each field when its value changes or when the form is submitted. Display error messages next to invalid fields.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider using a library like Vuelidate or VeeValidate to simplify form validation, especially for complex scenarios like email formatting, password strength, etc.
</details>

5. Create a dashboard layout with multiple widgets

<details>
<summary>💡 Hint 1</summary>

Create a main Dashboard component that acts as a container for widget components. Use CSS Grid or Flexbox to create a responsive layout.
</details>

<details>
<summary>💡 Hint 2</summary>

Define a Widget component that accepts different types of content through slots or props. Include common widget features like a title, refresh button, and loading state.
</details>

<details>
<summary>💡 Hint 3</summary>

Implement a few different widget types, such as a chart widget, a stats widget, and a list widget. Use props to configure their appearance and behavior.
</details>

## Additional Resources

- [Vue.js Official Documentation](https://vuejs.org/guide/introduction.html) - Comprehensive guide
- [Vue Mastery](https://www.vuemastery.com/) - High-quality Vue.js courses
- [Vue School](https://vueschool.io/) - In-depth Vue.js tutorials
- [Awesome Vue](https://github.com/vuejs/awesome-vue) - Curated list of Vue.js resources
- [Vue.js Examples](https://vuejsexamples.com/) - Collection of Vue.js examples
- [Vue Dev Tools](https://devtools.vuejs.org/) - Browser extension for debugging Vue applications
- [Pinia Documentation](https://pinia.vuejs.org/) - Official docs for Pinia state management
- [Vue Router Documentation](https://router.vuejs.org/) - Official docs for Vue Router
