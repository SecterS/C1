using Microsoft.AspNetCore.Mvc;
using SmartToDo.Models;
using SmartToDo.Repositories;

namespace SmartToDo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    private readonly InMemoryToDoRepository _repo;

    public ToDoController(InMemoryToDoRepository repo)
    {
        _repo = repo;
    }

    [HttpGet] // GET: api/todo
    public IActionResult Get([FromQuery] Category? category, [FromQuery] string? sortBy)
        => Ok(_repo.GetAll(category, sortBy));

    [HttpPost] // POST: api/todo
    public IActionResult Create([FromBody] ToDoItem item)
    {
        _repo.Add(item);
        return Ok(item);
    }

    [HttpPut("{id}")] // PUT: api/todo/1
    public IActionResult Update(int id, [FromBody] ToDoItem item)
    {
        item.Id = id;
        _repo.Update(item);
        return Ok();
    }

    [HttpGet("stats")] // GET: api/todo/stats
    public IActionResult Stats() => Ok(_repo.GetStats());
}