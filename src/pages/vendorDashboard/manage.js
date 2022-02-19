import React, { useState, useEffect } from "react";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import dateFormat from "dateformat";
import LanguageData from "../../data/language.json";
import SuccessImage from "../../assets/images/success.png";
import {
  AccessTime,
  AddRounded,
  AttachMoney,
  BusinessCenter,
  CalendarToday,
  Category,
  Facebook,
  FlashOn,
  Image,
  Language,
  Person,
  Place,
  Remove,
  Theaters,
  ThumbUpAltRounded,
  Twitter,
  VpnKey,
} from "@material-ui/icons";
import DatePicker from "react-datepicker";
import * as API from "../../api/api";
import * as appUtil from "../../helper/appUtils";
import Number from "react-number-format";
import CKEditor from "ckeditor4-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import CreatableSelect from 'react-select/creatable';
const initialData = {
  id: "",
  vendor_id: "",
  title: "",
  artist: "",
  artistImage: "",
  address: "",
  image: "",
  date: "",
  time: "",
  tag: "",
  price: "",
  discount: "",
  is_active: "",
  rating: "",
  popularity: "",
  about: "",
  termsCondition: "",
  disclaimer: "",
  created_at: "",
  updated_at: "",
  language: "",
  total_tickets: "",
  category: "",
  exclusive: "",
  artist_facebook_link: "",
  artist_twitter_link: "",
  event_key: "",
  workspaceKey: "",
  secret_key: "",
};

const initialError = {
  field: "",
  message: "",
};

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default function Manage(props) {
  const [category, setCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [tag, setTag] = useState(1);
  const [lang, setLang] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const vendorId = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState(initialData);
  const [msg, setMsg] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [categoryError, setCategoryError] = useState(initialError);
  const [noOfTicketError, setNoOfTicketError] = useState(initialError);
  const [artistImageName, setArtistImageName] = useState(null);
  const [errorTitle, setErrorTitle] = useState(initialError);
  const [errorTime, setErrorTime] = useState(initialError);
  const [errorTag, setErrorTag] = useState(initialError);
  const [errorImage, setErrorImage] = useState(initialError);
  const [errorArtistImage, setErrorArtistImage] = useState(initialError);
  const [errorAddress, setErrorAddress] = useState(initialError);
  const [errorArtist, setErrorArtist] = useState(initialError);
  const [errorPrice, setErrorPrice] = useState(initialError);
  const [errorTermsCondition, setErrorTermsCondition] = useState(initialError);
  const [errorRating, setErrorRating] = useState(initialError);
  const [errorPopularity, setErrorPopularity] = useState(initialError);
  const [errorDisclaimer, setErrorDisclaimer] = useState(initialError);
  const [errorDescription, setErrorDescription] = useState(initialError);
  const [errorWorkspaceKey, setErrorWorkspaceKey] = useState(initialError);
  const [errorSecretKey, setErrorSecretKey] = useState(initialError);
  const [errorEventKey, setErrorEventKey] = useState(initialError);
  const [loader, setLoader] = useState(false);
  const [packageCount, setPackageCount] = useState(1);
  const [values, setValues] = useState({ val: [] });
  const [amountValue, setAmountValue] = useState({ val: [] });
  const [discountValue, setDiscountValue] = useState({ val: [] });
  const [successful, setSuccessful] = useState(false);
  const [tags, setAllTags] = useState([]);
  const [selTags, setSelTags] = useState([]);
  const [newTags, setNewTags] = useState([]);

  useEffect(() => {
    async function EventHistory() {
      try {
        const response = await API.category();
        setCategoryData(response.data);
      } catch (e) {}
    }
    EventHistory();
    getAllEventTags();
  }, []);
  const getAllEventTags = async () => {
    await API.getTags().then(res => {
      let tempTags = [...tags];
      res.data.map(tData => {
        tempTags.push({ label: tData, value: tData });
      })
      setAllTags(tempTags);
    }).catch(err => {
      
    });
  }
  
  // Create new tag value
  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "set-value") {
      let tempTags = [...newTags];
      tempTags.push({ label: actionMeta.prevInputValue, value: actionMeta.prevInputValue });
      setNewTags(tempTags);
    }
  }
  
  // Event when selecting tag
  const handleTagInputChange = (newValue) => {
    setSelTags(newValue);
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setErrorTitle({
      field: "title",
      message: "",
    });
    setErrorTime({
      field: "time",
      message: "",
    });
    setErrorTag({
      field: "tag",
      message: "",
    });
    setErrorImage({
      field: "image",
      message: "",
    });
    setErrorArtistImage({
      field: "image",
      message: "",
    });
    setErrorAddress({
      field: "address",
      message: "",
    });
    setErrorArtist({
      field: "artist",
      message: "",
    });
    setErrorPrice({
      field: "price",
      message: "",
    });
    setErrorDescription({
      field: "description",
      message: "",
    });
    setErrorTermsCondition({
      field: "termCondition",
      message: "",
    });
    setErrorDisclaimer({
      field: "disclaimer",
      message: "",
    });
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const img = e.target.files[0];
    console.log(e.target.files);
    setFormData({ ...formData, [e.target.name]: img });
    if (e.target.name == "artistImage") {
      setArtistImageName(img.name);
    } else {
      setImageName(img.name);
    }
  };

  const onInputPackageName = (e, index) => {
    const { name, value } = e.target;
    const rows = [...values.val];
    rows[index] = { [name]: value };
    setValues({ val: rows });
  };

  const onInputPackageAmount = (e, index) => {
    const { name, value } = e.target;
    const rows = [...amountValue.val];
    rows[index] = { [name]: value };
    setAmountValue({ val: rows });
  };

  const onInputPackageDiscount = (e, index) => {
    const { name, value } = e.target;
    const rows = [...discountValue.val];
    rows[index] = { [name]: value };
    setDiscountValue({ val: rows });
  };

  const dynamicJson = (index) => {
    const amount = amountValue.val[index] != null ? parseInt(amountValue.val[index]["amount"]) : 0;
    const discount =
      discountValue.val[index] != null
        ? parseInt(discountValue.val[index]["discount"])
        : 0;
    const sellingPrice = Math.round((amount * (100 - discount)) / 100);
    // const tax = 0;
    // const handlingFee = 0;
    return {
      package_name:
        values.val[index] != null ? values.val[index]["package_name"] : "",
      amount:
        amountValue.val[index] != null ? amountValue.val[index]["amount"] : "",
      discount:
        discountValue.val[index] != null
          ? discountValue.val[index]["discount"]
          : 0,
      selling_price: (discountValue.val && discountValue.val[index] && discountValue.val[index]["discount"] != "") ? sellingPrice : amountValue.val[index]["amount"],
      tax: 0,
      handlingFee: 0,
    };
  };

  const handleClick = async () => {
    setLoader(true);
    const packageArray = [];

    for (let i = 0; i < packageCount; i++) {
      try {
        packageArray.push(dynamicJson(i));
      } catch (e) {
        console.log(e);
        setLoader(false);
      }
    }

    setMsg(null);
    const flag = validateInput();

    if (!flag) {
      setLoader(false);
      return;
    }

    if (category == "events") {
      console.log("Events");
      try {
        const requestObj = new FormData();
        requestObj.append("vendor_id", parseInt(vendorId.id));
        requestObj.append("title", formData.title);
        requestObj.append("address", formData.address);
        requestObj.append("image", formData.image);
        requestObj.append("date", startDate.toLocaleDateString("en-US"));
        requestObj.append("starting_time", dateFormat(startTime, "HH:MM"));
        requestObj.append("ending_time", dateFormat(endTime, "HH:MM"));
        requestObj.append("price", JSON.stringify(packageArray));
        requestObj.append("discount", formData.discount);
        requestObj.append("artist", formData.artist);
        requestObj.append("artist_image", formData.artistImage);
        requestObj.append("about", formData.about);
        requestObj.append("terms", formData.termsCondition);
        requestObj.append("disclaimer", formData.disclaimer);
        requestObj.append("language", lang);
        requestObj.append("total_tickets", formData.total_tickets);
        requestObj.append("category", formData.category);
        requestObj.append("exclusive", tag ? tag : 1);
        requestObj.append(
          "artist_facebook_link",
          formData.artist_facebook_link
        );
        requestObj.append("artist_twitter_link", formData.artist_twitter_link);

        requestObj.append("event_key", formData.event_key);
        requestObj.append("workspaceKey", formData.workspaceKey);
        requestObj.append("secret_key", formData.secret_key);
        
        let tempTags = [];
        if (selTags.length) {
          selTags.map(tData => {
            tempTags.push(tData.label ? tData.label : tData)
          })
        }
        requestObj.append("event_tags", JSON.stringify(tempTags));
      
        const response = await API.add_event(requestObj);

        if (response.status == "200") {
          setLoader(false);
          setMsg("Event Added Successfully!!");
          setSuccessful(true);
          props.eventsList.push(response.data);
          props.setEventList(props.eventsList);
        } else {
          setLoader(false);
        }
      } catch (e) {
        setLoader(false);
      }
    }
    if (category == "concerts") {
      try {
        const requestObj = new FormData();
        requestObj.append("vendor_id", parseInt(vendorId.id));
        requestObj.append("title", formData.title);
        requestObj.append("address", formData.address);
        requestObj.append("artist", formData.artist);
        requestObj.append("image", formData.image);
        requestObj.append("date", startDate.toLocaleDateString("en-US"));
        requestObj.append("starting_time", dateFormat(startTime, "HH:MM"));
        requestObj.append("ending_time", dateFormat(endTime, "HH:MM"));
        requestObj.append("price", JSON.stringify(packageArray));
        requestObj.append("discount", formData.discount);
        requestObj.append("artist", formData.artist);
        requestObj.append("artist_image", formData.artistImage);
        requestObj.append("about", formData.about);
        requestObj.append("terms", formData.termsCondition);
        requestObj.append("disclaimer", formData.disclaimer);
        requestObj.append("language", lang);
        requestObj.append("total_tickets", formData.total_tickets);
        requestObj.append("category", formData.category);
        requestObj.append("exclusive", tag ? tag : 1);
        requestObj.append(
          "artist_facebook_link",
          formData.artist_facebook_link
        );
        requestObj.append("artist_twitter_link", formData.artist_twitter_link);
        requestObj.append("event_key", formData.event_key);
        requestObj.append("workspaceKey", formData.workspaceKey);
        requestObj.append("secret_key", formData.secret_key);

        const response = await API.add_concert(requestObj);
        console.log(response);
        if (response.status == "200") {
          setLoader(false);
          setMsg("Concert Added Successfully!!");
          setSuccessful(true);
        } else {
          setLoader(false);
        }
      } catch (e) {
        setLoader(false);
      }
    }
  };

  const handleEditor = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e });
  };

  function validateInput() {
    const {
      title,
      rating,
      popularity,
      event_key,
      workspaceKey,
      secret_key,
      image,
      artist,
      address,
      discount,
      category,
      total_tickets,
      about,
      termsCondition,
      disclaimer,
    } = formData;
    let flag = true;

    if (lang) {
      setErrorTag({
        field: "tag",
        message: "",
      });
    } else {
      setErrorTag({
        field: "tag",
        message: "Please select language",
      });
      flag = false;
    }

    if (category) {
      setCategoryError({
        field: "category",
        message: "",
      });
    } else {
      setCategoryError({
        field: "category",
        message: "Please select category",
      });
      flag = false;
    }


    if (total_tickets) {
      setNoOfTicketError({
        field: "total_tickets",
        message: "",
      });
    } else {
      setNoOfTicketError({
        field: "total_tickets",
        message: "Please enter no of tickets",
      });
      flag = false;
    }

    if (workspaceKey) {
      setErrorWorkspaceKey({
        field: "workspaceKey",
        message: "",
      });
    } else {
      setErrorWorkspaceKey({
        field: "workspaceKey",
        message: "Please enter the event key",
      });
      flag = false;
    }

    if (secret_key) {
      setErrorSecretKey({
        field: "secret_key",
        message: "",
      });
    } else {
      setErrorSecretKey({
        field: "secret_key",
        message: "Please enter the event key",
      });
      flag = false;
    }

    if (event_key) {
      setErrorEventKey({
        field: "event_key",
        message: "",
      });
    } else {
      setErrorEventKey({
        field: "event_key",
        message: "Please enter the event key",
      });
      flag = false;
    }

    if (title) {
      setErrorTitle({
        field: "title",
        message: "",
      });
    } else {
      setErrorTitle({
        field: "title",
        message: "Please enter title",
      });
      flag = false;
    }

    if (category != "movies") {
      if (address) {
        setErrorAddress({
          field: "address",
          message: "",
        });
      } else {
        setErrorAddress({
          field: "address",
          message: "Please enter the address",
        });
        flag = false;
      }
    }

    if (category == "concerts") {
      if (artist) {
        setErrorArtist({
          field: "artist",
          message: "",
        });
      } else {
        setErrorArtist({
          field: "artist",
          message: "Please enter the artist name",
        });
        flag = false;
      }
    }

    if (image) {
      setErrorImage({
        field: "poster",
        message: "",
      });
    } else {
      setErrorImage({
        field: "poster",
        message: "Please upload the image",
      });
      flag = false;
    }

    // let validatePrice = appUtil.validateRating(price);
    // if (validatePrice === 1) {
    //   setErrorPrice({
    //     field: "price",
    //     message: "",
    //   });
    // }
    // if (!(validatePrice === 1)) {
    //   let msg = "";
    //   if (validatePrice === 0) {
    //     msg = "Please enter the price.";
    //   } else {
    //     msg = "Please enter in 00.00 format.";
    //   }
    //   setErrorPrice({
    //     field: "price",
    //     message: msg,
    //   });
    //   flag = false;
    // }

    if (category == "movies") {
      let validateRating = appUtil.validateRating(rating);
      if (validateRating === 1) {
        setErrorRating({
          field: "rating",
          message: "",
        });
      }
      if (!(validateRating === 1)) {
        let msg = "";
        if (validateRating === 0) {
          msg = "Please enter the movie rating.";
        } else {
          msg = "Please enter in 00.00 format.";
        }
        setErrorRating({
          field: "rating",
          message: msg,
        });
        flag = false;
      }

      let validatePopularity = appUtil.validateRating(popularity);
      if (validatePopularity === 1) {
        setErrorPopularity({
          field: "popularity",
          message: "",
        });
      }
      if (!(validatePopularity === 1)) {
        let msg = "";
        if (validatePopularity === 0) {
          msg = "Please enter the movie popularity.";
        } else {
          msg = "Please enter in 00.00 format.";
        }
        setErrorPopularity({
          field: "popularity",
          message: msg,
        });
        flag = false;
      }
    }

    if (about) {
      setErrorDescription({
        field: "description",
        message: "",
      });
    } else {
      setErrorDescription({
        field: "description",
        message: "Please fill up the about section",
      });
      flag = false;
    }

    if (termsCondition) {
      setErrorTermsCondition({
        field: "termsCondition",
        message: "",
      });
    } else {
      setErrorTermsCondition({
        field: "termsCondition",
        message: "Please fill up the terms and condition section",
      });
      flag = false;
    }

    if (disclaimer) {
      setErrorDisclaimer({
        field: "disclaimer",
        message: "",
      });
    } else {
      setErrorDisclaimer({
        field: "disclaimer",
        message: "Please fill up the disclaimer section",
      });
      flag = false;
    }

    return flag;
  }

  return (
    <div>
      {!successful ? (
        <div className="bg-white p-3 rounded-xl dashboard-top-space">
          <div className="flex flex-wrap -mx-3 chivo">
            <div className="w-full px-3 md:mb-8 mb-5 relative">
              <label
                htmlFor="email"
                className="lg:text-xs text-sm font-semibold px-1 text-theme"
              >
                Category
              </label>

              <div className="flex">
                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                  <Category fontSize="small" />
                </div>
                <select
                  name="name"
                  id="name"
                  onChange={handleCategoryChange}
                  className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                  placeholder="Joker"
                >
                  <option disabled value="null" selected={true}>
                    Please select the category
                  </option>
                  <option value="concerts">Concerts</option>
                  <option value="events">Events</option>
                  {/* <option value="movies">Movies</option> */}
                </select>
              </div>
            </div>

            {category && (
              <>
                <div className="lg:w-1/4 xl:w-1/2 md:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="title"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Name<span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Theaters fontSize="small" />
                    </div>
                    <input
                      type="name"
                      name="title"
                      id="title"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Name"
                    />
                  </div>
                  {errorTitle.field === "title" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTitle.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/4 xl:w-1/6 md:w-1/2 w-full px-3 md:mb-8 mb-5 relative date-time-picker">
                  <label
                    htmlFor="name"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Date<span className="text-red-400">*</span>
                  </label>
                  <div className="flex relative">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center absolute top-2.5">
                      <CalendarToday fontSize="small" />
                    </div>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={startDate}
                        className="w-full text-theme pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      />
                  </div>
                </div>
                <div className="lg:w-1/4 xl:w-1/6 md:w-1/2 w-full px-3 md:mb-8 mb-5 relative date-time-picker">
                  <label
                    htmlFor="time"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme "
                  >
                    Start Time<span className="text-red-400">*</span>
                  </label>
                  <div className="flex relative">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center absolute top-2.5">
                      <AccessTime fontSize="small" />
                    </div>
                    <DatePicker
                      selected={startTime}
                      onChange={(date) => setStartTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="w-full text-theme pl-10 pr-3
                  py-2 rounded-lg border-2 border-gray-200 outline-none
                  focus:border-innerBG"
                    />
                  </div>
                  {errorTime.field === "time" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTime.message}
                    </p>
                  )}
                </div>
                <div className="lg:w-1/4 xl:w-1/6 md:w-1/2 w-full px-3 md:mb-8 mb-5 relative date-time-picker">
                  <label
                    htmlFor="time"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme "
                  >
                    End Time<span className="text-red-400">*</span>
                  </label>
                  <div className="flex relative">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center absolute top-2.5">
                      <AccessTime fontSize="small" />
                    </div>

                    <DatePicker
                      selected={endTime}
                      onChange={(date) => setEndTime(date)}
                      showTimeSelect
                      minTime={startTime}
                      maxTime={setHours(setMinutes(startTime, 50), 23)}
                      showTimeSelectOnly
                      timeIntervals={10}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="w-full text-theme pl-10 pr-3
                  py-2 rounded-lg border-2 border-gray-200 outline-none
                  focus:border-innerBG"
                    />
                  </div>
                  {errorTime.field === "time" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTime.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/4 xl:w-1/4 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="text"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Exclusive<span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <FlashOn fontSize="small" />
                    </div>
                    <select
                      type="text"
                      name="tag"
                      id="tag"
                      onChange={handleTagChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    >
                      <option value="1" selected>
                        Yes
                      </option>
                      <option value="0">No</option>
                    </select>
                  </div>
                  {/* {errorTag.field === "tag" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTag.message}
                    </p>
                  )} */}
                </div>

                <div className="lg:w-1/4 xl:w-1/4 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="category1"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Category<span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <FlashOn fontSize="small" />
                    </div>
                    <select
                      type="text"
                      name="category"
                      id="category1"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      // placeholder="Joker"
                    >
                      <option disabled selected>Select category</option>
                      {categoryData.map((item) => {
                          return <option value={item.name}>{item.name}</option>;
                      })}
                    </select>
                  </div>
                  {categoryError.field === "category" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {categoryError.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/4 xl:w-1/4 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="language"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Language<span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <Language fontSize="small" />
                    </div>
                    <select
                      type="text"
                      name="language"
                      id="language"
                      onChange={handleLangChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    >
                      {/* <option value="" disabled selected>
                      Select the tag
                    </option>
                    <option value="nowShowing">Now Showing</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="upcoming">Upcoming</option> */}
                      <option value="" disabled selected>
                        Select language
                      </option>
                      {LanguageData.map((item) => {
                        return (
                          <option value={item.name} key={item.code}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {errorTag.field === "tag" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTag.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/4 xl:w-1/4 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="tickets"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    No of tickets <span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place fontSize="small" />
                    </div>
                    <input
                      type="number"
                      name="total_tickets"
                      id="tickets"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Number of total tickets"
                    />
                  </div>
                  {noOfTicketError.field === "total_tickets" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {noOfTicketError.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="poster"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Poster<span className="text-red-400">*</span>
                  </label>
                  <div className="flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Image fontSize="small" />
                    </div>
                    {imageName ? (
                      <label className="w-full text-red-400" htmlFor="poster">
                        {imageName}
                      </label>
                    ) : (
                      <label className="w-full text-gray-400" htmlFor="poster">
                        Upload Image
                      </label>
                    )}
                    <input
                      type="file"
                      id="poster"
                      name="image"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {errorImage.field === "poster" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorImage.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="rating"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Address<span className="text-red-400">*</span>
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Place fontSize="small" />
                    </div>
                    <input
                      type="rating"
                      name="address"
                      id="name"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Address"
                    />
                  </div>
                  {errorAddress.field === "address" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorAddress.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="artist"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Artist
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Person fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="artist"
                      id="artist"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Artist Name"
                    />
                  </div>

                  {errorArtist.field === "artist" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorArtist.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="artistImage"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Artist Image
                  </label>
                  <div className="flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Image fontSize="small" />
                    </div>
                    {artistImageName ? (
                      <label
                        className="w-full text-red-400"
                        htmlFor="artistImage"
                      >
                        {artistImageName}
                      </label>
                    ) : (
                      <label
                        className="w-full text-gray-400"
                        htmlFor="artistImage"
                      >
                        Upload Image
                      </label>
                    )}
                    <input
                      type="file"
                      id="artistImage"
                      name="artistImage"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {errorArtistImage.field === "artistImage" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorArtistImage.message}
                    </p>
                  )}
                </div>
                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="artist_facebook"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Artist Facebook Link
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Facebook fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="artist_facebook_link"
                      id="artist_facebook"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="www.facebook.com/"
                    />
                  </div>

                  {/* {errorArtist.field === "artist" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorArtist.message}
                    </p>
                  )} */}
                </div>
                <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                  <label
                    htmlFor="artist_twitter"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Artist Twitter Link
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <Twitter fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="artist_twitter_link"
                      id="artist_twitter"
                      onChange={handleChange}
                      className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="www.twitter.com/"
                    />
                  </div>

                  {/* {errorArtist.field === "artist" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorArtist.message}
                    </p>
                  )} */}
                </div>
                {/* <div className="lg:w-1/2 xl:w-1/2 w-full px-3 md:mb-8 mb-5 relative">
                <label
                  htmlFor="price"
                  className="lg:text-xs text-sm font-semibold px-1 text-theme"
                >
                  Price
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <AttachMoney fontSize="small" />
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    onChange={handleChange}
                    className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                    placeholder="100.00"
                  />
                </div>

                {errorPrice.field === "price" && (
                  <p className="text-xs text-red-600 mt-2 absolute">
                    {errorPrice.message}
                  </p>
                )}
              </div> */}

                <div className="w-full text-lg px-4 underline font-semibold text-theme">
                  Package Name
                </div>

                {[...Array(packageCount)].map((value, index) => (
                  <div className="w-full px-3 lg:mb-5 relative flex flex-row lg:flex-nowrap flex-wrap md:md-0 mb-5">
                    <div className="lg:w-1/4 w-full relative mt-3 md:mb-3 mb-1 lg:pr-3">
                      <div className="">
                        <label
                          htmlFor="package_name"
                          className="lg:text-xs text-sm font-semibold px-1 text-theme"
                        >
                          Package Name
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <BusinessCenter fontSize="small" />
                          </div>
                          <input
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                            placeholder="Package Name"
                            name={"package_name"}
                            id="package_name"
                            onChange={(e) => {
                              onInputPackageName(e, index);
                            }}
                          />
                        </div>
                        {/* {errorDiscount.field === "discount" && (
                        <p className="text-xs text-red-600 mt-2 absolute">
                          {errorDiscount.message}
                        </p>
                      )} */}
                      </div>
                    </div>

                    <div className="lg:w-1/4 w-full relative mt-3 md:mb-3 mb-1 lg:pr-3">
                      <div>
                        <label
                          htmlFor="amount"
                          className="lg:text-xs text-sm font-semibold px-1 text-theme"
                        >
                          Price
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <AttachMoney fontSize="small" />
                          </div>
                          <Number
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                            placeholder="00000"
                            name="amount"
                            id="amount"
                            onChange={(e) => {
                              onInputPackageAmount(e, index);
                            }}
                          />
                        </div>
                        {/* {errorDiscount.field === "discount" && (
                        <p className="text-xs text-red-600 mt-2 absolute">
                          {errorDiscount.message}
                        </p>
                      )} */}
                      </div>
                    </div>

                    <div className="lg:w-1/4 w-full relative mt-3 md:mb-3 mb-1 lg:pr-3">
                      <div>
                        <label
                          htmlFor="discount"
                          className="lg:text-xs text-sm font-semibold px-1 text-theme"
                        >
                          Discount
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                            <ThumbUpAltRounded fontSize="small" />
                          </div>
                          <Number
                            format="##"
                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                            placeholder="00"
                            name="discount"
                            id="discount"
                            onChange={(e) => {
                              onInputPackageDiscount(e, index);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/4 w-full relative lg:mt-3 lg:mb-3 mb-1 lg:ml-4 flex flex-row lg:justify-center justify-end gap-5 lg:pt-5 items-center">
                      {/* <div className="mt-7">
                      <AddRounded
                        className="bg-red-200 border-gray-200"
                        onClick={() => {
                          setPackageCount(packageCount + 1);
                        }}
                      /> */}
                      <div
                        className="md:w-10 w-8 bg-gradient-to-r from-primary to-secondary md:h-10 h-8 text-sm tracking-normal rounded-full border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none flex items-center justify-center"
                        onClick={() => {
                          setPackageCount(packageCount + 1);
                        }}
                      >
                        <AddRounded />
                      </div>

                      <div
                        className="md:w-10 w-8 bg-gradient-to-r from-primary to-secondary md:h-10 h-8 text-sm tracking-normal rounded-full border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none flex items-center justify-center"
                        onClick={() => {
                          setPackageCount(packageCount - 1);
                        }}
                      >
                        <Remove />
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                ))}

                {/* EVENT KEY */}
                <div className=" w-full px-3 mb:mt-3 md:mb-7 mb-5 relative">
                  <label
                    htmlFor="event_key"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Event Key<span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <VpnKey fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="event_key"
                      id="event_key"
                      // value={formData.event_key}
                      onChange={handleChange}
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Event Key"
                    />
                  </div>
                  {errorEventKey.field === "event_key" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorEventKey.message}
                    </p>
                  )}
                </div>

                {/* PUBLIC WORKSPACE KEY */}
                <div className=" w-full px-3 mb-5 relative">
                  <label
                    htmlFor="workspaceKey"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Work Space Key<span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <VpnKey fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="workspaceKey"
                      id="workspaceKey"
                      // value={filteredData.workspaceKey}
                      onChange={handleChange}
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Work Space Key"
                    />
                  </div>
                  {errorWorkspaceKey.field === "workspaceKey" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorWorkspaceKey.message}
                    </p>
                  )}
                </div>

                {/* SECRET WORKSPACE KEY */}
                <div className=" w-full px-3 mb:mt-3 md:mb-7 mb-5 relative">
                  <label
                    htmlFor="secret_key"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Secret Workspace Key
                    <span className="text-red-400">*</span>
                  </label>

                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      {/* < fontSize="small" /> */}
                      <VpnKey fontSize="small" />
                    </div>
                    <input
                      type="text"
                      name="secret_key"
                      id="secret_key"
                      // value={filteredData.secret_key}
                      onChange={handleChange}
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      placeholder="Secret Key"
                    />
                  </div>
                  {errorSecretKey.field === "secret_key" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorSecretKey.message}
                    </p>
                  )}
                </div>
                
                {/* Tags */}
                <div className=" w-full px-3 mb:mt-3 md:mb-7 mb-5 relative">
                  <label
                    htmlFor="secret_key"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Tags
                  </label>

                  <div className="flex">
                    <CreatableSelect
                      closeMenuOnSelect={false}
                      isClearable
                      isMulti
                      defaultValue={selTags}
                      onInputChange={handleInputChange}
                      onChange={handleTagInputChange}
                      options={tags}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="w-full px-4 md:mb-8 mb-5">
                  <label
                    htmlFor="discount"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    About <span className="text-red-400">*</span>
                  </label>
                  {/* <CKEditor
                    data=""
                    name="about"
                    onChange={handleEditor}
                    className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                  /> */}
                  <ReactQuill name="about" theme="snow" onChange={(e) => handleEditor(e, 'about')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules}
                        formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                  {errorDescription.field === "description" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorDescription.message}
                    </p>
                  )}
                </div>
                <div className="w-full px-4 md:mb-8 mb-5">
                  <label
                    htmlFor="termsCondition"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Terms and Conditions <span className="text-red-400">*</span>
                  </label>
                  {/* <CKEditor
                    data=""
                    name="termsCondition"
                    onChange={handleEditor}
                    className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                  /> */}
                  <ReactQuill name="termsCondition" theme="snow" onChange={(e) => handleEditor(e, 'termsCondition')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules} formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                  {errorTermsCondition.field === "termsCondition" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorTermsCondition.message}
                    </p>
                  )}
                </div>
                <div className="w-full px-4 mb-6">
                  <label
                    htmlFor="disclaimer"
                    className="lg:text-xs text-sm font-semibold px-1 text-theme"
                  >
                    Disclaimer <span className="text-red-400">*</span>
                  </label>
                  {/* <CKEditor
                    data=""
                    name="disclaimer"
                    onChange={handleEditor}
                    className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                  /> */}
                  <ReactQuill name="disclaimer" theme="snow" onChange={(e) => handleEditor(e, 'disclaimer')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules} formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                  {errorDisclaimer.field === "disclaimer" && (
                    <p className="text-xs text-red-600 mt-2 absolute">
                      {errorDisclaimer.message}
                    </p>
                  )}
                </div>
                <div className="flex w-full">
                  <div className="w-full mt-2 px-3 mb-5 relative">
                    <div className="text-center text-green-400 text-sm font-bold my-2">
                      {msg}
                    </div>
                    <button
                      className="block playfair w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
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
                        <span>Publish</span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-3 rounded-xl">
          <div className="flex flex-col items-center my-5">
            <img src={SuccessImage} alt="Success" className="w-60 h-60" />
            <span className="text-green-600 text-2xl">Added Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}
