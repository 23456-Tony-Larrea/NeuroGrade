using backend_grade_pro.src.Data;
using backend_grade_pro.src.DTO;
using backend_grade_pro.src.Services;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using backend_grade_pro.src.Helper;
using Microsoft.Extensions.Configuration;

namespace backend_grade_pro.src.controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;


        public UsersController(IConfiguration configuration, ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;

        }

        [HttpGet("WithGenderAndRole")]
        public async Task<IActionResult> GetUsersWithGenderAndRole()
        {
            var users = await _context.Users
                .Include(u => u.Gender)
                .Include(u => u.Role)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    LastName = u.LastName,
                    SecondName = u.SecondName,
                    SecondLastName = u.SecondLastName,
                    //FullName = u.FullName,
                    Email = u.Email,
                    //Phone = u.Phone,
                    //Age = u.Age,
                    //IsTutor = u.IsTutor,
                    //IsRepresentant = u.IsRepresentant,
                    GenderId = u.GenderId,
                    GenderName = u.Gender != null ? u.Gender.Name : "N/A",
                    RoleId = u.RoleId,
                    RoleName = u.Role != null ? u.Role.Name : "N/A"
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Gender)
                .Include(u => u.UserCourses)
                .ThenInclude(uc => uc.Course)
                .Include(u => u.Answers)
                .ThenInclude(a => a.Question)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost("GenerateUsers")]
        public async Task<IActionResult> GenerateUsers()
        {
            var secretKey = _configuration["Jwt:Key"];

            var firstNames = new List<string>
    {
        "José", "Juan", "Luis", "Carlos", "Jorge", "Manuel", "Antonio", "Pedro", "David", "Alejandro",
        "Francisco", "Ricardo", "Roberto", "Miguel", "Fernando", "Andrés", "Sergio", "Óscar", "Julio", "Eduardo",
        "Daniel", "Gabriel", "Martín", "Diego", "Vicente", "Armando", "Raúl", "Ernesto", "Gustavo", "Jaime",
        "Héctor", "Fabián", "Edwin", "Iván", "Marco", "Mauricio", "Salvador", "Moisés", "Patricio", "Alberto",
        "Esteban", "Guillermo", "Alfonso", "Mariano", "Rodrigo", "Adrián", "Sebastián", "Matías", "Cristian", "Eloy",
        "María", "Ana", "Carmen", "Luisa", "Rosa", "Isabel", "Patricia", "Claudia", "Adriana", "Andrea",
        "Teresa", "Verónica", "Silvia", "Beatriz", "Ángela", "Karla", "Lucía", "Daniela", "Juana", "Sonia",
        "Elena", "Alicia", "Gabriela", "Mariana", "Carolina", "Fabiola", "Inés", "Mónica", "Rebeca", "Norma",
        "Pamela", "Cecilia", "Esther", "Lourdes", "Irene", "Rosaura", "Julia", "Antonia", "Raquel", "Nadia",
        "Rosario", "Victoria", "Sandra", "Fernanda", "Carla", "Lorena", "Mara", "Emilia", "Pilar", "Noelia"
    };

            var lastNames = new List<string>
    {
        "García", "Pérez", "Rodríguez", "González", "Martínez", "López", "Sánchez", "Díaz", "Herrera", "Rojas",
        "Castro", "Morales", "Suárez", "Torres", "Ortiz", "Ramírez", "Jiménez", "Flores", "Mendoza", "Delgado",
        "Romero", "Cabrera", "Aguirre", "Reyes", "Acosta", "Vargas", "Molina", "Cruz", "Ponce", "Valdez",
        "Vega", "Escobar", "Fuentes", "Lozano", "Cevallos", "Cordero", "Andrade", "Maldonado", "Salcedo", "Zambrano",
        "Carrasco", "Quintana", "Ortega", "Naranjo", "Aguayo", "Espinoza", "Barrera", "Caballero", "Cortés", "Páez",
        "Acosta", "Aguilar", "Alvarado", "Andrade", "Angulo", "Ankuash", "Aguirre", "Aguayo", "Alfonso", "Almeida",
        "Alvarado", "Alvarez", "Andrade", "Andi", "Arias", "Armijos", "Ballesteros", "Barrera", "Benavides", "Bermúdez",
        "Bolaños", "Caballero", "Cabrera", "Caicedo", "Calle", "Calvache", "Cando", "Cangá", "Cano", "Cárdenas",
        "Carrasco", "Carrión", "Cartagena", "Castillo", "Cedeño", "Cevallos", "Chávez", "Chicaiza", "Chiriboga", "Chisaguano",
        "Cisneros", "Constante", "Cordero", "Cornejo", "Cortés", "Crespo", "Cruz", "Cuji", "Dávila", "Delgado",
        "Domínguez", "Enríquez", "Espinoza", "Estrella", "Fajardo", "Falconí", "Farías", "Fernández", "Figueroa", "Flores",
        "Freire", "Gaibor", "Gallegos", "García", "Gavilánez", "Gil", "Gómez", "González", "Gorozabel", "Granda",
        "Grefa", "Gualinga", "Guamán", "Guerrero", "Guzmán", "Hidalgo", "Hoyos", "Ibarra", "Intriago", "Jaramillo",
        "Jiménez", "Jimpikit", "Lara", "Lema", "León", "López", "Loor", "Lozano", "Macías", "Maldonado",
        "Marmol", "Martínez", "Masaquiza", "Medina", "Mendoza", "Minchala", "Molina", "Moncayo", "Montenegro", "Mora"
    };

            var roles = await _context.Roles.ToListAsync();
            var gender = await _context.Genders.FirstAsync(g => g.Name == "Masculino");

            var users = new List<User>();
            var random = new Random();

            for (int i = 0; i < 350; i++)
            {
                var firstName = firstNames[random.Next(firstNames.Count)];
                var secondName = firstNames[random.Next(firstNames.Count)];
                var lastName = lastNames[i % lastNames.Count];
                var secondLastName = lastNames[(i + 1) % lastNames.Count];
                var email = $"{firstName[0].ToString().ToLower()}{lastName.ToLower()}@gmail.com";
                var passwordHash = BCrypt.Net.BCrypt.HashPassword("123456");
                var identityCard = EcuadorGenerateIdgenerator.Generate();

                var role = roles.First(r => r.Name == "Estudiante");
                if (i < 23)
                {
                    role = roles.First(r => r.Name == "Profesor");
                }
                else if (i < 2)
                {
                    role = roles.First(r => r.Name == "SuperAdministrador");
                }
                else if (i < 25)
                {
                    role = roles.First(r => r.Name == "Representante");
                }

                var user = new User
                {
                    Name = firstName,
                    SecondName = secondName,
                    LastName = lastName,
                    SecondLastName = secondLastName,
                    Email = email,
                    Password = passwordHash,
                    IsActive = true,
                    RoleId = role.Id,
                    GenderId = gender.Id,
                    identity_user = identityCard
                };

                user.Token = JwtTokenGenerator.GenerateToken(user, secretKey);

                users.Add(user);
            }

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            return Ok("Usuarios generados exitosamente.");
        }


        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCreatedto userDto)
        {
            var password = GenerateRandomPassword();
            if (!ValidatePassword(password))
            {
                return BadRequest("La contraseña debe contener al menos una letra, un número y un carácter especial.");
            }

            var user = new User
            {
                Name = userDto.Name,
                LastName = userDto.LastName,
                SecondName = userDto.SecondName,
                SecondLastName = userDto.SecondLastName,
                identity_user = userDto.Identity,
                Email = userDto.Email,
                Phone = userDto.Phone,
                Age = userDto.Age,
                IsTutor = userDto.IsTutor,
                IsRepresentant = userDto.IsRepresentant,
                RoleId = userDto.RoleId,
                GenderId = userDto.GenderId,
                Photo = userDto.Photo,
                TutorInfoJson = userDto.TutorInfoJson,
                Password = AuthHelper.HashPassword(password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Guardar el historial de contraseñas
            _context.PasswordHistories.Add(new PasswordHistory
            {
                UserId = user.Id,
                PasswordHash = user.Password,
                CreatedAt = DateTime.UtcNow
            });

            // Asignar cursos opcionales
            if (userDto.CourseIds != null)
            {
                foreach (var courseId in userDto.CourseIds)
                {
                    _context.UserCourses.Add(new UserCourse { UserId = user.Id, CourseId = courseId });
                }
            }

            // Asignar quizzes opcionales
            if (userDto.QuizIds != null)
            {
                foreach (var quizId in userDto.QuizIds)
                {
                    _context.Answers.Add(new Answer { UserId = user.Id, QuestionId = quizId });
                }
            }

            await _context.SaveChangesAsync();

            // Enviar correo electrónico de bienvenida
            _emailService.SendWelcomeEmail(user.Email, user.Name, password);

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDTO userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (!ValidatePassword(userDto.Password))
            {
                return BadRequest("La contraseña debe contener al menos una letra, un número y un carácter especial.");
            }

            // Verificar si la nueva contraseña ya ha sido utilizada
            var passwordHistory = await _context.PasswordHistories
                .Where(ph => ph.UserId == id)
                .OrderByDescending(ph => ph.CreatedAt)
                .FirstOrDefaultAsync();

            if (passwordHistory != null && AuthHelper.VerifyPassword(userDto.Password, passwordHistory.PasswordHash))
            {
                return BadRequest("No se puede reutilizar la contraseña anterior.");
            }

            user.Name = userDto.Name;
            user.LastName = userDto.LastName;
            user.SecondName = userDto.SecondName;
            user.SecondLastName = userDto.SecondLastName;
            user.identity_user = userDto.Identity;
            user.Email = userDto.Email;
            user.Phone = userDto.Phone;
            user.Age = userDto.Age;
            user.IsTutor = userDto.IsTutor;
            user.IsRepresentant = userDto.IsRepresentant;
            user.RoleId = userDto.RoleId;
            user.GenderId = userDto.GenderId;
            user.Photo = userDto.Photo;
            user.TutorInfoJson = userDto.TutorInfoJson;
            user.Password = AuthHelper.HashPassword(userDto.Password);

            _context.Entry(user).State = EntityState.Modified;

            // Guardar el historial de contraseñas
            _context.PasswordHistories.Add(new PasswordHistory
            {
                UserId = user.Id,
                PasswordHash = user.Password,
                CreatedAt = DateTime.UtcNow
            });

            // Actualizar cursos opcionales
            if (userDto.CourseIds != null)
            {
                var existingCourses = _context.UserCourses.Where(uc => uc.UserId == id).ToList();
                _context.UserCourses.RemoveRange(existingCourses);

                foreach (var courseId in userDto.CourseIds)
                {
                    _context.UserCourses.Add(new UserCourse { UserId = user.Id, CourseId = courseId });
                }
            }

            // Actualizar quizzes opcionales
            if (userDto.QuizIds != null)
            {
                var existingAnswers = _context.Answers.Where(a => a.UserId == id).ToList();
                _context.Answers.RemoveRange(existingAnswers);

                foreach (var quizId in userDto.QuizIds)
                {
                    _context.Answers.Add(new Answer { UserId = user.Id, QuestionId = quizId });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private bool ValidatePassword(string password)
        {
            var hasLetter = new Regex(@"[a-zA-Z]+");
            var hasDigit = new Regex(@"[0-9]+");
            var hasSpecialChar = new Regex(@"[\W]+");

            return hasLetter.IsMatch(password) && hasDigit.IsMatch(password) && hasSpecialChar.IsMatch(password);
        }

        private string GenerateRandomPassword()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}

