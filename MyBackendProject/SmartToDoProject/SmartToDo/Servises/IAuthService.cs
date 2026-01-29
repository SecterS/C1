using SmartToDo.Models;

namespace SmartToDo.Services;

public interface IAuthService
{
    Task<User?> Authenticate(string username, string password);
    string HashPassword(string password);
    Task<User> Register(string username, string password);
}