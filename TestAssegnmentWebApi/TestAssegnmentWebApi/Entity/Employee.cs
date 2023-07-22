using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestAssegnmentWebApi.Entity
{
    public class Employee
    {
        [Key]
        public int IdEmployee { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string FullName => FirstName + " " + LastName;

        public string Title { get; set; }

        public DateTime BirthDate { get; set; }

        public string Position { get; set; }

        [ForeignKey("Company")]
        public int IdComapny { get; set; }

        public virtual Company Company { get; set; }
    }
}
