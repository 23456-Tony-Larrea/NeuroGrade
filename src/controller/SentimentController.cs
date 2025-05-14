using backend_grade_pro.src.Data;
using backend_grade_pro.src.NeuroGrdeAI;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SentimentController : ControllerBase
{
    private readonly PredictedCommentsGrades _sentimentService;

    public SentimentController(ApplicationDbContext dbContext)
    {
        _sentimentService = new PredictedCommentsGrades(dbContext);
    }

    [HttpGet("TrainAndAnalyze")]
    public IActionResult TrainAndAnalyze()
    {
        try
        {
            // Entrenar el modelo
            var (model, trainingData) = _sentimentService.TrainModel();

            // Analizar los comentarios de la base de datos
            var results = new List<object>();
            foreach (var commentData in trainingData)
            {
                var prediction = _sentimentService.Predict(commentData.Comment);
                results.Add(new
                {
                    Comment = commentData.Comment,
                    Sentiment = prediction.PredictedLabel,
                    Score = prediction.Score.Max() // Obtén el puntaje más alto
                });
            }

            // Devolver los datos de entrenamiento y los resultados
            return Ok(new
            {
                TrainingData = trainingData,
                AnalysisResults = results
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
