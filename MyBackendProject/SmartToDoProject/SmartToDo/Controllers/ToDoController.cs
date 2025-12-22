using Microsoft.AspNetCore.Mvc;
using SmartToDo.Models;
using SmartToDo.Repositories;

namespace SmartToDo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    private readonly PostgresToDoRepository _repo;

    public ToDoController(PostgresToDoRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] Category? category, [FromQuery] string? sortBy) 
        => Ok(_repo.GetAll(category, sortBy));

    [HttpPost]
    public IActionResult Create([FromBody] ToDoItem item)
    {
        _repo.Add(item);
        return Ok(item);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ToDoItem item)
    {
        item.Id = id;
        _repo.Update(item);
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _repo.Delete(id);
        return NoContent();
    }

    [HttpGet("stats")]
    public IActionResult Stats() => Ok(_repo.GetStats());
}