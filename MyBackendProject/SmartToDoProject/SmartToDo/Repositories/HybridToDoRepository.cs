using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using SmartToDo.Data;
using SmartToDo.Models;
using System.Data;

namespace SmartToDo.Repositories;

public class HybridToDoRepository : IToDoRepository
{
    private readonly AppDbContext _context;
    private readonly string _connectionString;

    public HybridToDoRepository(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
                            ?? throw new InvalidOperationException("Connection string not found.");
    }

    public List<ToDoItem> GetAll(Category? category, string? sortBy)
    {
        var result = new List<ToDoItem>();
        
        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();

        var sql = "SELECT * FROM tasks WHERE 1=1";

        if (category.HasValue)
        {
            sql += " AND category = @cat";
        }

        sql += (sortBy?.ToLower()) switch
        {
            "priority" => " ORDER BY priority DESC",
            "date" => " ORDER BY duedate",
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
        if (item == null) throw new ArgumentNullException(nameof(item));

        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();
        
        var sql = @"INSERT INTO tasks (user_id, title, description, duedate, priority, category, iscompleted, hasreminder)
                    VALUES (@uid, @t, @d, @dd, @p, @c, @ic, @hr) RETURNING id";
        
        using var cmd = new NpgsqlCommand(sql, conn);
        
        cmd.Parameters.AddWithValue("uid", item.UserId);
        cmd.Parameters.AddWithValue("t", item.Title ?? "");
        cmd.Parameters.AddWithValue("d", item.Description ?? "");
        
        if (item.DueDate.HasValue) 
            cmd.Parameters.AddWithValue("dd", item.DueDate.Value);
        else 
            cmd.Parameters.AddWithValue("dd", DBNull.Value);

        cmd.Parameters.AddWithValue("p", (int)item.Priority);
        cmd.Parameters.AddWithValue("c", (int)item.Category);
        cmd.Parameters.AddWithValue("ic", item.IsCompleted);
        cmd.Parameters.AddWithValue("hr", item.HasReminder);

        var newIdObj = cmd.ExecuteScalar();
        if (newIdObj != null)
        {
            item.Id = Convert.ToInt32(newIdObj);
        }
    }

    public void Delete(int id)
    {
        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();
        var sql = "DELETE FROM tasks WHERE id = @id";
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.ExecuteNonQuery();
    }

    public void Update(ToDoItem item)
    {
        if (item == null) throw new ArgumentNullException(nameof(item));

        var existing = _context.Tasks.Find(item.Id);
        if (existing == null) return;

        existing.Title = item.Title;
        existing.Description = item.Description ?? "";
        existing.Priority = item.Priority;
        existing.Category = item.Category;
        
        if (item.DueDate.HasValue)
            existing.DueDate = item.DueDate.Value;
        else
            existing.DueDate = null;

        existing.HasReminder = item.HasReminder;

        if (item.IsCompleted && !existing.IsCompleted)
            existing.CompletedAt = DateTime.UtcNow;
        else if (!item.IsCompleted)
            existing.CompletedAt = null;
        
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