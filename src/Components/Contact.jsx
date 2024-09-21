import React, { useState, useContext } from 'react'

import { Contact } from '../Store/ContactContextProvider'
export default function ContactUS() {
    var [contact, setcontact] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })
    var { add } = useContext(Contact)
    function getData(e) {
        var name = e.target.name
        var value = e.target.value
        setcontact((old) => {
            return {
                ...old,
                [name]: value
            }
        })
    }
    async function postData(e) {
        e.preventDefault()
        var item = {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            subject: contact.subject,
            message: contact.message,
            status: "Active",
            date: new Date()
        }
        const response = await add(item)
        alert(response.message)
        setcontact({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        })
    }
    return (
        <div className='container-fluid mt-2'>
            <div className='row'>
                <div className='col-md-6 col-12'>
                    <div className='background text-light text-center p-1 mb-1'>amankrujjain@gmail.com</div>
                    <div className='background text-light text-center p-1 mb-1'>7352419070</div>
                    <div className='background text-light text-center p-1 mb-1'>Sector-6/C, Bokaro Steel City, Jharkhand</div>
                    <div className="mapouter"><div className="gmap_canvas"><iframe title='map' width="100%" height="410px" id="gmap_canvas" src="https://maps.google.com/maps?q=6%20Secotor%2016%20Bokaro&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe></div></div>
                </div>
                <div className='col-md-6 col-12'>
                    <h5 className='background text-light text-center p-2'>Contact US Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Full Name<span className='text-danger'>*</span></label>
                            <input type="text" required className="form-control" onChange={getData} name="name" placeholder='Enter User Full Name' value={contact.name} />
                        </div>
                        <div className='row mb-3'>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Email Id<span className='text-danger'>*</span></label>
                                <input type="email" required className="form-control" onChange={getData} name="email" placeholder='Enter Email Address' value={contact.email} />
                            </div>
                            <div className="col-md-6 col-12">
                                <label className="form-label">Phone<span className='text-danger'>*</span></label>
                                <input type="text" required className="form-control" onChange={getData} name="phone" placeholder='Enter Phone Number' value={contact.phone} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Subject<span className='text-danger'>*</span></label>
                            <input type="text" required className="form-control" onChange={getData} name="subject" placeholder='Enter Subject' value={contact.subject} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Message<span className='text-danger'>*</span></label>
                            <textarea name='message' onChange={getData} rows={5} className="form-control" value={contact.message}></textarea>
                        </div>
                        <button type="submit" className="background mybtn text-light  w-100 btn-sm p-1">Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
