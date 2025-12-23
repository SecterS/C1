using Microsoft.AspNetCore.Mvc;
using SmartToDo.Models;
using SmartToDo.Repositories;

namespace SmartToDo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    private readonly HybridToDoRepository _repo;

    public ToDoController(HybridToDoRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] Category? category, [FromQuery] string? sortBy)
    {
        try
        {
            var tasks = _repo.GetAll(category, sortBy);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] ToDoItem item)
    {
        try
        {
            _repo.Add(item);
            return Ok(item);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ToDoItem item)
    {
        try
        {
            if (id != item.Id) item.Id = id;
            _repo.Update(item);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _repo.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("stats")]
    public IActionResult Stats()
    {
        try
        {
            var stats = _repo.GetStats();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}