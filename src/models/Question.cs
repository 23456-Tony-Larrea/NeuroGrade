using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace backend_grade_pro.src.models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string OptionsJson { get; set; } = "[]"; // Valor por defecto
        public string CorrectAnswer { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        [NotMapped]
        public List<string> Options
        {
            get => string.IsNullOrEmpty(OptionsJson) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(OptionsJson);
            set => OptionsJson = JsonSerializer.Serialize(value);
        }
    }

}
