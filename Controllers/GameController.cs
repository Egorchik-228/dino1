// Controllers/GameController.cs
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using dino1.Data;
using dino1.Models;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameContext _context;

    public GameController(GameContext context)
    {
        _context = context;
    }

    // POST: api/Game/save-score
    [HttpPost("save-score")]
    public async Task<IActionResult> SaveScore([FromBody] GameScore score)
    {
        score.PlayedAt = DateTime.UtcNow; // Устанавливаем время игры
        _context.GameScores.Add(score);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
