CREATE TABLE PasswordResetCodes (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    resetCode VARCHAR(10) NOT NULL,
    expirationTime DATETIME NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_password_reset_codes_email ON PasswordResetCodes(email);