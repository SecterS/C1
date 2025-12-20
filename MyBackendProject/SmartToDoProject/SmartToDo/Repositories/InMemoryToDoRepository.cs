using SmartToDo.Models;

namespace SmartToDo.Repositories;

public class InMemoryToDoRepository
{
    private readonly List<ToDoItem> _items = new();
    private int _nextId = 1;

    public InMemoryToDoRepository()
    {
        // Тестовая задача, чтобы проверить, что всё работает
        Add(new ToDoItem { Title = "Проверка консоли", Priority = Priority.High, Category = Category.Work });
    }

    public List<ToDoItem> GetAll(Category? category, string? sortBy)
    {
        var result = _items.AsEnumerable();

        // Фильтрация
        if (category.HasValue)
            result = result.Where(x => x.Category == category);

        // Сортировка
        switch (sortBy?.ToLower())
        {
            case "date": result = result.OrderBy(x => x.DueDate); break;
            case "priority": result = result.OrderByDescending(x => x.Priority); break;
            default: result = result.OrderBy(x => x.Id); break;
        }

        return result.ToList();
    }

    public void Add(ToDoItem item)
    {
        item.Id = _nextId++;
        // Логика: если нет даты -> категория "Без срока"
        if (item.DueDate == null) item.Category = Category.NoTerm;
        _items.Add(item);
    }

    public void Update(ToDoItem item)
    {
        var existing = _items.FirstOrDefault(x => x.Id == item.Id);
        if (existing == null) return;

        // Логика: если завершили -> ставим дату, если отменили -> убираем
        if (item.IsCompleted && !existing.IsCompleted) existing.CompletedAt = DateTime.Now;
        else if (!item.IsCompleted) existing.CompletedAt = null;

        existing.Title = item.Title;
        existing.Description = item.Description;
        existing.Priority = item.Priority;
        existing.Category = item.Category;
        existing.DueDate = item.DueDate;
        existing.IsCompleted = item.IsCompleted;
        existing.HasReminder = item.HasReminder;
    }

    public object GetStats()
    {
        var total = _items.Count;
        var completed = _items.Count(x => x.IsCompleted);
        return new
        {
            Total = total,
            Completed = completed,
            ByCat = _items.GroupBy(x => x.Category.ToString()).ToDictionary(k => k.Key, v => v.Count())
        };
    }
}