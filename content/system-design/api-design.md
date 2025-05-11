# API Design

## Introduction

Application Programming Interfaces (APIs) are the connective tissue of modern software systems. They define how different components, services, and applications communicate with each other. Well-designed APIs enhance developer productivity, improve system maintainability, and enable flexible integrations. This lesson covers essential principles and best practices for designing robust, user-friendly, and scalable APIs, with a focus on RESTful and GraphQL architectures commonly used in internal tools development.

## API Design Fundamentals

### What is an API?

An API (Application Programming Interface) is a set of rules and specifications that define how software components should interact. APIs serve as contracts between different software systems, specifying:

- **Operations**: What actions can be performed
- **Inputs**: What data is required for each operation
- **Outputs**: What data is returned from each operation
- **Protocols**: How the communication should occur

### Types of APIs

#### Based on Architecture

1. **REST (Representational State Transfer)**
   - Resource-oriented architecture
   - Uses standard HTTP methods
   - Stateless communication
   - Widely used for web APIs

2. **GraphQL**
   - Query language for APIs
   - Single endpoint with flexible queries
   - Client-specified responses
   - Developed by Facebook

3. **gRPC**
   - High-performance RPC framework
   - Uses Protocol Buffers
   - Supports streaming
   - Ideal for microservice communications

4. **SOAP (Simple Object Access Protocol)**
   - Protocol-based architecture
   - XML-based messaging
   - Formal contract (WSDL)
   - Often used in enterprise systems

5. **WebHooks**
   - Event-driven architecture
   - HTTP callbacks for event notifications
   - Push-based approach

#### Based on Scope

1. **Public APIs**
   - Available for external developers
   - Well-documented and stable
   - Often monetized or product-expanding

2. **Partner APIs**
   - Limited to specific business partners
   - Customized for particular integrations
   - More controlled access and governance

3. **Internal APIs**
   - Used within an organization
   - Connect internal systems and services
   - Often tailored to specific organizational needs

### Key Design Principles

1. **Consistency**
   - Follow consistent patterns and conventions
   - Predictable behavior across endpoints
   - Unified error handling and status codes

2. **Simplicity**
   - Easy to understand and use
   - Focused functionality
   - Minimal complexity in interactions

3. **Flexibility**
   - Adaptable to different use cases
   - Extensible for future requirements
   - Versioned to support evolution

4. **Security**
   - Proper authentication and authorization
   - Data protection and privacy
   - Protection against common vulnerabilities

5. **Performance**
   - Efficient data transfer
   - Optimized response times
   - Appropriate caching strategies

## RESTful API Design

REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD (Create, Read, Update, Delete) operations on resources.

### Core Concepts

#### Resources

In REST, everything is a resource, which is any entity or object that can be accessed or manipulated:

- A resource can be a singleton (e.g., a specific user) or a collection (e.g., all users)
- Resources are identified by URLs (Uniform Resource Locators)
- Resources should be nouns, not verbs (e.g., `/users` not `/getUsers`)

#### HTTP Methods

REST uses standard HTTP methods to perform operations on resources:

| Method | Purpose | Properties |
|--------|---------|------------|
| GET | Retrieve a resource | Safe, Idempotent, Cacheable |
| POST | Create a new resource | Not Idempotent |
| PUT | Replace a resource entirely | Idempotent |
| PATCH | Partially update a resource | Not always Idempotent |
| DELETE | Remove a resource | Idempotent |

*Note: Idempotent means multiple identical requests have the same effect as a single request.*

#### Status Codes

HTTP status codes indicate the result of operations:

| Range | Category | Examples |
|-------|----------|----------|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Server Error | 500 Internal Server Error, 503 Service Unavailable |

### URL Design

#### Resource Hierarchy

Structure URLs to reflect resource relationships:

```
/companies                    # Collection of companies
/companies/{companyId}        # Specific company
/companies/{companyId}/employees  # Employees of a specific company
/companies/{companyId}/employees/{employeeId}  # Specific employee of a company
```

#### Query Parameters

Use query parameters for:

- **Filtering**: `/users?department=engineering`
- **Sorting**: `/users?sort=lastName`
- **Pagination**: `/users?page=2&size=10`
- **Field selection**: `/users?fields=id,name,email`
- **Search**: `/users?search=john`

#### Best Practices

1. **Use plural nouns for collections**: `/users` instead of `/user`
2. **Use kebab-case for multi-word resources**: `/user-profiles` instead of `/userProfiles`
3. **Keep URLs simple and intuitive**: Avoid deep nesting (max 2-3 levels)
4. **Be consistent with naming conventions**: Don't mix naming styles

### Request and Response Formats

#### Content Negotiation

Use HTTP headers to specify the format of data:

```
Accept: application/json
Content-Type: application/json
```

#### JSON Structure

JSON (JavaScript Object Notation) is the most common format for REST APIs:

```json
// Response for GET /companies/123
{
  "id": "123",
  "name": "Acme Corporation",
  "industry": "Technology",
  "founded": 2005,
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105"
  },
  "links": {
    "self": "/companies/123",
    "employees": "/companies/123/employees"
  }
}
```

#### Error Responses

Standardize error responses:

```json
{
  "status": 400,
  "code": "INVALID_INPUT",
  "message": "The request contains invalid parameters",
  "details": [
    {
      "field": "email",
      "error": "Must be a valid email address"
    }
  ]
}
```

### Common REST Patterns

#### CRUD Operations

Basic CRUD operations in REST:

| Operation | HTTP Method | URL | Description |
|-----------|-------------|-----|-------------|
| Create | POST | /resources | Create a new resource |
| Read | GET | /resources/{id} | Get a specific resource |
| Read All | GET | /resources | Get all resources (usually paginated) |
| Update | PUT/PATCH | /resources/{id} | Update a specific resource |
| Delete | DELETE | /resources/{id} | Delete a specific resource |

#### Filtering and Searching

```
# Filtering by attribute
GET /products?category=electronics

# Multiple filters
GET /products?category=electronics&brand=samsung

# Range filtering
GET /products?price_min=100&price_max=500

# Search
GET /products?q=wireless+headphones
```

#### Pagination

Two common approaches:

1. **Offset-Based**:
   ```
   GET /products?offset=20&limit=10
   ```

2. **Cursor-Based**:
   ```
   GET /products?after=product123&limit=10
   ```

Response should include pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 243,
    "pages": 25,
    "current": 2,
    "per_page": 10,
    "next": "/products?page=3&limit=10",
    "prev": "/products?page=1&limit=10"
  }
}
```

#### Sorting

```
# Sort by a single field
GET /users?sort=lastName

# Sort in descending order
GET /users?sort=-lastName

# Sort by multiple fields
GET /users?sort=department,-lastName
```

#### Field Selection

Allow clients to request only the fields they need:

```
GET /users?fields=id,firstName,lastName,email
```

### Versioning Strategies

#### URL Path Versioning

```
/api/v1/users
/api/v2/users
```

**Pros**:
- Simple and explicit
- Easy to understand and document
- Allows for major changes between versions

**Cons**:
- Breaks resource URI uniqueness
- Can lead to code duplication
- More complex client code to handle different URLs

#### Query Parameter Versioning

```
/api/users?version=1
/api/users?version=2
```

**Pros**:
- Maintains URI consistency
- Easier to default to the latest version
- Simpler server routing

**Cons**:
- Less visible in documentation
- More error-prone with default behavior
- Not as clean for resource modeling

#### Header Versioning

```
Accept: application/vnd.company.v1+json
Accept: application/vnd.company.v2+json
```

**Pros**:
- Cleanest URI design
- Follows HTTP content negotiation principles
- Decouples versioning from resource identification

**Cons**:
- Less discoverable
- Harder to test in a browser
- Requires more sophisticated API gateway or handling

### Hypermedia APIs (HATEOAS)

HATEOAS (Hypermedia as the Engine of Application State) makes APIs self-descriptive by including related links in responses:

```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "links": [
    {
      "rel": "self",
      "href": "/users/123",
      "method": "GET"
    },
    {
      "rel": "update",
      "href": "/users/123",
      "method": "PUT"
    },
    {
      "rel": "delete",
      "href": "/users/123",
      "method": "DELETE"
    },
    {
      "rel": "projects",
      "href": "/users/123/projects",
      "method": "GET"
    }
  ]
}
```

Benefits:
- Clients can navigate the API without prior knowledge
- Allows the server to evolve independently
- Improves discoverability

## GraphQL API Design

GraphQL is a query language for APIs and a runtime for executing those queries. It provides a more flexible and efficient alternative to REST, allowing clients to request exactly the data they need.

### Core Concepts

#### Schema Definition

GraphQL uses a schema to define the types and operations available:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  department: Department
  projects: [Project!]
}

type Department {
  id: ID!
  name: String!
  employees: [User!]!
}

type Project {
  id: ID!
  title: String!
  description: String
  status: ProjectStatus!
  members: [User!]!
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  COMPLETED
  ON_HOLD
}

type Query {
  user(id: ID!): User
  users(department: ID): [User!]!
  project(id: ID!): Project
  projects(status: ProjectStatus): [Project!]!
}

type Mutation {
  createUser(name: String!, email: String!, departmentId: ID!): User!
  updateUser(id: ID!, name: String, email: String, departmentId: ID): User!
  deleteUser(id: ID!): Boolean!
  
  createProject(title: String!, description: String, memberIds: [ID!]!): Project!
}
```

#### Queries

Clients can request exactly the fields they need:

```graphql
# Get user information with related data
query {
  user(id: "123") {
    id
    name
    email
    department {
      name
    }
    projects {
      title
      status
    }
  }
}
```

#### Mutations

Mutations are used to modify data:

```graphql
# Create a new user
mutation {
  createUser(
    name: "Jane Smith",
    email: "jane.smith@example.com",
    departmentId: "456"
  ) {
    id
    name
    email
  }
}
```

#### Subscriptions

Subscriptions enable real-time updates:

```graphql
# Subscribe to project status changes
subscription {
  projectStatusChanged(projectId: "789") {
    id
    title
    status
    updatedAt
  }
}
```

### GraphQL vs REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Endpoints** | Multiple endpoints | Single endpoint |
| **Data Fetching** | Fixed response structure | Client-specified data |
| **Versioning** | Explicit versioning required | Evolve schema with deprecation |
| **Over-fetching** | Common (returns all fields) | Eliminated (client specifies fields) |
| **Under-fetching** | Common (may need multiple requests) | Eliminated (gets all related data in one request) |
| **Caching** | Built into HTTP | Requires custom implementation |
| **Error Handling** | HTTP status codes | Always returns 200 with errors in the response |
| **File Uploads** | Simple | More complex, requires special handling |

### Best Practices

1. **Use descriptive type and field names**: Clear, consistent naming
2. **Design with the client in mind**: Model your schema around how the data will be used
3. **Implement pagination**: Use connections pattern for large collections
4. **Add descriptions**: Document your schema with comments
5. **Use fragments for reusable components**: Share query parts across different operations
6. **Implement proper error handling**: Return meaningful error messages
7. **Consider query complexity**: Limit recursion and query depth to prevent abuse

### Sample GraphQL Implementation

#### Server-Side (Node.js with Apollo Server)

```javascript
const { ApolloServer, gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');

// Schema definition
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    department: Department
    projects: [Project!]
  }

  type Department {
    id: ID!
    name: String!
    employees: [User!]!
  }

  type Project {
    id: ID!
    title: String!
    description: String
    status: ProjectStatus!
    members: [User!]!
  }

  enum ProjectStatus {
    PLANNING
    IN_PROGRESS
    COMPLETED
    ON_HOLD
  }

  type Query {
    user(id: ID!): User
    users(department: ID): [User!]!
    project(id: ID!): Project
    projects(status: ProjectStatus): [Project!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, departmentId: ID!): User!
    updateUser(id: ID!, name: String, email: String, departmentId: ID): User!
    deleteUser(id: ID!): Boolean!
    
    createProject(title: String!, description: String, memberIds: [ID!]!): Project!
  }
`;

// Mock database
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', departmentId: '1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', departmentId: '2' }
];

const departments = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Marketing' }
];

const projects = [
  { 
    id: '1', 
    title: 'Website Redesign', 
    description: 'Modernize the company website', 
    status: 'IN_PROGRESS',
    memberIds: ['1', '2']
  }
];

// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }) => users.find(user => user.id === id),
    users: (_, { department }) => {
      if (department) {
        return users.filter(user => user.departmentId === department);
      }
      return users;
    },
    project: (_, { id }) => projects.find(project => project.id === id),
    projects: (_, { status }) => {
      if (status) {
        return projects.filter(project => project.status === status);
      }
      return projects;
    }
  },
  Mutation: {
    createUser: (_, { name, email, departmentId }) => {
      const newUser = {
        id: uuidv4(),
        name,
        email,
        departmentId
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, email, departmentId }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        departmentId: departmentId || users[userIndex].departmentId
      };
      
      users[userIndex] = updatedUser;
      return updatedUser;
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) return false;
      
      users.splice(userIndex, 1);
      return true;
    },
    createProject: (_, { title, description, memberIds }) => {
      const newProject = {
        id: uuidv4(),
        title,
        description,
        status: 'PLANNING',
        memberIds
      };
      projects.push(newProject);
      return newProject;
    }
  },
  User: {
    department: (user) => departments.find(dept => dept.id === user.departmentId),
    projects: (user) => projects.filter(project => project.memberIds.includes(user.id))
  },
  Department: {
    employees: (department) => users.filter(user => user.departmentId === department.id)
  },
  Project: {
    members: (project) => users.filter(user => project.memberIds.includes(user.id))
  }
};

// Create and start the server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

#### Client-Side (React with Apollo Client)

```jsx
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// Initialize ApolloClient
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

// Define queries
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      department {
        name
      }
      projects {
        id
        title
        status
      }
    }
  }
`;

// User Profile Component
function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { user } = data;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Department: {user.department.name}</p>
      
      <h3>Projects</h3>
      {user.projects.length > 0 ? (
        <ul>
          {user.projects.map(project => (
            <li key={project.id}>
              {project.title} - {project.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects assigned</p>
      )}
    </div>
  );
}

// App Component
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app">
        <h1>Company Dashboard</h1>
        <UserProfile userId="1" />
      </div>
    </ApolloProvider>
  );
}

export default App;
```

## API Security

Security is a critical aspect of API design, especially for internal tools that may handle sensitive company data.

### Authentication and Authorization

#### Authentication Methods

1. **API Keys**
   - Simple string tokens in headers or query parameters
   - Good for server-to-server communication
   - Limited security; susceptible to interception

2. **JWT (JSON Web Tokens)**
   - Self-contained tokens with encoded claims
   - Stateless authentication
   - Good for microservices architectures

3. **OAuth 2.0**
   - Industry standard for authorization
   - Supports different flows (authorization code, client credentials)
   - Ideal for third-party integrations

4. **OpenID Connect**
   - Authentication layer on top of OAuth 2.0
   - Provides user identity verification
   - Standardized user profile information

#### Authorization Patterns

1. **Role-Based Access Control (RBAC)**
   - Assigns permissions to roles, and roles to users
   - Common in enterprise systems
   - Example:
     ```
     User -> [Admin Role] -> [Create User Permission, Delete User Permission]
     ```

2. **Attribute-Based Access Control (ABAC)**
   - Evaluates multiple attributes for access decisions
   - More flexible than RBAC
   - Example:
     ```
     If (user.department == resource.department && user.role == "Manager")
     Then Allow(action=Edit)
     ```

3. **Scopes**
   - Permission tokens for specific operations
   - Common in OAuth implementations
   - Example:
     ```
     "scopes": ["users.read", "users.write", "projects.read"]
     ```

### Security Best Practices

1. **Always Use HTTPS**
   - Encrypt data in transit
   - Prevent man-in-the-middle attacks
   - Protect authentication credentials

2. **Input Validation**
   - Validate all client inputs
   - Use strong typing and schemas
   - Guard against injection attacks

3. **Rate Limiting**
   - Prevent abuse and DoS attacks
   - Implement per-user or per-IP limits
   - Add appropriate response headers:
     ```
     X-RateLimit-Limit: 100
     X-RateLimit-Remaining: 95
     X-RateLimit-Reset: 1617181200
     ```

4. **Security Headers**
   - Implement security-focused HTTP headers:
     ```
     Strict-Transport-Security: max-age=31536000; includeSubDomains
     Content-Security-Policy: default-src 'self'
     X-Content-Type-Options: nosniff
     X-Frame-Options: DENY
     ```

5. **Sensitive Data Handling**
   - Don't expose sensitive information in URLs
   - Mask sensitive data in logs
   - Apply proper data classification

6. **API Keys Management**
   - Rotate keys regularly
   - Use different keys for different environments
   - Implement key revocation procedures

## API Documentation

Good documentation is essential for API usability and adoption.

### Documentation Components

1. **Overview**
   - Introduction to the API
   - Authentication requirements
   - Base URL and environments

2. **Reference Documentation**
   - Endpoints or operations
   - Request/response formats
   - Parameters and their constraints
   - Error codes and handling

3. **Tutorials and Guides**
   - Common use cases
   - Step-by-step instructions
   - Code samples in different languages

4. **SDK and Client Libraries**
   - Official client implementations
   - Installation and setup instructions
   - Basic usage examples

### Documentation Tools

1. **OpenAPI (Swagger)**
   - Industry standard for REST API documentation
   - Machine-readable API description
   - Interactive documentation UI
   - Example:
     ```yaml
     openapi: 3.0.0
     info:
       title: User Management API
       version: 1.0.0
       description: API for managing users and departments
     paths:
       /users:
         get:
           summary: Get all users
           parameters:
             - name: department
               in: query
               schema:
                 type: string
           responses:
             200:
               description: List of users
               content:
                 application/json:
                   schema:
                     type: array
                     items:
                       $ref: '#/components/schemas/User'
     components:
       schemas:
         User:
           type: object
           properties:
             id:
               type: string
             name:
               type: string
             email:
               type: string
             departmentId:
               type: string
     ```

2. **GraphQL Schema Language**
   - Self-documenting schema
   - Tools like GraphiQL and GraphQL Playground
   - Schema introspection

3. **Postman Collections**
   - Interactive API documentation
   - Request examples and tests
   - Environment variables for different scenarios

### Documentation Best Practices

1. **Keep it up-to-date**
   - Documentation should evolve with the API
   - Version documentation alongside the API
   - Automate documentation from code when possible

2. **Include examples**
   - Provide request/response examples for each operation
   - Show common use cases and edge cases
   - Include code snippets in multiple languages

3. **Describe errors clearly**
   - Document all possible error codes
   - Explain error causes and remediation steps
   - Show example error responses

4. **Add contextual information**
   - Explain the "why" not just the "how"
   - Provide business context for operations
   - Include warnings about operations with side effects

## API Design for Internal Tools

When designing APIs for internal tools, there are specific considerations to keep in mind.

### Balancing Flexibility and Simplicity

Internal tools often need to support specific workflows, so consider:

1. **Domain-Specific Endpoints**
   - Tailor endpoints to match internal business processes
   - Optimize for the most common use cases
   - Include compound operations where appropriate

2. **Comprehensive Data Access**
   - Internal tools may need more data than public APIs
   - Consider bulk operations for admin functions
   - Support detailed filtering and complex queries

3. **Performance Optimization**
   - Optimize for the specific needs of internal users
   - Include fields that reduce roundtrips for common operations
   - Consider specialized endpoints for performance-critical operations

### Integration with Internal Systems

1. **Authentication Integration**
   - Integrate with internal identity providers (LDAP, ActiveDirectory)
   - Support single sign-on (SSO) for seamless access
   - Implement role mapping from corporate roles

2. **Event-Driven Architecture**
   - Use webhooks or message queues for integration
   - Publish events for important state changes
   - Enable real-time updates for collaborative tools

3. **Legacy System Adaptation**
   - Create adapter APIs for legacy systems
   - Handle data transformation between old and new formats
   - Implement caching layers for slow legacy systems

### Case Study: Internal Dashboard API

Let's design an API for an internal dashboard that displays KPIs, recent activities, and alerts.

#### Requirements

- Show key performance indicators from multiple systems
- Display recent user activities
- Show system alerts and notifications
- Allow filtering and customization of the dashboard
- Support different user roles and permissions

#### RESTful Approach

```
# Endpoints
GET /api/dashboard/kpis
GET /api/dashboard/activities
GET /api/dashboard/alerts
PUT /api/dashboard/preferences

# Example request
GET /api/dashboard/kpis?category=sales&period=last_30_days

# Example response
{
  "data": [
    {
      "id": "sales_revenue",
      "name": "Sales Revenue",
      "value": 1250000,
      "unit": "USD",
      "change": 5.2,
      "period": "last_30_days",
      "target": 1300000,
      "status": "normal"
    },
    {
      "id": "new_customers",
      "name": "New Customers",
      "value": 245,
      "unit": "count",
      "change": -2.4,
      "period": "last_30_days",
      "target": 300,
      "status": "warning"
    }
  ],
  "meta": {
    "period": "last_30_days",
    "updated_at": "2023-06-15T10:30:45Z"
  }
}
```

#### GraphQL Approach

```graphql
# Schema
type KPI {
  id: ID!
  name: String!
  value: Float!
  unit: String!
  change: Float
  period: String!
  target: Float
  status: KpiStatus!
}

enum KpiStatus {
  CRITICAL
  WARNING
  NORMAL
  EXCELLENT
}

type Activity {
  id: ID!
  user: User!
  action: String!
  timestamp: DateTime!
  details: JSON
}

type Alert {
  id: ID!
  title: String!
  message: String!
  severity: AlertSeverity!
  timestamp: DateTime!
  isRead: Boolean!
  category: String
}

enum AlertSeverity {
  INFO
  WARNING
  ERROR
  CRITICAL
}

type Query {
  kpis(category: String, period: String): [KPI!]!
  activities(limit: Int): [Activity!]!
  alerts(severity: AlertSeverity, isRead: Boolean): [Alert!]!
  dashboardSummary: DashboardSummary!
}

type DashboardSummary {
  kpis(category: String, period: String): [KPI!]!
  recentActivities(limit: Int): [Activity!]!
  unresolvedAlerts: [Alert!]!
}

# Example query
query {
  dashboardSummary {
    kpis(category: "sales", period: "last_30_days") {
      id
      name
      value
      change
      status
    }
    recentActivities(limit: 5) {
      user { name }
      action
      timestamp
    }
    unresolvedAlerts {
      title
      severity
      timestamp
    }
  }
}
```

## API Evolution and Maintenance

APIs need to evolve while maintaining backward compatibility.

### Versioning and Deprecation

1. **Versioning Strategy**
   - Choose a versioning approach that fits your organization
   - Document version lifecycle policies
   - Consider long-term support for critical versions

2. **Deprecation Process**
   - Communicate deprecation plans in advance
   - Add deprecation notices in documentation and responses
   - Provide migration guides and support

3. **Feature Toggles**
   - Use feature flags to control rollout
   - Test new features with limited users
   - Enable gradual transitions

### Monitoring and Analytics

1. **Usage Metrics**
   - Track endpoint popularity
   - Monitor response times and error rates
   - Analyze user behavior patterns

2. **Error Tracking**
   - Aggregate error reports
   - Set up alerts for critical issues
   - Analyze error trends and root causes

3. **Performance Monitoring**
   - Measure response times
   - Track resource utilization
   - Identify bottlenecks

### API Governance

1. **Style Guides and Standards**
   - Define and enforce API design standards
   - Create templates for common patterns
   - Implement style checking in CI/CD

2. **Review Process**
   - Establish API review procedures
   - Use checklists for common issues
   - Include stakeholders in reviews

3. **Developer Experience**
   - Gather feedback from API consumers
   - Simplify onboarding and integration
   - Provide comprehensive support resources

## Exercises

1. **REST API Design**:
   Design a RESTful API for a project management system with the following entities:
   - Projects
   - Tasks
   - Users
   - Comments
   
   Include endpoints for common operations, error responses, and authentication requirements.

2. **GraphQL Schema**:
   Create a GraphQL schema for the same project management system. Define types, queries, mutations, and relationships between entities.

3. **API Security Analysis**:
   Review an existing API (either one you've created or a public API) and identify potential security vulnerabilities. Suggest improvements.

4. **Documentation Practice**:
   Write OpenAPI documentation for a simple API endpoint, including parameters, responses, and examples.

5. **API Evolution Plan**:
   Design a strategy for evolving an existing API to include new features while maintaining backward compatibility.

## Conclusion

API design is a critical skill for modern software engineering. Well-designed APIs make systems more maintainable, extensible, and developer-friendly. By following the principles and best practices covered in this lesson, you'll be able to create APIs that effectively support your internal tools and integrate with other systems.

As you continue your journey from "vibe coder" to software engineer, your ability to design thoughtful, secure, and user-friendly APIs will become increasingly valuable.

## Additional Resources

### REST API Design
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md)
- [RESTful Web Services Cookbook](https://www.oreilly.com/library/view/restful-web-services/9780596809140/)
- [REST API Design Rulebook](https://www.oreilly.com/library/view/rest-api-design/9781449317904/)

### GraphQL
- [GraphQL Official Documentation](https://graphql.org/learn/)
- [Apollo GraphQL Tutorial](https://www.apollographql.com/docs/tutorial/introduction/)
- [GraphQL: The Complete Developer's Guide](https://www.udemy.com/course/graphql-with-react-course/)

### API Security
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OAuth 2.0 Simplified](https://www.oauth.com/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

### Documentation Tools
- [OpenAPI Initiative](https://www.openapis.org/)
- [Swagger Tools](https://swagger.io/)
- [Postman Documentation](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/)
