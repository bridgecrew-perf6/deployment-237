import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";
import Button from "../../components/button/button";
import * as API from "./../../api/api";
import * as C from "../../const";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";
import Select from "react-select";
import Banner from "../../components/banner/banner";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const data = [
  {
    id: "",
    title: "",
    date: "",
    day: "",
    time: "",
    desc: "",
    status: true,
    img: "",
  },
];

const initialBook = {
  id: "",
  title: "",
  time: "",
  date: "",
  userData: "",
};

export default function List() {
  const history = useHistory();
  const location = useLocation();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [eventData, setEventData] = useState(data);
  const [movieOptions, setMoviesOptions] = useState(null);
  const [book, setBook] = useState(false);
  const [movieId, setMovieId] = useState(initialBook);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [adultCount, setAdultCount] = useState(1);
  const [isUser, setIsUser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [banner, setBanner] = useState({ image: "" });
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    async function MoviesAPI() {
      try {
        const response = await API.concert();
        const data = [];
        const options = [];
        response.data.map((item) => {
          const obj = { value: item.id, label: item.title };
          options.push(obj);
          data.push(item);
        });
        console.log(data, response);
        setBanner(data[data.length - 1]);
        setMoviesOptions(options);
        setEventData(data);
      } catch (e) {}
    }
    MoviesAPI();
  }, []);

  const handleChange = (selectedMovie) => {
    setSelectedMovie({ selectedMovie });
    history.push({ pathname: `/concert/${selectedMovie.value}` });
  };

  const handleBooking = (id, title, time, date, src, selling_price) => {
    if (userData) {
      if (userData.role == 1) {
        setBook(true);
        const data = {
          id: id,
          title: title,
          time: time,
          date: date,
          src: src,
          userData: userData,
          price: selling_price,
        };
        setMovieId(data);
      } else {
        setIsVendor(true);
      }
    } else {
      setIsUser(true);
    }
  };

  const handleBook = async () => {
    try {
      const requestObj = {
        user_id: userData.id,
        booking_type: "Movie",
        item_id: movieId.id,
        item_quantity: adultCount,
      };
      const res = await API.book_now(requestObj);
      if (res.status == "200") {
        setBook(false);
      }
    } catch (e) {}
  };

  const logout = () => {
    window.localStorage.clear();
    localStorage.setItem("isVendorAuth", false);
    history.replace({
      ...location,
      state: undefined,
    });
    history.push({
      pathname: "/login",
    });
  };
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4 concert-list-page-wrapper">
        <Breadcrumbs category="concerts" />
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl concerts-page-wrapper">
        {banner ? <><div className="relative overflow-hidden single-blog-img-block">
          {banner.image && <><img
              src={C.URL + "/" + banner.image}
              alt="banner"
              className="w-full blur h-auto mx-auto object-fill single-blog-bg-img"
            />
            <img
              src={C.URL + "/" + banner.image}
              alt="banner"
              className="w-10/12 absolute imageBlur h-auto mx-auto object-contain single-blog-img"
              /></>}
          </div>
          <div className="mb-2 event-detail">
            <div className="flex flex-wrap py-5 justify-between">
              <div className="w-3/4">
                <div className="text-xl font-semibold mb-2">{banner.title}</div>
                <div>Grab great seats to "{banner.title}" now!</div>
              </div>
              <div className="event-detail-btn w-1/4 text-right">
                <Link exact to={"/concert/" + banner.id}>
                  <Button>See Ticket</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="md:mt-8 mt-4 all-events-filter">
            <div className="flex flex-wrap">
              <div className="w-full md:w-2/5 xl:w-2/5 text-xl font-semibold">
                All Events Near You
              </div>
              <div className="w-full md:w-3/5 xl:w-3/5 flex flex-wrap justify-between xl:mt-0 lg:mt-0 mt-2">
                <div className="md:w-1/2 xl:w-1/2 w-full md:px-1 md:mb-0 mb-4">
                  <div className="w-full">
                    <Select
                      value={selectedMovie}
                      onChange={handleChange}
                      options={movieOptions}
                      placeholder="Select Concerts"
                      className="event-select-input focus:outline-none border-0"
                      classNamePrefix="text-secondary bg-theme focus:outline-none react-select-container"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 xl:w-1/2 w-full md:px-1">
                  <div
                    className="w-full bg-theme rounded border-gray-300"
                    htmlFor="date"
                  >
                    <DatePicker
                      id="date"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="w-full border rounded bg-theme px-2 py-1 text-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            </div></> : <div className="text-center">No Concerts</div>}

          {/* Lists */}
          <div className="search-event-list">
            {eventData.map((item) => {
              const src = C.URL + "/" + item.image;
              const month = dateFormat(item.date, "mmmm");
              const day = dateFormat(item.date, "dS");
              const date = day + " " + month.substring(0, 3);

              const weekDay = dateFormat(item.date, "dddd");
              const { id, title, starting_time, is_active, address, price } =
                item;

              const priceList = price && JSON.parse(price);

              const min = price
                ? Math.min.apply(
                    null,
                    priceList.map(function (item) {
                      return item.selling_price;
                    })
                  )
                : "0";

              return (
                <>
                  <div className="search-events lg:mt-5 md:mt-4 mt-3 md:block hidden" key={id}>
                    <div className="flex lg:flex-wrap search-event-box search-event-bg items-center lg:p-4 md:p-3 p-0 rounded-xl justify-between">
                      <div className="lg:w-28 xl:w-1/12 xl:p-0 lg:p-0 lg:pb-5 search-event-img">
                        <div className="flex items-center xl:justify-start lg:justify-start justify-center">
                          <img
                            src={src}
                            alt="thumb"
                            className="lg:w-24 xl:w-24 rounded-lg w-40 h-56 lg:h-32 xl:h-32 shadow-lg object-cover"
                          />
                        </div>
                      </div>
                      <div className="lg:w-32 xl:w-1/6 lg:p-2 p-0 search-event-date">
                        <div className="font-semibold lg:text-sm xl:text-sm text-xs search-event-date-block">
                          <div className="text-white">{date}</div>
                          <div className="flex flex-wrap items-center">
                            <div>{weekDay.substring(0, 3)}</div>
                            <div className="h-1 w-1 rounded-full bg-white mx-2 "></div>
                            <div>
                              {starting_time && starting_time.substring(0, 5)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-1/3 xl:w-2/5 p-2 search-event-title">
                        <div className="flex flex-col">
                          <div className="lg:text-xl xl:text-xl text-base font-semibold search-event-heading">
                          {title}
                          </div>
                          <div className="font-light search-event-address">{address}</div>
                        </div>
                      </div>
                      <div className="lg:w-32 xl:w-40 p-1 search-event-switch">
                        <div className="my-auto md:text-right">
                          $ {Number(min).toFixed(2)}{" "}
                          <span className="text-xs">onwards</span>
                        </div>
                      </div>
                      <div className="lg:w-1/6 xl:w-1/6 p-1 search-event-btn">
                        <div className="">
                          <Link exact to={"/concert/" + item.id}>
                            <Button
                            // onClick={() =>
                            //   handleBooking(
                            //     id,
                            //     title,
                            //     time,
                            //     date,
                            //     src,
                            //     selling_price
                            //   )
                            // }
                            >
                              See Tickets
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Mobile Concerts */}
                  <div className="w-full 31.3rem mobile-events-posters bg-gradient-to-r from-primary to-secondary events-page-mobile p-3">
                          <div
                            className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
                          >
                            <img src={src} alt="event-posters" />
                          </div>
                          <div className="rounded bg-gradient-to-r from-primary to-secondary w-full text-white py-5 pl-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg event-card">
                            <div className="text-2xl pb-2 h-16">
                              <div className="text-xl leading-tight h-12 title overflow-hidden event-heading">
                                {item.title}
                              </div>
                            </div>
                            <div className="flex flex-row pt-2 card-address">
                              <div className="text-white title event-address">{address}</div>
                            </div>
                            <div className="flex event-timing-date flex flex-col py-2">
                              <div className="text-white">{date}</div>
                              <div className="text-white text-md top-0 left-3 text-center bg-secondary rounded-b-lg event-date flex items-center">
                                <div>{weekDay.substring(0, 3)}</div>
                                <div className="h-1 w-1 rounded-full bg-white mx-2"></div>
                                <div>
                                {starting_time && starting_time.substring(0, 5)}
                                </div>
                              </div>
                            </div>

                          </div>
                          <div class="flex items-center w-full event-ticket-pricing">
                            <div className="event-price w-2/4">
                              <div className="my-auto md:text-right">
                                $ {Number(min).toFixed(2)}{" "}
                                <span className="text-xs">onwards</span>
                              </div>
                            </div>

                            <div className="w-2/4 text-right" >
                              <Link exact to={"/concert/" + item.id}>
                                <Button>See Ticket</Button>
                              </Link>
                            </div>
                          </div>
                  </div>
                </>
              );
            })}
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
              <div className="bg-white xl:px-4 lg:px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* <div className=""> */}
                <div className="flex justify-center mt-2 mb-4">
                  <img
                    src={movieId.src}
                    alt={movieId.title}
                    className="object-cover w-48 h-72 rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left xl:px-20 lg:px-20 px-4">
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Concert Tile </div>
                    <div className="font-medium text-primary">
                      {movieId.title}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Concert Date </div>
                    <div className="font-medium text-primary">
                      {movieId.date}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Concert Time </div>
                    <div className="font-medium text-primary">
                      {/* {movieId.starting_time && movieId.starting_time.substring(0, 5)} */}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Concert Price </div>
                    <div className="font-medium text-primary">
                      $ {movieId.price} x {adultCount} = ${" "}
                      {Number(
                        Number(movieId.price) * Number(adultCount)
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Name </div>
                    <div className="font-medium text-primary capitalize">
                      {movieId.userData.first_name} {movieId.userData.last_name}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Phone Number </div>
                    <div className="font-medium text-primary">
                      {movieId.userData.number}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Quantity </div>

                    <ButtonGroup
                      size="small"
                      aria-label="small outline-none button group"
                      className="bg-white"
                    >
                      {/* {displayCounter && ( */}
                      <button
                        className="bg-gradient-to-r from-primary to-secondary
       py-1 px-2 w-auto text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                        onClick={() => {
                          if (adultCount > 1) {
                            setAdultCount(adultCount - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <button disabled>
                        <div className="font-medium text-primary">
                          {adultCount}
                        </div>
                      </button>

                      <button
                        className="bg-gradient-to-r from-primary to-secondary
       py-1 px-2 w-auto text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                        onClick={() => {
                          setAdultCount(adultCount + 1);
                        }}
                      >
                        +
                      </button>
                    </ButtonGroup>
                  </div>
                </div>
                {/* </div> */}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={handleBook}>Book Now</Button>

                <Button
                  cancel
                  onClick={() => {
                    setBook(false);
                    setAdultCount(1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUser && (
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
                      Please sign-in before booking :)
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link to="/login">
                  <button
                    type="button"
                    className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2"
                  >
                    Login
                  </button>
                </Link>
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-80"
                  cancel
                  onClick={() => setIsUser(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVendor && (
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
                      Please sign in as User
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link to="/login">
                  <button
                    type="button"
                    className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </Link>
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-80"
                  cancel
                  onClick={() => setIsVendor(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
