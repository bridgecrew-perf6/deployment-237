import React, { useState, useEffect } from "react";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LoginBg from "./../../assets/images/login.png";
import Number from "react-number-format";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";

const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
};

export default function Register() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  const [formData, setFormData] = useState(initialFormData);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = () => {
    const flag = validateInput();
    if (!flag) {
      return;
    }
  };

  function validateInput() {
    const { firstName, lastName, phoneNumber, email, password } = formData;
    let flag = true;

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
        msg = "8 digit password required.";
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
      <div className="min-w-screen min-h-screen bg-theme flex items-center justify-center px-5 pt-10 pb-20 ">
        <div
          className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1000px" }}
        >
          <div className="md:flex w-full lg:h-49rem xl:h-49rem h-auto">
            <div
              className="hidden md:block w-1/2 bg-innerBG px-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${LoginBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 px-5 md:px-10 bg-innerBG flex flex-col justify-center">
              <div className="text-center my-10">
                <h1 className="font-bold text-3xl text-white playfair">
                  Vendor Registration
                </h1>
                <p className="chivo text-white">
                  Enter your information to registration
                </p>
              </div>
              <div>
                <div className="flex lg:flex-row xl:flex-row flex-col -mx-3 chivo">
                  <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-semibold px-1 text-white"
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

                    <p className="text-xs text-red-600 mt-2">
                      {errorFirstName.field === "firstName" &&
                        errorFirstName.message}
                    </p>
                  </div>
                  <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-semibold px-1 text-white"
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
                      <p className="text-xs text-red-600 mt-2">
                        {errorLastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 mb-5">
                    <label
                      htmlFor="phoneNumber"
                      className="text-xs font-semibold px-1 text-white"
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
                      <p className="text-xs text-red-600 mt-2">
                        {errorPhone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 mb-5">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1 text-white"
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
                      <p className="text-xs text-red-600 mt-2">
                        {errorEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 mb-12">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold px-1 text-white"
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
                      <p className="text-xs text-red-600 mt-2">
                        {errorPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex -mx-3 playfair">
                  <div className="w-full px-3 mb-20">
                    <button
                      className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                      onClick={handleClick}
                    >
                      REGISTER NOW
                    </button>
                  </div>
                </div>
              </div>
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
