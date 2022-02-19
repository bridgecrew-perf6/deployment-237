import React, { useState, useEffect } from "react";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import ContactUsBg from "./../../assets/images/Contactus.png";
import Number from "react-number-format";
import * as appUtil from "../../helper/appUtils";
import Banner from "../../components/banner/banner";
import { ArrowBack, Message } from "@material-ui/icons";
import * as API from "./../../api/api";

const initialFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  message: "",
};

export default function ContactUs() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  const [formData, setFormData] = useState(initialFormData);
  const [msg, setMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleClick = async () => {
    setMsg(null);
    setSuccessMsg(null);
    const { firstName, lastName, phoneNumber, email, message } = formData;
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      const requestObj = {
        name: firstName,
        number: phoneNumber,
        email: email,
        message: message,
      };
      const response = await API.contact_us(requestObj);

      if (response.status == 200) {
        setSuccessMsg("We will get back to you soon");
      }
      if (response.status > 399) {
        setMsg(response.data.message);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { firstName, phoneNumber, email, message } = formData;
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

    let validateMessage = appUtil.validateMessage(message);
    if (validateMessage === 1) {
      setErrorMessage({
        field: "message",
        message: "",
      });
    }
    if (!(validateMessage === 1)) {
      let msg = "";
      if (validateMessage === 0) {
        msg = "Please enter your message.";
      } else {
        msg = "Message should contain only characters.";
      }
      setErrorMessage({
        field: "message",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }

  return (
    <>
      <Banner />
      <div className="min-w-screen lg:min-h-screen bg-theme flex items-center justify-center px-5 lg:pt-10 md:pt-10 pt-6 xl:pb-20 md:pb-10 pb-6">
        <div
          className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1000px" }}
        >
          <div className="md:flex w-full lg:h-49rem xl:h-49rem h-auto">
            <div
              className="hidden md:block w-1/2 bg-innerBG px-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${ContactUsBg})` }}
            ></div>
            <div className="w-full lg:h-49rem xl:h-49rem h-auto md:w-1/2 lg:px-10 md:px-7 px-5 bg-innerBG flex flex-col justify-center md:py-0 py-5">
              {userProfile && (
                <ArrowBack
                  fontSize="large"
                  className="text-white"
                  onClick={() => setUserProfile(null)}
                />
              )}
              <div className="text-center lg:my-10 md:my-5 mb-4">
                <h1 className="font-bold text-3xl text-white playfair mb-2">
                  Contact Us
                </h1>
                <p className="chivo text-white">Feel free to get in touch</p>
              </div>

              <div className="flex lg:flex-row xl:flex-row flex-col -mx-3 chivo">
                <div className="w-full px-3 md:mb-5 mb-5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-semibold px-1 text-white"
                  >
                    Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <PersonIcon />
                    </div>
                    <input
                      type="text"
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Name"
                      name="firstName"
                      id="firstName"
                      onChange={handleChange}
                    />
                  </div>

                  {errorFirstName.field === "firstName" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorFirstName.message}
                    </p>
                  )}
                  
                </div>
              </div>
              <div className="flex -mx-3 chivo">
                <div className="w-full px-3 md:mb-5 mb-5">
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
                    <p className="text-xs text-red-600 mt-2">
                      {errorPhone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex -mx-3 chivo">
                <div className="w-full px-3 md:mb-5 mb-5">
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
                    <p className="text-xs text-red-600 mt-2">
                      {errorEmail.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex -mx-3 chivo">
                <div className="w-full px-3 lg:mb-12 md:mb-9 mb-7">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold px-1 text-white"
                  >
                    Message
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-start pt-2 justify-center">
                      <Message />
                    </div>
                    <textarea
                      name="message"
                      id="message"
                      onChange={handleChange}
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    ></textarea>
                    {/* <input
                      type="password"
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="************"
                      name="password"
                      id="password"
                      onChange={handleChange}
                    /> */}
                  </div>
                  {errorMessage.field === "message" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorMessage.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex -mx-3 playfair">
                <div className="w-full px-3 mb-5">
                  <button
                    className="bg-gray-300 border border-white duration-500 ease-in-out focus:outline-none from-primary hover:from-secondary hover:to-primary lg:px-4 px-8 py-2 rounded text-black text-md font-medium to-secondary tracking-normal transition uppercase w-auto w-full xl:px-4"
                    onClick={handleClick}
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              <div className="lg:mb-9 mb-2 text-red-600 text-center text-sm capitalize">
                {msg}
              </div>
              <div className="lg:mb-9 md:mb-6 text-green-300 text-center text-sm capitalize">
                {successMsg}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
