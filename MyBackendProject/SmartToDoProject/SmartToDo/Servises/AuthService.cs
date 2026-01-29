using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SmartToDo.Data;
using SmartToDo.Models;

namespace SmartToDo.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        _context = context;
    }

    public async Task<User?> Authenticate(string username, string password)
    {
        var hash = HashPassword(password);
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == hash);
    }

    public async Task<User> Register(string username, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Username == username))
            throw new Exception("Username already exists");

        var user = new User
        {
            Username = username,
            PasswordHash = HashPassword(password),
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}