using Microsoft.AspNetCore.Mvc;
using ProductSpecAssistant.DTOs;
using ProductSpecAssistant.Services;
using ProductSpecAssistant.Filters;
namespace ProductSpecAssistant.Controllers
{

    [ApiController]
    [Route("api/products")]
    [AuthFilter]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public IActionResult CreateProduct([FromBody] CreateProductDto dto)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var product = _productService.CreateProduct(dto.Name, dto.Description, userId);
            return Ok(product);
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            var userId = (int)HttpContext.Items["UserId"];

            var products = _productService.GetProducts(userId);
            return Ok(products);
        }

        [HttpGet("{productId}")]
        public IActionResult GetProductById(int productId)
        {
            var userId = (int)HttpContext.Items["UserId"];

            var product = _productService.GetProductById(userId,productId);

            if (product == null)
                return NotFound("Product not found");

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var userId = (int)HttpContext.Items["UserId"];

            _productService.DeleteProduct(id, userId);
            return Ok(new { message = "Deleted" });
        }
    }
}
