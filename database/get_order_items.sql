USE [EcommerceDB];
GO

CREATE PROCEDURE GetOrderItems
    @OrderID INT
AS
BEGIN
    SELECT 
        oi.OrderItemID,
        oi.ProductID,
        p.Name,
        oi.Quantity,
        oi.Price
    FROM OrderItems oi
    JOIN Products p ON oi.ProductID = p.ProductID
    WHERE oi.OrderID = @OrderID
END
GO
