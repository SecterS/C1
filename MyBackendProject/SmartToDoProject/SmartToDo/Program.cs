using SmartToDo.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Подключаем контроллеры
builder.Services.AddControllers();

// 2. Включаем наш репозиторий (Singleton = одна база на всё время работы)
builder.Services.AddSingleton<InMemoryToDoRepository>();

// 3. Настройки Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Разрешаем CORS (чтобы фронтенд мог подключиться)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Включаем Swagger и интерфейс
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.MapControllers();

app.Run();