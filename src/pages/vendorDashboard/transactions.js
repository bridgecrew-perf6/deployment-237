import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";
import NumberFormat from "react-number-format";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Button} from "@material-ui/core";
import * as API from "./../../api/api";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    greenBadge: {
        backgroundColor: '#46ba80',
        color: 'white'
    }
});

const initialTransactionHistory = [
    {
      ticket_ids: "",
      name: "",
      email:"",
      phone_number:"",
      amount: "",
      id:''
    },
];

export default function Transaction(props) {
    const initialState = {
        cvc: "",
        expiry: "",
        focus: "",
        name: "",
        number: "",
    };
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const [numberError, setNumberError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [expiryError, setExpiryError] = useState(null);
    const [cvcError, setCVCError] = useState(null);
    const [transactionerrmessage, setTransactionErrMessage] = useState(null);
    const [transId, setTransId] = useState(null);
    const [modelId, setModelId] = useState(null);
    const [amount, setAmount] = useState(0);
    const [isPayment, setIsPayment] = useState(false);
    const [loader, setLoader] = useState(false);
    const [success, setSuccess] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [transactionHistory, setTransactionHistory] = useState(
        []
    );

    function validateInput() {
        const { name, cvc, expiry, number } = formData;
        let flag = true;
    
        if (number.length < 16) {
          flag = false;
          setNumberError({
            field: "number",
            message: "Please enter 16 digit",
          });
    
        } else {
          setNumberError({
            field: "number",
            message: "",
          });
        }
    
        if (!name) {
          flag = false;
          setNameError({
            field: "name",
            message: "Please enter your name",
          });
        } else {
          setNameError({
            field: "name",
            message: "",
          });
        }
    
        if (!cvc) {
          flag = false;
          setCVCError({
            field: "cvc",
            message: "Please enter the cvc",
          });
        } else if (cvc.length != 3) {
          flag = false;
          setCVCError({
            field: "cvc",
            message: "Please enter 3 digit cvc",
          });
        } else {
          setCVCError({
            field: "cvc",
            message: "",
          });
        }
    
        if (!expiry) {
          flag = false;
          setExpiryError({
            field: "expiry",
            message: "Please enter the expiry data",
          });
        } else {
          setExpiryError({
            field: "expiry",
            message: "",
          });
        }
        return flag;
      }

    const handleInputFocus = (e) => {
        setFormData({
          ...formData,
          focus: e.target.name,
        });
    };

    const handleInputChange = (event) => {
        const { value, name } = event.currentTarget;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRefund = async () => {
        let flag = validateInput();
        if (!flag) {
          return;
        }
        try {
          setLoader(true);
            const requestObj = {
                id : modelId,
                transId : transId,
                amount:amount,
                credit_card: {
                    type: "visa",
                    cardholder_name: formData.name,
                    card_number: formData.number,
                    exp_date: formData.expiry,
                    cvv: formData.cvc,
                },
            }
            const res = await API.refund(requestObj);
            if (res.status === 200) {
                setLoader(false);
                setSuccess(true);
                alert("Refund Done successfully");
                setIsPayment(false);
                setFormData(initialState);
                transactionsHistory();
                setTransactionErrMessage(null);
            }else{
              setLoader(false);
              setTransactionErrMessage(res.msg);
            }
        } catch (e) {
          setLoader(false);
          setTransactionErrMessage("Transaction error! Please try after some times.");
        }
    };
    
    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
          console.log(issuer);
        }
    };

    const handleEdit = (id,modelId,amount) => {
        setTransId(id);
        setModelId(modelId);
        setAmount(amount);
        setIsPayment(true);
    };

    const handleClose = () => {
      setIsPayment(false);
      setTransId(null);
      setModelId(null);
      setTransactionErrMessage(null);
      setAmount(null);
      setFormData(initialState);
    };

    const transactionsHistory = async () => {
      const res = await API.transactions(userData.id);
      const data = [];
      console.log(res);
      !res.data.message &&
        res.data.map((item) => {
            data.push(item);
        });
        setTransactionHistory(data);
    }

    useEffect(() => {
        transactionsHistory();
      }, [props.tenat_event]);
    return (
        <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
            <div className="uppercase font-medium text-secondary">Transactions</div>
            <div className=" font-medium text-gray-400 mb-2">
            All Transaction History
            </div>
            <hr />
            <TableContainer>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Ticket Id's</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {transactionHistory.map((row) => {
                    let tickets = (JSON.parse(row.booking_id)).join(',');
                    return(
                        <TableRow
                            key={row.id}
                            className="hover:bg-gray-200 cursor-default"
                        >
                            <TableCell size={'small'}>
                                {tickets}
                            </TableCell>
                            <TableCell>
                                {row.booking?.user?.first_name + ' ' +row.booking?.user?.last_name}
                            </TableCell>
                            <TableCell>
                                {row.booking?.user?.email}
                            </TableCell>
                            <TableCell>
                                {row.booking?.user?.number}
                            </TableCell>
                            <TableCell>
                                {row.total_amount}
                            </TableCell>
                            <TableCell>
                            {(row.booking?.booking_status == "0" && row.transaction_id != "0" && row.is_refunded == 0) ? (
                                <Button onClick={() => handleEdit(row.transaction_id,row.id,row.total_amount)} className={classes.greenBadge}>Refund</Button>
                                ) : (
                                <div className="flex justify-center">
                                </div>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
        </TableContainer>
        {isPayment && (
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
                        <div className="row -mx-3 chivo"></div>
                            <div className="row justify-center">
                            <Cards
                                cvc={formData.cvc}
                                expiry={formData.expiry}
                                focused={formData.focus}
                                name={formData.name}
                                number={Number(formData.number)}
                                callback={handleCallback}
                            />

                    <div className="col mt-6">
                        <span className="text-14px mb-15px">Name on card</span>
                        <input
                            type="text"
                            placeholder=""
                            className="mb-10px"
                            name="name"
                            className="w-full p-2 text-black rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                    </div>
                    {nameError?.field === "name" && (
                    <p className="text-sm text-red-500 pt-2 pl-15px mb-15px">
                        {nameError.message}
                    </p>
                    )}

                <div className="col mt-6">
                    <span className="text-14px mb-15px">Card number</span>
                    <NumberFormat
                        format="#### #### #### #### ####"
                        placeholder="0000 0000 0000 0000"
                        className="w-full p-2 text-black rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        name="number"
                        value={formData.number}
                        onFocus={handleInputFocus}
                        onValueChange={({ value }) =>
                        setFormData({
                            ...formData,
                            number: value,
                        })
                        }
                    />
                </div>
                {numberError?.field === "number" && (
                    <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {numberError.message}
                    </p>
                )}
                <div className="col mt-6">
                    <span className="text-14px mb-15px">Expiration</span>
                    <NumberFormat
                      format="##/##"
                      mask={["M", "M", "Y", "Y"]}
                      placeholder="MM/YY"
                      className="w-full  p-2 text-black rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      name="expiry"
                      value={formData.expiry}
                      onFocus={handleInputFocus}
                      onValueChange={({ value }) =>
                        setFormData({
                          ...formData,
                          expiry: value,
                        })
                      }
                    />
                  </div>
                  {expiryError?.field === "expiry" && (
                    <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {expiryError.message}
                    </p>
                  )}
                  <div className="col mt-6">
                    <span className="text-14px mb-15px">CVV</span>
                    <NumberFormat
                      format="###"
                      placeholder="123"
                      className="w-full p-2 text-black rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      name="cvc"
                      value={formData.cvc}
                      onFocus={handleInputFocus}
                      onValueChange={({ value }) =>
                        setFormData({
                          ...formData,
                          cvc: value,
                        })
                      }
                    />
                  </div>
                  {cvcError?.field === "cvc" && (
                    <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {cvcError.message}
                    </p>
                  )}
                  <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {transactionerrmessage}
                    </p>
                </div>
                    <div className=" bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleRefund}
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
                          <span>Refund</span>
                        )}
                        </button>
                        <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => handleClose()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        )}
      </div>
    );
}