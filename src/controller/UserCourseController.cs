using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_grade_pro.src.controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCourseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserCourseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("AddUserCoursesRandom")]
        public async Task<IActionResult> AddUserCoursesRandom()
        {
            var userIds = await _context.Users
                .Select(u => u.Id)
                .ToListAsync();

            var courseIds = await _context.Courses
                .Select(c => c.Id)
                .ToListAsync();

            var random = new Random();
            var userCourses = new List<UserCourse>();

            foreach (var userId in userIds)
            {
                var randomCourseId = courseIds[random.Next(courseIds.Count)];
                var userCourseExists = await _context.UserCourses
                    .AnyAsync(uc => uc.UserId == userId && uc.CourseId == randomCourseId);

                if (!userCourseExists)
                {
                    userCourses.Add(new UserCourse { UserId = userId, CourseId = randomCourseId });
                }
            }

            _context.UserCourses.AddRange(userCourses);
            await _context.SaveChangesAsync();

            return Ok("Cursos asignados aleatoriamente a los usuarios.");
        }

        // POST: api/Courses/AddUserCourses
        [HttpGet("UsersExample")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Gender)
                //.Include(u => u.UserCourses)
                //.ThenInclude(uc => uc.Course)
                //.Include(u => u.Answers)
                //.ThenInclude(a => a.Question)
                .ToListAsync();
        }

        // POST: api/Courses/AddCourse
        [HttpPost("AddCourse")]
        public async Task<IActionResult> AddCourse([FromBody] Course course)
        {
            if (course == null)
            {
                return BadRequest("El curso no puede ser nulo.");
            }

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        // Método GET para obtener un curso por ID (necesario para CreatedAtAction)
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }
        [HttpGet("GetUserCourses")]
        public async Task<IActionResult> GetUserCourses()
        {
            var userCourses = await _context.UserCourses
                .Include(uc => uc.User) // Incluye la información del usuario
                .Include(uc => uc.Course) // Incluye la información del curso
                .Select(uc => new
                {
                    UserId = uc.UserId,
                    UserName = uc.User.Name, // Suponiendo que la entidad User tiene una propiedad Name
                    CourseId = uc.CourseId,
                    CourseName = uc.Course.Parallel // Suponiendo que la entidad Course tiene una propiedad Name
                })
                .ToListAsync();

            return Ok(userCourses);
        }

    }
}
