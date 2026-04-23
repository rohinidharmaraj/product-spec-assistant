using ProductSpecAssistant.Data;
using ProductSpecAssistant.Models;
using Microsoft.EntityFrameworkCore;
namespace ProductSpecAssistant.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;
        public ProductService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Product> CreateProduct(string name, string description, int userId)
 
        {
            var product = new Product
            {
                Name = name,
                Description = description,
                UserId = userId
            };
            _context.Products.Add(product);
            _context.SaveChanges();
            return product;
        }
        public List<Product> GetProducts(int userId)
        {
            return _context.Products.Where(p=>p.UserId == userId).ToList();
        }
        public Product GetProductById(int userId, int productId)
        {
            return _context.Products.FirstOrDefault(p=>p.Id==productId && p.UserId==userId);
        }

        public bool DeleteProduct(int productId,int userId)
        {
            var product = _context.Products.Include(p=>p.Features).ThenInclude(f=>f.Versions).FirstOrDefault(p => p.Id == productId && p.UserId == userId);
            if (product == null)
                return false;
            _context.Products.Remove(product);
            _context.SaveChanges();
            return true;
        }
    }
}
