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
    @Name NVARCHAR(100)
AS
BEGIN
    INSERT INTO Categories (Name) VALUES (@Name)
END

CREATE PROCEDURE GetAllCategories
AS
BEGIN
    SELECT * FROM Categories
END

CREATE PROCEDURE UpdateCategory
    @CategoryID INT,
    @Name NVARCHAR(100)
AS
BEGIN
    UPDATE Categories SET Name=@Name WHERE CategoryID=@CategoryID
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
    @UserID INT, @Total DECIMAL(18,2), @PaymentID INT
AS
BEGIN
    INSERT INTO Orders (UserID, Total, PaymentID) VALUES (@UserID, @Total, @PaymentID)
END

CREATE PROCEDURE GetAllOrders
AS
BEGIN
    SELECT * FROM Orders
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
