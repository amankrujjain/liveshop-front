import React, { useState, useEffect, useContext } from 'react'

import LeftNav from './LeftNav'

import { useNavigate, useParams } from 'react-router-dom'
import { Subcategory } from '../../Store/SubcategoryContextProvider'
export default function AdminUpdateSubcategory() {
    var [name, setname] = useState("")
    var { getSingle, update } = useContext(Subcategory)
    var navigate = useNavigate()
    var { _id } = useParams()
    function getData(e) {
        setname(e.target.value)
    }
    async function postData(e) {
        e.preventDefault()
        var item = {
            _id: _id,
            name: name
        }

        const response = await update(item)
        if (response.result === "Done")
            navigate("/admin-subcategory")
        else
            alert(response.message)
    }
    async function getAPIData() {
        var item = {
            _id: _id
        }
        var response = await getSingle(item)
        // console.log(data);
        setname(response.data.name)
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
                    <h5 className='background text-light text-center p-1'>Subcategory Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" onChange={getData} required placeholder='Enter Subcategory Name : ' value={name} />
                        </div>
                        <button type="submit" className="border-0 p-1 background text-light btn-sm w-100">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
