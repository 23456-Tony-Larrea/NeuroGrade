using backend_grade_pro.src.NeuroGrdeAI;
using Microsoft.AspNetCore.Mvc;

namespace backend_grade_pro.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentAnalysisController : ControllerBase
    {
        private readonly CommentAnalysisService _commentAnalysisService;

        public CommentAnalysisController(CommentAnalysisService commentAnalysisService)
        {
            _commentAnalysisService = commentAnalysisService;
        }

        [HttpGet("GetCommentCountsAll")]
        public IActionResult GetCommentCountsAll()
        {
            var result = _commentAnalysisService.GetCommentCounts();
            return Ok(result);
        }
    }
}
