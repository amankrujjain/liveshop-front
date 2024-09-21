import React, { useEffect, useState } from "react";
import useRazorpay from "react-razorpay";
import { useParams, useNavigate } from "react-router-dom";
export default function Payment() {
    var [checkout, setcheckout] = useState({})
    var [user, setuser] = useState({})
    const Razorpay = useRazorpay();
    var navigate = useNavigate()
    var { _id } = useParams()
    async function getData() {
        var rawdata = await fetch("/checkoutUser/" + localStorage.getItem("userid"), {
            method: "get",
            headers: {
                "authorization": localStorage.getItem("token"),
                "username": localStorage.getItem("username"),
                "role": localStorage.getItem("role")
            }
        })
        var result = await rawdata.json()
        result = result.data
        if (_id === "-1")
            result = result[result.length - 1]
        else
            result = result.find((item) => item._id === _id)

        setcheckout(result)
        rawdata = await fetch("/user/" + localStorage.getItem("userid"), {
            method: "get",
            headers: {
                "authorization": localStorage.getItem("token"),
                "username": localStorage.getItem("username"),
                "role": localStorage.getItem("role")
            }
        })
        result = await rawdata.json()
        setuser(result.data)
    }
    useEffect(() => {
        getData()
    }, [])
    const initPayment = (data) => {
        const options = {
            key: "rzp_test_2fmeYEuNX4MPso",
            amount: data.amount,
            currency: "INR",
            order_id: data._id,
            "prefill": {
                "name": user.name,
                "email": user.email,
                "contact": user.phone,
            },
            handler: async (response) => {
                try {
                    var item = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        checkid: checkout._id
                    }
                    var rawdata = await fetch("/verify", {
                        method: "put",
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem("token"),
                            "username": localStorage.getItem("username"),
                            "role": localStorage.getItem("role")
                        },
                        body: JSON.stringify(item)
                    });
                    var result = await rawdata.json()
                    if (result.result === "Done")
                        navigate("/confirmation")
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    };

    const handlePayment = async () => {
        try {
            const orderUrl = "/orders";
            const rawdata = await fetch(orderUrl, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token"),
                    username: localStorage.getItem("username")
                },
                body: JSON.stringify({ amount: checkout.finalamount })
            });
            var data = await rawdata.json()
            initPayment(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="container my-5">
                <button onClick={handlePayment} className="text-decoration-none p-1 d-block text-center rounded background text-light mybtn w-100 btn-sm">
                    Pay With Razorpay
                </button>
            </div>
        </>
    );
}
