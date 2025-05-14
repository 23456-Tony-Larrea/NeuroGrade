using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_grade_pro.src.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendenceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendenceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("GenerateAttendance")]
        public async Task<IActionResult> GenerateAttendance()
        {
            // Obtener todos los UserId
            var userIds = await _context.Users
                .Where(u => u.IsActive) // Filtrar solo usuarios activos
                .Select(u => u.Id)
                .ToListAsync();

            if (!userIds.Any())
            {
                return BadRequest("No hay usuarios activos en la base de datos.");
            }

            // Fecha de inicio y fin
            var startDate = new DateTime(2025, 1, 1);
            var endDate = DateTime.Now;

            // Lista para almacenar las asistencias generadas
            var attendances = new List<Attendance>();

            // Generar asistencias para cada usuario
            foreach (var userId in userIds)
            {
                var currentDate = startDate;

                while (currentDate <= endDate)
                {
                    // Excluir sábados y domingos
                    if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                    {
                        // Generar un estado aleatorio para la asistencia
                        var random = new Random();
                        var statusOptions = new[] { "Present", "Absent", "Justified", "Unjustified" };
                        var randomStatus = statusOptions[random.Next(statusOptions.Length)];

                        // Generar un CourseId aleatorio entre 2 y 6
                        var randomCourseId = random.Next(2, 7);

                        // Crear el registro de asistencia
                        attendances.Add(new Attendance
                        {
                            UserId = userId,
                            CourseId = randomCourseId, // Asignar un CourseId válido
                            Date = currentDate,
                            Status = randomStatus,
                            Justification = randomStatus == "Justified" ? "Justificación automática" : null,
                            JustificationFileUrl = randomStatus == "Justified" ? "http://example.com/justification.pdf" : null,
                            TeacherId = randomStatus == "Justified" ? 1 : (int?)null // Puedes ajustar el TeacherId según sea necesario
                        });
                    }

                    // Avanzar al siguiente día
                    currentDate = currentDate.AddDays(1);
                }
            }

            // Guardar las asistencias en la base de datos
            _context.Attendances.AddRange(attendances);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Asistencias generadas exitosamente.", UserCount = userIds.Count });
        }

    }
}
