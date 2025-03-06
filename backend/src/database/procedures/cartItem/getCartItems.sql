CREATE PROCEDURE getCartItems
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_path
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = @user_id AND ci.isDeleted = 0;
END