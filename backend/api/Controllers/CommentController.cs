using api.Dtos.Comment;
using api.Extensions;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;
        private readonly IStockRepository _stockRepo;
        private readonly UserManager<AppUser> _userManager;

        public CommentController(
            ICommentRepository commentRepo,
            IStockRepository stockRepo,
            UserManager<AppUser> userManager)
        {
            _commentRepo = commentRepo;
            _stockRepo = stockRepo;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentRepo.GetAllAsync();
            return Ok(comments.Select(c => c.ToCommentDto()));
        }

        [HttpGet("stock/{stockId:int}")]
        [Authorize]
        public async Task<IActionResult> GetByStock([FromRoute] int stockId)
        {
            if (!await _stockRepo.StockExists(stockId))
                return NotFound("Stock not found");

            var comments = await _commentRepo.GetByStockIdAsync(stockId);
            return Ok(comments.Select(c => c.ToCommentDto()));
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetbyId([FromRoute] int id)
        {
            var comment = await _commentRepo.GetByIdAsync(id);
            if (comment == null) return NotFound();
            return Ok(comment.ToCommentDto());
        }

        [HttpPost("{stockId:int}")]
        [Authorize]
        public async Task<IActionResult> Create([FromRoute] int stockId, [FromBody] CreateCommentDto commentDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!await _stockRepo.StockExists(stockId))
                return BadRequest("Stock not found");

            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username!);
            if (appUser == null) return Unauthorized();

            var commentModel = commentDto.ToCommentFromCreate(stockId, appUser.Id);
            await _commentRepo.CreateAsync(commentModel);

            // Re-fetch so AppUser navigation is populated for the response
            var created = await _commentRepo.GetByIdAsync(commentModel.Id);
            return CreatedAtAction(nameof(GetbyId), new { id = commentModel.Id }, created!.ToCommentDto());
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentRequestDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _commentRepo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username!);
            if (appUser == null || existing.AppUserId != appUser.Id)
                return Forbid();

            var updated = await _commentRepo.UpdateAsync(id, updateDto.ToCommentFromUpdate());
            return Ok(updated!.ToCommentDto());
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var existing = await _commentRepo.GetByIdAsync(id);
            if (existing == null) return NotFound("Comment does not exist");

            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username!);
            if (appUser == null || existing.AppUserId != appUser.Id)
                return Forbid();

            await _commentRepo.DeleteAsync(id);
            return Ok();
        }
    }
}