import mssql from 'mssql';
import { Order } from '../interfaces/order.interface';
import { sqlConfig } from '../config/sqlConfig';

export class OrderService {
    async cancelOrder(order_id: string) {
        let pool = await mssql.connect(sqlConfig);

        try {
            let result = (await pool.request()
                .input("order_id", mssql.VarChar, order_id)
                .execute("cancelOrder")).recordset;

            if (result.length > 0) {
                return {
                    message: "Order cancelled successfully",
                    order: result[0]
                };
            } else {
                return {
                    error: "Unable to cancel order"
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async updateOrderStatus(order_id: string, new_status: string) {
        let pool = await mssql.connect(sqlConfig);

        try {
            let result = (await pool.request()
                .input("order_id", mssql.VarChar, order_id)
                .input("new_status", mssql.VarChar, new_status)
                .execute("updateOrderStatus")).recordset;

            if (result.length > 0) {
                return {
                    message: "Order status updated successfully",
                    order: result[0]
                };
            } else {
                return {
                    error: "Unable to update order status"
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllOrders() {
        let pool = await mssql.connect(sqlConfig);

        try {
            let result = (await pool.request()
                .execute("getAllOrders")).recordset;

            return {
                message: "Orders fetched successfully",
                orders: result
            };
        } catch (error) {
            throw error;
        }
    }
}