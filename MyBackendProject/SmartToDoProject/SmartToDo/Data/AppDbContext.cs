using Microsoft.EntityFrameworkCore;
using SmartToDo.Models;

namespace SmartToDo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ToDoItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ToDoItem>(entity =>
        {
            entity.ToTable("tasks");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DueDate).HasColumnName("duedate");
            entity.Property(e => e.Priority).HasColumnName("priority");
            entity.Property(e => e.Category).HasColumnName("category");
            entity.Property(e => e.IsCompleted).HasColumnName("iscompleted");
            entity.Property(e => e.HasReminder).HasColumnName("hasreminder");
            entity.Property(e => e.CompletedAt).HasColumnName("completedat");
        });
    }
}