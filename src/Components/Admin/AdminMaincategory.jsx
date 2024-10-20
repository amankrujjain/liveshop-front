import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import LeftNav from './LeftNav'
import { Maincategory } from '../../Store/MaincategoryContextProvider';

export default function AdminMaincategory() {
    var [maincategory, setMaincategory] = useState([]);
    var [loading, setLoading] = useState(false); // Loading state
    var [error, setError] = useState(null); // Error state

    var { getMaincategory, deleteData } = useContext(Maincategory);

    // Function to fetch main categories
    async function getAPIData() {
        setLoading(true); // Set loading to true when fetching starts
        try {
            var response = await getMaincategory();
            if (response.result === "Done") {
                setMaincategory(response.data);
                setError(null); // Clear any previous error
            } else {
                setError(response.message); // Set error if fetch fails
            }
        } catch (err) {
            setError("Failed to fetch main categories.");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false); // Set loading to false after fetch completes
        }
    }

    // Function to delete a main category record
    async function deleteRecord(_id) {
        if (window.confirm("Are You Sure to Delete?")) {
            try {
                var item = { _id };
                await deleteData(item);
                getAPIData(); // Refresh data after deletion
            } catch (err) {
                console.error("Error deleting data:", err);
                alert("Failed to delete the record.");
            }
        }
    }

    // Fetch data when the component mounts
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
                    <h5 className='background text-light text-center p-1'>Maincategory Section <Link to="/admin-add-maincategory"><AddIcon className="text-light" /></Link></h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {
                                    maincategory.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>{item.name}</td>
                                            <td><Link to={`/Admin-update-maincategory/${item._id}`}><EditIcon className="text-danger"/></Link></td>
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
