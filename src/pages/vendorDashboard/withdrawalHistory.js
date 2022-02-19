import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Delete, Edit, Email, Phone } from "@material-ui/icons";
import * as API from "./../../api/api";
import dateFormat from "dateformat";
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

const rows = [
  {
    id: 1,
    date: "12-06-2021",
    ticketId: "MTG001",
    name: "Vaibhav Sinha",
    category: "Movie",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    amount: 123,
  },
];

const initialWithdrawalHistory = [
  {
    id: "",
    created_at: "",
    transaction_id: "",
    payment_mode: "",
    payment_status: "",
    amount: "",
  },
];

export default function WithdrawalHistory() {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [filteredData, setFilteredData] = useState(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState(
    initialWithdrawalHistory
  );
  useEffect(() => {
    async function WithdrawalHistoryAPI() {
      const res = await API.withdrawal_history(userData.id);
      const data = [];
      !res.data.message &&
        res.data.map((item) => {
          data.push(item);
        });
      setWithdrawalHistory(data);
    }
    WithdrawalHistoryAPI();
  }, []);
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Transaction</div>
      <div className=" font-medium text-gray-400 mb-2">
        All Transaction History
      </div>
      <hr />
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Transaction Id</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawalHistory.map((row) => {
              const month = dateFormat(row.created_at, "mmmm");
              const day = dateFormat(row.created_at, "dS, yyyy");
              const date = month.substring(0, 3) + " " + day;
              return (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-200 cursor-default"
                >
                  <TableCell component="th" scope="row">
                    {date}
                  </TableCell>
                  <TableCell>
                    {row.transaction_id ? row.transaction_id : "N/A"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {row.payment_mode ? row.payment_mode : "N/A"}
                  </TableCell>

                  <TableCell align="right">
                    <span className="font-bold">
                      ${Number(row.amount).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.payment_status === "1" ? (
                      <div className="flex justify-center">
                        <div className="bg-green-500 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="bg-red-600 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
                {/* <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {filteredData[0].name}
                    </h3>
                  </div>
                </div> */}
                <div className="flex flex-col -mx-3 chivo">
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
                        value={filteredData[0].email}
                        // onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
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
                        type="email"
                        name="email"
                        id="email"
                        value={filteredData[0].phoneNumber}
                        // onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
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
                            checked={filteredData[0].status}
                            // onChange={handleChange}
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
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
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
    </div>
  );
}
