using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestAssegnmentWebApi.Entity
{
    public class Note
    {
        [Key]
        public int IdNote { get; set; }

        public int InvoiceNumber { get; set; }

        [ForeignKey("Employee")]
        public int IdEmployee { get; set; }

        public virtual Employee Employee { get; set; }
        
        [ForeignKey("Company")]
        public int IdCompany { get; set; }

        public virtual Company Company{ get; set; }
    }
}
