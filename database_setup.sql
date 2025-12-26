DROP TABLE IF EXISTS "Tasks";
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duedate TIMESTAMP,
    priority INT NOT NULL,
    category INT NOT NULL,
    iscompleted BOOLEAN DEFAULT FALSE,
    hasreminder BOOLEAN DEFAULT FALSE,
    completedat TIMESTAMP 
);

INSERT INTO tasks (title, priority, category) VALUES ('Demo Task', 3, 1);