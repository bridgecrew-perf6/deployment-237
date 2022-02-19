import React, { useEffect, useState } from "react";
import EmailIcon from "@material-ui/icons/Email";
import { SeatsioClient, Region } from "seatsio";
import LockIcon from "@material-ui/icons/Lock";
import LoginBg from "./../../assets/images/login2.png";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";
import { Link } from "react-router-dom";
import * as API from "./../../api/api";
import { useHistory } from "react-router";
import * as C from "../../const";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  let client = new SeatsioClient(Region.NA(), C.SEATS_SECRET_KEY);
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    if (localStorage.getItem('holdToken') && localStorage.getItem('holdToken').length > 0) {
      expireHoldToken(localStorage.getItem('holdToken'))
    }
  }, []);

  const expireHoldToken = async (token) => {
    await client.holdTokens.expiresInMinutes(token, 0);
    localStorage.removeItem('holdToken');
  }

  const history = useHistory();
  const [formData, setFormData] = useState(initialFormData);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    setLoader(true);
    setMsg(null);
    const { email, password } = formData;

    const flag = validateInput();
    if (!flag) {
      setLoader(false);
      return;
    }

    try {
      const requestObj = {
        role: "1",
        email: email,
        password: password,
      };
      const response = await API.login(requestObj);
      if (response.status != 200 || !response || response.data.message != null) {
        setLoader(false);
      }
      if (response.status >= 400) {
        setErrorPassword({
          field: "password",
          message: "Incorrect password",
        });
        setLoader(false);
      }
      const userData = response.data.user;
      const userProfile = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        number: userData.number,
        email: userData.email,
        bank_name: userData.bank_name,
        account_no: userData.account_no,
        ifsc_code: userData.ifsc_code,
        commission: userData.commission,
        street_address: userData.street_address,
        state: userData.state,
        zip: userData.zip,
      };
      localStorage.setItem("userProfileData", JSON.stringify(userProfile));
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("events", JSON.stringify(response.data.events));
      if (response.status === 200) {
        localStorage.setItem("isUserAuth", true);
        localStorage.setItem("isVendorAuth", false);
        localStorage.setItem("isAdminAuth", false);
        localStorage.setItem("isTicketSannerAuth", false);
        if (userData.role == "1") {
          history.push({
            pathname: "/profile",
          });
        }
        if (userData.role == "2") {
          localStorage.setItem("isUserAuth", false);
          localStorage.setItem("isVendorAuth", true);
          localStorage.setItem("isAdminAuth", false);
          localStorage.setItem("isTicketSannerAuth", false);
          history.push({
            pathname: "/dashboard",
          });
        }
        if (userData.role == "0") {
          localStorage.setItem("isUserAuth", false);
          localStorage.setItem("isVendorAuth", false);
          localStorage.setItem("isAdminAuth", true);
          localStorage.setItem("isTicketSannerAuth", false);
          history.push({
            pathname: "/admin-dashboard",
          });
        }

        if (userData.role == "3") {
          localStorage.setItem("isUserAuth", false);
          localStorage.setItem("isVendorAuth", false);
          localStorage.setItem("isAdminAuth", false);
          localStorage.setItem("isTicketSannerAuth", true);
          history.push({
            pathname: "/ts-dashboard",
          });
        }
      }
      if (response.status >= 400) {
        setErrorPassword({
          field: "password",
          message: "Incorrect password",
        });
        setLoader(false);
      }
    } catch (e) { setLoader(false); }
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
        flag = false;
      }
      else {
        // msg = "Please check your email format.";
        flag = true;
      }
      setErrorEmail({
        field: "email",
        message: msg,
      });
    }

    if (password) {
      setErrorPassword({
        field: "password",
        message: "",
      });
    } else {
      setErrorPassword({
        field: "password",
        message: "Please enter your password",
      });
      flag = false;
    }

    return flag;
  }

  return (
    <>
      <Banner />
      <div className="min-w-screen lg:min-h-screen bg-theme flex items-center justify-center px-5 lg:pt-10 md:pt-10 pt-6 xl:pb-20 md:pb-10 pb-6 login-page-wrapper">
        <div
          className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1000px" }}
        >
          <div className="md:flex w-full">
            <div
              className="hidden md:block w-1/2 bg-innerBG py-10 px-10 bg-cover bg-center overflow-hidden bg-top"
              style={{ backgroundImage: `url(${LoginBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 lg:py-20 xl:py-20 py-5 px-5 md:px-10 bg-innerBG flex flex-col justify-center">
              <div className="text-center lg:my-10 md:my-5 mb-4">
                <h1 className="font-bold text-3xl text-white playfair mb-2">
                  Login
                </h1>
                <p className="chivo text-white">
                  Enter your information to login
                </p>
              </div>
              <div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 lg:mb-8 md:mb-7 mb-6 relative">
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
                  </div>
                </div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 lg:mb-10 md:mb-8 mb-6 relative">
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
                        name="password"
                        id="password"
                        type="password"
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-innerBG "
                        placeholder="************"
                      />
                    </div>
                    {errorPassword.field === "password" && (
                      <p className="absolute text-xs text-red-600 mt-2">
                        {errorPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <Link to="/forgotPassword">
                  <div className="lg:mb-9 mb-4 text-white text-sm hover:underline">
                    Forgot Password?
                  </div>
                </Link>
                <div className="flex -mx-3 playfair">
                  <div className="w-full px-3 mb-5">
                    <button
                      className="bg-gray-300 block focus:outline-none font-semibold from-primary hover:bg-red-700 md:max-w-xs mx-auto px-3 py-3 rounded-lg text-black to-secondary w-full hover:text-white"
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
                        <span>Login</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="lg:mb-4 mb-2 text-red-600 text-center text-sm capitalize">
                  {msg}
                </div>

                <div className="lg:mb-9 md:mb-6 text-white text-sm text-center">
                  Not registered yet?{" "}
                  <Link to="/register">
                    <span className="text-red-600 hover:underline">
                      Create an Account
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
