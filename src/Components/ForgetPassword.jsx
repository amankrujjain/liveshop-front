import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

import pic from "../assets/images/forget.jpg"
export default function ForgetPassword() {
    var [password,setpassword] = useState("")
    var [cpassword,setcpassword] = useState("")
    var navigate = useNavigate()
    function getData(e){
        if(e.target.name==="password")
        setpassword(e.target.value)
        else
        setcpassword(e.target.value)
    }
    async function postData(e){
        e.preventDefault()
        if(password===cpassword){
            var response = await fetch("/reset-password",{
                method:"post",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({username:localStorage.getItem("resetuser"),password:password})
            })
            response = await response.json()
            if(response.result==="Done"){
                alert("You Password has Been Reset now Login With New Password!!")
                navigate("/login")
            }
            else
            alert(response.message)
        }
        else
        alert("Password and Confirm Password Doesn't Matched!!!!")
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
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" onChange={getData} name="password" placeholder='Enter New Password'/>
                            <input type="password" className="form-control" onChange={getData} name="cpassword" placeholder='Confirm Password'/>
                        </div>
                        <button type="submit" className=" background text-light mybtn w-100 p-1">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
