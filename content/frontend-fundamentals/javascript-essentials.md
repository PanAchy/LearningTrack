# JavaScript Essentials

## Introduction

JavaScript is the programming language of the web. Originally created to add interactivity to web pages, it has evolved into a powerful, versatile language used for both frontend and backend development. As a software engineer building internal tools, strong JavaScript skills are essential for creating responsive, interactive applications. This lesson covers the core concepts and features of modern JavaScript.

## JavaScript Fundamentals

### Variables and Data Types

JavaScript has several ways to declare variables:

```javascript
// Modern variable declarations (preferred)
let name = 'Jane'; // Block-scoped, can be reassigned
const age = 30; // Block-scoped, cannot be reassigned

// Older variable declaration (avoid in new code)
var company = 'Acme'; // Function-scoped, can be reassigned
```

JavaScript has the following primitive data types:

| Type | Description | Example |
|------|-------------|---------|
| String | Text | `'Hello'`, `"World"`, \``Template string`\` |
| Number | Integers and floating-point numbers | `42`, `3.14` |
| Boolean | True or false | `true`, `false` |
| Null | Intentional absence of value | `null` |
| Undefined | Unassigned value | `undefined` |
| Symbol | Unique identifier | `Symbol('id')` |
| BigInt | Numbers larger than Number can represent | `9007199254740991n` |

And one complex data type:

| Type | Description | Example |
|------|-------------|---------|
| Object | Collections of properties | `{name: 'Jane', age: 30}` |

Arrays, functions, dates, and regular expressions are all objects in JavaScript.

### Operators

JavaScript includes familiar operators from other languages:

- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `**` (exponentiation)
- **Assignment**: `=`, `+=`, `-=`, `*=`, `/=`
- **Comparison**: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- **Logical**: `&&` (and), `||` (or), `!` (not)
- **Ternary**: `condition ? valueIfTrue : valueIfFalse`

Note the difference between `==` (loose equality) and `===` (strict equality). Always use `===` to avoid unexpected type conversions:

```javascript
console.log(5 == '5'); // true (converts types)
console.log(5 === '5'); // false (no type conversion)
```

### Control Flow

JavaScript supports standard control flow statements:

```javascript
// Conditional statements
if (condition) {
  // Code if condition is true
} else if (anotherCondition) {
  // Code if anotherCondition is true
} else {
  // Code if all conditions are false
}

// Switch statement
switch (expression) {
  case value1:
    // Code if expression equals value1
    break;
  case value2:
    // Code if expression equals value2
    break;
  default:
    // Code if no case matches
}

// Loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}

const items = ['a', 'b', 'c'];
for (const item of items) {
  console.log(item);
}

const person = { name: 'Jane', age: 30 };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}

let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

let running = true;
do {
  console.log('Runs at least once');
  running = false;
} while (running);
```

### Functions

Functions are first-class citizens in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const subtract = function(a, b) {
  return a - b;
};

// Arrow function (ES6+)
const multiply = (a, b) => a * b;

// Arrow function with block body
const divide = (a, b) => {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
};

// Default parameters
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Immediately Invoked Function Expression (IIFE)
(function() {
  console.log('This runs immediately');
})();
```

### Scope and Closures

Understanding scope (where variables are accessible) is crucial in JavaScript:

```javascript
// Global scope
const globalVar = 'I am global';

function outerFunction() {
  // Function scope
  const outerVar = 'I am from outer';
  
  function innerFunction() {
    // Inner function scope
    const innerVar = 'I am from inner';
    console.log(innerVar); // Accessible
    console.log(outerVar); // Accessible (closure)
    console.log(globalVar); // Accessible
  }
  
  innerFunction();
  console.log(innerVar); // Error: innerVar is not defined
}

outerFunction();
console.log(outerVar); // Error: outerVar is not defined
```

A closure is formed when a function retains access to variables from its parent scope even after the parent function has completed execution:

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

## Modern JavaScript Features (ES6+)

JavaScript has evolved significantly in recent years. Here are some key modern features:

### Template Literals

```javascript
const name = 'Jane';
const greeting = `Hello, ${name}!`; // String interpolation
const multiline = `This is a
multiline string`; // Multiline strings
```

### Destructuring

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Object destructuring
const person = { name: 'Jane', age: 30, job: 'Developer' };
const { name, age, job: occupation } = person;
console.log(name); // Jane
console.log(age); // 30
console.log(occupation); // Developer

// Function parameter destructuring
function printPerson({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
printPerson(person); // Jane is 30 years old
```

### Spread Operator

```javascript
// Spread with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const copy = [...arr1]; // Creates a shallow copy

// Spread with objects
const defaults = { theme: 'dark', fontSize: 16 };
const userSettings = { fontSize: 18 };
const mergedSettings = { ...defaults, ...userSettings }; // { theme: 'dark', fontSize: 18 }
```

### Arrow Functions

```javascript
// Concise syntax
const add = (a, b) => a + b;

// Lexical 'this' binding
function Counter() {
  this.count = 0;
  
  // Arrow function maintains 'this' from parent scope
  setInterval(() => {
    this.count++;
    console.log(this.count);
  }, 1000);
}

const counter = new Counter();
```

### Promises and Async/Await

Promises provide a cleaner way to handle asynchronous operations compared to callbacks:

```javascript
// Creating a promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    // Asynchronous operation
    setTimeout(() => {
      const data = { id: 1, name: 'Product' };
      if (data) {
        resolve(data); // Success
      } else {
        reject('No data found'); // Error
      }
    }, 1000);
  });
};

// Using promises with then/catch
fetchData()
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));

// Using promises with async/await
async function getData() {
  try {
    const data = await fetchData();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getData();
```

### Modules

Modern JavaScript supports modular code organization:

```javascript
// file: math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export default function multiply(a, b) {
  return a * b;
}

// file: app.js
import multiply, { add, PI } from './math.js';

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(PI); // 3.14159

// Or import everything
import * as math from './math.js';
console.log(math.add(2, 3)); // 5
console.log(math.default(4, 5)); // 20
```

### Classes

ES6 introduced class syntax for object-oriented programming:

```javascript
class Person {
  // Class field (ES2022)
  #privateField = 'private'; // Private field (not accessible outside the class)
  
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Method
  greet() {
    return `Hello, my name is ${this.name}`;
  }
  
  // Getter
  get description() {
    return `${this.name}, ${this.age} years old`;
  }
  
  // Static method
  static createAnonymous() {
    return new Person('Anonymous', 0);
  }
}

// Inheritance
class Employee extends Person {
  constructor(name, age, position) {
    super(name, age); // Call parent constructor
    this.position = position;
  }
  
  // Override parent method
  greet() {
    return `${super.greet()}. I work as a ${this.position}`;
  }
}

const jane = new Employee('Jane', 30, 'Developer');
console.log(jane.greet()); // Hello, my name is Jane. I work as a Developer
```

## Working with Arrays

Arrays in JavaScript come with powerful built-in methods for data manipulation:

### Array Methods

```javascript
// Creating arrays
const numbers = [1, 2, 3, 4, 5];
const created = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]

// Adding/removing elements
numbers.push(6); // Add to end: [1, 2, 3, 4, 5, 6]
numbers.pop(); // Remove from end: [1, 2, 3, 4, 5]
numbers.unshift(0); // Add to beginning: [0, 1, 2, 3, 4, 5]
numbers.shift(); // Remove from beginning: [1, 2, 3, 4, 5]
numbers.splice(2, 1, 'a', 'b'); // Replace elements: [1, 2, 'a', 'b', 4, 5]

// Finding elements
const found = numbers.find(n => typeof n === 'string'); // 'a'
const index = numbers.findIndex(n => n === 'b'); // 3
const includes = numbers.includes(4); // true

// Transforming arrays
const doubled = numbers.map(n => typeof n === 'number' ? n * 2 : n);
const evens = numbers.filter(n => typeof n === 'number' && n % 2 === 0);
const sum = numbers.reduce((total, n) => 
  total + (typeof n === 'number' ? n : 0), 0);

// Iterating
numbers.forEach(n => console.log(n));

// Sorting
const sorted = [...numbers].sort((a, b) => {
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
  if (typeof a === 'string') return -1;
  if (typeof b === 'string') return 1;
  return a - b;
});
```

### Array Patterns

Here are some common patterns for working with arrays:

```javascript
// Filtering and mapping in one operation
const data = [1, 2, 3, 4, 5];
const transformedData = data
  .filter(n => n % 2 === 0) // Keep even numbers
  .map(n => n * 10); // [20, 40]

// Grouping items by a property
const people = [
  { name: 'Alice', department: 'Engineering' },
  { name: 'Bob', department: 'Sales' },
  { name: 'Carol', department: 'Engineering' }
];

const byDepartment = people.reduce((groups, person) => {
  const { department } = person;
  groups[department] = groups[department] || [];
  groups[department].push(person);
  return groups;
}, {});
// Result: { Engineering: [{...}, {...}], Sales: [{...}] }

// Finding unique values
const values = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(values)]; // [1, 2, 3, 4, 5]

// Flattening nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
const flattened = nested.flat(2); // [1, 2, 3, 4, 5, 6]

// Creating an array of numbers in a range
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
```

## Working with Objects

Objects are key-value collections and the foundation of JavaScript:

### Object Methods

```javascript
const person = {
  name: 'Jane',
  age: 30,
  greet() {
    return `Hello, my name is ${this.name}`;
  }
};

// Accessing properties
console.log(person.name); // Dot notation
console.log(person['name']); // Bracket notation

// Checking if a property exists
console.log('name' in person); // true
console.log(person.hasOwnProperty('name')); // true

// Getting all keys, values, or entries
const keys = Object.keys(person); // ['name', 'age', 'greet']
const values = Object.values(person); // ['Jane', 30, [Function: greet]]
const entries = Object.entries(person); // [['name', 'Jane'], ['age', 30], ['greet', [Function: greet]]]

// Cloning an object
const shallowCopy = { ...person };
const deepCopy = JSON.parse(JSON.stringify(person)); // Caution: loses methods and special values

// Merging objects
const defaults = { age: 25, occupation: 'Unknown' };
const merged = { ...defaults, ...person }; // person properties override defaults
```

### Object Patterns

Here are some common patterns for working with objects:

```javascript
// Property shorthand
const name = 'Jane';
const age = 30;
const person = { name, age }; // Equivalent to { name: name, age: age }

// Computed property names
const propName = 'job';
const employee = {
  name: 'Jane',
  [propName]: 'Developer' // { name: 'Jane', job: 'Developer' }
};

// Method shorthand
const calculator = {
  add(a, b) { // Instead of add: function(a, b) { ... }
    return a + b;
  }
};

// Object as a map
const userRoles = {
  jane: 'admin',
  john: 'user',
  bob: 'user'
};

// Or using Map for complex keys
const userMap = new Map();
userMap.set({ id: 1 }, 'admin');
userMap.set({ id: 2 }, 'user');
```

## Error Handling

Proper error handling is crucial for robust applications:

```javascript
// Try-catch block
try {
  // Code that might throw an error
  const data = JSON.parse('{"name": "Jane"}');
  console.log(data);
} catch (error) {
  // Handle the error
  console.error('Error parsing JSON:', error.message);
} finally {
  // Always executes, regardless of whether an error occurred
  console.log('Finished processing');
}

// Creating custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUser(user) {
  if (!user.name) {
    throw new ValidationError('Name is required');
  }
  if (user.age < 18) {
    throw new ValidationError('User must be at least 18 years old');
  }
}

try {
  validateUser({ name: 'Jane', age: 16 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
```

## Asynchronous JavaScript

JavaScript uses an event-driven, non-blocking model for handling asynchronous operations:

### Callbacks

The traditional way to handle asynchronous code (now largely replaced by Promises and async/await):

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'Product' };
    callback(null, data); // null means no error
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
});
```

### Promises

A more modern way to handle asynchronous operations:

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({ id: 1, name: 'Product' });
      } else {
        reject(new Error('Failed to fetch data'));
      }
    }, 1000);
  });
}

// Chaining promises
fetchData()
  .then(data => {
    console.log('Data:', data);
    return processData(data);
  })
  .then(result => {
    console.log('Processed result:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Operation completed');
  });

// Parallel promises
const promise1 = fetchUser(1);
const promise2 = fetchProducts();

Promise.all([promise1, promise2])
  .then(([user, products]) => {
    console.log('User:', user);
    console.log('Products:', products);
  })
  .catch(error => {
    console.error('One of the promises failed:', error);
  });

// Race condition
const dataPromise = fetchData();
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Request timeout')), 3000);
});

Promise.race([dataPromise, timeoutPromise])
  .then(data => console.log('Data received:', data))
  .catch(error => console.error('Error:', error));
```

### Async/Await

The most modern and readable way to handle asynchronous code:

```javascript
async function fetchUserData(userId) {
  try {
    // Await pauses execution until the promise resolves
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    
    return {
      user,
      orders
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Re-throw or handle appropriately
  }
}

// Using an async function
fetchUserData(1)
  .then(data => console.log('User data:', data))
  .catch(error => console.error('Error:', error));

// Parallel operations with async/await
async function fetchAllData() {
  try {
    // Start both fetch operations in parallel
    const userPromise = fetchUser(1);
    const productsPromise = fetchProducts();
    
    // Wait for both to complete
    const [user, products] = await Promise.all([userPromise, productsPromise]);
    
    return { user, products };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## JavaScript Best Practices

### 1. Use Strict Mode

```javascript
'use strict';

// This helps catch common mistakes and prevents some unsafe actions
```

### 2. Avoid Global Variables

```javascript
// Bad
function badFunction() {
  globalVar = 'This is global'; // Implicit global variable
}

// Good
function goodFunction() {
  const localVar = 'This is local'; // Properly scoped variable
}
```

### 3. Use Meaningful Names

```javascript
// Bad
const x = 5;
const arr = [1, 2, 3];

// Good
const maxRetries = 5;
const activeUsers = [1, 2, 3];
```

### 4. Handle Errors Properly

```javascript
// Bad
function fetchData() {
  // No error handling
  return fetch('/api/data').then(res => res.json());
}

// Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // Re-throw for the caller to handle
  }
}
```

### 5. Use Modern Features Responsibly

```javascript
// Use const by default, let when needed
const MAX_ITEMS = 100; // For values that won't change
let currentCount = 0; // For values that will change

// Use template literals for string concatenation
const greeting = `Hello, ${name}!`;

// Use destructuring for cleaner code
const { id, name } = user;

// Use default parameters
function createUser(name, role = 'user') {
  // ...
}
```

### 6. Avoid Callback Hell

```javascript
// Bad - callback hell
fetchUser(userId, (userError, user) => {
  if (userError) {
    handleError(userError);
    return;
  }
  
  fetchOrders(user.id, (orderError, orders) => {
    if (orderError) {
      handleError(orderError);
      return;
    }
    
    fetchProducts(orders, (productError, products) => {
      // Even more nesting...
    });
  });
});

// Good - using async/await
async function getUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const products = await fetchProducts(orders);
    return { user, orders, products };
  } catch (error) {
    handleError(error);
  }
}
```

### 7. Use Linting and Formatting

Tools like ESLint and Prettier help maintain code quality and consistency:

```javascript
// ESLint configuration example
// .eslintrc.js
module.exports = {
  extends: 'eslint:recommended',
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'warn'
  }
};
```

## JavaScript for Internal Tools

When building internal tools, JavaScript is often used for:

1. **Data Manipulation**: Processing and transforming data from APIs
2. **Interactive UIs**: Creating dynamic, responsive interfaces
3. **Form Handling**: Validating and submitting form data
4. **Data Visualization**: Building charts and graphs
5. **API Integration**: Communicating with backend services

Consider these patterns for internal tools:

```javascript
// Data fetching with error handling and loading state
async function loadDashboardData() {
  const dashboard = document.getElementById('dashboard');
  const errorEl = document.getElementById('error');
  
  dashboard.innerHTML = '<div class="loading">Loading...</div>';
  errorEl.textContent = '';
  
  try {
    const response = await fetch('/api/dashboard-data');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    renderDashboard(data);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    dashboard.innerHTML = '';
    errorEl.textContent = `Failed to load dashboard: ${error.message}`;
  }
}

// Form validation
function validateForm(form) {
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const errors = {};
  
  // Validate name
  if (!nameInput.value.trim()) {
    errors.name = 'Name is required';
  }
  
  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Display errors
  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach(el => el.textContent = '');
  
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = form.querySelector(`.${field}-error`);
    if (errorEl) {
      errorEl.textContent = message;
    }
  });
  
  return Object.keys(errors).length === 0;
}

// Event delegation for dynamic content
document.getElementById('user-table').addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-button')) {
    const userId = event.target.dataset.userId;
    openEditModal(userId);
  } else if (event.target.classList.contains('delete-button')) {
    const userId = event.target.dataset.userId;
    confirmDelete(userId);
  }
});
```

## Exercises

Complete the following exercises to practice your JavaScript skills:

1. Create a function that takes an array of numbers and returns an object with properties for the sum, average, minimum, and maximum values

<details>
<summary>💡 Hint 1</summary>

Use array methods like `reduce()` for calculating sum, and `Math.min()` and `Math.max()` for finding minimum and maximum values.
</details>

<details>
<summary>💡 Hint 2</summary>

You can use the spread operator with Math methods like this: `Math.min(...numbers)` to find the minimum value in an array.
</details>

<details>
<summary>💡 Hint 3</summary>

Make sure to handle edge cases: what if the array is empty? What if it contains non-numeric values?
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Not handling empty arrays, which can lead to `Infinity` or `NaN` values
- Using `Math.min()` and `Math.max()` without the spread operator
- Forgetting to filter out non-numeric values before calculations
- Not checking if the array length is 0 before calculating the average (would cause division by zero)
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Handle empty arrays by returning appropriate default values
- Filter out non-numeric values using `typeof` or `isNaN()`
- Use `reduce()` to efficiently calculate the sum
- Correctly calculate the average by dividing the sum by the count of valid numbers
- Use spread syntax with `Math.min()` and `Math.max()` to find min and max values
- Return a well-structured object with all required properties

```javascript
function analyzeNumbers(numbers) {
  // Handle empty array
  if (!numbers || numbers.length === 0) {
    return { sum: 0, average: 0, min: null, max: null };
  }
  
  // Filter out non-numeric values
  const validNumbers = numbers.filter(num => typeof num === 'number' && !isNaN(num));
  
  if (validNumbers.length === 0) {
    return { sum: 0, average: 0, min: null, max: null };
  }
  
  const sum = validNumbers.reduce((total, num) => total + num, 0);
  const average = sum / validNumbers.length;
  const min = Math.min(...validNumbers);
  const max = Math.max(...validNumbers);
  
  return { sum, average, min, max };
}
```
</details>

2. Write a program that fetches data from an API and displays it in a table, with error handling and loading states

<details>
<summary>💡 Hint 1</summary>

Use the `fetch()` API to retrieve data from an endpoint. You can use a free API like JSONPlaceholder: `https://jsonplaceholder.typicode.com/users`
</details>

<details>
<summary>💡 Hint 2</summary>

Implement three states for your UI: loading, error, and success. Start with the loading state, switch to error if the fetch fails, or success if it succeeds.
</details>

<details>
<summary>💡 Hint 3</summary>

Create a function that will generate HTML table rows from the fetched data, handling all the properties you want to display.
</details>

<details>
<summary>💡 Hint 4</summary>

Use `try/catch` blocks with `async/await` for cleaner error handling of the fetch operation.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Forgetting to check if the response is ok (`response.ok`)
- Not handling network errors or invalid JSON responses
- Not showing appropriate loading indicators to the user
- Trying to access deeply nested properties without checking if they exist
- Not providing clear error messages when something goes wrong
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Show a loading state while data is being fetched
- Handle errors gracefully with informative messages
- Create a clean table structure for the fetched data
- Use async/await for cleaner asynchronous code
- Include proper error handling with try/catch

```javascript
async function fetchAndDisplayUsers() {
  const tableContainer = document.getElementById('table-container');
  
  // Show loading state
  tableContainer.innerHTML = '<p>Loading users...</p>';
  
  try {
    // Fetch data
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse JSON
    const users = await response.json();
    
    // Build table HTML
    const tableHTML = buildUsersTable(users);
    tableContainer.innerHTML = tableHTML;
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    tableContainer.innerHTML = `<p class="error">Error loading users: ${error.message}</p>`;
  }
}

function buildUsersTable(users) {
  if (!users || users.length === 0) {
    return '<p>No users found</p>';
  }
  
  // Extract column headers from first user
  const columns = ['id', 'name', 'email', 'phone', 'website'];
  
  // Build table header
  let html = '<table class="data-table"><thead><tr>';
  columns.forEach(column => {
    html += `<th>${column}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Build table rows
  users.forEach(user => {
    html += '<tr>';
    columns.forEach(column => {
      html += `<td>${user[column] || ''}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

// Call the function to fetch and display users
fetchAndDisplayUsers();
```
</details>

3. Implement a form validation system that checks input values and displays error messages

<details>
<summary>💡 Hint 1</summary>

Use regular expressions for pattern validation (like email format) and simple conditionals for required fields or length validation.
</details>

<details>
<summary>💡 Hint 2</summary>

Create a function that validates each field and returns an object containing any error messages. Then use this object to display errors next to the corresponding fields.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider real-time validation (on input or blur events) as well as form submission validation to provide immediate feedback to users.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Forgetting to prevent the default form submission behavior with `event.preventDefault()`
- Not clearing previous error messages before validating again
- Validating only on submit instead of providing real-time feedback
- Using overly complex regular expressions that may not handle all valid inputs
- Not providing clear, actionable error messages to help users correct their input
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Validate multiple form fields with different validation rules
- Show error messages next to the corresponding fields
- Support real-time validation for better user experience
- Clear error messages when the user corrects the input
- Prevent form submission if there are validation errors

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const fields = ['username', 'email', 'password', 'confirmPassword'];
  const errorElements = {};
  
  // Get all error elements
  fields.forEach(field => {
    errorElements[field] = document.getElementById(`${field}-error`);
  });
  
  // Add blur event listeners for real-time validation
  fields.forEach(field => {
    const input = document.getElementById(field);
    input.addEventListener('blur', () => {
      validateField(field, input.value);
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
      errorElements[field].textContent = '';
    });
  });
  
  // Form submit validation
  form.addEventListener('submit', (event) => {
    let isValid = true;
    
    // Validate all fields
    fields.forEach(field => {
      const input = document.getElementById(field);
      if (!validateField(field, input.value)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      event.preventDefault();
    }
  });
  
  function validateField(fieldName, value) {
    let error = '';
    
    switch (fieldName) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;
        
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailPattern.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;
        
      case 'confirmPassword':
        const password = document.getElementById('password').value;
        if (value !== password) {
          error = 'Passwords do not match';
        }
        break;
    }
    
    // Display error message
    errorElements[fieldName].textContent = error;
    
    // Return true if valid (no error)
    return error === '';
  }
});
```
</details>

4. Create a simple task management application with features to add, edit, delete, and mark tasks as complete

<details>
<summary>💡 Hint 1</summary>

Store tasks as an array of objects, where each object contains properties like `id`, `text`, `completed`, and `createdAt`.
</details>

<details>
<summary>💡 Hint 2</summary>

Use `localStorage` to persist tasks between page reloads:
```javascript
// Save tasks
localStorage.setItem('tasks', JSON.stringify(tasks));

// Load tasks
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
```
</details>

<details>
<summary>💡 Hint 3</summary>

Use event delegation to handle actions on tasks (like marking complete or deleting) instead of adding event listeners to each task element.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Not generating unique IDs for tasks, leading to issues when deleting or updating
- Forgetting to update localStorage after each change
- Adding event listeners directly to dynamically created elements
- Not sanitizing user input before adding it to the DOM
- Forgetting to update the UI after making changes to the tasks array
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Create a form for adding new tasks
- Display tasks with options to edit, delete, and mark as complete
- Store tasks in localStorage for persistence
- Use event delegation for better performance
- Handle all CRUD operations (Create, Read, Update, Delete)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  
  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Render tasks initially
  renderTasks();
  
  // Add new task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    
    const newTask = {
      id: Date.now().toString(), // Simple unique ID
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
  });
  
  // Event delegation for task actions
  taskList.addEventListener('click', (e) => {
    const taskId = e.target.closest('li')?.dataset.id;
    if (!taskId) return;
    
    // Delete task
    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(task => task.id !== taskId);
      saveTasks();
      renderTasks();
    }
    
    // Toggle completion
    if (e.target.classList.contains('complete-btn')) {
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      }
    }
    
    // Edit task
    if (e.target.classList.contains('edit-btn')) {
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
          task.text = newText.trim();
          saveTasks();
          renderTasks();
        }
      }
    }
  });
  
  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Render tasks to the DOM
  function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      taskList.innerHTML = '<p>No tasks yet. Add a task above!</p>';
      return;
    }
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.classList.add('task-item');
      if (task.completed) {
        li.classList.add('completed');
      }
      
      li.innerHTML = `
        <span class="task-text">${escapeHTML(task.text)}</span>
        <div class="task-actions">
          <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;
      
      taskList.appendChild(li);
    });
  }
  
  // Helper to escape HTML and prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => {
      const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return htmlEntities[match];
    });
  }
});
```
</details>

5. Build a data transformation utility that converts data from one format to another using array methods

<details>
<summary>💡 Hint 1</summary>

Use methods like `map()`, `filter()`, and `reduce()` to transform data. Chain these methods for complex transformations.
</details>

<details>
<summary>💡 Hint 2</summary>

Consider using object destructuring and the spread operator to extract and reshape object properties efficiently.
</details>

<details>
<summary>💡 Hint 3</summary>

Handle special cases like missing or null values in your transformation functions to make the utility robust in real-world scenarios.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Not handling null or undefined values in the source data
- Modifying the original data instead of creating new objects/arrays
- Writing overly complex transformations instead of breaking them down
- Forgetting to handle edge cases (empty arrays, missing properties)
- Not documenting the expected input and output formats
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Create a utility that can transform arrays of objects
- Support multiple transformation operations (filtering, mapping, grouping)
- Handle edge cases and invalid data gracefully
- Be flexible enough to work with different data structures
- Return a new data structure without modifying the original

```javascript
// Data Transformation Utility
const DataTransformer = {
  // Transform array of objects to another format
  transform(data, options = {}) {
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array');
    }
    
    let result = [...data]; // Create a copy to avoid modifying original
    
    // Apply filters if provided
    if (options.filters) {
      result = this.applyFilters(result, options.filters);
    }
    
    // Apply mapping if provided
    if (options.mapping) {
      result = this.applyMapping(result, options.mapping);
    }
    
    // Apply grouping if provided
    if (options.groupBy) {
      result = this.applyGrouping(result, options.groupBy);
    }
    
    // Apply sorting if provided
    if (options.sortBy) {
      result = this.applySorting(result, options.sortBy);
    }
    
    return result;
  },
  
  // Filter data based on criteria
  applyFilters(data, filters) {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        // Handle nested properties using dot notation
        if (key.includes('.')) {
          const props = key.split('.');
          let propValue = {...item};
          
          for (const prop of props) {
            propValue = propValue?.[prop];
            if (propValue === undefined) return false;
          }
          
          return propValue === value;
        }
        
        // Simple property comparison
        return item[key] === value;
      });
    });
  },
  
  // Transform objects using a mapping function or object
  applyMapping(data, mapping) {
    return data.map(item => {
      // If mapping is a function, use it directly
      if (typeof mapping === 'function') {
        return mapping(item);
      }
      
      // If mapping is an object with property mappings
      const result = {};
      
      Object.entries(mapping).forEach(([newKey, oldKey]) => {
        // Handle function transformers
        if (typeof oldKey === 'function') {
          result[newKey] = oldKey(item);
          return;
        }
        
        // Handle nested properties using dot notation
        if (typeof oldKey === 'string' && oldKey.includes('.')) {
          const props = oldKey.split('.');
          let value = {...item};
          
          for (const prop of props) {
            value = value?.[prop];
            if (value === undefined) break;
          }
          
          result[newKey] = value;
          return;
        }
        
        // Simple property mapping
        result[newKey] = item[oldKey];
      });
      
      return result;
    });
  },
  
  // Group data by a property
  applyGrouping(data, groupBy) {
    return data.reduce((groups, item) => {
      // Handle function for custom grouping
      let groupKey;
      
      if (typeof groupBy === 'function') {
        groupKey = groupBy(item);
      } else {
        groupKey = item[groupBy];
      }
      
      // Handle null/undefined group keys
      groupKey = groupKey ?? 'undefined';
      
      // Create group if it doesn't exist
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(item);
      return groups;
    }, {});
  },
  
  // Sort data by property or custom function
  applySorting(data, sortBy) {
    return [...data].sort((a, b) => {
      if (typeof sortBy === 'function') {
        return sortBy(a, b);
      }
      
      // Support objects with key and direction
      if (typeof sortBy === 'object') {
        const { key, direction = 'asc' } = sortBy;
        const multiplier = direction.toLowerCase() === 'desc' ? -1 : 1;
        
        if (a[key] < b[key]) return -1 * multiplier;
        if (a[key] > b[key]) return 1 * multiplier;
        return 0;
      }
      
      // Simple string property sorting
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
  }
};

// Example usage
const users = [
  { id: 1, name: 'Alice', age: 30, department: { id: 101, name: 'Engineering' }, active: true },
  { id: 2, name: 'Bob', age: 25, department: { id: 102, name: 'Marketing' }, active: false },
  { id: 3, name: 'Charlie', age: 35, department: { id: 101, name: 'Engineering' }, active: true },
  { id: 4, name: 'Diana', age: 28, department: { id: 103, name: 'HR' }, active: true }
];

// Transform example: get active users from Engineering department, map to simpler format, sort by age
const result = DataTransformer.transform(users, {
  filters: {
    active: true,
    'department.id': 101
  },
  mapping: {
    userId: 'id',
    fullName: 'name',
    userAge: 'age',
    department: 'department.name'
  },
  sortBy: { key: 'userAge', direction: 'desc' }
});

console.log(result);
```
</details>

## Additional Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) - Comprehensive reference
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [Eloquent JavaScript](https://eloquentjavascript.net/) - Free book by Marijn Haverbeke
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS) - Book series by Kyle Simpson
- [JavaScript 30](https://javascript30.com/) - Free 30-day vanilla JS coding challenge
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - Clean code concepts for JavaScript