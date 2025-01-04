using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeAuBrewBackends.Models
{
    public class Product
    {
        [Key]
        public int ProdID { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string ProdName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? ProdImg { get; set; }  // Store image file path or URL

        [Required]
        public int SKU { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int Stock { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
    }
}
