using backend_grade_pro.src.NeuroGrdeAI;
using Microsoft.AspNetCore.Mvc;

namespace backend_grade_pro.src.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly PredictedPosittiveSentimentAndAcademicScore _predictedCommentsGrades;

        public PredictionController(PredictedPosittiveSentimentAndAcademicScore predictedCommentsGrades)
        {
            _predictedCommentsGrades = predictedCommentsGrades;

            // Entrenar los modelos al inicializar el controlador
            _predictedCommentsGrades.TrainAcademicModel();
            _predictedCommentsGrades.TrainSentimentModel();
        }

        /// <summary>
        /// Obtiene todas las predicciones de rendimiento académico.
        /// </summary>
        [HttpGet("PredictAllAcademicPerformance")]
        public IActionResult PredictAllAcademicPerformance()
        {
            var predictions = _predictedCommentsGrades.PredictAllAcademicPerformance();
            return Ok(predictions);
        }

        /// <summary>
        /// Obtiene todas las predicciones de sentimiento.
        /// </summary>
        [HttpGet("PredictAllSentiments")]
        public IActionResult PredictAllSentiments()
        {
            var predictions = _predictedCommentsGrades.PredictAllSentiments();
            return Ok(predictions);
        }
    }
}
