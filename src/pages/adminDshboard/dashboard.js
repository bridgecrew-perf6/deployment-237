import React, { useEffect, useState } from "react";
import {
  Call,
  Email,
  Person,
  AttachMoney,
  Theaters,
  AccountBalanceRounded,
  AccountBalanceWallet,
  Code,
  ConfirmationNumber,
} from "@material-ui/icons";
import * as API from "../../api/api";
import * as appUtil from "../../helper/appUtils";
import { Chart } from "react-google-charts";
import Select from "react-select";
import Button from "../../components/button/button";

const initialData = {
  id: "",
  first_name: "",
  last_name: "",
  number: "",
  email: "",
  bank_name: "",
  account_no: "",
  ifsc_code: "",
};

const initialError = {
  field: "",
  message: "",
};

const initialChartData = [
  ['Day', 'Sales'],
    ['1', 1000],
    ['2', 900],
    ['3', 300],
    ['4', 300],
    ['5', 500],
    ['6', 400],
    ['7', 700],
    ['8', 100],
    ['9', 900],
    ['10', 500],
    ['11', 700],
    ['12', 800],
    ['13', 400],
    ['14', 150],
    ['15', 300],
    ['16', 1170],
    ['17', 660],
    ['18', 1030],
    ['19', 30],
    ['20', 200],
    ['21', 300],
    ['22', 230],
    ['23', 230],
    ['24', 400],
    ['25', 500],
    ['26', 390],
    ['27', 220],
    ['28', 200],
    ['29', 350],
    ['30', 400],
]

export default function Dashboard(props) {
  const userData = JSON.parse(localStorage.getItem("userProfileData"));
  const [msg, setMsg] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [vendorList, setVendorList] = useState(null)
  const [selectedVendor, setSelectedVendor ] = useState(null);
  const [selectedMonth, setSelectedMonth ] = useState(null);
  const [chartData, setChartData] = useState(initialChartData)
  const [errorFirstName, setErrorFirstName] = useState(initialError);
  const [errorLastName, setErrorLastName] = useState(initialError);
  const [errorNumber, setErrorNumber] = useState(initialError);
  const [errorBankName, setErrorBankName] = useState(initialError);
  const [errorAccountNo, setErrorAccountNo] = useState(initialError);
  const [errorIfscCode, setErrorIfscCode] = useState(initialError);
  const [totalEarning, setTotalEarning] = useState("0");
  const [totalTickets, setTotalTickets] = useState("0");
  const [totalEvents, setTotalEvents] = useState("0");
  const [totalRevenue, setTotalRevenue] = useState("0");

  useEffect(() => {
    async function Earning() {
      const res = await API.earning_by_admin();
      setTotalEarning(res.data.total_events);
      setTotalRevenue(res.data.revenue);
      setTotalEvents(res.data.total_concerts);
      setTotalTickets(res.data.tickets_sold);
    }
    Earning();


    
    async function Vendor(){
      const res = await API.vendor();
      const data = [];
      res.data.map(item=> {
        const vendor = { 
          value: item.id, label: item.first_name+" "+item.last_name
        }
        return data.push(vendor)
      })
      setSelectedVendor(data[0])
      setVendorList(data);
    }
    Vendor();

  }, [props.tenat_event]);

  if (userData) {
    initialData.id = userData.id;
    initialData.first_name = userData.first_name;
    initialData.last_name = userData.last_name;
    initialData.email = userData.email;
    initialData.number = userData.number;
    initialData.bank_name = userData.bank_name;
    initialData.account_no = userData.account_no;
    initialData.ifsc_code = userData.ifsc_code;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
      };

      const response = await API.vendor_update(requestObj);

      if (response.status === 200) {
        setMsg("Profile Updated Successfully!!");
        localStorage.setItem(
          "userProfileData",
          JSON.stringify(userProfileData)
        );
      }
    } catch (e) {}
  };

  function validateInput() {
    const { first_name, last_name, number, bank_name, account_no, ifsc_code } =
      formData;
    let flag = true;

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

 const options={
    colors: ['#041230'],
  }

  const handleVendorChange = (selectedVendor) => {
    setSelectedVendor(selectedVendor);
    
  }

  const handleMonthChange = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
    
  }
  
  const loadChart = async() =>{
    try{
      const requestObj = {
        vendor_id: selectedVendor.value,
        month: selectedMonth.value
      }
      console.log(requestObj)
      const res = await API.chart(requestObj);
      console.log(res.data)
      if(res.data){
        var result = Object.keys(res.data).map((key) => {
          return ([key, res.data[key]])
        });
        var result1 = [["Day", "Sales"]];

        console.log(result1.concat(result));
        setChartData(result);
      }
    
    }catch(e){}
  }

  const month = [
    {
      value: "01",
      label: "January"
    },
    {
      value: "02",
      label: "February"
    },
    {
      value: "03",
      label: "March"
    },
    {
      value: "04",
      label: "April"
    },
    {
      value: "05",
      label: "May"
    },
    {
      value: "06",
      label: "June"
    },
    {
      value: "07",
      label: "July"
    },
    {
      value: "08",
      label: "August"
    },
    {
      value: "09",
      label: "September"
    },
    {
      value: "10",
      label: "October"
    },
    {
      value: "11",
      label: "November"
    },
    {
      value: "12",
      label: "December"
    }
  ]

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
            {/* <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Last 24 hours</span>
            </div> */}
          </div>
        </div>

        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-red-500 flex justify-center py-2 dashboard-stats-icon">
              <ConfirmationNumber style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                # of Concert
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {totalEvents}
              </div>
            </div>
            {/* <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Upcoming Events</span>
            </div> */}
          </div>
        </div>
        <div className="xl:w-1/4 lg:w-1/4 md:w-2/4 w-full xl:my-2 lg:my-2 mt-5 mb-4 md:p-2 relative lg:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-blue-500 flex justify-center py-2 dashboard-stats-icon">
              <ConfirmationNumber style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1">
                # of Events
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {totalEarning}
              </div>
            </div>
            {/* <div className="border-t-2 pt-2 text-gray-500">
              <Today fontSize="small" />
              <span className="ml-2">Last 24 hours</span>
            </div> */}
          </div>
        </div>

        <div className="xl:w-1/2 xl:my-4 md:mt-1 md:mb-4 mt-3 p-2 relative admin-dashboard-chart">
          <div className="p-5 overflow-visible shadow-lg rounded-2xl h-full bg-white">
            <div className="flex flex-wrap flex-row">
              <div className="flex flex-row w-full mb-3 admin-dashboard-chart-form lg:flex-nowrap flex-wrap">
                <div className="lg:w-1/3 md:w-1/2 w-full md:pr-2">
                  <label htmlFor="email" className="text-xs font-semibold px-1">
                    Vendor Name
                  </label>
                  <div className="flex">
                    <Select
                      value={selectedVendor}
                      onChange={handleVendorChange}
                      options={vendorList}
                      placeholder="Select Vendor"
                      className="focus:outline-none  w-full border-0"
                      classNamePrefix="text-secondary focus:outline-none react-select-container"
                    />
                  </div>
                </div>
                <div className="lg:w-1/3 md:w-1/2 w-full md:pl-2 md:mt-0 mt-3">
                  <label htmlFor="email" className="text-xs font-semibold px-1">
                    Month
                  </label>

                  <div>
                    <div className="flex">
                      <Select
                        // value={selectedVendor}
                        onChange={handleMonthChange}
                        options={month}
                        placeholder="Select Month"
                        className="focus:outline-none  w-full border-0"
                        classNamePrefix="text-secondary focus:outline-none react-select-container"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/3 md:max-w-xs w-full mx-auto lg:pl-2 lg:mt-auto mt-3">
                  <Button onClick={loadChart}>Show</Button>
                </div>
              </div>

              <div className="my-5 w-full">
                <Chart
                  chartType="Bar"
                  data={chartData}
                  options={options}
                  width="100%"
                  height="400px"

                  // legendToggle
                />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:w-1/2 xl:my-4 md:mt-1 mt-4 p-2 relative h-auto admin-dashboard-profile">
          <div className="p-5 overflow-visible shadow-lg rounded-2xl h-full bg-white">
            <div>
              <span className="text-lg font-semibold">My Profile</span>
              <div className="flex flex-wrap -mx-3 mt-2 chivo">
                <div className="md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="firstName"
                    className="text-xs font-semibold px-1 text-theme"
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

                <div className="md:w-1/2 w-full px-3 mb-5">
                  <label
                    htmlFor="last_Name"
                    className="text-xs font-semibold px-1 text-theme"
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
                <div className="w-full px-3 mb-5">
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
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Bank Name
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AccountBalanceRounded fontSize="small" />
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
                    className="text-xs font-semibold px-1 text-theme"
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
                    className="text-xs font-semibold px-1 text-theme"
                  >
                    Routing No
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
      </div>
    </div>
  );
}
