namespace backend_grade_pro.src.models
{
    public class PartialGrade
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public int SubjectId { get; set; }
        public double HomeworkScore { get; set; }
        public double ExamScore { get; set; }

        // Clave foránea para Grade
        public int GradeId { get; set; }
        public Grade Grade { get; set; } // Relación de navegación

        public double TotalScore { get; set; }
    }
}