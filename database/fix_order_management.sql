USE [EcommerceDB];
GO

-- Update Order
CREATE PROCEDURE UpdateOrder
    @OrderID INT,
    @Total DECIMAL(18,2), -- Allow updating total if items changed
    @Status NVARCHAR(50),  -- Main use case
    @PaymentID INT = NULL -- Just in case
AS
BEGIN
    UPDATE Orders 
    SET Total = @Total, 
        Status = @Status,
        PaymentID = ISNULL(@PaymentID, PaymentID) 
    WHERE OrderID = @OrderID;
END
GO

-- Delete Order
CREATE PROCEDURE DeleteOrder
    @OrderID INT
AS
BEGIN
    -- Delete items first to avoid FK constraint violation
    DELETE FROM OrderItems WHERE OrderID = @OrderID;
    
    -- Delete the order
    DELETE FROM Orders WHERE OrderID = @OrderID;
END
GO
