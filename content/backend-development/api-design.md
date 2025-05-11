# API Design

## Introduction

Application Programming Interfaces (APIs) are the building blocks that allow different software systems to communicate with each other. Well-designed APIs can significantly improve developer productivity, application performance, and system maintainability. For developers building internal tools, understanding API design principles is crucial for creating robust, scalable, and usable interfaces. This lesson covers the fundamental concepts and best practices for designing effective APIs.

## Why API Design Matters

Good API design provides several benefits:

1. **Improved Developer Experience**: Clear, consistent APIs are easier to understand and use
2. **Reduced Integration Time**: Well-documented APIs speed up integration efforts
3. **Fewer Bugs**: Intuitive APIs lead to fewer implementation errors
4. **Better Performance**: Properly designed APIs can optimize network usage and processing time
5. **Easier Maintenance**: Clean API designs are simpler to extend and maintain
6. **Enhanced Security**: Properly designed APIs implement appropriate security measures
7. **Future Compatibility**: Good design allows for evolution while maintaining backward compatibility

## REST API Design

Representational State Transfer (REST) is an architectural style for designing networked applications. RESTful APIs are the most common type of web API.

### Core REST Principles

1. **Stateless**: Each request from client to server must contain all information needed to understand and process the request
2. **Client-Server Architecture**: Separate user interface concerns from data storage concerns
3. **Cacheable**: Responses must explicitly indicate whether they are cacheable
4. **Layered System**: A client cannot tell whether it's connected directly to the end server or an intermediary
5. **Uniform Interface**: Resources are identified in requests, resources are manipulated through representations, self-descriptive messages, and hypermedia as the engine of application state (HATEOAS)

### Resource Naming

Resources are the key concept in RESTful APIs. They represent entities that can be accessed and manipulated.

```
# Good resource naming
GET /users              # Get all users
GET /users/123          # Get user with ID 123
GET /users/123/orders   # Get orders for user 123

# Poor resource naming
GET /getUsers           # Uses verb instead of noun
GET /user/byId/123      # Inconsistent and redundant
GET /123/getOrders      # Missing resource name
```

#### Best Practices for Resource Naming

1. **Use Nouns, Not Verbs**: Resources should be named with nouns, not verbs
   ```
   # Good
   GET /articles
   
   # Bad
   GET /getArticles
   ```

2. **Use Plural Resource Names**: For collection resources
   ```
   # Good
   GET /customers
   
   # Less intuitive
   GET /customer
   ```

3. **Use Nested Resources for Relationships**:
   ```
   # Parent-child relationship
   GET /departments/5/employees
   ```

4. **Use Kebab Case or Camel Case Consistently**:
   ```
   # Kebab case
   GET /invoice-items
   
   # Camel case
   GET /invoiceItems
   ```

5. **Resource Granularity**: Choose appropriate resource granularity
   ```
   # Too fine-grained
   GET /users/123/name
   GET /users/123/email
   
   # Better approach
   GET /users/123   # Returns all user data
   ```

### HTTP Methods

HTTP methods define the actions that can be performed on resources:

| Method | Purpose | Examples |
|--------|---------|----------|
| GET | Retrieve resource(s) | `GET /users`, `GET /users/123` |
| POST | Create a new resource | `POST /users` |
| PUT | Replace a resource | `PUT /users/123` |
| PATCH | Partially update a resource | `PATCH /users/123` |
| DELETE | Remove a resource | `DELETE /users/123` |
| HEAD | Same as GET but returns only headers | `HEAD /users/123` |
| OPTIONS | Get supported methods for a resource | `OPTIONS /users` |

#### Usage Examples

```
# Create a new user
POST /users
{
  "name": "John Doe",
  "email": "john@example.com"
}

# Get a user
GET /users/123

# Update a user (complete replacement)
PUT /users/123
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

# Partial update of a user
PATCH /users/123
{
  "email": "john.smith@example.com"
}

# Delete a user
DELETE /users/123
```

### Status Codes

HTTP status codes communicate the result of the API request:

| Status Code | Category | Description |
|-------------|----------|-------------|
| 2xx | Success | Request succeeded |
| 3xx | Redirection | Further action needed |
| 4xx | Client Error | Problem with the request |
| 5xx | Server Error | Problem with the server |

#### Common Status Codes

```
# Success
200 OK               # Standard response for successful requests
201 Created          # Resource created successfully
204 No Content       # Request succeeded but no content returned

# Client errors
400 Bad Request      # Malformed request
401 Unauthorized     # Authentication required
403 Forbidden        # Client lacks permissions
404 Not Found        # Resource not found
405 Method Not Allowed # HTTP method not supported
422 Unprocessable Entity # Validation errors

# Server errors
500 Internal Server Error # Server encountered an error
502 Bad Gateway     # Invalid response from upstream server
503 Service Unavailable # Server temporarily unavailable
```

#### Examples of Proper Status Code Usage

```
# Creating a resource
POST /users
Response: 201 Created

# Successful retrieval
GET /users/123
Response: 200 OK

# Successful deletion
DELETE /users/123
Response: 204 No Content

# Resource not found
GET /users/999
Response: 404 Not Found

# Validation error
POST /users
{
  "name": "",  # Invalid empty name
  "email": "not-an-email"
}
Response: 422 Unprocessable Entity
```

### Query Parameters

Query parameters allow filtering, sorting, and pagination of resources:

```
# Filtering
GET /users?role=admin

# Multiple filters
GET /products?category=electronics&price_min=100&price_max=500

# Sorting
GET /users?sort=name
GET /users?sort=name:asc
GET /users?sort=name:desc

# Pagination
GET /products?limit=25&offset=50
GET /products?page=3&per_page=25
```

#### Best Practices for Query Parameters

1. **Filter on Resource Properties**:
   ```
   GET /orders?status=pending
   ```

2. **Sort by Multiple Fields**:
   ```
   GET /users?sort=last_name:asc,first_name:asc
   ```

3. **Implement Pagination**:
   ```
   GET /articles?limit=10&offset=30
   ```

4. **Include Search Parameters**:
   ```
   GET /products?search=smartphone
   ```

5. **Field Selection**:
   ```
   GET /users?fields=id,name,email
   ```

### Request/Response Bodies

JSON is the most common format for API request and response bodies:

#### Request Body Example

```json
POST /users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "settings": {
    "notifications": true,
    "theme": "dark"
  }
}
```

#### Response Body Example

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "settings": {
    "notifications": true,
    "theme": "dark"
  },
  "createdAt": "2023-04-15T14:32:21Z",
  "updatedAt": "2023-04-15T14:32:21Z"
}
```

#### Best Practices for Request/Response Bodies

1. **Use Consistent Property Names**:
   - Be consistent with naming conventions (camelCase or snake_case)
   - Use the same property names for the same concepts across endpoints

2. **Include Appropriate Response Metadata**:
   ```json
   {
     "data": [
       { "id": 1, "name": "Item 1" },
       { "id": 2, "name": "Item 2" }
     ],
     "meta": {
       "totalCount": 50,
       "page": 1,
       "perPage": 2
     }
   }
   ```

3. **Provide Descriptive Error Responses**:
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "The request data is invalid",
       "details": [
         {
           "field": "email",
           "message": "Email address is not valid"
         },
         {
           "field": "password",
           "message": "Password must be at least 8 characters"
         }
       ]
     }
   }
   ```

4. **Return Appropriate HTTP Headers**:
   ```
   Content-Type: application/json
   Location: /users/123  # For created resources
   ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   ```

5. **Consistent Date/Time Format**: Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
   ```json
   {
     "createdAt": "2023-04-15T14:32:21Z"
   }
   ```

### Authentication and Authorization

APIs need secure authentication and authorization mechanisms:

#### Common Authentication Methods

1. **API Keys**:
   ```
   GET /resources
   X-API-Key: abcdef12345
   ```

2. **Basic Authentication**:
   ```
   GET /resources
   Authorization: Basic dXNlcjpwYXNzd29yZA==
   ```

3. **Bearer Token (JWT)**:
   ```
   GET /resources
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **OAuth 2.0**:
   - Authorization Code Flow
   - Client Credentials Flow
   - Implicit Flow
   - Resource Owner Password Flow

#### Authorization Patterns

1. **Role-Based Access Control (RBAC)**:
   ```
   # Admin can access all users
   GET /users
   
   # Regular user can only access their own data
   GET /users/me
   ```

2. **Attribute-Based Access Control (ABAC)**:
   Access based on attributes of the user, resource, and environment

3. **Scopes**:
   ```
   # Token with read-only scope
   Authorization: Bearer eyJhbG...
   
   # This request fails if the token doesn't have write scope
   POST /resources
   ```

## GraphQL API Design

GraphQL is an alternative to REST that offers more flexibility in querying data.

### Key GraphQL Concepts

1. **Schema**: Defines available types and operations
2. **Types**: Define the structure of data
3. **Queries**: Request specific data
4. **Mutations**: Modify data
5. **Resolvers**: Functions that retrieve data for each field

### Schema Definition

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]
}

type Comment {
  id: ID!
  content: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts: [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
  
  createPost(title: String!, content: String!, authorId: ID!): Post!
  updatePost(id: ID!, title: String, content: String): Post!
  deletePost(id: ID!): Boolean!
}
```

### GraphQL Query Example

```graphql
# Query a specific user with their posts and each post's comments
query {
  user(id: "123") {
    id
    name
    email
    posts {
      id
      title
      content
      comments {
        id
        content
        author {
          name
        }
      }
    }
  }
}
```

### GraphQL Mutation Example

```graphql
# Create a new user
mutation {
  createUser(name: "John Doe", email: "john@example.com") {
    id
    name
    email
  }
}
```

### GraphQL vs. REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| Data Fetching | Multiple endpoints, potential over-fetching/under-fetching | Single endpoint, client specifies exactly what data it needs |
| Operations | HTTP methods define operations | Queries for retrieval, Mutations for changes |
| Versioning | Explicit (e.g., v1, v2) | Schema evolution without explicit versioning |
| Error Handling | HTTP status codes | Always returns 200 OK with errors in response |
| Caching | HTTP caching mechanisms | Requires custom caching solution |
| File Uploads | Native support | Requires additional implementation |

## gRPC API Design

gRPC is a high-performance RPC framework developed by Google.

### Protocol Buffers (protobuf)

gRPC uses Protocol Buffers for service definitions and data serialization:

```protobuf
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (User);
  rpc UpdateUser(UpdateUserRequest) returns (User);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}

message GetUserRequest {
  int64 id = 1;
}

message ListUsersRequest {
  int32 page_size = 1;
  int32 page_token = 2;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 next_page_token = 2;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message UpdateUserRequest {
  int64 id = 1;
  string name = 2;
  string email = 3;
}

message DeleteUserRequest {
  int64 id = 1;
}

message DeleteUserResponse {
  bool success = 1;
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  google.protobuf.Timestamp created_at = 4;
  google.protobuf.Timestamp updated_at = 5;
}
```

### Key gRPC Concepts

1. **Service Definition**: Defined in .proto files using Protocol Buffers
2. **Strongly Typed**: All messages and services are strongly typed
3. **Four Types of Service Methods**:
   - Unary RPC: Client sends a single request, server sends a single response
   - Server Streaming RPC: Client sends a request, server sends a stream of responses
   - Client Streaming RPC: Client sends a stream of requests, server sends a single response
   - Bidirectional Streaming RPC: Both client and server send streams of messages

### gRPC vs. REST/GraphQL

| Aspect | gRPC | REST | GraphQL |
|--------|------|------|---------|
| Transport | HTTP/2 | HTTP | HTTP |
| Format | Protocol Buffers | JSON, XML, etc. | JSON |
| Contract | Strict (proto files) | Loose | Strict (schema) |
| Streaming | Native support | Limited | Limited |
| Browser Support | Limited | Native | Native |
| Payload Size | Small | Larger | Can be large |
| Learning Curve | Steeper | Low | Medium |

## API Documentation

Good documentation is crucial for API usability:

### OpenAPI Specification (formerly Swagger)

The OpenAPI Specification defines a standard, language-agnostic interface for RESTful APIs:

```yaml
openapi: 3.0.0
info:
  title: User Management API
  description: API for managing users in the system
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server
paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: role
          in: query
          description: Filter users by role
          schema:
            type: string
        - name: page
          in: query
          description: Page number
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          description: Number of items per page
          schema:
            type: integer
            default: 25
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  meta:
                    $ref: '#/components/schemas/Meta'
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
                role:
                  type: string
                  default: user
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
  /users/{id}:
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
    get:
      summary: Get a specific user
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
    put:
      summary: Update a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
        '422':
          description: Validation error
    delete:
      summary: Delete a user
      responses:
        '204':
          description: User deleted successfully
        '404':
          description: User not found
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
        role:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
    UserUpdate:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
        role:
          type: string
    Meta:
      type: object
      properties:
        total:
          type: integer
        page:
          type: integer
        per_page:
          type: integer
        page_count:
          type: integer
    ValidationError:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              example: VALIDATION_ERROR
            message:
              type: string
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
```

### API Documentation Tools

1. **Swagger UI**: Interactive documentation from OpenAPI specs
2. **ReDoc**: Alternative to Swagger UI with different layout
3. **Postman**: API documentation and testing
4. **API Blueprint**: Markdown-based API documentation format
5. **Docusaurus**: Documentation website generator

## API Versioning

APIs evolve over time, and proper versioning helps maintain backward compatibility:

### Common Versioning Approaches

1. **URI Path Versioning**:
   ```
   https://api.example.com/v1/users
   https://api.example.com/v2/users
   ```

2. **Query Parameter Versioning**:
   ```
   https://api.example.com/users?version=1
   https://api.example.com/users?version=2
   ```

3. **Header Versioning**:
   ```
   GET /users
   Accept: application/vnd.example.v1+json
   
   GET /users
   Accept: application/vnd.example.v2+json
   ```

4. **Content Type Versioning**:
   ```
   GET /users
   Content-Type: application/vnd.example.v1+json
   
   GET /users
   Content-Type: application/vnd.example.v2+json
   ```

### Versioning Best Practices

1. **Use Semantic Versioning**: Major.Minor.Patch
   - Major: Breaking changes
   - Minor: New features, backward compatible
   - Patch: Bug fixes, backward compatible

2. **Document Changes Between Versions**:
   ```
   ## Changes in v2
   
   - Added `status` field to User resource
   - Changed pagination mechanism from offset to cursor-based
   - Removed deprecated `phone` field
   ```

3. **Support Multiple Versions** during transition periods

4. **Deprecation Process**:
   - Announce deprecation in advance
   - Return deprecation warnings in headers
   - Set a timeline for removal
   ```
   Warning: 299 - "The 'phone' field is deprecated and will be removed in v3"
   ```

## Performance Optimization

APIs should be designed with performance in mind:

### Performance Considerations

1. **Pagination**: Limit the amount of data returned
   ```
   GET /products?limit=25&offset=50
   ```

2. **Filtering**: Allow clients to request only what they need
   ```
   GET /orders?status=completed&date_from=2023-01-01
   ```

3. **Field Selection**: Allow clients to specify which fields they want
   ```
   GET /users?fields=id,name,email
   ```

4. **Compression**: Enable gzip or other compression
   ```
   GET /users
   Accept-Encoding: gzip, deflate
   ```

5. **Caching**: Implement HTTP caching mechanisms
   ```
   # Response headers
   Cache-Control: max-age=3600
   ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   
   # Subsequent request with ETag
   GET /users
   If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   
   # Response if not modified
   HTTP/1.1 304 Not Modified
   ```

6. **Bulk Operations**: Support batch processing
   ```
   POST /users/batch
   {
     "users": [
       { "name": "User 1", "email": "user1@example.com" },
       { "name": "User 2", "email": "user2@example.com" }
     ]
   }
   ```

7. **Rate Limiting**: Prevent abuse and ensure fair usage
   ```
   # Response headers
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: 1623456789
   ```

## Security Best Practices

API security is critical for protecting sensitive data and functionality:

### Security Measures

1. **HTTPS**: Always use HTTPS for API communication

2. **Authentication**: Implement proper authentication
   - API keys
   - OAuth 2.0
   - JWT tokens

3. **Authorization**: Enforce proper access controls
   - Role-based access control
   - Attribute-based access control
   - Least privilege principle

4. **Input Validation**: Validate all input data
   - Data types
   - Length limits
   - Format validation
   - Allowed values

5. **Output Encoding**: Properly encode output to prevent injection attacks

6. **Rate Limiting**: Protect against abuse
   ```
   # Response headers for rate limiting
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   X-RateLimit-Reset: 1623456789
   
   # Rate limit exceeded response
   HTTP/1.1 429 Too Many Requests
   Retry-After: 60
   ```

7. **CORS Configuration**: Properly configure Cross-Origin Resource Sharing
   ```
   # CORS headers
   Access-Control-Allow-Origin: https://example.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

8. **API Firewalls**: Use API gateway security features

### OWASP API Security Top 10

1. **Broken Object Level Authorization**: Check that users can only access authorized data
   ```
   # Vulnerable request - no check that the user owns this resource
   GET /api/users/123/documents/456
   
   # Better approach - check permission based on authenticated user
   ```

2. **Broken User Authentication**: Implement robust authentication
   ```
   # Weak authentication - API key in URL
   GET /api/users?api_key=abcdef123456
   
   # Better approach - Authorization header with proper token
   GET /api/users
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Excessive Data Exposure**: Don't expose sensitive data
   ```
   # Exposing too much data
   GET /api/users/123
   Response: { "id": 123, "name": "John", "password_hash": "5f4dcc3b..." }
   
   # Better approach - only return necessary data
   GET /api/users/123
   Response: { "id": 123, "name": "John" }
   ```

4. **Lack of Resources & Rate Limiting**: Implement appropriate limits
   ```
   # Implement rate limiting headers
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 95
   ```

5. **Broken Function Level Authorization**: Ensure proper function-level authorization
   ```
   # Ensure users can only access permitted functions
   POST /api/users/123/permissions
   // Check if current user has admin rights
   ```

## API Design for Internal Tools

When designing APIs for internal tools, consider these specific patterns:

### 1. Domain-Driven Design

Organize your API around business domains and capabilities:

```
# E-commerce domains
/api/catalog/products
/api/orders/invoices
/api/customers/accounts
```

### 2. CRUD Operations Template

For each resource, implement consistent CRUD operations:

```
# List all resources (with filtering, pagination)
GET /resources

# Get a specific resource
GET /resources/{id}

# Create a new resource
POST /resources

# Update a resource
PUT /resources/{id}
PATCH /resources/{id}

# Delete a resource
DELETE /resources/{id}
```

### 3. Batch Operations

For improved efficiency in internal tools, support batch operations:

```
# Batch create
POST /users/batch
{
  "users": [
    { "name": "User 1", "email": "user1@example.com" },
    { "name": "User 2", "email": "user2@example.com" }
  ]
}

# Batch update
PUT /users/batch
{
  "users": [
    { "id": 1, "name": "Updated User 1" },
    { "id": 2, "name": "Updated User 2" }
  ]
}

# Batch delete
DELETE /users/batch
{
  "ids": [1, 2, 3, 4, 5]
}
```

### 4. Export Operations

Internal tools often need data export functionality:

```
# Export to various formats
GET /reports/sales/export?format=csv
GET /reports/sales/export?format=xlsx
GET /users/export?format=json

# Include selection criteria
GET /reports/sales/export?format=csv&date_from=2023-01-01&date_to=2023-12-31
```

### 5. Webhooks for Event Notifications

Allow internal services to subscribe to events:

```
# Register a webhook
POST /webhooks
{
  "url": "https://internal-service.example.com/webhook",
  "events": ["user.created", "user.updated", "user.deleted"],
  "secret": "webhook_signing_secret"
}

# Webhook payload sent to subscribers
{
  "event": "user.created",
  "timestamp": "2023-04-15T14:32:21Z",
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 6. Long-running Operations

For operations that take time to complete:

```
# Start a long-running job
POST /reports/generate
{
  "type": "annual-sales",
  "year": 2023
}

# Response with job ID
{
  "job_id": "abc123",
  "status": "processing",
  "links": {
    "self": "/jobs/abc123"
  }
}

# Check job status
GET /jobs/abc123
{
  "job_id": "abc123",
  "status": "completed",
  "result": {
    "report_url": "/reports/files/annual-sales-2023.pdf"
  }
}
```

## API Implementation Examples

### REST API in ASP.NET Core (C#)

```csharp
// UserController.cs
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
        [FromQuery] string? role,
        [FromQuery] int page = 1,
        [FromQuery] int perPage = 25)
    {
        var users = await _userService.GetUsersAsync(role, page, perPage);
        var total = await _userService.GetUserCountAsync(role);
        
        Response.Headers.Add("X-Total-Count", total.ToString());
        
        return Ok(users);
    }
    
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(user);
    }
    
    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var user = await _userService.CreateUserAsync(createUserDto);
        
        return CreatedAtRoute("GetUserById", new { id = user.Id }, user);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(int id, UpdateUserDto updateUserDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var user = await _userService.UpdateUserAsync(id, updateUserDto);
        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(user);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound();
        }
        
        return NoContent();
    }
}
```

### REST API in Go

```go
// handlers/user_handler.go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    
    "github.com/gorilla/mux"
    "myapp/models"
    "myapp/services"
)

type UserHandler struct {
    userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
    return &UserHandler{userService: userService}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
    role := r.URL.Query().Get("role")
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    if page <= 0 {
        page = 1
    }
    
    perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))
    if perPage <= 0 {
        perPage = 25
    }
    
    users, total := h.userService.GetUsers(role, page, perPage)
    
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("X-Total-Count", strconv.Itoa(total))
    
    json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    user, err := h.userService.GetUser(id)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var createUser models.CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&createUser); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    // Validate input
    if createUser.Name == "" || createUser.Email == "" {
        http.Error(w, "Name and email are required", http.StatusBadRequest)
        return
    }
    
    user, err := h.userService.CreateUser(createUser)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    var updateUser models.UpdateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&updateUser); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    user, err := h.userService.UpdateUser(id, updateUser)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id, err := strconv.Atoi(vars["id"])
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    if err := h.userService.DeleteUser(id); err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }
    
    w.WriteHeader(http.StatusNoContent)
}

// main.go
func main() {
    userService := services.NewUserService()
    userHandler := handlers.NewUserHandler(userService)
    
    r := mux.NewRouter()
    r.HandleFunc("/api/users", userHandler.GetUsers).Methods("GET")
    r.HandleFunc("/api/users/{id}", userHandler.GetUser).Methods("GET")
    r.HandleFunc("/api/users", userHandler.CreateUser).Methods("POST")
    r.HandleFunc("/api/users/{id}", userHandler.UpdateUser).Methods("PUT")
    r.HandleFunc("/api/users/{id}", userHandler.DeleteUser).Methods("DELETE")
    
    http.ListenAndServe(":8080", r)
}
```

### GraphQL API in Node.js

```javascript
// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
    createdAt: String
    updatedAt: String
  }
  
  type Query {
    users(role: String): [User!]!
    user(id: ID!): User
  }
  
  type Mutation {
    createUser(name: String!, email: String!, role: String): User!
    updateUser(id: ID!, name: String, email: String, role: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

// resolvers.js
const resolvers = {
  Query: {
    users: async (_, { role }, { dataSources }) => {
      return dataSources.userAPI.getUsers(role);
    },
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.getUser(id);
    }
  },
  Mutation: {
    createUser: async (_, { name, email, role }, { dataSources }) => {
      return dataSources.userAPI.createUser({ name, email, role });
    },
    updateUser: async (_, { id, name, email, role }, { dataSources }) => {
      return dataSources.userAPI.updateUser(id, { name, email, role });
    },
    deleteUser: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.deleteUser(id);
    }
  }
};

// userAPI.js
class UserAPI {
  constructor({ db }) {
    this.db = db;
  }
  
  async getUsers(role) {
    const query = role ? { role } : {};
    return this.db.collection('users').find(query).toArray();
  }
  
  async getUser(id) {
    return this.db.collection('users').findOne({ _id: id });
  }
  
  async createUser(userData) {
    const result = await this.db.collection('users').insertOne({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: result.insertedId,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  async updateUser(id, userData) {
    const result = await this.db.collection('users').findOneAndUpdate(
      { _id: id },
      { 
        $set: {
          ...userData,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );
    
    return result.value;
  }
  
  async deleteUser(id) {
    const result = await this.db.collection('users').deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const UserAPI = require('./userAPI');
const { MongoClient } = require('mongodb');

async function startServer() {
  const app = express();
  
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('myapp');
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      userAPI: new UserAPI({ db })
    })
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
```

## Exercises

Complete the following exercises to practice your API design skills:

1. Design a RESTful API for a task management system with users, projects, and tasks

<details>
<summary>💡 Hint 1</summary>

Identify the key resources (users, projects, tasks) and their relationships. Think about what operations should be available for each resource.
</details>

<details>
<summary>💡 Hint 2</summary>

Define appropriate endpoints with HTTP methods for CRUD operations. Consider how to handle nested resources (e.g., tasks within projects).
</details>

<details>
<summary>📝 Example Solution</summary>

```
# API Base URL: https://api.taskmanager.com/v1

# User Resources
GET    /users                # List users with pagination and filtering
POST   /users                # Create a new user
GET    /users/{id}           # Get user details
PUT    /users/{id}           # Update user
DELETE /users/{id}           # Delete user
GET    /users/{id}/projects  # Get projects for a specific user
GET    /users/{id}/tasks     # Get tasks assigned to a specific user

# Project Resources
GET    /projects             # List all projects with pagination and filtering
POST   /projects             # Create a new project
GET    /projects/{id}        # Get project details
PUT    /projects/{id}        # Update project
DELETE /projects/{id}        # Delete project
GET    /projects/{id}/tasks  # Get tasks for a specific project
POST   /projects/{id}/tasks  # Create a new task in a project

# Task Resources
GET    /tasks                # List all tasks with pagination and filtering
POST   /tasks                # Create a new task
GET    /tasks/{id}           # Get task details
PUT    /tasks/{id}           # Update task
DELETE /tasks/{id}           # Delete task
PUT    /tasks/{id}/status    # Update task status
PUT    /tasks/{id}/assign    # Assign task to a user

# Example Request/Response Bodies:

# Create User
POST /users
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer"
}

Response: (201 Created)
{
  "id": "usr_123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer",
  "created_at": "2023-05-10T14:30:00Z"
}

# Create Project
POST /projects
Request:
{
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "owner_id": "usr_123",
  "due_date": "2023-06-30T23:59:59Z"
}

Response: (201 Created)
{
  "id": "prj_456",
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "owner_id": "usr_123",
  "due_date": "2023-06-30T23:59:59Z",
  "status": "active",
  "created_at": "2023-05-10T14:35:00Z"
}

# Create Task in Project
POST /projects/prj_456/tasks
Request:
{
  "title": "Design homepage mockup",
  "description": "Create mockups for the new homepage design",
  "assignee_id": "usr_123",
  "due_date": "2023-06-15T23:59:59Z",
  "priority": "high"
}

Response: (201 Created)
{
  "id": "task_789",
  "project_id": "prj_456",
  "title": "Design homepage mockup",
  "description": "Create mockups for the new homepage design",
  "assignee_id": "usr_123",
  "due_date": "2023-06-15T23:59:59Z",
  "priority": "high",
  "status": "todo",
  "created_at": "2023-05-10T14:40:00Z"
}

# Update Task Status
PUT /tasks/task_789/status
Request:
{
  "status": "in_progress"
}

Response: (200 OK)
{
  "id": "task_789",
  "status": "in_progress",
  "updated_at": "2023-05-11T09:15:00Z"
}
```
</details>

2. Create an OpenAPI specification for a simple blog API with users, posts, and comments

<details>
<summary>💡 Hint 1</summary>

Start by defining the main components (schemas) for users, posts, and comments, thinking about their properties and relationships.
</details>

<details>
<summary>💡 Hint 2</summary>

Define paths for all necessary endpoints, including appropriate HTTP methods, request/response bodies, and status codes.
</details>

<details>
<summary>📝 Example Solution</summary>

```yaml
openapi: 3.0.0
info:
  title: Blog API
  description: API for a simple blog platform
  version: 1.0.0
servers:
  - url: https://api.blog-example.com/v1
    description: Production server
  - url: https://staging-api.blog-example.com/v1
    description: Staging server
paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
  /users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    get:
      summary: Get a specific user
      responses:
        '200':
          description: User details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
    put:
      summary: Update a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
    delete:
      summary: Delete a user
      responses:
        '204':
          description: User deleted successfully
        '404':
          description: User not found
  /posts:
    get:
      summary: Get all posts
      parameters:
        - name: author_id
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: A list of posts
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Post'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create a new post
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCreate'
      responses:
        '201':
          description: Post created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '422':
          description: Validation error
  /posts/{postId}:
    parameters:
      - name: postId
        in: path
        required: true
        schema:
          type: string
    get:
      summary: Get a specific post
      responses:
        '200':
          description: Post details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '404':
          description: Post not found
    put:
      summary: Update a post
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostUpdate'
      responses:
        '200':
          description: Post updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'
        '404':
          description: Post not found
    delete:
      summary: Delete a post
      responses:
        '204':
          description: Post deleted successfully
        '404':
          description: Post not found
  /posts/{postId}/comments:
    parameters:
      - name: postId
        in: path
        required: true
        schema:
          type: string
    get:
      summary: Get all comments for a post
      responses:
        '200':
          description: A list of comments
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Comment'
    post:
      summary: Add a comment to a post
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CommentCreate'
      responses:
        '201':
          description: Comment added successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '404':
          description: Post not found
  /comments/{commentId}:
    parameters:
      - name: commentId
        in: path
        required: true
        schema:
          type: string
    get:
      summary: Get a specific comment
      responses:
        '200':
          description: Comment details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '404':
          description: Comment not found
    put:
      summary: Update a comment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CommentUpdate'
      responses:
        '200':
          description: Comment updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '404':
          description: Comment not found
    delete:
      summary: Delete a comment
      responses:
        '204':
          description: Comment deleted successfully
        '404':
          description: Comment not found
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        username:
          type: string
        email:
          type: string
          format: email
        name:
          type: string
        bio:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
    UserCreate:
      type: object
      required:
        - username
        - email
        - password
      properties:
        username:
          type: string
          minLength: 3
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
        name:
          type: string
        bio:
          type: string
    UserUpdate:
      type: object
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
        name:
          type: string
        bio:
          type: string
    Post:
      type: object
      properties:
        id:
          type: string
        author_id:
          type: string
        title:
          type: string
        content:
          type: string
        slug:
          type: string
        status:
          type: string
          enum: [draft, published]
        published_at:
          type: string
          format: date-time
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        author:
          $ref: '#/components/schemas/User'
        comment_count:
          type: integer
    PostCreate:
      type: object
      required:
        - title
        - content
      properties:
        title:
          type: string
          minLength: 3
        content:
          type: string
        status:
          type: string
          enum: [draft, published]
          default: draft
    PostUpdate:
      type: object
      properties:
        title:
          type: string
          minLength: 3
        content:
          type: string
        status:
          type: string
          enum: [draft, published]
    Comment:
      type: object
      properties:
        id:
          type: string
        post_id:
          type: string
        author_id:
          type: string
        content:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        author:
          $ref: '#/components/schemas/User'
    CommentCreate:
      type: object
      required:
        - content
      properties:
        content:
          type: string
          minLength: 1
    CommentUpdate:
      type: object
      required:
        - content
      properties:
        content:
          type: string
          minLength: 1
    PaginationMeta:
      type: object
      properties:
        total:
          type: integer
        per_page:
          type: integer
        current_page:
          type: integer
        total_pages:
          type: integer
    ValidationError:
      type: object
      properties:
        errors:
          type: object
          additionalProperties:
            type: array
            items:
              type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
```
</details>

3. Implement a basic REST API endpoint using your preferred language and framework

<details>
<summary>💡 Hint 1</summary>

Choose a familiar language and framework (e.g., ASP.NET Core for C#, Express for Node.js, Flask for Python). Start with a single resource and implement GET and POST endpoints.
</details>

<details>
<summary>💡 Hint 2</summary>

Implement proper status codes, validation, error handling, and response formats. Consider using in-memory storage for simplicity in this exercise.
</details>

<details>
<summary>📝 Example Solution (ASP.NET Core)</summary>

```csharp
// ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // In-memory store for demo purposes
    private static readonly List<Product> _products = new List<Product>
    {
        new Product { Id = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics", InStock = true },
        new Product { Id = 2, Name = "Desk Chair", Price = 249.50m, Category = "Furniture", InStock = true },
        new Product { Id = 3, Name = "Coffee Maker", Price = 89.95m, Category = "Appliances", InStock = false }
    };

    // GET: api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts([FromQuery] string category = null)
    {
        var query = _products.AsQueryable();
        
        // Apply filtering if category provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }
        
        return Ok(query.ToList());
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public ActionResult<Product> CreateProduct(CreateProductDto productDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        // Generate new ID (in a real app, the database would handle this)
        var newId = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
        
        var product = new Product
        {
            Id = newId,
            Name = productDto.Name,
            Price = productDto.Price,
            Category = productDto.Category,
            InStock = productDto.InStock,
            CreatedAt = DateTime.UtcNow
        };
        
        _products.Add(product);
        
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public IActionResult UpdateProduct(int id, UpdateProductDto productDto)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        // Update properties
        if (productDto.Name != null) product.Name = productDto.Name;
        if (productDto.Price.HasValue) product.Price = productDto.Price.Value;
        if (productDto.Category != null) product.Category = productDto.Category;
        if (productDto.InStock.HasValue) product.InStock = productDto.InStock.Value;
        
        product.UpdatedAt = DateTime.UtcNow;
        
        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public IActionResult DeleteProduct(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} not found" });
        }
        
        _products.Remove(product);
        
        return NoContent();
    }
}

// Models
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public bool InStock { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class CreateProductDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; }
    
    [Required]
    [Range(0.01, 10000)]
    public decimal Price { get; set; }
    
    [Required]
    public string Category { get; set; }
    
    public bool InStock { get; set; } = true;
}

public class UpdateProductDto
{
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; }
    
    [Range(0.01, 10000)]
    public decimal? Price { get; set; }
    
    public string Category { get; set; }
    
    public bool? InStock { get; set; }
}
```
</details>

<details>
<summary>📝 Example Solution (Node.js with Express)</summary>

```javascript
// app.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory store for demo purposes
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Desk Chair', price: 249.50, category: 'Furniture', inStock: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Coffee Maker', price: 89.95, category: 'Appliances', inStock: false, createdAt: new Date().toISOString() }
];

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = {};
  
  if (!name || name.length < 3 || name.length > 100) {
    errors.name = 'Name must be between 3 and 100 characters';
  }
  
  if (!price || isNaN(price) || price <= 0 || price > 10000) {
    errors.price = 'Price must be a number between 0.01 and 10000';
  }
  
  if (!category) {
    errors.category = 'Category is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

// GET: /api/products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  
  let result = products;
  
  // Apply filtering if category provided
  if (category) {
    result = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  res.json(result);
});

// GET: /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  res.json(product);
});

// POST: /api/products
app.post('/api/products', validateProduct, (req, res) => {
  const { name, price, category, inStock = true } = req.body;
  
  // Generate new ID
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    id: newId,
    name,
    price: parseFloat(price),
    category,
    inStock: Boolean(inStock),
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  res.status(201).json(newProduct);
});

// PUT: /api/products/:id
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  const { name, price, category, inStock } = req.body;
  const product = products[productIndex];
  
  // Update only provided fields
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = parseFloat(price);
  if (category !== undefined) product.category = category;
  if (inStock !== undefined) product.inStock = Boolean(inStock);
  
  product.updatedAt = new Date().toISOString();
  
  res.status(204).end();
});

// DELETE: /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found` });
  }
  
  products.splice(productIndex, 1);
  
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
```
</details>

4. Design a GraphQL schema for an e-commerce system with products, categories, and orders

<details>
<summary>💡 Hint 1</summary>

Identify the main types (Product, Category, Order, etc.) and their relationships. Think about what fields each type should have.
</details>

<details>
<summary>💡 Hint 2</summary>

Define appropriate queries and mutations for typical e-commerce operations (browsing products, placing orders, etc.). Include input types for complex operations.
</details>

<details>
<summary>📝 Example Solution</summary>

```graphql
type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  salePrice: Float
  imageUrl: String
  category: Category!
  tags: [String!]
  inStock: Boolean!
  stockQuantity: Int!
  createdAt: String!
  updatedAt: String
  reviews: [Review!]
  averageRating: Float
}

type Category {
  id: ID!
  name: String!
  description: String
  imageUrl: String
  parentCategory: Category
  subCategories: [Category!]
  products: [Product!]
}

type Customer {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String
  addresses: [Address!]
  orders: [Order!]
  createdAt: String!
}

type Address {
  id: ID!
  street: String!
  city: String!
  state: String!
  zipCode: String!
  country: String!
  isDefault: Boolean!
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
  totalPrice: Float!
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELED
}

type Order {
  id: ID!
  customer: Customer!
  items: [OrderItem!]!
  subtotal: Float!
  tax: Float!
  shippingCost: Float!
  total: Float!
  status: OrderStatus!
  shippingAddress: Address!
  billingAddress: Address!
  paymentMethod: String!
  createdAt: String!
  updatedAt: String
  trackingNumber: String
}

type Review {
  id: ID!
  product: Product!
  customer: Customer!
  rating: Int!
  title: String
  comment: String
  createdAt: String!
}

type Query {
  # Product queries
  product(id: ID!): Product
  products(limit: Int, offset: Int, category: ID, search: String, minPrice: Float, maxPrice: Float, inStock: Boolean): [Product!]!
  featuredProducts(limit: Int): [Product!]!
  
  # Category queries
  category(id: ID!): Category
  categories(parentId: ID): [Category!]!
  rootCategories: [Category!]!
  
  # Customer queries
  customer(id: ID!): Customer
  customerByEmail(email: String!): Customer
  
  # Order queries
  order(id: ID!): Order
  ordersByCustomer(customerId: ID!): [Order!]!
}

input CreateProductInput {
  name: String!
  description: String
  price: Float!
  salePrice: Float
  imageUrl: String
  categoryId: ID!
  tags: [String!]
  stockQuantity: Int!
}

input UpdateProductInput {
  name: String
  description: String
  price: Float
  salePrice: Float
  imageUrl: String
  categoryId: ID
  tags: [String!]
  stockQuantity: Int
}

input CreateCategoryInput {
  name: String!
  description: String
  imageUrl: String
  parentCategoryId: ID
}

input CreateCustomerInput {
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String
}

input AddressInput {
  street: String!
  city: String!
  state: String!
  zipCode: String!
  country: String!
  isDefault: Boolean
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}

input CreateOrderInput {
  customerId: ID!
  items: [OrderItemInput!]!
  shippingAddressId: ID!
  billingAddressId: ID!
  paymentMethod: String!
}

input CreateReviewInput {
  productId: ID!
  customerId: ID!
  rating: Int!
  title: String
  comment: String
}

type Mutation {
  # Product mutations
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
  
  # Category mutations
  createCategory(input: CreateCategoryInput!): Category!
  updateCategory(id: ID!, input: CreateCategoryInput!): Category!
  deleteCategory(id: ID!): Boolean!
  
  # Customer mutations
  createCustomer(input: CreateCustomerInput!): Customer!
  addCustomerAddress(customerId: ID!, address: AddressInput!): Address!
  
  # Order mutations
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  cancelOrder(id: ID!): Order!
  
  # Review mutations
  createReview(input: CreateReviewInput!): Review!
}
```
</details>

5. Identify potential security vulnerabilities in a given API design and suggest improvements

<details>
<summary>💡 Hint 1</summary>

Think about common security issues like authentication, authorization, input validation, rate limiting, and data exposure.
</details>

<details>
<summary>💡 Hint 2</summary>

Consider the OWASP API Security Top 10 vulnerabilities and best practices for API security. Look for specific issues in authentication mechanisms, access controls, and data handling.
</details>

<details>
<summary>📝 Example Exercise Scenario and Solution</summary>

**Vulnerable API Design:**

```
# Authentication
POST /login
  Request: { "username": "user", "password": "pass" }
  Response: { "api_key": "abcdef123456" }

# User Management
GET /users?api_key=abcdef123456
GET /users/123?api_key=abcdef123456
DELETE /users/123?api_key=abcdef123456

# Order Management
GET /orders/456?api_key=abcdef123456
POST /orders
  Request: 
  {
    "api_key": "abcdef123456",
    "user_id": 123,
    "items": [...],
    "credit_card": {
      "number": "4111111111111111",
      "cvv": "123",
      "expiry": "12/25"
    }
  }

# Product Review
POST /products/789/reviews
  Request: 
  {
    "api_key": "abcdef123456",
    "rating": 5,
    "comment": "<script>alert('XSS');</script> Great product!"
  }
```

**Security Issues and Improvements:**

1. **Authentication Issues**
   - **Problem**: API key passed in URL query parameters (visible in logs, browser history)
   - **Solution**: Use Authorization header for API keys or tokens
     ```
     GET /users
     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

2. **Authorization Issues**
   - **Problem**: No apparent validation that a user can only access their own data
   - **Solution**: Implement proper authorization checks
     ```
     // Server-side pseudocode
     if (authenticatedUserId !== requestedUserId && !isAdmin(authenticatedUserId)) {
       return 403 Forbidden;
     }
     ```

3. **Sensitive Data Exposure**
   - **Problem**: Credit card details sent in request body and possibly stored
   - **Solution**: Use a payment token system and PCI-compliant processing
     ```
     POST /orders
     {
       "payment_token": "tok_visa_12345", // Token from payment processor
       "user_id": 123,
       "items": [...]
     }
     ```

4. **Input Validation & XSS**
   - **Problem**: Review comment contains JavaScript that could execute (XSS)
   - **Solution**: Sanitize and validate all input
     ```
     // Server-side validation and sanitization
     const sanitizedComment = sanitizeHtml(request.comment);
     ```

5. **Missing Rate Limiting**
   - **Problem**: No apparent rate limiting to prevent abuse
   - **Solution**: Implement rate limiting and return appropriate headers
     ```
     // Response headers
     X-RateLimit-Limit: 100
     X-RateLimit-Remaining: 95
     X-RateLimit-Reset: 1623456789
     ```

6. **Insecure Direct Object References**
   - **Problem**: Using sequential IDs that could be enumerated (/users/123)
   - **Solution**: Use UUIDs or other non-sequential identifiers
     ```
     GET /users/a1b2c3d4-e5f6-7890-abcd-ef1234567890
     ```

7. **Missing HTTPS**
   - **Problem**: No indication of HTTPS requirement
   - **Solution**: Enforce HTTPS for all API communications and implement HSTS

8. **Missing Security Headers**
   - **Problem**: No security headers specified
   - **Solution**: Add appropriate security headers
     ```
     Content-Security-Policy: default-src 'self'
     X-Content-Type-Options: nosniff
     X-Frame-Options: DENY
     ```

9. **Weak Authentication Mechanism**
   - **Problem**: Simple username/password login without MFA
   - **Solution**: Implement stronger authentication with JWT, refresh tokens, and MFA support

10. **No Logging or Monitoring**
    - **Problem**: No apparent logging of security events
    - **Solution**: Implement comprehensive logging and monitoring
      ```
      // Log security events
      logger.securityEvent({
        type: "authentication_failure",
        username: request.username,
        ip: request.ip,
        timestamp: new Date()
      });
      ```

**Improved API Design:**

```
# Authentication
POST /auth/login
  Request: { "username": "user", "password": "pass" }
  Response: { "access_token": "eyJhbGc...", "refresh_token": "abc123", "expires_in": 3600 }

# User Management
GET /users
  Headers: Authorization: Bearer eyJhbGc...

GET /users/a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Headers: Authorization: Bearer eyJhbGc...
  // Server enforces that users can only access their own data unless admin

DELETE /users/a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Headers: Authorization: Bearer eyJhbGc...
  // Server enforces that users can only delete their own account unless admin

# Order Management
GET /orders/f7e6d5c4-b3a2-1098-7654-321fedcba098
  Headers: Authorization: Bearer eyJhbGc...
  // Server validates user has access to requested order

POST /orders
  Headers: Authorization: Bearer eyJhbGc...
  Request: 
  {
    "items": [...],
    "payment": {
      "payment_method_id": "pm_visa_12345", // Token from payment processor
      "billing_address_id": "addr_12345"
    },
    "shipping_address_id": "addr_67890"
  }

# Product Review
POST /products/5f4e3d2c-1b0a-9876-5432-109876543210/reviews
  Headers: Authorization: Bearer eyJhbGc...
  Request: 
  {
    "rating": 5,
    "comment": "Great product!"
    // Server sanitizes input to prevent XSS
  }
  Response: 
  {
    "id": "rev_12345",
    "status": "pending_moderation"
    // Reviews moderated before being displayed
  }
```
</details>

## Additional Resources

- [REST API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) - Microsoft's guide
- [GraphQL Documentation](https://graphql.org/learn/) - Official GraphQL documentation
- [gRPC Documentation](https://grpc.io/docs/) - Official gRPC documentation
- [OpenAPI Specification](https://swagger.io/specification/) - The OpenAPI specification
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) - Security risks for APIs
- [API Design Patterns](https://www.manning.com/books/api-design-patterns) - Book by JJ Geewax
- [Web API Design](https://pages.apigee.com/rs/apigee/images/api-design-ebook-2012-03.pdf) - Apigee's e-book
- [API Design Guidelines](https://github.com/microsoft/api-guidelines) - Microsoft's REST API guidelines
