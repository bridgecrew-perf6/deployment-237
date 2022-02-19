import React, { useState, useEffect } from "react";
import { Lock } from "@material-ui/icons";
import * as appUtil from "../../helper/appUtils";
import * as API from "./../../api/api";
import Number from "react-number-format";

const initialFormData = {
  wallet_balance: "",
  earning_amount: "",
  withdrawl_amount: "",
};

export default function Withdrawal(props) {
  const [formData, setFormData] = useState(initialFormData);
  const [errorMoney, setErrorMoney] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [moneyData, setMoneyData] = useState(initialFormData);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    async function Earning() {
      const res = await API.earning_by_vendor_by_id(userData.id);
      setMoneyData(res.data);
    }
    Earning();
  }, [props.tenat_event]);

  // if (moneyData.wallet_balance) {
  //   initialFormData.wallet_balance = moneyData.wallet_balance;
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    setLoader(true);
    setMsg("");
    setError("");
    const flag = validateInput();
    console.log(flag);
    if (!flag) {
      setLoader(false);
      return;
    }
    const reqMoney = formData.wallet_balance.substring(
      2,
      formData.wallet_balance.length
    );

    if (reqMoney > moneyData.wallet_balance) {
      setError("Don't have enough balance");
      setLoader(false);
    } else {
      try {
        const requestObj = {
          vendor_id: userData.id,
          amount: formData.wallet_balance.substring(
            2,
            formData.wallet_balance.length
          ),
        };

        const response = await API.withdrawal_request(requestObj);

        if (response.status == 200) {
          setMsg(`You have requested ${formData.wallet_balance}`);
          setLoader(false);
        }
      } catch (e) {}
    }
  };

  function validateInput() {
    const { wallet_balance } = formData;
    let flag = true;
    if (wallet_balance) {
      setErrorMoney({
        field: "money",
        message: "",
      });
    } else {
      setErrorMoney({
        field: "money",
        message: "Please enter the required money",
      });
      flag = false;
    }
    return flag;
  }

  // const MAX_VAL = moneyData.wallet_balance;
  // const withValueLimit = ({ floatValue }) => floatValue <= MAX_VAL;

  // console.log(formData.wallet_balance);
  // console.log("hi");

  return (
    <div>
      <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4 dashboard-top-space">
        <div className="lg:mr-8">
          <div className="md:text-lg text-base lg:w-1/2 w-full font-medium flex flex-row justify-between items-end mb-2">
            <div className="w-8/12"><b>Total Earning:</b> </div>
            <div className="w-4/12 text-right">
              <span>
                $ {moneyData.earning_amount}
                {/* {moneyData.earning_amount &&
                  Number(moneyData.earning_amount).toFixed(2)} */}
              </span>
            </div>
          </div>
          <div className="md:text-lg text-base lg:w-1/2 w-full font-medium flex flex-row justify-between items-end mb-2">
            <div><b>Total Withdrawal:</b></div>
            <div>
              $ {moneyData.withdrawl_amount}
              {/* {moneyData.earning_amount &&
                Number(moneyData.withdrawl_amount).toFixed(2)} */}
            </div>
          </div>
          <div className="md:text-lg text-base lg:w-1/2 w-full font-medium flex flex-row justify-between items-end mb-2">
            <div><b>Balance:</b> </div>
            <div>
              $ {moneyData.wallet_balance}
              {/* {moneyData.earning_amount &&
                Number(moneyData.withdrawl_amount).toFixed(2)} */}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 chivo mt-5">
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 lg:mb-8 mb-5 relative">
            <label
              htmlFor="wallet_balance"
              className="text-xs font-semibold px-1 text-theme"
            >
              Request Money
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Lock fontSize="small" />
              </div>
              <Number
                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="$ 00"
                name="wallet_balance"
                id="wallet_balance"
                // value={formData.wallet_balance}
                onChange={handleChange}
                prefix={"$ "}
                // thousandSeparator={true}
                // isAllowed={withValueLimit}
              />
            </div>
            {errorMoney.field === "money" && (
              <p className="absolute text-xs text-red-600 mt-2 mr-1">
                {errorMoney.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex lg:-mx-3 justify-center lg:justify-start">
          <div className="px-3 mb-4 relative">
            <button
              className="block playfair w-48 max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
              onClick={handleClick}
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
                <span>Request Money</span>
              )}
            </button>
            <p className=" text-center text-xs text-green-600 mt-2 absolute">
              {msg}
            </p>
            <p className=" text-center text-xs text-red-600 mt-2 absolute">
              {error}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
