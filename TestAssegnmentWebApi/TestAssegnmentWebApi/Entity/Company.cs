using System.ComponentModel.DataAnnotations;

namespace TestAssegnmentWebApi.Entity
{
    public class Company
    {
        [Key]
        public int IdCompany { get; set; }

        public string CompanyName { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public virtual List<History> Histories { get; set; } = new();

        public virtual List<Employee> Employees { get; set; } = new();

        public virtual List<Note> Notes { get; set; } = new();
    }
}
