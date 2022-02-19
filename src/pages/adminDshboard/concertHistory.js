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
import LanguageData from "../../data/language.json";
import TableRow from "@material-ui/core/TableRow";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import CKEditor from "ckeditor4-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  AttachMoney,
  DateRange,
  Delete,
  AccessTime,
  FlashOn,
  Language,
  Edit,
  Image,
  LocationOn,
  BusinessCenter,
  AddRounded,
  Remove,
  Person,
  Title,
  ThumbUpAltRounded,
  Twitter,
  Facebook,
  VpnKey,
} from "@material-ui/icons";
import Number from "react-number-format";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import * as API from "../../api/api";
import * as C from "../../const";
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

const initialData = {
  address: "",
  created_at: "",
  date: "",
  id: "",
  image: "",
  is_active: "",
  price: "",
  artist: "",
  artistImage: "",
  tag: "",
  time: "",
  title: "",
  updated_at: "",
  vendor_id: "",
  total_tickets: "",
};

const initialError = {
  field: "",
  message: "",
};

export default function ConcertHistory() {
  const classes = useStyles();
  const vendor = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState(initialData);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [blogId, setBlogId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [eventData, setEventData] = useState(rows);
  const [tag, setTag] = useState(null);
  const [errorDiscount, setErrorDiscount] = useState(initialError);
  const [imageName, setImageName] = useState(null);
  const [artistImageName, setArtistImageName] = useState(null);
  const [errorTitle, setErrorTitle] = useState(initialError);
  const [errorArtist, setErrorArtist] = useState(initialError);
  const [errorPrice, setErrorPrice] = useState(initialError);
  const [errorAddress, setErrorAddress] = useState(initialError);
  const [isEmpty, setIsEmpty] = useState(true);
  // const [errorTermsCondition, setErrorTermsCondition] = useState(initialError);
  // const [errorDisclaimer, setErrorDisclaimer] = useState(initialError);
  // const [errorDescription, setErrorDescription] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [packageCount, setPackageCount] = useState(1);
  const [values, setValues] = useState({ val: [] });
  const [amountValue, setAmountValue] = useState({ val: [] });
  const [discountValue, setDiscountValue] = useState({ val: [] });
  const [taxValue, setTaxValue] = useState({ val: [] });
  const [handlingFeeValue, setHandlingFeeValue] = useState({ val: [] });
  const [packageData, setPackageData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lang, setLang] = useState(null);
  
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

  const onInputPackageTax = (e, index) => {
    const { name, value } = e.target;
    const rows = [...taxValue.val];
    rows[index] = { [name]: value };
    setTaxValue({ val: rows });
  };
  const onInputPackageHandlingFee = (e, index) => {
    const { name, value } = e.target;
    const rows = [...handlingFeeValue.val];
    rows[index] = { [name]: value };
    setHandlingFeeValue({ val: rows });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFilteredData({
      ...filteredData,
      category: value,
    });
  };

  const dynamicJson = (index) => {
    const amount = parseInt(amountValue.val[index]["amount"]);
    const discount = parseInt(discountValue.val[index]["discount"]);
    const tax = parseInt(taxValue.val[index]["tax"]);
    const handlingFee = parseInt(handlingFeeValue.val[index]["handlingFee"]);
    const sellingPrice = Math.round((amount * (100 - discount)) / 100);
    return {
      package_name:
        values.val[index] != null ? values.val[index]["package_name"] : "",
      amount:
        amountValue.val[index] != null ? amountValue.val[index]["amount"] : "",
      discount:
        discountValue.val[index] != null
          ? discountValue.val[index]["discount"]
          : "",
      selling_price:
        discountValue.val[index]["discount"] != ""
          ? sellingPrice
          : amountValue.val[index]["amount"],
      tax: taxValue.val[index] != null ? tax : "0",
      handlingFee: handlingFeeValue.val[index] != null ? handlingFee : "0",
    };
  };

  useEffect(() => {
    async function EventHistory() {
      try {
        const response = await API.concert();
        const data = [];
        response.data.map((item) => {
          data.push(item);
        });
        if (data) {
          setEventData(data);
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
        }
      } catch (e) {}
    }
    EventHistory();

    async function CategoryData() {
      try {
        const response = await API.category();
        setCategoryData(response.data);
      } catch (e) {}
    }
    CategoryData();
  }, [isEdit, isDelete]);

  const [filteredData, setFilteredData] = useState(null);

  const handleEdit = (id) => {
    const data = eventData.filter((item) => {
      if (item.id == id) {
        setStartDate(new Date(item.date));
        setStartTime(
          setHours(
            setMinutes(new Date(), item.starting_time.substring(3, 5)),
            item.starting_time.substring(0, 2)
          )
        );
        setEndTime(
          setHours(
            setMinutes(new Date(), item.ending_time.substring(3, 5)),
            item.ending_time.substring(0, 2)
          )
        );
        const imageNameArray = item.image.split("/");
        setImageName(imageNameArray[imageNameArray.length - 1]);
        const artistImageNameArray = item.artist_image.split("/");
        setArtistImageName(
          artistImageNameArray[artistImageNameArray.length - 1]
        );
        setTag(item.tag);
        return item;
      }
    });
    setFilteredData(data[0]);
    setPackageData(JSON.parse(data[0].price));
    setPackageCount(JSON.parse(data[0].price).length);
    setIsEdit(true);
    const pack = JSON.parse(data[0].price);
    if (pack.length > 0) {
      const rows = [...values.val];
      const rows1 = [...amountValue.val];
      const rows2 = [...discountValue.val];
      const rows3 = [...taxValue.val];
      const rows4 = [...handlingFeeValue.val];
      for (let i = 0; i <= pack.length - 1; i++) {
        rows[i] = {
          ["package_name"]: pack[i].package_name,
        };

        rows1[i] = {
          ["amount"]: pack[i].amount,
        };
        rows2[i] = {
          ["discount"]: pack[i].discount,
        };
        rows3[i] = {
          ["tax"]: pack[i].tax,
        };
        rows4[i] = {
          ["handlingFee"]: pack[i].handlingFee,
        };
      }
      setValues({ val: rows });
      setAmountValue({ val: rows1 });
      setDiscountValue({ val: rows2 });
      setTaxValue({ val: rows3 });
      setHandlingFeeValue({ val: rows4 });
    }
  };

  const handleEventEdit = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const handleEditor = (e, fieldName) => {
    setFilteredData({ ...filteredData, [fieldName]: e });
  };

  const handleFileUpload = (e) => {
    const img = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: img });
    if (e.target.name == "artist_image") {
      setArtistImageName(img.name);
    } else {
      setImageName(img.name);
    }
  };

  const handleStatusChange = (e) => {
    setFilteredData({
      ...filteredData,
      ["is_active"]: !filteredData.is_active,
    });
  };

  const handleTagChange = (e) => {
    setLang(e.target.value);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const packageArray = [];
    for (let i = 0; i < packageCount; i++) {
      packageArray.push(dynamicJson(i));
    }
    const flag = validateInput();
    if (!flag) {
      setLoading(false);
      return;
    }
    try {
      let requestObj = new FormData();
      requestObj.append("vendor_id", parseInt(vendor.id));
      requestObj.append("id", filteredData.id);
      requestObj.append("title", filteredData.title);
      requestObj.append("address", filteredData.address);
      requestObj.append("artist", filteredData.artist);
      requestObj.append("date", startDate.toLocaleDateString("en-US"));
      requestObj.append("tag", tag);
      requestObj.append("starting_time", startTime.toLocaleTimeString("en-GB"));
      requestObj.append("ending_time", endTime.toLocaleTimeString("en-GB"));
      requestObj.append("price", JSON.stringify(packageArray));
      requestObj.append("discount", filteredData.discount);
      requestObj.append("is_active", filteredData.is_active ? "1" : "0");
      requestObj.append("old_image", filteredData.image);
      formData.image && requestObj.append("image", formData.image);
      requestObj.append("old_image2", filteredData.artist_image);
      requestObj.append("artist", filteredData.artist);
      requestObj.append("tax", filteredData.tax);
      formData.artist_image &&
        requestObj.append("artist_image", formData.artist_image);
      requestObj.append("about", filteredData.about);
      requestObj.append("terms", filteredData.terms);
      requestObj.append("disclaimer", filteredData.disclaimer);
      requestObj.append("language", lang ? lang : filteredData.language);
      requestObj.append("total_tickets", filteredData.total_tickets);
      requestObj.append("category", filteredData.category);
      requestObj.append("exclusive", tag ? tag : 1);
      requestObj.append(
        "artist_facebook_link",
        filteredData.artist_facebook_link
      );
      requestObj.append(
        "artist_twitter_link",
        filteredData.artist_twitter_link
      );
      requestObj.append("event_key", filteredData.event_key);
      requestObj.append("workspaceKey", filteredData.workspaceKey);
      requestObj.append("secret_key", filteredData.secret_key);
      const response = await API.update_concert(requestObj);
      if (response.status == 200) {
        setLoading(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { title, address } = filteredData;
    let flag = true;

    if (title) {
      setErrorTitle({
        field: "title",
        message: "",
      });
    } else {
      setErrorTitle({
        field: "title",
        message: "Please enter the concert title",
      });
      flag = false;
    }

    if (address) {
      setErrorAddress({
        field: "address",
        message: "",
      });
    } else {
      setErrorAddress({
        field: "address",
        message: "Please enter the concert venue",
      });
      flag = false;
    }

    return flag;
  }

  const handleDelete = (id) => {
    setBlogId(id);
    setIsDelete(true);
  };

  const handleEventDelete = async () => {
    try {
      const response = await API.delete_concert(blogId);
      if (response.status == 200) {
        setIsDelete(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Concert</div>
      <div className=" font-medium text-gray-400 mb-2">All Concert History</div>
      <hr />
      {isEmpty ? (
        <div>Concert Empty</div>
      ) : (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Address</TableCell>
                {/* <TableCell align="right">Discount</TableCell>
                <TableCell align="right">Amount</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventData.map((item) => {
                const src = C.URL + "/" + item.image;
                const month = dateFormat(item.date, "mmmm");
                const day = dateFormat(item.date, "dS, yyyy");
                const date = month.substring(0, 3) + " " + day;
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-200 cursor-default"
                  >
                    <TableCell component="th" scope="item">
                      <img
                        src={src}
                        alt={item.title}
                        className="w-10 h-10 object-cover"
                      />
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    {/* <TableCell>{item.artist}</TableCell> */}
                    <TableCell>
                      <span className="capitalize">{item.category}</span>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold">{item.address}</span>
                    </TableCell>
                    {/* <TableCell align="right">{item.discount}%</TableCell>
                    <TableCell align="right">
                      <span className="font-bold">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      {item.is_active == 1 ? (
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
                          onClick={() => handleEdit(item.id)}
                          className="cursor-pointer"
                        >
                          <Edit fontSize="small" />
                        </div>
                        |
                        <div
                          onClick={() => handleDelete(item.id)}
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
      )}
      {isEdit && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto mt-16"
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-full lg:w-1/2 xl:w-1/2">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex flex-row flex-wrap -mx-3 chivo">
                  {/* NAME */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full mb-3">
                    <label
                      htmlFor="title"
                      className="text-xs font-semibold px-1"
                    >
                      Title
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Title />
                      </div>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={filteredData.title}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Event"
                      />
                    </div>
                    {errorTitle.field === "title" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorTitle.message}
                      </p>
                    )}
                  </div>

                  {/* STATUS AND POSTER */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full px-3 flex flex-row ">
                    <div className="w-2/3">
                      <label
                        htmlFor="poster"
                        className="text-xs font-semibold px-1 text-theme"
                      >
                        Event Image
                      </label>
                      <div className="flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <Image fontSize="small" />
                        </div>
                        {imageName ? (
                          <label
                            className="w-full text-red-400"
                            htmlFor="poster"
                          >
                            {imageName}
                          </label>
                        ) : (
                          <label
                            className="w-full text-gray-400"
                            htmlFor="poster"
                          >
                            Upload Image
                          </label>
                        )}
                        <input
                          type="file"
                          id="poster"
                          className="hidden"
                          name="image"
                          // value={filteredData[0].image}
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    <div className="w-1/3">
                      <div className="px-3 mb-3">
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
                                  !filteredData
                                    ? false
                                    : filteredData.is_active == "1"
                                    ? true
                                    : false
                                }
                                onChange={handleStatusChange}
                                name="checkedB"
                              />
                            }
                            className="pl-2"
                            // label="iOS style"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXCLUSIVE, DATE, START DATE, END DATE */}
                  <div className="w-full flex flex-row ">
                    <div className="w-1/4 px-3 mb-3">
                      <label className="text-xs font-semibold px-1">
                        Exclusive
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <FlashOn />
                        </div>
                        <select
                          name="name"
                          id="name"
                          onChange={handleTagChange}
                          className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        >
                          <option
                            value="1"
                            selected={filteredData.exclusive == "1" && true}
                          >
                            Yes
                          </option>
                          <option
                            value="0"
                            selected={filteredData.tag == "0" && true}
                          >
                            No
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="w-1/4 px-3 mb-3">
                      <label
                        htmlFor="price"
                        className="text-xs font-semibold px-1"
                      >
                        Date
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <DateRange />
                        </div>
                        <div className="w-auto">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            className="w-40 text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 flex flex-row">
                      <div className="lg:w-1/2 xl:w-1/2 w-1/2 px-3 mb-3 relative">
                        <label
                          htmlFor="time"
                          className="text-xs font-semibold px-1 text-theme "
                        >
                          Start Time
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
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
                            className="xl:w-40 lg:w-40 w-40 text-theme -ml-10 pl-10 pr-3
                  py-2 rounded-lg border-2 border-gray-200 outline-none
                  focus:border-innerBG"
                          />
                        </div>
                      </div>
                      <div className="lg:w-1/2 xl:w-1/2 w-1/2 px-3 mb-3 relative">
                        <label
                          htmlFor="time"
                          className="text-xs font-semibold px-1 text-theme "
                        >
                          End Time
                        </label>
                        <div className="flex">
                          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
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
                            className="xl:w-40 lg:w-40 w-40 text-theme -ml-10 pl-10 pr-3
                  py-2 rounded-lg border-2 border-gray-200 outline-none
                  focus:border-innerBG"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ARTIST NAME */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full px-3 mb-3">
                    <label
                      htmlFor="artist"
                      className="text-xs font-semibold px-1"
                    >
                      Artist
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Person />
                      </div>
                      <input
                        type="text"
                        name="artist"
                        id="artist"
                        value={filteredData.artist}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Jubin Naytiyal"
                      />
                    </div>
                    {errorArtist.field === "artist" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorArtist.message}
                      </p>
                    )}
                  </div>

                  {/* ARTIST IMAGE */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full px-3 mb-3">
                    <label
                      htmlFor="artist"
                      className="text-xs font-semibold px-1"
                    >
                      Artist Image
                    </label>
                    <div className=" overflow-hidden flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
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
                        // value={filteredData[0].image}
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

                  {/* ARTIST FACEBOOK */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full px-3 mb-3">
                    <label
                      htmlFor="artist_facebook_link"
                      className="text-xs font-semibold px-1"
                    >
                      Artist Facebook Link
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Facebook />
                      </div>
                      <input
                        type="text"
                        name="artist_facebook_link"
                        id="artist_facebook_link"
                        value={filteredData.artist_facebook_link}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder=""
                      />
                    </div>
                    {/* {errorArtist.field === "artist" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorArtist.message}
                      </p>
                    )} */}
                  </div>

                  {/* ARTIST TWITTER LINK */}
                  <div className="xl:w-1/2 lg:w-1/2 w-full px-3 mb-3">
                    <label
                      htmlFor="artist_twitter_link"
                      className="text-xs font-semibold px-1"
                    >
                      Artist Twitter Link
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Twitter />
                      </div>
                      <input
                        type="text"
                        name="artist_twitter_link"
                        id="artist_twitter_link"
                        value={filteredData.artist_twitter_link}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder=""
                      />
                    </div>
                    {/* {errorArtist.field === "artist" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorArtist.message}
                      </p>
                    )} */}
                  </div>

                  {/* LANGUAGE */}
                  <div className="xl:w-1/3 lg:w-1/3 w-full px-3 mb-3">
                    <label
                      htmlFor="address"
                      className="text-xs font-semibold px-1"
                    >
                      Language
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Language />
                      </div>
                      <select
                        type="text"
                        name="tag"
                        id="tag"
                        onChange={handleTagChange}
                        className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        // placeholder="Joker"
                      >
                        {/* <option value="" disabled selected>
                      Select the tag
                    </option>
                    <option value="nowShowing">Now Showing</option>
                    <option value="exclusive">Exclusive</option>
                    <option value="upcoming">Upcoming</option> */}
                        <option value={filteredData.language} disabled selected>
                          {filteredData.language}
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
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="xl:w-1/3 lg:w-1/3 w-full px-3 mb-3">
                    <label
                      htmlFor="address"
                      className="text-xs font-semibold px-1"
                    >
                      Address
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <LocationOn />
                      </div>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={filteredData.address}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Address"
                      />
                    </div>
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* TOTAL NUMBER OF TICKETS */}
                  <div className="xl:w-1/3 lg:w-1/3 w-full px-3 mb-3">
                    <label
                      htmlFor="tickets"
                      className="text-xs font-semibold px-1"
                    >
                      No of tickets
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <LocationOn />
                      </div>
                      <input
                        type="number"
                        name="tickets"
                        id="tickets"
                        value={filteredData.total_tickets}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Number of Ticktes"
                      />
                    </div>
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* CATEGORY */}
                  <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-8 relative">
                    <label
                      htmlFor="category1"
                      className="text-xs font-semibold px-1 text-theme"
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
                        <option disabled selected>
                          Category
                        </option>
                        {categoryData.map((item) => {
                          return (
                            <option
                              value={item.name}
                              selected={filteredData.category === item.name}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="xl:w-1/3 lg:w-1/3 w-full px-3 mb-3">
                    <label
                      htmlFor="total_tickets"
                      className="text-xs font-semibold px-1"
                    >
                      Tax Amount
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <AttachMoney fontSize="small" />
                      </div>
                      <input
                        type="number"
                        name="tax"
                        id="tax"
                        value={filteredData.tax}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Number of Ticktes"
                      />
                    </div>
                    {errorAddress.field === "tax" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* PACKAGE DETAILS */}
                  <div className="w-full px-3">
                    <div className="text-lg underline">Package</div>
                    {[...Array(packageCount)].map((value, index) => {
                      return (
                        <>
                          <div className="w-full mb-2 relative flex flex-row">
                            <div className="w-36 relative pr-3">
                              <div className="">
                                <label
                                  htmlFor={`package_name${index}`}
                                  className="text-xs font-semibold px-1 text-theme"
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
                                    value={
                                      values.val[index]
                                        ? values.val[index].package_name
                                        : ""
                                    }
                                    id={`package_name${index}`}
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

                            <div className="w-36 relative pr-3">
                              <div>
                                <label
                                  htmlFor={`amount${index}`}
                                  className="text-xs font-semibold px-1 text-theme"
                                >
                                  Amount
                                </label>
                                <div className="flex">
                                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                    <AttachMoney fontSize="small" />
                                  </div>
                                  <Number
                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                    placeholder="00000"
                                    name="amount"
                                    id={`amount${index}`}
                                    value={
                                      amountValue.val[index]
                                        ? amountValue.val[index].amount
                                        : ""
                                    }
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

                            <div className="w-36 relative pr-3">
                              <div>
                                <label
                                  htmlFor={`discount${index}`}
                                  className="text-xs font-semibold px-1 text-theme"
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
                                    value={
                                      discountValue.val[index]
                                        ? discountValue.val[index].discount
                                        : ""
                                    }
                                    id={`discount${index}`}
                                    onChange={(e) => {
                                      onInputPackageDiscount(e, index);
                                    }}
                                  />
                                </div>
                                {errorDiscount.field === "discount" && (
                                  <p className="text-xs text-red-600 mt-2 absolute">
                                    {errorDiscount.message}
                                  </p>
                                )}
                              </div>
                            </div>

                          

                            <div className="w-40 relative pr-3">
                              <div>
                                <label
                                  htmlFor={`handlingFee${index}`}
                                  className="text-xs font-semibold px-1 text-theme"
                                >
                                  Internet Handling Fee
                                </label>
                                <div className="flex">
                                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                    <AttachMoney fontSize="small" />
                                  </div>
                                  <Number
                                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                                    placeholder="00000"
                                    name="handlingFee"
                                    id={`handlingFee${index}`}
                                    value={
                                      handlingFeeValue.val[index]
                                        ? handlingFeeValue.val[index]
                                            .handlingFee
                                        : ""
                                    }
                                    onChange={(e) => {
                                      onInputPackageHandlingFee(e, index);
                                    }}
                                  />
                                </div>
                           
                              </div>
                            </div>

                            <div className="w-20 relative pr-3 flex flex-row justify-center gap-2 pt-5">
                              <div
                                className="w-10 bg-gradient-to-r from-primary to-secondary
       py-2 px-2 h-10  text-sm tracking-normal rounded-full border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                                onClick={() => {
                                  setPackageCount(packageCount + 1);
                                }}
                              >
                                <AddRounded />
                              </div>

                              <div
                                className="w-10 bg-gradient-to-r from-primary to-secondary
       py-2 px-2 h-10  text-sm tracking-normal rounded-full border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                                onClick={() => {
                                  setPackageCount(packageCount - 1);
                                }}
                              >
                                <Remove />
                                {/* </div> */}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>

                  {/* EVENT KEY */}
                  <div className=" w-full px-3 mt-3 mb-3 relative">
                    <label
                      htmlFor="event_key"
                      className="text-xs font-semibold px-1 text-theme"
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
                        value={filteredData.event_key}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Event Key"
                      />
                    </div>
                  </div>

                  {/* PUBLIC WORKSPACE KEY */}
                  <div className=" w-full px-3 relative">
                    <label
                      htmlFor="workspaceKey"
                      className="text-xs font-semibold px-1 text-theme"
                    >
                      Public Workspace Key
                      <span className="text-red-400">*</span>
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
                        value={filteredData.workspaceKey}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Public Key"
                      />
                    </div>
                  </div>

                  {/* SECRET WORKSPACE KEY */}
                  <div className=" w-full px-3 mt-3 mb-4 relative">
                    <label
                      htmlFor="secret_key"
                      className="text-xs font-semibold px-1 text-theme"
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
                        value={filteredData.secret_key}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Secret Key"
                      />
                    </div>
                  </div>

                  {/* ABOUT */}
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="address"
                      className="text-xs font-semibold px-1"
                    >
                      About
                    </label>
                    <div className="flex">
                      {/* <CKEditor
                        data={filteredData.about}
                        name="about"
                        onChange={handleEditor}
                        className="text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                        style={{ width: "100%" }}
                      /> */}
                      <ReactQuill name="about" theme="snow" value={filteredData.about} onChange={(e) => handleEditor(e, 'about')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules}
                        formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                    </div>
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* TERMS AND CONDITION*/}
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="terms"
                      className="text-xs font-semibold px-1"
                    >
                      Terms and Condition
                    </label>
                    <div className="flex">
                      {/* <CKEditor
                        data={filteredData.terms}
                        name="terms"
                        id="terms"
                        onChange={handleEditor}
                        className=" text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                        style={{ width: "100%" }}
                      /> */}
                      <ReactQuill name="terms" theme="snow" value={filteredData.terms} onChange={(e) => handleEditor(e, 'terms')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules} formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                    </div>
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>

                  {/* DISCLAIMER*/}
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="disclaimer"
                      className="text-xs font-semibold px-1"
                    >
                      Disclaimer
                    </label>
                    <div className="flex">
                      {/* <CKEditor
                        data={filteredData.disclaimer}
                        name="disclaimer"
                        onChange={handleEditor}
                        className=" text-theme -ml-10 pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-innerBG"
                        style={{ width: "100%" }}
                      /> */}
                      <ReactQuill name="disclaimer" theme="snow" value={filteredData.disclaimer} onChange={(e) => handleEditor(e, 'disclaimer')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules} formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                    </div>
                    {errorAddress.field === "address" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorAddress.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <span>Update</span>
                  )}
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2 opacity-70"
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
                  onClick={handleEventDelete}
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
