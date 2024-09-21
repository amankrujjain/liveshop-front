import React, { useState, useEffect, useContext } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import LeftNav from './LeftNav'

import { Newslatter } from '../../Store/NewslatterContextProvider';
export default function AdminNewslatter() {
    var [newslatter, setnewslatter] = useState([])
    var { getNewslatter,deleteData} = useContext(Newslatter)
    async function getAPIData() {
        var response = await getNewslatter()
        if (response.result === "Done")
        setnewslatter(response.data)
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
                    <h5 className='background text-light text-center p-1'>Newslatter Section</h5>
                    <div className='table-responsive'>
                        <table className='table table-light table-striped table-hover'>
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Email Address</th>
                                    <th></th>
                                </tr>
                                {
                                    newslatter.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{item._id}</td>
                                            <td>{item.email}</td>
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
