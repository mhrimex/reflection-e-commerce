
CREATE OR ALTER PROCEDURE UpdateOrder
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
        -- If @PaymentID is passed (even as NULL), we might want to update it.
        -- But "ISNULL(@PaymentID, PaymentID)" means "If input is NULL, keep existing".
        -- If we want to ALLOW clearing it, we need a way to distinguish "Don't Change" from "Set to Null".
        -- For now, let's assume if it is passed, we update it. 
        -- But to be safe with my API logic where I might pass NULL for "No Pay ID", 
        -- I will just set it directly.
        PaymentID = @PaymentID, 
        ShippingAddress = @ShippingAddress
    WHERE OrderID = @OrderID;
END
