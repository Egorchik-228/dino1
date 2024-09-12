using Microsoft.EntityFrameworkCore;
using dino1.Models; // Подключи неймспейс модели

namespace dino1.Data
{
    public class GameContext : DbContext
    {
        public DbSet<GameScore> GameScores { get; set; }

        public GameContext(DbContextOptions<GameContext> options) : base(options) { }
    }
}
