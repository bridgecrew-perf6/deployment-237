import react, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import Logo from "./../../assets/images/logo.png";
import SuccessImage from "../../assets/images/success.png";
import { useLocation } from "react-router-dom";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";
import { Link } from "react-router-dom";
import { SeatsioClient, Region } from "seatsio";
import Banner from "../../components/banner/banner";
import * as API from "./../../api/api";
const initialState = {
  cvc: "",
  expiry: "",
  focus: "",
  name: "",
  number: "",
};

export default function Payment() {
  const [formData, setFormData] = useState(initialState);
  const [creditCardCharges, setcreditCardCharges] = useState(4);
  const [success, setSuccess] = useState(false);
  const [transactionerrmessage, setTransactionErrMessage] = useState(null);
  const [numberError, setNumberError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [expiryError, setExpiryError] = useState(null);
  const [cvcError, setCVCError] = useState(null);
  const data = useLocation();
  const ticket = data.state.data;

  let client = new SeatsioClient(
    Region.NA(),
    "f1309c1b-99bd-4274-be79-a383143b19dc"
  );

  const numberOfSeats = 1;
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

  const HandleBook = async () => {
    let flag = validateInput();
    if (!flag) {
      return;
    }
   
    var totalCommission = 0;
    var totalTax = ticket.tax;
    ticket.seats.map((seat) => (totalCommission += parseInt(seat.handlingFee)));   
    try {
      const requestObj = {
        user_id: ticket.userData.id,
        booking_type: ticket.booking_type,
        item_id: ticket.id,
        item_quantity: ticket.seats.length,
        item_discount: ticket.item_discount,
        package: "Gold",
        ticket_slot: ticket.seats,
        coupon: ticket.coupon ? ticket.coupon : "",
        merchant_ref: "Astonishing-Sale",
        transaction_type: "purchase",
        method: "credit_card",
        credit_card_charges: creditCardCharges,
        totalCommission: totalCommission,
        totalTax: totalTax,
        amount: ticket.total.toFixed(2),
        partial_redemption: "false",
        currency_code: "USD",
        credit_card: {
          type: "visa",
          cardholder_name: formData.name,
          card_number: formData.number,
          exp_date: formData.expiry,
          cvv: formData.cvc,
        },
      };

      const res = await API.book_now(requestObj);
      const data = [];
      ticket.seats.map((item) => {
        data.push(item.label);
      });
      if (res.status === 200) {
        const response = await client.events.book(ticket.EventId, data);
        setSuccess(true);
      }else{
        setTransactionErrMessage(res.msg);
      }
    } catch (e) {
      setTransactionErrMessage("Transaction error! Please try after some times.");
    }
  };
 
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

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      console.log(issuer);
    }
  };
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full d-flex bg-theme lg:px-16 xl:px-24 px-4">
        <div className="flex flex-row justify-center py-2">
          {!success ? (
            <div className="w-72 xl:w-1/4 text-white">
              <div className="flex flex-col w-full justify-center h-auto text-white">
                <div className="flex flex-row justify-between mb-3">
                  <div className="w-2/6 font-semibold">Name: </div>
                  <div className="w-4/6 text-right">{ticket.title}</div>
                </div>

                <div className="flex flex-row justify-between mb-3">
                  <div className="w-2/6 font-semibold">Seats: </div>
                  <div className="w-4/6 text-right">
                    {ticket.seats.map((item) => {
                      return ticket.seats.length > 0
                        ? item.label + ", "
                        : item.label;
                    })}
                  </div>
                </div>
                <div className="flex flex-row justify-between mb-3">
                  <div className="w-2/6 font-semibold">Total Amount: </div>
                  <div className="w-4/6 text-right">
                    $ {Number(ticket.total * numberOfSeats).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col xl:pt-10 lg:pt-8 pt-5">
                <div className="flex flex-row justify-center">
                  <Cards
                    cvc={formData.cvc}
                    expiry={formData.expiry}
                    focused={formData.focus}
                    name={formData.name}
                    number={Number(formData.number)}
                    callback={handleCallback}
                  />
                </div>

                <div className="flex flex-col mt-6">
                  <span className="flex text-14px mb-15px">Name on card</span>
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

                <div className="flex flex-col mt-6">
                  <span className="flex  text-14px mb-15px">Card number</span>
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

                  {numberError?.field === "number" && (
                    <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {numberError.message}
                    </p>
                  )}
                  <div className="flex flex-col mt-6">
                    <span className="flex  text-14px mb-15px">Expiration</span>
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
                  <div className="flex flex-col mt-6">
                    <span className="flex text-14px mb-15px">CVV</span>
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
                </div>
                <div className="mt-6">
                <p className="text-sm text-red-500 text-sm pt-2 pl-15px mb-15px">
                      {transactionerrmessage}
                    </p>
                  <button
                    className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 w-full w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                    onClick={HandleBook}
                  >
                    Pay $ {Number(ticket.total).toFixed(2)}
                  </button>
                </div>
                <div className="flex flex-row mb-15px text-gray-900 underline">
                  {/* <a className="underline text-white mb-8 last:mb-0 hover:text-red-600">
                    Terms of Service
                  </a> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl">
              <div className="flex flex-col items-center my-5">
                <img src={SuccessImage} alt="Success" className="w-60 h-60" />
                <span className="text-green-600 text-2xl">
                  Payment Successfully
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
