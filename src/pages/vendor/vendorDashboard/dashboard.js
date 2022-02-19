import React, { useState } from "react";
import {
  Call,
  Email,
  Person,
  AttachMoney,
  EventAvailable,
  Theaters,
  Today,
  Edit,
  AccountBalance,
  AccountBalanceWallet,
  Code,
} from "@material-ui/icons";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [edit, setEdit] = useState(false);
  const userData = useSelector((state) => state.userData.userData);
  console.log(userData);
  return (
    <div>
      <div className="flex flex-wrap">
        <div className="xl:w-1/4 lg:w-1/4 w-full xl:my-2 lg:my-2 my-5 p-2 relative h-36">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="w-20 h-20 -mt-6 ml-2 absolute rounded shadow-lg absolute bg-yellow-500 flex justify-center py-2">
              <AttachMoney style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="h-24">
              <div className="text-right text-xl text-gray-500 py-1">
                Revenue
              </div>
              <div className="text-right text-2xl font-semibold text-gray-600">
                $ 34,245.00
              </div>
            </div>
            <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Last 24 hours</span>
            </div>
          </div>
        </div>

        <div className="xl:w-1/4 lg:w-1/4 w-full xl:my-2 lg:my-2 my-5 p-2 relative h-36">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="w-20 h-20 -mt-6 ml-2 absolute rounded shadow-lg absolute bg-green-500 flex justify-center py-2">
              <Theaters style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="h-24">
              <div className="text-right text-xl text-gray-500 py-1">
                Tickets
              </div>
              <div className="text-right text-2xl font-semibold text-gray-600">
                4,245
              </div>
            </div>
            <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Last 24 hours</span>
            </div>
          </div>
        </div>

        <div className="xl:w-1/4 lg:w-1/4 w-full xl:my-2 lg:my-2 my-5 p-2 relative h-36">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="w-20 h-20 -mt-6 ml-2 absolute rounded shadow-lg absolute bg-red-500 flex justify-center py-2">
              <EventAvailable style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="h-24">
              <div className="text-right text-xl text-gray-500 py-1">
                Events
              </div>
              <div className="text-right text-2xl font-semibold text-gray-600">
                100
              </div>
            </div>
            <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Upcoming Events</span>
            </div>
          </div>
        </div>
        <div className="xl:w-1/4 lg:w-1/4 w-full xl:my-2 lg:my-2 my-5 p-2 relative h-36">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="w-20 h-20 -mt-6 ml-2 absolute rounded shadow-lg absolute bg-blue-500 flex justify-center py-2">
              <AttachMoney style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="h-24">
              <div className="text-right text-xl text-gray-500 py-1">
                Commission
              </div>
              <div className="text-right text-2xl font-semibold text-gray-600">
                $ 245.00
              </div>
            </div>
            <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Last 24 hours</span>
            </div>
          </div>
        </div>

        <div className="xl:w-1/2 lg:w-1/2 w-full xl:my-4 lg:my-4 my-5 p-2 relative h-auto">
          <div className="p-6 overflow-visible shadow-lg rounded-2xl h-full bg-white">
            <div>
              <span className="text-lg font-semibold">My Profile</span>
              <div className="flex flex-wrap -mx-3 mt-2 chivo">
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Person fontSize="small" />
                    </div>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      value={userData.first_name + " " + userData.last_name}
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Vaibhav Sinha"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="phoneNumber"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Call fontSize="small" />
                    </div>
                    <input
                      type="phoneNumber"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={userData.number}
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="6205630243"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Email
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Email fontSize="small" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email}
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="vaibhavsinha619@gmail.com"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
                <div className="w-full text-lg font-semibold px-4 underline my-2">
                  Account Details
                </div>
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Bank Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AccountBalance fontSize="small" />
                    </div>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Vaibhav Sinha"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Account Number
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AccountBalanceWallet fontSize="small" />
                    </div>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Vaibhav Sinha"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    IFSC Code
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Code fontSize="small" />
                    </div>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      // onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Vaibhav Sinha"
                    />
                  </div>
                  {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
                </div>
              </div>

              <div className="flex -mx-3 playfair">
                <div className="w-full px-3">
                  <button
                    className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-2xl px-3 py-3 font-semibold focus:outline-none"
                    //   onClick={handleClick}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:w-1/2 lg:w-1/2 w-full xl:my-4 lg:my-4 my-5 p-2 relative h-auto">
          <div className="h-1/2 pb-2">
            <div className="p-3 shadow-lg overflow-hidden rounded-2xl h-full bg-white">
              <span className="text-lg font-semibold">My transactions</span>
              <hr />
              <div className="overflow-y-auto h-44 py-2">
                <div className="shadow-lg my-2 rounded-xl hover:bg-gray-200">
                  <div className="flex items-center">
                    <div className="w-1/3 p-3 text-center">
                      <div className="">
                        <div className="font-bold">Pateron Membersip</div>
                        <div>20 May 2021</div>
                      </div>
                    </div>
                    <div className="w-1/3 p-2 text-center">
                      <div className=" font-semibold">Recived</div>
                    </div>
                    <div className="w-1/3 p-2 text-center">
                      <div className=" font-bold text-lg my-auto">$240.00</div>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg my-2 rounded-xl hover:bg-gray-200">
                  <div className="flex items-center">
                    <div className="w-1/3 p-3 text-center">
                      <div className="">
                        <div className="font-bold">Pateron Membersip</div>
                        <div>20 May 2021</div>
                      </div>
                    </div>
                    <div className="w-1/3 p-2 text-center">
                      <div className=" font-semibold">Recived</div>
                    </div>
                    <div className="w-1/3 p-2 text-center">
                      <div className=" font-bold text-lg my-auto">$240.00</div>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg my-2 rounded-xl hover:bg-gray-200">
                  <div className="flex items-center">
                    <div className="w-1/3 p-3">
                      <div className="">
                        <div className="font-bold">Pateron Membersip</div>
                        <div>20 May 2021</div>
                      </div>
                    </div>
                    <div className="w-1/3 p-2">
                      <div className=" font-semibold">Recived</div>
                    </div>
                    <div className="w-1/3 p-2">
                      <div className=" font-bold text-lg my-auto">$240.00</div>
                    </div>
                  </div>
                </div>

                <div className="shadow-lg my-2 rounded-xl hover:bg-gray-200">
                  <div className="flex items-center">
                    <div className="w-1/3 p-3">
                      <div className="">
                        <div className="font-bold">Pateron Membersip</div>
                        <div>20 May 2021</div>
                      </div>
                    </div>
                    <div className="w-1/3 p-2">
                      <div className=" font-semibold">Recived</div>
                    </div>
                    <div className="w-1/3 p-2">
                      <div className=" font-bold text-lg my-auto">$240.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1/2 pt-2">
            <div className="p-3 overflow-visible shadow-lg rounded-2xl h-full bg-white">
              <div className="text-white">Some Fields</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
