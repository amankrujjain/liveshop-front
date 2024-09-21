import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import LeftNav from './LeftNav'

import { Contact } from '../../Store/ContactContextProvider';
export default function AdminSingleContact() {
    var [contact, setcontact] = useState([])
    var { getSingle, deleteData, update } = useContext(Contact)
    var { _id } = useParams()
    var navigate = useNavigate()
    async function getAPIData() {
        var contact = {
            _id: _id
        }
        var response = await getSingle(contact)
        if (response.result === "Done")
            setcontact(response.data)
        else
            alert(response.message)
    }
    async function updateRecord() {
        var item = {
            _id: _id,
            status: "Done"
        }
        const response = await update(item)
        if(response.result==="Done")
        getAPIData()

    }
    async function deleteRecord() {
        if (window.confirm("Are Your Sure to Delete : ")) {
            var contact = {
                _id: _id
            }
            await deleteData(contact)
            navigate("/admin-contact")
        }
    }
    useEffect(() => {
        getAPIData()
    }, [])
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <h5 className='background text-light text-center p-1'>Single Contact Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <td>{contact._id}</td>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <td>{contact.name}</td>
                                </tr>
                                <tr>
                                    <th>Email Address</th>
                                    <td>{contact.email}</td>
                                </tr>
                                <tr>
                                    <th>Date</th>
                                    <td>{`${new Date(contact.date).getDate()}/${new Date(contact.date).getMonth() + 1}/${new Date(contact.date).getFullYear()} ${new Date(contact.date).getHours()}:${new Date(contact.date).getMinutes()}:${new Date(contact.date).getSeconds()}`}</td>
                                </tr>
                                <tr>
                                    <th>Subject</th>
                                    <td>{contact.subject}</td>
                                </tr>
                                <tr>
                                    <th>Message</th>
                                    <td>{contact.message}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{contact.status}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>{contact.status === "Active" ?
                                        <button className='w-100 formbtn background text-light' onClick={updateRecord}>Change Status from Active to Done</button> :
                                        <button className='w-100 formbtn background text-light' onClick={deleteRecord}>Delete</button>}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
