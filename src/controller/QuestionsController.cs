using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend_grade_pro.src.controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("GenerateQuestionsForQuiz")]
        public async Task<IActionResult> GenerateQuestionsForQuiz()
        {
            // ID del examen orientado a análisis de datos
            const int quizId = 1; // Cambia este valor al ID real del quiz en tu base de datos

            // Preguntas y opciones
            var questionsData = new List<(string Text, string CorrectAnswer, List<string> Options)>
    {
        ("¿Las clases virtuales son efectivas para tu aprendizaje?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Te sientes motivado durante las clases?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Los materiales de estudio son claros y útiles?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Tienes un espacio adecuado para estudiar en casa?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Puedes mantener la concentración durante las clases?", "No", new List<string> { "Sí", "No" }),
        ("¿El horario de clases se ajusta a tus necesidades?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Recibes retroalimentación útil de tus profesores?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Las evaluaciones reflejan tu nivel de conocimiento?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Te sientes parte de una comunidad de aprendizaje?", "Sí", new List<string> { "Sí", "No" }),
        ("¿Recomendarías este sistema de aprendizaje?", "Sí", new List<string> { "Sí", "No" })
    };

            // Crear preguntas
            var questions = questionsData.Select(q => new Question
            {
                Text = q.Text,
                CorrectAnswer = q.CorrectAnswer,
                QuizId = quizId,
                OptionsJson = JsonSerializer.Serialize(q.Options)
            }).ToList();

            // Agregar preguntas a la base de datos
            _context.Questions.AddRange(questions);
            await _context.SaveChangesAsync();

            return Ok($"{questions.Count} preguntas generadas con éxito para el quiz con ID {quizId}.");
        }


        [HttpPost("GenerateQuestionsForOtherSubjects")]
        public async Task<IActionResult> GenerateQuestionsForOtherSubjects()
        {
            // Datos de preguntas para diferentes materias
            var subjectsQuestions = new Dictionary<int, List<(string Text, string CorrectAnswer, List<string> Options)>>
    {
        {
            2, // ID del quiz de Matemáticas
            new List<(string, string, List<string>)>
            {
                ("¿Cuál es el resultado de 2 + 2?", "4", new List<string> { "3", "4", "5" }),
                ("¿Cuál es el valor de π (pi) aproximado?", "3.14", new List<string> { "3", "3.14", "3.5" }),
                ("¿Cómo se llama un triángulo con tres lados iguales?", "Equilátero", new List<string> { "Isósceles", "Escaleno", "Equilátero" }),
                ("¿Qué es un número primo?", "Un número divisible solo por 1 y por sí mismo", new List<string> { "Un número par", "Un número divisible solo por 1 y por sí mismo", "Un número impar" }),
                ("¿Cuál es el resultado de 5 x 6?", "30", new List<string> { "25", "30", "35" })
            }
        },
        {
            3, // ID del quiz de Historia
            new List<(string, string, List<string>)>
            {
                ("¿En qué año comenzó la Segunda Guerra Mundial?", "1939", new List<string> { "1914", "1939", "1945" }),
                ("¿Quién fue el primer presidente de los Estados Unidos?", "George Washington", new List<string> { "Abraham Lincoln", "George Washington", "Thomas Jefferson" }),
                ("¿Qué civilización construyó las pirámides de Egipto?", "Egipcia", new List<string> { "Romana", "Egipcia", "Griega" }),
                ("¿En qué año llegó Cristóbal Colón a América?", "1492", new List<string> { "1492", "1500", "1600" }),
                ("¿Qué imperio cayó en 476 d.C.?", "Imperio Romano", new List<string> { "Imperio Griego", "Imperio Romano", "Imperio Bizantino" })
            }
        },
        {
            4, // ID del quiz de Ciencias
            new List<(string, string, List<string>)>
            {
                ("¿Qué planeta es conocido como el planeta rojo?", "Marte", new List<string> { "Venus", "Marte", "Júpiter" }),
                ("¿Cuál es la fórmula química del agua?", "H2O", new List<string> { "CO2", "H2O", "O2" }),
                ("¿Qué gas respiramos para sobrevivir?", "Oxígeno", new List<string> { "Nitrógeno", "Oxígeno", "Dióxido de carbono" }),
                ("¿Qué órgano bombea sangre en el cuerpo humano?", "Corazón", new List<string> { "Pulmones", "Cerebro", "Corazón" }),
                ("¿Qué tipo de energía utiliza el Sol?", "Energía nuclear", new List<string> { "Energía térmica", "Energía nuclear", "Energía cinética" })
            }
        }
    };

            var questions = new List<Question>();

            foreach (var subject in subjectsQuestions)
            {
                var quizId = subject.Key;
                var questionsData = subject.Value;

                foreach (var questionData in questionsData)
                {
                    questions.Add(new Question
                    {
                        Text = questionData.Text,
                        CorrectAnswer = questionData.CorrectAnswer,
                        QuizId = quizId,
                        OptionsJson = JsonSerializer.Serialize(questionData.Options)
                    });
                }
            }

            // Agregar preguntas a la base de datos
            _context.Questions.AddRange(questions);
            await _context.SaveChangesAsync();

            return Ok($"{questions.Count} preguntas generadas con éxito para los quizzes de otras materias.");
        }
    }
}
