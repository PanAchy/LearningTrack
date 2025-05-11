# C# Basics

## Introduction

C# (pronounced "C-sharp") is a modern, object-oriented programming language developed by Microsoft. It was designed for building a variety of applications that run on the .NET Framework and .NET Core/.NET 5+. C# is widely used for developing desktop applications, web applications, web services, and increasingly, cloud-based services. For developers building internal tools, C# offers a robust, type-safe language with excellent tooling support. This lesson covers the fundamental concepts and features of C#.

## Why C#?

C# offers several benefits for internal tool development:

1. **Strong Type System**: Catches errors at compile-time rather than runtime
2. **Modern Language Features**: LINQ, async/await, pattern matching, and more
3. **Extensive Framework**: Rich standard library and ecosystem of packages
4. **Cross-Platform Support**: Runs on Windows, macOS, and Linux via .NET Core/.NET 5+
5. **Excellent Tooling**: Outstanding IDE support with Visual Studio and Visual Studio Code
6. **Integration with Microsoft Ecosystem**: Seamless interaction with SQL Server, Azure, and other Microsoft technologies
7. **Scalability**: Easily scales from small tools to enterprise applications

## Getting Started with C#

### Setting Up Your Environment

To start developing with C#, you'll need to install:

1. **.NET SDK**: Download from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)
2. **IDE/Code Editor**: 
   - Visual Studio: Full-featured IDE (Windows, macOS)
   - Visual Studio Code: Lightweight editor with C# extension
   - JetBrains Rider: Cross-platform C# IDE

### Creating Your First C# Program

Once you have the .NET SDK installed, you can create a new console application:

```bash
# Create a new console application
dotnet new console -n MyFirstApp

# Navigate to the project directory
cd MyFirstApp

# Run the application
dotnet run
```

This creates a basic "Hello World" program:

```csharp
// Program.cs
namespace MyFirstApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

In newer versions of .NET (6.0+), the template is even simpler:

```csharp
// Program.cs
Console.WriteLine("Hello World!");
```

## C# Fundamentals

### Basic Syntax and Structure

C# programs typically have the following structure:

- **Namespaces**: Containers for classes and other namespaces
- **Classes/Types**: Blueprints for objects
- **Methods**: Functions that perform operations
- **Statements**: Individual instructions that perform actions

```csharp
// Namespace declaration
namespace MyApp
{
    // Class declaration
    class Program
    {
        // Main method - entry point of the program
        static void Main(string[] args)
        {
            // Statement
            Console.WriteLine("Hello, C#!");
        }
    }
}
```

### Variables and Data Types

C# is a statically typed language, meaning you must declare the type of each variable:

```csharp
// Value types
int age = 30;                  // 32-bit integer
long bigNumber = 9223372036854775807L;  // 64-bit integer
float price = 19.99f;          // 32-bit floating point
double preciseValue = 19.99d;  // 64-bit floating point
decimal moneyAmount = 19.99m;  // 128-bit precise decimal
bool isActive = true;          // Boolean (true/false)
char grade = 'A';              // Single character

// Reference types
string name = "John Smith";    // String (sequence of characters)
object obj = new object();     // Base type for all other types
dynamic dynamicVar = 42;       // Type determined at runtime

// Arrays
int[] numbers = { 1, 2, 3, 4, 5 };
string[] fruits = new string[3] { "Apple", "Banana", "Cherry" };

// Nullable types (can have null value)
int? nullableInt = null;
```

### Type Conversion

```csharp
// Implicit conversion (safe, no data loss)
int num = 100;
long bigNum = num;  // int to long

// Explicit conversion (cast) - potential data loss
double d = 123.45;
int i = (int)d;  // Truncates to 123

// Convert class
string numStr = "42";
int parsed = Convert.ToInt32(numStr);

// TryParse pattern (safe parsing)
if (int.TryParse(numStr, out int result))
{
    Console.WriteLine($"Parsed value: {result}");
}
else
{
    Console.WriteLine("Failed to parse");
}
```

### Operators

C# supports a variety of operators:

```csharp
// Arithmetic operators
int sum = 5 + 3;        // Addition (8)
int difference = 5 - 3;  // Subtraction (2)
int product = 5 * 3;     // Multiplication (15)
int quotient = 10 / 3;   // Division (3, integer division)
int remainder = 10 % 3;  // Modulus (1)

// Increment/decrement
int x = 5;
x++;  // Increment (6)
x--;  // Decrement (5)

// Assignment operators
int y = 10;
y += 5;  // Same as: y = y + 5

// Comparison operators
bool isEqual = (5 == 5);        // Equal to (true)
bool isNotEqual = (5 != 3);     // Not equal to (true)
bool isGreater = (5 > 3);       // Greater than (true)
bool isLess = (5 < 3);          // Less than (false)
bool isGreaterOrEqual = (5 >= 5); // Greater than or equal to (true)
bool isLessOrEqual = (5 <= 3);  // Less than or equal to (false)

// Logical operators
bool andResult = (true && false);  // Logical AND (false)
bool orResult = (true || false);   // Logical OR (true)
bool notResult = !true;            // Logical NOT (false)

// Null-conditional operators (C# 6+)
string name = null;
int? length = name?.Length;  // Null if name is null

// Null-coalescing operator
string displayName = name ?? "Unknown";  // "Unknown" if name is null

// Null-coalescing assignment (C# 8+)
name ??= "John";  // Assigns "John" if name is null
```

### Control Flow

#### Conditional Statements

```csharp
// If statement
int age = 20;
if (age >= 18)
{
    Console.WriteLine("Adult");
}
else if (age >= 13)
{
    Console.WriteLine("Teenager");
}
else
{
    Console.WriteLine("Child");
}

// Switch statement
string day = "Monday";
switch (day)
{
    case "Monday":
        Console.WriteLine("Start of work week");
        break;
    case "Friday":
        Console.WriteLine("End of work week");
        break;
    case "Saturday":
    case "Sunday":
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Midweek");
        break;
}

// Switch expression (C# 8+)
string description = day switch
{
    "Monday" => "Start of work week",
    "Friday" => "End of work week",
    "Saturday" or "Sunday" => "Weekend",
    _ => "Midweek"
};

// Ternary conditional operator
string status = (age >= 18) ? "Adult" : "Minor";
```

#### Loops

```csharp
// For loop
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);  // Prints 0 through 4
}

// While loop
int count = 0;
while (count < 5)
{
    Console.WriteLine(count);
    count++;
}

// Do-while loop (always executes at least once)
int num = 0;
do
{
    Console.WriteLine(num);
    num++;
} while (num < 5);

// Foreach loop (for collections)
string[] fruits = { "Apple", "Banana", "Cherry" };
foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}

// Break and continue
for (int i = 0; i < 10; i++)
{
    if (i == 3)
        continue;  // Skip the rest of this iteration
    
    if (i == 7)
        break;  // Exit the loop
    
    Console.WriteLine(i);  // Prints 0, 1, 2, 4, 5, 6
}
```

### Methods

Methods (or functions) in C# are defined inside classes:

```csharp
class Calculator
{
    // Basic method
    public int Add(int a, int b)
    {
        return a + b;
    }
    
    // Void method (returns nothing)
    public void PrintSum(int a, int b)
    {
        Console.WriteLine($"Sum: {a + b}");
    }
    
    // Method with optional parameters
    public int Multiply(int a, int b = 1, int c = 1)
    {
        return a * b * c;
    }
    
    // Method with output parameters
    public bool TryDivide(int a, int b, out int result)
    {
        if (b == 0)
        {
            result = 0;
            return false;
        }
        
        result = a / b;
        return true;
    }
    
    // Method with reference parameters
    public void Swap(ref int a, ref int b)
    {
        int temp = a;
        a = b;
        b = temp;
    }
    
    // Method with params array (variable number of arguments)
    public int Sum(params int[] numbers)
    {
        int total = 0;
        foreach (int num in numbers)
        {
            total += num;
        }
        return total;
    }
    
    // Expression-bodied method (C# 6+)
    public int Square(int x) => x * x;
    
    // Local function (C# 7+)
    public int Factorial(int n)
    {
        return CalculateFactorial(n);
        
        // Local function defined inside another method
        int CalculateFactorial(int number)
        {
            if (number <= 1) return 1;
            return number * CalculateFactorial(number - 1);
        }
    }
}

// Using the methods
Calculator calc = new Calculator();
int sum = calc.Add(5, 3);  // 8

// Optional parameters
int product1 = calc.Multiply(5);       // 5 * 1 * 1 = 5
int product2 = calc.Multiply(5, 3);    // 5 * 3 * 1 = 15
int product3 = calc.Multiply(5, 3, 2); // 5 * 3 * 2 = 30

// Named arguments (C# 4+)
int product4 = calc.Multiply(a: 5, c: 2);  // 5 * 1 * 2 = 10

// Output parameter
if (calc.TryDivide(10, 2, out int quotient))
{
    Console.WriteLine($"Result: {quotient}");  // 5
}

// Reference parameter
int x = 10, y = 20;
calc.Swap(ref x, ref y);  // x = 20, y = 10

// Params array
int total1 = calc.Sum(1, 2, 3, 4, 5);  // 15
int[] numbers = { 1, 2, 3, 4, 5 };
int total2 = calc.Sum(numbers);        // 15
```

### Exception Handling

Exception handling allows you to handle runtime errors gracefully:

```csharp
try
{
    // Code that might throw an exception
    int result = 10 / 0;  // DivideByZeroException
}
catch (DivideByZeroException ex)
{
    // Handle specific exception
    Console.WriteLine($"Division by zero error: {ex.Message}");
}
catch (Exception ex)
{
    // Handle any other exception
    Console.WriteLine($"An error occurred: {ex.Message}");
}
finally
{
    // Always executes, regardless of whether an exception occurred
    Console.WriteLine("Cleanup code here");
}

// Throwing exceptions
public void ValidateAge(int age)
{
    if (age < 0)
    {
        throw new ArgumentException("Age cannot be negative");
    }
    
    if (age > 120)
    {
        throw new ArgumentOutOfRangeException(nameof(age), "Age is unrealistically high");
    }
}

// Using a try block with multiple catch blocks
try
{
    ValidateAge(-5);
}
catch (ArgumentException ex) when (ex.Message.Contains("negative"))
{
    // Exception filter (C# 6+)
    Console.WriteLine("Negative age provided");
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine($"Out of range: {ex.Message}");
}
```

## Object-Oriented Programming in C#

C# is an object-oriented language that supports the following key concepts:

### 1. Classes and Objects

```csharp
// Class definition
class Person
{
    // Fields (data)
    private string _name;
    private int _age;
    
    // Properties (getters/setters)
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }
    
    // Auto-implemented property (C# 3+)
    public int Age { get; set; }
    
    // Read-only property
    public bool IsAdult => Age >= 18;
    
    // Constructor
    public Person(string name, int age)
    {
        _name = name;
        _age = age;
    }
    
    // Method
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {_name} and I'm {_age} years old.");
    }
}

// Creating objects
Person person1 = new Person("Alice", 30);
Person person2 = new Person("Bob", 25);

// Using objects
person1.Introduce();  // Hi, I'm Alice and I'm 30 years old.
person2.Name = "Robert";
Console.WriteLine(person2.IsAdult);  // True
```

### 2. Inheritance

```csharp
// Base class
class Animal
{
    public string Name { get; set; }
    
    public Animal(string name)
    {
        Name = name;
    }
    
    public virtual void MakeSound()
    {
        Console.WriteLine("Animal makes a sound");
    }
}

// Derived class
class Dog : Animal
{
    public string Breed { get; set; }
    
    // Constructor that calls the base class constructor
    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
    }
    
    // Override base class method
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
    
    // New method in derived class
    public void Fetch()
    {
        Console.WriteLine($"{Name} is fetching.");
    }
}

// Using inheritance
Animal animal = new Animal("Generic Animal");
animal.MakeSound();  // Animal makes a sound

Dog dog = new Dog("Buddy", "Golden Retriever");
dog.MakeSound();  // Woof!
dog.Fetch();      // Buddy is fetching.

// Polymorphism
Animal polymorphicDog = new Dog("Rex", "German Shepherd");
polymorphicDog.MakeSound();  // Woof! (calls the overridden method)
// polymorphicDog.Fetch();   // Error: Animal doesn't have Fetch method
```

### 3. Interfaces

```csharp
// Interface definition
interface IFlyable
{
    void Fly();
    
    // Default interface method (C# 8+)
    void Land()
    {
        Console.WriteLine("Landing normally");
    }
}

interface ISwimmable
{
    void Swim();
}

// Class implementing multiple interfaces
class Duck : Animal, IFlyable, ISwimmable
{
    public Duck(string name) : base(name) {}
    
    public override void MakeSound()
    {
        Console.WriteLine("Quack!");
    }
    
    public void Fly()
    {
        Console.WriteLine($"{Name} is flying.");
    }
    
    public void Swim()
    {
        Console.WriteLine($"{Name} is swimming.");
    }
}

// Using interfaces
Duck duck = new Duck("Donald");
duck.Fly();   // Donald is flying.
duck.Swim();  // Donald is swimming.

// Polymorphism with interfaces
IFlyable flyable = duck;
flyable.Fly();  // Donald is flying.

ISwimmable swimmable = duck;
swimmable.Swim();  // Donald is swimming.
```

### 4. Abstract Classes

```csharp
// Abstract class
abstract class Shape
{
    // Regular property
    public string Color { get; set; }
    
    // Constructor
    public Shape(string color)
    {
        Color = color;
    }
    
    // Abstract method (must be implemented by derived classes)
    public abstract double CalculateArea();
    
    // Regular method
    public void Display()
    {
        Console.WriteLine($"This is a {Color} shape with area {CalculateArea()}");
    }
}

// Concrete class derived from abstract class
class Circle : Shape
{
    public double Radius { get; set; }
    
    public Circle(string color, double radius) : base(color)
    {
        Radius = radius;
    }
    
    // Implementing the abstract method
    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public Rectangle(string color, double width, double height) : base(color)
    {
        Width = width;
        Height = height;
    }
    
    public override double CalculateArea()
    {
        return Width * Height;
    }
}

// Using abstract classes
// Shape shape = new Shape("Red");  // Error: Cannot instantiate abstract class
Circle circle = new Circle("Red", 5);
circle.Display();  // This is a Red shape with area 78.54...

Rectangle rectangle = new Rectangle("Blue", 4, 5);
rectangle.Display();  // This is a Blue shape with area 20
```

### 5. Encapsulation

```csharp
class BankAccount
{
    // Private fields (encapsulated data)
    private string _accountNumber;
    private decimal _balance;
    private static int _lastAccountNumber = 1000;
    
    // Constructor
    public BankAccount(decimal initialDeposit)
    {
        _accountNumber = GenerateAccountNumber();
        _balance = initialDeposit;
    }
    
    // Private method
    private string GenerateAccountNumber()
    {
        _lastAccountNumber++;
        return $"ACC{_lastAccountNumber}";
    }
    
    // Public properties (controlled access)
    public string AccountNumber => _accountNumber;  // Read-only
    public decimal Balance => _balance;  // Read-only
    
    // Public methods
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Deposit amount must be positive");
        }
        
        _balance += amount;
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Withdrawal amount must be positive");
        }
        
        if (amount > _balance)
        {
            return false;  // Insufficient funds
        }
        
        _balance -= amount;
        return true;
    }
}

// Using encapsulation
BankAccount account = new BankAccount(1000);
Console.WriteLine($"Account {account.AccountNumber} created with {account.Balance:C}");

account.Deposit(500);
Console.WriteLine($"New balance: {account.Balance:C}");  // $1,500.00

bool success = account.Withdraw(2000);
if (!success)
{
    Console.WriteLine("Withdrawal failed: Insufficient funds");
}
```

## Collections in C#

C# provides a variety of collection types to store and manipulate groups of objects:

### Arrays

```csharp
// Declaring and initializing an array
int[] numbers = new int[5];  // Array of 5 integers, all 0 by default

// Initializing with values
int[] primes = new int[] { 2, 3, 5, 7, 11 };
// or shorter
int[] primes = { 2, 3, 5, 7, 11 };

// Accessing elements
int firstPrime = primes[0];  // 2
primes[4] = 13;  // Modify element

// Multidimensional arrays
int[,] grid = new int[3, 2]  // 3 rows, 2 columns
{
    { 1, 2 },
    { 3, 4 },
    { 5, 6 }
};

int value = grid[1, 0];  // 3 (row 1, column 0)

// Jagged arrays (arrays of arrays)
int[][] jaggedArray = new int[3][];
jaggedArray[0] = new int[] { 1, 2, 3 };
jaggedArray[1] = new int[] { 4, 5 };
jaggedArray[2] = new int[] { 6, 7, 8, 9 };

int value = jaggedArray[2][3];  // 9
```

### Lists

```csharp
using System.Collections.Generic;

// Creating a List
List<string> names = new List<string>();

// Adding elements
names.Add("Alice");
names.Add("Bob");
names.Add("Charlie");

// Initializing with values
List<string> fruits = new List<string> { "Apple", "Banana", "Cherry" };

// Accessing elements
string first = fruits[0];  // Apple
fruits[1] = "Blueberry";   // Modify element

// Useful methods
fruits.AddRange(new[] { "Date", "Elderberry" });  // Add multiple elements
fruits.Insert(1, "Apricot");  // Insert at index
fruits.Remove("Cherry");      // Remove specific element
fruits.RemoveAt(0);           // Remove at index
bool hasDate = fruits.Contains("Date");  // Check if exists
int count = fruits.Count;     // Get number of elements
fruits.Sort();                // Sort the list
fruits.Clear();               // Remove all elements
```

### Dictionaries

```csharp
// Creating a Dictionary (key-value pairs)
Dictionary<string, int> ages = new Dictionary<string, int>();

// Adding elements
ages.Add("Alice", 30);
ages.Add("Bob", 25);
ages["Charlie"] = 35;  // Alternative syntax

// Initializing with values
Dictionary<string, string> capitals = new Dictionary<string, string>
{
    { "USA", "Washington D.C." },
    { "UK", "London" },
    { "France", "Paris" }
};

// Accessing elements
int bobAge = ages["Bob"];  // 25

// Safely accessing elements
if (ages.TryGetValue("Dave", out int daveAge))
{
    Console.WriteLine($"Dave is {daveAge} years old");
}
else
{
    Console.WriteLine("Dave not found");
}

// Checking if a key exists
if (capitals.ContainsKey("Germany"))
{
    Console.WriteLine($"Capital of Germany: {capitals["Germany"]}");
}

// Iterating through a dictionary
foreach (KeyValuePair<string, string> pair in capitals)
{
    Console.WriteLine($"Capital of {pair.Key}: {pair.Value}");
}

// Or using deconstruction (C# 7+)
foreach (var (country, capital) in capitals)
{
    Console.WriteLine($"Capital of {country}: {capital}");
}

// Useful properties and methods
int countryCount = capitals.Count;
capitals.Remove("France");
capitals.Clear();
```

### HashSet

```csharp
// Creating a HashSet (unique elements)
HashSet<int> numbers = new HashSet<int>();

// Adding elements
numbers.Add(1);
numbers.Add(2);
numbers.Add(3);
numbers.Add(1);  // Duplicate not added

// Initializing with values
HashSet<string> colors = new HashSet<string> { "Red", "Green", "Blue" };

// Set operations
HashSet<int> set1 = new HashSet<int> { 1, 2, 3, 4, 5 };
HashSet<int> set2 = new HashSet<int> { 3, 4, 5, 6, 7 };

// Union
set1.UnionWith(set2);  // set1 now contains 1, 2, 3, 4, 5, 6, 7

// Intersection
set1 = new HashSet<int> { 1, 2, 3, 4, 5 };
set1.IntersectWith(set2);  // set1 now contains 3, 4, 5

// Difference
set1 = new HashSet<int> { 1, 2, 3, 4, 5 };
set1.ExceptWith(set2);  // set1 now contains 1, 2

// Checking for subsets
bool isSubset = set1.IsSubsetOf(set2);
bool isProperSubset = set1.IsProperSubsetOf(set2);
```

### Queue and Stack

```csharp
// Queue (First-In-First-Out)
Queue<string> queue = new Queue<string>();
queue.Enqueue("First");
queue.Enqueue("Second");
queue.Enqueue("Third");

string next = queue.Dequeue();  // "First"
string peek = queue.Peek();     // "Second" (without removing)
int count = queue.Count;        // 2

// Stack (Last-In-First-Out)
Stack<string> stack = new Stack<string>();
stack.Push("First");
stack.Push("Second");
stack.Push("Third");

string top = stack.Pop();    // "Third"
string peek = stack.Peek();  // "Second" (without removing)
int count = stack.Count;     // 2
```

## LINQ (Language Integrated Query)

LINQ allows you to query collections using a SQL-like syntax:

```csharp
using System.Linq;

// Sample collection
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Query syntax
var evenNumbers = from num in numbers
                  where num % 2 == 0
                  select num;
// Result: 2, 4, 6, 8, 10

// Method syntax (more common)
var evenNumbers = numbers.Where(num => num % 2 == 0);

// More complex example with multiple operations
var processedNumbers = numbers
    .Where(n => n > 3)           // Filter: 4, 5, 6, 7, 8, 9, 10
    .OrderByDescending(n => n)   // Sort descending: 10, 9, 8, 7, 6, 5, 4
    .Select(n => n * 2);         // Transform: 20, 18, 16, 14, 12, 10, 8

// Common LINQ methods
var firstEven = numbers.First(n => n % 2 == 0);  // 2
var anyGreaterThan10 = numbers.Any(n => n > 10); // false
var allPositive = numbers.All(n => n > 0);       // true
var sum = numbers.Sum();                         // 55
var average = numbers.Average();                 // 5.5
var min = numbers.Min();                         // 1
var max = numbers.Max();                         // 10
var count = numbers.Count();                     // 10
var countEven = numbers.Count(n => n % 2 == 0);  // 5

// Grouping
var grouped = numbers.GroupBy(n => n % 3);
foreach (var group in grouped)
{
    Console.WriteLine($"Remainder when divided by 3 = {group.Key}:");
    foreach (var item in group)
    {
        Console.WriteLine($"  {item}");
    }
}

// ToList, ToArray, ToDictionary
List<int> evenList = evenNumbers.ToList();
int[] evenArray = evenNumbers.ToArray();
Dictionary<int, bool> evenDict = evenNumbers.ToDictionary(n => n, n => n > 5);

// Complex LINQ example with object collections
class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
}

List<Product> products = new List<Product>
{
    new Product { Id = 1, Name = "Laptop", Price = 1200, Category = "Electronics" },
    new Product { Id = 2, Name = "Desk", Price = 400, Category = "Furniture" },
    new Product { Id = 3, Name = "Chair", Price = 100, Category = "Furniture" },
    new Product { Id = 4, Name = "Smartphone", Price = 800, Category = "Electronics" },
    new Product { Id = 5, Name = "Headphones", Price = 200, Category = "Electronics" }
};

// Find expensive electronics
var expensiveElectronics = products
    .Where(p => p.Category == "Electronics" && p.Price > 500)
    .OrderBy(p => p.Price);
// Result: Smartphone, Laptop

// Average price by category
var averagePriceByCategory = products
    .GroupBy(p => p.Category)
    .Select(g => new 
    {
        Category = g.Key,
        AveragePrice = g.Average(p => p.Price)
    });

// Result:
// Electronics: 733.33
// Furniture: 250
```

## File I/O Operations

C# provides several ways to work with files and directories:

```csharp
using System.IO;

// Reading an entire file
string content = File.ReadAllText("file.txt");

// Reading lines of a file
string[] lines = File.ReadAllLines("file.txt");

// Writing to a file
File.WriteAllText("output.txt", "Hello, World!");
File.WriteAllLines("output.txt", new[] { "Line 1", "Line 2", "Line 3" });

// Appending to a file
File.AppendAllText("log.txt", "New log entry\n");

// Reading/writing binary data
byte[] data = File.ReadAllBytes("image.jpg");
File.WriteAllBytes("copy.jpg", data);

// Using streams for more control
using (StreamReader reader = new StreamReader("input.txt"))
{
    string line;
    while ((line = reader.ReadLine()) != null)
    {
        Console.WriteLine(line);
    }
}

using (StreamWriter writer = new StreamWriter("output.txt"))
{
    writer.WriteLine("Line 1");
    writer.WriteLine("Line 2");
}

// Working with file paths
string directory = Path.GetDirectoryName("C:\\Folder\\file.txt");  // C:\Folder
string filename = Path.GetFileName("C:\\Folder\\file.txt");       // file.txt
string extension = Path.GetExtension("C:\\Folder\\file.txt");     // .txt
string withoutExt = Path.GetFileNameWithoutExtension("file.txt"); // file
string combined = Path.Combine("C:\\Folder", "file.txt");         // C:\Folder\file.txt

// Directory operations
string[] files = Directory.GetFiles("C:\\Folder");                // Get all files
string[] subdirs = Directory.GetDirectories("C:\\Folder");        // Get all subdirectories
bool exists = Directory.Exists("C:\\Folder");                     // Check if directory exists
Directory.CreateDirectory("C:\\NewFolder");                       // Create directory
Directory.Delete("C:\\TempFolder", true);                         // Delete directory (true = recursive)

// File operations
bool fileExists = File.Exists("file.txt");                        // Check if file exists
File.Copy("source.txt", "destination.txt", true);                 // Copy file (true = overwrite)
File.Move("oldname.txt", "newname.txt");                          // Move/rename file
File.Delete("file.txt");                                          // Delete file
```

## Asynchronous Programming

C# provides excellent support for asynchronous programming with the async/await pattern:

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;

// Async method
public async Task<string> DownloadWebpageAsync(string url)
{
    // Create HttpClient
    using (HttpClient client = new HttpClient())
    {
        // Await the asynchronous operation
        string content = await client.GetStringAsync(url);
        return content;
    }
}

// Using async methods
public async Task ProcessDataAsync()
{
    Console.WriteLine("Starting download...");
    
    // Await the asynchronous method
    string content = await DownloadWebpageAsync("https://example.com");
    
    Console.WriteLine($"Downloaded {content.Length} characters");
    
    // Process the content
    // ...
    
    Console.WriteLine("Processing complete");
}

// Running multiple async operations in parallel
public async Task DownloadMultiplePagesAsync()
{
    // Start multiple downloads simultaneously
    Task<string> task1 = DownloadWebpageAsync("https://example.com");
    Task<string> task2 = DownloadWebpageAsync("https://microsoft.com");
    Task<string> task3 = DownloadWebpageAsync("https://github.com");
    
    // Wait for all to complete
    string[] results = await Task.WhenAll(task1, task2, task3);
    
    Console.WriteLine($"Downloaded {results.Length} pages");
    
    // Or process results as they complete
    Task<string> firstCompleted = await Task.WhenAny(task1, task2, task3);
    Console.WriteLine($"First completed: {firstCompleted.Result.Substring(0, 50)}...");
}

// Error handling in async methods
public async Task DownloadWithErrorHandlingAsync()
{
    try
    {
        string content = await DownloadWebpageAsync("https://example.com/nonexistent");
        Console.WriteLine("Downloaded successfully");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Download failed: {ex.Message}");
    }
    finally
    {
        Console.WriteLine("Operation completed (success or failure)");
    }
}

// Async method with cancellation support
public async Task DownloadWithCancellationAsync(CancellationToken cancellationToken)
{
    using (HttpClient client = new HttpClient())
    {
        // Pass the cancellation token to the async operation
        string content = await client.GetStringAsync("https://example.com", cancellationToken);
        return content;
    }
}

// Using cancellation
public async Task DemoWithCancellationAsync()
{
    // Create cancellation token source
    using (CancellationTokenSource cts = new CancellationTokenSource())
    {
        // Cancel after 5 seconds
        cts.CancelAfter(TimeSpan.FromSeconds(5));
        
        try
        {
            // Pass the token to the async method
            string content = await DownloadWithCancellationAsync(cts.Token);
            Console.WriteLine("Download successful");
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation was canceled");
        }
    }
}
```

## C# Best Practices

### 1. Naming Conventions

```csharp
// Classes, methods, properties: PascalCase
public class CustomerService
{
    public void ProcessOrder(Order order) { ... }
    public string FullName { get; set; }
}

// Local variables, parameters: camelCase
public void CalculateTotal(decimal subTotal)
{
    decimal taxRate = 0.08m;
    decimal total = subTotal * (1 + taxRate);
}

// Interfaces: I prefix + PascalCase
public interface IPaymentProcessor
{
    void ProcessPayment(Payment payment);
}

// Private fields: _ prefix + camelCase
private readonly _logger;

// Constants: All uppercase with underscores
const int MAX_RETRY_COUNT = 3;
```

### 2. Exception Handling

```csharp
// Only catch exceptions you can actually handle
try
{
    ProcessFile(filename);
}
catch (FileNotFoundException ex)
{
    // Specific exception handling
    LogError(ex);
    ShowUserFriendlyMessage("File not found. Please check the file path.");
}
catch (UnauthorizedAccessException ex)
{
    // Specific exception handling
    LogError(ex);
    ShowUserFriendlyMessage("You don't have permission to access this file.");
}
catch (Exception ex)
{
    // General exception handling as last resort
    LogError(ex);
    ShowUserFriendlyMessage("An unexpected error occurred.");
    
    // Consider rethrowing for critical errors
    // throw;
}

// Avoid empty catch blocks
try
{
    DoSomething();
}
catch (Exception ex)
{
    // Don't do this:
    // catch { }
    
    // Instead, at least log the error:
    Log.Error(ex, "Error in DoSomething");
}

// Use exception filtering when appropriate (C# 6+)
try
{
    ProcessData();
}
catch (Exception ex) when (ex.Message.Contains("connection"))
{
    // Only handle connection-related exceptions
    ReconnectAndRetry();
}
catch (Exception ex) when (IsRecoverable(ex))
{
    // Handle recoverable errors
    AttemptRecovery();
}
```

### 3. Resource Management

```csharp
// Use 'using' statement for disposable resources
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();
    // Use the connection...
} // Automatically disposed when block exits

// Using declaration (C# 8+)
using SqlConnection connection = new SqlConnection(connectionString);
connection.Open();
// Use the connection...
// Disposed at the end of the enclosing scope

// Implement IDisposable properly for your own classes
public class ResourceManager : IDisposable
{
    private bool _disposed = false;
    private FileStream _fileStream;
    
    public ResourceManager(string filename)
    {
        _fileStream = new FileStream(filename, FileMode.Open);
    }
    
    // Public dispose method
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
    
    // Protected virtual dispose method
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // Dispose managed resources
                _fileStream?.Dispose();
            }
            
            // Free unmanaged resources
            // Set large fields to null
            _fileStream = null;
            
            _disposed = true;
        }
    }
    
    // Finalizer
    ~ResourceManager()
    {
        Dispose(false);
    }
}
```

### 4. SOLID Principles

```csharp
// Single Responsibility Principle
// A class should have only one reason to change
public class CustomerRepository
{
    // Only handles data access for customers
    public Customer GetById(int id) { ... }
    public void Save(Customer customer) { ... }
}

public class CustomerValidator
{
    // Only handles customer validation
    public bool IsValid(Customer customer) { ... }
}

// Open/Closed Principle
// Open for extension, closed for modification
public abstract class Shape
{
    public abstract double CalculateArea();
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public override double CalculateArea() => Width * Height;
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public override double CalculateArea() => Math.PI * Radius * Radius;
}

// Adding a new shape doesn't require modifying existing code
public class Triangle : Shape
{
    public double Base { get; set; }
    public double Height { get; set; }
    
    public override double CalculateArea() => 0.5 * Base * Height;
}

// Liskov Substitution Principle
// Derived classes must be substitutable for their base classes
public void CalculateAreas(List<Shape> shapes)
{
    foreach (Shape shape in shapes)
    {
        // Should work with any Shape subclass
        double area = shape.CalculateArea();
        Console.WriteLine($"Area: {area}");
    }
}

// Interface Segregation Principle
// Many specific interfaces are better than one general-purpose interface
// Bad approach: one large interface
public interface IEmployee
{
    void CalculateSalary();
    void CalculateHours();
    void CalculateInsurance();
    void CalculateRetirement();
}

// Better approach: segregated interfaces
public interface ISalaried
{
    void CalculateSalary();
}

public interface ITimeTracking
{
    void CalculateHours();
}

public interface IInsured
{
    void CalculateInsurance();
}

// Classes only implement what they need
public class FullTimeEmployee : ISalaried, ITimeTracking, IInsured { ... }
public class Contractor : ISalaried, ITimeTracking { ... } // No insurance

// Dependency Inversion Principle
// Depend on abstractions, not concretions
// Bad approach: depending on concrete implementation
public class OrderProcessor
{
    private SqlCustomerRepository _repository;
    
    public OrderProcessor()
    {
        _repository = new SqlCustomerRepository();
    }
}

// Better approach: depending on abstraction
public class OrderProcessor
{
    private readonly ICustomerRepository _repository;
    
    // Dependency injection
    public OrderProcessor(ICustomerRepository repository)
    {
        _repository = repository;
    }
}
```

### 5. Immutability

```csharp
// Immutable class
public class ImmutablePerson
{
    // Read-only properties
    public string FirstName { get; }
    public string LastName { get; }
    public DateTime DateOfBirth { get; }
    
    // Constructor initializes all values
    public ImmutablePerson(string firstName, string lastName, DateTime dateOfBirth)
    {
        FirstName = firstName;
        LastName = lastName;
        DateOfBirth = dateOfBirth;
    }
    
    // Methods that would modify state instead return a new instance
    public ImmutablePerson WithFirstName(string newFirstName)
    {
        return new ImmutablePerson(newFirstName, LastName, DateOfBirth);
    }
    
    public ImmutablePerson WithLastName(string newLastName)
    {
        return new ImmutablePerson(FirstName, newLastName, DateOfBirth);
    }
}

// Using an immutable class
ImmutablePerson person = new ImmutablePerson("John", "Doe", new DateTime(1980, 1, 1));
// person.FirstName = "Jane"; // Error: property is read-only

// Create a new instance with modified properties
ImmutablePerson updatedPerson = person.WithFirstName("Jane");

// Record types (C# 9+) provide built-in immutability
public record Person(string FirstName, string LastName, DateTime DateOfBirth);

// Using a record
Person personRecord = new Person("John", "Doe", new DateTime(1980, 1, 1));
// With-expressions create a new instance with modified properties
Person updatedRecord = personRecord with { FirstName = "Jane" };
```

## Common Libraries and Frameworks

### 1. Entity Framework Core

Entity Framework Core is a popular Object-Relational Mapping (ORM) framework for .NET:

```csharp
// Define a DbContext
public class ApplicationDbContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("ConnectionString");
    }
}

// Define entity classes
public class Customer
{
    public int CustomerId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    
    // Navigation property
    public List<Order> Orders { get; set; }
}

public class Order
{
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    
    // Foreign key
    public int CustomerId { get; set; }
    
    // Navigation property
    public Customer Customer { get; set; }
}

// Using Entity Framework Core
using (var context = new ApplicationDbContext())
{
    // Query data
    var customers = context.Customers
        .Where(c => c.Orders.Any(o => o.TotalAmount > 1000))
        .Include(c => c.Orders)
        .ToList();
    
    // Insert data
    var newCustomer = new Customer { Name = "Alice", Email = "alice@example.com" };
    context.Customers.Add(newCustomer);
    
    // Update data
    var customer = context.Customers.Find(1);
    if (customer != null)
    {
        customer.Email = "newemail@example.com";
    }
    
    // Delete data
    var orderToDelete = context.Orders.Find(1);
    if (orderToDelete != null)
    {
        context.Orders.Remove(orderToDelete);
    }
    
    // Save changes
    context.SaveChanges();
}
```

### 2. ASP.NET Core

ASP.NET Core is a cross-platform, high-performance framework for building web applications:

```csharp
// Program.cs in ASP.NET Core 6+
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ICustomerService, CustomerService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

// API Controller
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    
    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        var customers = await _customerService.GetAllAsync();
        return Ok(customers);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await _customerService.GetByIdAsync(id);
        
        if (customer == null)
        {
            return NotFound();
        }
        
        return Ok(customer);
    }
    
    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer(CustomerDto customerDto)
    {
        var customer = await _customerService.CreateAsync(customerDto);
        
        return CreatedAtAction(
            nameof(GetCustomer),
            new { id = customer.Id },
            customer);
    }
}
```

### 3. Dependency Injection

.NET Core has built-in dependency injection:

```csharp
// Service interface
public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}

// Service implementation
public class SmtpEmailService : IEmailService
{
    private readonly SmtpClient _smtpClient;
    
    public SmtpEmailService(IConfiguration configuration)
    {
        _smtpClient = new SmtpClient
        {
            Host = configuration["Smtp:Host"],
            Port = int.Parse(configuration["Smtp:Port"]),
            EnableSsl = bool.Parse(configuration["Smtp:EnableSsl"]),
            Credentials = new NetworkCredential(
                configuration["Smtp:Username"],
                configuration["Smtp:Password"])
        };
    }
    
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var message = new MailMessage
        {
            From = new MailAddress("noreply@example.com"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        
        message.To.Add(to);
        
        await _smtpClient.SendMailAsync(message);
    }
}

// Registering services in ASP.NET Core
public void ConfigureServices(IServiceCollection services)
{
    // Singleton: One instance for the entire application
    services.AddSingleton<IGlobalConfig, GlobalConfig>();
    
    // Scoped: New instance for each request/scope
    services.AddScoped<ICustomerService, CustomerService>();
    
    // Transient: New instance each time requested
    services.AddTransient<IEmailService, SmtpEmailService>();
}

// Using injected services in a controller
public class NotificationController : ControllerBase
{
    private readonly IEmailService _emailService;
    
    public NotificationController(IEmailService emailService)
    {
        _emailService = emailService;
    }
    
    [HttpPost("send-notification")]
    public async Task<IActionResult> SendNotification(NotificationRequest request)
    {
        await _emailService.SendEmailAsync(
            request.Email,
            "Notification",
            request.Message);
            
        return Ok();
    }
}
```

## C# for Internal Tools

C# is particularly well-suited for building internal tools. Here are some patterns and practices specific to internal tool development:

### 1. Configuration Management

```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=myserver;Database=mydb;Trusted_Connection=True;"
  },
  "AppSettings": {
    "ApiKey": "your-api-key",
    "MaxRetryCount": 3,
    "FeatureFlags": {
      "EnableNewDashboard": true,
      "UseNewReportingEngine": false
    }
  }
}

// Strongly-typed configuration
public class AppSettings
{
    public string ApiKey { get; set; }
    public int MaxRetryCount { get; set; }
    public FeatureFlags FeatureFlags { get; set; }
}

public class FeatureFlags
{
    public bool EnableNewDashboard { get; set; }
    public bool UseNewReportingEngine { get; set; }
}

// Configure in Program.cs
var builder = WebApplication.CreateBuilder(args);

// Bind configuration to strongly-typed classes
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings"));

// Inject configuration
public class ReportService
{
    private readonly AppSettings _settings;
    
    public ReportService(IOptions<AppSettings> settings)
    {
        _settings = settings.Value;
    }
    
    public void GenerateReport()
    {
        if (_settings.FeatureFlags.UseNewReportingEngine)
        {
            // Use new engine
        }
        else
        {
            // Use old engine
        }
    }
}
```

### 2. Logging

```csharp
// Setup logging in Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventLog();

// Configure Serilog (popular third-party logger)
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day));

// Using logger in a service
public class OrderProcessor
{
    private readonly ILogger<OrderProcessor> _logger;
    
    public OrderProcessor(ILogger<OrderProcessor> logger)
    {
        _logger = logger;
    }
    
    public void ProcessOrder(Order order)
    {
        _logger.LogInformation("Processing order {OrderId}", order.Id);
        
        try
        {
            // Process order
            _logger.LogDebug("Order details: {@Order}", order);
            
            // Log success
            _logger.LogInformation("Successfully processed order {OrderId}", order.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing order {OrderId}", order.Id);
            throw;
        }
    }
}
```

### 3. Background Processing

```csharp
// Hosted Service for background processing
public class DataProcessingService : BackgroundService
{
    private readonly ILogger<DataProcessingService> _logger;
    private readonly IServiceProvider _serviceProvider;
    
    public DataProcessingService(
        ILogger<DataProcessingService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Data Processing Service is starting.");
        
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Processing data...");
            
            try
            {
                // Create a scope to resolve scoped services
                using (var scope = _serviceProvider.CreateScope())
                {
                    var processor = scope.ServiceProvider.GetRequiredService<IDataProcessor>();
                    await processor.ProcessPendingItemsAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing data.");
            }
            
            // Wait for the next cycle
            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
        }
        
        _logger.LogInformation("Data Processing Service is stopping.");
    }
}

// Register the hosted service
builder.Services.AddHostedService<DataProcessingService>();
```

### 4. Building Interactive Console Applications

```csharp
// Simple menu system for a console application
public class ConsoleMenu
{
    private readonly Dictionary<string, Action> _menuItems = new Dictionary<string, Action>();
    
    public void AddMenuItem(string key, string description, Action action)
    {
        _menuItems.Add(key, action);
        Console.WriteLine($"{key}: {description}");
    }
    
    public void Start()
    {
        while (true)
        {
            Console.WriteLine("\nSelect an option (or 'q' to quit):");
            
            foreach (var item in _menuItems)
            {
                Console.WriteLine($"{item.Key}: {GetMenuDescription(item.Key)}");
            }
            
            string choice = Console.ReadLine().Trim().ToLower();
            
            if (choice == "q")
            {
                break;
            }
            
            if (_menuItems.TryGetValue(choice, out var action))
            {
                Console.Clear();
                action();
            }
            else
            {
                Console.WriteLine("Invalid option. Please try again.");
            }
        }
    }
    
    private string GetMenuDescription(string key)
    {
        // Implementation to get description from metadata
    }
}

// Using the menu system
public static void Main(string[] args)
{
    var menu = new ConsoleMenu();
    
    menu.AddMenuItem("1", "View All Customers", ViewCustomers);
    menu.AddMenuItem("2", "Add New Customer", AddCustomer);
    menu.AddMenuItem("3", "Generate Report", GenerateReport);
    
    menu.Start();
}
```

### 5. Data Import/Export

```csharp
// CSV Import
public class CsvImporter
{
    public IEnumerable<T> ImportFromCsv<T>(string filePath) where T : new()
    {
        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
        {
            return csv.GetRecords<T>().ToList();
        }
    }
}

// Excel Export using EPPlus
public class ExcelExporter
{
    public void ExportToExcel<T>(IEnumerable<T> data, string filePath)
    {
        // Get properties using reflection
        var properties = typeof(T).GetProperties()
            .Where(p => p.CanRead && !p.GetGetMethod().IsStatic);
        
        using (var package = new ExcelPackage())
        {
            var worksheet = package.Workbook.Worksheets.Add("Data");
            
            // Add headers
            int col = 1;
            foreach (var prop in properties)
            {
                worksheet.Cells[1, col].Value = prop.Name;
                col++;
            }
            
            // Add data
            int row = 2;
            foreach (var item in data)
            {
                col = 1;
                foreach (var prop in properties)
                {
                    worksheet.Cells[row, col].Value = prop.GetValue(item);
                    col++;
                }
                row++;
            }
            
            // Auto-fit columns
            worksheet.Cells.AutoFitColumns();
            
            // Save to file
            package.SaveAs(new FileInfo(filePath));
        }
    }
}
```

## Exercises

Complete the following exercises to practice your C# skills:

1. Create a simple console application that reads a CSV file, processes the data, and outputs a summary report

<details>
<summary>💡 Hint 1</summary>

Use the `File.ReadAllLines()` method to read the CSV file, then parse each line using `string.Split()`. Alternatively, you can use a library like CsvHelper for more robust parsing.
</details>

<details>
<summary>💡 Hint 2</summary>

Create a class to represent each row of data in the CSV file, then use LINQ to perform operations like grouping, filtering, and aggregating data for your summary report.
</details>

<details>
<summary>📝 Example Structure</summary>

```csharp
public class Program
{
    // Define a class to hold your CSV data
    public class SalesRecord
    {
        public string Region { get; set; }
        public string Product { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
    
    public static void Main(string[] args)
    {
        // 1. Read the CSV file
        string[] lines = File.ReadAllLines("sales.csv");
        
        // 2. Parse the data into objects (skip header row)
        List<SalesRecord> records = ParseRecords(lines.Skip(1));
        
        // 3. Process the data (e.g., calculate sales by region)
        var salesByRegion = records
            .GroupBy(r => r.Region)
            .Select(g => new {
                Region = g.Key,
                TotalSales = g.Sum(r => r.Amount)
            });
            
        // 4. Output the summary report
        Console.WriteLine("Sales Report");
        Console.WriteLine("============");
        
        foreach (var regionSales in salesByRegion.OrderByDescending(s => s.TotalSales))
        {
            Console.WriteLine($"{regionSales.Region}: {regionSales.TotalSales:C}");
        }
    }
    
    private static List<SalesRecord> ParseRecords(IEnumerable<string> lines)
    {
        List<SalesRecord> records = new List<SalesRecord>();
        
        foreach (string line in lines)
        {
            string[] fields = line.Split(',');
            
            records.Add(new SalesRecord
            {
                Region = fields[0],
                Product = fields[1],
                Amount = decimal.Parse(fields[2]),
                Date = DateTime.Parse(fields[3])
            });
        }
        
        return records;
    }
}
```
</details>

2. Build a class hierarchy for a company's organizational structure, using inheritance and polymorphism

<details>
<summary>💡 Hint 1</summary>

Start with a base `Employee` class that contains common properties and methods, then create derived classes for different employee types (e.g., `Manager`, `Developer`, `SalesRepresentative`).
</details>

<details>
<summary>💡 Hint 2</summary>

Use virtual methods in the base class that can be overridden in derived classes to implement polymorphic behavior, such as calculating salary or generating job descriptions.
</details>

<details>
<summary>📝 Example Structure</summary>

```csharp
// Base class
public abstract class Employee
{
    public string Name { get; set; }
    public string EmployeeId { get; set; }
    public DateTime HireDate { get; set; }
    
    // Common constructor
    protected Employee(string name, string employeeId, DateTime hireDate)
    {
        Name = name;
        EmployeeId = employeeId;
        HireDate = hireDate;
    }
    
    // Virtual methods for polymorphism
    public virtual decimal CalculateSalary() => 0;
    public virtual string GetJobDescription() => "Employee at the company";
    
    // Abstract method that must be implemented
    public abstract string GenerateReport();
}

// Derived classes
public class Manager : Employee
{
    public List<Employee> DirectReports { get; set; } = new List<Employee>();
    public string Department { get; set; }
    
    public Manager(string name, string employeeId, DateTime hireDate, string department)
        : base(name, employeeId, hireDate)
    {
        Department = department;
    }
    
    public override decimal CalculateSalary()
    {
        // Base salary plus bonus for each direct report
        return 100000 + (DirectReports.Count * 10000);
    }
    
    public override string GetJobDescription()
    {
        return $"Manager of the {Department} department with {DirectReports.Count} direct reports";
    }
    
    public override string GenerateReport()
    {
        return $"Management report for {Department} department";
    }
}

public class Developer : Employee
{
    public List<string> ProgrammingLanguages { get; set; } = new List<string>();
    public string Level { get; set; } // Junior, Mid, Senior
    
    public Developer(string name, string employeeId, DateTime hireDate, string level)
        : base(name, employeeId, hireDate)
    {
        Level = level;
    }
    
    public override decimal CalculateSalary()
    {
        // Base salary based on level
        decimal baseSalary = Level.ToLower() switch
        {
            "junior" => 70000,
            "mid" => 90000,
            "senior" => 120000,
            _ => 80000
        };
        
        // Bonus for each programming language
        return baseSalary + (ProgrammingLanguages.Count * 5000);
    }
    
    public override string GetJobDescription()
    {
        return $"{Level} Developer specializing in {string.Join(", ", ProgrammingLanguages)}";
    }
    
    public override string GenerateReport()
    {
        return $"Development report for {Name} ({Level})";
    }
}
```
</details>

3. Implement a generic repository pattern for data access, with CRUD operations

<details>
<summary>💡 Hint 1</summary>

Create an interface `IRepository<T>` that defines basic CRUD operations (Create, Read, Update, Delete) for entities of type T. Then implement this interface with a concrete class.
</details>

<details>
<summary>💡 Hint 2</summary>

To make the repository work with different entity types, use generic constraints to ensure that entities have a property that can serve as a primary key.
</details>

<details>
<summary>📝 Example Structure</summary>

```csharp
// Entity interface with ID property
public interface IEntity
{
    int Id { get; set; }
}

// Generic repository interface
public interface IRepository<T> where T : class, IEntity
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
    void SaveChanges();
}

// Generic repository implementation (using Entity Framework)
public class Repository<T> : IRepository<T> where T : class, IEntity
{
    protected readonly DbContext _context;
    protected readonly DbSet<T> _dbSet;
    
    public Repository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    
    public T GetById(int id)
    {
        return _dbSet.Find(id);
    }
    
    public IEnumerable<T> GetAll()
    {
        return _dbSet.ToList();
    }
    
    public void Add(T entity)
    {
        _dbSet.Add(entity);
    }
    
    public void Update(T entity)
    {
        _dbSet.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }
    
    public void Delete(int id)
    {
        T entity = _dbSet.Find(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }
    
    public void SaveChanges()
    {
        _context.SaveChanges();
    }
}

// Example entity
public class Customer : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

// Example usage
public class CustomerService
{
    private readonly IRepository<Customer> _customerRepository;
    
    public CustomerService(IRepository<Customer> customerRepository)
    {
        _customerRepository = customerRepository;
    }
    
    public void AddNewCustomer(string name, string email)
    {
        var customer = new Customer
        {
            Name = name,
            Email = email
        };
        
        _customerRepository.Add(customer);
        _customerRepository.SaveChanges();
    }
}
```
</details>

4. Create an asynchronous method that downloads data from multiple sources and aggregates the results

<details>
<summary>💡 Hint 1</summary>

Use `HttpClient` with the `async/await` pattern to download data from different APIs or web sources. Consider using the factory pattern (`IHttpClientFactory`) for proper HttpClient instance management.
</details>

<details>
<summary>💡 Hint 2</summary>

Use `Task.WhenAll()` to download from multiple sources concurrently, then combine the results after all downloads complete. This is more efficient than sequential downloads.
</details>

<details>
<summary>💡 Hint 3</summary>

Handling errors is important in asynchronous code. Use try/catch blocks appropriately, and consider implementing retry logic for transient failures.
</details>

<details>
<summary>📝 Example Structure</summary>

```csharp
public class DataAggregator
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<DataAggregator> _logger;
    
    public DataAggregator(IHttpClientFactory httpClientFactory, ILogger<DataAggregator> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }
    
    public async Task<AggregatedData> GetAggregatedDataAsync()
    {
        try
        {
            // Create tasks for concurrent execution
            Task<ProductData> productsTask = GetProductDataAsync();
            Task<PriceData> pricesTask = GetPriceDataAsync();
            Task<InventoryData> inventoryTask = GetInventoryDataAsync();
            
            // Wait for all tasks to complete
            await Task.WhenAll(productsTask, pricesTask, inventoryTask);
            
            // Get results
            ProductData products = await productsTask;
            PriceData prices = await pricesTask;
            InventoryData inventory = await inventoryTask;
            
            // Aggregate the results
            return CombineData(products, prices, inventory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error aggregating data from multiple sources");
            throw;
        }
    }
    
    private async Task<ProductData> GetProductDataAsync()
    {
        return await FetchDataAsync<ProductData>("https://api.example.com/products");
    }
    
    private async Task<PriceData> GetPriceDataAsync()
    {
        return await FetchDataAsync<PriceData>("https://api.example.com/prices");
    }
    
    private async Task<InventoryData> GetInventoryDataAsync()
    {
        return await FetchDataAsync<InventoryData>("https://api.example.com/inventory");
    }
    
    private async Task<T> FetchDataAsync<T>(string url)
    {
        HttpClient client = _httpClientFactory.CreateClient();
        HttpResponseMessage response = await client.GetAsync(url);
        
        response.EnsureSuccessStatusCode();
        string json = await response.Content.ReadAsStringAsync();
        
        return JsonSerializer.Deserialize<T>(json);
    }
    
    private AggregatedData CombineData(ProductData products, PriceData prices, InventoryData inventory)
    {
        // Combine the data from different sources
        // Implementation depends on the specific data structures
        
        var result = new AggregatedData
        {
            // Combine data here
        };
        
        return result;
    }
}

// Supporting classes
public class ProductData { /* Properties */ }
public class PriceData { /* Properties */ }
public class InventoryData { /* Properties */ }
public class AggregatedData { /* Properties */ }
```
</details>

5. Build a simple API with ASP.NET Core that performs basic CRUD operations on a resource

<details>
<summary>💡 Hint 1</summary>

Use the ASP.NET Core Web API template to create a new project. Define a model class for your resource and a controller to handle HTTP requests.
</details>

<details>
<summary>💡 Hint 2</summary>

Implement controller methods for the standard HTTP verbs: GET (all and by id), POST, PUT, and DELETE. Use appropriate HTTP status codes in your responses.
</details>

<details>
<summary>💡 Hint 3</summary>

Consider using an in-memory repository for simplicity in this exercise, or connect to a database using Entity Framework Core for a more realistic implementation.
</details>

<details>
<summary>📝 Example Structure</summary>

```csharp
// Model
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

// Data Transfer Object (DTO)
public class ProductDto
{
    [Required]
    public string Name { get; set; }
    
    [Range(0.01, 10000)]
    public decimal Price { get; set; }
    
    [Range(0, 1000)]
    public int Stock { get; set; }
}

// Controller
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IRepository<Product> _repository;
    
    public ProductsController(IRepository<Product> repository)
    {
        _repository = repository;
    }
    
    // GET: api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll()
    {
        return Ok(_repository.GetAll());
    }
    
    // GET: api/products/5
    [HttpGet("{id}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = _repository.GetById(id);
        
        if (product == null)
        {
            return NotFound();
        }
        
        return Ok(product);
    }
    
    // POST: api/products
    [HttpPost]
    public ActionResult<Product> Create(ProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            Stock = productDto.Stock
        };
        
        _repository.Add(product);
        _repository.SaveChanges();
        
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
    
    // PUT: api/products/5
    [HttpPut("{id}")]
    public IActionResult Update(int id, ProductDto productDto)
    {
        var product = _repository.GetById(id);
        
        if (product == null)
        {
            return NotFound();
        }
        
        product.Name = productDto.Name;
        product.Price = productDto.Price;
        product.Stock = productDto.Stock;
        
        _repository.Update(product);
        _repository.SaveChanges();
        
        return NoContent();
    }
    
    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var product = _repository.GetById(id);
        
        if (product == null)
        {
            return NotFound();
        }
        
        _repository.Delete(id);
        _repository.SaveChanges();
        
        return NoContent();
    }
}

// Program.cs configuration
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<IRepository<Product>, InMemoryRepository<Product>>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```
</details>

## Additional Resources

- [C# Documentation](https://docs.microsoft.com/en-us/dotnet/csharp/) - Official Microsoft documentation
- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/) - .NET platform documentation
- [C# in Depth](https://csharpindepth.com/) - Jon Skeet's in-depth C# book
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/) - Official ASP.NET Core documentation
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/) - EF Core documentation
- [C# Corner](https://www.c-sharpcorner.com/) - Community articles and tutorials
- [Microsoft Learn](https://learn.microsoft.com/en-us/training/browse/?products=dotnet) - Interactive C# and .NET courses
