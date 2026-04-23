using ProductSpecAssistant.Data;
using ProductSpecAssistant.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductSpecAssistant.Services
{
    public class FeatureService
    {
        private readonly AppDbContext _context;
        private readonly AIService _aiService;

        public FeatureService(AppDbContext context, AIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }
        public async Task<FeatureVersion> CreateFeatureAsync(string title, string rawIdea, int productId, int userId)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == productId && p.UserId == userId);

            if (product == null)
                throw new Exception("Access denied");

            var feature = new Feature
            {
                Title = title,
                RawIdea = rawIdea,
                ProductId = productId
            };

            string aiContent = await _aiService.GenerateSpecAsync(
                title,
                rawIdea,
                product.Name,
                product.Description
            );

            _context.Features.Add(feature);
            _context.SaveChanges();

            var version = new FeatureVersion
            {
                FeatureId = feature.Id,
                VersionNumber = 1,
                Content = aiContent
            };

            _context.FeatureVersions.Add(version);
            _context.SaveChanges();

            return version;
        }
        public async Task<FeatureVersion> RefineFeatureAsync(int featureId, string instruction, int userId)
        {
            var feature = _context.Features
                .Include(f => f.Versions)
                .FirstOrDefault(f => f.Id == featureId);

            if (feature == null)
                throw new Exception("Feature not found");

            var product = _context.Products
                .FirstOrDefault(p => p.Id == feature.ProductId && p.UserId == userId);

            if (product == null)
                throw new Exception("Access denied");

            var latestVersion = feature.Versions
                .OrderByDescending(v => v.VersionNumber)
                .First();

            string refinedContent = await _aiService.RefineSpecAsync(
                latestVersion.Content,
                instruction,
                product.Name,
                product.Description
            );

            var newVersion = new FeatureVersion
            {
                FeatureId = feature.Id,
                VersionNumber = latestVersion.VersionNumber + 1,
                Content = refinedContent
            };

            _context.FeatureVersions.Add(newVersion);
            _context.SaveChanges();

            return newVersion;
        }
        public Feature GetFeatureById(int featureId, int userId)
        {
            var feature = _context.Features
                .Include(f => f.Versions)
                .FirstOrDefault(f => f.Id == featureId);

            if (feature == null)
                return null;

            var product = _context.Products
                .FirstOrDefault(p => p.Id == feature.ProductId && p.UserId == userId);

            if (product == null)
                return null;

            return feature;
        }
        public List<Feature> GetFeaturesByProduct(int productId, int userId)
        {
            var product = _context.Products
                .FirstOrDefault(p => p.Id == productId && p.UserId == userId);

            if (product == null)
                return new List<Feature>();

            return _context.Features
                .Include(f => f.Versions)
                .Where(f => f.ProductId == productId)
                .ToList();
        }
        public void DeleteFeature(int featureId, int userId)
        {
            var feature = _context.Features
                .Include(f => f.Versions)
                .FirstOrDefault(f => f.Id == featureId);

            if (feature == null)
                throw new Exception("Feature not found");

            var product = _context.Products
                .FirstOrDefault(p => p.Id == feature.ProductId && p.UserId == userId);

            if (product == null)
                throw new Exception("Access denied");

            _context.FeatureVersions.RemoveRange(feature.Versions);
            _context.Features.Remove(feature);
            _context.SaveChanges();
        }
    }
}
