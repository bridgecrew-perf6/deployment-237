import React, { useState } from "react";
import { Lock } from "@material-ui/icons";
import * as appUtil from "../../helper/appUtils";
import * as API from "./../../api/api";

const initialFormData = {
  password: "",
  confirmPassword: "",
};

export default function Password() {
  const [formData, setFormData] = useState(initialFormData);
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [msg, setMsg] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      const requestObj = {
        user_id: userData.id,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      const response = await API.change_password(requestObj);

      if (response.status == 200) {
        setMsg(response.data.message);
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

    if (!confirmPassword) {
      setErrorConfirmPassword({
        field: "confirmPassword",
        message: "Please enter the password",
      });
      flag = false;
    } else if (confirmPassword === password) {
      setErrorConfirmPassword({
        field: "confirmPassword",
        message: "",
      });
      flag = true;
    } else {
      setErrorConfirmPassword({
        field: "confirmPassword",
        message: "Password doesn't match",
      });
      flag = false;
    }
    return flag;
  }

  return (
    <div>
      <div className="bg-white rounded-xl p-4 dashboard-top-space">
        <div className="flex flex-wrap -mx-3 chivo">
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb:mb-8 mb-5 relative">
            <label
              htmlFor="password"
              className="lg:text-xs text-sm font-semibold px-1 text-theme"
            >
              Password
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Lock fontSize="small" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="**********"
              />
            </div>
            {errorPassword.field === "password" && (
              <p className="absolute text-xs text-red-600 mt-2 mr-1">
                {errorPassword.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb:mb-8 mb-5 relative">
            <label
              htmlFor="confirmPassword"
              className="lg:text-xs text-sm font-semibold px-1 text-theme"
            >
              Confirm Password
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Lock fontSize="small" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="**********"
              />
            </div>
            {errorConfirmPassword.field === "confirmPassword" && (
              <p className="absolute text-xs text-red-600 mt-2">
                {errorConfirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex relative">
          <div className="w-full px-3">
            <button
              className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none playfair"
              onClick={handleClick}
            >
              Reset Password
            </button>
            <p className=" text-center text-xs text-green-600 mt-2">{msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
