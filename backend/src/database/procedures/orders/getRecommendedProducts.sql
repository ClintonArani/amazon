CREATE PROCEDURE getRecommendedProducts
    @user_id VARCHAR(255),
    @limit INT = 5
AS
BEGIN
    -- Get user's most purchased category
    DECLARE @fav_category_id VARCHAR(255);
    
    SELECT TOP 1
        @fav_category_id = p.category_id
    FROM 
        order_items oi
    JOIN 
        orders o ON oi.order_id = o.id
    JOIN 
        products p ON oi.product_id = p.id
    WHERE 
        o.user_id = @user_id
    GROUP BY 
        p.category_id
    ORDER BY 
        SUM(oi.quantity) DESC;
    
    -- Get top products from that category that user hasn't purchased
    SELECT TOP (@limit)
        p.*
    FROM 
        products p
    WHERE 
        p.category_id = @fav_category_id
    AND 
        p.isDeleted = 0
    AND 
        p.id NOT IN (
            SELECT DISTINCT oi.product_id
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.user_id = @user_id
        )
    ORDER BY 
        p.price DESC; -- or any other relevant ordering
END;

