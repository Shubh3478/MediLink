// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Loading from "./Loading";
// import { setLoading } from "../redux/reducers/rootSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Empty from "./Empty";
// import fetchData from "../helper/apiCall";
// import "../styles/user.css";

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.root);

//   const getAllAppoint = async (e) => {
//     try {
//       dispatch(setLoading(true));
//       const temp = await fetchData(`/appointment/getallappointments`);
//       setAppointments(temp);
//       dispatch(setLoading(false));
//     } catch (error) {}
//   };

//   useEffect(() => {
//     getAllAppoint();
//   }, []);

//   const complete = async (ele) => {
//     try {
//       await toast.promise(
//         axios.put(
//           "/appointment/completed",
//           {
//             appointid: ele?._id,
//             doctorId: ele?.doctorId._id,
//             doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         ),
//         {
//           success: "Appointment booked successfully",
//           error: "Unable to book appointment",
//           loading: "Booking appointment...",
//         }
//       );

//       getAllAppoint();
//     } catch (error) {
//       return error;
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <section className="user-section">
//           <h3 className="home-sub-heading">All Users</h3>
//           {appointments.length > 0 ? (
//             <div className="user-container">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Doctor</th>
//                     <th>Patient</th>
//                     <th>Appointment Date</th>
//                     <th>Appointment Time</th>
//                     <th>Booking Date</th>
//                     <th>Booking Time</th>
//                     <th>Status</th>

//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments?.map((ele, i) => {
//                     return (
//                       <tr key={ele?._id}>
//                         <td>{i + 1}</td>
//                         <td>
//                           {ele?.doctorId?.firstname +
//                             " " +
//                             ele?.doctorId?.lastname}
//                         </td>
//                         <td>
//                           {ele?.userId?.firstname + " " + ele?.userId?.lastname}
//                         </td>
//                         <td>{ele?.date}</td>
//                         <td>{ele?.time}</td>
//                         <td>{ele?.createdAt.split("T")[0]}</td>
//                         <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
//                         <td>{ele?.status}</td>
//                         <td>
//                           <button
//                             className={`btn user-btn accept-btn ${
//                               ele?.status === "Completed" ? "disable-btn" : ""
//                             }`}
//                             disabled={ele?.status === "Completed"}
//                             onClick={() => complete(ele)}
//                           >
//                             Complete
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <Empty />
//           )}
//         </section>
//       )}
//     </>
//   );
// };

// export default AdminAppointments;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All"); // ✅ New filter state

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/appointment/getallappointments`);
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Failed to fetch appointments", error);
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed",
          error: "Unable to update appointment",
          loading: "Updating appointment...",
        }
      );

      getAllAppoint();
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  };
  const filteredAppointments =
    filterStatus === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === filterStatus);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Appointments</h3>

          <div className="filter-section" style={{ marginBottom: "1rem" }}>
            <label htmlFor="statusFilter" style={{ marginRight: "10px" }}>
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Booking Date</th>
                    <th>Booking Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>
                        {ele?.doctorId?.firstname +
                          " " +
                          ele?.doctorId?.lastname}
                      </td>
                      <td>
                        {ele?.userId?.firstname + " " + ele?.userId?.lastname}
                      </td>
                      <td>{ele?.date}</td>
                      <td>{ele?.time}</td>
                      <td>{ele?.createdAt.split("T")[0]}</td>
                      <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                      <td>{ele?.status}</td>
                      <td>
                      < button
                          className={`btn user-btn accept-btn ${
                            ele?.status === "Completed" ? "disable-btn blocked-btn" : ""
                          }`}
                          disabled={ele?.status === "Completed"}
                          onClick={() => complete(ele)}
                        >
                          {ele?.status === "Completed" ? "Completed" : "Complete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default AdminAppointments;
