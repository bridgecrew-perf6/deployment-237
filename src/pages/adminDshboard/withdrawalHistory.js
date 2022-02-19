import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select from "react-select";
import { AccessTime, AccessTimeOutlined, Receipt } from "@material-ui/icons";
import * as API from "./../../api/api";
import dateFormat from "dateformat";
import Button from "../../components/button/button";
import DatePicker from "react-datepicker";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const initialWithdrawalHistory = [
  {
    amount: "",
    created_at: "",
    id: "",
    payment_mode: "",
    payment_status: "",
    transaction_id: "",
    updated_at: "",
    vendor: {
      account_no: "",
      bank_name: "",
      commission: "",
      created_at: "",
      email: "",
      first_name: "",
      id: "",
      ifsc_code: "",
      is_active: "",
      last_name: "",
      number: "",
      role: "",
    },
    vendor_id: "",
  },
];

const initialFormData = {
  transactionId: "",
  paymentMode: "",
};

export default function WithdrawalHistory() {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [withdrawalHistory, setWithdrawalHistory] = useState(
    initialWithdrawalHistory
  );
  const [startDate, setStartDate] = useState(new Date())
  const [error, setError] = useState("");
  const [modeError, setModeError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [id, setId] = useState(null);
  const movieOptions = [
    { value: "offline", label: "Offline" },
    { value: "online", label: "Online" },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function WithdrawalHistoryAPI() {
      const res = await API.withdrawal_request_by_vendor();
      const data = [];
      res.data.map((item) => {
        data.push(item);
      });
      setWithdrawalHistory(data);
      setLoading(false);
    }
    WithdrawalHistoryAPI();
  }, [isEdit]);

  const handlePay = (id) => {
    setIsEdit(true);
    setId(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModeChange = (selectedMovie) => {
    setSelectedMovie(selectedMovie);
  };

  const validate = () => {
    let flag = true;
    if (formData.transactionId) {
      setError("");
    } else {
      flag = false;
      setError("Please enter transaction id.");
    }

    if (selectedMovie) {
      setModeError("");
    } else {
      flag = false;
      setModeError("Please select the payment transaction mode.");
    }
    return flag;
  };

  const handleSubmit = async () => {
    setLoader(true);
    const flag = validate();
    if (!flag) {
      setLoader(false);
      return;
    }
    try {
      const requestObj = {
        transaction_id: formData.transactionId,
        payment_mode: selectedMovie.label,
        withdraw_id: id,
        payment_date: dateFormat(startDate, "yyyy-mm-dd"),
      };
      console.log(requestObj)
      const response = await API.paid_withdrawal_history(requestObj);
      if (response.status === 200) {
        setIsEdit(false);
        setLoader(false);
        setFormData(initialFormData);
      }
    } catch (e) {
      setLoader(false);
    }
  };

  let totalAmount = 0;
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">
        Withdrawal History
      </div>
      <div className=" font-medium text-gray-400 mb-2">
        All Withdrawal History
      </div>
      <hr />
      {loading ? (
        <div className="my-2 text-lg">Loading...</div>
      ) : withdrawalHistory.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction Id</TableCell>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date of Transaction</TableCell>
                <TableCell align="center">Payment Status</TableCell>

                <TableCell align="center">Pay Now</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawalHistory.map((row) => {
                console.log(row)
                if(row.payment_status=== "1"){
                  totalAmount += parseInt(row.amount);
                }
                const month = dateFormat(row.created_at, "mmmm");
                const day = dateFormat(row.created_at, "dS, yyyy");
                const date = month.substring(0, 3) + " " + day;
                const pMonth = dateFormat(row.payment_date, "mmmm");
                const pDay = dateFormat(row.payment_date, "dS, yyyy");
                const pDate = pMonth.substring(0, 3) + " " + pDay;
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
                      {/* {row.vendor.first_name + " " + row.vendor.last_name} */}
                      {row.vendor !== null ? `${row.vendor?.first_name} ${row.vendor?.last_name}` : '-'}

                    </TableCell>
                    <TableCell className="capitalize">
                      {row.payment_mode ? row.payment_mode : "N/A"}
                    </TableCell>

                    <TableCell align="right">
                      <span className="font-bold">
                        ${Number(row.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{pDate}</TableCell>
                    <TableCell>
                      {row.payment_status === "1" ? (
                        <div className="flex flex-row justify-center">
                          <div className="bg-green-500 rounded-full w-10 h-6 relative flex flex-row justify">
                            <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-row justify-center">
                          <div className="bg-red-600 rounded-full w-10 h-6 relative">
                            <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {row.payment_status === "1" ? (
                        <Button cancel disable>
                          Paid
                        </Button>
                      ) : (
                        <Button onClick={() => handlePay(row.id)}>
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow >
                <TableCell colSpan={4}>Total Withdraw</TableCell>
                <TableCell align={"right"}><span className="font-bold">${Number(totalAmount).toFixed(2)}</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="my-2 text-lg">No data found</div>
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                      htmlFor="transactionId"
                      className="text-xs font-semibold px-1"
                    >
                      Transaction Id
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Receipt />
                      </div>
                      <input
                        type="text"
                        name="transactionId"
                        id="transactionId"
                        value={formData.transactionId}
                        // value={filteredData[0].email}
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="00000000000"
                      />
                    </div>

                    <p className="text-xs text-red-600 mt-2">{error}</p>
                  </div>
                  <div className="w-full px-3 mb-3 flex">
                  <div className="w-full pr-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Payment Mode
                    </label>
                    <div className="flex">
                      <Select
                        value={selectedMovie}
                        onChange={handleModeChange}
                        options={movieOptions}
                        placeholder="Select Event"
                        className="focus:outline-none  w-full border-0"
                        classNamePrefix="text-secondary focus:outline-none react-select-container"
                      />
                    </div>
                    <p className="text-xs text-red-600 mt-2">{modeError}</p>
                    {/* {errorEmail.field === "email" && (
                          
                        )} */}
                  </div>

                  <div className="w-full pl-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Payment Date
                    </label>
                    <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <AccessTimeOutlined fontSize="small" />
                      </div>
                      <div className="w-full">
                        <DatePicker
                          selected={startDate}
                          maxDate={new Date()}
                          onChange={(date) => setStartDate(date)}
                          className=" -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        />
                      </div>
                    </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

                    </div>
                  
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={handleSubmit} disable={loader}>
                  {loader ? (
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <span>Save</span>
                  )}
                </Button>
                <Button cancel onClick={() => setIsEdit(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
