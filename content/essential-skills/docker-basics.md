# Docker Fundamentals

## Introduction

Docker is a platform that enables developers to package applications with all their dependencies into standardized units called containers. Containers are lightweight, portable, and consistent environments that run the same regardless of where they're deployed. This lesson covers the essential Docker concepts and commands you'll need as a software engineer.

## Core Concepts

### What are Containers?

Containers are isolated, lightweight runtime environments that contain everything needed to run an application:
- The application code
- Runtime dependencies
- System tools and libraries
- Environment variables

Unlike virtual machines, containers share the host system's kernel, making them more efficient and faster to start. They provide consistency across different environments, solving the "it works on my machine" problem.

### Docker Architecture

Docker uses a client-server architecture with these main components:

1. **Docker Client**: The command-line interface you interact with
2. **Docker Daemon (Server)**: The background service that manages containers
3. **Docker Images**: Read-only templates used to create containers
4. **Docker Containers**: Running instances of Docker images
5. **Docker Registry**: A repository for storing and sharing Docker images (like Docker Hub)

### Key Terminology

| Term | Description |
|------|-------------|
| **Image** | A read-only template with instructions for creating a container |
| **Container** | A runnable instance of an image |
| **Dockerfile** | A text file with instructions to build a Docker image |
| **Layer** | A modification to an image, represented by an instruction in the Dockerfile |
| **Volume** | Persistent data storage for containers |
| **Registry** | A repository for Docker images (e.g., Docker Hub) |
| **Docker Compose** | A tool for defining and running multi-container applications |

## Working with Docker

### Docker Workflow

The basic Docker workflow consists of these steps:

1. Write a **Dockerfile** defining your application environment
2. **Build** an image from the Dockerfile
3. **Run** a container from the image
4. **Share** the image via a registry (optional)

### Essential Docker Commands

Here are some of the most important Docker commands you'll use:

| Command | Description |
|---------|-------------|
| `docker build` | Build an image from a Dockerfile |
| `docker run` | Create and start a container |
| `docker pull` | Download an image from a registry |
| `docker push` | Upload an image to a registry |
| `docker ps` | List running containers |
| `docker images` | List available images |
| `docker stop` | Stop a running container |
| `docker rm` | Remove a container |
| `docker rmi` | Remove an image |
| `docker exec` | Run a command in a running container |
| `docker logs` | View logs from a container |
| `docker-compose up` | Start services defined in docker-compose.yml |
| `docker-compose down` | Stop services defined in docker-compose.yml |

## Creating a Dockerfile

A Dockerfile is a text file with instructions for building a Docker image. Here's an example Dockerfile for a simple Node.js application:

```dockerfile
# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
```

### Key Dockerfile Instructions

| Instruction | Description |
|-------------|-------------|
| `FROM` | Specifies the base image |
| `WORKDIR` | Sets the working directory for subsequent instructions |
| `COPY` | Copies files from host to container filesystem |
| `ADD` | Similar to COPY but with additional features (like URL support) |
| `RUN` | Executes commands during the build process |
| `ENV` | Sets environment variables |
| `EXPOSE` | Documents which ports the container listens on |
| `CMD` | Provides default command to run when container starts |
| `ENTRYPOINT` | Configures container to run as an executable |
| `VOLUME` | Creates a mount point for external volumes |

## Docker Compose

Docker Compose allows you to define and run multi-container Docker applications. You use a YAML file (`docker-compose.yml`) to configure your application's services, networks, and volumes.

Here's an example `docker-compose.yml` for a web application with a database:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/myapp
    volumes:
      - ./:/app
      - /app/node_modules

  db:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Best Practices

### Docker Image Best Practices

1. **Use specific image versions** instead of `latest` to ensure consistency
2. **Order instructions from least to most frequently changing** to optimize caching
3. **Use multi-stage builds** to create smaller production images
4. **Minimize the number of layers** by combining related commands
5. **Remove unnecessary dependencies** to reduce image size
6. **Use .dockerignore** to exclude files not needed in the build
7. **Don't run processes as root** - use the `USER` instruction to specify a non-root user

### Example .dockerignore file

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
```

### Security Best Practices

1. **Scan images for vulnerabilities** using tools like Docker Scan or Trivy
2. **Use trusted base images** from official repositories
3. **Don't store secrets in images** - use environment variables or secret management tools
4. **Keep base images updated** with security patches
5. **Minimize the attack surface** by using minimal base images like Alpine
6. **Implement the principle of least privilege** by running containers with restricted capabilities

## Docker for Internal Tools

As a developer working on internal tools, Docker can help you:

1. **Maintain development/production parity** by ensuring all environments are identical
2. **Simplify onboarding** by providing a consistent setup for new team members
3. **Isolate dependencies** between different projects
4. **Streamline testing** with disposable test environments
5. **Improve deployment processes** with portable application packages

## Exercises

Complete the following exercises to practice your Docker skills:

1. Write a Dockerfile for a simple application

<details>
<summary>💡 Hint 1</summary>

Start with an appropriate base image (e.g., `node:14-alpine` for a Node.js app or `python:3.9-slim` for a Python app).
</details>

<details>
<summary>💡 Hint 2</summary>

Remember the basic Dockerfile structure:
- Start with a `FROM` instruction to set the base image
- Use `WORKDIR` to set your working directory
- Copy only what's needed (`COPY` package files first, then rest of code)
- Run necessary setup commands with `RUN`
- Expose necessary ports with `EXPOSE`
- Define how to start the app with `CMD`
</details>

<details>
<summary>📝 Example Solution</summary>

For a simple Node.js application:
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```
</details>

2. Build and run a Docker container

<details>
<summary>💡 Hint 1</summary>

Use `docker build -t myapp:1.0 .` to build an image, where `myapp:1.0` is the name and tag, and `.` is the build context (current directory).
</details>

<details>
<summary>💡 Hint 2</summary>

Use `docker run -p 3000:3000 myapp:1.0` to run the container, mapping port 3000 from the container to port 3000 on your host.
</details>

<details>
<summary>💡 Hint 3</summary>

Add `-d` flag to run in detached mode (background): `docker run -d -p 3000:3000 myapp:1.0`
</details>

3. Create a multi-container application with Docker Compose

<details>
<summary>💡 Hint 1</summary>

Create a `docker-compose.yml` file in your project root. Define a service for each component of your application (e.g., web app and database).
</details>

<details>
<summary>💡 Hint 2</summary>

Use `docker-compose up` to start all services, and `docker-compose down` to stop them.
</details>

<details>
<summary>📝 Example Solution Structure</summary>

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/mydb
  
  db:
    image: postgres:13-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
</details>

4. Optimize a Docker image for size and security

<details>
<summary>💡 Hint 1</summary>

Use smaller base images like Alpine variants (e.g., `node:14-alpine` instead of `node:14`).
</details>

<details>
<summary>💡 Hint 2</summary>

Implement multi-stage builds to separate build-time dependencies from runtime dependencies.
</details>

<details>
<summary>💡 Hint 3</summary>

Clean up unnecessary files in the same `RUN` instruction to avoid creating extra layers:
```dockerfile
RUN npm install && \
    npm cache clean --force && \
    rm -rf /tmp/*
```
</details>

<details>
<summary>⚠️ Security Tips</summary>

- Avoid running containers as root; use `USER` instruction to specify a non-root user
- Don't hardcode secrets in your Dockerfile or image
- Scan your image for vulnerabilities with `docker scan myimage:tag`
- Keep base images updated to get security patches
</details>

5. Implement a development workflow using Docker volumes

<details>
<summary>💡 Hint 1</summary>

Use bind mounts to map your local code directory into the container, allowing changes to be reflected immediately:
```bash
docker run -v $(pwd):/app -p 3000:3000 myapp:dev
```
</details>

<details>
<summary>💡 Hint 2</summary>

For Docker Compose, define volumes in your `docker-compose.yml`:
```yaml
services:
  web:
    # ... other configuration
    volumes:
      - ./:/app
      - /app/node_modules  # Optional: prevent overwriting node_modules
```
</details>

<details>
<summary>📝 Development Workflow Steps</summary>

1. Create a Dockerfile optimized for development (including dev tools)
2. Set up volumes to reflect code changes in real-time
3. Configure your application for hot-reloading if possible
4. Use Docker Compose to manage the development environment
5. Add configuration for debugging tools if needed
</details>

## Additional Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Docker Curriculum](https://docker-curriculum.com/)
- [Play with Docker](https://labs.play-with-docker.com/) - Interactive Docker playground
- [Docker Cheat Sheet](https://www.docker.com/sites/default/files/d8/2019-09/docker-cheat-sheet.pdf)
- [12 Factor App Methodology](https://12factor.net/) - Best practices for containerized applications
