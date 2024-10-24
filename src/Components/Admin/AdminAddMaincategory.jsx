import React, { useState, useContext } from 'react';
import LeftNav from './LeftNav';
import { useNavigate } from 'react-router-dom';
import { Maincategory } from '../../Store/MaincategoryContextProvider';
import toast from 'react-hot-toast';

export default function AdminAddMaincategory() {
    const [name, setName] = useState("");
    const { add } = useContext(Maincategory); // Getting 'add' from context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // For loading state feedback

    function getData(e) {
        setName(e.target.value);
    }

    async function postData(e) {
        e.preventDefault();
        setLoading(true); // Set loading state to true when the request starts
        const item = { name };
        
        // Call the 'add' function from context
        const response = await add(item);
        setLoading(false); // Reset loading state after the request is done

        if (response.result === "Done") {
            toast.success("Maincategory added !")
            navigate("/admin-maincategory");
        } else {
            toast.error(response.message);
        }
    }

    return (
        <div className="container-fluid mt-2">
            <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                    <LeftNav />
                </div>
                <div className="col-lg-10 col-md-8 col-sm-6 col-12">
                    <h5 className="background text-light text-center p-1">Maincategory Section</h5>
                    <form onSubmit={postData}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name} // Bind input value to state
                                onChange={getData}
                                required
                                placeholder="Enter Maincategory Name : "
                                disabled={loading} // Disable input while loading
                            />
                        </div>
                        <button
                            type="submit"
                            className="border-0 p-1 background text-light btn-sm w-100"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? "Adding..." : "Add"} {/* Show feedback on button */}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
