using Microsoft.EntityFrameworkCore;
using SmartToDo.Data;
using SmartToDo.Repositories;

var builder = WebApplication.CreateBuilder(args);


AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IToDoRepository, HybridToDoRepository>();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.MapControllers();
app.Run();