import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import LeftNav from './LeftNav'

import { Contact } from '../../Store/ContactContextProvider';
export default function AdminContact() {
    var [contact, setcontact] = useState([])
    var { getContact,deleteData} = useContext(Contact)
    async function getAPIData() {
        var response = await getContact()
        if (response.result === "Done")
            setcontact(response.data)
        else
            alert(response.message)
    }
    async function deleteRecord(_id){
        if(window.confirm("Are Your Sure to Delete : ")){
            var item = {
                _id:_id
            }
            await deleteData(item)
            getAPIData()
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
                    <h5 className='background text-light text-center p-1'>Contact Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {
                                    contact.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.subject}</td>
                                            <td>{`${new Date(item.date).getDate()}/${new Date(item.date).getMonth()+1}/${new Date(item.date).getFullYear()} ${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}:${new Date(item.date).getSeconds()}`}</td>
                                            <td>{item.status}</td>
                                            <td><Link to={`/admin-single-contact/${item._id}`}className="btn mybtn"><RemoveRedEyeIcon className="text-danger"/></Link></td>
                                            {
                                                item.status==="Done"?<td><button className='btn mybtn' onClick={()=>deleteRecord(item._id)}><DeleteForeverIcon className="text-danger"/></button></td>:""
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
