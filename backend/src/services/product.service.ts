import mssql from 'mssql';
import { v4 } from 'uuid';
import { Product } from '../interfaces/product.interface';
import { sqlConfig } from '../config/sqlConfig';
import path from 'path';
import fs from 'fs';

export class ProductService {
    async addProduct(product: Product, imageFile: any) {
        let pool = await mssql.connect(sqlConfig);
    
        let product_id = v4();
        let createdAt = new Date();
    
        // Check if the image file is valid
        if (!imageFile || !imageFile.name) {
            throw new Error("No file uploaded or file is invalid");
        }
    
        // Save the uploaded image to the "uploads" folder
        const imageName = `${Date.now()}-${imageFile.name}`; // Generate a unique filename
        const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    
        // Move the uploaded file to the uploads folder
        await imageFile.mv(imagePath);
    
        // Store the relative path in the database
        const relativeImagePath = `uploads/${imageName}`;
    
        if (pool.connected) {
            let result = (await pool.request()
                .input("id", mssql.VarChar, product_id)
                .input("name", mssql.VarChar, product.name)
                .input("description", mssql.Text, product.description)
                .input("price", mssql.Decimal(10, 2), product.price)
                .input("image_path", mssql.VarChar, relativeImagePath) // Store the relative path
                .input("stock_quantity", mssql.Int, product.stock_quantity)
                .input("category_id", mssql.VarChar, product.category_id)
                .input("createdAt", mssql.DateTime, createdAt)
                .execute("addProduct")).rowsAffected;
    
            if (result[0] == 1) {
                return {
                    message: "Product added successfully",
                    imagePath: relativeImagePath // Return the relative path
                };
            } else {
                // Delete the uploaded image if the product creation fails
                fs.unlinkSync(imagePath);
                return {
                    error: "Unable to add product"
                };
            }
        } else {
            return {
                error: "Unable to establish connection"
            };
        }
    }

    async getAllProducts() {
        let pool = await mssql.connect(sqlConfig);

        let result = (await pool.request()
            .execute("getAllProducts")).recordset;

        if (result.length == 0) {
            return {
                message: "No products available"
            };
        } else {
            return {
                products: result
            };
        }
    }

    async getSingleProduct(product_id: string) {
        let pool = await mssql.connect(sqlConfig);

        let result = (await pool.request()
            .input("id", mssql.VarChar, product_id)
            .execute("getSingleProduct")).recordset;

        if (result.length === 0) {
            return {
                error: "Product not found or has been deleted"
            };
        } else {
            return {
                product: result[0]
            };
        }
    }

    async updateProduct(product_id: string, updatedProduct: Partial<Product>, imageFile?: any) {
        let pool = await mssql.connect(sqlConfig);
        let updatedAt = new Date();
    
        // If a new image is uploaded, save it and update the image path
        let imagePath: string | undefined = updatedProduct.image_path;
        if (imageFile && imageFile.name) {
            imagePath = path.join(__dirname, '..', 'uploads', imageFile.name);
    
            try {
                await imageFile.mv(imagePath);
                console.log("File saved successfully:", imagePath);
            } catch (error) {
                console.error("Error saving file:", error);
                throw new Error("Failed to save the uploaded file");
            }
        }
    
        try {
            let result = (await pool.request()
                .input("id", mssql.VarChar, product_id)
                .input("name", mssql.VarChar, updatedProduct.name)
                .input("description", mssql.Text, updatedProduct.description)
                .input("price", mssql.Decimal(10, 2), updatedProduct.price)
                .input("image_path", mssql.VarChar, imagePath)
                .input("stock_quantity", mssql.Int, updatedProduct.stock_quantity)
                .input("category_id", mssql.VarChar, updatedProduct.category_id) // Use "category_id"
                .input("updatedAt", mssql.DateTime, updatedAt)
                .execute("updateProduct")).rowsAffected;
    
            if (result[0] == 1) {
                return {
                    message: "Product updated successfully",
                    imagePath
                };
            } else {
                if (imageFile && imagePath && fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                return {
                    error: "Unable to update product"
                };
            }
        } catch (error) {
            if (imageFile && imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            throw error;
        }
    }

    async deleteProduct(product_id: string) {
        let pool = await mssql.connect(sqlConfig);

        let result = (await pool.request()
            .input("id", mssql.VarChar, product_id)
            .execute("deleteProduct")).rowsAffected;

        if (result[0] == 1) {
            return {
                message: "Product deleted successfully"
            };
        } else {
            return {
                error: "Unable to delete product"
            };
        }
    }
}