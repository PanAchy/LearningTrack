# CI/CD Pipelines

## Introduction

Continuous Integration and Continuous Deployment (CI/CD) has revolutionized how software is delivered, enabling teams to release high-quality code frequently and reliably. For internal tools development, CI/CD practices ensure that your applications are always up-to-date with minimal manual intervention. This lesson introduces the fundamentals of CI/CD pipelines and how to implement them for your internal tools.

## What is CI/CD?

### Continuous Integration (CI)

Continuous Integration is the practice of automatically integrating code changes into a shared repository multiple times per day. Each integration triggers automated builds and tests to detect problems early.

**Key Elements of CI:**
- Regular code commits to a shared repository
- Automated build process
- Automated testing
- Immediate feedback on integration issues

### Continuous Delivery (CD)

Continuous Delivery extends CI by automatically preparing code changes for release to production. With CD, your software is always in a releasable state, though the actual deployment may be manual.

**Key Elements of CD:**
- Automated builds that pass all tests are ready for deployment
- Deployment preparation is automated
- One-click deployments to various environments

### Continuous Deployment

Continuous Deployment goes one step further than Continuous Delivery by automatically deploying every change that passes all tests to production without human intervention.

**Key Differences:**
- **Continuous Delivery**: Automated up to production (requires manual approval to deploy)
- **Continuous Deployment**: Fully automated including production deployment (no manual approval)

## Benefits of CI/CD for Internal Tools

### Faster Delivery

- Reduced time between feature request and delivery
- Quicker bug fixes and updates
- More responsive to changing business needs

### Higher Quality

- Early detection of integration issues
- Consistent testing before deployment
- Reduced regression bugs

### Reduced Risk

- Smaller, incremental changes are easier to troubleshoot
- Automated rollbacks when issues occur
- Consistent deployment process reduces human error

### Developer Productivity

- Less time spent on manual integration and deployment
- Immediate feedback on code quality
- Focus on building features instead of operational tasks

### Better Collaboration

- Visibility into build and deployment status
- Shared responsibility for code quality
- Easier onboarding for new team members

## Core Components of a CI/CD Pipeline

### Source Control

The foundation of any CI/CD pipeline is a version control system that manages your codebase.

**Popular Options:**
- Git (GitHub, GitLab, Bitbucket)
- Azure DevOps
- Subversion (less common for new projects)

### Build Automation

Automated processes that compile code, bundle assets, and create deployable artifacts.

**Common Build Tools:**
- For .NET: MSBuild, .NET CLI
- For JavaScript: npm, yarn, webpack
- For Java: Maven, Gradle
- For Go: Go build
- General purpose: Make, Rake

### Automated Testing

Various levels of testing to ensure code quality and functionality.

**Testing Types:**
- **Unit Tests**: Testing individual components in isolation
- **Integration Tests**: Testing interaction between components
- **End-to-End Tests**: Testing complete application flows
- **Performance Tests**: Testing system performance under load
- **Security Tests**: Testing for security vulnerabilities

### Deployment Automation

Scripts and tools that deploy your application to different environments.

**Deployment Targets:**
- Development
- Testing/QA
- Staging
- Production

### Infrastructure as Code (IaC)

Managing infrastructure through code rather than manual processes.

**Popular IaC Tools:**
- Terraform
- AWS CloudFormation
- Azure Resource Manager
- Google Cloud Deployment Manager
- Pulumi

### Monitoring and Feedback

Tools that track the health and performance of your application and pipeline.

**Monitoring Aspects:**
- Application performance
- Error rates
- Build and deployment success/failure
- Test coverage

## Popular CI/CD Tools

### CI/CD Platforms

#### GitHub Actions

GitHub's built-in CI/CD solution that directly integrates with GitHub repositories.

**Key Features:**
- Directly integrated into GitHub
- Workflow definitions in YAML
- Large marketplace of pre-built actions
- Free tier for public repositories
- Matrix builds for testing across multiple environments

**Example GitHub Actions Workflow:**

```yaml
name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test
```

#### GitLab CI/CD

A complete CI/CD solution integrated with GitLab.

**Key Features:**
- Built into GitLab platform
- YAML-based pipeline configuration
- Auto DevOps for automatic pipeline configuration
- Container registry integration
- Built-in secrets management

**Example GitLab CI/CD Pipeline:**

```yaml
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - echo "Building the application..."
    - npm install
    - npm run build

test-job:
  stage: test
  script:
    - echo "Running tests..."
    - npm test

deploy-job:
  stage: deploy
  script:
    - echo "Deploying to staging server..."
    - ./deploy.sh staging
  only:
    - main
```

#### Jenkins

A highly customizable, self-hosted automation server.

**Key Features:**
- Self-hosted with complete control
- Extensive plugin ecosystem
- Support for multiple languages and platforms
- Detailed configuration options
- Pipeline as code with Jenkinsfile

**Example Jenkinsfile:**

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                sh './deploy.sh'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
```

#### Azure DevOps

Microsoft's complete DevOps solution.

**Key Features:**
- Integrated with Azure cloud services
- YAML or visual pipeline builder
- Comprehensive artifact management
- Detailed release management
- Test plans and test management

**Example Azure Pipeline YAML:**

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '16.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'

- script: npm test
  displayName: 'Run tests'

- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: 'dist'
    artifactName: 'drop'
  displayName: 'Publish artifacts'
```

#### CircleCI

A cloud-based CI/CD service.

**Key Features:**
- Fast setup and integration with GitHub/Bitbucket
- YAML-based configuration
- Caching for faster builds
- Resource customization
- Parallel test execution

**Example CircleCI Configuration:**

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:16.13
    steps:
      - checkout
      - restore_cache:
          keys:
            - node-deps-v1-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run:
          name: Install dependencies
          command: npm ci
      - save_cache:
          key: node-deps-v1-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - ~/.npm
      - run:
          name: Run tests
          command: npm test
```

### Container Orchestration Tools

#### Docker

A platform for developing, shipping, and running applications in containers.

**Key Features:**
- Consistent environments across development and production
- Isolated applications and dependencies
- Efficient resource usage
- Dockerfile for defining container images

**Example Dockerfile:**

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Kubernetes

An open-source container orchestration system for automating deployment, scaling, and management of containerized applications.

**Key Features:**
- Automated rollouts and rollbacks
- Service discovery and load balancing
- Self-healing capabilities
- Horizontal scaling
- Secret and configuration management

**Example Kubernetes Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
      - name: node-app
        image: my-node-app:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
```

## Building Your First CI/CD Pipeline

### Define Your Pipeline Goals

Before setting up a pipeline, clarify what you want to achieve:

1. **Automated testing**: Run tests automatically on every commit
2. **Quality checks**: Enforce code style and best practices
3. **Deployment automation**: Automatically deploy to development, staging, or production
4. **Environment consistency**: Ensure all environments have the same setup
5. **Feedback loops**: Get quick feedback on code quality and test results

### Choose Your Stack

Select tools based on:

1. **Existing infrastructure**: What systems do you already use?
2. **Team expertise**: What is your team familiar with?
3. **Integration requirements**: What other systems do you need to interact with?
4. **Complexity needs**: Do you need advanced features or simple workflows?

### Starter Pipeline: GitHub Actions + Azure Static Web Apps

Let's create a basic CI/CD pipeline for an internal tool using GitHub Actions and Azure Static Web Apps.

**Step 1: Create a GitHub Repository**

Create a new repository for your project and push your code.

**Step 2: Set Up GitHub Actions Workflow**

Create a `.github/workflows/main.yml` file:

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          app_location: '/'
          api_location: 'api'
          output_location: 'dist'

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: 'close'
```

**Step 3: Create an Azure Static Web App**

1. Go to the Azure Portal
2. Create a new Static Web App resource
3. Connect to your GitHub repository
4. Add the deployment token to your GitHub repository secrets

**Step 4: Configure Your Application**

Ensure your application has:
- A proper build script in `package.json`
- Test scripts that exit with appropriate codes
- Static output in the correct directory (`dist` in our example)

Now, every time you push to the main branch:
1. GitHub Actions will automatically run your tests
2. If tests pass, it will build your application
3. The built application will be deployed to Azure Static Web Apps
4. You'll get a URL where your application is accessible

### Pipeline for a Full-Stack Application

For a full-stack internal tool, you might need a more complex pipeline. Here's a simplified example using GitHub Actions for a Vue.js frontend and .NET API backend:

```yaml
name: Full-Stack CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test_frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    - name: Install dependencies
      working-directory: ./frontend
      run: npm ci
    - name: Run tests
      working-directory: ./frontend
      run: npm test

  test_backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '6.0'
    - name: Restore dependencies
      working-directory: ./backend
      run: dotnet restore
    - name: Build
      working-directory: ./backend
      run: dotnet build --no-restore
    - name: Test
      working-directory: ./backend
      run: dotnet test --no-build

  deploy:
    needs: [test_frontend, test_backend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    # Build and deploy frontend
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    - name: Build frontend
      working-directory: ./frontend
      run: |
        npm ci
        npm run build
    - name: Deploy frontend to Azure
      uses: azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        app_location: 'frontend'
        output_location: 'dist'
        
    # Build and deploy backend
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '6.0'
    - name: Publish backend
      working-directory: ./backend
      run: |
        dotnet restore
        dotnet publish -c Release -o publish
    - name: Deploy backend to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'my-api-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./backend/publish
```

## CI/CD Best Practices

### Pipeline Design

1. **Keep it fast**: Optimize build and test times for quick feedback
2. **Build once, deploy many times**: Create artifacts once and promote them through environments
3. **Fail early**: Run quick tests first to provide faster feedback
4. **Parallelize when possible**: Run independent tasks simultaneously
5. **Consistent environments**: Use containers or configuration as code to ensure consistency

### Testing in CI/CD

1. **Test pyramid**: More unit tests, fewer integration and E2E tests
2. **Isolated tests**: Tests should not depend on each other
3. **Test environment management**: Create and destroy test environments automatically
4. **Realistic test data**: Use production-like data without exposing sensitive information
5. **Visual testing**: Consider visual regression tests for UI-heavy applications

### Security in CI/CD

1. **Scan dependencies**: Use tools like Snyk or Dependabot to check for vulnerabilities
2. **Static analysis**: Run static analysis tools to find security issues
3. **Secrets management**: Never store secrets in source code
4. **Least privilege**: Pipeline should have minimal required permissions
5. **Artifact signing**: Sign built artifacts to verify authenticity

### Monitoring and Observability

1. **Pipeline metrics**: Track build times, success rates, and deployment frequency
2. **Application monitoring**: Implement logging, metrics, and tracing
3. **Alerts**: Set up alerts for pipeline failures and application issues
4. **Deployment verification**: Verify deployments with synthetic tests or canary releases
5. **Post-deployment validation**: Run smoke tests after deployment

## CI/CD for Internal Tools - Special Considerations

### User Feedback Loops

1. **Automated demos**: Generate demo environments for stakeholders
2. **Feature flags**: Deploy features but keep them disabled until ready
3. **Beta programs**: Allow early access to new features
4. **Feedback collection**: Build in mechanisms to collect user feedback

### Database Changes

1. **Migration scripts**: Automate database schema changes
2. **Backward compatibility**: Ensure database changes don't break existing code
3. **Database versioning**: Keep database schema under version control
4. **Rollback planning**: Have a plan for rolling back database changes

### Integration with Internal Systems

1. **Authentication systems**: Integrate with company SSO or directory services
2. **API dependencies**: Handle dependencies on other internal services
3. **Network considerations**: Account for internal network configurations
4. **Data sensitivity**: Be careful with production data in test environments

### Compliance and Governance

1. **Audit trails**: Maintain records of who deployed what and when
2. **Approval workflows**: Implement approval processes for sensitive changes
3. **Policy enforcement**: Automatically check for compliance with internal policies
4. **Documentation**: Generate up-to-date documentation as part of the pipeline

## Typical Pipeline Stages for Internal Tools

### 1. Source Control

- Commit code to repository
- Branch management strategy (e.g., GitFlow, trunk-based development)
- Pull request process

### 2. Build and Compile

- Restore dependencies
- Compile code
- Create deployable artifacts
- Version tagging

### 3. Test

- Unit tests
- Integration tests
- UI tests
- Security scans
- Code quality checks

### 4. Package

- Create Docker containers
- Bundle artifacts
- Prepare deployment packages

### 5. Deploy to Dev/Test

- Automatic deployment to development environment
- Database migrations
- Configuration management

### 6. Quality Assurance

- Manual testing
- User acceptance testing
- Performance testing

### 7. Deploy to Production

- Approval process
- Production deployment
- Rollback capability
- Blue/green or canary deployment

### 8. Monitoring

- Health checks
- Performance monitoring
- Usage analytics
- Error tracking

## Measuring CI/CD Success

### Key Metrics

1. **Deployment Frequency**: How often do you deploy to production?
2. **Lead Time for Changes**: How long does it take from commit to production?
3. **Change Failure Rate**: What percentage of deployments cause issues?
4. **Mean Time to Recovery**: How long does it take to recover from failures?
5. **Build Time**: How long do builds take to complete?
6. **Test Coverage**: What percentage of your code is covered by tests?
7. **Defect Escape Rate**: How many bugs make it to production?

### DORA Metrics

The DevOps Research and Assessment (DORA) group identifies four key metrics for high-performing teams:

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deployment Frequency | Multiple per day | Between once per day and once per week | Between once per week and once per month | Between once per month and once every six months |
| Lead Time for Changes | Less than one hour | Between one day and one week | Between one week and one month | Between one month and six months |
| Change Failure Rate | 0-15% | 16-30% | 31-45% | 46-60% |
| Mean Time to Recovery | Less than one hour | Less than one day | Less than one week | More than one week |

## Exercises

Complete the following exercises to practice implementing CI/CD pipelines:

1. **Basic GitHub Actions Pipeline**: Create a GitHub repository with a simple application and set up a GitHub Actions workflow that builds and tests the application on every push.

2. **Environment Deployment**: Extend your pipeline to deploy to a development environment automatically and a production environment with manual approval.

3. **Database Migrations**: Add automated database migrations to your pipeline using a tool like Entity Framework Migrations or Flyway.

4. **Branch Protection and Testing**: Configure branch protection rules that require passing CI checks before merging pull requests.

5. **Docker Build and Push**: Add steps to your pipeline to build a Docker image and push it to a container registry.

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Jenkins User Documentation](https://www.jenkins.io/doc/)
- [CircleCI Documentation](https://circleci.com/docs/)
- [Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation](https://www.amazon.com/Continuous-Delivery-Deployment-Automation-Addison-Wesley/dp/0321601912) by Jez Humble and David Farley
- [The DevOps Handbook](https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002) by Gene Kim, Jez Humble, Patrick Debois, and John Willis
- [Accelerate: The Science of Lean Software and DevOps](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339) by Nicole Forsgren, Jez Humble, and Gene Kim
