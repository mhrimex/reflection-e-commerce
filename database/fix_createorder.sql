USE [EcommerceDB]; -- Assuming default name, will override in command if needed
GO

ALTER PROCEDURE CreateOrder
    @UserID INT, 
    @Total DECIMAL(18,2), 
    @PaymentID INT = NULL,
    @Status NVARCHAR(50) = 'Processing'
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Orders (UserID, Total, PaymentID, Status) 
    VALUES (@UserID, @Total, @PaymentID, @Status);
    
    SELECT SCOPE_IDENTITY() AS OrderID;
END
GO
