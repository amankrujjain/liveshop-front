import React,{useState,useContext} from 'react'
import { Newslatter } from '../Store/NewslatterContextProvider'
export default function Footer() {
    var [email,setemail] = useState("")
    var {add,getNewslatter} = useContext(Newslatter)
    function getData(e){
        setemail(e.target.value)
    }
    async function postData(e){
        e.preventDefault()
        let response = await getNewslatter()
        if(response.data.find((item)=>item.email===email)===undefined){
            var item = {
                email:email
            }
            response = await add(item)
            alert("Thanks to Subscribe Our Newslatter Service!!!")
        }
        else
        alert("Your Email Id is Already Registered With US!!!!")
    }
    return (
        <footer className='background text-light text-center p-2 mt-2'>
            <p>copyright@liveshop.com</p>
            <div className='row'>
                <div className='col-md-2 col-1'></div>
                <div className='col-md-8 col-10'>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" onChange={getData} placeholder='Enter Your Email id to Suscribe Our Newslatter Service' />
                        </div>
                        <button type="submit" className="btn btn-light w-100">Submit</button>
                    </form>
                </div>
                <div className='col-md-2 col-1'></div>
            </div>
        </footer>
    )
}
