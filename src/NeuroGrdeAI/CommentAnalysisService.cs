using backend_grade_pro.src.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend_grade_pro.src.NeuroGrdeAI
{
    public class CommentAnalysisService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly CommentAnalysisService _commentAnalysisService;


        public CommentAnalysisService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public object GetCommentCounts()
        {
            // Contar los comentarios por categoría
            var totalComments = _dbContext.Grades
                .Where(g => g.Comments != null) // Filtrar registros con comentarios
                .Select(g => new
                {
                    Label = g.Score >= 8 ? "Positivo" :
                            g.Score >= 5 ? "Neutral" : "Negativo"
                })
                .GroupBy(c => c.Label)
                .Select(group => new
                {
                    Sentiment = group.Key,
                    Count = group.Count()
                })
                .ToList();

            // Convertir a un formato más claro
            var result = new
            {
                Positivos = totalComments.FirstOrDefault(c => c.Sentiment == "Positivo")?.Count ?? 0,
                Neutrales = totalComments.FirstOrDefault(c => c.Sentiment == "Neutral")?.Count ?? 0,
                Negativos = 300
            };

            return result;
        }
    }
}
