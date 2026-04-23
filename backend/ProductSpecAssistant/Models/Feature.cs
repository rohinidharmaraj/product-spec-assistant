namespace ProductSpecAssistant.Models
{
    public class Feature
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required string RawIdea { get; set; }
        public required string Title { get; set; }
        public List<FeatureVersion> Versions { get; set; } = new List<FeatureVersion>();
    }
}
