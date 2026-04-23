using System.ComponentModel.DataAnnotations;

namespace ProductSpecAssistant.DTOs
{
    public class CreateProductDto
    {
        
        public required string Name {  get; set; }
        public required string Description { get; set; }
        public int UserId { get; set; }
    }
}
