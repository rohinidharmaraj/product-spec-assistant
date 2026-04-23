namespace ProductSpecAssistant.Models
{
    public class FeatureVersion
    {
        public int Id { get; set; }
        public int FeatureId {  get; set; }
        public int VersionNumber { get; set; }
        public required string Content { get; set; }
        public DateTime Created {  get; set; }
        
    }
}
