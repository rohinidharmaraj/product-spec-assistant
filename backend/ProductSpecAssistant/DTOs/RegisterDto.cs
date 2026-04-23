using System.ComponentModel.DataAnnotations;

namespace ProductSpecAssistant.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage="Email is required")]
        [EmailAddress(ErrorMessage ="Please enter a valid email address!!")]
        public string Email {  get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6,ErrorMessage = "Password must be atleast 6 characters!")]
        public string Password { get; set; }

    }
}
