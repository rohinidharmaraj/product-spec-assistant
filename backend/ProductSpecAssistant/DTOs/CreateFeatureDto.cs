namespace ProductSpecAssistant.DTOs
{
    public class CreateFeatureDto
    {
        public required string Title { get; set; }
        public required string RawIdea { get; set; }
        public int ProductId { get; set; }
    }
}
