# Testing Fundamentals

## Introduction

Software testing is a critical discipline that ensures your code works as expected and continues to work as your application evolves. As you transition from a "vibe coder" to a professional software engineer, developing strong testing skills will dramatically improve the quality and maintainability of your code. This lesson covers the fundamental concepts and practices of software testing that you'll use throughout your engineering career.

## Why Testing Matters

For internal tools and professional software in general, testing provides these key benefits:

1. **Catch bugs early** when they're less expensive to fix
2. **Enable refactoring** with confidence that you haven't broken anything
3. **Document expected behavior** through test cases that demonstrate how code should work
4. **Improve design** by forcing you to think about interfaces and dependencies
5. **Facilitate collaboration** by clearly defining expected behavior
6. **Build confidence** in your codebase as it grows in complexity

## Testing Fundamentals

### Types of Tests

Software tests typically fall into several categories:

| Test Type | Description | Example Tools |
|-----------|-------------|---------------|
| **Unit Tests** | Test individual functions, methods, or components in isolation | Jest, Mocha, JUnit, NUnit |
| **Integration Tests** | Test how multiple components work together | Jest, Cypress, TestNG |
| **End-to-End Tests** | Test complete workflows from a user's perspective | Cypress, Selenium, Playwright |
| **Performance Tests** | Measure response times, throughput, and resource usage | JMeter, k6, Lighthouse |
| **Security Tests** | Identify vulnerabilities and security issues | OWASP ZAP, SonarQube |
| **Accessibility Tests** | Verify applications work for users with disabilities | axe, Lighthouse |

### The Testing Pyramid

The testing pyramid represents the ideal distribution of test types:

```
    /\
   /  \        E2E Tests
  /    \       (Fewer, slower, more comprehensive)
 /      \
/________\     Integration Tests
                (Medium number, medium speed)
/          \
/____________\   Unit Tests
                 (Many, fast, focused)
```

- **Unit tests** should be the foundation - numerous, fast, and focused
- **Integration tests** form the middle layer - testing component interactions
- **End-to-End tests** form the top - fewer in number but covering critical user workflows

This approach provides the best balance between testing thoroughness, execution speed, and maintenance effort.

## Unit Testing

Unit testing involves testing individual units of code in isolation. A "unit" is typically a function, method, or small class.

### Key Principles of Unit Testing

1. **Tests should be independent** - No test should depend on another test
2. **Tests should be repeatable** - Same inputs should produce same results
3. **Tests should be simple** - Avoid complicated logic in test code
4. **Tests should be fast** - Unit tests should run in milliseconds
5. **Tests should verify one thing** - Each test should have a single assertion or a closely related group of assertions

### Anatomy of a Unit Test

Most unit tests follow the AAA pattern:

1. **Arrange**: Set up the test data and conditions
2. **Act**: Call the function or method being tested
3. **Assert**: Verify the result matches the expected outcome

### Example: JavaScript Unit Test with Jest

```javascript
// Function to test
function calculateTotal(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  return {
    subtotal,
    tax,
    total: subtotal + tax
  };
}

// Test suite
describe('calculateTotal function', () => {
  // Individual test case
  test('calculates subtotal, tax, and total correctly', () => {
    // Arrange
    const items = [
      { name: 'Item 1', price: 10 },
      { name: 'Item 2', price: 15 },
      { name: 'Item 3', price: 5 }
    ];
    const taxRate = 0.1; // 10% tax
    
    // Act
    const result = calculateTotal(items, taxRate);
    
    // Assert
    expect(result.subtotal).toBe(30);
    expect(result.tax).toBe(3);
    expect(result.total).toBe(33);
  });
  
  test('handles empty array of items', () => {
    // Arrange
    const items = [];
    const taxRate = 0.1;
    
    // Act
    const result = calculateTotal(items, taxRate);
    
    // Assert
    expect(result.subtotal).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
  });
  
  test('throws error for negative tax rate', () => {
    // Arrange
    const items = [{ name: 'Item 1', price: 10 }];
    const taxRate = -0.1;
    
    // Act & Assert
    expect(() => {
      calculateTotal(items, taxRate);
    }).toThrow('Tax rate cannot be negative');
  });
});
```

### Test-Driven Development (TDD)

Test-Driven Development is a practice where you write tests before writing the implementation code. The TDD cycle has three phases:

1. **Red**: Write a failing test
2. **Green**: Write the minimal implementation to make the test pass
3. **Refactor**: Improve the code while keeping the tests passing

Benefits of TDD:
- Ensures code is testable by design
- Forces you to think about requirements and interfaces first
- Provides fast feedback and confidence in changes
- Results in high test coverage

## Integration Testing

Integration testing verifies that different components work together correctly. These tests focus on the interactions between components rather than their internal details.

### Example: Testing API Integration

```javascript
// Using Jest and Supertest for HTTP API testing
const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('User API', () => {
  // Setup and teardown
  beforeAll(async () => {
    await db.connect();
  });
  
  afterAll(async () => {
    await db.disconnect();
  });
  
  beforeEach(async () => {
    await db.reset(); // Reset database before each test
  });
  
  test('GET /api/users returns all users', async () => {
    // Arrange - Seed test data
    await db.users.create({ name: 'Alice', email: 'alice@example.com' });
    await db.users.create({ name: 'Bob', email: 'bob@example.com' });
    
    // Act
    const response = await request(app)
      .get('/api/users')
      .set('Accept', 'application/json');
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('name', 'Alice');
    expect(response.body[1]).toHaveProperty('name', 'Bob');
  });
  
  test('POST /api/users creates a new user', async () => {
    // Arrange
    const newUser = { name: 'Charlie', email: 'charlie@example.com' };
    
    // Act
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');
    
    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Charlie');
    
    // Verify user was actually created in the database
    const createdUser = await db.users.findById(response.body.id);
    expect(createdUser).toHaveProperty('name', 'Charlie');
  });
});
```

## End-to-End Testing

End-to-End (E2E) tests simulate real user interactions with your application, testing the entire system from front to back. These tests help verify that all components work together correctly from a user's perspective.

### Example: E2E Test with Cypress

```javascript
// Cypress E2E test for a login flow
describe('Login Flow', () => {
  beforeEach(() => {
    // Setup: visit the login page before each test
    cy.visit('/login');
  });
  
  it('should login with valid credentials', () => {
    // Enter login credentials
    cy.get('#email').type('user@example.com');
    cy.get('#password').type('validPassword123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Assert user is redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Assert user's name appears in the header
    cy.get('.user-info').should('contain', 'John Doe');
  });
  
  it('should show error with invalid credentials', () => {
    // Enter invalid credentials
    cy.get('#email').type('user@example.com');
    cy.get('#password').type('wrongPassword');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Assert error message is shown
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Invalid email or password');
    
    // Assert URL is still login page
    cy.url().should('include', '/login');
  });
});
```

## Testing Best Practices

### 1. Make Tests Independent

Tests should not depend on each other or on the order of execution. Each test should set up its own test data and clean up afterward.

```javascript
// Bad - Tests depend on each other
test('creates a user', () => {
  // Test creates a user that next test depends on
});

test('updates a user', () => {
  // Test assumes the user from previous test exists
});

// Good - Tests are independent
test('creates a user', () => {
  // Test creates and verifies a user
});

test('updates a user', () => {
  // Test creates its own user, then updates and verifies it
});
```

### 2. Use Descriptive Test Names

Test names should clearly describe what's being tested and the expected behavior.

```javascript
// Bad
test('test user function', () => {
  // Not clear what's being tested
});

// Good
test('getFullName returns first and last name concatenated with a space', () => {
  // Clear what's being tested and what the expected behavior is
});
```

### 3. Don't Test Implementation Details

Test the behavior of your code, not its implementation details. This allows you to refactor without breaking tests.

```javascript
// Bad - Tests implementation details
test('calculateTotal calls products.reduce', () => {
  // Testing that a specific method is used is too coupled to implementation
  const spy = jest.spyOn(Array.prototype, 'reduce');
  calculateTotal(products);
  expect(spy).toHaveBeenCalled();
});

// Good - Tests behavior
test('calculateTotal returns the sum of all product prices', () => {
  const products = [{ price: 10 }, { price: 20 }];
  const result = calculateTotal(products);
  expect(result).toBe(30);
});
```

### 4. Use Test Doubles When Appropriate

Test doubles (mocks, stubs, spies) help isolate the code being tested from its dependencies.

```javascript
// Example of using a mock for a database dependency
test('getUser returns user data from database', async () => {
  // Mock the database call
  const mockDb = {
    query: jest.fn().mockResolvedValue([
      { id: 1, name: 'Test User', email: 'test@example.com' }
    ])
  };
  
  // Inject the mock
  const userService = new UserService(mockDb);
  
  // Act
  const user = await userService.getUser(1);
  
  // Assert
  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
  expect(user).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
});
```

### 5. Aim for High Coverage, But Focus on Quality

Code coverage metrics help identify untested code, but don't fixate on reaching 100% coverage. Focus on testing critical paths and edge cases.

- **Critical paths**: Main workflows that users will follow
- **Edge cases**: Boundary conditions and error scenarios
- **Complex logic**: Areas with complex business rules or algorithms

### 6. Write Tests for Bugs

When you find a bug, write a test that reproduces it before fixing it. This ensures the bug doesn't return in the future.

```javascript
// Test for a fixed bug
test('parser handles strings with escaped quotes correctly', () => {
  // This used to throw an exception
  const input = 'Text with \\"escaped quotes\\"';
  const result = parser.parse(input);
  expect(result).toEqual({ content: 'Text with "escaped quotes"' });
});
```

## Testing in Different Languages

### JavaScript/TypeScript

Popular testing frameworks:
- **Jest**: Full-featured testing framework with built-in mocking and assertion libraries
- **Mocha**: Flexible test framework often paired with Chai for assertions
- **Cypress**: End-to-end testing framework with a browser-based UI
- **Playwright**: End-to-end testing framework from Microsoft

### C#

Popular testing frameworks:
- **NUnit**: General-purpose unit testing framework
- **xUnit.net**: Modern testing framework for .NET
- **MSTest**: Microsoft's test framework integrated with Visual Studio
- **SpecFlow**: BDD-style testing for .NET

### Go

Popular testing frameworks:
- **Built-in testing package**: Go's standard library includes testing functionality
- **Testify**: Extensions to Go's testing package with additional assertions
- **GoMock**: Mocking framework for Go
- **Ginkgo**: BDD-style testing framework

## Testing Internal Tools

When developing internal tools, consider these testing strategies:

1. **Focus on critical business logic**: Ensure the most important business rules are thoroughly tested
2. **Test data transformations**: Internal tools often transform data, so test these transformations rigorously
3. **Mock external systems**: Use test doubles for databases, APIs, and other external systems
4. **End-to-end test critical workflows**: Ensure the most important user journeys work correctly
5. **Include authorization tests**: Verify that access controls work correctly
6. **Test with realistic data volumes**: Ensure the tool performs well with production-sized datasets

## Creating a Testing Strategy

As you build internal tools, develop a testing strategy that includes:

1. **What to test**: Identify the most critical parts of your application
2. **How to test**: Determine which types of tests to use for different components
3. **When to test**: Decide when tests should be run (e.g., on every commit, before deployment)
4. **Who tests**: Define roles and responsibilities for testing
5. **Test environment**: Set up appropriate environments for different types of tests

## Exercises

Complete the following exercises to practice your testing skills:

1. Write unit tests for a function that calculates statistics (mean, median, mode) for an array of numbers

<details>
<summary>💡 Hint 1</summary>

Start by identifying the test cases you need to cover: normal array of numbers, empty array, array with a single number, array with duplicate values, and array with negative numbers.
</details>

<details>
<summary>💡 Hint 2</summary>

Use the AAA pattern (Arrange-Act-Assert) for each test. For example, to test the mean function: arrange the input array, act by calling the mean function, and assert that the result matches the expected value.
</details>

<details>
<summary>💡 Hint 3</summary>

Don't forget to test edge cases. For example, what should happen if the input is null or not an array? What if the array contains non-numeric values?
</details>

2. Create integration tests for a simple API endpoint

<details>
<summary>💡 Hint 1</summary>

Choose a simple API endpoint to test, such as GET /users or POST /items. Use a testing library like Supertest (for Node.js) or RestAssured (for Java) to make HTTP requests to your API.
</details>

<details>
<summary>💡 Hint 2</summary>

Set up and tear down test data before and after your tests. For example, you might need to create test users in the database before testing a user-related endpoint, and clean up afterward.
</details>

<details>
<summary>💡 Hint 3</summary>

Test both happy paths (successful requests) and error paths (invalid inputs, unauthorized access, etc.). Verify not just the response status code but also the response body structure and content.
</details>

3. Implement a test suite using the Test-Driven Development approach

<details>
<summary>💡 Hint 1</summary>

Choose a simple function to implement using TDD, such as a password validator that checks for minimum length, uppercase letters, numbers, etc.
</details>

<details>
<summary>💡 Hint 2</summary>

Follow the Red-Green-Refactor cycle: write a failing test first, then implement just enough code to make it pass, then refactor if needed. Start with the simplest test case and gradually add more complex ones.
</details>

<details>
<summary>💡 Hint 3</summary>

Focus on one requirement at a time. For example, first test and implement the minimum length check, then add a test for uppercase letters, implement that feature, and so on.
</details>

4. Write tests that use mocks to isolate code from its dependencies

<details>
<summary>💡 Hint 1</summary>

Identify a function that has external dependencies, such as a service that calls a database or an API. Create a mock for each dependency using a mocking library like Jest's mock functions or Mockito.
</details>

<details>
<summary>💡 Hint 2</summary>

Configure your mocks to return predefined values that allow you to test different scenarios. For example, mock a database call to return specific data or throw an error.
</details>

<details>
<summary>💡 Hint 3</summary>

Verify that your function interacts correctly with its dependencies by checking that the mock functions were called with the expected arguments.
</details>

5. Develop an end-to-end test for a critical user workflow in a web application

<details>
<summary>💡 Hint 1</summary>

Identify a critical user workflow to test, such as user registration, login, or checkout. Use an E2E testing framework like Cypress, Selenium, or Playwright to automate browser interactions.
</details>

<details>
<summary>💡 Hint 2</summary>

Break down the workflow into steps, with each step involving user interactions like clicking buttons, filling forms, or navigating between pages. Use assertions to verify that each step works as expected.
</details>

<details>
<summary>💡 Hint 3</summary>

Make your E2E tests resilient by using reliable selectors (like data attributes rather than CSS classes), waiting for elements to appear, and handling asynchronous operations properly.

## Additional Resources

- [Testing JavaScript](https://testingjavascript.com/) - Comprehensive course by Kent C. Dodds
- [Martin Fowler on Test Doubles](https://martinfowler.com/bliki/TestDouble.html) - Explanation of different test double types
- [The Art of Unit Testing](https://www.amazon.com/Art-Unit-Testing-examples/dp/1617290890) - Book by Roy Osherove
- [Test-Driven Development By Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Book by Kent Beck
- [Microsoft's Testing Best Practices](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices) - Guidelines for .NET testing
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) - Detailed explanation of different test types
