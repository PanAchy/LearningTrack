# Security Best Practices

## Introduction

Security is a critical aspect of software development, especially for internal tools that may handle sensitive company data. Even though internal tools aren't exposed to the public internet, they still face significant security risks from both internal and external threats. This lesson covers essential security best practices that should be integrated into your development process.

## Understanding Security Risks for Internal Tools

### Common Security Myths

❌ **Myth**: "It's just an internal tool, so security isn't important."  
✅ **Reality**: Internal tools often have access to sensitive data and systems.

❌ **Myth**: "We're behind a firewall, so we're safe."  
✅ **Reality**: Many attacks come from within the network or through compromised accounts.

❌ **Myth**: "Our data isn't valuable to attackers."  
✅ **Reality**: All business data has value, whether for competitive intelligence, ransom, or as a stepping stone to other systems.

### Types of Security Threats

1. **Insider Threats**: Current or former employees misusing their access
2. **Account Compromise**: Stolen credentials used by external attackers
3. **Data Exfiltration**: Unauthorized transfer of data outside the organization
4. **Privilege Escalation**: Gaining higher levels of access than intended
5. **Malware Infection**: Malicious software gaining access to internal systems
6. **Supply Chain Attacks**: Compromised dependencies or third-party components
7. **Configuration Errors**: Misconfigured security settings exposing vulnerabilities

### Security Impact Categories

| Category | Description | Example for Internal Tools |
|----------|-------------|----------------------------|
| **Confidentiality** | Protection of data from unauthorized access | Customer PII visible to unauthorized staff |
| **Integrity** | Ensuring data accuracy and reliability | Financial figures altered without authorization |
| **Availability** | Systems and data accessible when needed | Critical workflow tool down during peak period |
| **Compliance** | Adherence to regulations and policies | Regulatory violation due to improper controls |
| **Reputation** | Trust relationships with stakeholders | Loss of employee trust due to monitoring overreach |

## Authentication and Authorization

### Authentication: Verifying Identity

#### Password Security

1. **Enforce Strong Password Policies**:
   - Minimum length (12+ characters recommended)
   - Complexity requirements (mix of character types)
   - Password history constraints
   - Regular password changes (but avoid too-frequent rotation)

2. **Implement Multi-Factor Authentication (MFA)**:
   - Something you know (password)
   - Something you have (mobile device, security key)
   - Something you are (biometrics)

3. **Secure Password Storage**:
   - Use strong, modern hashing algorithms (bcrypt, Argon2)
   - Include unique salt values
   - Never store plaintext passwords

#### Example: Password Hashing in C#

```csharp
// Using BCrypt.Net-Next package
public string HashPassword(string password)
{
    // WorkFactor determines the computational intensity (11-15 is recommended)
    return BCrypt.HashPassword(password, BCrypt.GenerateSalt(12));
}

public bool VerifyPassword(string password, string hashedPassword)
{
    return BCrypt.Verify(password, hashedPassword);
}
```

#### Single Sign-On (SSO)

Integrate with your organization's identity provider using protocols like:
- SAML 2.0
- OAuth 2.0
- OpenID Connect
- WS-Federation

Benefits of SSO for internal tools:
- Reduced password fatigue
- Centralized authentication policies
- Streamlined user provisioning and deprovisioning
- Better access tracking and auditing

#### Example: Integrating with Microsoft Identity Platform (Azure AD)

```javascript
// Vue.js example with MSAL.js
import * as msal from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "your-azure-ad-client-id",
    authority: "https://login.microsoftonline.com/your-tenant-id",
    redirectUri: "http://localhost:8080",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

export async function login() {
  try {
    const loginResponse = await msalInstance.loginPopup();
    return loginResponse.account;
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
}

export async function getToken() {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) {
    throw new Error("User not logged in");
  }
  
  const request = {
    scopes: ["api://your-api-id/access_as_user"],
    account: account
  };
  
  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // Silent token acquisition failed, fall back to interactive method
    const response = await msalInstance.acquireTokenPopup(request);
    return response.accessToken;
  }
}
```

### Authorization: Managing Access Rights

#### Role-Based Access Control (RBAC)

Define roles that group permissions together based on job functions.

**Common Roles for Internal Tools**:
- Administrator: Full access to all features
- Manager: Access to reporting and team member actions
- Standard User: Basic functionality access
- Read-Only: View-only access to data
- Support: Access to help users but not modify critical data

#### Example: RBAC Implementation in C#

```csharp
// ASP.NET Core RBAC
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireAdminRole", policy => 
                policy.RequireRole("Administrator"));
                
            options.AddPolicy("DataManagement", policy => 
                policy.RequireRole("Administrator", "DataManager"));
                
            options.AddPolicy("ReportViewer", policy => 
                policy.RequireRole("Administrator", "Manager", "Analyst"));
        });
    }
}

[Authorize(Policy = "RequireAdminRole")]
public class AdminController : Controller
{
    // Only accessible to administrators
}

[Authorize(Policy = "ReportViewer")]
public class ReportsController : Controller
{
    // Accessible to administrators, managers, and analysts
}
```

#### Attribute-Based Access Control (ABAC)

More granular than RBAC, ABAC considers multiple factors for access decisions:
- User attributes (department, clearance level)
- Resource attributes (sensitivity level, owner)
- Action attributes (read, write, delete)
- Environmental attributes (time of day, location)

#### Example: ABAC-style Authorization Logic

```javascript
function canAccessDocument(user, document, action) {
  // Basic role check
  if (user.role === 'Administrator') return true;
  
  // Department-based access
  if (document.department === user.department) {
    // Managers can perform any action on their department's documents
    if (user.isManager) return true;
    
    // Regular users can view and edit but not delete
    if (action === 'view' || action === 'edit') return true;
    
    // Only document owners can delete
    if (action === 'delete' && document.createdBy === user.id) return true;
  }
  
  // Cross-department read access for specific roles
  if (action === 'view' && user.hasPermission('cross_department_read')) return true;
  
  return false;
}
```

#### Principle of Least Privilege

Always grant the minimum level of access necessary for a user to perform their job functions.

**Implementation Strategies**:
- Start with zero access and add permissions as needed
- Regularly audit and review existing permissions
- Remove unused access rights promptly
- Use time-bound access for temporary needs

## Data Security

### Protecting Data at Rest

#### Database Security

1. **Enable Encryption**:
   - Transparent Data Encryption (TDE) for SQL Server
   - Encrypted tablespaces in PostgreSQL
   - FileVault or BitLocker for file-based databases like SQLite

2. **Secure Database Authentication**:
   - Use dedicated service accounts with minimal privileges
   - Implement strong password policies
   - Rotate credentials regularly

3. **Access Controls**:
   - Implement row-level security where needed
   - Use database roles and schemas to control access
   - Audit database access regularly

#### Example: Row-Level Security in PostgreSQL

```sql
-- Create a policy that limits data access by department
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name TEXT,
  department TEXT,
  salary INTEGER
);

-- Enable row-level security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create a policy that limits users to seeing only their department
CREATE POLICY department_isolation ON employees
  USING (department = current_setting('app.current_department'));

-- In your application code, set the appropriate context
-- before executing queries
SET app.current_department = 'Engineering';
```

### Protecting Data in Transit

#### Transport Layer Security (TLS)

Always encrypt data in transit using TLS (formerly SSL):
- Use TLS 1.2 or higher
- Configure secure cipher suites
- Implement proper certificate management
- Enable HTTP Strict Transport Security (HSTS)

#### API Security

1. **Authentication**:
   - Use API keys for service-to-service communication
   - Implement OAuth 2.0 for user-context API access
   - Consider using mutual TLS for critical systems

2. **Input Validation**:
   - Validate all input parameters
   - Implement request rate limiting
   - Use API gateways for centralized security policies

#### Example: Setting Up HTTPS in ASP.NET Core

```csharp
public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Redirect HTTP to HTTPS
        app.UseHttpsRedirection();
        
        // Add HSTS middleware
        app.UseHsts();
        
        // ... other middleware
    }
}
```

### Sensitive Data Handling

#### Data Classification

Categorize data based on sensitivity:
- **Public**: Can be freely shared
- **Internal**: For all employees but not external sharing
- **Confidential**: Limited to specific roles or departments
- **Restricted**: Highest sensitivity, strictly controlled access

#### Sensitive Data Types

1. **Personally Identifiable Information (PII)**:
   - Names, addresses, phone numbers
   - Email addresses
   - Government ID numbers
   - Biometric data

2. **Financial Data**:
   - Account numbers
   - Credit card information
   - Financial statements
   - Salary information

3. **Business-Sensitive Information**:
   - Strategic plans
   - Proprietary algorithms
   - Customer lists
   - Pricing information

#### Data Masking and Anonymization

For development and testing environments:
- Use synthetic data when possible
- Mask or obfuscate sensitive fields
- Implement data anonymization techniques
- Consider data virtualization tools

#### Example: Data Masking Function

```javascript
function maskSensitiveData(data, fieldsToMask) {
  const maskedData = { ...data };
  
  fieldsToMask.forEach(field => {
    if (maskedData[field]) {
      // Different masking strategies for different data types
      if (field.includes('email')) {
        const [username, domain] = maskedData[field].split('@');
        maskedData[field] = `${username.substring(0, 2)}***@${domain}`;
      } else if (field.includes('phone')) {
        maskedData[field] = maskedData[field].replace(/\d(?=\d{4})/g, '*');
      } else if (field.includes('name')) {
        maskedData[field] = maskedData[field].charAt(0) + '***';
      } else {
        maskedData[field] = '********';
      }
    }
  });
  
  return maskedData;
}

// Usage
const userData = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '555-123-4567',
  ssn: '123-45-6789'
};

const maskedUser = maskSensitiveData(userData, ['name', 'email', 'phone', 'ssn']);
console.log(maskedUser);
// Output: {
//   name: 'J***',
//   email: 'jo***@example.com',
//   phone: '***-***-4567',
//   ssn: '********'
// }
```

## Secure Coding Practices

### Input Validation and Sanitization

#### Validating User Input

1. **Validation Strategies**:
   - Type checking (strings, numbers, dates)
   - Range checking for numeric values
   - Pattern matching using regular expressions
   - Schema validation for complex objects
   - Length limits for strings

2. **Implementation Approaches**:
   - Client-side validation for user experience
   - Server-side validation for security (never trust client input)
   - Use validation libraries and frameworks
   - Centralize validation logic for consistency

#### Example: Input Validation with Vue.js and Vuelidate

```javascript
import { required, minLength, email, numeric } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        age: null
      }
    }
  },
  validations: {
    form: {
      name: { 
        required, 
        minLength: minLength(2) 
      },
      email: { 
        required, 
        email 
      },
      phone: { 
        required, 
        numeric 
      },
      age: { 
        required, 
        numeric,
        minValue: value => value >= 18,
        maxValue: value => value <= 120
      }
    }
  },
  methods: {
    submitForm() {
      // First validate all inputs
      this.$v.form.$touch();
      
      // Only proceed if validation passes
      if (!this.$v.form.$invalid) {
        // Submit form data to backend
      }
    }
  }
}
```

#### Preventing Injection Attacks

1. **SQL Injection Prevention**:
   - Use parameterized queries or prepared statements
   - Implement an ORM (Object-Relational Mapper)
   - Apply the principle of least privilege for database users
   - Validate and sanitize input before database operations

#### Example: Parameterized Queries in C#

```csharp
// Unsafe method - vulnerable to SQL injection
public User GetUserUnsafe(string username)
{
    string sql = "SELECT * FROM Users WHERE Username = '" + username + "'";
    // This is vulnerable if username contains ' OR 1=1 --
    
    // Execute query
    // ...
}

// Safe method using parameterized query
public User GetUserSafe(string username)
{
    string sql = "SELECT * FROM Users WHERE Username = @Username";
    
    using (var connection = new SqlConnection(_connectionString))
    {
        connection.Open();
        
        using (var command = new SqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@Username", username);
            
            using (var reader = command.ExecuteReader())
            {
                // Process results
                // ...
            }
        }
    }
}
```

2. **Cross-Site Scripting (XSS) Prevention**:
   - Escape output in HTML contexts
   - Use Content Security Policy (CSP)
   - Implement proper encoding for different contexts
   - Use modern frameworks that automatically escape content

#### Example: Preventing XSS in Vue.js

```html
<!-- Unsafe way to render user input -->
<div v-html="userProvidedContent"></div>

<!-- Safe way to render user input -->
<div>{{ userProvidedContent }}</div>

<!-- If HTML rendering is required, sanitize first -->
<script>
import DOMPurify from 'dompurify';

export default {
  computed: {
    sanitizedContent() {
      return DOMPurify.sanitize(this.userProvidedContent);
    }
  }
}
</script>

<div v-html="sanitizedContent"></div>
```

### Secure Dependency Management

#### Managing Third-Party Dependencies

1. **Regular Dependency Updates**:
   - Establish a process for regular dependency reviews
   - Use automated tools to check for vulnerable packages
   - Implement automated dependency update workflows

2. **Dependency Scanning**:
   - Integrate vulnerability scanning into your CI/CD pipeline
   - Use tools like OWASP Dependency-Check, Snyk, or GitHub Dependabot
   - Establish policies for addressing vulnerable dependencies

#### Example: Adding Dependency Scanning to GitHub Actions

```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Secure Configuration and Secrets Management

#### Environment Configuration

1. **Environment-Specific Configuration**:
   - Separate configurations for development, testing, and production
   - Validate configurations during application startup
   - Use configuration validation schemas

2. **Default Secure Settings**:
   - Always default to the most secure configuration
   - Require explicit opt-out for less secure options
   - Document security implications of configuration changes

#### Example: Environment Configuration in .NET

```csharp
public class Startup
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    
    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        _config = configuration;
        _env = env;
    }
    
    public void ConfigureServices(IServiceCollection services)
    {
        // Base security settings
        var securitySettings = new SecuritySettings();
        _config.GetSection("Security").Bind(securitySettings);
        
        // Validate security configuration
        if (_env.IsProduction() && !securitySettings.RequireTls)
        {
            throw new Exception("TLS must be enabled in production");
        }
        
        // Apply security settings
        if (securitySettings.RequireTls)
        {
            services.AddHsts(options =>
            {
                options.MaxAge = TimeSpan.FromDays(365);
                options.IncludeSubDomains = true;
                options.Preload = true;
            });
        }
        
        // ... additional configuration
    }
}
```

#### Secrets Management

1. **Avoiding Hardcoded Secrets**:
   - Never store secrets in source code
   - Don't include secrets in configuration files
   - Use environment variables or dedicated secrets management services

2. **Secrets Management Solutions**:
   - Azure Key Vault
   - AWS Secrets Manager
   - HashiCorp Vault
   - Environment variables in containerized environments

#### Example: Using Azure Key Vault in .NET Core

```csharp
// Program.cs
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureAppConfiguration((context, config) =>
        {
            var builtConfig = config.Build();
            
            // Only add Key Vault if the appropriate configuration exists
            var keyVaultUri = builtConfig["KeyVault:Vault"];
            if (!string.IsNullOrEmpty(keyVaultUri))
            {
                var azureServiceTokenProvider = new AzureServiceTokenProvider();
                var keyVaultClient = new KeyVaultClient(
                    new KeyVaultClient.AuthenticationCallback(
                        azureServiceTokenProvider.KeyVaultTokenCallback));
                        
                config.AddAzureKeyVault(
                    keyVaultUri,
                    keyVaultClient,
                    new DefaultKeyVaultSecretManager());
            }
        })
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```

## Frontend Security

### Cross-Site Request Forgery (CSRF) Protection

CSRF attacks trick users into executing unwanted actions on a web application where they're authenticated.

#### Prevention Strategies

1. **Anti-CSRF Tokens**:
   - Include a unique token with each form
   - Validate the token on form submission
   - Regenerate tokens with each new form

2. **Same-Site Cookies**:
   - Set the `SameSite` attribute on cookies
   - Use `SameSite=Strict` for highest security
   - Or `SameSite=Lax` for a balance of security and usability

#### Example: CSRF Protection in ASP.NET Core

```csharp
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddAntiforgery(options => 
    {
        // Strengthen CSRF protection
        options.HeaderName = "X-CSRF-TOKEN";
        options.SuppressXFrameOptionsHeader = false;
        options.Cookie.Name = "CSRF-TOKEN";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
    });
}

// In controller
[HttpGet]
public IActionResult ContactForm()
{
    return View();
}

[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult ContactForm(ContactViewModel model)
{
    if (ModelState.IsValid)
    {
        // Process form
    }
    return View(model);
}
```

### Content Security Policy (CSP)

CSP is an added layer of security that helps detect and mitigate certain types of attacks, including XSS and data injection.

#### Key CSP Directives

- `default-src`: Fallback for other resource types
- `script-src`: Valid sources for JavaScript
- `style-src`: Valid sources for stylesheets
- `img-src`: Valid sources for images
- `connect-src`: Valid targets for fetch, XHR, WebSocket
- `frame-src`: Valid sources for frames
- `font-src`: Valid sources for fonts

#### Example: Implementing CSP

```csharp
// ASP.NET Core implementation
app.Use(async (context, next) =>
{
    context.Response.Headers.Add(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' https://trusted-cdn.com; " +
        "style-src 'self' https://trusted-cdn.com; " +
        "img-src 'self' data: https://*.trusted-images.com; " +
        "connect-src 'self' https://api.internal-company.com; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"
    );
    
    await next();
});
```

### Secure Cookies

Cookies are often used to maintain user sessions and store preferences, making them an attractive target for attackers.

#### Security Attributes

- `HttpOnly`: Prevents JavaScript access to cookies
- `Secure`: Sends cookies only over HTTPS
- `SameSite`: Controls when cookies are sent with cross-site requests
- `Expires`/`Max-Age`: Limits cookie lifetime
- `Domain` and `Path`: Restricts cookie scope

#### Example: Setting Secure Cookies

```javascript
// Express.js example
app.use(session({
  secret: 'your-secret-key',
  name: 'sessionId', // Avoid default cookie names
  cookie: {
    httpOnly: true,
    secure: true, // Requires HTTPS
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour in milliseconds
    path: '/',
    domain: 'internal-app.company.com'
  },
  resave: false,
  saveUninitialized: false
}));
```

## Backend Security

### API Security Best Practices

1. **Authentication and Authorization**:
   - Use token-based authentication (JWT, OAuth)
   - Implement proper authorization checks for each endpoint
   - Use API keys for service-to-service communication

2. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Set reasonable limits based on endpoint sensitivity
   - Include clear rate limit indicators in responses

3. **Input Validation**:
   - Validate all API parameters
   - Use strict schemas for request bodies
   - Implement proper error handling for invalid inputs

4. **Security Headers**:
   - Set appropriate security headers in responses
   - Include CORS headers with tight restrictions
   - Consider API-specific security headers

#### Example: Basic API Security in Express.js

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('express-jwt');
const cors = require('cors');

const app = express();

// Set security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: 'https://internal-app.company.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in headers
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

// JWT Authentication
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
  }).unless({
    path: ['/api/auth/login', '/api/health']
  })
);

// Error handler for auth errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  next(err);
});

// Secure API endpoint example
app.get('/api/users/:id', (req, res) => {
  // Validate parameters
  const userId = parseInt(req.params.id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  // Authorization check
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  
  // Process the request
  // ...
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Error Handling and Logging

1. **Secure Error Handling**:
   - Don't expose sensitive details in error messages
   - Use generic error messages for users
   - Log detailed errors for troubleshooting
   - Implement different error handling for dev and production

2. **Security Logging**:
   - Log security-relevant events
   - Include necessary context without sensitive data
   - Protect log files from unauthorized access
   - Implement log rotation and retention policies

#### Example: Secure Error Handling in ASP.NET Core

```csharp
// Startup.cs
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Error");
        // Detailed errors are logged but not shown to users
        app.UseStatusCodePagesWithReExecute("/Error/{0}");
    }
    
    // ... other middleware
}

// ErrorController.cs
[AllowAnonymous]
public class ErrorController : Controller
{
    private readonly ILogger<ErrorController> _logger;
    
    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }
    
    [Route("Error/{statusCode}")]
    public IActionResult StatusCodeHandler(int statusCode)
    {
        var feature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
        var path = feature?.OriginalPath;
        
        // Log the error with context for troubleshooting
        _logger.LogError(
            "Error {StatusCode} occurred for path {Path} with query {Query}",
            statusCode,
            path,
            feature?.OriginalQueryString);
        
        // Return a generic view appropriate for the status code
        return View(new ErrorViewModel { StatusCode = statusCode });
    }
    
    [Route("Error")]
    public IActionResult Error()
    {
        var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionFeature?.Error;
        var path = exceptionFeature?.Path;
        
        // Log the exception details
        _logger.LogError(
            exception,
            "Unhandled exception occurred for path {Path}",
            path);
        
        // Return a generic error view
        return View("Error", new ErrorViewModel { 
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier 
        });
    }
}
```

### Security in File Operations

1. **Secure File Uploads**:
   - Validate file types and content
   - Scan for malware if possible
   - Store files outside web root
   - Use random filenames to prevent guessing
   - Set appropriate file permissions

2. **Preventing Path Traversal**:
   - Sanitize and validate file paths
   - Use path normalization
   - Restrict allowed directories
   - Implement proper authorization for file access

#### Example: Secure File Upload in Node.js

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Store outside web root
    cb(null, path.join(__dirname, '../secure-uploads'));
  },
  filename: function(req, file, cb) {
    // Use random filename and preserve extension
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);
      
      const originalExt = path.extname(file.originalname).toLowerCase();
      const safeFilename = raw.toString('hex') + originalExt;
      cb(null, safeFilename);
    });
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
  }
};

// File size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Check authentication first
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }
  
  // Save file metadata in database (optional)
  const fileInfo = {
    originalName: req.file.originalname,
    storedPath: req.file.path,
    uploadedBy: req.user.id,
    uploadedAt: new Date(),
    fileSize: req.file.size,
    mimeType: req.file.mimetype
  };
  
  // ... save fileInfo to database
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      name: req.file.originalname,
      size: req.file.size,
      id: fileInfo.id // From database
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error (e.g., file too large)
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Other errors
    console.error(err);
    return res.status(500).json({ error: 'File upload failed' });
  }
  next();
});

// Secure file serving (with authorization)
app.get('/files/:fileId', async (req, res) => {
  // Check authentication
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const fileId = req.params.fileId;
  
  // Get file info from database
  const fileInfo = await getFileFromDatabase(fileId);
  if (!fileInfo) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Check authorization
  const canAccess = await userCanAccessFile(req.user.id, fileInfo);
  if (!canAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Verify path is still within allowed directory
  const normalizedPath = path.normalize(fileInfo.storedPath);
  const securePath = path.join(__dirname, '../secure-uploads');
  
  if (!normalizedPath.startsWith(securePath)) {
    return res.status(403).json({ error: 'Invalid file path' });
  }
  
  // Serve the file
  res.sendFile(normalizedPath);
});
```

## Security Testing and Monitoring

### Security Testing Approaches

1. **Static Application Security Testing (SAST)**:
   - Analyzes source code for security vulnerabilities
   - Runs during the development phase
   - Identifies issues like SQL injection, XSS, insecure coding patterns
   - Tools: SonarQube, Checkmarx, ESLint security plugins

2. **Dynamic Application Security Testing (DAST)**:
   - Tests running applications from the outside
   - Identifies runtime vulnerabilities
   - Simulates real-world attacks
   - Tools: OWASP ZAP, Burp Suite

3. **Dependency Scanning**:
   - Checks third-party libraries for known vulnerabilities
   - Identifies outdated or insecure packages
   - Tools: npm audit, OWASP Dependency-Check, Snyk

4. **Penetration Testing**:
   - Manual or semi-automated security testing
   - Simulates sophisticated attacks
   - Identifies complex vulnerabilities
   - Typically performed by security specialists

#### Example: Adding SAST to Your CI Pipeline

```yaml
# GitHub Actions workflow example
name: Security Scans

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-scans:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=high
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      
      - name: Run ESLint security scan
        run: npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.security.js
```

### Security Monitoring

1. **Application Logging**:
   - Log security-relevant events
   - Implement structured logging
   - Include context without sensitive data
   - Use proper log levels

2. **Security Information and Event Management (SIEM)**:
   - Centralized log collection and analysis
   - Real-time monitoring and alerting
   - Correlation of security events
   - Examples: Splunk, ELK Stack, Microsoft Sentinel

3. **Runtime Application Self-Protection (RASP)**:
   - Integrates with the application to detect and block attacks in real-time
   - Monitors application behavior for anomalies
   - Can automatically respond to certain attack types
   - Examples: Contrast Security, Signal Sciences

#### Example: Setting Up Security Monitoring with Winston and ELK Stack

```javascript
// Node.js logging with Winston
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, json } = format;

// Custom format for sensitive data redaction
const redactSensitiveData = format((info) => {
  // Create a copy to avoid modifying the original
  const redacted = { ...info };
  
  // Redact sensitive fields if present
  if (redacted.user && redacted.user.password) {
    redacted.user.password = '[REDACTED]';
  }
  
  if (redacted.headers && redacted.headers.authorization) {
    redacted.headers.authorization = '[REDACTED]';
  }
  
  // Additional field redaction...
  
  return redacted;
});

// Create the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: 'INTERNAL-APP' }),
    timestamp(),
    redactSensitiveData(),
    json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Console transport for development
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
    }),
    // File transport for local logs
    new transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'combined.log' 
    }),
    // Elasticsearch transport for centralized logging
    // Requires additional npm package: winston-elasticsearch
    process.env.NODE_ENV === 'production' ? 
      new winstonElasticsearch.ElasticsearchTransport({
        level: 'info',
        index: 'logs-internal-app',
        clientOpts: {
          node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
        }
      }) : null
  ].filter(Boolean)
});

// Example of security event logging
function logSecurityEvent(eventType, data, severity = 'info') {
  logger.log({
    level: severity,
    message: `Security Event: ${eventType}`,
    eventType,
    ...data,
    timestamp: new Date().toISOString()
  });
}

// Usage examples
logSecurityEvent(
  'LOGIN_ATTEMPT',
  { 
    username: 'john.doe', 
    success: false, 
    failureReason: 'password',
    ipAddress: '192.168.1.100',
    userAgent: req.headers['user-agent']
  },
  'warn'
);

logSecurityEvent(
  'PERMISSION_CHANGE',
  {
    targetUser: 'jane.smith',
    changedBy: 'admin.user',
    oldPermissions: ['read', 'write'],
    newPermissions: ['read', 'write', 'admin'],
    resource: 'financial-reports'
  },
  'info'
);

logSecurityEvent(
  'POTENTIAL_ATTACK',
  {
    attackType: 'SQL_INJECTION',
    endpoint: '/api/users',
    payload: req.body,
    ipAddress: req.ip
  },
  'error'
);
```

## Security Governance and Compliance

### Security Policies and Procedures

1. **Internal Security Policies**:
   - Acceptable use policies
   - Data classification guidelines
   - Access control policies
   - Incident response procedures
   - Secure development lifecycle requirements

2. **Documentation Requirements**:
   - Security architecture diagrams
   - Data flow documentation
   - Third-party integration security reviews
   - Security risk assessments

### Compliance Considerations

1. **Common Compliance Standards**:
   - SOC 2: Security, availability, processing integrity, confidentiality, privacy
   - GDPR: European data protection regulation
   - HIPAA: Healthcare information privacy
   - PCI DSS: Payment card security

2. **Implementation Strategies**:
   - Map compliance requirements to technical controls
   - Implement controls systematically
   - Document compliance evidence
   - Conduct regular compliance assessments

### Security by Design

1. **Shift-Left Security**:
   - Incorporate security from the beginning of development
   - Include security requirements in planning
   - Security architecture reviews early in design
   - Regular security training for developers

2. **Security Champions Program**:
   - Designate security champions within development teams
   - Provide additional security training for champions
   - Champions help implement security practices
   - Create a security community of practice

## Exercises

Complete the following exercises to practice implementing security measures:

1. **Secure Authentication**: Implement a secure authentication system with password hashing, account lockout protection, and multi-factor authentication.

2. **Input Validation**: Create a form with proper server-side validation that prevents common injection attacks.

3. **Security Headers**: Implement appropriate security headers for an existing web application and test them using tools like [securityheaders.com](https://securityheaders.com).

4. **Security Code Review**: Conduct a security review of an existing internal tool and identify potential vulnerabilities.

5. **Secure Configuration**: Create a secure configuration system that separates sensitive information from code and uses appropriate secrets management.

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/) - Most critical web application security risks
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) - Comprehensive testing methodology
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security) - Best practices for web security
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Guidelines for improving security
- [Snyk Blog](https://snyk.io/blog/) - Security insights and best practices
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL/TLS certificates
- [Have I Been Pwned](https://haveibeenpwned.com/) - Check for compromised accounts
- [Web Security Academy](https://portswigger.net/web-security) - Free interactive security training
