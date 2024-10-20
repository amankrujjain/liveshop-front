import React, { useState, useEffect, useContext } from "react";
import pic from "../../assets/images/noimage.png";
import LeftNav from "./LeftNav";
import { Link } from "react-router-dom";
import { User } from "../../Store/UserContextProvider";

export default function AdminHome() {
  const [user, setUser] = useState({});
  const { getSingle } = useContext(User);

  async function getAPIData() {
    const response = await getSingle();
    if (response.result === "Done") {
      setUser(response.data);
    } else {
      alert(response.message);
    }
  }

  useEffect(() => {
    getAPIData();
  }, []);

  return (
    <div
      className="container-fluid mt-2 p-0"
      style={{ minHeight: "100vh", overflowX: "hidden" }}
    >
      <div className="row no-gutters">
        {/* Sidebar / Left Navigation */}
        <div className="col-xl-2 col-lg-3 col-md-3 col-sm-4 col-12 mb-3">
          <LeftNav />
        </div>

        {/* Main Content */}
        <div className="col-xl-10 col-lg-9 col-md-9 col-sm-8 col-12">
          <div className="row">
            {/* Profile Picture */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              {user.pic ? (
                <img
                  src={`/uploads/${user.pic}`}
                  alt="Profile"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "500px", width: "100%" }}
                />
              ) : (
                <img
                  src={pic}
                  alt="No Profile"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "500px", width: "100%" }}
                />
              )}
            </div>

            {/* Profile Details */}
            <div className="col-lg-6 col-md-6 col-12">
              <h5 className="background text-light text-center p-2 mb-3">
                Admin Home Page
              </h5>
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{user.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>User Name</th>
                    <td>{user.username || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>{user.role || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Email ID</th>
                    <td>{user.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{user.phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{user.city || "N/A"}</td>
                  </tr>
                  <tr>
                    <th colSpan={2}>
                      <Link
                        to="/update-profile"
                        className="text-decoration-none p-2 d-block text-center rounded background text-light mybtn w-100 btn-sm"
                      >
                        Update Profile
                      </Link>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
