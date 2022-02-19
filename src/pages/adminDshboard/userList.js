import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as appUtil from "./../../helper/appUtils";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as API from "../../api/api";
import { Delete, Edit, Email, Person, Phone, Place } from "@material-ui/icons";
import CityData from "../../data/city.json";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "red",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function Transaction() {
  const classes = useStyles();
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [loading, setLoading] = useState(true);

  const cityOptions = [];
  CityData.map((item) => {
    const option = {
      value: item.id.toString(),
      label: item.en_name,
    };
    cityOptions.push(option);
  });

  useEffect(() => {
    async function userApi() {
      try {
        const data = [];
        const res = await API.user();
        res.data.map((item) => {
          data.push(item);
        });
        setUserList(data);
        setLoading(false);
      } catch (e) {}
    }
    userApi();
  }, [isEdit, isDelete]);

  const [filteredData, setFilteredData] = useState(null);

  const handleEdit = (id) => {
    const data = userList.filter((item) => {
      if (item.id == id) {
        return item;
      }
    });
    setFilteredData(data[0]);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    setUserId(id);
    setIsDelete(true);
  };

  const handleUserDelete = async () => {
    try {
      const response = await API.user_delete(userId);
      if (response.status == 200) {
        setIsDelete(false);
      }
    } catch (e) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const handleStatusChange = (e) => {
    setFilteredData({
      ...filteredData,
      ["is_active"]: !filteredData.is_active,
    });
  };

  const handleSave = async () => {
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      const requestObj = {
        user_id: filteredData.id,
        first_name: filteredData.first_name,
        last_name: filteredData.last_name,
        email: filteredData.email,
        number: filteredData.number,
        city_name: filteredData.city_name,
        is_active:
          filteredData.is_active == "1"
            ? "1"
            : filteredData.is_active == "true"
            ? "1"
            : "0",
      };
      const response = await API.user_update(requestObj);
      if (response.status == 200) {
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const [state, setState] = useState(
    filteredData ? filteredData.status : false
  );

  function validateInput() {
    const { first_name, last_name, email, number } = filteredData;
    let flag = true;

    let validFirstName = appUtil.validateName(first_name);
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
        msg = "First Name should have characters only.";
      }
      setErrorFirstName({
        field: "firstName",
        message: msg,
      });
      flag = false;
    }

    let validLastName = appUtil.validateName(last_name);
    if (validLastName === 1) {
      setErrorLastName({
        field: "lastName",
        message: "",
      });
    }
    if (!(validLastName === 1)) {
      let msg = "";
      if (validLastName === 0) {
        msg = "Please enter your last name.";
      } else {
        msg = "Last name should have characters only.";
      }
      setErrorLastName({
        field: "lastName",
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

    let validatePhone = appUtil.validatePhoneNumber(number);
    if (validatePhone === 1) {
      setErrorPhone({
        field: "phone",
        message: "",
      });
    }
    if (!(validatePhone === 1)) {
      let msg = "";
      if (validatePhone === 0) {
        msg = "Please enter your phone.";
      } else {
        msg = "15 digit phone number allowed.";
      }
      setErrorPhone({
        field: "phone",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">User</div>
      <div className=" font-medium text-gray-400 mb-2">
        All Registered Users
      </div>
      <hr />
      {loading ? (
        <div className="my-2 text-lg">Loading...</div>
      ) : userList.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((vendor) => {
                return (
                  <TableRow
                    key={vendor.id}
                    className="hover:bg-gray-200 cursor-default"
                  >
                    <TableCell>
                      <span className="capitalize">
                        {vendor.first_name + " " + vendor.last_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-800 underline">
                        <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span>{vendor.city_name}</span>
                    </TableCell>
                    <TableCell align="right">
                      <span className="font-bold">{vendor.number}</span>
                    </TableCell>
                    <TableCell>
                      {vendor.is_active == "1" ? (
                        <div className="bg-green-500 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                        </div>
                      ) : (
                        <div className="bg-red-600 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-2">
                        <div
                          onClick={() => handleEdit(vendor.id)}
                          className="cursor-pointer"
                        >
                          <Edit fontSize="small" />
                        </div>
                        |
                        <div
                          onClick={() => handleDelete(vendor.id)}
                          className="cursor-pointer"
                        >
                          <Delete fontSize="small" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="my-2 text-lg">No user found</div>
      )}
      {isEdit && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {filteredData.name}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full flex flex-row ">
                    <div className="w-1/2 px-3 mb-3">
                      <label
                        htmlFor="first_name"
                        className="text-xs font-semibold px-1"
                      >
                        First Name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <Person />
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={filteredData.first_name}
                          onChange={handleChange}
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="email@example.com"
                        />
                      </div>
                      {errorFirstName.field === "firstName" && (
                        <p className="text-xs text-red-600 mt-2">
                          {errorFirstName.message}
                        </p>
                      )}
                    </div>

                    <div className="w-1/2 px-3 mb-3">
                      <label
                        htmlFor="last_name"
                        className="text-xs font-semibold px-1"
                      >
                        Last Name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <Person />
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={filteredData.last_name}
                          onChange={handleChange}
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="email@example.com"
                        />
                      </div>
                      {errorLastName.field === "lastName" && (
                        <p className="text-xs text-red-600 mt-2">
                          {errorLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Email
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Email />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={filteredData.email}
                        readOnly
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {errorEmail.field === "email" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Phone Number
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Phone />
                      </div>
                      <input
                        type="text"
                        name="number"
                        id="number"
                        value={filteredData.number}
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {errorPhone.field === "phone" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full flex flex-row ">
                    <div className="w-1/2 px-3 mb-3">
                      <label
                        htmlFor="city_name"
                        className="text-xs font-semibold px-1"
                      >
                        City Name
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
                          <option value={null} disabled selected>
                            Select City
                          </option>
                          {cityOptions.map((item) => {
                            return (
                              <option value={item.label} key={item.value}>
                                {item.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {errorFirstName.field === "firstName" && (
                        <p className="text-xs text-red-600 mt-2">
                          {errorFirstName.message}
                        </p>
                      )}
                    </div>

                    <div className="w-1/2 px-3 mb-3">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold px-1"
                      >
                        Status
                      </label>
                      <div className="flex">
                        {/* {state}
                      {filteredData[0].status} */}
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              checked={
                                filteredData.is_active == "0" ? false : true
                              }
                              onChange={handleStatusChange}
                              name="checkedB"
                            />
                          }
                          className="pl-2"
                          // label="iOS style"
                        />
                      </div>
                      {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSave}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDelete && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Sure, you want to delete?
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUserDelete}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
