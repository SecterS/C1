using System.Security.Claims;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using SmartToDo.Models;
using SmartToDo.Repositories;

namespace SmartToDo.Controllers;

[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class ToDoController : ControllerBase
{
    private readonly IToDoRepository _repo;

    public ToDoController(IToDoRepository repo)
    {
        ArgumentNullException.ThrowIfNull(repo);
        _repo = repo;
    }


    private int GetCurrentUserId()
    {

        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        
        if (idClaim == null)
            throw new Exception("User ID not found in claims. Auth failed?");

        return int.Parse(idClaim.Value);
    }

    [HttpGet]
    public IActionResult Get([FromQuery] Category? category, [FromQuery] string? sortBy)
    {
        try
        {
            var userId = GetCurrentUserId(); 
            var tasks = _repo.GetAll(userId, category, sortBy); 
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] ToDoItem item)
    {
        if (item == null) return BadRequest("Task is null");

        try
        {

            item.UserId = GetCurrentUserId();
            
            _repo.Add(item);
            return Ok(item);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ToDoItem item)
    {
        if (item == null) return BadRequest("Task is null");

        try
        {

            if (id != item.Id) item.Id = id;
            _repo.Update(item);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
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
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("stats")]
    public IActionResult Stats()
    {
        try
        {
            var userId = GetCurrentUserId();
            var stats = _repo.GetStats(userId); 
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}