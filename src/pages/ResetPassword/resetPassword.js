import React, { useEffect, useState } from "react";
import * as API from "./../../api/api";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import * as appUtil from "./../../helper/appUtils";
import Banner from "../../components/banner/banner";
import LoginBg from "./../../assets/images/login.png";
import { Email, Lock } from "@material-ui/icons";

const initialFormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
export default function ContactUs(props) {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  let query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  //   const [ email, setEmail] = useState();
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      let flag = validateInput();
      if (!flag) {
        setLoading(false);
        return;
      }
      const requestObj = {
        email: email,
        token: token,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      const response = await API.reset(requestObj);
      if (response.status === 200) {
        setMsg("Password reset successfully");
        setLoading(false);
        setTimeout(() => {
          history.push({
            pathname: "/login",
          });
        }, 4000);
      }
      if (response.status === 202) {
        setLoading(false);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { password, confirmPassword } = formData;
    let flag = true;

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
    if (confirmPassword === password) {
      setErrorConfirmPassword({
        field: "confirmPassword",
        message: "",
      });
    } else {
      let msg = "Please enter the same password.";
      setErrorConfirmPassword({
        field: "confirmPassword",
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
                  Forgot Password
                </h1>
                <p className="chivo text-white">
                  Enter your email to reset your password
                </p>
              </div>
              <div>
                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 mb-12 relative">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1 text-white"
                    >
                      Email
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Email />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                        defaultValue={email}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex -mx-3 chivo">
                  <div className="w-full px-3 mb-12 relative">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold px-1 text-white"
                    >
                      Password
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Lock />
                      </div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="***********"
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
                  <div className="w-full px-3 mb-12 relative">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold px-1 text-white"
                    >
                      Confirm Password
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Lock />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="***********"
                      />
                    </div>
                    {errorConfirmPassword.field === "confirmPassword" && (
                      <p className="absolute text-xs text-red-600 mt-2">
                        {errorConfirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex -mx-3 playfair flex-col">
                  <div className="w-full px-3 mb-3">
                    <button
                      className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                      onClick={handleClick}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        <span>Reset</span>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-green-500 pt-2">{msg}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
