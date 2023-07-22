import { Fragment, useEffect, useState } from 'react';
import './company.css';

export function Company() {
    let [companies, setCompanies] = useState([]);
    let [selectedCompanyId, setSelectedCompanyId] = useState(0);
    let [addCompany, setAddCompany] = useState({
        companyName: "",
        address: "",
        city: "",
        state: "",
        phone: ''
    })

    let nameCellClickHandler = (e) => {

        window.location.href += `details?company=${e.currentTarget.dataset.id}`
    }

    let getCompanies = () => {
        fetch('http://localhost:5000/api/company').then(obj => {
            if (obj.ok)
                obj.json().then(result => setCompanies(result));
        })
    }

    let handlerAddClick = (e) => {
        let route = `http://localhost:5000/api/company/add`;
        fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset:utf-8'
            },
            body: JSON.stringify(addCompany)
        }).then(() => {
            document.querySelector('.adding-modal-wrapper').classList.remove('adding-modal-open');
            getCompanies();
            setAddCompany({
                companyName: "",
                address: "",
                city: "",
                state: "",
                phone: ''
            });
        })
    }


    let handlerEditClick = () => {
        if (selectedCompanyId !== 0)
            window.location.href += `details?company=${selectedCompanyId}`
    }

    let changeCompanyAttribute = (e) => {
        addCompany[e.target.dataset.name] = e.target.value;
        setAddCompany(JSON.parse(JSON.stringify(addCompany)));
    }

    let closeModal = () => {
        document.querySelector('.adding-modal-wrapper').classList.remove('adding-modal-open');
        setAddCompany({
            companyName: "",
            address: "",
            city: "",
            state: "",
            phone: ''
        });
    }

    let handlerAddObj = (e) => {
        document.querySelector('.adding-modal-wrapper').classList.add('adding-modal-open');
    }

    let addingModal = () => {
        return (
            <div className='adding-modal-wrapper'>
                <div className='adding-modal'>
                    <h3>Company adding</h3>
                    <button className='adding-modal_close' onClick={closeModal}>×</button>
                    <label htmlFor="name">Name:</label>
                    <input type="text" data-name='companyName' id="name" value={addCompany.companyName} onChange={changeCompanyAttribute} />
                    <label htmlFor="address">Address:</label>
                    <input type="text" data-name='address' id="address" value={addCompany.address} onChange={changeCompanyAttribute} />
                    <label htmlFor="city">City:</label>
                    <input type="text" data-name='city' id="city" value={addCompany.city} onChange={changeCompanyAttribute} />
                    <label htmlFor="state">State:</label>
                    <input type="text" data-name='state' id="state" value={addCompany.state} onChange={changeCompanyAttribute} />
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" data-name='phone' id="phone" value={addCompany.phone} onChange={changeCompanyAttribute} />
                    <button className='admin-modal_btn btn' onClick={handlerAddClick}>Add</button>
                </div>
            </div>)
    }

    let hadndlerCellClick = (e) => {
        Array.from(e.target.parentElement.children).forEach(elem => {
            elem.classList.remove('table_cell-selected');
            if (elem.dataset.id === e.target.dataset.id)
                elem.classList.add('table_cell-selected');
        });
        setSelectedCompanyId(e.target.dataset.id);
    }

    useEffect(() => {
        getCompanies();
    }, [])

    function companiesFill(comp) {
        return comp.map(item => {
            return (
                <Fragment key={item.idCompany}>
                    <div className="companies_cell companies-cell-name clickable_table-cell" data-id={item.idCompany} onClick={nameCellClickHandler}>{item.companyName}</div>
                    <div data-id={item.idCompany} className="companies_cell clickable_table-cell" onClick={hadndlerCellClick}>{item.city}</div>
                    <div data-id={item.idCompany} className="companies_cell clickable_table-cell" onClick={hadndlerCellClick}>{item.state}</div>
                    <div data-id={item.idCompany} className="companies_cell clickable_table-cell" onClick={hadndlerCellClick}>{item.phone}</div>
                </Fragment>
            )
        })
    }

    return (
        <Fragment>
            {addingModal()}
            <div className="header">
                <h3 className="header_content">Companies</h3>
                <div className="header_controls">
                    <svg onClick={handlerAddObj} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>plus</title>
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                    <svg onClick={handlerEditClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>pencil</title>
                        <path
                            d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                </div>
            </div>

            <div className="companies">
                <div className="companies_head companies_cell">Company Name</div>
                <div className="companies_head companies_cell">City</div>
                <div className="companies_head companies_cell">State</div>
                <div className="companies_head companies_cell">Phone</div>
                {companiesFill(companies)}
            </div>
        </Fragment>
    );
}