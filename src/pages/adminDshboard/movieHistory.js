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
import * as appUtil from "../../helper/appUtils";
import {
  AttachMoney,
  DateRange,
  Delete,
  Edit,
  Image,
  Label,
  Star,
  ThumbUp,
  Title,
} from "@material-ui/icons";
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
    id: 5,
    date: "12-06-2021",
    ticketId: "MTG005",
    name: "Vaibhav Sinha",
    category: "Concert",
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
  tag: "",
  time: "",
  title: "",
  updated_at: "",
  vendor_id: "",
};

const initialError = {
  field: "",
  message: "",
};

export default function MovieHistory() {
  const classes = useStyles();
  const vendor = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState(initialData);
  const [startDate, setStartDate] = useState(new Date());
  const [blogId, setBlogId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [eventData, setEventData] = useState(rows);
  const [isEmpty, setIsEmpty] = useState(true);
  const [tag, setTag] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [errorDiscount, setErrorDiscount] = useState(initialError);
  const [errorTitle, setErrorTitle] = useState(initialError);
  const [errorRating, setErrorRating] = useState(initialError);
  const [errorPopularity, setErrorPopularity] = useState(initialError);
  const [errorPrice, setErrorPrice] = useState(initialError);

  useEffect(() => {
    async function EventHistory() {
      setIsEmpty(true);
      try {
        const response = await API.movies();
        const data = [];
        response.data.map((item) => {
          data.push(item);
        });
        if (data) {
          setIsEmpty(false);
        }
        setEventData(data);
      } catch (e) {}
    }
    EventHistory();
  }, [isEdit]);

  const [filteredData, setFilteredData] = useState(null);

  const handleEdit = (id) => {
    const data = eventData.filter((item) => {
      if (item.id == id) {
        setStartDate(new Date(item.date));
        const imageNameArray = item.image.split("/");
        setImageName(imageNameArray[imageNameArray.length - 1]);
        setTag(item.tag);
        return item;
      }
    });
    setFilteredData(data[0]);
    setIsEdit(true);
  };

  const handleEventEdit = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const img = e.target.files[0];
    setFormData({ ...formData, ["image"]: img });
    setImageName(img.name);
  };

  const handleStatusChange = (e) => {
    // setState(!state);
    setFilteredData({
      ...filteredData,
      ["is_active"]: !filteredData.is_active,
    });
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const [state, setState] = useState(
    filteredData ? filteredData.status : false
  );

  const handleUpdate = async () => {
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      let requestObj = new FormData();
      requestObj.append("vendor_id", parseInt(vendor.id));
      requestObj.append("id", filteredData.id);
      requestObj.append("title", filteredData.title);
      requestObj.append("rating", filteredData.rating);
      requestObj.append("popularity", filteredData.popularity);
      requestObj.append("date", startDate.toLocaleDateString("en-US"));
      requestObj.append("tag", tag);
      requestObj.append("time", filteredData.time);
      requestObj.append("price", filteredData.price);
      requestObj.append("is_active", filteredData.is_active ? "1" : "0");
      requestObj.append("old_image", filteredData.image);
      requestObj.append("discount", filteredData.discount);
      const response = await API.update_movies(requestObj);

      if (response.status == 200) {
        setIsEdit(false);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { title, rating, popularity, price, discount } = filteredData;
    let flag = true;

    if (title) {
      setErrorTitle({
        field: "title",
        message: "",
      });
    } else {
      setErrorTitle({
        field: "title",
        message: "Please enter the movie title",
      });
      flag = false;
    }

    if (discount) {
      if (discount > 100 || discount < 0) {
        setErrorDiscount({
          field: "discount",
          message: "Discount must be between 0 and 100",
        });
        flag = false;
      } else {
        setErrorDiscount({
          field: "discount",
          message: "",
        });
      }
    } else {
      setErrorDiscount({
        field: "discount",
        message: "Please enter the movie discount",
      });
      flag = false;
    }

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

    let validatePrice = appUtil.validateRating(price);
    if (validatePrice === 1) {
      setErrorPrice({
        field: "price",
        message: "",
      });
    }
    if (!(validatePrice === 1)) {
      let msg = "";
      if (validatePrice === 0) {
        msg = "Please enter the movie price.";
      } else {
        msg = "Please enter in 00.00 format.";
      }
      setErrorPrice({
        field: "price",
        message: msg,
      });
      flag = false;
    }
    return flag;
  }

  const handleDelete = (id) => {
    setBlogId(id);
    setIsDelete(true);
    setIsEdit(false);
  };

  const handleEventDelete = async () => {
    try {
      const response = await API.delete_movie(blogId);
      if (response.status == 200) {
        setIsDelete(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Movies</div>
      <div className=" font-medium text-gray-400 mb-2">All Movie History</div>
      <hr />
      {isEmpty ? (
        <div>Movie Empty</div>
      ) : (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell align="right">Amount</TableCell>
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
                    <TableCell>
                      <span className="capitalize">{item.tag}</span>
                    </TableCell>

                    <TableCell align="right">
                      <span className="font-bold">
                        {Number(item.discount).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span className="font-bold">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </TableCell>
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
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full px-3 mb-3">
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
                        placeholder="email@example.com"
                      />
                    </div>
                    {errorTitle.field === "title" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorTitle.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="rating"
                      className="text-xs font-semibold px-1"
                    >
                      Rating
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Star />
                      </div>
                      <input
                        type="text"
                        name="rating"
                        id="rating"
                        value={filteredData.rating}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="00.00"
                      />
                    </div>
                    {errorRating.field === "rating" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorRating.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="popularity"
                      className="text-xs font-semibold px-1"
                    >
                      Popularity
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Star />
                      </div>
                      <input
                        type="text"
                        name="popularity"
                        id="popularity"
                        value={filteredData.popularity}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="00.00"
                      />
                    </div>
                    {errorPopularity.field === "popularity" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorPopularity.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 flex flex-row ">
                    <div className="w-2/3">
                      <label
                        htmlFor="poster"
                        className="text-xs font-semibold px-1 text-theme"
                      >
                        Movies Image
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

                  <div className="w-full flex flex-row ">
                    <div className="w-1/2 px-3 mb-3">
                      <label className="text-xs font-semibold px-1">Tag</label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <Label />
                        </div>
                        <select
                          name="name"
                          id="name"
                          onChange={handleTagChange}
                          className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        >
                          <option
                            value="Now Showing"
                            selected={filteredData.tag == "Now Showing" && true}
                          >
                            Now Showing
                          </option>
                          <option
                            value="Upcoming"
                            selected={filteredData.tag == "Upcoming" && true}
                          >
                            Upcoming
                          </option>
                          <option
                            value="Exclusive"
                            selected={filteredData.tag == "Exclusive" && true}
                          >
                            Exclusive
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="w-1/2 px-3 mb-3">
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
                            className="xl:w-60 lg:w-60 w-40 text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="price"
                      className="text-xs font-semibold px-1"
                    >
                      Price
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <AttachMoney />
                      </div>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        value={filteredData.price}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="00.00"
                      />
                    </div>
                    {errorPrice.field === "price" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="discount"
                      className="text-xs font-semibold px-1"
                    >
                      Discount
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <ThumbUp />
                      </div>
                      <input
                        type="text"
                        name="discount"
                        id="discount"
                        value={`${filteredData.discount}`}
                        onChange={handleEventEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="00"
                      />
                    </div>
                    {errorDiscount.field === "discount" && (
                      <p className="text-xs text-red-600 mt-2">
                        {errorDiscount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
