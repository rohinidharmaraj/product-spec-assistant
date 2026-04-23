using System.Text;
using System.Text.Json;
namespace ProductSpecAssistant.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        public AIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }
        // first spec gen
        public async Task<string> GenerateSpecAsync(string title, string rawIdea,string productName,string productDescription)
        {
            string prompt = $@"
You are a Senior Product Manager.Be concise and specific
Product:{productName}
Product Description:{productDescription}
Feature Title:{title}
Raw Idea:{rawIdea}
Write a short focused spec for this feature.
Each section should be 2-3 lines max.
The spec must relate to the product described above
You MUST include ALL of these sections in the exact  order:
1.Feature Title
2.Problem Statement
3.Background
4.Target Users
5.User Stories(As a [user],I want [goal] so that [benefit])(max 3)
6.Acceptance Criteria(max  4 points)
7.Edge Cases(max 3 points)
8.Success Metrics
BE BRIEF.NO LONG PARAGRPAHS
Write in plain text only.Do not use JSON.Do not skip any section.
";
            string result= await CallHuggingFaceAsync(prompt);
            return result;
        }

        // refine the spec
        public async Task<string> RefineSpecAsync(string previousContent,string instruction,string productName,string productDescription)
        {
            string prompt = $@"
You are updating a product specification.
 
CURRENT SPEC:
{previousContent}
 
CHANGE TO MAKE:
{instruction}
 
Return the complete updated specification with ALL of these 8 sections in order.
Do not skip any section. Do not add any labels or headers outside the sections.
Start your response directly with '1.Feature Title:' and end with '8.Success Metrics'.
 
1.Feature Title
2.Problem Statement
3.Background
4.Target Users
5.User Stories (max 3, format: As a [user], I want [goal] so that [benefit])
6.Acceptance Criteria (max 4 points)
7.Edge Cases (max 3 points)
8.Success Metrics (max 2 points)
 
Output ONLY the spec. No intro. No explanation. No labels outside these 8 sections.
";
            string result= await CallHuggingFaceAsync(prompt);
            return result;

        }
        //hf api call
        public async Task<string> CallHuggingFaceAsync(string prompt)
        {
            var apiKey = _configuration["AI:ApiKey"];
            var apiUrl = _configuration["AI:ApiUrl"];
            // apiKey = "";
            //string apiUrl = "https://router.huggingface.co/v1/chat/completions";
            if (string.IsNullOrEmpty(apiUrl))
                throw new Exception("null apirul");
            if (string.IsNullOrEmpty(apiKey))
                throw new Exception("null apikey");
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            var requestBody = new
            {
                model= "deepseek-ai/DeepSeek-R1:novita",
                messages = new[]
                {
                    new{
                   role="user",
                   content=prompt
                }
                },
                max_tokens=1000,
                temperature=0.2
             };
            var json=JsonSerializer.Serialize(requestBody);
            var content=new StringContent(json,Encoding.UTF8,"application/json");
            var response=await _httpClient.PostAsync(apiUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody=await response.Content.ReadAsStringAsync();
                throw new Exception($"Hugging Face API error:{errorBody}");
            }
            var responseJson=await response.Content.ReadAsStringAsync();   
            using var doc=JsonDocument.Parse(responseJson);
            var generatedText = doc.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();

            return generatedText;

        }
    }
}
