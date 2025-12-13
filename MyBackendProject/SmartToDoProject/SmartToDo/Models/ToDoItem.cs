namespace SmartToDo.Models;

public enum Priority { Low = 1, Medium = 2, High = 3 }
public enum Category { NoTerm = 0, Work = 1, Personal = 2, Study = 3 }

public class ToDoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; } // Если null, то "Без срока"
    public Priority Priority { get; set; }
    public Category Category { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool HasReminder { get; set; }
}