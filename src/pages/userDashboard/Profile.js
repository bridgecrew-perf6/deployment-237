import { Mail, Phone, Place } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import * as API from "./../../api/api";
import CityData from "../../data/city.json";
import * as appUtil from "./../../helper/appUtils";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router";
import { Person } from "@material-ui/icons";
import Button from "../../components/button/button";
const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street_address: "",
  city_name: "",
  state: "",
  zip: ""
};

export default function Profile() {
  const history = useHistory();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorStreetAddress, setErrorStreetAddress] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorZip, setErrorZip] = useState("");

  useEffect(() => {
    const isUserAuth = localStorage.getItem("isUserAuth") === "true";
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    if (!isUserAuth) {
      history.push({ pathname: "/login" });
      return false;
    }
    async function userDetail() {
      try {
        const res = await API.single_user(userData.id);
        setUser(res.data);
      } catch (e) { }
    }
    userDetail();
    getStates();
  }, []);

  // const cityOptions = [];
  // CityData.map((item) => {
  //   const option = {
  //     value: item.id.toString(),
  //     label: item.en_name,
  //   };
  //   cityOptions.push(option);
  // });

  const [stateDatas, setStateDatas] = useState([]);
  const [allCities, setAllCities] = useState([]);

  // Load all states
  const getStates = async () => {
    await API.getAllStates().then(res => {
      setStateDatas(res.data);
      if (formData.state) {
        getCitiesByState(formData.state);
      }
    }).catch(err => {
    })
  }

  // Get all cities by state
  const getCitiesByState = async (state) => {
    if (state) {
      await API.getAllCitiesByState(state).then(res => {
        setAllCities(res.data);
      }).catch(err => {
      })
    }
  }

  if (userData) {
    initialFormData.firstName = user.first_name;
    initialFormData.lastName = user.last_name;
    initialFormData.email = user.email;
    initialFormData.phone = user.number;
    initialFormData.city_name = user.city_name;
    initialFormData.street_address = user.street_address;
    initialFormData.state = user.state;
    initialFormData.zip = user.zip;
  }

  const handleChange = (e) => {
    const { value, name } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setMsg("");
    setLoader(true);
    try {
      setLoading(true);
      let flag = validateInput();
      if (!flag) {
        setLoading(false);
        setLoader(false);
        return;
      }
      const requestObj = {
        user_id: userData.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        number: formData.phone,
        city_name: formData.city_name,
        street_address: formData.street_address,
        state: formData.state,
        zip: formData.zip,
        is_active: 1,
      };
      const userProfileData = {
        id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        number: formData.number,
        email: formData.email,
        city_name: formData.city_name,
        state: formData.state,
        zip: formData.zip,
        street_address: formData.street_address,
      };
      const response = await API.user_update(requestObj);
      if (response.status == 200) {
        localStorage.setItem(
          "userData",
          JSON.stringify(userProfileData)
        );
        setMsg("Profile Updated Successfully!!");
        setLoader(false);
      }
      setLoading(false);
    } catch (e) { }
  };

  function validateInput() {
    const { firstName, lastName, email, phone, city_name, street_address, state, zip } = formData;
    let flag = true;

    if (city_name != null) {
      setErrorCity({
        field: "city",
        message: "",
      });
    } else {
      setErrorCity({
        field: "city",
        message: "Please select your city",
      });
      flag = false;
    }

    if (street_address != null) {
      setErrorStreetAddress({
        field: "street_address",
        message: "",
      });
    } else {
      setErrorStreetAddress({
        field: "city",
        message: "Please enter street address",
      });
      flag = false;
    }

    if (state != null) {
      setErrorState({
        field: "state",
        message: "",
      });
    } else {
      setErrorState({
        field: "state",
        message: "Please enter state",
      });
      flag = false;
    }

    if (zip != null) {
      setErrorZip({
        field: "zip",
        message: "",
      });
    } else {
      setErrorZip({
        field: "zip",
        message: "Please enter zip",
      });
      flag = false;
    }

    let validFirstName = appUtil.validateName(firstName);
    if (validFirstName === 1) {
      setErrorFirstName({
        field: "firstName",
        message: "",
      });
    }
    if (!(validFirstName === 1)) {
      let msg = "";
      if (validFirstName === 0) {
        msg = "Please enter your first name.";
      } else {
        msg = "First Name should have characters only.";
      }
      setErrorFirstName({
        field: "firstName",
        message: msg,
      });
      flag = false;
    }

    let validLastName = appUtil.validateName(lastName);
    if (validLastName === 1) {
      setErrorLastName({
        field: "lastName",
        message: "",
      });
    }
    if (!(validLastName === 1)) {
      let msg = "";
      if (validLastName === 0) {
        msg = "Please enter your last name.";
      } else {
        msg = "Last name should have characters only.";
      }
      setErrorLastName({
        field: "lastName",
        message: msg,
      });
      flag = false;
    }

    let validateEmail = appUtil.validateEmail(email);
    if (validateEmail === 1) {
      setErrorEmail({
        field: "email",
        message: "",
      });
    }
    if (!(validateEmail === 1)) {
      let msg = "";
      if (validateEmail === 0) {
        msg = "Please enter your email.";
      } else {
        msg = "Please check your email format.";
      }
      setErrorEmail({
        field: "email",
        message: msg,
      });
      flag = false;
    }

    let validatePhone = appUtil.validatePhoneNumber(phone);
    if (validatePhone === 1) {
      setErrorPhone({
        field: "phone",
        message: "",
      });
    }
    if (!(validatePhone === 1)) {
      let msg = "";
      if (validatePhone === 0) {
        msg = "Please enter your phone number.";
      } else {
        msg = "10 digit phone number allowed.";
      }
      setErrorPhone({
        field: "phone",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }
  return (
    <div className="w-full profile-page-wrapper">
      {/* <div className="md:px-5 lg:px-8 xl:px-8 md:py-4 px-4 py-3 bg-innerBG lg:text-xl text-lg text-semibold rounded-lg w-full shadow-md">
        Profile
      </div> */}

      <div className="bg-white rounded-lg xl:py-10 xl:px-6 lg:py-7 lg:px-4 md:py-4 md:px-3 px-1 py-4">
        <div className="flex flex-wrap chivo">
          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="firstName"
              className="text-xs font-semibold px-1"
            >
              First Name
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Person fontSize="small" />
              </div>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                placeholder="First Name"
              />
            </div>
            {errorFirstName.field === "firstName" && (
              <p className="text-xs text-red-600 mt-2 absolute">
                {errorFirstName.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="lastName"
              className="text-xs font-semibold px-1"
            >
              Last Name
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Person fontSize="small" />
              </div>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                placeholder="Last Name"
              />
            </div>
            {errorLastName.field === "lastName" && (
              <p className="text-xs text-red-600 mt-2 absolute">
                {errorLastName.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="email"
              className="text-xs font-semibold px-1"
            >
              Email
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Mail fontSize="small" />
              </div>
              <input
                readOnly={true}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="vaibhavsinha619@gmail.com"
              />
            </div>
            {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2 absolute">
                {errorEmail.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="phone"
              className="text-xs font-semibold px-1"
            >
              Phone Number
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Phone fontSize="small" />
              </div>
              <NumberFormat
                format="##########"
                name="phone"
                id="phone"
                placeholder="0000000000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
              />
            </div>

            {errorPhone.field === "phone" && (
              <p className="text-xs text-red-600 mt-2 absolute">
                {errorPhone.message}
              </p>
            )}
          </div>
          <div className="lg:w-1/2 xl:w-1/2 md:w-1/2 px-3 w-full lg:mb-8 mb-4 relative">
            <label
              htmlFor="street_address"
              className="text-xs font-semibold px-1"
            >
              Street Address
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Place />
              </div>

              <input
                type="text"
                name="street_address"
                id="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                placeholder="Street Address"
              />
            </div>
            {errorStreetAddress.field === "street_address" && (
              <p className="absolute text-xs text-red-600 mt-2">
                {errorStreetAddress.message}
              </p>
            )}
          </div>
          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 px-3 w-full lg:mb-8 mb-4 relative">
            <label
              htmlFor="state"
              className="text-xs font-semibold px-1"
            >
              State
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Place />
              </div>
              <select
                type="text"
                name="state"
                id="state"
                onChange={(e) => { handleChange(e); getCitiesByState(e.target.value); }}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
              >
                <option value={null} disabled>
                  State
                </option>
                {stateDatas.map((item) => {
                  return (
                    <option
                      value={item.state}
                      key={item.state_code}
                      selected={formData.state === item.state}
                    >
                      {item.state}
                    </option>
                  );
                })}
              </select>
            </div>
            {errorState.field === "state" && (
              <p className="absolute text-xs text-red-600 mt-2">
                {errorState.message}
              </p>
            )}
          </div>
          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 px-3 w-full lg:mb-8 mb-4 relative">
            <label
              htmlFor="city_name"
              className="text-xs font-semibold px-1"
            >
              City
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Place />
              </div>

              <select
                type="text"
                name="city_name"
                id="city_name"
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
              >
                <option value={null} disabled>
                  Select City
                </option>
                {allCities.map((item) => {
                  return (
                    <option
                      value={item.city}
                      key={item.city}
                      selected={formData.city_name === item.city}
                    >
                      {item.city}
                    </option>
                  );
                })}
              </select>
            </div>
            {errorCity.field === "city" && (
              <p className="absolute text-xs text-red-600 mt-2">
                {errorCity.message}
              </p>
            )}
          </div>
          <div className="lg:w-1/3 xl:w-1/3 md:w-1/2 px-3 w-full lg:mb-8 mb-4 relative">
            <label
              htmlFor="zip"
              className="text-xs font-semibold px-1"
            >
              Zip Code
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Place />
              </div>

              <input
                type="text"
                name="zip"
                id="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                placeholder="Zip Code"
              />
            </div>
            {errorZip.field === "zip" && (
              <p className="absolute text-xs text-red-600 mt-2">
                {errorZip.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex mt-3 playfair">
          <div className=" relative px-3 mx-auto">
            <Button onClick={handleSave} disabled={loader}>
              {loader ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <span>Update</span>
              )}
            </Button>
            <p className="absolute text-xs text-green-300 mt-2 text-left ml-4">
              {msg}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




// const Profile = () => {
//   return (
//     <>
//       User Profile
//     </>
//   );
// }

// export default Profile;