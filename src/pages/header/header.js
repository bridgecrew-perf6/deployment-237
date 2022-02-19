import React, { useState } from "react";
import Button from "../../components/button/button";
import Logo from "./../../assets/images/logo.png";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import { PersonRounded } from "@material-ui/icons";
import { Menu } from "@material-ui/core";
const data = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 3,
    title: "Events",
    path: "/events",
  },
  {
    id: 4,
    title: "Concert",
    path: "/concerts",
  },
  {
    id: 5,
    title: "Blog",
    path: "/blog",
  },
  {
    id: 6,
    title: "Contact",
    path: "/contact-us",
  },
];
export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isUserAuth = localStorage.getItem("isUserAuth") === "true";
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleMobileOpen = () => {
    setOpenMobile(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMobileClose = () => {
    setOpenMobile(false);
  };

  const logout = () => {
    window.localStorage.clear();
    localStorage.setItem("isUserAuth", false);
    history.replace({
      ...location,
      state: undefined,
    });
    history.push({
      pathname: "/login",
    });
  };

  // mobile menu
  const body = (
    <div className="absolute bg-white text-white xl:w-96 lg:w-96 w-72 h-screen right-0 nav-menu">
      <div className="flex flex-row justify-between bg-innerBG px-2">
        <div className="">
          <div className="pt-3 px-2  text-2xl font-semibold">
            {isUserAuth ? `Hi ${userData.first_name},` : "Hey!"}
          </div>
          <div className="text-sm  px-2 pb-2">
            {isUserAuth ? "Edit Profile" : <div className="h-3"></div>}
          </div>
        </div>
        <div className="my-auto">
          <div className="border rounded-full">
            <PersonRounded fontSize="large" />
          </div>
        </div>
      </div>
      <div className="bg-white menu-scroll">
        {!isUserAuth && (
          <div className="bg-white text-black lg:pl-2 lg:px-0 px-2 py-3 toggle-sidebar">
            <Link to="/login" onClick={handleClose}>
              <Button>Login</Button>
            </Link>
            <span className="text-xs"> or </span>
            {/* <span className="text-2xl">/</span> */}
            <Link to="/register" onClick={handleClose}>
              <Button>Register</Button>
            </Link>
          </div>
        )}
        <Link to="/">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Home
          </div>
        </Link>
        <hr />
        <Link to="/events">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Event
          </div>
        </Link>
        <hr />
        <Link to="/concerts">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Concert
          </div>
        </Link>
        <hr />
        <Link to="/blog">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Blog
          </div>
        </Link>
        <hr />
        {isUserAuth ? (
          <Link to={{ pathname: "/profile", state: { tab: "profile" } }}>
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={isUserAuth && handleClose}
            >
              My Account
            </div>
          </Link>
        ) : (
          <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
            My Account
          </div>
        )}
        <hr />
        {isUserAuth ? (
          <Link
            to={{ pathname: "/profile", state: { tab: "Booking History" } }}
          >
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={isUserAuth && handleClose}
            >
              Booking History
            </div>
          </Link>
        ) : (
          <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
            Booking History
          </div>
        )}
        <hr />
        {isUserAuth ? (
          <Link to={{ pathname: "/profile", state: { tab: "ChangePassword" } }}>
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={isUserAuth && handleClose}
            >
              Password
            </div>
          </Link>
        ) : (
          <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
            Password
          </div>
        )}
        <hr />
        <Link to="/offers">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Offers
          </div>
        </Link>
        <hr />
        <Link to="/contact-us">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Help Center
          </div>
        </Link>
        <hr />
        <Link to="/about-us">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            About Us
          </div>
        </Link>
        <hr />
        <Link to="/terms-of-use">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Terms of Use
          </div>
        </Link>

        <hr />
        <Link to="/privacy-policy">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            Privacy Policy
          </div>
        </Link>
        <hr />
        <Link to="/faqs">
          <div
            className="bg-white text-black px-2 py-3 hover:bg-gray-300"
            onClick={handleClose}
          >
            FAQs
          </div>
        </Link>
        <hr />
        <hr />
      </div>
      {isUserAuth && (
        <div
          className="absolute bg-innerBG py-3 px-2 text-xl text-center cursor-pointer w-full bottom-0"
          onClick={logout}
        >
          Logout
        </div>
      )}
    </div>
  );

  // desktop menu
  const desktopbody = (
    <div className="absolute bg-white text-white xl:w-96 lg:w-96 w-72 h-screen right-0 nav-menu">
      <div className="flex flex-row justify-between bg-innerBG px-2">
        <div className="">
          <div className="pt-3 px-2  text-2xl font-semibold">
            {isUserAuth ? `Hi ${userData.first_name},` : "Hey!"}
          </div>
          <div className="text-sm  px-2 pb-2">
            {isUserAuth ? "Edit Profile" : <div className="h-3"></div>}
          </div>
        </div>
        <div className="my-auto">
          <div className="border rounded-full">
            <PersonRounded fontSize="large" />
          </div>
        </div>
      </div>
      <div className="menu-scroll">
        <div className="bg-white">
          {!isUserAuth && (
            <div className="bg-white text-black lg:pl-2 lg:px-0 px-2 py-3 toggle-sidebar">
              <Link to="/login" onClick={handleClose}>
                <Button>Login</Button>
              </Link>
              <span className="text-xs"> or </span>
              {/* <span className="text-2xl">/</span> */}
              <Link to="/register" onClick={handleClose}>
                <Button>Register</Button>
              </Link>
            </div>
          )}
          {isUserAuth ? (
            <Link to={{ pathname: "/profile", state: { tab: "profile" } }}>
              <div
                className="bg-white text-black px-2 py-3 hover:bg-gray-300"
                onClick={isUserAuth && handleClose}
              >
                My Account
              </div>
            </Link>
          ) : (
            <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
              My Account
            </div>
          )}
          <hr />
          {isUserAuth ? (
            <Link
              to={{ pathname: "/profile", state: { tab: "Booking History" } }}
            >
              <div
                className="bg-white text-black px-2 py-3 hover:bg-gray-300"
                onClick={isUserAuth && handleClose}
              >
                Booking History
              </div>
            </Link>
          ) : (
            <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
              Booking History
            </div>
          )}
          <hr />
          {isUserAuth ? (
            <Link to={{ pathname: "/profile", state: { tab: "ChangePassword" } }}>
              <div
                className="bg-white text-black px-2 py-3 hover:bg-gray-300"
                onClick={isUserAuth && handleClose}
              >
                Password
              </div>
            </Link>
          ) : (
            <div className="bg-white text-gray-500 cursor-default px-2 py-3 hover:bg-gray-300">
              Password
            </div>
          )}
          <hr />
          <Link to="/offers">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              Offers
            </div>
          </Link>
          <hr />
          <Link to="/contact-us">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              Help Center
            </div>
          </Link>
          <hr />
          <Link to="/about-us">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              About Us
            </div>
          </Link>
          <hr />
          <Link to="/terms-of-use">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              Terms of Use
            </div>
          </Link>
          <hr />
          <Link to="/privacy-policy">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              Privacy Policy
            </div>
          </Link>
          <hr />
          <Link to="/faqs">
            <div
              className="bg-white text-black px-2 py-3 hover:bg-gray-300"
              onClick={handleClose}
            >
              FAQs
            </div>
          </Link>
        </div>
      </div>
      {isUserAuth && (
        <div
          className="absolute bg-innerBG py-3 px-2 text-xl text-center cursor-pointer w-full bottom-0"
          onClick={logout}
        >
          Logout
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="w-full xl:block lg:block hidden absolute top-5 z-10 h-28 flex mx-auto">
        <div className="flex flex-row justify-center text-white w-full list-none">
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Home
              </div>
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/events">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Events
              </div>
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/concerts">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Concerts
              </div>
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/blog">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Blog
              </div>
            </Link>
          </div>
          <div className="flex items-center justify-center uppercase  w-1/6">
            <Link to="/">
              <img src={Logo} alt="logo" className="xl:h-32 lg:h-28 py-2" />
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/contact-us">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Contact
              </div>
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/about-us">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                About Us
              </div>
            </Link>
          </div>
          <div className="flex items-center uppercase mx-3 w-1/12 justify-center">
            <Link to="/offers">
              <div className=" py-4 cursor-pointer hover:text-gray-300">
                Offer
              </div>
            </Link>
          </div>
          <div
            className="flex items-center uppercase mx-3 w-1/12 justify-center"
            onClick={handleOpen}
          >
            <div className=" cursor-pointer hover:text-gray-300">
              <MenuIcon />
            </div>
          </div>
        </div>
      </div>
      <nav className="overflow-hidden absolute lg:hidden xl:hidden block bg-transparent top-0 z-50 w-full flex flex-wrap items-center justify-between px-2 lg:py-3 md:py-2 py-1.5 navbar-expand-lg text-white">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start items-center">
            <Link to="/" onClick={() => setNavbarOpen(false)}>
              <img src={Logo} alt="logo" className="lg:h-28 md:h-20 h-14 lg:py-2" />
            </Link>
            <button
              className="cursor-pointer text-xl text-riptide-500 leading-none px-3 py-1 border border-solid border-transparent rounded block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => {
                setNavbarOpen(true);
                handleMobileOpen();
              }}
              onBlur={() => {
                setTimeout(() => setNavbarOpen(false), 100);
                // handleClose();
              }}
            >
              <MenuIcon />
            </button>
          </div>
          <div
            className={
              "w-3/4 lg:flex flex-grow items-center bg-theme rounded-xl lg:bg-opacity-0 lg:shadow-none hidden"
            }
            // id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {data.map((item, index) => {
                return (
                  <Link
                    to={item.path}
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    key={index}
                  >
                    <li className="flex items-center uppercase ">
                      <div className="mx-7 py-4 cursor-pointer hover:text-secondary">
                        {item.title}
                      </div>
                    </li>
                  </Link>
                );
              })}

              <li
                className="flex py-4 lg:py-2 xl:py-2 pb-8 items-center capitailize"
                onClick={handleOpen}
              >
                <div className="mr-2 cursor-pointer">
                  <PersonRounded />
                  {isUserAuth ? `Hi ${userData.first_name},` : "Sign In"}
                </div>
                <label
                  for="menu-open"
                  id="mobile-menu-button"
                  className="bg-gradient-to-r from-primary to-secondary
       p-2 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                  // onClick={handleOpen}
                >
                  <svg
                    id="menu-open-icon"
                    class="h-6 w-6 transition duration-200 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {/* <svg
              id="menu-close-icon"
              class="h-6 w-6 transition duration-200 ease-in-out"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg> */}
                </label>
                {/* </div> */}
              </li>
            </ul>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className="relative"
            >
              {desktopbody}
            </Modal>
            <Modal
              open={openMobile}
              onClose={handleMobileClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              className="relative"
            >
              {body}
            </Modal>
          </div>
        </div>
      </nav>
    </>
  );
}
