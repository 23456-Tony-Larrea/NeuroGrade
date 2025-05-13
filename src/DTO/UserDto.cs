namespace backend_grade_pro.src.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondName { get; set; }
        public string SecondLastName { get; set; }
        //public string FullName { get; set; }
        public string Email { get; set; }
        //public string Phone { get; set; }
        //public int Age { get; set; }
        //public bool IsTutor { get; set; }
        //public bool IsRepresentant { get; set; }
        public int? GenderId { get; set; }
        public string GenderName { get; set; }
        public int? RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
