# TypeScript Basics

## Introduction

TypeScript is a superset of JavaScript that adds static types and other features to make development more productive and code more maintainable. For developers building internal tools, TypeScript can significantly reduce bugs and improve the developer experience, especially as applications grow in complexity. This lesson covers the essential concepts and features of TypeScript.

## Why TypeScript?

TypeScript offers several benefits over plain JavaScript:

1. **Static Type Checking**: Catch errors during development rather than at runtime
2. **Better IDE Support**: Enhanced autocompletion, navigation, and refactoring
3. **Self-Documenting Code**: Types serve as documentation for how code should be used
4. **Safer Refactoring**: Change code with confidence, knowing the compiler will catch type errors
5. **Enhanced Collaboration**: Makes it easier for team members to understand and work with each other's code
6. **Improved Maintainability**: Especially valuable for internal tools that may be maintained for many years

## Getting Started with TypeScript

### Setting Up TypeScript

To start using TypeScript, you need to install it and configure your project:

```bash
# Install TypeScript globally
npm install -g typescript

# Or locally in your project
npm install --save-dev typescript

# Initialize a TypeScript project with a configuration file
npx tsc --init
```

This creates a `tsconfig.json` file, which configures the TypeScript compiler:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Compiling TypeScript

To compile TypeScript code to JavaScript:

```bash
# Compile a single file
tsc filename.ts

# Compile the entire project based on tsconfig.json
tsc

# Compile and watch for changes
tsc --watch
```

For development, you might use tools like ts-node to run TypeScript directly:

```bash
# Install ts-node
npm install -g ts-node

# Run a TypeScript file directly
ts-node filename.ts
```

## Basic Types

TypeScript provides several basic types:

```typescript
// Boolean
let isDone: boolean = false;

// Number (both integers and floats)
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// String
let color: string = "blue";
let greeting: string = `Hello, my name is ${name}`;

// Array
let list: number[] = [1, 2, 3];
let fruits: Array<string> = ["apple", "banana", "cherry"];

// Tuple (fixed-length array where each position has a specific type)
let person: [string, number] = ["Alice", 30];

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green; // 1

// Any (avoid when possible)
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

// Void (used for functions that don't return a value)
function logMessage(message: string): void {
  console.log(message);
}

// Null and Undefined
let u: undefined = undefined;
let n: null = null;

// Never (used for functions that never return or always throw errors)
function error(message: string): never {
  throw new Error(message);
}

// Object
let obj: object = { key: "value" };

// Type assertions (type casting)
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
// Alternative syntax with angle brackets
let otherLength: number = (<string>someValue).length;
```

## Interfaces and Type Aliases

Interfaces and type aliases allow you to define custom types:

### Interfaces

```typescript
// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function createUser(user: User): User {
  return user;
}

// Usage
const newUser = createUser({
  id: 1,
  name: "John",
  email: "john@example.com",
  isActive: true
});

// Optional properties
interface Product {
  id: number;
  name: string;
  description?: string; // Optional property
  price: number;
}

// Readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5; // Error: Cannot assign to 'x' because it is a read-only property

// Extending interfaces
interface Employee extends User {
  employeeId: string;
  department: string;
  salary: number;
}

// Implementing interfaces in classes
class AdminUser implements User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  permissions: string[];
  
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isActive = true;
    this.permissions = ["read", "write", "admin"];
  }
}
```

### Type Aliases

```typescript
// Basic type alias
type UserId = number;
type Username = string;

// Complex type alias
type User = {
  id: UserId;
  name: Username;
  email: string;
  isActive: boolean;
};

// Union types
type Status = "pending" | "approved" | "rejected";

function processApplication(status: Status) {
  switch (status) {
    case "pending":
      console.log("Application is being processed");
      break;
    case "approved":
      console.log("Application has been approved");
      break;
    case "rejected":
      console.log("Application has been rejected");
      break;
  }
}

// Combining types
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear: Bear = {
  name: "Winnie",
  honey: true
};
```

## Functions in TypeScript

TypeScript allows you to specify types for function parameters and return values:

```typescript
// Basic function type annotation
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

// Default parameters
function createElement(
  tag: string,
  text: string,
  className: string = "default"
): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = className;
  return element;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

// Function types
type MathFunction = (a: number, b: number) => number;

const addition: MathFunction = (a, b) => a + b;
const subtraction: MathFunction = (a, b) => a - b;

// Function overloads
function parseValue(value: string): string;
function parseValue(value: number): number;
function parseValue(value: boolean): boolean;
function parseValue(value: string | number | boolean): string | number | boolean {
  return value;
}
```

## Classes in TypeScript

TypeScript enhances JavaScript classes with type annotations and additional features:

```typescript
class Person {
  // Property types
  name: string;
  age: number;
  
  // Constructor with parameter types
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // Method with return type
  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// Class with access modifiers
class Employee {
  private id: number;
  protected department: string;
  public name: string;
  
  constructor(id: number, name: string, department: string) {
    this.id = id;
    this.name = name;
    this.department = department;
  }
  
  public getDetails(): string {
    return `${this.name} works in ${this.department}`;
  }
  
  private generateEmployeeId(): string {
    return `EMP-${this.id}`;
  }
}

// Parameter properties shorthand
class Product {
  constructor(
    public id: number,
    public name: string,
    private price: number,
    protected category: string
  ) {
    // Constructor body can be empty as properties are automatically created
  }
  
  public getPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }
}

// Inheritance
class Manager extends Employee {
  private team: Employee[] = [];
  
  constructor(id: number, name: string, department: string) {
    super(id, name, department);
  }
  
  public addTeamMember(employee: Employee): void {
    this.team.push(employee);
  }
  
  public getTeamSize(): number {
    return this.team.length;
  }
  
  // Override method
  public getDetails(): string {
    return `${super.getDetails()} as a manager`;
  }
}

// Abstract classes
abstract class Shape {
  constructor(protected color: string) {}
  
  abstract calculateArea(): number;
  
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }
  
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}
```

## Advanced Types

TypeScript offers advanced type features for more complex scenarios:

### Union and Intersection Types

```typescript
// Union types - can be one of several types
type StringOrNumber = string | number;

function logId(id: StringOrNumber) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// Intersection types - combine multiple types
type Employee = {
  id: number;
  name: string;
};

type Manager = {
  employeesCount: number;
  department: string;
};

type ManagerWithEmployeeInfo = Employee & Manager;

const manager: ManagerWithEmployeeInfo = {
  id: 1,
  name: "John Smith",
  employeesCount: 5,
  department: "Engineering"
};
```

### Type Guards

```typescript
// Type guard using typeof
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is a string in this block
    return value.toUpperCase();
  } else {
    // TypeScript knows value is a number in this block
    return value.toFixed(2);
  }
}

// Type guard using instanceof
class Customer {
  name: string;
  email: string;
  
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

class Admin {
  name: string;
  permissions: string[];
  
  constructor(name: string, permissions: string[]) {
    this.name = name;
    this.permissions = permissions;
  }
}

type User = Customer | Admin;

function isAdmin(user: User): user is Admin {
  return (user as Admin).permissions !== undefined;
}

function greetUser(user: User) {
  console.log(`Hello, ${user.name}`);
  
  if (isAdmin(user)) {
    // TypeScript knows user is Admin here
    console.log(`You have ${user.permissions.length} permissions`);
  } else {
    // TypeScript knows user is Customer here
    console.log(`Your email is ${user.email}`);
  }
}
```

### Generics

Generics allow you to create reusable components that work with a variety of types:

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42); // Returns number
const str = identity<string>("hello"); // Returns string

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
const name = getProperty(person, "name"); // Returns "John"
const age = getProperty(person, "age"); // Returns 30
// const invalid = getProperty(person, "address"); // Error: 'address' is not assignable to parameter of type 'name' | 'age'

// Generic classes
class Queue<T> {
  private data: T[] = [];
  
  push(item: T): void {
    this.data.push(item);
  }
  
  pop(): T | undefined {
    return this.data.shift();
  }
  
  peek(): T | undefined {
    return this.data[0];
  }
  
  get length(): number {
    return this.data.length;
  }
}

const numberQueue = new Queue<number>();
numberQueue.push(10);
numberQueue.push(20);
const firstNumber = numberQueue.pop(); // 10

const stringQueue = new Queue<string>();
stringQueue.push("hello");
stringQueue.push("world");
const firstString = stringQueue.pop(); // "hello"
```

### Utility Types

TypeScript provides several built-in utility types for common type transformations:

```typescript
// Partial - makes all properties optional
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

function updateProduct(id: number, productUpdate: Partial<Product>) {
  // Update only the provided properties
}

updateProduct(1, { price: 29.99 }); // Valid, only updating price

// Required - makes all properties required
interface ContactForm {
  name?: string;
  email?: string;
  message?: string;
}

function submitForm(form: Required<ContactForm>) {
  // All fields are guaranteed to be present
}

// Readonly - makes all properties readonly
function freezeProduct(product: Product): Readonly<Product> {
  return Object.freeze({...product});
}

// Record - creates a type with specified property keys and value types
type CategoryTypes = "electronics" | "clothing" | "books";
const inventory: Record<CategoryTypes, Product[]> = {
  electronics: [{id: 1, name: "Laptop", price: 999.99, category: "electronics"}],
  clothing: [{id: 2, name: "T-Shirt", price: 19.99, category: "clothing"}],
  books: [{id: 3, name: "TypeScript Guide", price: 39.99, category: "books"}]
};

// Pick - creates a type by picking selected properties
type ProductSummary = Pick<Product, "id" | "name" | "price">;

// Omit - creates a type by omitting selected properties
type ProductWithoutCategory = Omit<Product, "category">;

// Exclude - excludes types from a union
type Numbers = 1 | 2 | 3 | 4 | 5;
type EvenNumbers = Exclude<Numbers, 1 | 3 | 5>; // 2 | 4

// Extract - extracts types from a union that are assignable to another type
type OnlyStrings = Extract<string | number | boolean, string>; // string

// NonNullable - removes null and undefined from a type
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// ReturnType - extracts the return type of a function
function createProduct(name: string, price: number): Product {
  return { id: Date.now(), name, price, category: "unknown" };
}

type NewProduct = ReturnType<typeof createProduct>; // Product
```

## TypeScript with React

TypeScript works particularly well with React for building internal tools:

```tsx
// React component with TypeScript
import React, { useState, useEffect } from 'react';

// Define prop types with an interface
interface UserProfileProps {
  userId: number;
  showDetails: boolean;
  onUpdate?: (user: User) => void;
}

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// React component with typed props and state
const UserProfile: React.FC<UserProfileProps> = ({ userId, showDetails, onUpdate }) => {
  // Typed state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const userData: User = await response.json();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  // Event handler with typed parameter
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      const newRole = e.target.value as User['role'];
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      
      if (onUpdate) {
        onUpdate(updatedUser);
      }
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      
      {showDetails && (
        <div className="user-details">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={user.role}
            onChange={handleRoleChange}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
```

## TypeScript Best Practices

Here are some best practices to follow when working with TypeScript:

### 1. Enable Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This enables a range of type checking options for maximum safety.

### 2. Minimize Use of `any`

The `any` type bypasses type checking, which defeats the purpose of using TypeScript. Instead:

```typescript
// Bad
function formatData(data: any) {
  return data.map(item => item.name);
}

// Good
interface DataItem {
  id: number;
  name: string;
}

function formatData(data: DataItem[]) {
  return data.map(item => item.name);
}
```

### 3. Use Type Inference When Appropriate

TypeScript can often infer types, so you don't always have to explicitly specify them:

```typescript
// Unnecessary explicit typing
const name: string = "Alice";

// Let TypeScript infer the type
const name = "Alice";

// But be explicit with function parameters and return types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

### 4. Use TypeScript with Linting

ESLint with TypeScript support provides additional safety and consistency:

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

### 5. Prefer Interfaces for Public APIs, Type Aliases for Complex Types

```typescript
// Interface for a public API
interface User {
  id: number;
  name: string;
  email: string;
}

// Type alias for a complex type
type ValidationResult = 
  | { valid: true; value: string }
  | { valid: false; error: string };
```

### 6. Use Discriminated Unions for State Management

```typescript
// State types with discriminated union
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleRequest<T>(state: RequestState<T>) {
  switch (state.status) {
    case 'idle':
      return <div>Not started</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>Data: {JSON.stringify(state.data)}</div>;
    case 'error':
      return <div>Error: {state.error}</div>;
  }
}
```

### 7. Use Readonly for Immutable Data

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 3000
};
```

## TypeScript for Internal Tools

When building internal tools, TypeScript can bring several specific benefits:

### 1. Type Definitions for APIs

```typescript
// Define API response types
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  permissions: string[];
}

interface ApiResponse<T> {
  data: T;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
  };
}

// Use the types
async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### 2. Form State Management

```typescript
interface EmployeeForm {
  name: string;
  email: string;
  department: string;
  startDate: Date;
  salary: number;
  isManager: boolean;
}

function validateForm(form: EmployeeForm): Record<keyof EmployeeForm, string | null> {
  const errors: Record<keyof EmployeeForm, string | null> = {
    name: null,
    email: null,
    department: null,
    startDate: null,
    salary: null,
    isManager: null
  };
  
  if (!form.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required';
  }
  
  if (!form.department) {
    errors.department = 'Department is required';
  }
  
  if (form.salary <= 0) {
    errors.salary = 'Salary must be greater than zero';
  }
  
  return errors;
}
```

### 3. Configuration Types

```typescript
// Type-safe configuration
interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    darkMode: boolean;
    betaFeatures: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    endpoint?: string;
  };
}

// Default configuration with types
const defaultConfig: AppConfig = {
  api: {
    baseUrl: 'https://api.company.internal',
    timeout: 5000,
    retryAttempts: 3
  },
  features: {
    darkMode: false,
    betaFeatures: false
  },
  logging: {
    level: 'info'
  }
};

// Merge with environment-specific config
function mergeConfig(overrides: Partial<AppConfig>): AppConfig {
  return {
    ...defaultConfig,
    ...overrides,
    api: {
      ...defaultConfig.api,
      ...overrides.api
    },
    features: {
      ...defaultConfig.features,
      ...overrides.features
    },
    logging: {
      ...defaultConfig.logging,
      ...overrides.logging
    }
  };
}
```

### 4. Component Props Documentation

TypeScript's interfaces provide automatic documentation for your components:

```tsx
interface DataTableProps<T> {
  /** Array of data items to display */
  data: T[];
  
  /** List of columns to show */
  columns: Array<{
    /** Unique column identifier */
    key: keyof T;
    /** Display name for the column header */
    header: string;
    /** Width of the column (number or percentage) */
    width?: string | number;
    /** Custom render function for the cell */
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  
  /** Whether to show row selection checkboxes */
  selectable?: boolean;
  
  /** Callback when row selection changes */
  onSelectionChange?: (selectedItems: T[]) => void;
  
  /** Custom CSS class for the table */
  className?: string;
}

function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  // Implementation
}
```

## Exercises

Complete the following exercises to practice your TypeScript skills:

1. Convert a JavaScript function that processes form data into TypeScript with proper type definitions

<details>
<summary>💡 Hint 1</summary>

Start by defining interfaces for your form data and any related types. Consider what properties the form has and what types each property should be.
</details>

<details>
<summary>💡 Hint 2</summary>

Add type annotations to function parameters and return values. Use utility types like `Partial<T>` if only some form fields might be present.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider using union types to represent different possible outcomes, like a successful validation result versus an error result.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Using `any` type instead of defining proper interfaces
- Not handling optional fields with `?` or in validation logic
- Forgetting to add return type annotations to functions
- Not using type narrowing in conditional branches
- Creating overly complex type structures when simpler ones would suffice
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Define clear interfaces for form data and validation results
- Use proper type annotations for all functions, parameters, and return values
- Implement proper error handling with typed error responses
- Use union types where appropriate for different result possibilities
- Leverage TypeScript's type system to catch potential runtime errors

```typescript
// Original JavaScript function
/*
function processForm(formData) {
  // Validate
  const errors = {};
  
  if (!formData.name) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email || !formData.email.includes('@')) {
    errors.email = 'Valid email is required';
  }
  
  if (formData.age !== undefined && formData.age < 18) {
    errors.age = 'Must be at least 18 years old';
  }
  
  // Return result
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  
  // Process the valid data
  return {
    success: true,
    data: {
      ...formData,
      processed: true,
      timestamp: new Date()
    }
  };
}
*/

// TypeScript version
interface UserFormData {
  name: string;
  email: string;
  age?: number;
  address?: string;
  phone?: string;
}

type ValidationErrors = {
  [K in keyof UserFormData]?: string;
};

interface ValidationSuccess {
  success: true;
  data: UserFormData & {
    processed: boolean;
    timestamp: Date;
  };
}

interface ValidationFailure {
  success: false;
  errors: ValidationErrors;
}

type ValidationResult = ValidationSuccess | ValidationFailure;

function validateForm(formData: UserFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // Required field validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailPattern.test(formData.email)) {
    errors.email = 'Valid email is required';
  }
  
  // Age validation (optional field)
  if (formData.age !== undefined) {
    if (typeof formData.age !== 'number') {
      errors.age = 'Age must be a number';
    } else if (formData.age < 18) {
      errors.age = 'Must be at least 18 years old';
    }
  }
  
  // Phone validation (optional field)
  if (formData.phone !== undefined && formData.phone.trim() !== '') {
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
  }
  
  return errors;
}

function processForm(formData: UserFormData): ValidationResult {
  // Validate
  const errors = validateForm(formData);
  
  // Return result
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  
  // Process the valid data
  return {
    success: true,
    data: {
      ...formData,
      processed: true,
      timestamp: new Date()
    }
  };
}

// Type guard for checking the result type
function isSuccess(result: ValidationResult): result is ValidationSuccess {
  return result.success === true;
}

// Example usage
function handleFormSubmission(formData: UserFormData): void {
  const result = processForm(formData);
  
  if (isSuccess(result)) {
    // TypeScript knows this is ValidationSuccess
    console.log('Form processed successfully:', result.data);
    saveToDatabase(result.data);
  } else {
    // TypeScript knows this is ValidationFailure
    console.log('Validation failed:', result.errors);
    displayErrors(result.errors);
  }
}

function saveToDatabase(data: ValidationSuccess['data']): void {
  // Save to database logic
  console.log('Saving to database:', data);
}

function displayErrors(errors: ValidationErrors): void {
  // Display errors in the UI
  console.log('Displaying errors:', errors);
}
```
</details>

2. Create a generic `DataCache<T>` class that can store and retrieve different types of data

<details>
<summary>💡 Hint 1</summary>

Use generics to create a flexible cache class that can work with any data type. Include methods for storing, retrieving, and checking if data exists.
</details>

<details>
<summary>💡 Hint 2</summary>

Implement an expiration system using timestamps to automatically invalidate old cache entries.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider adding methods for purging expired entries, clearing the entire cache, or getting statistics about cache usage.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Not using generics properly, limiting the cache to a specific data type
- Forgetting to check for expired entries when retrieving data
- Not implementing proper error handling for cache misses
- Storing references to objects that can be modified outside the cache
- Not considering memory management for large cached items
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Use TypeScript generics to create a flexible cache for any data type
- Implement proper expiration handling for cache entries
- Include methods for all basic operations (get, set, delete, check)
- Handle edge cases like cache misses and expired data
- Consider performance and memory usage

```typescript
interface CacheEntry<T> {
  data: T;
  expiresAt: number | null; // Timestamp in milliseconds, null for no expiration
  createdAt: number;        // Timestamp in milliseconds
  lastAccessed: number;     // Timestamp in milliseconds
  accessCount: number;      // How many times the item was accessed
}

interface CacheOptions {
  expirationTime?: number;  // Time in milliseconds until the entry expires
  maxSize?: number;         // Maximum number of items in the cache
  logAccess?: boolean;      // Whether to log access statistics
}

class DataCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly defaultOptions: Required<CacheOptions> = {
    expirationTime: 3600000, // 1 hour in milliseconds
    maxSize: 100,            // Maximum 100 items by default
    logAccess: true          // Log access by default
  };
  private options: Required<CacheOptions>;
  
  constructor(options: CacheOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }
  
  /**
   * Sets a value in the cache
   */
  set(key: string, data: T, options?: CacheOptions): void {
    const now = Date.now();
    const mergedOptions = { ...this.options, ...options };
    
    // Enforce max size limit
    if (this.cache.size >= this.options.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }
    
    const expiresAt = mergedOptions.expirationTime
      ? now + mergedOptions.expirationTime
      : null;
      
    this.cache.set(key, {
      data: this.cloneData(data), // Store a copy to prevent mutation
      expiresAt,
      createdAt: now,
      lastAccessed: now,
      accessCount: 0
    });
  }
  
  /**
   * Retrieves a value from the cache
   * Returns undefined if the key doesn't exist or the entry has expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if expired
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.delete(key);
      return undefined;
    }
    
    // Update access statistics if enabled
    if (this.options.logAccess) {
      entry.lastAccessed = Date.now();
      entry.accessCount++;
    }
    
    // Return a copy to prevent mutations from affecting the cached version
    return this.cloneData(entry.data);
  }
  
  /**
   * Checks if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if expired
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Deletes a key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clears all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Gets the size of the cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Removes all expired items from the cache
   */
  purgeExpired(): number {
    const now = Date.now();
    let purgedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.cache.delete(key);
        purgedCount++;
      }
    }
    
    return purgedCount;
  }
  
  /**
   * Gets cache statistics
   */
  getStats(): { size: number; expired: number; averageAccessCount: number } {
    const now = Date.now();
    let expired = 0;
    let totalAccessCount = 0;
    
    for (const entry of this.cache.values()) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        expired++;
      }
      totalAccessCount += entry.accessCount;
    }
    
    const size = this.cache.size;
    
    return {
      size,
      expired,
      averageAccessCount: size > 0 ? totalAccessCount / size : 0
    };
  }
  
  /**
   * Gets all valid keys in the cache
   */
  keys(): string[] {
    this.purgeExpired(); // Clean up expired keys first
    return Array.from(this.cache.keys());
  }
  
  /**
   * Evicts the oldest (least recently accessed) item from the cache
   */
  private evictOldest(): boolean {
    if (this.cache.size === 0) return false;
    
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey !== null) {
      return this.cache.delete(oldestKey);
    }
    
    return false;
  }
  
  /**
   * Creates a deep clone of data to prevent reference issues
   * Note: This is a simple implementation and might not work for all data types
   */
  private cloneData(data: T): T {
    if (data === null || data === undefined) {
      return data;
    }
    
    // For primitive types or functions, return as is
    if (typeof data !== 'object') {
      return data;
    }
    
    // For dates, return a new Date
    if (data instanceof Date) {
      return new Date(data.getTime()) as unknown as T;
    }
    
    // For arrays, map over all elements
    if (Array.isArray(data)) {
      return data.map(item => this.cloneData(item)) as unknown as T;
    }
    
    // For objects, recursively clone all properties
    return Object.keys(data).reduce((clone, key) => {
      const typedData = data as Record<string, any>;
      const typedClone = clone as Record<string, any>;
      typedClone[key] = this.cloneData(typedData[key]);
      return clone;
    }, {} as T);
  }
}

// Example usage

// String cache
const stringCache = new DataCache<string>({
  expirationTime: 5000, // 5 seconds
  maxSize: 10
});

stringCache.set('greeting', 'Hello, TypeScript!');
console.log(stringCache.get('greeting')); // 'Hello, TypeScript!'

// Object cache
interface User {
  id: number;
  name: string;
  email: string;
}

const userCache = new DataCache<User>();

userCache.set('user1', {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

const user = userCache.get('user1');
console.log(user); // { id: 1, name: 'Alice', email: 'alice@example.com' }
```
</details>

3. Define interfaces for an e-commerce application's Product, Order, and Customer types

<details>
<summary>💡 Hint 1</summary>

Think about the properties each entity should have and their relationships. For example, an Order will reference both Product and Customer types.
</details>

<details>
<summary>💡 Hint 2</summary>

Use union types for properties that could have multiple possible values (like order status), and consider using utility types like `Readonly` for immutable properties.
</details>

<details>
<summary>💡 Hint 3</summary>

Don't forget to define related interfaces for nested objects, like Address for a Customer, or LineItem for an Order.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Using primitive types for IDs instead of creating more specific types
- Not defining all necessary properties for each entity
- Missing relationships between entities (e.g., not including customer reference in orders)
- Using overly generic types (like `any`) instead of specific ones
- Not considering nullability or optionality of certain fields
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Define comprehensive interfaces for all major e-commerce entities
- Create proper relationships between entities
- Use specific types for all properties instead of generic ones
- Include proper type constraints for fields that have limited values
- Consider both required and optional fields appropriately

```typescript
// Type aliases for specific IDs to improve type safety
type ProductId = string;
type OrderId = string;
type CustomerId = string;

// Product-related interfaces
interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  parentCategory?: number; // For hierarchical categories
}

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

type ProductStatus = 'active' | 'outOfStock' | 'discontinued' | 'comingSoon';

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  attributes: Record<string, string>; // e.g., { color: 'red', size: 'M' }
}

interface Product {
  id: ProductId;
  name: string;
  description: string;
  slug: string; // URL-friendly version of name
  brand?: string;
  categories: ProductCategory[];
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  basePrice: number;
  taxRate?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  metadata?: Record<string, unknown>; // For any extra product data
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
}

// Address interface used by both shipping and billing
interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Customer-related interfaces
interface CustomerWishlistItem {
  productId: ProductId;
  addedAt: Date;
  notes?: string;
}

type CustomerStatus = 'active' | 'inactive' | 'blocked';

interface Customer {
  id: CustomerId;
  email: string;
  passwordHash?: string; // Only stored for non-OAuth customers
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  birthDate?: Date;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  addresses: Address[];
  defaultBillingAddressId?: number;
  defaultShippingAddressId?: number;
  wishlist: CustomerWishlistItem[];
  marketingPreferences: {
    emailOptIn: boolean;
    smsOptIn: boolean;
    directMailOptIn: boolean;
  };
  notes?: string; // Internal notes, not visible to customer
  metadata?: Record<string, unknown>; // For any extra customer data
}

// Order-related interfaces
interface LineItem {
  productId: ProductId;
  variantId: number;
  name: string; // Stored at time of purchase in case product changes
  sku: string;
  quantity: number;
  unitPrice: number;
  discounts: {
    type: 'percentage' | 'fixed';
    amount: number;
    code?: string;
    description: string;
  }[];
  taxAmount: number;
  totalPrice: number; // (unitPrice * quantity) - discounts + tax
  metadata?: Record<string, unknown>;
}

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'gift_card' | 'store_credit';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  cardLast4?: string; // Last 4 digits if credit card
  transactionId?: string; // External payment processor ID
  createdAt: Date;
}

type FulfillmentStatus = 
  | 'pending' 
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'returned';

interface Shipment {
  id: string;
  carrier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  items: Array<{ lineItemId: number; quantity: number }>;
}

type OrderStatus = 
  | 'cart' // Not yet placed
  | 'pending' 
  | 'processing'
  | 'completed'
  | 'canceled';

interface Order {
  id: OrderId;
  customerId: CustomerId;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  placedAt?: Date; // When the order was actually placed (vs. cart creation)
  lineItems: LineItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number; // Sum of line items before discounts or tax
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number; // Final amount
  notes?: string;
  currency: string; // USD, EUR, etc.
  payments: Payment[];
  paymentStatus: PaymentStatus;
  shipments: Shipment[];
  fulfillmentStatus: FulfillmentStatus;
  refunds?: Array<{
    id: string;
    amount: number;
    reason: string;
    createdAt: Date;
  }>;
  metadata?: Record<string, unknown>;
}

// Shopping cart (in-progress order)
interface Cart {
  id: string;
  customerId?: CustomerId; // Optional for guest checkout
  lineItems: LineItem[];
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  discounts: Array<{
    code: string;
    type: 'percentage' | 'fixed';
    amount: number;
    description: string;
  }>;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // When to expire abandoned carts
  metadata?: Record<string, unknown>;
}

// Example usage
function calculateOrderTotal(order: Order): number {
  return order.lineItems.reduce((total, item) => total + item.totalPrice, 0);
}

function findCustomerOrders(customer: Customer, orders: Order[]): Order[] {
  return orders.filter(order => order.customerId === customer.id);
}

function isProductInStock(product: Product, variantId: number): boolean {
  const variant = product.variants.find(v => v.id === variantId);
  return variant ? variant.stockQuantity > 0 : false;
}
```
</details>

4. Implement a utility function that uses union types and type guards to handle different API response formats

<details>
<summary>💡 Hint 1</summary>

Create union types to represent the different possible response formats, with a discriminating property that can be used to determine the type at runtime.
</details>

<details>
<summary>💡 Hint 2</summary>

Implement type guards using the `is` keyword to narrow down the type of the response, allowing TypeScript to know which properties are available in each code branch.
</details>

<details>
<summary>💡 Hint 3</summary>

Make your utility function generic so it can handle different types of data payloads while still preserving type safety.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Not using proper discriminated unions for different response types
- Forgetting to implement type guards, relying on type assertions instead
- Missing edge cases in error handling (like network errors)
- Not making the utility function generic enough to handle different data types
- Failing to propagate specific error types through the response handling
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Define clear interfaces for different response formats
- Use discriminated unions to differentiate between response types
- Implement proper type guards to narrow down types
- Make functions generic to handle various data payloads
- Include comprehensive error handling

```typescript
// Define the different API response formats

// Success response with data
interface SuccessResponse<T> {
  status: 'success';
  data: T;
  timestamp: string; // ISO date string
}

// Error response with message and code
interface ErrorResponse {
  status: 'error';
  message: string;
  code: number;
  timestamp: string; // ISO date string
}

// Rate limit exceeded response
interface RateLimitResponse {
  status: 'rate_limited';
  retryAfter: number; // Seconds until retry is allowed
  limit: number; // Rate limit cap
  timestamp: string; // ISO date string
}

// Maintenance mode response
interface MaintenanceResponse {
  status: 'maintenance';
  estimatedCompletion: string; // ISO date string
  message: string;
  timestamp: string; // ISO date string
}

// Union type for all possible response formats
type ApiResponse<T> = 
  | SuccessResponse<T>
  | ErrorResponse
  | RateLimitResponse
  | MaintenanceResponse;

// Type guards to check response types
function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.status === 'success';
}

function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.status === 'error';
}

function isRateLimitResponse<T>(response: ApiResponse<T>): response is RateLimitResponse {
  return response.status === 'rate_limited';
}

function isMaintenanceResponse<T>(response: ApiResponse<T>): response is MaintenanceResponse {
  return response.status === 'maintenance';
}

// Custom error classes for different types of errors
class ApiError extends Error {
  code: number;
  timestamp: Date;
  
  constructor(message: string, code: number, timestamp: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.timestamp = new Date(timestamp);
  }
}

class RateLimitError extends Error {
  retryAfter: number;
  limit: number;
  timestamp: Date;
  
  constructor(retryAfter: number, limit: number, timestamp: string) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.limit = limit;
    this.timestamp = new Date(timestamp);
  }
}

class MaintenanceError extends Error {
  estimatedCompletion: Date;
  timestamp: Date;
  
  constructor(message: string, estimatedCompletion: string, timestamp: string) {
    super(message);
    this.name = 'MaintenanceError';
    this.estimatedCompletion = new Date(estimatedCompletion);
    this.timestamp = new Date(timestamp);
  }
}

// Utility function to process API responses
async function handleApiResponse<T, R>(
  apiCall: () => Promise<ApiResponse<T>>,
  processor?: (data: T) => R
): Promise<R> {
  try {
    const response = await apiCall();
    
    // Handle different response types
    if (isSuccessResponse(response)) {
      const result = processor ? processor(response.data) : response.data as unknown as R;
      return result;
    } else if (isErrorResponse(response)) {
      throw new ApiError(response.message, response.code, response.timestamp);
    } else if (isRateLimitResponse(response)) {
      throw new RateLimitError(response.retryAfter, response.limit, response.timestamp);
    } else if (isMaintenanceResponse(response)) {
      throw new MaintenanceError(
        response.message,
        response.estimatedCompletion,
        response.timestamp
      );
    }
    
    // This should never happen if the types are correct, but TypeScript requires it
    throw new Error('Unexpected response format');
  } catch (error) {
    // Handle network or JSON parsing errors
    if (error instanceof ApiError || 
        error instanceof RateLimitError || 
        error instanceof MaintenanceError) {
      throw error; // Re-throw our custom errors
    }
    
    // Handle unexpected errors (like network issues)
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      500,
      new Date().toISOString()
    );
  }
}

// Example usage with different response types

// Mock API functions for demonstration
async function fetchUser(id: number): Promise<ApiResponse<{ id: number; name: string; email: string }>> {
  // Simulate API call
  return {
    status: 'success',
    data: { id, name: 'John Doe', email: 'john@example.com' },
    timestamp: new Date().toISOString()
  };
}

async function fetchProduct(id: number): Promise<ApiResponse<{ id: number; name: string; price: number }>> {
  // Simulate an error response
  return {
    status: 'error',
    message: 'Product not found',
    code: 404,
    timestamp: new Date().toISOString()
  };
}

async function fetchOrders(): Promise<ApiResponse<{ id: number; total: number }[]>> {
  // Simulate a rate limit response
  return {
    status: 'rate_limited',
    retryAfter: 60,
    limit: 100,
    timestamp: new Date().toISOString()
  };
}

// Example usage
async function demo() {
  try {
    // Successful response
    const user = await handleApiResponse(() => fetchUser(1));
    console.log('User:', user.name);
    
    // Error response
    const product = await handleApiResponse(() => fetchProduct(2));
    console.log('Product:', product); // This won't execute due to the error
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.code}): ${error.message}`);
    } else if (error instanceof RateLimitError) {
      console.error(`Rate limited: Retry after ${error.retryAfter} seconds`);
      // Schedule retry
      setTimeout(() => {
        console.log('Retrying request...');
      }, error.retryAfter * 1000);
    } else if (error instanceof MaintenanceError) {
      console.error(`Maintenance: ${error.message}. Try again after ${error.estimatedCompletion.toLocaleString()}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// With transformation function
async function fetchAndTransform() {
  const formattedUser = await handleApiResponse(
    () => fetchUser(1),
    (user) => ({
      displayName: `${user.name} <${user.email}>`,
      userId: user.id
    })
  );
  
  console.log('Formatted user:', formattedUser.displayName);
}
```
</details>

5. Create a React component with TypeScript that manages form state with proper typing

<details>
<summary>💡 Hint 1</summary>

Define interfaces for your form field values and errors. Use generics to make the component reusable with different form types.
</details>

<details>
<summary>💡 Hint 2</summary>

Use proper typing for event handlers, such as `React.ChangeEvent<HTMLInputElement>` for input change events.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider using a custom hook approach to extract form logic and make it reusable across multiple forms while maintaining type safety.
</details>

<details>
<summary>⚠️ Common Mistakes</summary>

- Using `any` types for form values or event handlers
- Not properly typing event objects for different input types
- Creating overly coupled form components that aren't reusable
- Forgetting to handle different input types (text, checkbox, select, etc.)
- Not providing proper TypeScript generics for reusable form hooks
</details>

<details>
<summary>📝 Solution Guidelines</summary>

Your solution should:
- Define proper interfaces for form values and errors
- Use generic types to create reusable form components/hooks
- Handle all input types with correct event typing
- Implement form validation with proper type safety
- Separate logic from presentation for better reusability

```tsx
import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';

// Generic form hook that can work with any form shape
function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes for different input types
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target as HTMLInputElement;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' 
        ? (event.target as HTMLInputElement).checked 
        : value
    }));
  }, []);
  
  // Handle blur events for field validation
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur if validation function exists
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [validate, values]);
  
  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Submit handler with validation
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>, onSubmit: (values: T) => Promise<void> | void) => {
      event.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);
      
      // Validate all fields
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        // Don't submit if there are errors
        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values]
  );
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
}

// Example usage with a registration form

interface RegistrationFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  role: 'user' | 'admin' | 'editor';
}

const RegistrationForm: React.FC = () => {
  const initialValues: RegistrationFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    role: 'user'
  };
  
  // Validation function
  const validateForm = (values: RegistrationFormValues): Partial<Record<keyof RegistrationFormValues, string>> => {
    const errors: Partial<Record<keyof RegistrationFormValues, string>> = {};
    
    if (!values.username) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!values.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    return errors;
  };
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm<RegistrationFormValues>(initialValues, validateForm);
  
  const onSubmit = async (formValues: RegistrationFormValues): Promise<void> => {
    // Simulate API call
    console.log('Submitting form with values:', formValues);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted successfully');
    resetForm();
  };
  
  return (
    <div className="registration-form-container">
      <h2>Register</h2>
      <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.username && errors.username ? 'input-error' : ''}
          />
          {touched.username && errors.username && (
            <div className="error-message">{errors.username}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.email && errors.email ? 'input-error' : ''}
          />
          {touched.email && errors.email && (
            <div className="error-message">{errors.email}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.password && errors.password ? 'input-error' : ''}
          />
          {touched.password && errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={values.acceptTerms}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            I accept the terms and conditions
          </label>
          {touched.acceptTerms && errors.acceptTerms && (
            <div className="error-message">{errors.acceptTerms}</div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
          <button type="button" onClick={resetForm} disabled={isSubmitting}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// Custom input component with TypeScript
interface InputFieldProps<T> {
  name: keyof T & string;
  label: string;
  type?: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
}

function InputField<T>({ 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder 
}: InputFieldProps<T>) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={touched && error ? 'input-error' : ''}
      />
      {touched && error && <div className="error-message">{error}</div>}
    </div>
  );
}

// Usage of the custom input component
const RegistrationFormWithComponents: React.FC = () => {
  // ... same setup as before
  
  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
      <InputField<RegistrationFormValues>
        name="username"
        label="Username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.username}
        touched={touched.username}
        placeholder="Enter username"
      />
      
      {/* ... other fields */}
      
      <button type="submit">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
    </form>
  );
};
```
</details>

## Additional Resources

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/) - Comprehensive guide
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - Free in-depth book
- [Total TypeScript](https://www.totaltypescript.com/) - Advanced TypeScript tutorials
- [TypeScript Playground](https://www.typescriptlang.org/play) - Experiment with TypeScript online
- [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) - Type definitions for JavaScript libraries
- [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint) - ESLint support for TypeScript