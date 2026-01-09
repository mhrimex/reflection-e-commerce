USE [EcommerceDB];
GO

-- 1. Add ShippingAddress Column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Orders]') AND name = 'ShippingAddress')
BEGIN
    ALTER TABLE Orders ADD ShippingAddress NVARCHAR(255);
END
GO

-- 2. Update CreateOrder to accept Address
ALTER PROCEDURE CreateOrder
    @UserID INT, 
    @Total DECIMAL(18,2), 
    @PaymentID INT = NULL,
    @Status NVARCHAR(50) = 'Processing',
    @ShippingAddress NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Orders (UserID, Total, PaymentID, Status, ShippingAddress) 
    VALUES (@UserID, @Total, @PaymentID, @Status, @ShippingAddress);
    
    SELECT SCOPE_IDENTITY() AS OrderID;
END
GO

-- 3. Update UpdateOrder to accept Address
ALTER PROCEDURE UpdateOrder
    @OrderID INT,
    @Total DECIMAL(18,2), 
    @Status NVARCHAR(50),  
    @PaymentID INT = NULL,
    @ShippingAddress NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE Orders 
    SET Total = @Total, 
        Status = @Status,
        PaymentID = ISNULL(@PaymentID, PaymentID),
        ShippingAddress = @ShippingAddress
    WHERE OrderID = @OrderID;
END
GO

-- 4. Helper to Clear Order Items (for full update)
CREATE PROCEDURE ClearOrderItems
    @OrderID INT
AS
BEGIN
    DELETE FROM OrderItems WHERE OrderID = @OrderID;
END
GO
