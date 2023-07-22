using Microsoft.EntityFrameworkCore;

namespace TestAssegnmentWebApi.Entity
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> option) : base(option)
        {
            Database.EnsureCreated();
        }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<History> Histories { get; set; }

        public DbSet<Note> Notes { get; set; }

        public DbSet<Company> Companies { get; set; }
    }
}
