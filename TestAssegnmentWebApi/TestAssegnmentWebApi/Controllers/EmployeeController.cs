using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestAssegnmentWebApi.Entity;

namespace TestAssegnmentWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly Context _db;

        public EmployeeController(Context db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetEmployeesFromCompany(int id)
        {
            var employees = (await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == id)).Employees;
            return Ok(employees.Select(p => new
            {
                p.IdEmployee,
                p.LastName,
                p.FirstName
            }));
        }

        [HttpGet]
        [Route("simple")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _db.Employees.FirstOrDefaultAsync(p => p.IdEmployee == id);
            return Ok(new
            {
                employee.IdEmployee,
                employee.LastName,
                employee.FirstName,
                employee.Title,
                employee.BirthDate,
                employee.Position
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee(AddEditEmployeeVM vM)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == vM.idCompany);
            company.Employees.Add(new Employee
            {
                FirstName = vM.firstName,
                LastName = vM.lastName,
                Position = vM.position,
                BirthDate = vM.birthDate,
                Title = vM.title
            });
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("edit")]
        public async Task<IActionResult> EditEmployee(AddEditEmployeeVM vM)
        {
            var editableEmployee = await _db.Employees.FirstOrDefaultAsync(p => p.IdEmployee == vM.idEmployee);

            editableEmployee.FirstName = vM.firstName;
            editableEmployee.LastName = vM.lastName;
            editableEmployee.Position = vM.position;
            editableEmployee.BirthDate = vM.birthDate;
            editableEmployee.Title = vM.title;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("delete")]
        public async Task<IActionResult> DeleteEmployee(DeleteEmployeeVM vM)
        {
            var editableEmployee = await _db.Employees.FirstOrDefaultAsync(p => p.IdEmployee == vM.idEmployee);
            _db.Employees.Remove(editableEmployee);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    public record AddEditEmployeeVM(int idCompany, int idEmployee, string firstName, string lastName, string position, DateTime birthDate, string title);
    public record DeleteEmployeeVM(int idEmployee);
}
