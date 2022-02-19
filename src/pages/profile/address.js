import { Lock } from "@material-ui/icons";
import React, { useState } from "react";
import Button from "../../components/button/button";
import * as API from "./../../api/api";
import * as appUtil from "./../../helper/appUtils";

const initialFormData = {
  password: "",
  confirmPassword: "",
};

export default function UserProfile() {
  const [formData, setFormData] = useState(initialFormData);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const handleChange = (e) => {
    const { value, name } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      let flag = validateInput();
      if (!flag) {
        return;
      }
      const requestObj = {
        user_id: userData.id,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      console.log(requestObj);
      const response = await API.change_password(requestObj);
      console.log(response);
      if (response.status == 200) {
        setMsg(response.data.message);
      }
      // localStorage.setItem("userData", JSON.stringify(response.data));
      // setMsg(true);
      // setLoading(false);
      // setEdit(false);
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
        message: "Please enter confirm password.",
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

  // const {name, email, }
  return (
    <div className="w-full password-page-wrapper">
      <div className="md:px-5 lg:px-8 xl:px-8 md:py-4 px-4 py-3 bg-innerBG text-white lg:text-xl text-lg text-semibold rounded-lg w-full shadow-md">
        Change Password
      </div>
      <div className="bg-innerBG rounded-lg mt-5 xl:py-10 xl:px-6 lg:py-7 lg:px-4 md:py-4 md:px-3 px-1 py-4">
        <div className="flex flex-wrap chivo">
          <div className="lg:w-1/2 xl:w-1/2 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="password"
              className="text-xs font-semibold px-1 text-white"
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

          <div className="lg:w-1/2 xl:w-1/2 md:w-1/2 w-full px-3 lg:mb-8 mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold px-1 text-white"
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

        <div className="flex mt-3 playfair">
          <div className="relative px-3 mx-auto">
            <Button onClick={handleSave}>Change Password</Button>
            <p className="absolute text-xs text-green-600 mt-2">{msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
