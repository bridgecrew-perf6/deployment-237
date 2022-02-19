import { useEffect, useState } from "react";
import { SeatsioClient, Region } from "seatsio";
import Banner from "../../components/banner/banner";
import Button from "../../components/button/button";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import * as API from "./../../api/api";
import {
  BusinessCenter,
  CalendarToday,
  Call,
  Person,
  Theaters,
  WatchLater,
  ConfirmationNumber,
  ArrowBack,
  Place
} from "@material-ui/icons";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import LoginBg from "./../../assets/images/login2.png";
import RegisterBg from './../../assets/images/login.png'
import * as appUtil from "../../helper/appUtils";
import * as C from "../../const";
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import CityData from "../../data/city.json";
// import { Number as NumberFormat } from "react-number-format";
import NumberFormat from 'react-number-format';

const initialFormData = {
  email: "",
  password: "",
};

const initialRegFormData = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
};

let seatData = [];
function Seating() {

  useEffect(() => {
    seatData = [];
    let client = new SeatsioClient(Region.NA(), C.SEATS_SECRET_KEY);
    if (localStorage.getItem('holdToken') && localStorage.getItem('holdToken').length > 0) {
      expireHoldToken(localStorage.getItem('holdToken'))
    }
  }, []);

  const expireHoldToken = async (token) => {
    await client.holdTokens.expiresInMinutes(token, 0);
    localStorage.removeItem('holdToken');
  }

  const [book, setBook] = useState(false);
  const [successCoupon, setSuccessCoupon] = useState(false);
  const [failCoupon, setFailCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [total, setTotal] = useState(0);
  const [seat, setSeat] = useState([]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [validate, setValidate] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState([]);
  const Props = useLocation();
  const movieId = Props.state.data;
  const [isLMOpen, setIsLMOpem] = useState(false);
  const EventId = movieId.event_key;

  const [commission, setCommission] = useState("");
  const [handlingFee, setHandlingFee] = useState(0);
  const [promoterFee, setPromoterFee] = useState(0);

  const [tax, setTax] = useState(movieId.tax);
  const [creditCardCharges, setcreditCardCharges] = useState(movieId.cccharge);

  const pricing = [];
  movieId.packageData.map((item, index) =>
    pricing.push({
      category: index + 1,
      price: item.amount,
    })
  );

  const history = useHistory();
  var selectedSeats = selectedSeat;
  const SeatsIo = window.seatsio;
  let client = new SeatsioClient(Region.NA(), movieId.secret_key);
  const chart = new SeatsIo.SeatingChart({
    divId: "seatChart",
    workspaceKey: movieId.workspaceKey,
    event: EventId,
    pricing: pricing,
    priceFormatter: function (price) {
      return "$" + price;
    },
    onObjectSelected: function (object) {
      selectedSeats.push(object.label);
      let handlingFee = 0;
      let promoterFee = 0;
      movieId.packageData.map((item, index) => {
        var constId = index+1;       
        if (constId == object.category.key) {
          handlingFee = item.handlingFee;
          promoterFee = item.promoterFee ? item.promoterFee : 0;
        }
      });
      const data = {
        row: object.labels.parent,
        seat: object.labels.own,
        category: object.category.label,
        label: object.label,
        price: object.pricing ? object.pricing.price : 0,
        handlingFee: handlingFee,
        promoterFee: promoterFee,
      };
      seatData.push(data);
      setShow(false);
    },
    onObjectDeselected: function (object) {
      const index2 = seatData.findIndex((x) => x.label === object.label);
      if (index2 !== -1) seatData.splice(index2, 1);

      var index = selectedSeats.indexOf(object.label);
      if (index !== -1) selectedSeats.splice(index, 1);
      setShow(false);
    },
  }).render();
  const handleClick = async () => {
    if (seatData.length > 0) {
      setTotal(totalPrice - discount);
      const dataEvent = {
        id: movieId.id,
        title: movieId.title,
        tax: (totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100,
        time: movieId.time,
        date: movieId.date,
        src: movieId.src,
        booking_type: movieId.booking_type,
        userData: movieId.userData,
        item_price: movieId.item_price,
        item_discount: discount ? discount : "0",
        item_sell_price: movieId.item_sell_price,
        credit_card_charges: ((totalPrice + parseFloat(handlingFee) + ((totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100)) * creditCardCharges/100),
        package: movieId.package_name,
        seats: seatData,
        coupon: coupon,
        total: totalPrice + parseFloat(handlingFee)+ parseFloat(promoterFee) + (totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100 + ((totalPrice + parseFloat(handlingFee) + ((totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100)) * creditCardCharges/100) - discount,
        EventId: EventId,
        quantity: seat.length,
      };
    
      setData(dataEvent);
      const data = [];
      seatData.map((item) => {
        data.push(item.label);
      });

      if (!movieId.userData) {
        setIsLMOpem(true);
        return;
      } else {
        
        if (coupon !== '') {
          try {
            const response = await API.validate_coupon(`${coupon}/${movieId.id}`);

            if (response.status == 200) {
              setSuccessCoupon(true);
              setDiscount(response.data.data.discount_amount);
            }
            if (response.status == 404) {
              setFailCoupon(true);
              return false;
            }
          } catch (e) { }
        }
        // return;
        let holdToken = await client.holdTokens.create();

        const response = await client.events.hold(
          EventId,
          data,
          holdToken.holdToken
        );

        localStorage.setItem('holdToken', holdToken.holdToken)
        //
        // if (response.status === 200) {
        history.push({
          pathname: "/payment",
          state: { data: dataEvent, seats: selectedSeats },
        });
      // }
      }
    }
  };
  
  // For login
  
  const [formData, setFormData] = useState(initialRegFormData);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loader, setLoader] = useState(false);
  const [openUAM, setOpenUAM] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleModalClose = () => {
    console.log("Modal closed");
    setIsLMOpem(false);
  }
  
  const handleRegModalClose = () => {
    setIsRegister(false);
    setIsLMOpem(true);
  }
  
  const handleLogin = async () => {
    setLoader(true);
    setMsg(null);
    const { email, password } = formData;

    const flag = validateInput();
    if (!flag) {
      setLoader(false);
      return;
    }

    try {
      const requestObj = {
        role: "1",
        email: email,
        password: password,
      };
      const response = await API.login(requestObj);
      if (response.status != 200 || !response || response.data.message != null) {
        setLoader(false);
      }
      if (response.status >= 400) {
        setErrorPassword({
          field: "password",
          message: "Incorrect password",
        });
        setLoader(false);
      }
      const userData = response.data.user;
      const userProfile = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        number: userData.number,
        email: userData.email,
        bank_name: userData.bank_name,
        account_no: userData.account_no,
        ifsc_code: userData.ifsc_code,
        commission: userData.commission,
        street_address: userData.street_address,
        state: userData.state,
        zip: userData.zip,
      };
      localStorage.setItem("userProfileData", JSON.stringify(userProfile));
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("events", JSON.stringify(response.data.events));
      if (response.status === 200) {
        localStorage.setItem("isUserAuth", true);
        localStorage.setItem("isVendorAuth", false);
        localStorage.setItem("isAdminAuth", false);
        localStorage.setItem("isTicketSannerAuth", false);
        if (userData.role == "1" || userData.role == 1) {
          movieId.userData = userData;
          handleModalClose();
          handleClick();
          // if (coupon !== '') {
          //   try {
          //     const response = await API.validate_coupon(`${coupon}/${movieId.id}`);

          //     if (response.status == 200) {
          //       setSuccessCoupon(true);
          //       setDiscount(response.data.data.discount_amount);
          //     }
          //     if (response.status == 404) {
          //       setFailCoupon(true);
          //       return false;
          //     }
          //   } catch (e) { }
          // }

          // // return;
          // let holdToken = await client.holdTokens.create();

          // const response = await client.events.hold(
          //   EventId,
          //   data,
          //   holdToken.holdToken
          // );

          // localStorage.setItem('holdToken', holdToken.holdToken)
          // //
          // // if (response.status === 200) {
          // history.push({
          //   pathname: "/payment",
          //   state: { data: dataEvent, seats: selectedSeats },
          // });
        }
        if (userData.role == "2" || userData.role == 2) {
          // localStorage.setItem("isUserAuth", false);
          // localStorage.setItem("isVendorAuth", true);
          // localStorage.setItem("isAdminAuth", false);
          // localStorage.setItem("isTicketSannerAuth", false);
          setMsg("Please login as user");
          setOpenUAM(true);
          setLoader(false);
        }
        if (userData.role == "0" || userData.role == 0) {
          setMsg("Please login as user");
          setOpenUAM(true);
          setLoader(false);
          // localStorage.setItem("isUserAuth", false);
          // localStorage.setItem("isVendorAuth", false);
          // localStorage.setItem("isAdminAuth", true);
          // localStorage.setItem("isTicketSannerAuth", false);
          // history.push({
          //   pathname: "/admin-dashboard",
          // });
        }

        if (userData.role == "3" || userData.role == 3) {
          setMsg("Please login as user");
          setOpenUAM(true);
          setLoader(false);
          // localStorage.setItem("isUserAuth", false);
          // localStorage.setItem("isVendorAuth", false);
          // localStorage.setItem("isAdminAuth", false);
          // localStorage.setItem("isTicketSannerAuth", true);
          // history.push({
          //   pathname: "/ts-dashboard",
          // });
        }
      }
      if (response.status >= 400) {
        setErrorPassword({
          field: "password",
          message: "Incorrect password",
        });
        setLoader(false);
      }
    } catch (e) { setLoader(false); }
  }
  
  const closeUAModal = () => {
    setOpenUAM(false);
  }
  
  function validateInput() {
    const { email, password } = formData;
    let flag = true;

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
        flag = false;
      }
      else {
        // msg = "Please check your email format.";
        flag = true;
      }
      setErrorEmail({
        field: "email",
        message: msg,
      });
    }

    if (password) {
      setErrorPassword({
        field: "password",
        message: "",
      });
    } else {
      setErrorPassword({
        field: "password",
        message: "Please enter your password",
      });
      flag = false;
    }

    return flag;
  }

  const ValidateCoupon = async () => {
    try {
      const response = await API.validate_coupon(`${coupon}/${movieId.id}`);

      if (response.status == 200) {
        setSuccessCoupon(true);
        setDiscount(response.data.data.discount_amount);
      }
      if (response.status == 404) {
        setFailCoupon(true);
      }
    } catch (e) {}
  };

  let totalPrice = 0;
  seatData.map((item) => (totalPrice += parseInt(item.price)));
  
  // For register
  
  const [isRegister, setIsRegister] = useState(false);
  
  const [userProfile, setUserProfile] = useState(null);
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorCity, setErrorCity] = useState("");
  
  const [formDataReg, setFormDataReg] = useState(initialRegFormData);
  const [errorEmailReg, setErrorEmailReg] = useState("");
  const [errorPasswordReg, setErrorPasswordReg] = useState("");
  const [msgReg, setMsgReg] = useState(null);
  const [loaderReg, setLoaderReg] = useState(false);

  const cityOptions = [];
  CityData.map((item) => {
    const option = {
      value: item.id.toString(),
      label: item.en_name,
    };
    cityOptions.push(option);
  });

  const handleChangeReg = (e) => {
    const { name, value } = e.target;
    setFormDataReg({
      ...formDataReg,
      [name]: value,
    });
  };

  const handleProfileClick = (data) => {
    setUserProfile(data);
    setErrorFirstName({
      field: "firstName",
      message: "",
    });
    setErrorLastName({
      field: "lastName",
      message: "",
    });
    setErrorPhone({
      field: "phoneNumber",
      message: "",
    });
    setErrorEmail({
      field: "email",
      message: "",
    });
    setErrorPassword({
      field: "password",
      message: "",
    });
  };
  
  const handleClickReg = async () => {
    setMsgReg(null);
    setLoaderReg(true);
    const { firstName, lastName, phoneNumber, email, password, city_name } = formDataReg;
    const flag = validateInputReg();
    if (!flag) {
      setLoaderReg(false);
      return;
    }
    try {
      const requestObj = {
        role: userProfile,
        first_name: firstName,
        last_name: lastName,
        number: phoneNumber,
        email: email,
        password: password,
        city_name: city_name,
      };

      const response = await API.register(requestObj);

      localStorage.setItem("userData", JSON.stringify(response.data));
      const userProfileData = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        number: response.data.number,
        email: response.data.email,
        city_name: response.data.city_name,
      };
      localStorage.setItem("userProfileData", JSON.stringify(userProfileData));
      if (response.status === 200) {
        setLoaderReg(false);
        setIsLMOpem(true);
        setIsRegister(false);
      }
      if (response.status > 399) {
        setLoaderReg(false);
        setMsgReg(response.data.email);
      }
    } catch (e) {
      setLoaderReg(false);
    }
  };

  function validateInputReg() {
    const { firstName, lastName, phoneNumber, email, password, city_name } = formDataReg;
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

    let validFirstName = appUtil.validateName(firstName);
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
        msg = "Name should have characters only.";
      }
      setErrorFirstName({
        field: "firstName",
        message: msg,
      });
      flag = false;
    }

    let validLastName = appUtil.validateName(lastName);
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
        msg = "Name should have characters only.";
      }
      setErrorLastName({
        field: "lastName",
        message: msg,
      });
      flag = false;
    }

    let validateEmail = appUtil.validateEmail(email);
    if (validateEmail === 1) {
      setErrorEmailReg({
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
      setErrorEmailReg({
        field: "email",
        message: msg,
      });
      flag = false;
    }

    let validatePhone = appUtil.validatePhoneNumber(phoneNumber);
    if (validatePhone === 1) {
      setErrorPhone({
        field: "phoneNumber",
        message: "",
      });
    }
    if (!(validatePhone === 1)) {
      let msg = "";
      if (validatePhone === 0) {
        msg = "Please enter your phone number.";
      } else {
        msg = "Please check your phone number format.";
      }
      setErrorPhone({
        field: "phoneNumber",
        message: msg,
      });
      flag = false;
    }

    let validatePassword = appUtil.validatePass(password);
    if (validatePassword === 1) {
      setErrorPasswordReg({
        field: "password",
        message: "",
      });
    }
    if (!(validatePassword === 1)) {
      let msg = "";
      if (validatePassword === 0) {
        msg = "Please enter the password.";
      } else {
        msg =
          "Password must contains minimum eight characters, at least one letter, one number and one special character.";
      }
      setErrorPasswordReg({
        field: "password",
        message: msg,
      });
      flag = false;
    }

    return flag;
  }

  return (
    <>
      <Banner />
      
      <div className="bg-white lg:py-10 md:py-5 py-3.5 text-black w-full lg:px-10 xl:px-10 px-4">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-3/4 md:w-2/4 relative overflow-hidden pr-3">
            <div className="md:text-lg text-base font-semibold">Please select you seats</div>
            <div className="w-full md:w-1/4 px-2 overflow-y-auto xl:my-10 lg:my-8 my-4"/>
            <div id="seatChart" className="seatsec"></div>
          </div>
          <div className="w-full xl:w-1/4 md:w-2/4 px-2 overflow-y-auto my-4 seats-checkout">
            <div className="flex flex-col">
              <div className="mb-2">
                <div className="flex flex-row justify-center m-2 mb-3">
                  <img src={Props.state.data.src} alt="sd" className="h-40" />
                </div>
                <div>
                    <p className="h3">{Props.state.data.title}</p>
                </div>
              </div>
              <div
                className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                id="modal-title"
              >
                <div className="font-medium text-innerBG">
                  <CalendarToday fontSize={"small"} /> {movieId.date}
                </div>
                <div className="font-medium text-innerBG">
                  <WatchLater /> {movieId.time.substring(0, 5)}
                </div>
              </div>
              {isLMOpen &&
                <LoginModal open={isLMOpen} handleClose={handleModalClose} fWidth={true} mxWidth={'md'}>
                    <>
                      <div className="min-w-screen bg-theme flex items-center justify-center login-page-wrapper">
                        <div
                          className="bg-gray-100 text-gray-500 shadow-xl w-full overflow-hidden"
                          style={{ maxWidth: "1000px" }}
                        >
                          <div className="md:flex w-full">
                            <div
                              className="hidden md:block w-1/2 bg-innerBG bg-cover bg-center overflow-hidden bg-top"
                              style={{ backgroundImage: `url(${LoginBg})` }}
                            ></div>
                          <div className="w-full md:w-1/2 bg-innerBG flex flex-col px-5 md:px-10 justify-center">
                              <div className="text-center lg:my-10 md:my-5 mb-4">
                                <h1 className="font-bold text-3xl text-white playfair mb-2">
                                  Login
                                </h1>
                                <p className="chivo text-white">
                                  Enter your information to login
                                </p>
                              </div>
                              <div>
                                <div className="flex -mx-3 chivo">
                                  <div className="w-full px-3 lg:mb-8 md:mb-7 mb-6 relative">
                                    <label
                                      htmlFor="email"
                                      className="text-sm font-semibold px-1 text-white"
                                    >
                                      Email
                                    </label>
                                    <div className="flex">
                                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                        <EmailIcon />
                                      </div>
                                      <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        onChange={handleChange}
                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                        placeholder="email@example.com"
                                      />
                                    </div>
                                    {errorEmail.field === "email" && (
                                      <p className="absolute text-xs text-red-600 mt-2">
                                        {errorEmail.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex -mx-3 chivo">
                                  <div className="w-full px-3 lg:mb-10 md:mb-8 mb-6 relative">
                                    <label
                                      htmlFor="password"
                                      className="text-sm font-semibold px-1 text-white"
                                    >
                                      Password
                                    </label>
                                    <div className="flex">
                                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                        <LockIcon />
                                      </div>
                                      <input
                                        name="password"
                                        id="password"
                                        type="password"
                                        onChange={handleChange}
                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-innerBG "
                                        placeholder="************"
                                      />
                                    </div>
                                    {errorPassword.field === "password" && (
                                      <p className="absolute text-xs text-red-600 mt-2">
                                        {errorPassword.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Link to="/forgotPassword">
                                  <div className="lg:mb-9 mb-4 text-white text-sm hover:underline">
                                    Forgot Password?
                                  </div>
                                </Link>
                                <div className="flex -mx-3 playfair">
                                  <div className="w-full px-3 mb-5">
                                    <button
                                      className="bg-gray-300 block focus:outline-none font-semibold from-primary hover:bg-red-700 md:max-w-xs mx-auto px-3 py-3 rounded-lg text-black to-secondary w-full hover:text-white"
                                      onClick={handleLogin}
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
                                        <span>Login</span>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="lg:mb-4 mb-2 text-red-600 text-center text-sm capitalize">
                                  {msg}
                                </div>

                                <div className="lg:mb-9 md:mb-6 text-white text-sm text-center">
                                  Not registered yet?{" "}
                                  <a href="javascript:void(0)" onClick={() => {
                                    setIsLMOpem(false);
                                    setIsRegister(true);
                                    setUserProfile(false);
                                  }}>
                                    <span className="text-red-600 hover:underline">
                                      Create an Account
                                    </span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                </LoginModal>
              }
              {isRegister && <div>
                <RegisterModal open={isRegister} handleClose={handleRegModalClose} fWidth={true} mxWidth={'md'}>
                  <div className="min-w-screen bg-theme flex items-center justify-center register-page-wrapper">
                    <div
                      className="bg-gray-100 text-gray-500 shadow-xl w-full overflow-hidden"
                      style={{ maxWidth: "1000px" }}
                    >
                      <div className={`md:flex w-full h-auto ${!userProfile ? "register-popup" : ""}`}>
                        <div
                          className="hidden md:block w-1/2 bg-innerBG px-10 bg-cover bg-center"
                          style={{ backgroundImage: `url(${RegisterBg})` }}
                        ></div>
                        <div className="w-full h-auto md:w-1/2 px-5 lg:px-10 md:px-6 py-2 xl:py-4 lg:py-3 md:py-5 bg-innerBG flex flex-col justify-center register-page-form">
                          {userProfile && (
                            <ArrowBack
                              fontSize="large"
                              className="text-white arrow-back"
                              onClick={() => setUserProfile(null)}
                            />
                          )}
                          <div className="text-center lg:my-4 md:my-5 mb-4 lg:mt-0 mt-3">
                            <h1 className="font-bold md:text-3xl text-2xl text-white playfair mb-2">
                              {!userProfile ? "" : userProfile == "1" ? "User " : "Vendor "}
                              Registration
                            </h1>
                            <p className="chivo text-white">
                              Enter your information to registration
                            </p>
                          </div>
                          {!userProfile ? (
                            <div className="flex flex-col -mx-3 playfair">
                              <div className="w-full px-3 xl:mb-3">
                                <button
                                  className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                                  onClick={() => handleProfileClick("1")}
                                >
                                  Sign Up as User
                                </button>
                              </div>
                              <span className="text-white text-center text-lg xl:mb-3">
                                - or -
                              </span>
                              <div className="w-full px-3 xl:mb-3">
                                <button
                                  className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
                                  onClick={() => handleProfileClick("2")}
                                >
                                  Sign Up as Vendor
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex lg:flex-row xl:flex-row flex-col -mx-3 chivo">
                                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="firstName"
                                    className="text-sm font-semibold px-1 text-white"
                                  >
                                    First name
                                  </label>
                                  <div className="flex">
                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                      <PersonIcon />
                                    </div>
                                    <input
                                      type="text"
                                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                      placeholder="First Name"
                                      name="firstName"
                                      id="firstName"
                                      onChange={handleChangeReg}
                                    />
                                  </div>

                                  <p className="absolute text-xs text-red-600 mt-2">
                                    {errorFirstName.field === "firstName" &&
                                      errorFirstName.message}
                                  </p>
                                </div>
                                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="lastName"
                                    className="text-sm font-semibold px-1 text-white"
                                  >
                                    Last name
                                  </label>
                                  <div className="flex">
                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                      <PersonIcon />
                                    </div>
                                    <input
                                      type="text"
                                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                      placeholder="Last Name"
                                      name="lastName"
                                      id="lastName"
                                      onChange={handleChangeReg}
                                    />
                                  </div>
                                  {errorLastName.field === "lastName" && (
                                    <p className="absolute text-xs text-red-600 mt-2">
                                      {errorLastName.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex -mx-3 chivo">
                                <div className="w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="phoneNumber"
                                    className="text-sm font-semibold px-1 text-white"
                                  >
                                    Phone Number
                                  </label>
                                  <div className="flex">
                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                      <PhoneIcon />
                                    </div>
                                      <NumberFormat
                                      format="##########"
                                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                      placeholder="##########"
                                      name="phoneNumber"
                                      id="phoneNumber"
                                      onChange={handleChangeReg}
                                    />
                                  </div>
                                  {errorPhone.field === "phoneNumber" && (
                                    <p className="absolute text-xs text-red-600 mt-2">
                                      {errorPhone.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex -mx-3 chivo">
                                <div className="w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="email"
                                    className="text-sm font-semibold px-1 text-white"
                                  >
                                    Email
                                  </label>
                                  <div className="flex">
                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                      <EmailIcon />
                                    </div>
                                    <input
                                      type="email"
                                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                      placeholder="email@example.com"
                                      name="email"
                                      id="email"
                                      onChange={handleChangeReg}
                                    />
                                  </div>
                                  {errorEmailReg.field === "email" && (
                                    <p className="absolute text-xs text-red-600 mt-2">
                                      {errorEmailReg.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex -mx-3 chivo">
                                <div className="w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="password"
                                    className="text-sm font-semibold px-1 text-white"
                                  >
                                    Password
                                  </label>
                                  <div className="flex">
                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                      <LockIcon />
                                    </div>
                                    <input
                                      type="password"
                                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                      placeholder="************"
                                      name="password"
                                      id="password"
                                      onChange={handleChangeReg}
                                    />
                                  </div>
                                  {errorPasswordReg.field === "password" && (
                                    <p className="absolute text-xs text-red-600 mt-2">
                                      {errorPasswordReg.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex -mx-3 chivo">
                                <div className="w-full px-3 mb-5 relative">
                                  <label
                                    htmlFor="city_name"
                                    className="text-sm font-semibold px-1 text-white"
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
                                      onChange={handleChangeReg}
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
                                  {errorCity.field === "city" && (
                                    <p className="absolute text-xs text-red-600 mt-2">
                                      {errorCity.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex -mx-3 playfair">
                                <div className="w-full px-3 my-3">
                                  <button
                                    className="block w-full md:max-w-xs mx-auto bg-gradient-to-r from-red-800 to-red-700 hover:to-gray-300 hover:from-gray-100 text-white rounded-lg px-3 py-3 font-semibold focus:outline-none hover:text-black"
                                    onClick={handleClickReg}
                                    disabled={loaderReg}
                                  >
                                    {loaderReg ? (
                                      <div className="lds-ring">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                      </div>
                                    ) : (
                                      <span>Register Now</span>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="mb-3 text-red-600 text-center text-sm capitalize">
                                {msgReg}
                              </div>

                              <div className="mb-0 text-white text-sm text-center">
                                Already have an account?{" "}
                                <a href="javascript:void(0)" onClick={() => {
                                  setIsLMOpem(true);
                                  setIsRegister(false);
                                }}>
                                  <span className="text-red-600 hover:underline">
                                    Login
                                  </span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </RegisterModal>
              </div>}
              {openUAM && <UserAlertModal handleClose={closeUAModal} open={openUAM} />}
              <div
                className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                id="modal-title"
              >
                <div className="font-medium text-innerBG capitalize">
                  {(movieId.userData && movieId.userData?.first_name) && <Person />}
                  {movieId.userData?.first_name} {movieId.userData?.last_name}
                </div>
                <div className="font-medium text-innerBG">
                  {(movieId.userData && movieId.userData?.first_name) && <Call />} {movieId.userData?.number}
                </div>
              </div>
              {!show && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() => {
                      let seatArray = [];
                      if (seatData.length > 0) {
                        let totalHandlingFee = 0;
                        let totalPromoterFee = 0;
                        seatData.map((item) => {
                          if(!seatArray.includes(item.category)){
                            seatArray.push(item.category)
                            if (item.price) {
                              setShow(true);
                            } else setShow(false);
                          }
                          
                          totalHandlingFee =
                          totalHandlingFee + parseFloat(item.handlingFee);
                          totalPromoterFee =
                          totalPromoterFee + parseFloat(item.promoterFee);
                          
                        });
                        setTax(movieId.tax);
                        setcreditCardCharges(movieId.cccharge);
                        setHandlingFee(totalHandlingFee.toFixed(2));
                        setPromoterFee(totalPromoterFee.toFixed(2));
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
              <div
                className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                id="modal-title"
              ></div>
              {show && (
                <>
                  <div>
                    {seatData.map((item, index) => {
                      return (
                        <div
                          className="flex lg:flex-col md:flex-col flex-col lg:justify-around justify-between py-3 text-innerBG shadow-lg mb-3 px-4 seat-allotment"
                          key={index}
                        >
                          <div className="mb-2">
                            Row:{" "}
                            <span className="font-semibold">{item.row}</span>
                          </div>
                          <div className="mb-2">
                            Seat:{" "}
                            <span className="font-semibold">{item.seat}</span>
                          </div>
                          <div className="mb-2">
                            Category:{" "}
                            <span className="font-semibold">
                              {item.category}
                            </span>
                          </div>

                          {/* <div>{item.label} </div>
                      <div>SEAT</div> */}
                        </div>
                      );
                    })}
                  </div>

                  {/* <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Price
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {movieId.item_sell_price} x {seat.length} seats(s) = ${" "}
                      {Number(
                        Number(movieId.item_sell_price * seat.length) *
                          Number(1)
                      ).toFixed(2)}
                    </div>
                  </div> */}
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Ticket Amount
                    </div>
                    <div className="font-medium text-innerBG text-right">
                    ${" "}
                      {Number(
                        totalPrice
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Internet Handling Fees
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      {/* $ {handlingFee} */}
                      $ {(parseFloat(handlingFee) + parseFloat(promoterFee) + ((totalPrice + parseFloat(handlingFee)+((totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100)) * creditCardCharges/100)).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Tax Amount
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {((totalPrice+parseFloat(handlingFee))*tax/100).toFixed(2)}
                    </div>
                  </div>

                  {/* <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Credit card charges
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {((totalPrice + parseFloat(handlingFee)+((totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100)) * creditCardCharges/100).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Promoter Fees
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {promoterFee}
                    </div>
                  </div> */}


                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Total
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      ${" "}
                      {Number(
                        totalPrice + parseFloat(handlingFee)+parseFloat(promoterFee) + (totalPrice+parseFloat(handlingFee))*tax/100 + ((totalPrice + parseFloat(handlingFee) + ((totalPrice+parseFloat(handlingFee))*parseFloat(movieId.tax)/100)) * creditCardCharges/100)
                      ).toFixed(2)}
                    </div>
                  </div>
                  {successCoupon && (
                    <div className=" text-sm text-green-400">
                      Your Coupon "
                      <span className="font-semibold">{coupon}</span>" has been
                      successfully applied
                    </div>
                  )}

                  {failCoupon && (
                    <div className=" text-sm text-red-400">
                      "<span className="font-semibold">{coupon}</span>" is an
                      invalid coupon
                    </div>
                  )}
                  {discount > 0 && (
                    <div
                      className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                      id="modal-title"
                    >
                      <div className="font-medium text-innerBG capitalize">
                        Discount
                      </div>
                      <div className="font-medium text-innerBG text-right">
                        $ {discount}
                      </div>
                    </div>
                  )}

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light mt-2 mb-0 text-gray-900 relative "
                    id="modal-title"
                  >
                    <div className=" w-full font-medium text-innerBG">
                      <input
                        type="text"
                        name="coupon"
                        id="coupon"
                        onChange={(e) => {
                          setSuccessCoupon(false);
                          setFailCoupon(false);
                          setCoupon(e.target.value);
                          setDiscount(0);
                        }}
                        className="w-full px-2 py-1 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Coupon Code"
                      />
                    </div>
                    <div className="text-white text-right ml-2">
                      {successCoupon ? (
                        <button
                          className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-36 xl:w-36 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-50 cursor-not-allowed"
                          onClick={ValidateCoupon}
                          disabled
                        >
                          Applied
                        </button>
                      ) : (
                        <button
                          className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-36 xl:w-36 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                          onClick={ValidateCoupon}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                  
                </>
              )}

              {show && (
                <div className="flex flex-row justify-center mt-2">
                  <Button onClick={handleClick}>Checkout</Button>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {book && (
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
              <div className="bg-white xl:px-4 lg:px-4  pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* <div className=""> */}
                <div className="flex justify-center mt-2 mb-4">
                  <img
                    src={movieId.src}
                    alt={movieId.title}
                    className="object-cover w-96 h-48 rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left xl:px-10 lg:px-10 px-4">
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG text-lg">
                      <Theaters />
                      {movieId.title}
                    </div>
                  </div>
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG text-lg">
                      <BusinessCenter /> {movieId.package}
                    </div>
                    <div className="font-medium text-innerBG text-lg my-auto">
                      <ConfirmationNumber /> Event
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    {/* <div>Concert Date </div> */}
                    <div className="font-medium text-innerBG">
                      <CalendarToday fontSize={"small"} /> {movieId.date}
                    </div>
                    <div className="font-medium text-innerBG">
                      <WatchLater /> {movieId.time.substring(0, 5)}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      {(movieId.userData && movieId.userData?.first_name) && <Person />}
                      {movieId.userData?.first_name} {movieId.userData?.last_name}
                    </div>
                    <div className="font-medium text-innerBG">
                      {(movieId.userData && movieId.userData?.first_name) && <Call />} {movieId.userData?.number}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  ></div>

                  {discount > 0 && (
                    <div
                      className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                      id="modal-title"
                    >
                      <div className="font-medium text-innerBG capitalize">
                        Discount
                      </div>
                      <div className="font-medium text-innerBG text-right">
                        $ {discount}
                      </div>
                    </div>
                  )}
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Seats
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      {/* {seat.map((item) => {
                        return (
                          <span>
                            {seat.length > 1 ? `${item}, ` : { item }}{" "}
                          </span>
                        );
                      })} */}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Price
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      {/* $ {movieId.item_sell_price} x {seat.length} seats(s) = ${" "}
                      {Number(
                        Number(movieId.item_sell_price * seat.length) *
                          Number(1)
                      ).toFixed(2)} */}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Total
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {Number(total).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light mt-2 mb-0 text-gray-900 relative "
                    id="modal-title"
                  >
                    <div className=" w-full font-medium text-innerBG">
                      <input
                        type="text"
                        name="coupon"
                        id="coupon"
                        onChange={(e) => {
                          setSuccessCoupon(false);
                          setFailCoupon(false);
                          setCoupon(e.target.value);
                          setDiscount(0);
                        }}
                        className="w-full px-2 py-1 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Coupon Code"
                      />
                    </div>
                    <div className="text-white text-right ml-2">
                      {successCoupon ? (
                        <button
                          className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-36 xl:w-36 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-50 cursor-not-allowed"
                          onClick={ValidateCoupon}
                          disabled
                        >
                          Applied
                        </button>
                      ) : (
                        <button
                          className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-36 xl:w-36 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                          onClick={ValidateCoupon}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                  {successCoupon && (
                    <div className="absolute text-sm text-green-400">
                      Your Coupon "
                      <span className="font-semibold">{coupon}</span>" has been
                      successfully applied
                    </div>
                  )}

                  {failCoupon && (
                    <div className="absolute text-sm text-red-400">
                      "<span className="font-semibold">{coupon}</span>" is an
                      invalid coupon
                    </div>
                  )}
                </div>

                {/* </div> */}
              </div>
              <div className="bg-gray-50 mt-2 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  to={{
                    pathname: "/payment",
                    state: { data: data },
                  }}
                >
                  <Button>Book Now</Button>
                </Link>

                <Button
                  cancel
                  onClick={() => {
                    setBook(false);
                    //   setAdultCount(1);
                    //   setSuccessCoupon(false);
                    //   setFailCoupon(false);
                    //   setDiscount(0);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <h2>ad</h2> */}
    </>
  );
}

const UserAlertModal = ({
  open,
  handleClose,
}) => {
  return (
    <>
      <Dialog onClose={handleClose} open={open} fullWidth={true} maxWidth={'sm'}>
        <DialogTitle>Please sign in as User</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Seating;
