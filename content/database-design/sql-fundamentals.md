# SQL Fundamentals

## Introduction

SQL (Structured Query Language) is the standard language for interacting with relational databases. As a software engineer building internal tools, understanding SQL is essential for creating applications that can efficiently store, retrieve, and manipulate data. This lesson covers the fundamental concepts and commands of SQL that you'll use regularly in your projects.

## Core Concepts

### What is a Relational Database?

A relational database stores data in tables composed of rows and columns, with relationships between tables defined by keys. The relational model provides a structured way to represent and query data, ensuring consistency and integrity.

### Database Terms

| Term | Description |
|------|-------------|
| Table | A collection of related data organized in rows and columns |
| Row | A single record in a table (also called a tuple) |
| Column | A field in a table that contains a specific type of data |
| Primary Key | A column or set of columns that uniquely identifies each row |
| Foreign Key | A column that creates a relationship with another table's primary key |
| Index | A data structure that improves the speed of data retrieval |
| Query | A request for data or information from a database |
| Schema | The structure that defines the organization of data |

### Data Types

SQL databases support various data types, with some variation between database systems:

**Numeric Types:**
- INTEGER: Whole numbers
- DECIMAL/NUMERIC: Fixed-point numbers
- REAL/FLOAT: Floating-point numbers

**String Types:**
- CHAR: Fixed-length character strings
- VARCHAR: Variable-length character strings
- TEXT: Long text strings

**Date and Time Types:**
- DATE: Calendar date (year, month, day)
- TIME: Time of day
- TIMESTAMP: Date and time

**Other Common Types:**
- BOOLEAN: True/false values
- BLOB: Binary data
- JSON: JSON data (in modern databases)

## Basic SQL Commands

### Creating Database Objects

#### CREATE TABLE

```sql
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE,
    department_id INTEGER,
    salary DECIMAL(10,2),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
```

#### ALTER TABLE

```sql
-- Add a column
ALTER TABLE employees ADD COLUMN phone_number VARCHAR(15);

-- Modify a column
ALTER TABLE employees ALTER COLUMN salary SET DEFAULT 0.00;

-- Add a constraint
ALTER TABLE employees ADD CONSTRAINT check_salary CHECK (salary >= 0);
```

#### DROP TABLE

```sql
DROP TABLE IF EXISTS employees;
```

### Data Manipulation

#### INSERT

```sql
-- Insert a single row
INSERT INTO employees (employee_id, first_name, last_name, email, hire_date, department_id, salary)
VALUES (1, 'John', 'Smith', 'john.smith@example.com', '2023-01-15', 3, 65000.00);

-- Insert multiple rows
INSERT INTO employees (employee_id, first_name, last_name, department_id)
VALUES 
    (2, 'Jane', 'Doe', 1),
    (3, 'Robert', 'Johnson', 2),
    (4, 'Lisa', 'Anderson', 1);
```

#### UPDATE

```sql
-- Update one column for all matching rows
UPDATE employees
SET salary = salary * 1.05
WHERE department_id = 3;

-- Update multiple columns
UPDATE employees
SET 
    department_id = 2,
    salary = 72000.00
WHERE employee_id = 1;
```

#### DELETE

```sql
-- Delete specific rows
DELETE FROM employees
WHERE hire_date < '2020-01-01';

-- Delete all rows
DELETE FROM employees;
```

### Data Retrieval

#### SELECT

```sql
-- Select all columns and rows
SELECT * FROM employees;

-- Select specific columns
SELECT first_name, last_name, salary FROM employees;

-- Filter rows with WHERE
SELECT * FROM employees WHERE department_id = 2;

-- Sort results with ORDER BY
SELECT * FROM employees ORDER BY salary DESC;

-- Limit the number of rows
SELECT * FROM employees LIMIT 10;
```

#### WHERE Clause Operators

```sql
-- Comparison operators
SELECT * FROM employees WHERE salary > 60000;
SELECT * FROM employees WHERE hire_date <= '2023-01-01';
SELECT * FROM employees WHERE department_id != 3;

-- Logical operators
SELECT * FROM employees WHERE department_id = 1 AND salary > 50000;
SELECT * FROM employees WHERE department_id = 1 OR department_id = 2;
SELECT * FROM employees WHERE NOT department_id = 3;

-- BETWEEN operator
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 70000;

-- IN operator
SELECT * FROM employees WHERE department_id IN (1, 3, 5);

-- LIKE operator (pattern matching)
SELECT * FROM employees WHERE last_name LIKE 'S%'; -- Starts with S
SELECT * FROM employees WHERE email LIKE '%@example.com'; -- Ends with @example.com
SELECT * FROM employees WHERE first_name LIKE '_a%'; -- Second letter is 'a'

-- NULL checks
SELECT * FROM employees WHERE phone_number IS NULL;
SELECT * FROM employees WHERE phone_number IS NOT NULL;
```

#### Aggregation and Grouping

```sql
-- COUNT
SELECT COUNT(*) FROM employees;
SELECT COUNT(phone_number) FROM employees; -- Counts non-NULL values

-- SUM, AVG, MIN, MAX
SELECT 
    SUM(salary) AS total_salary,
    AVG(salary) AS average_salary,
    MIN(salary) AS minimum_salary,
    MAX(salary) AS maximum_salary
FROM employees;

-- GROUP BY
SELECT 
    department_id,
    COUNT(*) AS employee_count,
    AVG(salary) AS average_salary
FROM employees
GROUP BY department_id;

-- HAVING (filters groups)
SELECT 
    department_id,
    COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### Joining Tables

#### Types of Joins

```sql
-- INNER JOIN (only matching rows)
SELECT e.employee_id, e.first_name, e.last_name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;

-- LEFT JOIN (all rows from left table)
SELECT e.employee_id, e.first_name, e.last_name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;

-- RIGHT JOIN (all rows from right table)
SELECT e.employee_id, e.first_name, e.last_name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;

-- FULL JOIN (all rows from both tables)
SELECT e.employee_id, e.first_name, e.last_name, d.department_name
FROM employees e
FULL JOIN departments d ON e.department_id = d.department_id;
```

## Advanced Queries

### Subqueries

```sql
-- Subquery in WHERE clause
SELECT * FROM employees
WHERE department_id IN (
    SELECT department_id FROM departments
    WHERE location = 'New York'
);

-- Subquery in SELECT clause
SELECT 
    department_id,
    department_name,
    (SELECT COUNT(*) FROM employees WHERE employees.department_id = departments.department_id) AS employee_count
FROM departments;

-- Subquery in FROM clause
SELECT avg_salary_dept.department_id, avg_salary_dept.avg_salary
FROM (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
) AS avg_salary_dept
WHERE avg_salary_dept.avg_salary > 60000;
```

### Common Table Expressions (CTEs)

```sql
-- Basic CTE
WITH dept_salary_stats AS (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary,
        COUNT(*) AS employee_count
    FROM employees
    GROUP BY department_id
)
SELECT 
    d.department_name,
    s.avg_salary,
    s.employee_count
FROM dept_salary_stats s
JOIN departments d ON s.department_id = d.department_id;

-- Recursive CTE (for hierarchical data)
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: get top-level employees (managers)
    SELECT employee_id, first_name, last_name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive step: get employees under each manager
    SELECT e.employee_id, e.first_name, e.last_name, e.manager_id, h.level + 1
    FROM employees e
    JOIN employee_hierarchy h ON e.manager_id = h.employee_id
)
SELECT * FROM employee_hierarchy ORDER BY level, employee_id;
```

### Window Functions

```sql
-- ROW_NUMBER()
SELECT 
    employee_id,
    first_name,
    last_name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS salary_rank
FROM employees;

-- RANK() and DENSE_RANK()
SELECT 
    employee_id,
    first_name,
    last_name,
    department_id,
    salary,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_salary_rank
FROM employees;

-- Moving aggregates
SELECT 
    employee_id,
    hire_date,
    salary,
    AVG(salary) OVER (ORDER BY hire_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_salary
FROM employees;
```

## Database Constraints

### Types of Constraints

```sql
CREATE TABLE products (
    -- PRIMARY KEY constraint
    product_id INTEGER PRIMARY KEY,
    
    -- NOT NULL constraint
    product_name VARCHAR(100) NOT NULL,
    
    -- UNIQUE constraint
    sku VARCHAR(20) UNIQUE,
    
    -- CHECK constraint
    price DECIMAL(10,2) CHECK (price > 0),
    
    -- DEFAULT constraint
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- FOREIGN KEY constraint
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

## Transactions

### Transaction Control

```sql
-- Begin a transaction
BEGIN TRANSACTION;

-- Multiple operations within the transaction
UPDATE accounts SET balance = balance - 100 WHERE account_id = 123;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 456;

-- Check for errors and commit or rollback
COMMIT; -- Make changes permanent
-- or
ROLLBACK; -- Undo all changes in the transaction
```

### Transaction Properties (ACID)

- **Atomicity**: All operations in a transaction complete successfully or none do
- **Consistency**: A transaction brings the database from one valid state to another
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Once a transaction is committed, it remains so even in case of system failure

## Best Practices

### Query Optimization

1. **Use specific column names** instead of `SELECT *`
2. **Create appropriate indexes** for frequently queried columns
3. **Avoid using functions on indexed columns** in WHERE clauses
4. **Be mindful of JOIN operations** on large tables
5. **Use EXPLAIN/EXPLAIN ANALYZE** to understand query execution plans
6. **Consider pagination** for large result sets

### Database Design

1. **Normalize data** to reduce redundancy (but know when to denormalize)
2. **Use appropriate data types** for columns
3. **Implement proper constraints** to maintain data integrity
4. **Name objects consistently** following a convention
5. **Document your schema** with comments and documentation

## Exercises

Complete the following exercises to practice your SQL skills:

1. Create a database schema for a simple blog with users, posts, and comments

<details>
<summary>💡 Hint 1</summary>

Start by identifying the entities (users, posts, comments) and their relationships. Consider what fields each entity needs.
</details>

<details>
<summary>💡 Hint 2</summary>

Use appropriate data types and constraints. For example, email addresses should be unique, timestamps should have default values, and foreign keys should maintain referential integrity.
</details>

<details>
<summary>📝 Example Solution Structure</summary>

```sql
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  post_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE comments (
  comment_id INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```
</details>

2. Write queries to insert sample data into your blog database

<details>
<summary>💡 Hint 1</summary>

Remember to insert data in the correct order due to foreign key constraints: first users, then posts, then comments.
</details>

<details>
<summary>💡 Hint 2</summary>

Use the `INSERT INTO` statement with either individual `VALUES` clauses for each row or a single statement with multiple rows.
</details>

<details>
<summary>📝 Example Solution</summary>

```sql
-- Insert users
INSERT INTO users (user_id, username, email, password_hash)
VALUES
  (1, 'johndoe', 'john@example.com', 'hashed_password_1'),
  (2, 'janedoe', 'jane@example.com', 'hashed_password_2');

-- Insert posts
INSERT INTO posts (post_id, user_id, title, content)
VALUES
  (1, 1, 'First Post', 'This is my first post content.'),
  (2, 2, 'Hello World', 'Introduction to my blog.');

-- Insert comments
INSERT INTO comments (comment_id, post_id, user_id, content)
VALUES
  (1, 1, 2, 'Great first post!'),
  (2, 2, 1, 'Welcome to blogging!');
```
</details>

3. Write a query to find the most active users based on post and comment count

<details>
<summary>💡 Hint 1</summary>

You can use subqueries or CTEs to count posts and comments separately, then combine the results.
</details>

<details>
<summary>💡 Hint 2</summary>

Use `GROUP BY` to aggregate by user, and consider using `COALESCE` to handle users who might have posts but no comments or vice versa.
</details>

<details>
<summary>📝 Example Solution</summary>

```sql
WITH post_counts AS (
  SELECT user_id, COUNT(*) AS post_count
  FROM posts
  GROUP BY user_id
),
comment_counts AS (
  SELECT user_id, COUNT(*) AS comment_count
  FROM comments
  GROUP BY user_id
)
SELECT 
  u.user_id,
  u.username,
  COALESCE(p.post_count, 0) AS post_count,
  COALESCE(c.comment_count, 0) AS comment_count,
  COALESCE(p.post_count, 0) + COALESCE(c.comment_count, 0) AS total_activity
FROM users u
LEFT JOIN post_counts p ON u.user_id = p.user_id
LEFT JOIN comment_counts c ON u.user_id = c.user_id
ORDER BY total_activity DESC;
```
</details>

4. Implement a transaction that transfers data between tables safely

<details>
<summary>💡 Hint 1</summary>

Use `BEGIN TRANSACTION` and `COMMIT` to wrap your operations. Include error handling with `ROLLBACK` if necessary.
</details>

<details>
<summary>💡 Hint 2</summary>

Consider a scenario like archiving old posts or transferring ownership of content from one user to another.
</details>

<details>
<summary>📝 Example Solution</summary>

```sql
-- Scenario: Archive old posts to an archive table

-- First, create an archive table if it doesn't exist
CREATE TABLE IF NOT EXISTS archived_posts (
  post_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Now perform the transaction
BEGIN TRANSACTION;

TRY
  -- Insert old posts into archive
  INSERT INTO archived_posts (post_id, user_id, title, content, created_at)
  SELECT post_id, user_id, title, content, created_at
  FROM posts
  WHERE created_at < DATE('now', '-1 year');
  
  -- Delete the posts that were archived
  DELETE FROM posts
  WHERE post_id IN (
    SELECT post_id FROM archived_posts
  );
  
  COMMIT;
CATCH
  ROLLBACK;
  RAISE;
END TRY;
```
</details>

5. Optimize a slow-running query using proper indexing and query restructuring

<details>
<summary>💡 Hint 1</summary>

Identify columns used in JOIN and WHERE clauses as candidates for indexes.
</details>

<details>
<summary>💡 Hint 2</summary>

Use `EXPLAIN` or `EXPLAIN ANALYZE` to see the execution plan before and after your optimizations.
</details>

<details>
<summary>📝 Example Solution</summary>

```sql
-- Original slow query
SELECT 
  p.post_id, 
  p.title, 
  u.username, 
  COUNT(c.comment_id) AS comment_count
FROM posts p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN comments c ON p.post_id = c.post_id
WHERE p.created_at > '2023-01-01'
GROUP BY p.post_id, p.title, u.username
ORDER BY comment_count DESC;

-- Add appropriate indexes
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Restructured query using CTE
WITH comment_counts AS (
  SELECT post_id, COUNT(*) AS count
  FROM comments
  GROUP BY post_id
)
SELECT 
  p.post_id, 
  p.title, 
  u.username, 
  COALESCE(cc.count, 0) AS comment_count
FROM posts p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN comment_counts cc ON p.post_id = cc.post_id
WHERE p.created_at > '2023-01-01'
ORDER BY comment_count DESC;
```
</details>

## Additional Resources

- [SQL Tutorial by W3Schools](https://www.w3schools.com/sql/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLite Documentation](https://sqlite.org/docs.html)
- [Use the Index, Luke!](https://use-the-index-luke.com/) - A guide to database performance
- [SQL Fiddle](http://sqlfiddle.com/) - Online SQL testing environment
