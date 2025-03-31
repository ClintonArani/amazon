import nodemailer from 'nodemailer';
import { sqlConfig } from '../config/sqlConfig';
import mssql from 'mssql';
import { v4 } from 'uuid';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,  // true for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // For local development only
            }
        });
    }

    async sendResetCode(email: string, resetCode: string): Promise<boolean> {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Code',
                text: `Your password reset code is: ${resetCode}`,
                html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>`
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async storeResetCode(email: string, resetCode: string): Promise<boolean> {
        let pool = await mssql.connect(sqlConfig);
        
        try {
            // First delete any existing reset codes for this email
            await pool.request()
                .input('email', mssql.VarChar, email)
                .query('DELETE FROM PasswordResetCodes WHERE email = @email');
            
            // Store the new reset code with an expiration time (15 minutes)
            const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
            
            await pool.request()
                .input('id', mssql.VarChar, v4())
                .input('email', mssql.VarChar, email)
                .input('resetCode', mssql.VarChar, resetCode)
                .input('expirationTime', mssql.DateTime, expirationTime)
                .query(`
                    INSERT INTO PasswordResetCodes (id, email, resetCode, expirationTime)
                    VALUES (@id, @email, @resetCode, @expirationTime)
                `);
                
            return true;
        } catch (error) {
            console.error('Error storing reset code:', error);
            return false;
        }
    }

    async validateResetCode(email: string, resetCode: string): Promise<boolean> {
        let pool = await mssql.connect(sqlConfig);
        
        try {
            const result = await pool.request()
                .input('email', mssql.VarChar, email)
                .input('resetCode', mssql.VarChar, resetCode)
                .query(`
                    SELECT * FROM PasswordResetCodes 
                    WHERE email = @email 
                    AND resetCode = @resetCode 
                    AND expirationTime > GETDATE()
                `);
                
            return result.recordset.length > 0;
        } catch (error) {
            console.error('Error validating reset code:', error);
            return false;
        }
    }

    async deleteResetCode(email: string): Promise<void> {
        let pool = await mssql.connect(sqlConfig);
        
        try {
            await pool.request()
                .input('email', mssql.VarChar, email)
                .query('DELETE FROM PasswordResetCodes WHERE email = @email');
        } catch (error) {
            console.error('Error deleting reset code:', error);
        }
    }
}