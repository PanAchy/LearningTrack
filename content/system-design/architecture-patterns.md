# Architecture Patterns

## Introduction

Architecture patterns are proven solutions to recurring software design problems. They provide templates for solving common challenges in software design, promoting code organization, maintainability, and scalability. Understanding these patterns is crucial for any software engineer, especially when building internal tools that need to evolve over time. This lesson introduces key architecture patterns that will help you design more robust and maintainable applications.

## Layered Architecture

### Overview

Layered architecture is one of the most common and foundational patterns. It organizes code into horizontal layers, each with a specific responsibility. This separation creates a clear boundary between different areas of concern.

### Typical Layers

1. **Presentation Layer**: User interface elements and display logic
2. **Application Layer**: Orchestrates the application's core functionality
3. **Business Logic Layer**: Contains the business rules and domain logic
4. **Data Access Layer**: Manages data persistence and retrieval

### Example Structure

```
MyApplication/
├── Presentation/
│   ├── Controllers/
│   └── Views/
├── Application/
│   ├── Services/
│   └── DTOs/
├── Domain/
│   ├── Models/
│   └── Interfaces/
└── Infrastructure/
    ├── Repositories/
    └── External/
```

### Benefits

- **Separation of concerns**: Each layer has a distinct responsibility
- **Maintainability**: Changes in one layer have minimal impact on others
- **Testability**: Components can be tested in isolation
- **Reusability**: Lower layers can be reused by different higher layers

### Drawbacks

- **Performance overhead**: Multiple layer traversals can impact performance
- **Rigid structure**: May be too formal for simple applications
- **Potential for unnecessary complexity**: Can lead to excessive abstraction

### When to Use

- Applications with complex business rules
- Systems that need clear separation of concerns
- Enterprise applications that will evolve over time
- Projects with multiple developers working on different areas

## Model-View-Controller (MVC)

### Overview

MVC separates an application into three interconnected components:

1. **Model**: Data and business logic
2. **View**: User interface and presentation
3. **Controller**: Handles user input and coordinates between Model and View

### Flow of Control

1. User interacts with the View
2. The Controller handles the input
3. The Controller updates the Model as needed
4. The Model notifies the View of changes
5. The View updates its display based on the Model

### Example Structure

```
MvcApp/
├── Models/
│   ├── User.cs
│   └── Product.cs
├── Views/
│   ├── Home/
│   └── Dashboard/
└── Controllers/
    ├── HomeController.cs
    └── DashboardController.cs
```

### Benefits

- **Separation of concerns**: UI logic separated from business logic
- **Parallel development**: Different team members can work on views, models, and controllers separately
- **Multiple views for the same model**: The same data can be represented in different ways
- **Testability**: Components can be tested independently

### Drawbacks

- **Complexity**: Can be overkill for simple applications
- **Tight coupling**: Controllers often need to know too much about views and models
- **Framework dependency**: Often tied to specific web frameworks

### When to Use

- Web applications
- User interfaces with multiple ways to view the same data
- Applications where UI and business logic need clear separation
- Projects where different specialists work on UI and business logic

## Model-View-ViewModel (MVVM)

### Overview

MVVM is a refinement of MVC that originated in WPF and is now popular in many frameworks including Vue.js. It consists of:

1. **Model**: Data and business logic
2. **View**: User interface
3. **ViewModel**: Intermediary between View and Model that handles view state and behavior

### Data Binding

A key concept in MVVM is two-way data binding, which automatically synchronizes the View and ViewModel.

### Example Structure

```
MvvmApp/
├── Models/
│   ├── User.js
│   └── Product.js
├── Views/
│   ├── UserList.vue
│   └── ProductDetails.vue
└── ViewModels/
    ├── UserListViewModel.js
    └── ProductDetailsViewModel.js
```

### Benefits

- **Two-way data binding**: Reduces boilerplate code for UI updates
- **Testability**: ViewModels can be tested without the UI
- **Separation of concerns**: Clear separation between UI and business logic
- **Designer-developer workflow**: Designers can focus on views while developers work on ViewModels

### Drawbacks

- **Learning curve**: More complex than MVC for beginners
- **Memory consumption**: Data binding can consume more memory
- **Over-engineering**: Can be excessive for simple UIs

### When to Use

- Rich client applications with complex UI logic
- Applications using frameworks that support data binding (Vue.js, Angular, WPF)
- Projects with separate designer and developer roles
- Interactive dashboards and admin panels

## Microservices Architecture

### Overview

Microservices architecture structures an application as a collection of loosely coupled, independently deployable services, each running in its own process and communicating through lightweight mechanisms.

### Key Characteristics

- **Service autonomy**: Each service can be developed, deployed, and scaled independently
- **Business domain organization**: Services are organized around business capabilities
- **Decentralized data management**: Each service typically manages its own database
- **Smart endpoints, dumb pipes**: Services contain the logic, while communication is through simple protocols

### Example Structure

```
ProductService/
├── Controllers/
├── Models/
├── Services/
└── Repositories/

OrderService/
├── Controllers/
├── Models/
├── Services/
└── Repositories/

UserService/
├── Controllers/
├── Models/
├── Services/
└── Repositories/

ApiGateway/
```

### Benefits

- **Independent deployment**: Services can be updated without affecting the entire system
- **Technology diversity**: Different services can use different technologies
- **Scalability**: Individual services can scale independently based on demand
- **Fault isolation**: Failures in one service don't directly affect others
- **Team organization**: Teams can focus on specific services

### Drawbacks

- **Distributed system complexity**: Added complexity of a distributed system
- **Operational overhead**: More moving parts to monitor and manage
- **Inter-service communication**: Requires careful API design and versioning
- **Data consistency**: Challenges in maintaining consistency across services

### When to Use

- Large, complex applications with distinct business domains
- Systems with varying scalability needs across components
- Organizations with multiple development teams
- Applications requiring high reliability through component isolation
- Systems that need to evolve rapidly

## Hexagonal Architecture (Ports and Adapters)

### Overview

Hexagonal Architecture (also known as Ports and Adapters) isolates the core business logic from external concerns like UI, databases, and external services. It defines:

- **Core Domain**: Contains business logic and rules
- **Ports**: Interfaces defining how the core interacts with the outside
- **Adapters**: Implementations of ports for specific technologies

### Structure

```
Core/
├── Domain/
│   ├── Models/
│   └── Services/
├── Ports/
│   ├── Input/
│   └── Output/
└── Application/
    └── Services/

Adapters/
├── Primary/ (Input)
│   ├── Api/
│   ├── UI/
│   └── CLI/
└── Secondary/ (Output)
    ├── Persistence/
    ├── Messaging/
    └── ExternalServices/
```

### Benefits

- **Technology independence**: Core business logic doesn't depend on external frameworks
- **Testability**: Business logic can be tested without external dependencies
- **Flexibility**: External components can be replaced without changing the core
- **Focus on domain**: Emphasizes business logic over technical concerns

### Drawbacks

- **Abstraction overhead**: More interfaces and abstractions to manage
- **Initial complexity**: More difficult to set up initially
- **Learning curve**: Concept can be challenging for developers new to the pattern

### When to Use

- Applications with complex business rules that should remain isolated
- Systems that need to support multiple UI or persistence options
- Projects expecting technology changes over time
- Applications requiring high testability of business logic

## Clean Architecture

### Overview

Clean Architecture, developed by Robert C. Martin (Uncle Bob), combines principles from Hexagonal Architecture, Onion Architecture, and others. It organizes code in concentric circles, with dependencies pointing inward:

1. **Entities**: Enterprise-wide business rules
2. **Use Cases**: Application-specific business rules
3. **Interface Adapters**: Converts data between use cases and external formats
4. **Frameworks & Drivers**: External frameworks and tools

### The Dependency Rule

The fundamental rule is that source code dependencies can only point inward. Inner circles have no knowledge of outer circles.

### Example Structure

```
CleanApp/
├── Domain/ (Entities)
│   ├── Models/
│   └── ValueObjects/
├── Application/ (Use Cases)
│   ├── Services/
│   ├── Interfaces/
│   └── DTOs/
├── Infrastructure/ (Interface Adapters & Frameworks)
│   ├── Persistence/
│   ├── ExternalServices/
│   └── Identity/
└── Presentation/ (Interface Adapters)
    ├── Api/
    ├── Web/
    └── Console/
```

### Benefits

- **Independence of frameworks**: The core doesn't depend on external libraries
- **Testability**: Business rules can be tested without UI, database, or external elements
- **Independence of UI**: The UI can change without affecting the rest of the system
- **Independence of database**: The database can be switched without affecting business rules
- **Business-focused**: Centers on business problems rather than technical concerns

### Drawbacks

- **Complexity**: More layers and abstractions to manage
- **Learning curve**: Requires understanding of SOLID principles and design patterns
- **Boilerplate code**: Can require more code for proper separation

### When to Use

- Long-lived applications that will evolve over time
- Systems with complex business rules
- Projects where framework independence is important
- Applications requiring high testability
- Enterprise applications with multiple delivery mechanisms

## Event-Driven Architecture

### Overview

Event-Driven Architecture organizes a system around the production, detection, and consumption of events. Components communicate through events rather than direct method calls.

### Key Components

- **Event Producers**: Components that generate events
- **Event Consumers**: Components that react to events
- **Event Channels**: Mechanisms for transferring events (message queues, pub/sub)
- **Event Processors**: Components that process and transform events

### Communication Patterns

1. **Publish-Subscribe**: Publishers emit events to channels, subscribers listen for events
2. **Event Sourcing**: Store state changes as a sequence of events
3. **Command Query Responsibility Segregation (CQRS)**: Separate read and write operations

### Example Structure

```
EventDrivenApp/
├── Events/
│   ├── Definitions/
│   └── Handlers/
├── Commands/
│   ├── Definitions/
│   └── Handlers/
├── Services/
│   ├── Producers/
│   └── Consumers/
└── Infrastructure/
    ├── EventBus/
    └── MessageQueue/
```

### Benefits

- **Loose coupling**: Components don't need direct knowledge of each other
- **Scalability**: Easy to add new consumers without affecting producers
- **Responsiveness**: Components can react immediately to events
- **Auditability**: Events create a natural audit trail
- **Resilience**: Failures in one component don't directly block others

### Drawbacks

- **Eventual consistency**: May not provide immediate consistency
- **Complexity in debugging**: Event flows can be harder to trace and debug
- **Ordering challenges**: Ensuring correct event order can be difficult
- **Learning curve**: Different programming model from request-response

### When to Use

- Systems with asynchronous workflows
- Applications requiring real-time updates
- Microservices architectures
- Systems with complex event flows
- Applications with auditability requirements

## Service-Oriented Architecture (SOA)

### Overview

Service-Oriented Architecture organizes application components as services that communicate via standard protocols. SOA focuses on business services as the core building blocks.

### Key Principles

- **Standardized service contracts**: Services adhere to communication agreements
- **Loose coupling**: Services minimize dependencies on each other
- **Abstraction**: Services hide their logic from the outside world
- **Reusability**: Services can be reused in different business processes
- **Autonomy**: Services control their own environment
- **Statelessness**: Services minimize retaining information specific to an activity
- **Discoverability**: Services can be discovered and understood

### Example Structure

```
EnterpriseApp/
├── ServiceRegistry/
├── BusinessServices/
│   ├── CustomerService/
│   ├── OrderService/
│   └── PaymentService/
├── IntegrationServices/
│   ├── Adapters/
│   └── Transformers/
└── Infrastructure/
    ├── ServiceBus/
    └── Monitoring/
```

### Benefits

- **Business alignment**: Services map directly to business functions
- **Reusability**: Services can be reused across the enterprise
- **Standardization**: Common interfaces and protocols
- **Flexibility**: Easier to reconfigure business processes
- **Legacy system integration**: Can wrap legacy systems as services

### Drawbacks

- **Complexity**: SOA infrastructure can be complex to implement
- **Performance overhead**: Service communication adds latency
- **Governance challenges**: Requires management of service contracts
- **Initial investment**: Higher upfront cost to establish the architecture

### When to Use

- Enterprise applications with diverse systems
- Organizations with many internal applications that need integration
- Systems requiring standardized communication
- Applications that need to integrate with legacy systems
- Business processes that cross multiple systems

## Serverless Architecture

### Overview

Serverless architecture (Function as a Service or FaaS) allows developers to build applications without managing server infrastructure. Code is organized as functions that are triggered by events and run in stateless containers.

### Key Components

- **Functions**: Small, single-purpose code units
- **Triggers**: Events that initiate function execution
- **State Management**: External services for maintaining state
- **API Gateway**: Routes HTTP requests to appropriate functions

### Example Structure

```
ServerlessApp/
├── Functions/
│   ├── Authentication/
│   ├── Products/
│   └── Orders/
├── Models/
│   ├── DTOs/
│   └── Entities/
├── Services/
│   ├── External/
│   └── Utilities/
└── Infrastructure/
    ├── Database/
    └── Config/
```

### Benefits

- **Cost efficiency**: Pay only for execution time
- **Automatic scaling**: Handles varying loads automatically
- **Reduced operational complexity**: No server management
- **Faster time to market**: Focus on code rather than infrastructure
- **Built-in high availability**: Provided by the platform

### Drawbacks

- **Cold starts**: Initial delay when functions haven't been used recently
- **Limited execution duration**: Functions typically have time limits
- **Vendor lock-in**: Often tied to specific cloud providers
- **Debugging challenges**: More difficult to debug than monolithic applications
- **Limited local development**: Testing the full environment locally can be difficult

### When to Use

- Applications with variable or unpredictable workloads
- Microservices with clear boundaries
- Event-driven processes
- APIs with separate, independently scalable operations
- Projects requiring rapid development with minimal infrastructure management

## Domain-Driven Design (DDD)

### Overview

Domain-Driven Design is not strictly an architecture pattern but a design approach that shapes architecture around the business domain. It focuses on:

1. **Ubiquitous Language**: A common language between developers and domain experts
2. **Bounded Contexts**: Clear boundaries around specific domain models
3. **Strategic Design**: Relationships between bounded contexts
4. **Tactical Design**: Patterns for implementing domain models

### Key Concepts

- **Entities**: Objects with identity that persist over time
- **Value Objects**: Immutable objects defined by their attributes
- **Aggregates**: Clusters of domain objects treated as a unit
- **Repositories**: Provide access to aggregates
- **Domain Events**: Record something significant that happened in the domain
- **Services**: Operations that don't naturally belong to an entity or value object

### Example Structure

```
DddApp/
├── Contexts/
│   ├── Sales/
│   │   ├── Domain/
│   │   │   ├── Models/
│   │   │   ├── Events/
│   │   │   └── Services/
│   │   ├── Application/
│   │   └── Infrastructure/
│   └── Shipping/
│       ├── Domain/
│       │   ├── Models/
│       │   ├── Events/
│       │   └── Services/
│       ├── Application/
│       └── Infrastructure/
├── SharedKernel/
│   ├── Models/
│   └── Interfaces/
└── Infrastructure/
    ├── Persistence/
    └── Messaging/
```

### Benefits

- **Business alignment**: Architecture reflects the business domain
- **Knowledge sharing**: Promotes understanding between technical and domain experts
- **Maintainability**: Changes align with business changes
- **Complexity management**: Bounded contexts limit complexity
- **Flexibility**: Can combine with various architecture patterns

### Drawbacks

- **Learning curve**: Requires understanding of DDD concepts
- **Overhead for simple domains**: Can be excessive for straightforward applications
- **Time investment**: Requires time to develop the ubiquitous language
- **Team expertise**: Relies on skilled domain modelers

### When to Use

- Complex domains with non-trivial business rules
- Projects with evolving requirements
- Systems where business and technical teams need to collaborate closely
- Applications where the domain is central to success
- Projects with sufficient time for proper domain modeling

## Applying Patterns to Internal Tools

When building internal tools for your company, you'll often need to adapt these patterns to your specific context. Here are some considerations:

### For Simple Internal Tools

1. **Start with Layered Architecture**: Begin with a simple separation of concerns
2. **Consider MVC/MVVM for the Frontend**: Especially for data-heavy dashboards
3. **Keep It Simple**: Don't over-architect - simple tools may not need complex patterns

### For Complex Internal Platforms

1. **Clean Architecture**: Protects business rules as the platform evolves
2. **Microservices**: Consider for large platforms with distinct functional areas
3. **Event-Driven Architecture**: Useful for workflow and process automation tools
4. **DDD**: Valuable when modeling complex internal business processes

### Integration with Existing Systems

1. **Hexagonal Architecture**: Helps isolate core functionality from external system integrations
2. **SOA/Microservices**: Can help integrate with diverse internal systems
3. **Adapters**: Create adapters for each legacy system you need to integrate with

### Balancing Flexibility and Speed

1. **Start Small**: Begin with simple patterns and evolve as needed
2. **Vertical Slices**: Implement complete features rather than complete layers
3. **Incremental Approach**: Add architectural elements as complexity demands them

## Case Study: Internal Reporting Tool Architecture

Let's consider how to architect an internal reporting tool that needs to:
- Connect to multiple data sources
- Process large datasets
- Provide interactive visualizations
- Support customizable reports
- Integrate with existing authentication

### Possible Architecture

```
Presentation Layer:
- Vue.js or Svelte frontend
- Component-based UI with reusable chart components
- State management for complex UI interactions

Application Layer:
- REST API for data retrieval
- Report definition services
- User preference services

Domain Layer:
- Report models and business rules
- Data transformation logic
- Export functionality

Infrastructure Layer:
- Data source adapters for different systems
- Authentication integration with company SSO
- Caching for performance
- Scheduled report generation

Cross-Cutting Concerns:
- Logging and monitoring
- Error handling
- User permissions
```

### Architecture Pattern Choices

1. **Clean Architecture** for overall organization
2. **MVVM** for the frontend
3. **Ports and Adapters** for data source connections
4. **CQRS** for separating report generation from data querying

## Exercises

Complete the following exercises to practice applying architecture patterns:

1. **Pattern Identification**: Review an existing internal tool at your company and identify what architecture patterns (if any) it uses.

2. **Architecture Design**: Design a simple architecture for an inventory management tool, showing how you would organize:
   - Product catalog management
   - Inventory tracking
   - Order processing
   - User management

3. **Pattern Application**: Select a pattern from this lesson and apply it to refactor a small existing application or create a simple new one.

4. **Microservices Boundaries**: For a complex internal system, identify how you would divide it into microservices by drawing service boundaries.

5. **Clean Architecture Implementation**: Implement a small feature using Clean Architecture principles, clearly separating the layers.

## Additional Resources

- [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html) by Martin Fowler
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin
- [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/) by Eric Evans
- [Microservices Patterns](https://microservices.io/patterns/index.html) by Chris Richardson
- [Building Microservices](https://samnewman.io/books/building_microservices/) by Sam Newman
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) for messaging systems
- [CQRS Journey](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10)) by Microsoft
