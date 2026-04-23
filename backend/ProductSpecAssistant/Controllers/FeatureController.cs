using Microsoft.AspNetCore.Mvc;
using ProductSpecAssistant.Services;
using ProductSpecAssistant.DTOs;
using ProductSpecAssistant.Data;
using ProductSpecAssistant.Models;
using ProductSpecAssistant.Filters;
using Microsoft.EntityFrameworkCore;

namespace ProductSpecAssistant.Controllers
{

    [ApiController]
    [Route("api/features")]
    [AuthFilter]
    public class FeatureController : ControllerBase
    {
        private readonly FeatureService _featureService;

        public FeatureController(FeatureService featureService)
        {
            _featureService = featureService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeature([FromBody] CreateFeatureDto dto)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var version = await _featureService.CreateFeatureAsync(
                dto.Title,
                dto.RawIdea,
                dto.ProductId,
                userId
            );

            return Ok(version);
        }

        [HttpPost("refine")]
        public async Task<IActionResult> RefineFeature([FromBody] RefineFeatureDto dto)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var newVersion = await _featureService.RefineFeatureAsync(
                dto.FeatureId,
                dto.RefinementInstruction,
                userId
            );

            return Ok(newVersion);
        }

        [HttpGet("{id}")]
        public IActionResult GetFeature(int id)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var feature = _featureService.GetFeatureById(id, userId);

            if (feature == null)
                return NotFound();

            return Ok(feature);
        }

        [HttpGet("product/{productId}")]
        public IActionResult GetFeaturesByProduct(int productId)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var features = _featureService.GetFeaturesByProduct(productId, userId);
            return Ok(features);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFeature(int id)
        {
            var userId = (int)HttpContext.Items["UserId"];

            _featureService.DeleteFeature(id, userId);
            return Ok(new { message = "Deleted" });
        }
    }
}