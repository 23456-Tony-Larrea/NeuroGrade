using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_grade_pro.src.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizesController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpPost("GenerateQuizzes")]
        public async Task<IActionResult> GenerateQuizzes()
        {
            var quizTitles = new List<string>
            {
                "Parcial 1",
                "Parcial 2",
                "Parcial 3",
                "Prueba 1",
                "Prueba 2",
                "Prueba 3",
                "Examen 1",
                "Examen 2",
                "Examen 3",
                "Examen orientado a análisis de sentimientos",
                "Parcial 4",
                "Prueba 4",
                "Examen 4",
                "Parcial 5",
                "Prueba 5"
            };

            var random = new Random();
            var courseIds = new[] { 2, 3, 4, 5, 6 }; // IDs de cursos disponibles
            var teacherIds = await _context.Users
                .Where(u => u.Role.Name == "Profesor")
                .Select(u => u.Id)
                .ToListAsync(); // IDs de profesores disponibles

            if (!teacherIds.Any())
            {
                return BadRequest("No hay profesores disponibles en la base de datos.");
            }

            var quizzes = new List<Quiz>();

            foreach (var title in quizTitles)
            {
                quizzes.Add(new Quiz
                {
                    Title = title,
                    CourseId = courseIds[random.Next(courseIds.Length)], // Asignar un CourseId aleatorio
                    TeacherId = teacherIds[random.Next(teacherIds.Count)], // Asignar un TeacherId aleatorio
                    State = title == "Examen orientado a análisis de sentimientos", // Solo este título tiene estado true
                    Questions = new List<Question>() // Inicializar la colección de preguntas vacía
                });
            }

            _context.Quizzes.AddRange(quizzes);
            await _context.SaveChangesAsync();

            return Ok($"{quizzes.Count} quizes generados con éxito.");
        }
    }
}
