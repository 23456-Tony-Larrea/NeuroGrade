using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_grade_pro.src.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PartialGradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PartialGradesController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpPost("GenerateGradesForAllStudents")]
        public async Task<IActionResult> GenerateGradesForAllStudents()
        {
            // Obtener todos los estudiantes activos
            var students = await _context.Users
                .Where(u => u.RoleId != 6 && u.IsActive) // Filtrar solo estudiantes activos
                .Select(u => u.Id) // Obtener solo los IDs
                .ToListAsync();

            // Obtener todos los cursos y materias existentes
            var courseIds = await _context.Courses
                .Where(c => c.Id >= 2 && c.Id <= 6) // Filtrar cursos con Id entre 2 y 6
                .Select(c => c.Id)
                .ToListAsync();

            var subjectIds = await _context.Subjects.Select(s => s.Id).ToListAsync();

            // Obtener todos los GradeId disponibles
            var gradeIds = await _context.Grades.Select(g => g.Id).ToListAsync();
            if (!gradeIds.Any())
            {
                return BadRequest("No hay registros en la tabla Grades.");
            }

            if (!students.Any() || !courseIds.Any() || !subjectIds.Any())
            {
                return BadRequest("No hay suficientes datos en la base de datos para generar calificaciones.");
            }

            // Generar calificaciones para cada estudiante
            var random = new Random();
            var partialGrades = new List<PartialGrade>();

            foreach (var studentId in students)
            {
                foreach (var courseId in courseIds)
                {
                    foreach (var subjectId in subjectIds)
                    {
                        // Seleccionar un GradeId aleatorio
                        var randomGradeId = gradeIds[random.Next(gradeIds.Count)];

                        // Generar calificaciones aleatorias
                        var homeworkScore = random.Next(50, 101) / 10.0; // Calificación entre 5.0 y 10.0
                        var examScore = random.Next(50, 101) / 10.0; // Calificación entre 5.0 y 10.0

                        partialGrades.Add(new PartialGrade
                        {
                            UserId = studentId,
                            CourseId = courseId,
                            SubjectId = subjectId,
                            HomeworkScore = homeworkScore,
                            ExamScore = examScore,
                            GradeId = randomGradeId // Asignar un GradeId aleatorio
                        });
                    }
                }
            }

            // Guardar las calificaciones en la base de datos
            _context.PartialGrades.AddRange(partialGrades);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Se generaron calificaciones para todos los estudiantes.", StudentsCount = students.Count });
        }



    }
}
