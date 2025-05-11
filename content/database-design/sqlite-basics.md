# SQLite Basics

## Introduction

SQLite is a lightweight, self-contained, serverless, zero-configuration, transactional SQL database engine. It's one of the most widely deployed database engines in the world, found in countless applications including browsers, mobile phones, and desktop software. For internal tools development, SQLite offers a perfect balance of simplicity and power, allowing you to create database-backed applications without the overhead of a separate database server.

## SQLite Characteristics

### Key Features of SQLite

- **Serverless**: Unlike most SQL databases, SQLite doesn't require a separate server process
- **Zero-configuration**: No setup or administration required
- **Self-contained**: A single file contains the entire database
- **Cross-platform**: Works on virtually all operating systems and devices
- **Reliable**: Implements full ACID properties even after system crashes
- **Compact**: The entire library with all features can be less than 600KB
- **Public Domain**: Free for any use, commercial or private

### When to Use SQLite

SQLite is ideal for:

- Internal tools and applications
- Desktop applications
- Prototyping and development
- Testing
- Small to medium-sized websites (up to ~100K hits/day)
- Mobile applications
- File format for data exchange
- Embedded systems

### Limitations of SQLite

SQLite may not be suitable for:

- High-volume websites (millions of hits per day)
- High-concurrency environments (many simultaneous writers)
- Very large datasets (multi-terabyte)
- Applications requiring wide area network access
- High-availability applications requiring 99.999% uptime

## Getting Started with SQLite

### Installation

SQLite is likely already installed on your system, as it comes pre-installed on many operating systems. To check if it's available, open a terminal or command prompt and type:

```bash
sqlite3 --version
```

If SQLite isn't installed, you can install it:

**Windows:**
1. Download the precompiled binaries from the [SQLite download page](https://www.sqlite.org/download.html)
2. Extract the files and add the folder to your PATH environment variable

**macOS:**
```bash
brew install sqlite
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install sqlite3
```

### Command Line Interface

The SQLite command line interface (CLI) is a simple tool for interacting with SQLite databases. To start it:

```bash
sqlite3 my_database.db
```

This will create a new database file called "my_database.db" if it doesn't exist, or open it if it does.

#### Basic CLI Commands

| Command | Description |
|---------|-------------|
| `.help` | Show help text |
| `.quit` or `.exit` | Exit the SQLite prompt |
| `.tables` | List all tables |
| `.schema [table]` | Show the CREATE statements for tables |
| `.mode column` | Display results in columns |
| `.headers on` | Show column headers in query results |
| `.open filename` | Open a database file |
| `.save filename` | Save the database to a file |
| `.dump [table]` | Dump database or table as SQL |
| `.import file table` | Import data from file into table |
| `.output file` | Send output to file |
| `.read file` | Execute SQL from a file |

## Database Operations

### Creating a Database

In SQLite, creating a database is as simple as opening a connection to a file:

```python
# Python example using the sqlite3 module
import sqlite3

# Create or open a database file
conn = sqlite3.connect('inventory.db')
```

```javascript
// JavaScript example using the better-sqlite3 module
const Database = require('better-sqlite3');
const db = new Database('inventory.db');
```

```csharp
// C# example using Microsoft.Data.Sqlite
using Microsoft.Data.Sqlite;

var connectionString = "Data Source=inventory.db";
using var connection = new SqliteConnection(connectionString);
connection.Open();
```

### Creating Tables

Once connected to a database, you can create tables using standard SQL:

```sql
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    order_date TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('pending', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending'
);

CREATE TABLE order_items (
    item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    price REAL NOT NULL CHECK(price >= 0),
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);
```

### Data Types in SQLite

SQLite uses a dynamic type system that's different from most other SQL databases. It has only five basic data types:

| Data Type | Description | Examples |
|-----------|-------------|----------|
| NULL | Null value | NULL |
| INTEGER | Signed integer | 1, -1, 100 |
| REAL | Floating point value | 3.14, -2.5 |
| TEXT | Text string | 'hello', "world" |
| BLOB | Binary data | [binary data] |

SQLite also supports the concept of "type affinity," which means columns can be declared using types from other database systems, and SQLite will map them to one of its five basic types.

## Working with Data

### Inserting Data

```sql
-- Insert a single row
INSERT INTO products (name, description, price, category, stock_quantity)
VALUES ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 24.99, 'Computer Accessories', 50);

-- Insert multiple rows
INSERT INTO products (name, price, category, stock_quantity) VALUES
    ('USB-C Cable', 12.99, 'Cables', 100),
    ('Wireless Keyboard', 49.99, 'Computer Accessories', 30),
    ('HDMI Cable', 9.99, 'Cables', 75);
```

### Querying Data

```sql
-- Select all products
SELECT * FROM products;

-- Select specific columns
SELECT name, price, stock_quantity FROM products;

-- Filtering with WHERE
SELECT name, price FROM products WHERE category = 'Cables';

-- Sorting results
SELECT name, price FROM products ORDER BY price DESC;

-- Limiting results
SELECT name, price FROM products ORDER BY price LIMIT 3;

-- Aggregation functions
SELECT category, COUNT(*) as item_count, AVG(price) as avg_price, SUM(stock_quantity) as total_stock
FROM products
GROUP BY category;
```

### Updating Data

```sql
-- Update a single row
UPDATE products
SET price = 22.99, stock_quantity = 45
WHERE product_id = 1;

-- Update multiple rows
UPDATE products
SET price = price * 0.9
WHERE category = 'Cables';
```

### Deleting Data

```sql
-- Delete a specific row
DELETE FROM products WHERE product_id = 3;

-- Delete multiple rows
DELETE FROM products WHERE stock_quantity = 0;

-- Delete all rows
DELETE FROM products;
```

## SQLite-Specific Features

### Pragmas

SQLite provides special commands called "pragmas" to control the operation of the database engine:

```sql
-- Show foreign keys status
PRAGMA foreign_keys;

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Get database information
PRAGMA database_list;

-- Show compile options
PRAGMA compile_options;

-- Get table information
PRAGMA table_info(products);

-- Set journal mode
PRAGMA journal_mode = WAL;
```

### Using SQLite in Memory

SQLite can create and operate on an in-memory database, which is useful for testing or temporary operations:

```python
# Python example
import sqlite3
conn = sqlite3.connect(':memory:')
```

```sql
-- SQL in CLI
sqlite3 :memory:
```

### Attaching Databases

SQLite allows you to attach multiple database files to the same connection:

```sql
-- Attach a database
ATTACH DATABASE 'archive.db' AS archive;

-- Query from the attached database
SELECT * FROM archive.products;

-- Detach the database
DETACH DATABASE archive;
```

## Transactions

SQLite supports full transaction control:

```sql
-- Begin a transaction
BEGIN TRANSACTION;

-- Perform operations
INSERT INTO orders (customer_name) VALUES ('John Doe');
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (last_insert_rowid(), 1, 2, 24.99);
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE product_id = 1;

-- Commit the transaction
COMMIT;

-- Or roll back in case of error
-- ROLLBACK;
```

## Backup and Migration

### Backing Up an SQLite Database

The simplest way to back up an SQLite database is to copy the database file when it's not in use. For active databases, SQLite provides several options:

**Using the CLI:**
```bash
sqlite3 my_database.db .dump > backup.sql
```

**Using SQL:**
```sql
-- Create a backup via SQL
VACUUM INTO 'backup.db';
```

**Using the Backup API in code:**
```python
# Python example
import sqlite3

source = sqlite3.connect('my_database.db')
dest = sqlite3.connect('backup.db')
source.backup(dest)
source.close()
dest.close()
```

### Migrating Schema

SQLite doesn't support `ALTER TABLE` for all operations (like dropping columns). A common pattern for schema migration is:

1. Create a new table with the desired schema
2. Copy data from the old table to the new one
3. Drop the old table
4. Rename the new table to the original name

```sql
BEGIN TRANSACTION;

-- Create a new table with the desired schema
CREATE TABLE products_new (
    product_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    -- Note: we're removing the description column
);

-- Copy data from the old table to the new one
INSERT INTO products_new (product_id, name, price, category, stock_quantity, created_at)
SELECT product_id, name, price, category, stock_quantity, created_at
FROM products;

-- Drop the old table
DROP TABLE products;

-- Rename the new table to the original name
ALTER TABLE products_new RENAME TO products;

COMMIT;
```

## Performance Optimization

### Indexing

Indexes can dramatically improve query performance, especially for large tables:

```sql
-- Create an index on a single column
CREATE INDEX idx_products_category ON products(category);

-- Create an index on multiple columns
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- Create a unique index
CREATE UNIQUE INDEX idx_products_name ON products(name);

-- Drop an index
DROP INDEX idx_products_category;
```

### Analyzing Queries

SQLite provides the EXPLAIN command to understand how queries are executed:

```sql
-- See the query plan
EXPLAIN QUERY PLAN
SELECT * FROM products WHERE category = 'Cables';
```

### Optimizing SQLite Settings

```sql
-- Speed up operations by using memory for temporary storage
PRAGMA temp_store = MEMORY;

-- Enable memory-mapped I/O for database files
PRAGMA mmap_size = 30000000000;

-- Set journal mode to WAL for better concurrency
PRAGMA journal_mode = WAL;

-- Control synchronization behavior (reduces durability but increases speed)
PRAGMA synchronous = NORMAL;

-- Set cache size (in pages)
PRAGMA cache_size = 10000;
```

## Using SQLite with Popular Frameworks

### Node.js

```javascript
// Using better-sqlite3 (recommended for performance)
const Database = require('better-sqlite3');
const db = new Database('inventory.db');

// Prepare a query
const statement = db.prepare('SELECT * FROM products WHERE category = ?');

// Execute the query
const products = statement.all('Cables');
console.log(products);

// Execute a transaction
const addOrder = db.transaction((customer, items) => {
    const orderStmt = db.prepare('INSERT INTO orders (customer_name) VALUES (?)');
    const orderItemStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    const updateStmt = db.prepare('UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?');
    
    const orderId = orderStmt.run(customer).lastInsertRowid;
    
    for (const item of items) {
        orderItemStmt.run(orderId, item.productId, item.quantity, item.price);
        updateStmt.run(item.quantity, item.productId);
    }
    
    return orderId;
});

// Use the transaction
const orderId = addOrder('Jane Smith', [
    { productId: 1, quantity: 2, price: 24.99 },
    { productId: 2, quantity: 1, price: 12.99 }
]);
```

### Python

```python
import sqlite3

# Connect to database
conn = sqlite3.connect('inventory.db')

# Create a cursor
cursor = conn.cursor()

# Execute a query
cursor.execute('SELECT * FROM products WHERE category = ?', ('Cables',))
products = cursor.fetchall()
print(products)

# Insert data
cursor.execute('INSERT INTO products (name, price, category, stock_quantity) VALUES (?, ?, ?, ?)',
              ('Bluetooth Speaker', 39.99, 'Audio', 25))
conn.commit()

# Use a transaction
try:
    conn.execute('BEGIN')
    
    # Add an order
    cursor.execute('INSERT INTO orders (customer_name) VALUES (?)', ('Alice Johnson',))
    order_id = cursor.lastrowid
    
    # Add order items
    items = [
        (order_id, 1, 1, 24.99),
        (order_id, 4, 2, 39.99)
    ]
    cursor.executemany('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', items)
    
    # Update stock
    cursor.execute('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE product_id = 1')
    cursor.execute('UPDATE products SET stock_quantity = stock_quantity - 2 WHERE product_id = 4')
    
    conn.execute('COMMIT')
except Exception as e:
    conn.execute('ROLLBACK')
    print(f"Error: {e}")

# Close the connection
conn.close()
```

### C# (.NET)

```csharp
using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;

// Connect to database
var connectionString = "Data Source=inventory.db";
using var connection = new SqliteConnection(connectionString);
connection.Open();

// Query data
using (var command = connection.CreateCommand())
{
    command.CommandText = "SELECT * FROM products WHERE category = $category";
    command.Parameters.AddWithValue("$category", "Cables");
    
    using var reader = command.ExecuteReader();
    while (reader.Read())
    {
        Console.WriteLine($"Product: {reader.GetString(1)}, Price: {reader.GetDouble(3)}");
    }
}

// Insert data
using (var command = connection.CreateCommand())
{
    command.CommandText = @"
        INSERT INTO products (name, price, category, stock_quantity) 
        VALUES ($name, $price, $category, $stock)";
    command.Parameters.AddWithValue("$name", "Wireless Earbuds");
    command.Parameters.AddWithValue("$price", 59.99);
    command.Parameters.AddWithValue("$category", "Audio");
    command.Parameters.AddWithValue("$stock", 15);
    
    int rowsAffected = command.ExecuteNonQuery();
    Console.WriteLine($"Rows inserted: {rowsAffected}");
}

// Transaction example
using (var transaction = connection.BeginTransaction())
{
    try
    {
        // Add an order
        using (var orderCmd = connection.CreateCommand())
        {
            orderCmd.Transaction = transaction;
            orderCmd.CommandText = "INSERT INTO orders (customer_name) VALUES ($name)";
            orderCmd.Parameters.AddWithValue("$name", "Bob Miller");
            orderCmd.ExecuteNonQuery();
        }
        
        // Get the order ID
        long orderId;
        using (var idCmd = connection.CreateCommand())
        {
            idCmd.Transaction = transaction;
            idCmd.CommandText = "SELECT last_insert_rowid()";
            orderId = (long)idCmd.ExecuteScalar();
        }
        
        // Add order items and update stock
        using (var itemCmd = connection.CreateCommand())
        {
            itemCmd.Transaction = transaction;
            itemCmd.CommandText = @"
                INSERT INTO order_items (order_id, product_id, quantity, price) 
                VALUES ($orderId, $productId, $quantity, $price)";
            itemCmd.Parameters.AddWithValue("$orderId", orderId);
            itemCmd.Parameters.AddWithValue("$productId", 2);
            itemCmd.Parameters.AddWithValue("$quantity", 3);
            itemCmd.Parameters.AddWithValue("$price", 12.99);
            itemCmd.ExecuteNonQuery();
        }
        
        using (var updateCmd = connection.CreateCommand())
        {
            updateCmd.Transaction = transaction;
            updateCmd.CommandText = @"
                UPDATE products 
                SET stock_quantity = stock_quantity - $quantity 
                WHERE product_id = $productId";
            updateCmd.Parameters.AddWithValue("$quantity", 3);
            updateCmd.Parameters.AddWithValue("$productId", 2);
            updateCmd.ExecuteNonQuery();
        }
        
        transaction.Commit();
        Console.WriteLine("Transaction completed successfully");
    }
    catch (Exception ex)
    {
        transaction.Rollback();
        Console.WriteLine($"Transaction failed: {ex.Message}");
    }
}
```

## Best Practices

1. **Use Transactions** for operations that need to be atomic
2. **Create Appropriate Indexes** for frequently queried columns
3. **Set Foreign Keys Pragma** to ON for data integrity
4. **Use Prepared Statements** to prevent SQL injection
5. **Close Connections** when done to free up resources
6. **Backup Regularly** to prevent data loss
7. **Use WAL Journal Mode** for better concurrency
8. **Limit Database Size** to keep performance optimal (usually under 1GB)
9. **Avoid Large Transactions** that lock the database for extended periods
10. **Use the Latest SQLite Version** for bug fixes and performance improvements

## Exercises

Complete the following exercises to practice your SQLite skills:

1. Create a database for a simple task management application with tasks, categories, and user tables
2. Write a script to insert sample data into your task management database
3. Create appropriate indexes to optimize common queries
4. Implement a transaction that moves tasks between different status categories
5. Write a migration script to add a new column to an existing table

## Additional Resources

- [SQLite Official Documentation](https://sqlite.org/docs.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [DB Browser for SQLite](https://sqlitebrowser.org/) - A visual tool to work with SQLite databases
- [SQLite Online IDE](https://sqliteonline.com/) - Test SQLite queries in your browser
- [Better SQLite3 Documentation](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md) - For Node.js developers
- [Microsoft.Data.Sqlite Documentation](https://docs.microsoft.com/en-us/dotnet/standard/data/sqlite/) - For .NET developers
