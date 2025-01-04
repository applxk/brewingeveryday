using CafeAuBrewBackends.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeAuBrewBackends.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;

        [HttpGet]
        public IActionResult GetAllProducts(string? search)
        {
            IQueryable<Product> result = _context.Products;

            if (!string.IsNullOrEmpty(search))
            {
                result = result.Where(x => x.ProdName.Contains(search));
            }

            var list = result.OrderByDescending(x => x.ProdID).ToList();
            var data = list.Select(p => new
            {
                p.ProdID,
                p.ProdName,
                p.ProdImg,
                p.SKU,
                p.Description,
                p.Stock,
                p.Price,
            });

            return Ok(data);
        }

        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            Product? product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            var data = new
            {
                product.ProdID,
                product.ProdName,
                product.ProdImg,
                product.SKU,
                product.Description,
                product.Stock,
                product.Price,
            };

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct([FromForm] Product product, [FromForm] IFormFile prodImg)
        {
            if (prodImg == null || prodImg.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            // Create a unique file name to prevent collisions
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(prodImg.FileName);

            // Define the path to save the image
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

            // Ensure the directory exists
            var directoryPath = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            // Save the file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await prodImg.CopyToAsync(stream);
            }

            // Create the new product object
            var newProduct = new Product
            {
                ProdName = product.ProdName.Trim(),
                ProdImg = fileName, // Store the relative file path or file name
                SKU = product.SKU,
                Description = product.Description.Trim(),
                Stock = product.Stock,
                Price = product.Price,
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            return Ok(newProduct);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product product)
        {
            var existingProduct = _context.Products.Find(id);

            if (existingProduct == null)
            {
                return NotFound();
            }

            existingProduct.ProdName = product.ProdName.Trim();
            existingProduct.ProdImg = product.ProdImg;
            existingProduct.SKU = product.SKU;
            existingProduct.Description = product.Description.Trim();
            existingProduct.Stock = product.Stock;
            existingProduct.Price = product.Price;

            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok();
        }
    }
}