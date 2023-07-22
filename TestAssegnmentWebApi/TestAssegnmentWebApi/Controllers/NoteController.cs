using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestAssegnmentWebApi.Entity;

namespace TestAssegnmentWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly Context _db;

        public NoteController(Context db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetNotesFromCompany(int id)
        {
            var notes = (await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == id)).Notes;
            return Ok(notes.Select(p => new
            {
                p.InvoiceNumber,
                p.Employee.FullName
            }));
        }

        [HttpPost]
        public async Task<IActionResult> AddNote(AddNoteVM vM)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == vM.idCompany);
            var employee = await _db.Employees.FirstOrDefaultAsync(p => p.IdEmployee == int.Parse(vM.idEmployee));
            company.Notes.Add(new Note
            {
                InvoiceNumber = int.Parse(vM.invoiceNumber),
                IdEmployee = int.Parse(vM.idEmployee)
            });
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteNote(DeleteNoteVM vM)
        {
            var removableNote = await _db.Notes.FirstOrDefaultAsync(p => p.InvoiceNumber == vM.invoiceNumber);
            _db.Notes.Remove(removableNote);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> EditNote(EditNoteVM vM)
        {
            var editableNote = await _db.Notes.FirstOrDefaultAsync(p => p.IdCompany == vM.idNote);
            editableNote.IdEmployee = vM.idEmployee;
            editableNote.InvoiceNumber = vM.invoiceNumber;
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    public record AddNoteVM(string invoiceNumber, string idEmployee, int idCompany);
    public record EditNoteVM(int invoiceNumber, int idEmployee, int idNote);
    public record DeleteNoteVM(int invoiceNumber);
}
