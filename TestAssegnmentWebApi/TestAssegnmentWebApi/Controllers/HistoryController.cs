using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestAssegnmentWebApi.Entity;

namespace TestAssegnmentWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly Context _db;

        public HistoryController(Context db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetHistoriesFromCompany([FromQuery] int id)
        {
            var histories = (await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == id)).Histories;
            return Ok(histories.Select(p=>new
            {
                orderDate = p.OrderDate.ToShortDateString(),
                p.StoreCity
            }));
        }
    }
}
