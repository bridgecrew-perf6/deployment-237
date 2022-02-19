import React, { useState, useEffect } from "react";
import EmailIcon from "@material-ui/icons/Email";
import LoginBg from "./../../assets/images/login.png";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";
import * as API from "./../../api/api";
import { Link } from "react-router-dom";
const initialFormData = {
  email: "",
};

export default function ForgotPassword() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  const [formData, setFormData] = useState(initialFormData);
  const [errorEmail, setErrorEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    setMsg("");
    setLoader(true);
    const flag = validateInput();
    if (!flag) {
      setLoader(false);
      return;
    }
    try {
      const requestObj = {
        email: formData.email,
      };
      const response = await API.reset_password(requestObj);
      if (response.status === 200) {
        setMsg("Mail has been sent to your email id.");
        setLoader(false);
      }
      if (response.status === 400) {
        setMsg("Your email id is not registered with us.");
        setLoader(false);
      }

      if (response.status === 202) {
        setLoader(false);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { email } = formData;
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
    return flag;
  }

  return (
    <>
      <Banner />
      <div className="min-w-screen xl:min-h-screen bg-theme flex items-center justify-center px-5 lg:pt-10 md:pt-10 pt-6 xl:pb-20 md:pb-10 pb-6 forgot-password-page-wrapper">
        <div
          className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1000px" }}
        >
          <div className="md:flex w-full forgot-password-page-block">
            <div
              className="hidden md:block w-1/2 bg-innerBG py-10 px-10 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${LoginBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 lg:py-20 xl:py-20 md:py-5 py-9 px-5 md:px-10 bg-innerBG flex flex-col justify-center">
              <div className="text-center lg:my-10 md:my-6 mb-5">
                <h1 className="font-bold text-3xl text-white playfair mb-2">
                  Forgot Password
                </h1>
                <p className="chivo text-white">
                  Enter your email to reset your password
                </p>
              </div>
              <div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 md:mb-10 mb-5 relative">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold px-1 text-white"
                    >
                      Registered Email
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
                      <p className="absolute text-xs text-red-600 mt-2">
                        {errorEmail.message}
                      </p>
                    )}
                    <p className="absolute text-center text-green-500 pt-2">
                      {msg}
                    </p>
                  </div>
                </div>

                <div className="flex -mx-3 playfair">
                  <div className="w-full px-3 md:mb-3">
                    <button
                      className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
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
                        <span>Reset Password</span>
                      )}
                    </button>
                  </div>
                </div>
                <Link to="/login">
                  <div className="lg:mb-9 md:mb-6 text-white text-sm text-center">
                    Back to login
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
