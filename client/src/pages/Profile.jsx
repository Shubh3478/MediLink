import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      setFormDetails({
        ...temp,
        password: "",
        confpassword: "",
        mobile: temp.mobile === null ? "" : temp.mobile,
        age: temp.age === null ? "" : temp.age,
      });
      setFile(temp.pic);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET); // ← Replace with your Cloudinary preset
    formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME); // ← Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
      setFile(imageUrl);
      setPreview(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      confpassword,
    } = formDetails;

    if (!email) return toast.error("Email should not be empty");
    if (firstname.length < 3) return toast.error("First name too short");
    if (lastname.length < 3) return toast.error("Last name too short");
    if(mobile != ""){
      if(mobile.length < 10) return toast.error("Invalid Mobile Number");
    }

    if (password || confpassword) {
      if (password.length < 5) return toast.error("Password too short");
      if (password !== confpassword) return toast.error("Passwords do not match");
    }

    const updatePayload = {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      pic: file, // ← Send the image URL
    };

    try {
      await toast.promise(
        axios.put("/user/updateprofile", updatePayload, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully",
          error: "Unable to update profile",
        }
      );

      setFormDetails({ ...formDetails, password: "", confpassword: "" });
      getUser(); // reload data
    } catch (error) {
      toast.error("Unable to update profile");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>
            <img src={preview || file} alt="profile" className="profile-pic" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input"
            />
            <form onSubmit={formSubmit} className="register-form">
              <div className="form-same-row">
                <input
                  type="text"
                  name="firstname"
                  className="form-input"
                  placeholder="Enter your first name"
                  value={formDetails.firstname}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="lastname"
                  className="form-input"
                  placeholder="Enter your last name"
                  value={formDetails.lastname}
                  onChange={inputChange}
                />
              </div>
              <div className="form-same-row">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                  disabled
                />
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  id="gender"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-same-row">
                <input
                  type="text"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="mobile"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails?.mobile}
                  onChange={inputChange}
                />
              </div>
              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows="2"
              ></textarea>
              <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div>
              <button type="submit" className="btn form-btn">
                Update
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Profile;
