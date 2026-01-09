-- SQL Server Stored Procedures
-- Use for Insert, Update, Delete, GetByID, Pagination, Search, Transactions

CREATE PROCEDURE InsertUser
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @Email NVARCHAR(255),
    @RoleID INT
AS
BEGIN
    INSERT INTO Users (Username, PasswordHash, Email, RoleID)
    VALUES (@Username, @PasswordHash, @Email, @RoleID)
END

-- USERS
CREATE PROCEDURE UpdateUser
    @UserID INT,
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @RoleID INT
AS
BEGIN
    UPDATE Users SET Username=@Username, Email=@Email, RoleID=@RoleID WHERE UserID=@UserID
END

CREATE PROCEDURE DeleteUser
    @UserID INT
AS
BEGIN
    UPDATE Users SET IsDeleted=1 WHERE UserID=@UserID
END

CREATE PROCEDURE GetUserByID
    @UserID INT
AS
BEGIN
    SELECT * FROM Users WHERE UserID=@UserID AND IsDeleted=0
END

CREATE PROCEDURE GetAllUsers
AS
BEGIN
    SELECT * FROM Users WHERE IsDeleted=0
END

-- PRODUCTS
CREATE PROCEDURE CreateProduct
    @Name NVARCHAR(100), 
    @Description NVARCHAR(255) = NULL, 
    @Price DECIMAL(18,2), 
    @CategoryID INT = NULL, 
    @BrandID INT = NULL, 
    @Stock INT = 0,
    @ImageUrl NVARCHAR(255) = NULL
AS
BEGIN
    INSERT INTO Products (Name, Description, Price, CategoryID, BrandID, Stock, ImageUrl)
    VALUES (@Name, @Description, @Price, @CategoryID, @BrandID, @Stock, @ImageUrl)
END

CREATE PROCEDURE UpdateProduct
    @ProductID INT, 
    @Name NVARCHAR(100), 
    @Description NVARCHAR(255) = NULL, 
    @Price DECIMAL(18,2), 
    @CategoryID INT = NULL, 
    @BrandID INT = NULL, 
    @Stock INT = 0,
    @ImageUrl NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE Products 
    SET Name=@Name, 
        Description=@Description, 
        Price=@Price, 
        CategoryID=@CategoryID, 
        BrandID=@BrandID, 
        Stock=@Stock,
        ImageUrl=@ImageUrl 
    WHERE ProductID=@ProductID
END

CREATE PROCEDURE DeleteProduct
    @ProductID INT
AS
BEGIN
    UPDATE Products SET IsDeleted=1 WHERE ProductID=@ProductID
END

CREATE PROCEDURE GetProductByID
    @ProductID INT
AS
BEGIN
    SELECT * FROM Products WHERE ProductID=@ProductID AND IsDeleted=0
END

CREATE PROCEDURE GetAllProducts
AS
BEGIN
    SELECT * FROM Products WHERE IsDeleted=0
END

-- CATEGORIES
CREATE PROCEDURE CreateCategory
    @Name NVARCHAR(100),
    @Icon NVARCHAR(100) = NULL
AS
BEGIN
    INSERT INTO Categories (Name, Icon) VALUES (@Name, @Icon)
END

CREATE PROCEDURE GetAllCategories
AS
BEGIN
    SELECT * FROM Categories
END

CREATE PROCEDURE UpdateCategory
    @CategoryID INT,
    @Name NVARCHAR(100),
    @Icon NVARCHAR(100) = NULL
AS
BEGIN
    UPDATE Categories SET Name=@Name, Icon=@Icon WHERE CategoryID=@CategoryID
END

CREATE PROCEDURE DeleteCategory
    @CategoryID INT
AS
BEGIN
    -- Check if products exist in this category before deleting or handle it
    DELETE FROM Categories WHERE CategoryID=@CategoryID
END

-- BRANDS
CREATE PROCEDURE CreateBrand
    @Name NVARCHAR(100)
AS
BEGIN
    INSERT INTO Brands (Name) VALUES (@Name)
END

CREATE PROCEDURE GetAllBrands
AS
BEGIN
    SELECT * FROM Brands
END

CREATE PROCEDURE UpdateBrand
    @BrandID INT,
    @Name NVARCHAR(100)
AS
BEGIN
    UPDATE Brands SET Name=@Name WHERE BrandID=@BrandID
END

CREATE PROCEDURE DeleteBrand
    @BrandID INT
AS
BEGIN
    DELETE FROM Brands WHERE BrandID=@BrandID
END

-- ORDERS
CREATE PROCEDURE CreateOrder
    @UserID INT, 
    @Total DECIMAL(18,2), 
    @PaymentID INT = NULL,
    @Status NVARCHAR(50) = 'Processing'
AS
BEGIN
    INSERT INTO Orders (UserID, Total, PaymentID, Status) 
    VALUES (@UserID, @Total, @PaymentID, @Status);
    
    SELECT SCOPE_IDENTITY() AS OrderID;
END

CREATE PROCEDURE GetAllOrders
AS
BEGIN
    SELECT * FROM Orders
END

CREATE PROCEDURE AddOrderItem
    @OrderID INT,
    @ProductID INT,
    @Quantity INT,
    @Price DECIMAL(18,2)
AS
BEGIN
    INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price)
END

-- CART
CREATE PROCEDURE AddToCart
    @UserID INT, @ProductID INT, @Quantity INT
AS
BEGIN
    INSERT INTO Cart (UserID, ProductID, Quantity) VALUES (@UserID, @ProductID, @Quantity)
END

CREATE PROCEDURE GetCartByUserID
    @UserID INT
AS
BEGIN
    SELECT * FROM Cart WHERE UserID=@UserID
END

-- REVIEWS
CREATE PROCEDURE AddReview
    @UserID INT, @ProductID INT, @Rating INT, @Comment NVARCHAR(255)
AS
BEGIN
    INSERT INTO Reviews (UserID, ProductID, Rating, Comment) VALUES (@UserID, @ProductID, @Rating, @Comment)
END

CREATE PROCEDURE GetReviewsByProductID
    @ProductID INT
AS
BEGIN
    SELECT * FROM Reviews WHERE ProductID=@ProductID
END

-- WISHLIST
CREATE PROCEDURE AddToWishlist
    @UserID INT, @ProductID INT
AS
BEGIN
    INSERT INTO Wishlist (UserID, ProductID) VALUES (@UserID, @ProductID)
END

CREATE PROCEDURE GetWishlistByUserID
    @UserID INT
AS
BEGIN
    SELECT * FROM Wishlist WHERE UserID=@UserID
END

-- COUPONS
CREATE PROCEDURE CreateCoupon
    @Code NVARCHAR(50), @Discount DECIMAL(5,2), @ExpiresAt DATETIME
AS
BEGIN
    INSERT INTO Coupons (Code, Discount, ExpiresAt) VALUES (@Code, @Discount, @ExpiresAt)
END

CREATE PROCEDURE GetAllCoupons
AS
BEGIN
    SELECT * FROM Coupons
END

CREATE PROCEDURE UpdateCoupon
    @CouponID INT,
    @Code NVARCHAR(50), 
    @Discount DECIMAL(5,2), 
    @ExpiresAt DATETIME
AS
BEGIN
    UPDATE Coupons 
    SET Code=@Code, Discount=@Discount, ExpiresAt=@ExpiresAt 
    WHERE CouponID=@CouponID
END

CREATE PROCEDURE DeleteCoupon
    @CouponID INT
AS
BEGIN
    DELETE FROM Coupons WHERE CouponID=@CouponID
END

-- PAYMENTS
CREATE PROCEDURE CreatePayment
    @UserID INT, @Amount DECIMAL(18,2), @Method NVARCHAR(50)
AS
BEGIN
    INSERT INTO Payments (UserID, Amount, Method) VALUES (@UserID, @Amount, @Method)
END

CREATE PROCEDURE GetPaymentsByUserID
    @UserID INT
AS
BEGIN
    SELECT * FROM Payments WHERE UserID=@UserID
END

-- Example for pagination/search
CREATE PROCEDURE SearchProducts
    @Search NVARCHAR(100), @Page INT, @PageSize INT
AS
BEGIN
    SELECT * FROM Products WHERE Name LIKE '%' + @Search + '%'
    ORDER BY ProductID
    OFFSET (@Page-1)*@PageSize ROWS FETCH NEXT @PageSize ROWS ONLY
END

-- REPORTS
CREATE PROCEDURE GetReportStats
AS
BEGIN
    SET NOCOUNT ON;

    -- Basic Metrics
    DECLARE @TotalRevenue DECIMAL(18,2);
    DECLARE @TotalOrders INT;
    DECLARE @TotalUsers INT;
    DECLARE @TotalProducts INT;

    SELECT @TotalRevenue = SUM(Total) FROM Orders;
    SELECT @TotalOrders = COUNT(*) FROM Orders;
    SELECT @TotalUsers = COUNT(*) FROM Users WHERE IsDeleted = 0;
    SELECT @TotalProducts = COUNT(*) FROM Products WHERE IsDeleted = 0;

    -- Result Set 1: Overall Metrics
    SELECT 
        ISNULL(@TotalRevenue, 0) AS TotalRevenue,
        ISNULL(@TotalOrders, 0) AS TotalOrders,
        ISNULL(@TotalUsers, 0) AS TotalUsers,
        ISNULL(@TotalProducts, 0) AS TotalProducts;

    -- Result Set 2: Recent Activity
    SELECT TOP 5 
        o.OrderID, 
        u.Username, 
        o.Total, 
        o.Status, 
        o.CreatedAt
    FROM Orders o
    INNER JOIN Users u ON o.UserID = u.UserID
    ORDER BY o.CreatedAt DESC;
END

-- STOCK REPORT
CREATE PROCEDURE GetStockReport
    @CategoryID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Overall Stock Metrics
    SELECT 
        COUNT(*) AS TotalProductSKUs,
        SUM(Stock) AS TotalStockUnits,
        SUM(Stock * Price) AS TotalInventoryValue,
        COUNT(CASE WHEN Stock <= 10 THEN 1 END) AS LowStockAlerts
    FROM Products 
    WHERE IsDeleted = 0 
      AND (@CategoryID IS NULL OR CategoryID = @CategoryID);

    -- Full Stock List (Showing all products for "Variation")
    SELECT 
        ProductID, 
        Name, 
        Stock, 
        Price, 
        (Stock * Price) AS PositionValue
    FROM Products 
    WHERE IsDeleted = 0 
      AND (@CategoryID IS NULL OR CategoryID = @CategoryID)
    ORDER BY Stock ASC;

    -- Stock By Category
    SELECT 
        c.Name AS CategoryName, 
        SUM(p.Stock) AS TotalUnits, 
        SUM(p.Stock * p.Price) AS CategoryValue
    FROM Products p
    JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE p.IsDeleted = 0 
      AND (@CategoryID IS NULL OR p.CategoryID = @CategoryID)
    GROUP BY c.Name;
END

-- SALES PERFORMANCE REPORT
CREATE PROCEDURE GetSalesReport
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CategoryID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Default Date Range: Last 30 Days if NULL
    IF @StartDate IS NULL SET @StartDate = DATEADD(day, -30, GETDATE());
    IF @EndDate IS NULL SET @EndDate = GETDATE();

    -- Top Selling Products
    SELECT TOP 10
        p.Name,
        SUM(oi.Quantity) AS UnitsSold,
        SUM(oi.Quantity * oi.Price) AS TotalRevenue
    FROM OrderItems oi
    INNER JOIN Products p ON oi.ProductID = p.ProductID
    INNER JOIN Orders o ON oi.OrderID = o.OrderID
    WHERE o.CreatedAt BETWEEN @StartDate AND DATEADD(day, 1, @EndDate)
      AND (@CategoryID IS NULL OR p.CategoryID = @CategoryID)
    GROUP BY p.Name
    ORDER BY TotalRevenue DESC;

    -- Revenue By Category
    SELECT 
        c.Name AS CategoryName,
        SUM(oi.Quantity * oi.Price) AS Revenue
    FROM OrderItems oi
    INNER JOIN Products p ON oi.ProductID = p.ProductID
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    INNER JOIN Orders o ON oi.OrderID = o.OrderID
    WHERE o.CreatedAt BETWEEN @StartDate AND DATEADD(day, 1, @EndDate)
      AND (@CategoryID IS NULL OR p.CategoryID = @CategoryID)
    GROUP BY c.Name
    ORDER BY Revenue DESC;

    -- Revenue Growth (Filtered Range)
    SELECT 
        CAST(CreatedAt AS DATE) AS SalesDate,
        SUM(Total) AS DailyRevenue,
        COUNT(*) AS OrderCount
    FROM Orders
    WHERE CreatedAt BETWEEN @StartDate AND DATEADD(day, 1, @EndDate)
      -- Note: Orders table doesn't have CategoryID directly, so we can't filter daily trend by category easily without joining items.
      -- To keep it simple and performant, we'll skip category filter for the daily trend line or accept it shows global trend.
      -- For now, let's keep it global or join if strictness is required. Let's keep global for trend line context.
    GROUP BY CAST(CreatedAt AS DATE)
    ORDER BY SalesDate ASC;
END
