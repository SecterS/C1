using Npgsql;
using SmartToDo.Models;

namespace SmartToDo.Repositories;

public class PostgresToDoRepository
{
    private const string ConnectionString = "Host=localhost;Port=5432;Database=postgres;Username=postgres;";

    public List<ToDoItem> GetAll(Category? category, string? sortBy)
    {
        var result = new List<ToDoItem>();
        try 
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            conn.Open();

            // ИСПРАВЛЕНО: Убрали кавычки вокруг Tasks
            var sql = "SELECT * FROM Tasks";
            
            using var cmd = new NpgsqlCommand(sql, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                result.Add(new ToDoItem
                {
                    // ИСПРАВЛЕНО: Читаем колонки без учета регистра
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    // Обрати внимание: GetOrdinal ищет case-insensitive обычно, но лучше писать как в базе (lowercase) если что
                    Description = reader.IsDBNull(reader.GetOrdinal("description")) ? "" : reader.GetString(reader.GetOrdinal("description")),
                    DueDate = reader.IsDBNull(reader.GetOrdinal("duedate")) ? null : reader.GetDateTime(reader.GetOrdinal("duedate")),
                    Priority = (Priority)reader.GetInt32(reader.GetOrdinal("priority")),
                    Category = (Category)reader.GetInt32(reader.GetOrdinal("category")),
                    IsCompleted = reader.GetBoolean(reader.GetOrdinal("iscompleted")),
                    HasReminder = reader.GetBoolean(reader.GetOrdinal("hasreminder"))
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("DB ERROR (GetAll): " + ex.Message);
            throw;
        }
        return result; 
    }

    public void Add(ToDoItem item)
    {
        try
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            conn.Open();

            // ИСПРАВЛЕНО: Убрали кавычки везде
            var sql = @"
                INSERT INTO Tasks (Title, Description, DueDate, Priority, Category, IsCompleted, HasReminder)
                VALUES (@Title, @Desc, @Date, @Prio, @Cat, @IsComp, @Rem)
                RETURNING Id;";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("Title", item.Title ?? "");
            cmd.Parameters.AddWithValue("Desc", item.Description ?? "");
            
            if (item.DueDate.HasValue)
                cmd.Parameters.AddWithValue("Date", item.DueDate.Value.ToUniversalTime());
            else
                cmd.Parameters.AddWithValue("Date", DBNull.Value);

            cmd.Parameters.AddWithValue("Prio", (int)item.Priority);
            cmd.Parameters.AddWithValue("Cat", (int)item.Category);
            cmd.Parameters.AddWithValue("IsComp", item.IsCompleted);
            cmd.Parameters.AddWithValue("Rem", item.HasReminder);

            var newId = Convert.ToInt32(cmd.ExecuteScalar());
            item.Id = newId;
        }
        catch (Exception ex)
        {
            Console.WriteLine("DB ERROR (Add): " + ex.Message);
            throw;
        }
    }

    public void Delete(int id)
    {
        try 
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            conn.Open();

            // ИСПРАВЛЕНО: Просто Tasks и Id без кавычек
            var sql = "DELETE FROM Tasks WHERE Id = @Id";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("Id", id);

            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine("DB ERROR (Delete): " + ex.Message);
            throw; 
        }
    }

    public void Update(ToDoItem item) 
    { 
        try
        {
            using var conn = new NpgsqlConnection(ConnectionString);
            conn.Open();

            var sql = @"
                UPDATE Tasks 
                SET Title = @Title, Description = @Desc, DueDate = @Date, 
                    Priority = @Prio, Category = @Cat, IsCompleted = @IsComp, HasReminder = @Rem
                WHERE Id = @Id";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("Title", item.Title ?? "");
            cmd.Parameters.AddWithValue("Desc", item.Description ?? "");
            if (item.DueDate.HasValue) cmd.Parameters.AddWithValue("Date", item.DueDate.Value.ToUniversalTime());
            else cmd.Parameters.AddWithValue("Date", DBNull.Value);
            cmd.Parameters.AddWithValue("Prio", (int)item.Priority);
            cmd.Parameters.AddWithValue("Cat", (int)item.Category);
            cmd.Parameters.AddWithValue("IsComp", item.IsCompleted);
            cmd.Parameters.AddWithValue("Rem", item.HasReminder);
            cmd.Parameters.AddWithValue("Id", item.Id);

            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            Console.WriteLine("DB ERROR (Update): " + ex.Message);
            throw;
        }
    }
    
    public object GetStats() { return new {}; }
}