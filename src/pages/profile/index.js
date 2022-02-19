import React, { useState, useEffect } from "react";
import { ExitToApp, History, Lock, Person } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import Banner from "../../components/banner/banner";
import UserProfile from "./userProfile";
import Address from "./address";
import Orders from "./order";
import Select from "react-select";

export default function Index() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  const data = useLocation();
  const allTab = data.state ? data.state.tab : "Profile";
  const history = useHistory();
  const location = useLocation();
  const [tab, setTab] = useState(allTab);
  // const userData = JSON.parse(localStorage.getItem("userData"));
  const renderContent = (tab) => {
    switch (tab) {
      case "ChangePassword":
        return <Address />;
      case "Booking History":
        return <Orders />;
      default:
        return <UserProfile />;
    }
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

  const categoryOptions = [
    { value: 'Profile', label: 'Profile' },
    { value: 'ChangePassword', label: 'Change Password' },
    { value: 'Booking History', label: 'Booking History' },
    { value: 'Logout', label: 'Logout' },
  ]

  const handleChange = (e) => {
    if (e.value === "Logout") {
      logout();
    } else {
      setTab(e.value)
    }
  }

  return (
    <>
      <Banner />
      <div className="min-w-screen lg:min-h-screen bg-theme lg:pt-10 md:pt-5 pt-3.5 d-flex  lg:px-16 xl:px-24 px-4 profile-page-wrapper">
        <div className="flex flex-wrap gap-0">
          <div className="flex flex-col bg-innerBG xl:w-1/4 lg:w-56 md:w-1/4 h-auto lg:px-4 text-gray-900 shadow-lg border-red-800 rounded-lg lg:block xl:block w-96 lg:block hidden">
            <div className="lg:mt-5 mt-3 mb-4">
              <ul className="">
                <li
                  className="mb-2 lg:px-4 px-3 lg:py-4 py-3 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-theme  hover:font-bold rounded rounded-lg cursor-pointer"
                  onClick={() => setTab("Profile")}
                >
                  <span>
                    <Person className="text-white" />
                  </span>
                  <span className="ml-2 text-white py-1">Profile</span>
                </li>
                <li
                  className="mb-2 lg:px-4 px-3 lg:py-4 py-3 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-theme  hover:font-bold rounded rounded-lg cursor-pointer"
                  onClick={() => setTab("ChangePassword")}
                >
                  <span>
                    <Lock className="text-white" />
                  </span>

                  <span className="ml-2 text-white">Change Password</span>
                </li>

                <li
                  className="mb-2 lg:px-4 px-3 lg:py-4 py-3 text-gray-100 flex flex-row  border-gray-300 hover:text-black   hover:bg-theme  hover:font-bold rounded rounded-lg cursor-pointer"
                  onClick={() => setTab("Booking History")}
                >
                  <span>
                    <History className="text-white" />
                  </span>

                  <span className="ml-2 text-white">My Bookings</span>
                </li>

                <li
                  className="mb-2 lg:px-4 px-3 lg:py-4 py-3 text-gray-100 flex flex-row  border-gray-300 hover:text-black hover:bg-theme  hover:font-bold rounded rounded-lg cursor-pointer"
                  onClick={logout}
                >
                  <span>
                    <ExitToApp className="text-white" />
                  </span>

                  <span className="ml-2 text-white">Logout</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="w-full lg:w-3/4 flex px-2 rounded-lg lg:my-0 lg:hidden block mb-4 relative z-10">
            <div className="md:px-5 lg:px-8 xl:px-8 px-4 py-4 bg-innerBG text-xl rounded-lg w-full shadow-md">
                <div className="w-full lg:w-3/4 flex rounded-lg lg:my-0">
                  <div className="mobile-select w-full">
                    <Select
                      //   value={selectedMovie}
                      onChange={handleChange}
                      options={categoryOptions}
                      placeholder="Select category"
                      className="w-full focus:outline-none border-0 text-base"
                      classNamePrefix="focus:outline-none react-select-container"
                    />
                  </div>
                </div>
            </div>
          </div>
         

          <div className="w-full lg:w-3/4 flex px-2 rounded-lg lg:my-0 relative z-0">
            {renderContent(tab)}
          </div>
        </div>
      </div>
    </>
  );
}
