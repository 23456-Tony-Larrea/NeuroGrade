using backend_grade_pro.src.Data;
using backend_grade_pro.src.DTO;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_grade_pro.src.controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GradesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Grades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGrades()
        {
            return await _context.Grades
                .Include(g => g.User)
                .Include(g => g.Course)
                .Include(g => g.Subject)
                .Include(g => g.Teacher)
                .ToListAsync();
        }

        // GET: api/Grades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grade>> GetGrade(int id)
        {
            var grade = await _context.Grades
                .Include(g => g.User)
                .Include(g => g.Course)
                .Include(g => g.Subject)
                .Include(g => g.Teacher)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (grade == null)
            {
                return NotFound();
            }

            return grade;
        }

        // POST: api/Grades
        [HttpPost]
        public async Task<ActionResult<Grade>> PostGrade(Grade grade)
        {
            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGrade", new { id = grade.Id }, grade);
        }

        // PUT: api/Grades/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrade(int id, Grade grade)
        {
            if (id != grade.Id)
            {
                return BadRequest();
            }

            _context.Entry(grade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/Grades/Inactivate/5
        [HttpPut("Inactivate/{id}")]
        public async Task<IActionResult> InactivateGrade(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
            {
                return NotFound();
            }

            grade.State = false;
            _context.Entry(grade).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("register")]
        public IActionResult RegisterPartialGrade([FromBody] PartialGradeDTO partialGradeDTO)
        {
            var grade = _context.Grades
                .FirstOrDefault(g => g.UserId == partialGradeDTO.UserId && g.CourseId == partialGradeDTO.CourseId && g.SubjectId == partialGradeDTO.SubjectId);

            if (grade == null)
            {
                grade = new Grade
                {
                    UserId = partialGradeDTO.UserId,
                    CourseId = partialGradeDTO.CourseId,
                    SubjectId = partialGradeDTO.SubjectId,
                    PartialGrades = new List<PartialGrade>()
                };
                _context.Grades.Add(grade);
            }

            var partialGrade = new PartialGrade
            {
                Grade = grade,
                HomeworkScore = partialGradeDTO.HomeworkScore,
                ExamScore = partialGradeDTO.ExamScore
            };

            grade.PartialGrades.Add(partialGrade);
            _context.SaveChanges();

            return Ok(grade);
        }

        [HttpGet("calculate/{userId}/{courseId}/{subjectId}")]
        public IActionResult CalculateFinalScore(int userId, int courseId, int subjectId)
        {
            var grade = _context.Grades
                .FirstOrDefault(g => g.UserId == userId && g.CourseId == courseId && g.SubjectId == subjectId);

            if (grade == null || grade.PartialGrades == null || grade.PartialGrades.Count == 0)
            {
                return NotFound("No grades found for the specified user, course, and subject.");
            }

            var finalScore = grade.CalculateFinalScore();
            return Ok(finalScore);
        }

        private bool GradeExists(int id)
        {
            return _context.Grades.Any(e => e.Id == id);
        }
        // Endpoint para generar 1000 calificaciones aleatorias
        [HttpPost("GenerateRandomGradesForTeachers")]
        public async Task<IActionResult> GenerateRandomGradesForTeachers()
        {
            // Obtener todos los estudiantes (usuarios con RoleId diferente de 6)
            var students = await _context.Users
                .Where(u => u.RoleId != 6 && u.IsActive) // Filtra solo estudiantes activos
                .Select(u => u.Id) // Solo necesitamos los IDs
                .ToListAsync();

            // Obtener todos los profesores activos
            var teachers = await _context.Users
                .Where(u => u.RoleId == 6 && u.IsActive) // Filtra solo profesores activos
                .Select(u => u.Id) // Solo necesitamos los IDs
                .ToListAsync();

            // Obtener todos los IDs de cursos y materias existentes
            var courseIds = await _context.Courses.Select(c => c.Id).ToListAsync();
            var subjectIds = await _context.Subjects.Select(s => s.Id).ToListAsync();

            if (!students.Any() || !teachers.Any() || !courseIds.Any() || !subjectIds.Any())
            {
                return BadRequest("No hay suficientes datos en la base de datos para generar calificaciones.");
            }

            // Generar 3000 calificaciones aleatorias
            var random = new Random();
            var grades = new List<Grade>();

            for (int i = 0; i < 3000; i++)
            {
                var score = random.Next(50, 100) / 10.0; // Calificación final aleatoria entre 5.0 y 10.0
                grades.Add(new Grade
                {
                    UserId = students[random.Next(students.Count)], // Seleccionar un estudiante aleatorio
                    CourseId = courseIds[random.Next(courseIds.Count)], // Seleccionar un curso aleatorio
                    SubjectId = subjectIds[random.Next(subjectIds.Count)], // Seleccionar una materia aleatoria
                    TeacherId = teachers[random.Next(teachers.Count)], // Seleccionar un profesor aleatorio
                    Score = score,
                    Comments = GenerateComment(score), // Generar comentario basado en el score
                    State = true // Estado activo
                });
            }

            // Guardar las calificaciones en la base de datos
            _context.Grades.AddRange(grades);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Se generaron 3000 calificaciones aleatorias.", StudentsCount = students.Count, TeachersCount = teachers.Count });
        }

        // Método para generar comentarios basados en el score
        private string GenerateComment(double score)
        {
            if (score >= 8 && score <= 10)
            {
                return "Excelente rendimiento. ¡Sigue así!";
            }
            else if (score >= 5 && score < 8)
            {
                return "Podrías mejorar. Sigue adelante con esfuerzo.";
            }
            else
            {
                return "Pon más atención y trabaja en tus áreas de oportunidad.";
            }
        }

    }
}