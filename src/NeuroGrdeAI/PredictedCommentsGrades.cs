using backend_grade_pro.src.Data;
using Microsoft.ML;
using Microsoft.ML.Data;


namespace backend_grade_pro.src.NeuroGrdeAI
{
    public class PredictedCommentsGrades
    {
        private readonly MLContext _mlContext;
        private readonly ApplicationDbContext _dbContext;
        private ITransformer _model;

        public PredictedCommentsGrades(ApplicationDbContext dbContext)
        {
            _mlContext = new MLContext();
            _dbContext = dbContext;
        }

        public (ITransformer Model, IEnumerable<CommentData> TrainingData) TrainModel()
        {
            // Cargar datos desde la base de datos
            var trainingData = _dbContext.Grades
                .Where(g => g.Comments != null) // Filtrar registros con comentarios
                .Select(g => new CommentData
                {
                    Comment = g.Comments,
                    Label = g.Score >= 8 ? "Excelente rendimiento. ¡Sigue así!" :
                            g.Score >= 5 ? "Podrías mejorar. Sigue adelante con esfuerzo." : "Pon más atención y trabaja en tus áreas de oportunidad."
                })
                .ToList();

            if (!trainingData.Any())
            {
                throw new InvalidOperationException("No hay datos suficientes para entrenar el modelo.");
            }

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);

            // Pipeline de entrenamiento
            var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(CommentData.Comment))
                .Append(_mlContext.Transforms.Conversion.MapValueToKey("Label"))
                .Append(_mlContext.MulticlassClassification.Trainers.SdcaMaximumEntropy())
                .Append(_mlContext.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

            // Entrenar el modelo
            _model = pipeline.Fit(dataView);

            return (_model, trainingData);
        }

        public CommentPrediction Predict(string comment)
        {
            if (_model == null)
            {
                throw new InvalidOperationException("El modelo no está entrenado.");
            }

            var predictionEngine = _mlContext.Model.CreatePredictionEngine<CommentData, CommentPrediction>(_model);
            return predictionEngine.Predict(new CommentData { Comment = comment });
        }

        public class CommentData
        {
            public string Comment { get; set; }
            public string Label { get; set; }
        }

        public class CommentPrediction
        {
            [ColumnName("PredictedLabel")]
            public string PredictedLabel { get; set; }

            [ColumnName("Score")]
            public float[] Score { get; set; } // Puntaje de confianza
        }
    }
}
