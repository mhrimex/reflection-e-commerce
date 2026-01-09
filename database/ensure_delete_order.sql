
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'DeleteOrder')
DROP PROCEDURE DeleteOrder;
GO

CREATE PROCEDURE DeleteOrder
    @OrderID INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Delete items first to avoid FK constraint violation
    DELETE FROM OrderItems WHERE OrderID = @OrderID;
    
    -- Delete the order
    DELETE FROM Orders WHERE OrderID = @OrderID;
END
GO
