import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

import pic from "../assets/images/forget.jpg"
export default function ForgetOTP() {
    var [otp,setotp] = useState("")
    var navigate = useNavigate()
    function getData(e){
        setotp(e.target.value)
    }
    async function postData(e){
        e.preventDefault()
        var response = await fetch("/reset-otp",{
            method:"post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({username:localStorage.getItem("resetuser"),otp:otp})
        })
        response = await response.json()
        if(response.result==="Done"){
            navigate("/forget-password")
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
                            <label className="form-label">OTP</label>
                            <input type="text" className="form-control" onChange={getData} name="otp" placeholder='Enter OTP Which is Sent On Your Registered Email ID'/>
                        </div>
                        <button type="submit" className=" background text-light mybtn w-100 p-1">Submit OTP</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
