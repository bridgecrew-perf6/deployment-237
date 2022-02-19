import React, { useState } from "react";
import { Lock } from "@material-ui/icons";
import * as appUtil from "../../helper/appUtils";

const initialFormData = {
  password: "",
  confirmPassword: "",
};

export default function Password() {
  const [formData, setFormData] = useState(initialFormData);
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

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
        msg = "8 digit password required.";
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
      <div>
        <div className="flex flex-wrap -mx-3 chivo">
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="password"
              className="text-xs font-semibold px-1 text-theme"
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
              <p className="text-xs text-red-600 mt-2">
                {errorPassword.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold px-1 text-theme"
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
              <p className="text-xs text-red-600 mt-2">
                {errorConfirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex -mx-3 playfair">
          <div className="w-full px-3 mb-20">
            <button
              className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
              onClick={handleClick}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
