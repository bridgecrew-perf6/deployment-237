import React, { useState, useEffect } from "react";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LoginBg from "./../../assets/images/login.png";
import Number from "react-number-format";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { ArrowBack, Place } from "@material-ui/icons";
import * as API from "./../../api/api";
import CityData from "../../data/city.json";
const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
};

export default function Register() {
  const history = useHistory();
  useEffect(() => {
    // window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  const [formData, setFormData] = useState(initialFormData);
  const [msg, setMsg] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [loader, setLoader] = useState(false);

  const cityOptions = [];
  CityData.map((item) => {
    const option = {
      value: item.id.toString(),
      label: item.en_name,
    };
    cityOptions.push(option);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileClick = (data) => {
    setUserProfile(data);
    setErrorFirstName({
      field: "firstName",
      message: "",
    });
    setErrorLastName({
      field: "lastName",
      message: "",
    });
    setErrorPhone({
      field: "phoneNumber",
      message: "",
    });
    setErrorEmail({
      field: "email",
      message: "",
    });
    setErrorPassword({
      field: "password",
      message: "",
    });
  };
  const handleClick = async () => {
    setMsg(null);
    setLoader(true);
    const { firstName, lastName, phoneNumber, email, password, city_name } =
      formData;
    const flag = validateInput();
    if (!flag) {
      setLoader(false);
      return;
    }
    try {
      const requestObj = {
        role: userProfile,
        first_name: firstName,
        last_name: lastName,
        number: phoneNumber,
        email: email,
        password: password,
        city_name: city_name,
      };

      const response = await API.register(requestObj);

      localStorage.setItem("userData", JSON.stringify(response.data));
      const userProfileData = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        number: response.data.number,
        email: response.data.email,
        city_name: response.data.city_name,
      };
      localStorage.setItem("userProfileData", JSON.stringify(userProfileData));
      if (response.status === 200) {
        if (userProfile == "1") {
          localStorage.setItem("isUserAuth", true);
          history.push({
            pathname: "/profile",
          });
        }
        if (userProfile == "2") {
          localStorage.setItem("isVendorAuth", true);
          history.push({
            pathname: "/dashboard",
          });
        }
      }
      if (response.status > 399) {
        setMsg(response.data.email);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { firstName, lastName, phoneNumber, email, password, city_name } =
      formData;
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
        msg = "Name should have characters only.";
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
        msg = "Name should have characters only.";
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

    let validatePhone = appUtil.validatePhoneNumber(phoneNumber);
    if (validatePhone === 1) {
      setErrorPhone({
        field: "phoneNumber",
        message: "",
      });
    }
    if (!(validatePhone === 1)) {
      let msg = "";
      if (validatePhone === 0) {
        msg = "Please enter your phone number.";
      } else {
        msg = "Please check your phone number format.";
      }
      setErrorPhone({
        field: "phoneNumber",
        message: msg,
      });
      flag = false;
    }

    let validatePassword = appUtil.validatePass(password);
    if (validatePassword === 1) {
      setErrorPassword({
        field: "password",
        message: "",
      });
    }
    if (!(validatePassword === 1)) {
      let msg = "";
      if (validatePassword === 0) {
        msg = "Please enter the password.";
      } else {
        msg =
          "Password must contains minimum eight characters, at least one letter, one number and one special character.";
      }
      setErrorPassword({
        field: "password",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }
  return (
    <>
      <Banner />
      <div className="min-w-screen xl:min-h-screen bg-theme flex items-center justify-center px-5 lg:pt-10 md:pt-10 pt-6 xl:pb-20 md:pb-10 pb-6 register-page-wrapper">
        <div
          className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1000px" }}
        >
          <div className="md:flex w-full lg:h-49rem xl:h-49rem h-auto register-page-block">
            <div
              className="hidden md:block w-1/2 bg-innerBG px-10 bg-cover bg-center register-page-img"
              style={{ backgroundImage: `url(${LoginBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 px-5 lg:px-10 md:px-6 py-5 xl:py-10 lg:py-8 md:py-10 bg-innerBG flex flex-col justify-center register-page-form">
              {userProfile && (
                <ArrowBack
                  fontSize="large"
                  className="text-white arrow-back"
                  onClick={() => setUserProfile(null)}
                />
              )}
              <div className="text-center lg:my-10 md:my-5 mb-4 lg:mt-0 mt-3">
                <h1 className="font-bold md:text-3xl text-2xl text-white playfair mb-2">
                  {!userProfile ? "" : userProfile == "1" ? "User " : "Vendor "}
                  Registration
                </h1>
                <p className="chivo text-white">
                  Enter your information to registration
                </p>
              </div>
              {!userProfile ? (
                <div className="flex flex-col -mx-3 playfair">
                  <div className="w-full px-3 xl:mb-3">
                    <button
                      className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                      onClick={() => handleProfileClick("1")}
                    >
                      Sign Up as User
                    </button>
                  </div>
                  <span className="text-white text-center text-lg xl:mb-3">
                    - or -
                  </span>
                  <div className="w-full px-3 xl:mb-3">
                    <button
                      className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                      onClick={() => handleProfileClick("2")}
                    >
                      Sign Up as Vendor
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex lg:flex-row xl:flex-row flex-col -mx-3 chivo">
                    <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 relative">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-semibold px-1 text-white"
                      >
                        First name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <PersonIcon />
                        </div>
                        <input
                          type="text"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="First Name"
                          name="firstName"
                          id="firstName"
                          onChange={handleChange}
                        />
                      </div>

                      <p className="absolute text-xs text-red-600 mt-2">
                        {errorFirstName.field === "firstName" &&
                          errorFirstName.message}
                      </p>
                    </div>
                    <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 relative">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-semibold px-1 text-white"
                      >
                        Last name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <PersonIcon />
                        </div>
                        <input
                          type="text"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="Last Name"
                          name="lastName"
                          id="lastName"
                          onChange={handleChange}
                        />
                      </div>
                      {errorLastName.field === "lastName" && (
                        <p className="absolute text-xs text-red-600 mt-2">
                          {errorLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-5 relative">
                      <label
                        htmlFor="phoneNumber"
                        className="text-sm font-semibold px-1 text-white"
                      >
                        Phone Number
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <PhoneIcon />
                        </div>
                        <Number
                          format="##########"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="##########"
                          name="phoneNumber"
                          id="phoneNumber"
                          onChange={handleChange}
                        />
                        {/* <input type="text" /> */}
                      </div>
                      {errorPhone.field === "phoneNumber" && (
                        <p className="absolute text-xs text-red-600 mt-2">
                          {errorPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-5 relative">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold px-1 text-white"
                      >
                        Email
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <EmailIcon />
                        </div>
                        <input
                          type="email"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="email@example.com"
                          name="email"
                          id="email"
                          onChange={handleChange}
                        />
                      </div>
                      {errorEmail.field === "email" && (
                        <p className="absolute text-xs text-red-600 mt-2">
                          {errorEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-5 relative">
                      <label
                        htmlFor="password"
                        className="text-sm font-semibold px-1 text-white"
                      >
                        Password
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <LockIcon />
                        </div>
                        <input
                          type="password"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="************"
                          name="password"
                          id="password"
                          onChange={handleChange}
                        />
                      </div>
                      {errorPassword.field === "password" && (
                        <p className="absolute text-xs text-red-600 mt-2">
                          {errorPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-5 relative">
                      <label
                        htmlFor="city_name"
                        className="text-sm font-semibold px-1 text-white"
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
                          <option value={null} disabled selected>
                            Select City
                          </option>
                          {cityOptions.map((item) => {
                            return (
                              <option value={item.label} key={item.value}>
                                {item.label}
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
                  </div>

                  <div className="flex -mx-3 playfair">
                    <div className="w-full px-3 my-3">
                      <button
                        className="block w-full md:max-w-xs mx-auto bg-gradient-to-r from-red-800 to-red-700 hover:to-gray-300 hover:from-gray-100 text-white rounded-lg px-3 py-3 font-semibold focus:outline-none hover:text-black"
                        onClick={handleClick}
                        disabled={loader}
                      >
                        {loader ? (
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        ) : (
                          <span>Register Now</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 text-red-600 text-center text-sm capitalize">
                    {msg}
                  </div>

                  <div className="mb-0 text-white text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login">
                      <span className="text-red-600 hover:underline">
                        Login
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="chivo">
        <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-theme ">
          <div className="relative sm:max-w-sm w-full">
            <div className="card bg-primary shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
            <div className="card bg-secondary shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
            <div className="relative w-full rounded-3xl  px-6 py-16 bg-yellow-400 shadow-md">
              <label
                for=""
                className="block mt-3 text-center font-bold text-3xl text-gray-900 playfair"
              >
                Login
              </label>
              <form method="#" action="#" className="mt-10">
                <div>
                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-3">
                      <label for="" className="text-xs font-semibold px-1">
                        Email
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <EmailIcon />
                        </div>
                        <input
                          type="text"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex -mx-3 chivo">
                    <div className="w-full px-3 mb-3">
                      <label for="" className="text-xs font-semibold px-1">
                        Password
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <LockIcon />
                        </div>
                        <input
                          type="password"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="************"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <button className="bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary  w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform ">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-white pt-8 flex gap-10 text-xs">
            <div className="underline cursor-pointer">
              Terms and Conditions{" "}
            </div>
            <div className="underline cursor-pointer">Privacy Policy</div>
          </div>
        </div>
      </div> */}
    </>
  );
}
