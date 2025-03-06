CREATE PROCEDURE getSingleProduct
    @id VARCHAR(255)
AS
BEGIN
    SELECT * FROM products WHERE id = @id AND isDeleted = 0;
END