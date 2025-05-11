# Design Patterns

## Introduction

Design patterns are typical solutions to commonly occurring problems in software design. They are like pre-made blueprints that you can customize to solve recurring design problems in your code. This lesson covers essential design patterns that will help you write more maintainable, flexible, and robust code for your internal tools.

## What Are Design Patterns?

Design patterns are not specific pieces of code, but rather concepts that solve particular problems. They provide a common language for developers to communicate effectively about software design. Patterns have been refined over time by countless developers and have proven their effectiveness.

## Benefits of Using Design Patterns

- **Proven solutions**: They represent best practices developed and improved over time
- **Reusability**: They help prevent subtle issues that can cause major problems
- **Expressive**: They can make your code more readable and maintainable
- **Communication**: They provide a common vocabulary for developers
- **Abstraction**: They help you think at a higher level about your design

## Categories of Design Patterns

Design patterns typically fall into three main categories:

1. **Creational Patterns**: Deal with object creation mechanisms
2. **Structural Patterns**: Establish relationships between objects
3. **Behavioral Patterns**: Concerned with communication between objects

## Essential Creational Patterns

### Factory Method

The Factory Method pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

#### When to use:
- When you don't know in advance which class you need to instantiate
- When you want to delegate the creation logic to subclasses
- When you want to decouple object creation from its usage

#### Example (JavaScript):

```javascript
// Creator class with factory method
class FormElementCreator {
  createElement(type) {
    const element = this.createFormElement(type);
    element.render();
    return element;
  }
  
  // Factory method
  createFormElement(type) {
    throw new Error("This method must be overridden");
  }
}

// Concrete creator for HTML form elements
class HTMLFormElementCreator extends FormElementCreator {
  createFormElement(type) {
    switch(type) {
      case 'input':
        return new InputElement();
      case 'button':
        return new ButtonElement();
      case 'select':
        return new SelectElement();
      default:
        throw new Error(`Unknown element type: ${type}`);
    }
  }
}

// Product interface
class FormElement {
  render() {
    throw new Error("This method must be overridden");
  }
}

// Concrete products
class InputElement extends FormElement {
  render() {
    console.log("Rendering an input element");
  }
}

class ButtonElement extends FormElement {
  render() {
    console.log("Rendering a button element");
  }
}

class SelectElement extends FormElement {
  render() {
    console.log("Rendering a select element");
  }
}

// Client code
const creator = new HTMLFormElementCreator();
const input = creator.createElement('input');
const button = creator.createElement('button');
```

### Singleton

The Singleton pattern ensures a class has only one instance and provides a global point of access to it.

#### When to use:
- When you need exactly one instance of a class (e.g., a database connection)
- When you need strict control over global variables
- When you need to coordinate actions across the system

#### Example (JavaScript):

```javascript
class DatabaseConnection {
  constructor(host, username, password) {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.host = host;
    this.username = username;
    this.password = password;
    this.isConnected = false;
    
    DatabaseConnection.instance = this;
  }
  
  connect() {
    if (this.isConnected) {
      console.log("Already connected to database");
      return;
    }
    
    console.log(`Connecting to database at ${this.host}...`);
    this.isConnected = true;
    console.log("Connected!");
  }
  
  disconnect() {
    if (!this.isConnected) {
      console.log("Not connected to database");
      return;
    }
    
    console.log("Disconnecting from database...");
    this.isConnected = false;
    console.log("Disconnected!");
  }
}

// Usage
const db1 = new DatabaseConnection('localhost', 'admin', 'password');
db1.connect();

const db2 = new DatabaseConnection('another-host', 'user', '123');
// db2 is the same instance as db1, so these values are ignored
console.log(db2.host); // Output: localhost

// Both variables reference the same object
db2.disconnect();
console.log(db1.isConnected); // Output: false
```

## Essential Structural Patterns

### Adapter

The Adapter pattern allows objects with incompatible interfaces to collaborate.

#### When to use:
- When you need to use an existing class whose interface isn't compatible with your code
- When you want to reuse existing subclasses that lack certain common functionality
- When you need to integrate with third-party libraries

#### Example (JavaScript):

```javascript
// Existing class with incompatible interface
class OldDataFormat {
  constructor(data) {
    this.data = data;
  }
  
  getFormattedData() {
    return {
      oldFormat: true,
      entries: this.data,
      timestamp: new Date().toISOString()
    };
  }
}

// Target interface
class NewDataFormat {
  constructor(data) {
    this.data = data;
  }
  
  getData() {
    return {
      version: 2,
      items: this.data,
      metadata: {
        generated: new Date().toISOString()
      }
    };
  }
}

// Adapter class
class DataFormatAdapter extends NewDataFormat {
  constructor(oldDataFormat) {
    super(oldDataFormat.getFormattedData().entries);
    this.oldDataFormat = oldDataFormat;
  }
  
  getData() {
    const oldData = this.oldDataFormat.getFormattedData();
    return {
      version: 2,
      items: oldData.entries,
      metadata: {
        generated: oldData.timestamp,
        isConverted: true
      }
    };
  }
}

// Client code
function processData(dataProvider) {
  const data = dataProvider.getData();
  console.log(`Processing ${data.items.length} items from version ${data.version}`);
}

// Using old data with adapter
const oldData = new OldDataFormat([1, 2, 3]);
const adaptedData = new DataFormatAdapter(oldData);
processData(adaptedData);

// Using new data directly
const newData = new NewDataFormat([4, 5, 6]);
processData(newData);
```

### Composite

The Composite pattern lets you compose objects into tree structures to represent part-whole hierarchies.

#### When to use:
- When you need to work with tree-structured data
- When you want clients to treat individual objects and compositions uniformly
- When you're building complex UI components (e.g., form elements)

#### Example (JavaScript):

```javascript
// Component interface
class UIComponent {
  constructor(name) {
    this.name = name;
  }
  
  render() {
    throw new Error("Method must be implemented");
  }
  
  add(component) {
    throw new Error("Method must be implemented");
  }
  
  remove(component) {
    throw new Error("Method must be implemented");
  }
  
  getChildren() {
    throw new Error("Method must be implemented");
  }
}

// Leaf class
class Button extends UIComponent {
  constructor(name, text) {
    super(name);
    this.text = text;
  }
  
  render() {
    console.log(`Button (${this.name}): ${this.text}`);
  }
  
  add() {
    console.log("Cannot add to a Button");
  }
  
  remove() {
    console.log("Cannot remove from a Button");
  }
  
  getChildren() {
    return [];
  }
}

// Composite class
class Container extends UIComponent {
  constructor(name) {
    super(name);
    this.children = [];
  }
  
  render() {
    console.log(`Container (${this.name}) with ${this.children.length} children:`);
    this.children.forEach(child => {
      child.render();
    });
  }
  
  add(component) {
    this.children.push(component);
  }
  
  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
  
  getChildren() {
    return this.children;
  }
}

// Client code
const form = new Container("loginForm");
const header = new Container("header");
const submitButton = new Button("submit", "Log In");
const cancelButton = new Button("cancel", "Cancel");

header.add(new Button("logo", "MyApp"));
form.add(header);
form.add(new Button("username", "Username"));
form.add(new Button("password", "Password"));
form.add(submitButton);
form.add(cancelButton);

// Render the entire UI hierarchy
form.render();

// Remove a component
form.remove(cancelButton);
console.log("\nAfter removing cancel button:");
form.render();
```

## Essential Behavioral Patterns

### Observer

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

#### When to use:
- When changes to one object require changing others, and you don't know how many objects need to change
- When an object should be able to notify other objects without knowing who they are
- When implementing event handling systems

#### Example (JavaScript):

```javascript
// Observable (Subject)
class DataSource {
  constructor() {
    this.observers = [];
    this._data = null;
  }
  
  addObserver(observer) {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }
  
  removeObserver(observer) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }
  
  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
  
  get data() {
    return this._data;
  }
  
  set data(value) {
    this._data = value;
    this.notifyObservers();
  }
}

// Observer interface
class Observer {
  update(subject) {
    throw new Error("Method must be implemented");
  }
}

// Concrete Observers
class ChartObserver extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }
  
  update(subject) {
    console.log(`${this.name} Chart updated with data: ${subject.data}`);
  }
}

class TableObserver extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }
  
  update(subject) {
    console.log(`${this.name} Table updated with data: ${subject.data}`);
  }
}

class LogObserver extends Observer {
  update(subject) {
    console.log(`LOG: Data changed to: ${subject.data}`);
  }
}

// Client code
const dataSource = new DataSource();

const barChart = new ChartObserver("Bar");
const pieChart = new ChartObserver("Pie");
const dataTable = new TableObserver("Sales");
const logger = new LogObserver();

dataSource.addObserver(barChart);
dataSource.addObserver(pieChart);
dataSource.addObserver(dataTable);
dataSource.addObserver(logger);

dataSource.data = "New sales data";

// Remove an observer
dataSource.removeObserver(pieChart);
console.log("\nAfter removing pie chart:");
dataSource.data = "Updated sales data";
```

### Strategy

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

#### When to use:
- When you have multiple variants of an algorithm
- When you need to hide algorithm implementation details from clients
- When you want to avoid a lot of conditionals in your code

#### Example (JavaScript):

```javascript
// Strategy interface
class SortStrategy {
  sort(data) {
    throw new Error("Method must be implemented");
  }
}

// Concrete strategies
class QuickSort extends SortStrategy {
  sort(data) {
    console.log("Sorting using QuickSort");
    // Implementation details...
    return [...data].sort((a, b) => a - b);
  }
}

class MergeSort extends SortStrategy {
  sort(data) {
    console.log("Sorting using MergeSort");
    // Implementation details...
    return [...data].sort((a, b) => a - b);
  }
}

class BubbleSort extends SortStrategy {
  sort(data) {
    console.log("Sorting using BubbleSort (slower but simpler)");
    // Implementation details...
    return [...data].sort((a, b) => a - b);
  }
}

// Context
class DataSorter {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  sortData(data) {
    return this.strategy.sort(data);
  }
}

// Client code
const numbers = [8, 5, 2, 7, 3, 1];
const sorter = new DataSorter(new QuickSort());

console.log("Original data:", numbers);
let sorted = sorter.sortData(numbers);
console.log("QuickSort result:", sorted);

// Change strategy based on dataset size
if (numbers.length < 10) {
  sorter.setStrategy(new BubbleSort());
} else {
  sorter.setStrategy(new MergeSort());
}

sorted = sorter.sortData(numbers);
console.log("New strategy result:", sorted);
```

## Applying Design Patterns to Internal Tools

When developing internal tools, design patterns can be particularly useful:

1. **Factory Method**: For creating different types of reports, dashboard widgets, or form elements
2. **Singleton**: For managing database connections, configuration settings, or logger instances
3. **Adapter**: For integrating with various data sources or legacy systems
4. **Composite**: For building complex UI components or representing organizational hierarchies
5. **Observer**: For implementing event-driven functionality or real-time data updates
6. **Strategy**: For implementing different data processing algorithms or authentication methods

## Anti-Patterns to Avoid

While learning design patterns, also be aware of anti-patterns—common solutions to problems that tend to be ineffective or counterproductive:

1. **God Object**: A class that knows or does too much
2. **Spaghetti Code**: Code with tangled, complex, and hard-to-follow control flows
3. **Copy-Paste Programming**: Duplicating code rather than properly abstracting it
4. **Premature Optimization**: Optimizing code before measuring performance issues
5. **Analysis Paralysis**: Overthinking design to the point of never implementing it
6. **Golden Hammer**: Using a familiar pattern for every problem (when you have a hammer, everything looks like a nail)

## Exercises

Complete the following exercises to practice applying design patterns:

1. Implement a Factory Method pattern for creating different types of data visualizations

<details>
<summary>💡 Hint 1</summary>

Start by defining a base `Visualization` class with common methods like `render()`, then create concrete implementations for different chart types (e.g., `BarChart`, `LineChart`, `PieChart`).
</details>

<details>
<summary>💡 Hint 2</summary>

Create a `VisualizationFactory` class with a method like `createVisualization(type, data)` that returns the appropriate visualization instance based on the type parameter.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider what configuration options each visualization might need, and how you can make them customizable while keeping a consistent interface.
</details>

2. Create a Singleton for managing application configuration

<details>
<summary>💡 Hint 1</summary>

Implement a `Config` class with a private constructor and a static method like `getInstance()` that returns the single instance of the class.
</details>

<details>
<summary>💡 Hint 2</summary>

Add methods for getting and setting configuration values, with support for different types of values (strings, numbers, booleans, etc.).
</details>

<details>
<summary>💡 Hint 3</summary>

Consider adding methods to load configuration from different sources (e.g., a JSON file, environment variables, or local storage) and to save changes.
</details>

3. Use the Adapter pattern to integrate with a third-party API

<details>
<summary>💡 Hint 1</summary>

Choose a third-party API (or mock one) with a different interface from what your application expects. Define your own interface that makes sense for your application.
</details>

<details>
<summary>💡 Hint 2</summary>

Create an adapter class that implements your interface and internally uses the third-party API to fulfill the requests.
</details>

<details>
<summary>💡 Hint 3</summary>

Focus on translating data formats and method calls between your interface and the third-party API. Consider error handling and edge cases.
</details>

4. Implement a Composite pattern for a navigation menu structure

<details>
<summary>💡 Hint 1</summary>

Define a common interface or abstract class (`MenuItem`) with methods like `render()` that both leaf items and composite items will implement.
</details>

<details>
<summary>💡 Hint 2</summary>

Create concrete classes: `SimpleMenuItem` for leaf items and `SubMenu` for composite items that can contain other menu items.
</details>

<details>
<summary>💡 Hint 3</summary>

Implement methods in `SubMenu` to add, remove, and get child items. Make sure the `render()` method renders all children recursively.
</details>

5. Create an Observer pattern for a real-time data dashboard

<details>
<summary>💡 Hint 1</summary>

Create a `DataSource` class as the subject/observable with methods to register, remove, and notify observers. Include a method to update the data that automatically notifies observers.
</details>

<details>
<summary>💡 Hint 2</summary>

Define an `Observer` interface with an `update(data)` method, then implement concrete observers like `ChartWidget`, `TableWidget`, or `MetricWidget`.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider how to handle different types of updates and optimize to avoid unnecessary refreshes. You might want observers to subscribe to specific types of data changes.
</details>

6. Apply the Strategy pattern to implement different sorting algorithms

<details>
<summary>💡 Hint 1</summary>

Define a `SortStrategy` interface with a `sort(data)` method, then implement concrete strategies like `QuickSort`, `MergeSort`, and `BubbleSort`.
</details>

<details>
<summary>💡 Hint 2</summary>

Create a context class `Sorter` that takes a strategy and delegates the sorting to it. Include a method to change the strategy at runtime.
</details>

<details>
<summary>💡 Hint 3</summary>

Implement logic to choose the most appropriate sorting strategy based on the characteristics of the data (size, initial order, etc.).

## Additional Resources

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612) - The original "Gang of Four" book
- [Refactoring.Guru](https://refactoring.guru/design-patterns) - Excellent visual explanations of patterns
- [JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/) - Free e-book by Addy Osmani
- [Source Making](https://sourcemaking.com/) - Design patterns and anti-patterns
- [Pattern-Oriented Software Architecture](https://www.amazon.com/Pattern-Oriented-Software-Architecture-System-Patterns/dp/0471958697) - More advanced patterns
