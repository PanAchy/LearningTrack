# Adding a Backend to Your Learning Portal

## Introduction

In this lesson, you'll learn how to enhance your Vue.js Single Page Application (SPA) by adding a robust backend API. This transformation will transform your client-side application into a full-stack solution, enabling features like user authentication, cloud-based progress tracking, and more sophisticated data management. We'll explore both C# with ASP.NET Core and Golang implementation options, aligning with the technology tracks in this curriculum.

## Why Add a Backend?

While a client-side SPA offers many benefits, certain functionality requires server-side processing:

- **User Authentication**: Securely manage user identities and access control
- **Cloud Data Storage**: Store user progress, notes, and preferences
- **Data Security**: Protect sensitive information with server-side validation
- **Advanced Features**: Support features that require server-side processing
- **Scalability**: Handle growing user bases and content more effectively
- **API Integration**: Connect with third-party services and databases

## Architecture Overview

We'll implement a modern, scalable architecture:

![Backend Architecture](../images/backend-architecture.png)

### Key Components

1. **Client Application**: Our Vue.js SPA
2. **API Layer**: RESTful endpoints for data operations
3. **Service Layer**: Business logic implementation
4. **Data Access Layer**: Database interactions
5. **Database**: Persistent storage (SQLite or PostgreSQL)
6. **Authentication**: User identity management

### Technology Options

Following our curriculum's dual tracks, we'll cover two implementation approaches:

**Primary Track**:
- **Backend**: C# with ASP.NET Core
- **Database**: SQLite (development) / SQL Server (production)
- **Authentication**: ASP.NET Core Identity

**Alternative Track**:
- **Backend**: Golang
- **Database**: PostgreSQL
- **Authentication**: JWT with custom implementation

## Designing the API

### RESTful API Design

We'll create a RESTful API following these principles:

1. **Resource-Oriented**: Endpoints represent resources, not actions
2. **HTTP Methods**: Use standard HTTP methods (GET, POST, PUT, DELETE)
3. **JSON Responses**: Return data in consistent JSON format
4. **Status Codes**: Use appropriate HTTP status codes
5. **Versioning**: Include API versioning for future compatibility

### Core API Endpoints

```
/api/v1/users
  POST    - Register a new user
  GET     - Get current user info

/api/v1/auth
  POST    /login - Authenticate user
  POST    /logout - Log out user
  POST    /refresh - Refresh auth token

/api/v1/progress
  GET     - Get user progress
  PUT     - Update user progress

/api/v1/notes
  GET     - Get user notes for a lesson
  POST    - Create a new note
  PUT     /{id} - Update a note
  DELETE  /{id} - Delete a note

/api/v1/content
  GET     /modules - Get all modules
  GET     /modules/{id} - Get a specific module
  GET     /modules/{id}/lessons/{id} - Get a specific lesson
```

### Authentication Flow

We'll implement token-based authentication:

1. User submits credentials (username/password)
2. Server validates credentials and issues JWT (JSON Web Token)
3. Client stores JWT and includes it in subsequent requests
4. Server validates JWT for protected endpoints
5. Refresh tokens handle session expiration

## Implementing the Backend (C# / ASP.NET Core)

### Project Setup

Create a new ASP.NET Core Web API project:

```bash
dotnet new webapi -n LearningPortal.Api
```

### Folder Structure

```
LearningPortal.Api/
├── Controllers/           # API endpoints
├── Models/                # Data models
│   ├── Domain/            # Domain entities
│   ├── DTOs/              # Data transfer objects
│   └── Auth/              # Authentication models
├── Services/              # Business logic
├── Repositories/          # Data access
├── Data/                  # Database context
├── Middleware/            # Custom middleware
├── Extensions/            # Helper extensions
└── Program.cs             # Application entry point
```

### Entity Models

Create core domain entities:

```csharp
// Models/Domain/User.cs
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
}

// Models/Domain/Progress.cs
public class Progress
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string ModuleId { get; set; }
    public string LessonId { get; set; }
    public bool Completed { get; set; }
    public DateTime LastUpdated { get; set; }
}

// Models/Domain/Note.cs
public class Note
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string ModuleId { get; set; }
    public string LessonId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### Database Context

Set up the Entity Framework Core DbContext:

```csharp
// Data/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Progress> Progress { get; set; }
    public DbSet<Note> Notes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entity relationships and constraints
        modelBuilder.Entity<Progress>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Note>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### Authentication Service

Implement user authentication:

```csharp
// Services/AuthService.cs
public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    string GenerateJwtToken(User user);
    RefreshToken GenerateRefreshToken();
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .SingleOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

        if (user == null)
            return null;

        if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            return null;

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Store refresh token
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            UserId = user.Id,
            Username = user.Username,
            Token = token,
            RefreshToken = refreshToken.Token
        };
    }

    // Implement other methods...

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512(passwordSalt))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != passwordHash[i])
                    return false;
            }
            return true;
        }
    }
}
```

### Progress Service

Implement progress tracking:

```csharp
// Services/ProgressService.cs
public interface IProgressService
{
    Task<UserProgressResponse> GetUserProgressAsync(Guid userId);
    Task<bool> UpdateProgressAsync(Guid userId, ProgressUpdateRequest request);
}

public class ProgressService : IProgressService
{
    private readonly ApplicationDbContext _context;

    public ProgressService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProgressResponse> GetUserProgressAsync(Guid userId)
    {
        var progress = await _context.Progress
            .Where(p => p.UserId == userId)
            .ToListAsync();

        return new UserProgressResponse
        {
            UserId = userId,
            Modules = progress.GroupBy(p => p.ModuleId)
                .Select(g => new ModuleProgressDto
                {
                    ModuleId = g.Key,
                    Lessons = g.Select(p => new LessonProgressDto
                    {
                        LessonId = p.LessonId,
                        Completed = p.Completed,
                        LastUpdated = p.LastUpdated
                    }).ToList()
                }).ToList()
        };
    }

    public async Task<bool> UpdateProgressAsync(Guid userId, ProgressUpdateRequest request)
    {
        var progress = await _context.Progress
            .FirstOrDefaultAsync(p => p.UserId == userId && 
                                  p.ModuleId == request.ModuleId && 
                                  p.LessonId == request.LessonId);

        if (progress == null)
        {
            progress = new Progress
            {
                UserId = userId,
                ModuleId = request.ModuleId,
                LessonId = request.LessonId,
                Completed = request.Completed,
                LastUpdated = DateTime.UtcNow
            };
            _context.Progress.Add(progress);
        }
        else
        {
            progress.Completed = request.Completed;
            progress.LastUpdated = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
```

### API Controllers

Create RESTful API controllers:

```csharp
// Controllers/AuthController.cs
[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        
        if (response == null)
            return BadRequest("Username or email already exists");
            
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        
        if (response == null)
            return Unauthorized("Invalid username or password");
            
        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var response = await _authService.RefreshTokenAsync(request.RefreshToken);
        
        if (response == null)
            return Unauthorized("Invalid refresh token");
            
        return Ok(response);
    }
}

// Controllers/ProgressController.cs
[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _progressService;

    public ProgressController(IProgressService progressService)
    {
        _progressService = progressService;
    }

    [HttpGet]
    public async Task<ActionResult<UserProgressResponse>> GetUserProgress()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return Unauthorized();
        
        var progress = await _progressService.GetUserProgressAsync(userGuid);
        return Ok(progress);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProgress(ProgressUpdateRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return Unauthorized();
        
        var result = await _progressService.UpdateProgressAsync(userGuid, request);
        
        if (!result)
            return BadRequest("Failed to update progress");
            
        return Ok();
    }
}
```

### Configure Dependency Injection

Set up the application services:

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"])),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<INoteService, NoteService>();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(options => options
    .WithOrigins("http://localhost:8080") // Your Vue.js app URL
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

## Implementing the Backend (Golang)

### Project Setup

Create a new Go project:

```bash
mkdir -p learning-portal-api/cmd/api
cd learning-portal-api
go mod init github.com/yourusername/learning-portal-api
```

### Folder Structure

```
learning-portal-api/
├── cmd/
│   └── api/               # Application entry point
├── internal/
│   ├── auth/              # Authentication logic
│   ├── config/            # Configuration
│   ├── handler/           # HTTP handlers
│   ├── middleware/        # Custom middleware
│   ├── model/             # Data models
│   ├── repository/        # Data access
│   └── service/           # Business logic
├── migrations/            # Database migrations
├── pkg/                   # Reusable packages
│   ├── jwt/               # JWT utilities
│   └── validator/         # Validation helpers
└── go.mod                 # Go module file
```

### Data Models

Define the core entities:

```go
// internal/model/user.go
package model

import (
    "time"

    "github.com/google/uuid"
)

type User struct {
    ID           uuid.UUID `json:"id" db:"id"`
    Username     string    `json:"username" db:"username"`
    Email        string    `json:"email" db:"email"`
    PasswordHash []byte    `json:"-" db:"password_hash"`
    CreatedAt    time.Time `json:"created_at" db:"created_at"`
    LastActive   time.Time `json:"last_active" db:"last_active"`
}

// internal/model/progress.go
package model

import (
    "time"

    "github.com/google/uuid"
)

type Progress struct {
    ID          uuid.UUID `json:"id" db:"id"`
    UserID      uuid.UUID `json:"user_id" db:"user_id"`
    ModuleID    string    `json:"module_id" db:"module_id"`
    LessonID    string    `json:"lesson_id" db:"lesson_id"`
    Completed   bool      `json:"completed" db:"completed"`
    LastUpdated time.Time `json:"last_updated" db:"last_updated"`
}

// internal/model/note.go
package model

import (
    "time"

    "github.com/google/uuid"
)

type Note struct {
    ID        uuid.UUID `json:"id" db:"id"`
    UserID    uuid.UUID `json:"user_id" db:"user_id"`
    ModuleID  string    `json:"module_id" db:"module_id"`
    LessonID  string    `json:"lesson_id" db:"lesson_id"`
    Content   string    `json:"content" db:"content"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
```

### Database Setup

Initialize the database connection:

```go
// internal/repository/db.go
package repository

import (
    "fmt"
    "log"

    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq"
    "github.com/yourusername/learning-portal-api/internal/config"
)

func NewDatabase(cfg *config.Config) (*sqlx.DB, error) {
    connectionString := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        cfg.Database.Host,
        cfg.Database.Port,
        cfg.Database.User,
        cfg.Database.Password,
        cfg.Database.Name,
    )

    db, err := sqlx.Connect("postgres", connectionString)
    if err != nil {
        log.Printf("Failed to connect to database: %v", err)
        return nil, err
    }

    return db, nil
}
```

### Authentication Service

Implement JWT-based authentication:

```go
// internal/service/auth.go
package service

import (
    "errors"
    "time"

    "github.com/google/uuid"
    "github.com/yourusername/learning-portal-api/internal/model"
    "github.com/yourusername/learning-portal-api/internal/repository"
    "github.com/yourusername/learning-portal-api/pkg/jwt"
    "golang.org/x/crypto/bcrypt"
)

type AuthService struct {
    userRepo repository.UserRepository
    jwtMaker jwt.Maker
}

func NewAuthService(userRepo repository.UserRepository, jwtMaker jwt.Maker) *AuthService {
    return &AuthService{
        userRepo: userRepo,
        jwtMaker: jwtMaker,
    }
}

type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
    Username string `json:"username" binding:"required,min=3,max=30"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

type AuthResponse struct {
    UserID       uuid.UUID `json:"user_id"`
    Username     string    `json:"username"`
    AccessToken  string    `json:"access_token"`
    RefreshToken string    `json:"refresh_token"`
}

func (s *AuthService) Login(req LoginRequest) (*AuthResponse, error) {
    user, err := s.userRepo.GetByUsername(req.Username)
    if err != nil {
        return nil, errors.New("invalid credentials")
    }

    err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(req.Password))
    if err != nil {
        return nil, errors.New("invalid credentials")
    }

    // Generate tokens
    accessToken, err := s.jwtMaker.CreateToken(user.ID.String(), 15*time.Minute)
    if err != nil {
        return nil, err
    }

    refreshToken, err := s.jwtMaker.CreateToken(user.ID.String(), 24*7*time.Hour)
    if err != nil {
        return nil, err
    }

    return &AuthResponse{
        UserID:       user.ID,
        Username:     user.Username,
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
    }, nil
}

func (s *AuthService) Register(req RegisterRequest) (*AuthResponse, error) {
    // Check if username exists
    existingUser, _ := s.userRepo.GetByUsername(req.Username)
    if existingUser != nil {
        return nil, errors.New("username already exists")
    }

    // Check if email exists
    existingUser, _ = s.userRepo.GetByEmail(req.Email)
    if existingUser != nil {
        return nil, errors.New("email already exists")
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    // Create user
    user := &model.User{
        ID:           uuid.New(),
        Username:     req.Username,
        Email:        req.Email,
        PasswordHash: hashedPassword,
        CreatedAt:    time.Now(),
        LastActive:   time.Now(),
    }

    err = s.userRepo.Create(user)
    if err != nil {
        return nil, err
    }

    // Generate tokens
    accessToken, err := s.jwtMaker.CreateToken(user.ID.String(), 15*time.Minute)
    if err != nil {
        return nil, err
    }

    refreshToken, err := s.jwtMaker.CreateToken(user.ID.String(), 24*7*time.Hour)
    if err != nil {
        return nil, err
    }

    return &AuthResponse{
        UserID:       user.ID,
        Username:     user.Username,
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
    }, nil
}
```

### HTTP Handlers

Create RESTful API handlers:

```go
// internal/handler/auth.go
package handler

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/yourusername/learning-portal-api/internal/service"
)

type AuthHandler struct {
    authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
    return &AuthHandler{
        authService: authService,
    }
}

func (h *AuthHandler) Register(c *gin.Context) {
    var req service.RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resp, err := h.authService.Register(req)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
    var req service.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resp, err := h.authService.Login(req)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    c.JSON(http.StatusOK, resp)
}

// internal/handler/progress.go
package handler

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
    "github.com/yourusername/learning-portal-api/internal/middleware"
    "github.com/yourusername/learning-portal-api/internal/service"
)

type ProgressHandler struct {
    progressService *service.ProgressService
}

func NewProgressHandler(progressService *service.ProgressService) *ProgressHandler {
    return &ProgressHandler{
        progressService: progressService,
    }
}

func (h *ProgressHandler) GetUserProgress(c *gin.Context) {
    userID, _ := c.Get(middleware.AuthUserKey)
    
    progress, err := h.progressService.GetUserProgress(userID.(uuid.UUID))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch progress"})
        return
    }

    c.JSON(http.StatusOK, progress)
}

func (h *ProgressHandler) UpdateProgress(c *gin.Context) {
    userID, _ := c.Get(middleware.AuthUserKey)
    
    var req service.ProgressUpdateRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := h.progressService.UpdateProgress(userID.(uuid.UUID), req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update progress"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Progress updated successfully"})
}
```

### Main Application

Set up the application entry point:

```go
// cmd/api/main.go
package main

import (
    "log"

    "github.com/gin-gonic/gin"
    "github.com/yourusername/learning-portal-api/internal/config"
    "github.com/yourusername/learning-portal-api/internal/handler"
    "github.com/yourusername/learning-portal-api/internal/middleware"
    "github.com/yourusername/learning-portal-api/internal/repository"
    "github.com/yourusername/learning-portal-api/internal/service"
    "github.com/yourusername/learning-portal-api/pkg/jwt"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load configuration: %v", err)
    }

    // Initialize database
    db, err := repository.NewDatabase(cfg)
    if err != nil {
        log.Fatalf("Failed to initialize database: %v", err)
    }

    // Initialize repositories
    userRepo := repository.NewUserRepository(db)
    progressRepo := repository.NewProgressRepository(db)
    noteRepo := repository.NewNoteRepository(db)

    // Initialize JWT maker
    jwtMaker, err := jwt.NewJWTMaker(cfg.JWT.Secret)
    if err != nil {
        log.Fatalf("Failed to create JWT maker: %v", err)
    }

    // Initialize services
    authService := service.NewAuthService(userRepo, jwtMaker)
    progressService := service.NewProgressService(progressRepo)
    noteService := service.NewNoteService(noteRepo)

    // Initialize handlers
    authHandler := handler.NewAuthHandler(authService)
    progressHandler := handler.NewProgressHandler(progressService)
    noteHandler := handler.NewNoteHandler(noteService)

    // Setup router
    router := gin.Default()

    // CORS middleware
    router.Use(middleware.CORS())

    // API routes
    api := router.Group("/api/v1")
    
    // Auth routes (no auth required)
    auth := api.Group("/auth")
    {
        auth.POST("/register", authHandler.Register)
        auth.POST("/login", authHandler.Login)
        auth.POST("/refresh", authHandler.RefreshToken)
    }

    // Protected routes
    protected := api.Group("")
    protected.Use(middleware.AuthMiddleware(jwtMaker))
    {
        // User routes
        protected.GET("/users/me", authHandler.GetCurrentUser)

        // Progress routes
        protected.GET("/progress", progressHandler.GetUserProgress)
        protected.PUT("/progress", progressHandler.UpdateProgress)

        // Notes routes
        protected.GET("/notes", noteHandler.GetUserNotes)
        protected.POST("/notes", noteHandler.CreateNote)
        protected.PUT("/notes/:id", noteHandler.UpdateNote)
        protected.DELETE("/notes/:id", noteHandler.DeleteNote)
    }

    // Start server
    if err := router.Run(cfg.Server.Address); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
```

## Integrating with the Frontend

### API Service in Vue.js

Create a service to interact with the backend:

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default {
  // Auth endpoints
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    this.setAuthData(response.data);
    return response.data;
  },
  
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    this.setAuthData(response.data);
    return response.data;
  },
  
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
  
  // Progress endpoints
  async getUserProgress() {
    const response = await api.get('/progress');
    return response.data;
  },
  
  async updateProgress(progressData) {
    const response = await api.put('/progress', progressData);
    return response.data;
  },
  
  // Notes endpoints
  async getNotes(moduleId, lessonId) {
    const response = await api.get('/notes', {
      params: { moduleId, lessonId }
    });
    return response.data;
  },
  
  async createNote(noteData) {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  
  async updateNote(noteId, noteData) {
    const response = await api.put(`/notes/${noteId}`, noteData);
    return response.data;
  },
  
  async deleteNote(noteId) {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  },
  
  // Helper methods
  setAuthData(data) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', data.username);
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
```

### Authentication Components

Create login and registration components:

```vue
<!-- src/components/auth/LoginForm.vue -->
<template>
  <div class="login-form">
    <h2>Login to Your Account</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
        />
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
      
      <div class="form-footer">
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      
      try {
        await api.login(this.form);
        this.$router.push('/');
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

### Authentication Guard

Implement route protection for authenticated routes:

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import api from '@/services/api';

// Import views
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Lesson from '@/views/Lesson.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { redirectIfAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { redirectIfAuth: true }
  },
  {
    path: '/module/:moduleId/lesson/:lessonId',
    name: 'Lesson',
    component: Lesson,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const isAuthenticated = api.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.redirectIfAuth && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
```

### Vuex Store for User Data

Update the Vuex store to handle user state:

```javascript
// store/modules/user.js
import api from '@/services/api';

const state = {
  userId: localStorage.getItem('userId') || null,
  username: localStorage.getItem('username') || null,
  isAuthenticated: !!localStorage.getItem('token')
};

const mutations = {
  SET_USER(state, { userId, username }) {
    state.userId = userId;
    state.username = username;
    state.isAuthenticated = true;
  },
  CLEAR_USER(state) {
    state.userId = null;
    state.username = null;
    state.isAuthenticated = false;
  }
};

const actions = {
  async login({ commit }, credentials) {
    const response = await api.login(credentials);
    commit('SET_USER', {
      userId: response.userId,
      username: response.username
    });
  },
  
  async register({ commit }, userData) {
    const response = await api.register(userData);
    commit('SET_USER', {
      userId: response.userId,
      username: response.username
    });
  },
  
  async logout({ commit }) {
    await api.logout();
    commit('CLEAR_USER');
  }
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  userId: state => state.userId,
  username: state => state.username
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
```

### Progress Synchronization

Update the progress store to synchronize with the backend:

```javascript
// store/modules/progress.js
import api from '@/services/api';

const state = {
  modules: {},
  lastVisited: null,
  isSyncing: false,
  lastSyncTime: null
};

const mutations = {
  // Existing mutations...
  
  SET_PROGRESS(state, progressData) {
    // Transform API progress data to our store format
    const modules = {};
    
    progressData.modules.forEach(moduleProgress => {
      const lessons = {};
      
      moduleProgress.lessons.forEach(lesson => {
        lessons[lesson.lessonId] = {
          started: true,
          completed: lesson.completed,
          lastUpdated: new Date(lesson.lastUpdated)
        };
      });
      
      // Calculate module completion
      const totalLessons = Object.keys(lessons).length;
      const completedLessons = Object.values(lessons)
        .filter(l => l.completed).length;
      
      modules[moduleProgress.moduleId] = {
        started: totalLessons > 0,
        completed: totalLessons > 0 && completedLessons === totalLessons,
        totalLessons,
        completedLessons,
        lessons
      };
    });
    
    state.modules = modules;
  },
  
  SET_SYNCING(state, isSyncing) {
    state.isSyncing = isSyncing;
  },
  
  SET_LAST_SYNC_TIME(state, time) {
    state.lastSyncTime = time;
  }
};

const actions = {
  // Existing actions...
  
  async fetchProgress({ commit }) {
    commit('SET_SYNCING', true);
    
    try {
      const progressData = await api.getUserProgress();
      commit('SET_PROGRESS', progressData);
      commit('SET_LAST_SYNC_TIME', new Date());
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      commit('SET_SYNCING', false);
    }
  },
  
  async syncProgress({ state, commit }, { moduleId, lessonId }) {
    // Only sync if the user is authenticated
    if (!state.modules[moduleId] || !state.modules[moduleId].lessons[lessonId]) {
      return;
    }
    
    const lessonProgress = state.modules[moduleId].lessons[lessonId];
    
    try {
      await api.updateProgress({
        moduleId,
        lessonId,
        completed: lessonProgress.completed
      });
      
      commit('SET_LAST_SYNC_TIME', new Date());
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  }
};

// Getters remain the same

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
```

## Deployment Considerations

### Development Environment

For local development:

1. **Backend**:
   - Run the API server on localhost with a development configuration
   - Use SQLite for a simpler development database
   - Enable CORS for the frontend development server

2. **Frontend**:
   - Configure the API base URL to point to the local backend
   - Use environment variables for configuration
   - Set up hot module replacement for faster development

### Production Deployment

For production deployment:

1. **Backend**:
   - Deploy to a cloud provider (Azure, AWS, DigitalOcean, etc.)
   - Use a production-grade database (SQL Server, PostgreSQL)
   - Implement proper logging and monitoring
   - Set up appropriate security measures (HTTPS, rate limiting)

2. **Frontend**:
   - Build the Vue.js application for production
   - Serve static assets from a CDN
   - Configure the API base URL for the production backend
   - Implement error tracking

3. **DevOps**:
   - Set up CI/CD pipelines for automated testing and deployment
   - Implement database migrations with versioning
   - Configure proper backup and recovery procedures
   - Monitor application health and performance

## Exercises

1. **Create a Basic Backend**: Implement a minimal ASP.NET Core or Golang API with user authentication and progress tracking.

2. **Frontend Integration**: Update the Vue.js frontend to authenticate with the backend and sync progress.

3. **Cloud Deployment**: Deploy your backend API to a cloud provider and configure your frontend to use it.

4. **Enhanced Features**: Add at least one of these features to your learning portal:
   - User profile management
   - Learning progress analytics
   - Content management system for adding lessons
   - Social features like comments or sharing

5. **Security Audit**: Review your backend implementation for security vulnerabilities and implement fixes.

## Conclusion

Adding a backend to your learning portal transforms it from a client-side application to a full-featured web application. This enhancement enables critical features like user authentication, cloud-based progress tracking, and more sophisticated data management.

As you continue your journey from "vibe coder" to software engineer, this practical exercise reinforces several key skills:

- Building RESTful APIs with modern frameworks
- Implementing secure authentication systems
- Designing efficient data models and database schemas
- Integrating frontend and backend applications
- Deploying and maintaining full-stack applications

In the next lessons, we'll explore advanced features and optimizations to further enhance your learning portal.

## Additional Resources

### C# / ASP.NET Core
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [JWT Authentication in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt-bearer)

### Golang
- [Go Documentation](https://golang.org/doc/)
- [Gin Web Framework](https://github.com/gin-gonic/gin)
- [GORM Documentation](https://gorm.io/docs/)
- [JWT Authentication in Go](https://github.com/golang-jwt/jwt)

### Frontend Integration
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Vue.js Authentication Guide](https://vuejs.org/guide/scaling-up/ssr.html)
- [Vuex State Management](https://vuex.vuejs.org/)

### Deployment
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- [Netlify](https://www.netlify.com/) (for Vue.js frontend)
