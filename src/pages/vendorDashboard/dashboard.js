import React, { useState, useEffect } from "react";
import {
  Call,
  Email,
  Person,
  AttachMoney,
  EventAvailable,
  Theaters,
  AccountBalance,
  AccountBalanceWallet,
  Code,
  Place,
} from "@material-ui/icons";
import * as API from "../../api/api";
import * as appUtil from "../../helper/appUtils";
import CityData from "../../data/city.json";

const initialData = {
  id: "",
  first_name: "",
  last_name: "",
  number: "",
  email: "",
  city_name: "",
  bank_name: "",
  account_no: "",
  ifsc_code: "",
  street_address: "",
  state: "",
  zip: ""
};

const initialError = {
  field: "",
  message: "",
};

export default function Dashboard(props) {
  const userData = JSON.parse(localStorage.getItem("userProfileData"));
  const [stateDatas, setStateDatas] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [msg, setMsg] = useState(null);
  const [totalEarning, setTotalEarning] = useState("0");
  const [totalTickets, setTotalTickets] = useState("0");
  const [totalEvents, setTotalEvents] = useState("0");
  const [totalRevenue, setTotalRevenue] = useState("0");

  useEffect(() => {
    async function Earning() {
      const res = await API.earning_by_vendor(userData.id);
      setTotalEarning(res.data.earnings);
      setTotalRevenue(res.data.revenue);
      setTotalEvents(res.data.concerts + res.data.movies + res.data.events);
      setTotalTickets(res.data.tickets);

    }
    if (userData.state && userData.state != "") {
      getCitiesByState(userData.state);
    }
    Earning();
    getStates();
  }, [props.tenat_event]);


  const getStates = async () => {
    await API.getAllStates().then(res => {
      setStateDatas(res.data);
    }).catch(err => {
    })
  }

  const getCitiesByState = async (state) => {
    if (state) {
      await API.getAllCitiesByState(state).then(res => {
        console.log("all cities", res.data);
        setAllCities(res.data);
      }).catch(err => {
      })
    }
  }

  if (userData) {
    initialData.id = userData.id;
    initialData.first_name = userData.first_name;
    initialData.last_name = userData.last_name;
    initialData.email = userData.email;
    initialData.number = userData.number;
    initialData.bank_name = userData.bank_name;
    initialData.city_name = userData.city_name;
    initialData.street_address = userData.street_address;
    initialData.state = userData.state;
    initialData.zip = userData.zip;
    initialData.account_no = userData.account_no;
    initialData.ifsc_code = userData.ifsc_code;
  }

  const [formData, setFormData] = useState(initialData);
  const [errorFirstName, setErrorFirstName] = useState(initialError);
  const [errorLastName, setErrorLastName] = useState(initialError);
  const [errorNumber, setErrorNumber] = useState(initialError);
  const [errorBankName, setErrorBankName] = useState(initialError);
  const [errorAccountNo, setErrorAccountNo] = useState(initialError);
  const [errorIfscCode, setErrorIfscCode] = useState(initialError);
  const [errorCity, setErrorCity] = useState("");
  const [errorStreetAddress, setErrorStreetAddress] = useState("");
  const [errorState, setErrorState] = useState("");
  const [errorZip, setErrorZip] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const cityOptions = [];
  CityData.map((item) => {
    const option = {
      value: item.id.toString(),
      label: item.en_name,
    };
    cityOptions.push(option);
  });

  const handleClick = async () => {
    setMsg(null);
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      const requestObj = {
        user_id: formData.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        number: formData.number,
        email: formData.email,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        ifsc_code: formData.ifsc_code,
        city_name: formData.city_name,
        street_address: formData.street_address,
        state: formData.state,
        zip: formData.zip,
        commission: userData.commission ? userData.commission : "0",
        is_active: 1,
      };
      const userProfileData = {
        id: formData.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        number: formData.number,
        email: formData.email,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        ifsc_code: formData.ifsc_code,
        city_name: formData.city_name,
        state: formData.state,
        zip: formData.zip,
        street_address: formData.street_address,
      };
      const response = await API.vendor_update(requestObj);
      if (response.status == 200) {
        setMsg("Profile Updated Successfully!!");
        localStorage.setItem(
          "userProfileData",
          JSON.stringify(userProfileData)
        );
      }
    } catch (e) { }
  };

  function validateInput() {
    const {
      first_name,
      last_name,
      number,
      bank_name,
      city_name,
      account_no,
      ifsc_code,
      street_address,
      state,
      zip
    } = formData;
    let flag = true;

    if (city_name != null) {
      setErrorCity({
        field: "city",
        message: "",
      });
    } else {
      setErrorCity({
        field: "city",
        message: "Please select your city",
      });
      flag = false;
    }
    if (street_address != null) {
      setErrorStreetAddress({
        field: "street_address",
        message: "",
      });
    } else {
      setErrorStreetAddress({
        field: "city",
        message: "Please enter street address",
      });
      flag = false;
    }

    if (state != null) {
      setErrorState({
        field: "state",
        message: "",
      });
    } else {
      setErrorState({
        field: "state",
        message: "Please enter state",
      });
      flag = false;
    }

    if (zip != null) {
      setErrorZip({
        field: "zip",
        message: "",
      });
    } else {
      setErrorZip({
        field: "zip",
        message: "Please enter zip",
      });
      flag = false;
    }

    if (bank_name) {
      setErrorBankName({
        field: "bank_name",
        message: "",
      });
    } else {
      setErrorBankName({
        field: "bank_name",
        message: "Please enter the bank name",
      });
      flag = false;
    }

    if (account_no) {
      setErrorAccountNo({
        field: "account_no",
        message: "",
      });
    } else {
      setErrorAccountNo({
        field: "account_no",
        message: "Please enter the account number",
      });
      flag = false;
    }

    if (ifsc_code) {
      setErrorIfscCode({
        field: "ifsc_code",
        message: "",
      });
    } else {
      setErrorIfscCode({
        field: "ifsc_code",
        message: "Please enter the ifsc code",
      });
      flag = false;
    }

    let validatePhone = appUtil.validatePhoneNumber(number);
    if (validatePhone === 1) {
      setErrorNumber({
        field: "number",
        message: "",
      });
    }
    if (!(validatePhone === 1)) {
      let msg = "";
      if (validatePhone === 0) {
        msg = "Please enter your phone number";
      } else {
        msg = "Please check phone number format";
      }
      setErrorNumber({
        field: "number",
        message: msg,
      });
      flag = false;
    }

    let validateFirstName = appUtil.validateName(first_name);
    if (validateFirstName === 1) {
      setErrorFirstName({
        field: "first_name",
        message: "",
      });
    }
    if (!(validateFirstName === 1)) {
      let msg = "";
      if (validateFirstName === 0) {
        msg = "Please enter your first name";
      } else {
        msg = "Please check first name format";
      }
      setErrorFirstName({
        field: "first_name",
        message: msg,
      });
      flag = false;
    }

    let validateLastName = appUtil.validateName(last_name);
    if (validateLastName === 1) {
      setErrorLastName({
        field: "last_name",
        message: "",
      });
    }
    if (!(validateLastName === 1)) {
      let msg = "";
      if (validateLastName === 0) {
        msg = "Please enter your first name";
      } else {
        msg = "Please check last name format";
      }
      setErrorLastName({
        field: "last_name",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }
  return (
    <div>
      <div className="flex flex-wrap dashboard-wrapper">
        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-yellow-500 flex justify-center py-2 dashboard-stats-icon">
              <AttachMoney style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                Revenue
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                $ {Number(totalRevenue).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-green-500 flex justify-center py-2 dashboard-stats-icon">
              <Theaters style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                Tickets
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {totalTickets}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-red-500 flex justify-center py-2 dashboard-stats-icon">
              <EventAvailable style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                # of Events
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {totalEvents}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-blue-500 flex justify-center py-2 dashboard-stats-icon">
              <AttachMoney style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                Earning
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                $ {Number(totalEarning).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:my-0 lg:my-0 md:p-2 relative h-auto">
          <div className="lg:p-6 md:p-5 p-4 overflow-visible shadow-lg rounded-2xl h-full bg-white">
            <div>
              <span className="text-lg font-semibold mb-3 block">My Profiles</span>
              <div className="flex flex-wrap -mx-3 mt-2 chivo">
                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="firstName"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    First Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Person fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      id="firstName"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                      placeholder="First Name"
                    />
                  </div>
                  {errorFirstName.field === "first_name" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorFirstName.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="last_Name"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Last Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Person fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      id="last_Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                      placeholder="Last Name"
                    />
                  </div>
                  {errorLastName.field === "last_name" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorLastName.message}
                    </p>
                  )}
                </div>
                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="street_address"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Street Address
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place />
                    </div>
                    <input
                      type="text"
                      name="street_address"
                      id="street_address"
                      value={formData.street_address}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                      placeholder="Street Address"
                    />
                  </div>
                  {errorStreetAddress.field === "street_address" && (
                    <p className="absolute text-xs text-red-600 mt-2">
                      {errorStreetAddress.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="state"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    State
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place />
                    </div>
                    <select
                      type="text"
                      name="state"
                      id="state"
                      onChange={(e) => { handleChange(e); getCitiesByState(e.target.value); }}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    >
                      <option value={null} disabled>
                        Select State
                      </option>
                      {/* {stateOptions.map((item) => {
                        return (
                          <option
                            value={item.label}
                            key={item.value}
                            selected={formData.state === item.label}
                          >
                            {item.label}
                          </option>
                        );
                      })} */}
                      {stateDatas && stateDatas.map(sData => {
                        return (
                          <>
                            <option
                              value={sData.state}
                              key={sData.state_code}
                              selected={formData.state === sData.state}
                            >
                              {sData.state}
                            </option>
                          </>
                        )
                      })}
                    </select>
                  </div>
                  {errorState.field === "state" && (
                    <p className="absolute text-xs text-red-600 mt-2">
                      {errorState.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="city_name"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    City
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place />
                    </div>

                    <select
                      type="text"
                      name="city_name"
                      id="city_name"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    >
                      <option value={null}>
                        Select City
                      </option>
                      {allCities.map((item) => {
                        return (
                          <option
                            value={item.city}
                            key={item.city}
                            selected={formData.city_name === item.city}
                          >
                            {item.city}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {errorCity.field === "city" && (
                    <p className="absolute text-xs text-red-600 mt-2">
                      {errorCity.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/3 md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="zip"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Zip Code
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place />
                    </div>
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 capitalize outline-none focus:border-innerBG"
                      placeholder="Zip Code"
                    />
                  </div>
                  {errorZip.field === "zip" && (
                    <p className="absolute text-xs text-red-600 mt-2">
                      {errorZip.message}
                    </p>
                  )}
                </div>
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="phoneNumber"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Call fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="number"
                      id="phoneNumber"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="6205630243"
                    />
                  </div>
                  {errorNumber.field === "number" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorNumber.message}
                    </p>
                  )}
                </div>
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="email"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
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
                      readOnly
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="vaibhavsinha619@gmail.com"
                    />
                  </div>
                </div>
                <div className="w-full text-lg font-semibold px-4 underline my-2">
                  Account Details
                </div>
                <div className="w-full px-3 mb-5">
                  <label
                    htmlFor="bank_name"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Bank Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AccountBalance fontSize="small" />
                    </div>
                    <input
                      type="type"
                      name="bank_name"
                      id="bank_name"
                      onChange={handleChange}
                      value={formData.bank_name}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="ABC Bank"
                    />
                  </div>
                  {errorBankName.field === "bank_name" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorBankName.message}
                    </p>
                  )}
                </div>
                <div className="md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="account_no"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Account Number
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AccountBalanceWallet fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="account_no"
                      id="account_no"
                      onChange={handleChange}
                      value={formData.account_no}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="00000000000"
                    />
                  </div>
                  {errorAccountNo.field === "account_no" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorAccountNo.message}
                    </p>
                  )}
                </div>
                <div className="md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="ifsc_code"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Routing Number
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Code fontSize="small" />
                    </div>
                    <input
                      type="type"
                      name="ifsc_code"
                      id="ifsc_code"
                      onChange={handleChange}
                      value={formData.ifsc_code}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="ABC00123"
                    />
                  </div>
                  {errorIfscCode.field === "ifsc_code" && (
                    <p className="text-xs text-red-600 mt-2">
                      {errorIfscCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex -mx-3 playfair">
                <div className="w-full px-3">
                  <button
                    className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-2xl px-3 py-3 font-semibold focus:outline-none"
                    onClick={handleClick}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="text-xs text-green-400 text-center my-2">
                {msg}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:w-1/2 hidden lg:w-1/2 w-full xl:my-4 lg:my-4 my-5 p-2 relative h-auto">
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
