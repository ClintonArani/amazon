CREATE PROCEDURE getAllProducts
AS
BEGIN
    SELECT * FROM products WHERE isDeleted = 0;
END