
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetOrderItems')
DROP PROCEDURE GetOrderItems;
GO

CREATE PROCEDURE GetOrderItems
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        oi.OrderItemID,
        oi.ProductID,
        p.Name,
        oi.Quantity,
        oi.Price
    FROM OrderItems oi
    LEFT JOIN Products p ON oi.ProductID = p.ProductID -- Use LEFT JOIN to show item even if product deleted
    WHERE oi.OrderID = @OrderID;
END
GO
