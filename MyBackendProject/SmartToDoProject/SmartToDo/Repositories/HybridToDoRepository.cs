using Microsoft.EntityFrameworkCore;
using Npgsql;
using SmartToDo.Data;
using SmartToDo.Models;
using System.Data;

namespace SmartToDo.Repositories;

public class HybridToDoRepository
{
    private readonly AppDbContext _context;
    private const string ConnectionString = "Host=localhost;Port=5432;Database=postgres;Username=postgres;";

    public HybridToDoRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<ToDoItem> GetAll(Category? category, string? sortBy)
    {
        var result = new List<ToDoItem>();
        
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();

        var sql = "SELECT * FROM tasks";
        
        if (category.HasValue)
        {
            sql += " WHERE category = @cat";
        }

        sql += (sortBy?.ToLower()) switch
        {
            "date" => " ORDER BY duedate",
            "priority" => " ORDER BY priority DESC",
            _ => " ORDER BY id"
        };
        
        using var cmd = new NpgsqlCommand(sql, conn);

        if (category.HasValue)
        {
            cmd.Parameters.AddWithValue("cat", (int)category.Value);
        }

        using var reader = cmd.ExecuteReader();

        while (reader.Read())
        {
            result.Add(new ToDoItem
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                Title = reader.GetString(reader.GetOrdinal("title")),
                Description = reader.IsDBNull(reader.GetOrdinal("description")) ? "" : reader.GetString(reader.GetOrdinal("description")),
                DueDate = reader.IsDBNull(reader.GetOrdinal("duedate")) ? null : reader.GetDateTime(reader.GetOrdinal("duedate")),
                Priority = (Priority)reader.GetInt32(reader.GetOrdinal("priority")),
                Category = (Category)reader.GetInt32(reader.GetOrdinal("category")),
                IsCompleted = reader.GetBoolean(reader.GetOrdinal("iscompleted")),
                HasReminder = reader.GetBoolean(reader.GetOrdinal("hasreminder"))
            });
        }
        
        return result; 
    }

    public void Add(ToDoItem item)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();
        
        var sql = @"INSERT INTO tasks (title, description, duedate, priority, category, iscompleted, hasreminder)
                    VALUES (@t, @d, @dd, @p, @c, @ic, @hr) RETURNING id";
        
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("t", item.Title ?? "");
        cmd.Parameters.AddWithValue("d", item.Description ?? "");
        
        if (item.DueDate.HasValue) 
            cmd.Parameters.AddWithValue("dd", item.DueDate.Value.ToUniversalTime());
        else 
            cmd.Parameters.AddWithValue("dd", DBNull.Value);

        cmd.Parameters.AddWithValue("p", (int)item.Priority);
        cmd.Parameters.AddWithValue("c", (int)item.Category);
        cmd.Parameters.AddWithValue("ic", item.IsCompleted);
        cmd.Parameters.AddWithValue("hr", item.HasReminder);

        item.Id = Convert.ToInt32(cmd.ExecuteScalar());
    }

    public void Delete(int id)
    {
        using var conn = new NpgsqlConnection(ConnectionString);
        conn.Open();
        var sql = "DELETE FROM tasks WHERE id = @id";
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.ExecuteNonQuery();
    }

    public void Update(ToDoItem item)
    {
        var existing = _context.Tasks.Find(item.Id);
        if (existing == null) return;

        existing.Title = item.Title;
        existing.Description = item.Description ?? "";
        existing.Priority = item.Priority;
        existing.Category = item.Category;
        
        if (item.DueDate.HasValue)
            existing.DueDate = item.DueDate.Value.ToUniversalTime();
        else
            existing.DueDate = null;

        existing.HasReminder = item.HasReminder;

        if (item.IsCompleted && !existing.IsCompleted)
        {
            existing.CompletedAt = DateTime.UtcNow;
        }
        else if (!item.IsCompleted)
        {
            existing.CompletedAt = null;
        }
        
        existing.IsCompleted = item.IsCompleted;

        _context.SaveChanges();
    }

    public object GetStats()
    {
        var total = _context.Tasks.Count();
        var completed = _context.Tasks.Count(x => x.IsCompleted);
        
        var byCategory = _context.Tasks
            .GroupBy(x => x.Category)
            .Select(g => new { Cat = g.Key, Cnt = g.Count() })
            .ToDictionary(k => k.Cat.ToString(), v => v.Cnt);

        return new
        {
            TotalTasks = total,
            CompletedTasks = completed,
            CompletionRate = total == 0 ? 0 : (double)completed / total * 100,
            TasksByCategory = byCategory
        };
    }
}