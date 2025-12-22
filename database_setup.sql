

CREATE TABLE IF NOT EXISTS Tasks (
    Id SERIAL PRIMARY KEY,
    Title TEXT NOT NULL,
    Description TEXT,
    DueDate TIMESTAMP,
    Priority INT NOT NULL,  
    Category INT NOT NULL,  
    IsCompleted BOOLEAN DEFAULT FALSE,
    HasReminder BOOLEAN DEFAULT FALSE
);


INSERT INTO Tasks (Title, Priority, Category) VALUES ('Проверка работы', 2, 1);