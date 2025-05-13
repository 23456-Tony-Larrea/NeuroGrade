namespace backend_grade_pro.src.Helper
{
    public static class EcuadorGenerateIdgenerator
    {
        public static string Generate()
        {
            var random = new Random();
            var provinceCode = random.Next(1, 25).ToString("D2");
            var thirdDigit = random.Next(0, 6).ToString();
            var randomDigits = random.Next(100000, 999999).ToString();
            var partialId = $"{provinceCode}{thirdDigit}{randomDigits}";

            var total = 0;
            for (int i = 0; i < partialId.Length; i++)
            {
                var digit = int.Parse(partialId[i].ToString());
                if (i % 2 == 0)
                {
                    digit *= 2;
                    if (digit > 9)
                    {
                        digit -= 9;
                    }
                }
                total += digit;
            }

            var checkDigit = (10 - (total % 10)) % 10;
            return $"{partialId}{checkDigit}";
        }
    }
}