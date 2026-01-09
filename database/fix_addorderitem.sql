USE [EcommerceDB];
GO

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
GO
