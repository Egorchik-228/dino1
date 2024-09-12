namespace dino1.Models
{
    public class GameScore
    {
        public int Id { get; set; }          // Идентификатор
        public int Score { get; set; }       // Количество баллов
        public DateTime PlayedAt { get; set; } // Время игры
    }
}
