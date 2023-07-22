using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using TestAssegnmentWebApi.Entity;

namespace TestAssegnmentWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly Context _db;

        public CompanyController(Context db)
        {
            _db = db;
            if (!_db.Companies.Any())
            {
                db.Companies.AddRange(
                        new Company { Address = "702 SW 8th Street", CompanyName = "Super Mart of the West", City = "Bentonville", State = "Arkansas", Phone = "(800) 555-2797" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Electronics Deport", City = "Atlanta", State = "Georgia", Phone = "(800) 595-3232" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "K&S Music", City = "Minneapolis", State = "Minnesota", Phone = "(612) 304-6073" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Tom's Club", City = "Issaquah", State = "Washington", Phone = "(800) 955-2292" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "E-Mart", City = "Hoffman Estates", State = "Illinois", Phone = "(847) 286-2500" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Walters", City = "Deerfield", State = "Illinois", Phone = "(847) 940-2500" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "StereoShack", City = "Fort Worth", State = "Texas", Phone = "(817) 820-0741" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Circuit Town", City = "Oak Brook", State = "Illinois", Phone = "(800) 955-2929" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Premier Buy", City = "Richfield", State = "Minnesota", Phone = "(612) 291-1000" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "ElectrixMax", City = "Naperville", State = "Illinois", Phone = "(630) 438-7800" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Video Emporium", City = "Dallas", State = "Texas", Phone = "(214) 854-3000" },
                        new Company { Address = "702 SW 8th Street", CompanyName = "Screen Shop", City = "Mooresville", State = "North Carolina", Phone = "(800) 445-6937" });

                db.Employees.AddRange(new Employee { IdComapny = 1, FirstName = "John", LastName = "Heart", Title = "Mr.", BirthDate = new DateTime(1964, 3, 16), Position = "CEO" },
                    new Employee { IdComapny = 1, FirstName = "Mart", LastName = "April", Title = "Mr.", BirthDate = new DateTime(1964, 3, 16), Position = "Manager" },
                    new Employee { IdComapny = 1, FirstName = "Olivia", LastName = "Peyton", Title = "Mrs.", BirthDate = new DateTime(1974, 2, 18), Position = "Developer" },
                    new Employee { IdComapny = 1, FirstName = "Robert", LastName = "Reagan", Title = "Mr.", BirthDate = new DateTime(1984, 7, 28), Position = "Tester" },
                    new Employee { IdComapny = 1, FirstName = "Cynthia", LastName = "Stanwick", Title = "Mrs.", BirthDate = new DateTime(1994, 2, 23), Position = "Best" },
                    new Employee { IdComapny = 2, FirstName = "Max", LastName = "Walker", Title = "Mr.", BirthDate = new DateTime(2000, 9, 6), Position = "King" });

                db.Histories.AddRange(new History { IdCompany = 1, OrderDate = new DateTime(2013, 11, 12), StoreCity = "Las Vegas" },
                    new History { IdCompany = 1, OrderDate = new DateTime(2013, 11, 14), StoreCity = "Las Vegas" },
                    new History { IdCompany = 1, OrderDate = new DateTime(2013, 11, 18), StoreCity = "San Jose" },
                    new History { IdCompany = 1, OrderDate = new DateTime(2013, 11, 22), StoreCity = "Denver" },
                    new History { IdCompany = 1, OrderDate = new DateTime(2013, 11, 30), StoreCity = "Seattle" },
                    new History { IdCompany = 1, OrderDate = new DateTime(2013, 12, 1), StoreCity = "San Jose" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 11, 12), StoreCity = "Las Vegas" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 11, 14), StoreCity = "Las Vegas" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 11, 18), StoreCity = "San Jose" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 11, 22), StoreCity = "Denver" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 11, 30), StoreCity = "Seattle" },
                    new History { IdCompany = 2, OrderDate = new DateTime(2013, 12, 1), StoreCity = "San Jose" });

                db.Notes.AddRange(new Note { IdEmployee = 1, InvoiceNumber = 35703 },
                    new Note { IdEmployee = 1, InvoiceNumber = 35711, IdCompany = 1 },
                    new Note { IdEmployee = 2, InvoiceNumber = 35714, IdCompany = 1 },
                    new Note { IdEmployee = 1, InvoiceNumber = 35983, IdCompany = 1 },
                    new Note { IdEmployee = 3, InvoiceNumber = 35987, IdCompany = 1 },
                    new Note { IdEmployee = 1, InvoiceNumber = 38466, IdCompany = 1 },
                    new Note { IdEmployee = 4, InvoiceNumber = 35234, IdCompany = 1 },
                    new Note { IdEmployee = 5, InvoiceNumber = 35325, IdCompany = 2 },
                    new Note { IdEmployee = 6, InvoiceNumber = 35351, IdCompany = 2 });

                db.SaveChanges();
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _db.Companies.ToListAsync();
            return Ok(companies.Select(p => new
            {
                p.IdCompany,
                p.State,
                p.City,
                p.CompanyName,
                p.Phone
            }
            ));
        }

        [HttpGet]
        [Route("simple")]
        public async Task<IActionResult> GetCompany([FromQuery] int id)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == id);
            return Ok(new
            {
                company.IdCompany,
                company.State,
                company.City,
                company.CompanyName,
                company.Phone,
                company.Address,
                histories = company.Histories.Select(history => new
                {
                    orderDate = history.OrderDate.ToShortDateString(),
                    history.StoreCity
                }),
                notes = company.Notes.Select(note => new
                {
                    note.InvoiceNumber,
                    note.Employee.FullName
                }),
                employees = company.Employees.Select(employee => new
                {
                    employee.IdEmployee,
                    employee.FirstName,
                    employee.LastName
                })
            }
            );
        }

        [HttpPost]
        public async Task<IActionResult> ChangeCompany(ChangeCompanyVM change)
        {
            var editableCompany = await _db.Companies.FirstOrDefaultAsync(p => p.IdCompany == change.idCompany);
            editableCompany.CompanyName = change.companyName;
            editableCompany.Address = change.address;
            editableCompany.City = change.city;
            editableCompany.State = change.state;
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> ChangeCompany(AddCompanyVM add)
        {
            _db.Companies.Add(new Company
            {
                CompanyName = add.companyName,
                Address = add.address,
                City = add.city,
                State = add.state,
                Phone = add.phone
            });
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    public record ChangeCompanyVM(int idCompany, string companyName, string address, string city, string state);
    public record AddCompanyVM(string companyName, string address, string city, string state, string phone);
}
