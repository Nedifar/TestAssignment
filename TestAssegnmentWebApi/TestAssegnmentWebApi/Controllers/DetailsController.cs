using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using TestAssegnmentWebApi.Entity;

namespace TestAssegnmentWebApi.Controllers
{
    public class DetailsController : Controller
    {
        private readonly Context _db;

        public DetailsController(Context db) => _db = db;

        public async Task<IActionResult> Index(int company)
        {
            var companyDb = await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == company);
            ViewData["company"] = companyDb;
            ViewData["histories"] = companyDb.Histories;
            ViewData["employees"] = companyDb.Employees;
            ViewData["notes"] = companyDb.Notes;
            ViewData["editableEmployee"] = new Employee();
            return View("Details");
        }

        public async Task<IActionResult> Save([FromBody] Company company)
        {
            _db.Update(company);
            _db.SaveChanges();
            var companyDb = await _db.Companies.FirstOrDefaultAsync(p => p.CompanyName == company.CompanyName);
            ViewData["company"] = companyDb;
            ViewData["histories"] = companyDb.Histories;
            ViewData["employees"] = companyDb.Employees;
            ViewData["notes"] = companyDb.Notes;
            ViewData["editableEmployee"] = new Employee();
            return Ok();
        }
    }
}
