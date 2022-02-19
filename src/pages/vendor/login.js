import React, { useState } from "react";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LoginBg from "./../../assets/images/login.png";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormData);
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
    const { email, password } = formData;
    let flag = true;

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
          <div className="md:flex w-full">
            <div
              className="hidden md:block w-1/2 bg-innerBG py-10 px-10 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${LoginBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 lg:py-20 xl:py-20 py-5 px-5 md:px-10 bg-innerBG flex flex-col justify-center">
              <div className="text-center my-10">
                <h1 className="font-bold text-3xl text-white playfair">
                  Vendor Login
                </h1>
                <p className="chivo text-white">
                  Enter your information to login
                </p>
              </div>
              <div>
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
                        name="email"
                        id="email"
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
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
                        name="password"
                        id="password"
                        type="password"
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-innerBG"
                        placeholder="************"
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
    </>
  );
}
