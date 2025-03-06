CREATE TABLE chats (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- Foreign key referencing the users table
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME,
    isDeleted BIT DEFAULT 0,
    CONSTRAINT fk_user_chat FOREIGN KEY (user_id) REFERENCES users(id)
);