using Microsoft.AspNetCore.Mvc;
using SmartToDo.Models;
using SmartToDo.Services;
using System.Linq; 

namespace SmartToDo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        ArgumentNullException.ThrowIfNull(authService);
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
  
        if (!IsPasswordStrong(request.Password))
        {
            return BadRequest(new { error = "Пароль слишком простой. Нужен минимум 8 символов, цифры и буквы." });
        }

        try
        {
            var user = await _authService.Register(request.Username, request.Password);
            return Ok(new { user.Id, user.Username, user.Role });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }


    private bool IsPasswordStrong(string password)
    {
        if (string.IsNullOrWhiteSpace(password)) return false;
        if (password.Length < 8) return false;               
        if (!password.Any(char.IsDigit)) return false;         
        if (!password.Any(char.IsLetter)) return false;        
        return true;
    }
}

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}