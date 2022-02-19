// import FooterImg from "./../../assets/images/pattern_nextjs_footer.png";
import React, { useState } from "react";
import FooterImage from "../../assets/icons/footer2.png";
import FooterBg from "../../assets/icons/footerBG.png";
import Logo from "./../../assets/images/logo.png";
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import * as API from "../../api/api";
import * as appUtil from "../../helper/appUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Email, Mail } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

const initialEmail = {
  email: "",
};
export default function Footer() {
  const history = useHistory();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState(initialEmail);
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

  const handleSubmit = async () => {
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
      const response = await API.subscription(requestObj);
      if (response.status == "200") {
        setMsg("We will get back to you soon!!");
        setLoader(false);
      }
    } catch (e) { }
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
    <div
      className="mt-4 md:mt-0 py-2 lg:py-12 md:py-6 bg-cover text-white relative bg-cover bg-top"
      style={{ backgroundImage: `url(${FooterBg})` }}
    >
      <div
        className="bg-red-200 lg:w-9/12 xl:w-9/12 w-full lg:h-72 xl:h-72 h-auto rounded-xl bg-gradient-to-r from-primary to-secondary lg:mx-auto xl:mx-auto lg:p-10 xl:p-10 p-2 lg:mb-12 md:mb-0 mb-8 bg-cover bg-center subscription-cta"
        style={{ backgroundImage: `url(${FooterImage})` }}
      >
        <div className="text-center my-auto flex flex-wrap flex-col content-center justify-center">
          <div className="uppercase text-red-600 font-bold text-lg lg:my-2 xl:my-2 my-1 cta-small-heading">
            Subscribe to event mania
          </div>
          <div className="uppercase font-bold text-3xl lg:my-2 xl:my-2 my-1 cta-heading">
            To get exclusive benefits
          </div>
          <div className="relative lg:my-2 xl:my-2 my-1">
            <div className="w-full px-3 mb-5">
              <div className="flex">
                <div className="w-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                  <Email className="" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  className="w-full -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG text-theme"
                  placeholder="email@example.com"
                />
              </div>
              {errorEmail.field === "email" && (
                <p className="absolute text-xs text-red-600 mt-2 text-left ml-4">
                  {errorEmail.message}
                </p>
              )}
              <p className="absolute text-xs text-green-300 mt-2 text-left ml-4">
                {msg}
              </p>
            </div>
            <div className="absolute top-0 lg:right-3 xl:right-3 right-0 subscription-append-btn">
              <button
                className="bg-secondary py-3 px-3 text-sm rounded-r-lg focus:outline-none"
                onClick={handleSubmit}
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
                  <>
                    <span className="xl:block lg:block hidden">Subscribe</span>
                    <span className="lg:hidden xl:hidden">
                      <Mail fontSize="small" />
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="capitalize text-md mb-2">
            We respect your privacy, so we never share your info
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="sm:flex sm:flex-wrap sm:-mx-4 md:py-4">
          <div className="md:px-4 w-full lg:w-1/4 xl:w-1/4 lg:px-10 lg:block xl:block flex md:justify-center my-2">
            {/* <Link to="/"> */}
            <img src={Logo} alt="logo" className="footer-img" />
            {/* </Link> */}
          </div>

          <div className="flex lg:flex-row xl:flex-row justify-between md:px-4 w-full lg:w-3/4 xl:w-3/4 my-auto text-sm lg:text-sm text-xs lg:px-10 footer-menu">
            <div className="flex flex-col footer-menu-col uppercase">
              <Link to="/">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Home</div>
              </Link>

              <Link to="/events">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Event</div>
              </Link>
              <Link to="/concerts">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Concerts</div>
              </Link>
            </div>
            <div className="flex flex-col footer-menu-col uppercase">
              <Link to="/blog">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Blog</div>
              </Link>
              <Link to="/contact-us">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Contact Us</div>
              </Link>
              {userData ? (
                <>
                  <Link to="/profile">
                    <div className="lg:mr-8 xl:mr-8 mr-1 py-1">My Account</div>
                  </Link>
                  <Link to="/login">
                    <div
                      className="lg:mr-8 xl:mr-8 mr-1 py-1"
                      onClick={() => {
                        window.localStorage.clear();
                        localStorage.setItem("isUserAuth", false);
                        history.replace({
                          ...location,
                          state: undefined,
                        });
                        history.push({
                          pathname: "/login",
                        });
                      }}
                    >
                      Logout
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Login</div>
                  </Link>
                  <Link to="/register">
                    <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Register</div>
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-col footer-menu-col uppercase">
              <Link to="/about-us">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">About</div>
              </Link>
              <Link to="/terms-of-use">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Terms of Use</div>
              </Link>
              <Link to="/privacy-policy">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">Privacy Policy</div>
              </Link>
              <Link to="/faqs">
                <div className="lg:mr-8 xl:mr-8 mr-1 py-1">FAQ</div>
              </Link>
            </div>
            <div className="flex flex-col footer-menu-col footer-address">
              Eventmania.com
              <br />
              941 FM 1355
              <br />
              Bishop, Texas 78343
              <br />
              United States
            </div>
          </div>

       
          {/* </div> */}
        </div>

        <div className="sm:flex sm:flex-wrap border-t border-riptide-500 pt-3 chivo lg:text-sm xl:text-sm text-xs px-1 lg:mx-6">
          <div className="sm:w-full md:w-1/2 lg:text-left xl:text-left text-center my-1">
            Copyright © 2021.All Rights Reserved By Event Mania
          </div>
          <div className="sm:w-full md:w-1/2 lg:text-right xl:text-right text-center my-1">
            Design and Development by{" "}
            <span className="text-red-600">Event Mania</span>
          </div>
        </div>
      </div>
    </div>
  );
}
