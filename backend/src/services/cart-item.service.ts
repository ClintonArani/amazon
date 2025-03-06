import mssql from 'mssql';
import { v4 } from 'uuid';
import { CartItem } from '../interfaces/cart-item.interface';
import { sqlConfig } from '../config/sqlConfig';

export class CartItemService {
    async addCartItem(cartItem: CartItem) {
        let pool = await mssql.connect(sqlConfig);

        let cart_item_id = v4();
        let createdAt = new Date();

        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, cart_item_id)
                .input("user_id", mssql.VarChar, cartItem.user_id)
                .input("product_id", mssql.VarChar, cartItem.product_id)
                .input("quantity", mssql.Int, cartItem.quantity)
                .input("createdAt", mssql.DateTime, createdAt)
                .execute("addCartItem")).rowsAffected;

            if (result[0] == 1) {
                return {
                    message: "Item added to cart successfully"
                };
            } else {
                return {
                    error: "Unable to add item to cart"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async removeCartItem(cart_item_id: string) {
        let pool = await mssql.connect(sqlConfig);

        let result = (await pool.request()
            .input("id", mssql.VarChar, cart_item_id)
            .execute("removeCartItem")).rowsAffected;

        if (result[0] == 1) {
            return {
                message: "Item removed from cart successfully"
            };
        } else {
            return {
                error: "Unable to remove item from cart"
            };
        }
    }

    async getCartItems(user_id: string) {
        let pool = await mssql.connect(sqlConfig);

        let result = (await pool.request()
            .input("user_id", mssql.VarChar, user_id)
            .execute("getCartItems")).recordset;

        if (result.length == 0) {
            return {
                message: "No items in the cart"
            };
        } else {
            return {
                cartItems: result
            };
        }
    }
}