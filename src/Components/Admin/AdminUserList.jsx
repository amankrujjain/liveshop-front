import React, { useState, useEffect, useContext } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import LeftNav from './LeftNav'

import { User } from '../../Store/UserContextProvider';
export default function AdminUserList() {
    const [user, setUser] = useState([]);
    const { getUser, deleteData } = useContext(User);

    async function getAPIData() {
        try {
            const response = await getUser();
            if (response.result === "Done") {
                setUser(response.data);
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Unauthorized or failed to fetch user data.");
        }
    }

    async function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this?")) {
            const item = { _id };
            await deleteData(item);
            getAPIData(); // Refresh the data after deletion
        }
    }

    useEffect(() => {
        getAPIData();
    }, []);
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-lg-2 col-md-4 col-sm-6 col-12'>
                    <LeftNav />
                </div>
                <div className='col-lg-10 col-md-8 col-sm-6 col-12'>
                    <h5 className='background text-light text-center p-1'>User Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                                {
                                    user.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.role}</td>
                                            <td><button className='btn mybtn' onClick={()=>deleteRecord(item._id)}><DeleteForeverIcon className="text-danger"/></button></td>
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
