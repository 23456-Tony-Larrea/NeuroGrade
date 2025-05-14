using backend_grade_pro.src.Data;
using Microsoft.ML;
using Microsoft.ML.Data;
using System;

namespace backend_grade_pro.src.NeuroGrdeAI
{
    public class PredictedPosittiveSentimentAndAcademicScore
    {
    
        private readonly MLContext _mlContext;
        private readonly ApplicationDbContext _dbContext;
        private ITransformer _academicModel;
        private ITransformer _sentimentModel;

        public PredictedPosittiveSentimentAndAcademicScore(ApplicationDbContext dbContext)
        {
            _mlContext = new MLContext();
            _dbContext = dbContext;
        }

        // Entrenar modelo de rendimiento académico
        public (ITransformer Model, IEnumerable<AcademicData> TrainingData) TrainAcademicModel()
        {
       
            var trainingData = DataModelAcademic();

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);

            // Pipeline de entrenamiento
            var pipeline = _mlContext.Transforms
                .Conversion.ConvertType(outputColumnName: "MonthFloat", inputColumnName: nameof(AcademicData.Month), outputKind: DataKind.Single) // Convertir Month a float
                .Append(_mlContext.Transforms.Concatenate("Features", "MonthFloat", nameof(AcademicData.Score))) // Concatenar columnas
                .Append(_mlContext.Transforms.CopyColumns(outputColumnName: "Label", inputColumnName: nameof(AcademicData.Performance))) // Mapear Performance a Label
                .Append(_mlContext.Regression.Trainers.Sdca());

            // Entrenar el modelo
            _academicModel = pipeline.Fit(dataView);

            return (_academicModel, trainingData);
        }

        // Entrenar modelo de sentimiento positivo
        public (ITransformer Model, IEnumerable<SentimentData> TrainingData) TrainSentimentModel()
        {
            // Cargar datos desde la base de datos
            var trainingData = _dbContext.Grades
                .Where(g => g.Comments != null)
                .Select(g => new SentimentData
                {
                    Comment = g.Comments,
                    Label = g.Score >= 8 
                })
                .ToList();

            if (!trainingData.Any())
            {
                throw new InvalidOperationException("No hay datos suficientes para entrenar el modelo.");
            }

            var dataView = _mlContext.Data.LoadFromEnumerable(trainingData);

            // Pipeline de entrenamiento
            var pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(SentimentData.Comment))
                .Append(_mlContext.BinaryClassification.Trainers.SdcaLogisticRegression());

            // Entrenar el modelo
            _sentimentModel = pipeline.Fit(dataView);

            return (_sentimentModel, trainingData);
        }


        // Predicción de rendimiento académico sin filtros
        public IEnumerable<AcademicPrediction> PredictAllAcademicPerformance()
        {
            if (_academicModel == null)
            {
                throw new InvalidOperationException("El modelo de rendimiento académico no está entrenado.");
            }

            var predictionEngine = _mlContext.Model.CreatePredictionEngine<AcademicData, AcademicPrediction>(_academicModel);
            var trainingData = DataModelAcademic();

            return trainingData.Select(data => predictionEngine.Predict(data));
        }

        // Predicción de sentimiento positivo sin filtros
        public IEnumerable<SentimentPrediction> PredictAllSentiments()
        {
            if (_sentimentModel == null)
            {
                throw new InvalidOperationException("El modelo de sentimiento no está entrenado.");
            }

            var predictionEngine = _mlContext.Model.CreatePredictionEngine<SentimentData, SentimentPrediction>(_sentimentModel);
            var trainingData = _dbContext.Grades
                .Where(g => g.Comments != null)
                .Select(g => new SentimentData
                {
                    Comment = g.Comments,
                    Label = g.Score >= 8 
                })
                .ToList();

            return trainingData.Select(data => predictionEngine.Predict(data));
        }

        private IEnumerable<AcademicData> DataModelAcademic()
        {
            var random = new Random();
            var data = new List<AcademicData>();

            for (int month = 1; month <= 5; month++) // Enero a mayo
            {
                for (int i = 0; i < 100; i++) // 100 estudiantes por mes
                {
                    data.Add(new AcademicData
                    {
                        Month = month,
                        Score = random.Next(1, 11), // Calificaciones entre 1 y 10
                        Performance = random.Next(50, 100) // Rendimiento entre 50% y 100%
                    });
                }
            }

            return data;
        }

        // Clases para el modelo de rendimiento académico
        public class AcademicData
        {
            public int Month { get; set; }
            public float Score { get; set; }
            public float Performance { get; set; }
        }

        public class AcademicPrediction
        {
            [ColumnName("Score")]
            public float PredictedPerformance { get; set; }
        }

        // Clases para el modelo de sentimiento positivo
        public class SentimentData
        {
            public string Comment { get; set; }
            public bool Label { get; set; } // 1 = Positivo, 0 = No positivo
        }

        public class SentimentPrediction
        {
            [ColumnName("PredictedLabel")]
            public bool PredictedLabel { get; set; }

            [ColumnName("Score")]
            public float Score { get; set; } // Puntaje de confianza
        }
    }
}
