using Microsoft.EntityFrameworkCore;
using TestAssegnmentWebApi.Entity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors();

builder.Services.AddDbContext<Context>(option => option.UseInMemoryDatabase("Base").UseLazyLoadingProxies());

var app = builder.Build();

app.UseCors(cors =>
{
    cors.AllowAnyOrigin();
    cors.AllowAnyMethod();
    cors.AllowAnyHeader();
});

app.UseRouting();

app.UseEndpoints(endpoint => endpoint.MapControllers());

app.Run();
