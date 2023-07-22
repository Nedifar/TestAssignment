import { useLocation } from 'react-router-dom';
import './details.css';
import { Fragment, useState } from 'react';

export function Details() {
    const location = useLocation();
    let id = new URLSearchParams(useLocation().search).get('company');
    let [selectedEmployee, setSelectedEmployee] = useState({
        firstName: '',
        lastName: '',
        title: '',
        birthDate: '',
        position: ''
    });
    let [selectedNote, setSelectedNote] = useState(0);
    let [selectedCompany, setSelectedCompany] = useState({
        idCompany: 0,
        companyName: "",
        address: "",
        city: "",
        state: ""
    });
    let [selectedValueEmployee, setSelectedValueEmployee] = useState('Не выбрано');

    let [addingObj, setAddingObject] = useState({});
    let [addingModalType, setAddingModalType] = useState('note');

    let companyInfo = () => {
        fetch(`http://localhost:5000/api/company/simple?id=${id}`).then(result => {
            return result.json();
        }).then(result => {
            setSelectedCompany(result);
        })
    }

    useState(() => {
        companyInfo();
    }, [])

    let historyFill = (histories) => {
        if (histories !== undefined)
            return histories.map(item => {
                return (
                    <Fragment key={item.idHistory}>
                        <div className="table_cell">{item.orderDate}</div>
                        <div className="table_cell">{item.storeCity}</div>
                    </Fragment>
                )
            })
    }

    let selectNote = (e) => {
        setSelectedNote(+e.target.dataset.obj);
        Array.from(e.target.parentElement.children).forEach(elem => elem.classList.remove('table_cell-selected'));
        e.target.classList.add('table_cell-selected');
        if (e.target.dataset.numberCell === '1') {
            e.target.nextElementSibling.classList.add('table_cell-selected');
        }
        else {
            e.target.previousElementSibling.classList.add('table_cell-selected');
        }
    }

    let selectEmployee = (e) => {
        fetch(`http://localhost:5000/api/employee/simple?id=${+e.target.dataset.id}`).then(result =>
            result.json()
        ).then(result => {
            let birth = new Date(result.birthDate);
            birth.setHours(5);
            result.birthDate = birth.toISOString().slice(0, 10);
            setSelectedEmployee(result);
        }
        );
        Array.from(e.target.parentElement.children).forEach(elem => elem.classList.remove('table_cell-selected'));
        e.target.classList.add('table_cell-selected');
        if (e.target.dataset.numberCell === '1') {
            e.target.nextElementSibling.classList.add('table_cell-selected');
        }
        else {
            e.target.previousElementSibling.classList.add('table_cell-selected');
        }
    }

    let notesFill = (notes) => {
        if (notes !== undefined)
            return notes.map(item => {
                return (
                    <Fragment key={item.idNote}>
                        <div data-number-cell='1' data-obj={item.invoiceNumber} onClick={selectNote} className="table_cell clickable_table-cell">{item.invoiceNumber}</div>
                        <div data-number-cell='2' data-obj={item.invoiceNumber} onClick={selectNote} className="table_cell clickable_table-cell">{item.fullName}</div>
                    </Fragment>
                )
            })
    }

    let employeeFill = (employees) => {
        if (employees !== undefined)
            return employees.map(item => {
                return (
                    <Fragment key={item.idEmployee}>
                        <div data-number-cell='1' data-id={item.idEmployee} onClick={selectEmployee} className="table_cell clickable_table-cell">{item.firstName}</div>
                        <div data-number-cell='2' data-id={item.idEmployee} onClick={selectEmployee} className="table_cell clickable_table-cell">{item.lastName}</div>
                    </Fragment>
                )
            })
    }

    let updateHistory = () => {
        fetch(`http://localhost:5000/api/history?id=${selectedCompany.idCompany}`).then(result => {
            return result.json();
        }).then(result => {
            selectedCompany.histories = result;
            setSelectedCompany(JSON.parse(JSON.stringify(selectedCompany)));
        })
    }

    let updateNotes = () => {
        fetch(`http://localhost:5000/api/note?id=${selectedCompany.idCompany}`).then(result => {
            return result.json();
        }).then(result => {
            selectedCompany.notes = result;
            setSelectedCompany(JSON.parse(JSON.stringify(selectedCompany)));
        })
    }

    let updateEmployees = () => {
        fetch(`http://localhost:5000/api/employee?id=${selectedCompany.idCompany}`).then(result => {
            return result.json();
        }).then(result => {
            selectedCompany.employees = result;
            setSelectedCompany(JSON.parse(JSON.stringify(selectedCompany)));
        })
    }

    let changeCompany = (e) => {
        fetch('http://localhost:5000/api/company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                idCompany: selectedCompany.idCompany,
                companyName: selectedCompany.companyName,
                address: selectedCompany.address,
                city: selectedCompany.city,
                state: selectedCompany.state,
            })
        })
    }

    let changeCompanyAttribute = (e) => {
        selectedCompany[e.target.dataset.name] = e.target.value;
        setSelectedCompany(JSON.parse(JSON.stringify(selectedCompany)));
    }

    let changeEmployeeAttribute = (e) => {
        selectedEmployee[e.target.dataset.name] = e.target.value;
        setSelectedEmployee(JSON.parse(JSON.stringify(selectedEmployee)));
    }

    let changeAddingObjAttribute = (e) => {
        addingObj[e.target.dataset.name] = e.target.value;
        setSelectedValueEmployee(e.target.dataset.value);
        setAddingObject(JSON.parse(JSON.stringify(addingObj)));
    }

    let selectFillEmployee = (employees) => {
        if (employees !== undefined) {
            return employees.map(elem => {
                let fullName = elem.lastName + ' ' + elem.firstName;
                return <option value={elem.idEmployee}>{fullName}</option>
            })
        }
    }

    let handlerAddClick = (e) => {
        let route = 'http://localhost:5000/api/' + addingModalType;
        if (addingModalType === 'note')
            setSelectedValueEmployee('Не выбрано');
        addingObj['idCompany'] = selectedCompany.idCompany;
        fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset:utf-8'
            },
            body: JSON.stringify(addingObj)
        }).then(() => {
            document.querySelector('.adding-modal-wrapper').classList.remove('adding-modal-open');
            companyInfo();
            setAddingObject({});
        })
    }

    let deleteNote = (e) => {
        fetch('http://localhost:5000/api/note/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset:utf-8'
            },
            body: JSON.stringify({ 'invoiceNumber': selectedNote })
        }).then(() => companyInfo());
    }

    let deleteEmployee = (e) => {
        fetch('http://localhost:5000/api/employee/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset:utf-8'
            },
            body: JSON.stringify({ 'idEmployee': selectedEmployee.idEmployee })
        }).then(() => companyInfo());
        setSelectedEmployee({
            firstName: '',
            lastName: '',
            title: '',
            birthDate: '',
            position: ''
        });
    }

    let closeModal = () => {
        document.querySelector('.adding-modal-wrapper').classList.remove('adding-modal-open');
        setAddingObject({});
    }

    let addingModal = (type) => {

        if (type === 'note') {
            if (addingObj.invoiceNumber === undefined)
                setAddingObject({ invoiceNumber: '' });
            return (
                <div className='adding-modal-wrapper'>
                    <div className='adding-modal'>
                        <h3>Note adding</h3>
                        <button className='adding-modal_close' onClick={closeModal}>×</button>
                        <label htmlFor='invoice-number'>Invoice Number</label>
                        <input id='invoice-number' data-name='invoiceNumber' defaultValue='' value={addingObj.invoiceNumber} onChange={changeAddingObjAttribute} />
                        <label htmlFor='employee-input'>Employee</label>
                        <select id='employee-input' value={selectedValueEmployee} data-name='idEmployee' onChange={changeAddingObjAttribute}>
                            <option value='Не выбрано'>Не выбрано</option>
                            {selectFillEmployee(selectedCompany.employees)}
                        </select>
                        <button className='admin-modal_btn' onClick={handlerAddClick}>Add</button>
                    </div>
                </div>)
        }
        else {
            if (addingObj.firstName === undefined)
                setAddingObject({ firstName: '', lastName: '', title: '', birthDate: '', position: '' });
            return (
                <div className='adding-modal-wrapper'>
                    <div className='adding-modal'>
                        <h3>Employee adding</h3>
                        <button className='adding-modal_close' onClick={closeModal}>×</button>
                        <label htmlFor='fisrt-name'>First Name</label>
                        <input id='fisrt-name' data-name='firstName' value={addingObj.firstName} onChange={changeAddingObjAttribute} />
                        <label htmlFor='last-name'>Last Name</label>
                        <input id='last-name' data-name='lastName' value={addingObj.lastName} onChange={changeAddingObjAttribute} />
                        <label htmlFor='title'>Title</label>
                        <input id='title' data-name='title' value={addingObj.title} onChange={changeAddingObjAttribute} />
                        <label htmlFor='birth-date'>Birth Date</label>
                        <input id='birth-date' data-name='birthDate' value={addingObj.birthDate} onChange={changeAddingObjAttribute} type='date' />
                        <label htmlFor='position'>Position</label>
                        <input id='position' data-name='position' value={addingObj.position} onChange={changeAddingObjAttribute} />
                        <button className='admin-modal_btn' onClick={handlerAddClick}>Add</button>
                    </div>
                </div>
            );
        }
    }

    let handlerAddObj = (e) => {
        document.querySelector('.adding-modal-wrapper').classList.add('adding-modal-open');
        setAddingModalType(e.currentTarget.dataset.type);
    }

    let handlerAcceptChangeEmployee = () => {
        fetch('http://localhost:5000/api/employee/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset:utf-8'
            },
            body: JSON.stringify(selectedEmployee)
        }).then(() => companyInfo());
    }

    return (
        <Fragment>
            {addingModal(addingModalType, addingObj)}
            <div className="header">
                <h3 className="header-content">Company Details</h3>
                <span>{selectedCompany.companyName}</span>
            </div>
            <div className="details">
                <div className="info wrapper">
                    <div className="info_header header-section">
                        <h3>Info</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={changeCompany} viewBox="0 0 24 24">
                            <title>check</title>
                            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                        </svg>
                    </div>
                    <form className="info_edit">
                        <label htmlFor="id" id="id">ID:</label>
                        <input type="text" data-name='idCompany' value={selectedCompany.idCompany} disabled />
                        <label htmlFor="name">Name:</label>
                        <input type="text" data-name='companyName' id="name" value={selectedCompany.companyName} onChange={changeCompanyAttribute} />
                        <label htmlFor="address">Address:</label>
                        <input type="text" data-name='address' id="address" value={selectedCompany.address} onChange={changeCompanyAttribute} />
                        <label htmlFor="city">City:</label>
                        <input type="text" data-name='city' id="city" value={selectedCompany.city} onChange={changeCompanyAttribute} />
                        <label htmlFor="state">State:</label>
                        <input type="text" data-name='state' id="state" value={selectedCompany.state} onChange={changeCompanyAttribute} />
                    </form>
                </div>
                <div className="history wrapper">
                    <div className="history_header header-section">
                        <h3>History</h3>
                        <svg onClick={updateHistory} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>refresh</title>
                            <path
                                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                        </svg>
                    </div>
                    <form className="table">
                        <div className="table_head table_cell">Order Date</div>
                        <div className="table_head table_cell">Store City</div>
                        {historyFill(selectedCompany.histories)}
                    </form>
                </div>
                <div className="notes wrapper">
                    <div className="notes_header header-section">
                        <h3>Notes</h3>
                        <svg data-type='note' onClick={handlerAddObj} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>plus</title>
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                        <svg onClick={deleteNote} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>delete</title>
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                        <svg onClick={updateNotes} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>refresh</title>
                            <path
                                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                        </svg>
                    </div>
                    <form className="table">
                        <div className="table_head table_cell">Invoice Number</div>
                        <div className="table_head table_cell">Employee</div>
                        {notesFill(selectedCompany.notes)}
                    </form>
                </div>
                <div className="employees wrapper">
                    <div className="employees_header header-section">
                        <h3>Employees</h3>
                        <svg data-type='employee' onClick={handlerAddObj} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>plus</title>
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>pencil</title>
                            <path
                                d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>
                        <svg onClick={updateEmployees} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>refresh</title>
                            <path
                                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                        </svg>
                    </div>
                    <div className="header-section">
                        <svg onClick={handlerAcceptChangeEmployee} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>pencil</title>
                            <path
                                d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>
                        <svg onClick={deleteEmployee} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>delete</title>
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                    </div>
                    <form className="table">
                        <div className="table_head table_cell">First Name</div>
                        <div className="table_head table_cell">Last Name</div>
                        {employeeFill(selectedCompany.employees)}
                    </form>
                    <form className="info_edit">
                        <label htmlFor="first-name">First Name:</label>
                        <input data-name='firstName' onChange={changeEmployeeAttribute} type="text" id="first-name" value={selectedEmployee.firstName} />
                        <label htmlFor="last-name">Last Name:</label>
                        <input data-name='lastName' onChange={changeEmployeeAttribute} type="text" id="last-name" value={selectedEmployee.lastName} />
                        <label htmlFor="title">Title:</label>
                        <input data-name='title' onChange={changeEmployeeAttribute} type="text" id="title" value={selectedEmployee.title} />
                        <label htmlFor="birth-date">Birth Date:</label>
                        <input data-name='birthDate' onChange={changeEmployeeAttribute} type="date" id="birth-date" value={selectedEmployee.birthDate} />
                        <label htmlFor="position">Position:</label>
                        <input data-name='position' onChange={changeEmployeeAttribute} type="text" id="position" value={selectedEmployee.position} />
                    </form>
                </div>
            </div>
        </Fragment>
    );
}