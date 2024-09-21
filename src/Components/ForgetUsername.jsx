import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

import pic from "../assets/images/forget.jpg"
export default function ForgetUsername() {
    var [name,setname] = useState("")
    var navigate = useNavigate()
    function getData(e){
        setname(e.target.value)
    }
    async function postData(e){
        e.preventDefault()
        var response = await fetch("/reset-username",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({username:name})
        })
        response = await response.json()
        if(response.result==="Done"){
            alert(response.message)
            localStorage.setItem("resetuser",name)
            navigate("/forget-password-otp")
        }
        else
        alert(response.message)
    }
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <img src={pic} height="500px" width="100%" alt="" />
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>Forget Password Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">User Name</label>
                            <input type="text" className="form-control" onChange={getData} name="username" placeholder='Enter User Name to Reset Password'/>
                        </div>
                        <button type="submit" className=" background text-light mybtn w-100 p-1">Send OTP</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
