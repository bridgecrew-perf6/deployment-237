import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import Select from "react-select";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  CategoryOutlined,
  ControlPoint,
  DateRange,
  Delete,
  Edit,
  Image,
  Title,
} from "@material-ui/icons";
import CKEditor from "ckeditor4-react";
import * as C from "../../const";
import * as API from "../../api/api";
import DatePicker from "react-datepicker";
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

const initialUserList = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  number: "",
};

const initialData = {
  id: "",
  image: "",
  title: "",
  description: "",
  status: "",
  old_image: "",
};

const initialBlogData = {
  title: "",
  description: "",
  image: "",
};

const inititalError = {
  field: "",
  message: "",
};

const initialCouponData = {
  coupon_code: "",
  discount_amount: "",
  expiry_date: "",
};
export default function Coupon(props) {
  const classes = useStyles();
  const [blog, setBlog] = useState([initialUserList]);
  const [formData, setFormData] = useState(initialData);
  const [blogData, setBlogData] = useState(initialBlogData);
  const [isEdit, setIsEdit] = useState(false);

  const [addBlog, setAddBlog] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [errorTitle, setErrorTitle] = useState(inititalError);
  const [errorDescription, setErrorDescription] = useState(inititalError);
  const [errorImage, setErrorImage] = useState(inititalError);
  const [loading, setLoading] = useState(true);

  const [list, setList] = useState([]);
  const [couponData, setCouponData] = useState(initialCouponData);
  const vendor = JSON.parse(localStorage.getItem("userData"));
  const [eventName, setEventName] = useState([]);
  const [category, setCategory] = useState(null);
  const [eventOptions, setEventOptions] = useState([]);
  const [concertOptions, setConcertOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [eventId, setEventId] = useState(null);
  const [couponList, setCouponList] = useState([]);
  useEffect(() => {
    async function Data() {
      try {
        const response = await API.event_by_vendor(vendor.id);
        const options = [];
        response.data[0].events.map((item) => {
          const obj = { value: item.id, label: item.title };
          options.push(obj);
        });
        setEventOptions(options);

        const response1 = await API.concert_by_vendor(vendor.id);
        const options1 = [];
        response1.data[0].concert.map((item) => {
          const obj = { value: item.id, label: item.title };
          options1.push(obj);
        });
        setConcertOptions(options1);
      } catch (e) {}
    }
    Data();

    async function CouponAPI() {
      try {
        const response = await API.coupon();

        setCouponList(response.data);
        setLoading(false);
      } catch (e) {}
    }
    CouponAPI();
  }, [isEdit, addBlog, isDelete,props.tenat_event]);

  const handleChangeCoupon = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const handleEdit = (id) => {
    const data = couponList.filter((item) => {
      if (item.id === id) {
        if (item.type_id === "Event") {
          setList(eventOptions);
        } else {
          setList(concertOptions);
        }
        return item;
      }
    });
    setFilteredData(data[0]);
    setIsEdit(true);
  };

  const handleBlogEdit = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    const { id, expiry_date, coupon_code, e_id, discount_amount, type_id } =
      filteredData;
    try {
      let requestObj = {
        id: id,
        event_id: e_id,
        coupon_code: coupon_code,
        discount_amount: discount_amount,
        expiry_date: dateFormat(expiry_date, "yyyy-mm-dd"),
        vendor_id: vendor.id,
        type_id: type_id === "Event" ? 1 : 2,
      };

      const response = await API.add_coupon(requestObj);

      if (response.status == 200) {
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const handleDelete = (id) => {
    setBlogId(id);
    setIsDelete(true);
  };

  const handleBlogDelete = async () => {
    try {
      const response = await API.delete_coupon(blogId);
      if (response.status == 200) {
        setIsDelete(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const addNewBlog = async () => {
    // const flag = validateInput();
    // if (!flag) {
    //   return;
    // }
    try {
      let requestObj = {
        event_id: eventId,
        coupon_code: couponData.coupon_code,
        discount_amount: couponData.discount_amount,
        expiry_date: dateFormat(startDate, "yyyy-mm-dd"),
        vendor_id: vendor.id,
        type_id: category === "event" ? 1 : 2,
      };
      //   return;
      const response = await API.add_coupon(requestObj);
      if (response.status == "200") {
        setAddBlog(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const categoryOptions = [
    { value: "event", label: "Event" },
    { value: "concert", label: "Concert" },
  ];

  const handleChange = (e) => {
    setCategory(e.value);
  };

  const handleEventName = (e) => {
    setEventId(e.value);
  };

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="flex flex-row justify-between">
        <div>
          <div className="uppercase font-medium text-secondary">Coupons</div>
          <div className=" font-medium text-gray-400 mb-2">All coupons</div>
        </div>
        <div>
          <button
            onClick={() => {
              setAddBlog(true);
              setCategory(null);
            }}
            className="px-4 py-2 bg-gray-100 focus:outline-none rounded-xl hover:bg-gray-200"
          >
            <ControlPoint /> Add New Coupon
          </button>
        </div>
      </div>
      <hr />
      {loading ? (
        <div className="my-2 text-lg">Loading...</div>
      ) : blog.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Coupon</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell>Discount Amount</TableCell>
                <TableCell>Expiry Date</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {couponList.map((item) => {
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-200 cursor-default"
                  >
                    <TableCell>
                      <span className="capitalize ">{item.coupon_code}</span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize ">{item.type_id}</span>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize ">{item.event_id}</span>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize">
                        $ {item.discount_amount}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize ">{item.expiry_date}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
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
      ) : (
        <div className="my-2 text-lg">Not data found</div>
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
                <div className="flex flex-row flex-wrap -mx-3 chivo">
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="type"
                      className="text-xs font-semibold px-1"
                    >
                      Type
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <CategoryOutlined />
                      </div>
                      <input
                        type="type"
                        name="type"
                        id="type"
                        value={filteredData.type_id}
                        // onChange={handleBlogEdit}
                        readOnly
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Coupon Code"
                      />
                      {/* <select
                        name="type"
                        id="type"
                        onChange={handleCatChange}
                        className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      >
                        <option
                          value="event"
                          selected={filteredData.type_id == "Event" && true}
                        >
                          Event
                        </option>
                        <option
                          value="concert"
                          selected={filteredData.type_id == "Concert" && true}
                        >
                          Concert
                        </option>
                      </select> */}
                    </div>
                  </div>
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="event_id"
                      className="text-xs font-semibold px-1"
                    >
                      Event Name
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <CategoryOutlined />
                      </div>
                      <select
                        name="event_id"
                        id="event_id"
                        onChange={handleEventNameChange}
                        className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                      >
                        {/* {category=="Event" ? 
                        {eventOptions.map(item => {
                          return(
                            <option
                          value="event"
                          selected={filteredData.type_id == "Event" && true}
                        ></option>
                          )
                        })}
                        :
                        <option
                          value="event"
                          selected={filteredData.type_id == "Event" && true}
                        >} */}
                        {list.map((item) => {
                          return (
                            <option
                              value={item.value}
                              selected={
                                filteredData.event_id == `${item.label}` && true
                              }
                            >
                              {item.label}
                            </option>
                          );
                        })}
                        {/* <option
                          value="event"
                          selected={filteredData.type_id == "Event" && true}
                        >
                          Event
                        </option>
                        <option
                          value="concert"
                          selected={filteredData.type_id == "Concert" && true}
                        >
                          Concert
                        </option> */}
                      </select>
                    </div>
                  </div>
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="coupon_code"
                      className="text-xs font-semibold px-1"
                    >
                      Coupon Code
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Title />
                      </div>
                      <input
                        type="text"
                        name="coupon_code"
                        id="coupon_code"
                        value={filteredData.coupon_code}
                        onChange={handleBlogEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Coupon Code"
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="discount_amount"
                      className="text-xs font-semibold px-1"
                    >
                      Discount Amount
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Title />
                      </div>
                      <input
                        type="text"
                        name="discount_amount"
                        id="discount_amount"
                        value={filteredData.discount_amount}
                        onChange={handleBlogEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Coupon Code"
                      />
                    </div>
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="price"
                      className="text-xs font-semibold px-1"
                    >
                      Date
                    </label>
                    <div className="flex">
                      <div className="w-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        {/* <DateRange /> */}
                      </div>
                      <div className="w-auto">
                        <DatePicker
                          name="expiry_date"
                          selected={new Date(filteredData.expiry_date)}
                          onChange={(date) =>
                            setFilteredData({
                              ...filteredData,
                              expiry_date: date,
                            })
                          }
                          minDate={new Date()}
                          className="xl:w-96 lg:w-96 w-40 text-theme -ml-10 pl-2 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdate}
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
                  onClick={handleBlogDelete}
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

      {addBlog && (
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full px-3 mb-6 relative">
                    <label
                      htmlFor="title"
                      className="text-xs font-semibold px-1"
                    >
                      Category
                    </label>
                    <div className="flex">
                      <Select
                        //   value={selectedMovie}
                        onChange={handleChange}
                        options={categoryOptions}
                        placeholder="Select category"
                        className="w-full focus:outline-none border-0"
                        classNamePrefix="focus:outline-none react-select-container"
                      />
                    </div>
                    {errorTitle.field === "title" && (
                      <p className="text-xs text-red-600 mt-2 absolute">
                        {errorTitle.message}
                      </p>
                    )}
                  </div>
                  {category && (
                    <>
                      <div className="w-full px-3 mb-6 relative">
                        <label
                          htmlFor="title"
                          className="text-xs font-semibold px-1"
                        >
                          Event Name
                        </label>
                        <div className="flex">
                          <Select
                            //   value={selectedMovie}
                            onChange={handleEventName}
                            options={
                              category === "event"
                                ? eventOptions
                                : concertOptions
                            }
                            placeholder="Select category"
                            className="w-full focus:outline-none border-0"
                            classNamePrefix="focus:outline-none react-select-container"
                          />
                        </div>
                        {errorTitle.field === "title" && (
                          <p className="text-xs text-red-600 mt-2 absolute">
                            {errorTitle.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col -mx-3 px-4 chivo">
                        <div className="w-full px-3 mb-8">
                          <label
                            htmlFor="coupon_code"
                            className="text-xs font-semibold px-1"
                          >
                            Coupon Code
                          </label>
                          <div className="flex">
                            <div className="w-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                              {/* <Title /> */}
                            </div>
                            <input
                              type="text"
                              name="coupon_code"
                              id="coupon_code"
                              // value={filteredData.title}
                              onChange={handleChangeCoupon}
                              className="w-full -ml-10 pl-2 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                              placeholder="Coupon Code"
                            />
                          </div>
                        </div>

                        <div className="w-full px-3 mb-8">
                          <label
                            htmlFor="discount_amount"
                            className="text-xs font-semibold px-1"
                          >
                            Discount Amount
                          </label>
                          <div className="flex">
                            <div className="w-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                              {/* <Title /> */}
                            </div>
                            <input
                              type="text"
                              name="discount_amount"
                              id="discount_amount"
                              // value={filteredData.title}
                              onChange={handleChangeCoupon}
                              className="w-full -ml-10 pl-2 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                              placeholder="Discount Amount"
                            />
                          </div>
                        </div>

                        <div className="w-full px-3 mb-8">
                          <label
                            htmlFor="title"
                            className="text-xs font-semibold px-1"
                          >
                            Expiry Date
                          </label>
                          <div className="flex">
                            <div className="w-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                              {/* <Title /> */}
                            </div>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              minDate={startDate}
                              className="xl:w-96 lg:w-96 w-40 text-theme -ml-10 pl-2 pr-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-innerBG"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={addNewBlog}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setAddBlog(false);
                    setBlogData(initialBlogData);
                  }}
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
