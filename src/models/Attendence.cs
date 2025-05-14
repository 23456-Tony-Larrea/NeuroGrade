namespace backend_grade_pro.src.models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int UserId { get; set; } // ID del estudiante
        public User User { get; set; } // Relación con el estudiante
        public int CourseId { get; set; } // ID del curso
        public Course Course { get; set; } // Relación con el curso
        public DateTime Date { get; set; } // Fecha de la asistencia
        public string Status { get; set; } // "Present", "Absent", "Justified", "Unjustified"
        public string Justification { get; set; } = string.Empty; // Justificación de la falta
        public string JustificationFileUrl { get; set; } = string.Empty; // URL del archivo de justificación
        public int? TeacherId { get; set; } // ID del profesor que justificó (puede ser nulo)
        public User Teacher { get; set; } // Relación con el profesor
    }
}