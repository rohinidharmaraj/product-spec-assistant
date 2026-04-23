using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
namespace ProductSpecAssistant.Filters
{
    public class AuthFilter:Attribute,IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            var hasUserId = context.HttpContext.Request.Headers.TryGetValue("X-User-Id", out var userIdValue);
            if (!hasUserId || !int.TryParse(userIdValue, out int userId))
            {
                context.Result = new UnauthorizedObjectResult("You must be logged in");
                return;
            }
            context.HttpContext.Items["UserId"] = userId;
        }
        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
