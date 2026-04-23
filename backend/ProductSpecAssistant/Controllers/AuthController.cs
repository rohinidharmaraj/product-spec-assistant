using Microsoft.AspNetCore.Mvc;
using ProductSpecAssistant.DTOs;
using ProductSpecAssistant.Services;
namespace ProductSpecAssistant.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
       private readonly AuthService _authService;
        public AuthController(AuthService authService) { 
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            try
            {
                var user = _authService.Register(dto.Email, dto.Password);
                return Ok(new { user.Id, user.Email, message = "Registered Successfully!!!" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            try
            {
                var user = _authService.Login(dto.Email, dto.Password);
                return Ok(new { user.Id, user.Email, message = "Login Successful!!!" });
            }
            catch (Exception e) {
                return Unauthorized(e.Message);
            }
        }
    }
}
