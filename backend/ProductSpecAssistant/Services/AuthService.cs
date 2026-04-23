using ProductSpecAssistant.Data;
using ProductSpecAssistant.Models;

namespace ProductSpecAssistant.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }
        public User Register(string email, string password)
        {
            var existing=_context.Users.FirstOrDefault(u => u.Email == email);
            if (existing != null)
                throw new Exception("Email already registered!!!");

            var hash=BCrypt.Net.BCrypt.HashPassword(password);
            var user = new User
            {
                Email = email,
                PasswordHash = hash
            };
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }
        public User Login(string email, string password) { 
            var user=_context.Users.FirstOrDefault(u=>u.Email == email);
            if (user == null)
                throw new Exception("User not found!!!");
            bool isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!isValid)
                throw new Exception("Incorrect password");
            return user;

        }
    }
}
