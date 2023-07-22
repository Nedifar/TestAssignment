using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestAssegnmentWebApi.Entity
{
    public class History
    {
        [Key]
        public int IdHistory { get; set; }

        public DateTime OrderDate { get; set; }

        public string StoreCity { get; set; }

        [ForeignKey("Company")]
        public int IdCompany { get; set; }

        public virtual Company Company { get; set; }
    }
}
