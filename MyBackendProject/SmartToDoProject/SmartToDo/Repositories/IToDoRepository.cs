using SmartToDo.Models;

namespace SmartToDo.Repositories;

public interface IToDoRepository
{
    
    List<ToDoItem> GetAll(int userId, Category? category, string? sortBy);
    
  
    void Add(ToDoItem item);
    void Update(ToDoItem item);
    void Delete(int id); 
    object GetStats(int userId); 
}