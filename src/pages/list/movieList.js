import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";
import JokerBanner from "./../../assets/images/jokerBanner.png";
import WonderBanner from "./../../assets/images/wonderBanner.png";
import DeadpoolBanner from "./../../assets/images/deadpoolBanner.png";
import WolverineBanner from "./../../assets/images/wolverineBanner.png";
import BatmanBanner from "./../../assets/images/batmanBanner.png";
import SupermanBanner from "./../../assets/images/supermanBanner.png";
import SpiderBanner from "./../../assets/images/spiderBanner.png";
import ThorBanner from "./../../assets/images/thorBanner.png";
import CaptainBanner from "./../../assets/images/captainBanner.png";
import Button from "../../components/button/button";
import * as API from "./../../api/api";
import * as C from "../../const";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";
import Select from "react-select";
import Banner from "../../components/banner/banner";
import { Link } from "react-router-dom";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

const data = [
  {
    id: 1,
    title: "Joker",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: JokerBanner,
  },
  {
    id: 2,
    title: "Wonder Women",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: false,
    img: WonderBanner,
  },
  {
    id: 3,
    title: "Deadpool",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: DeadpoolBanner,
  },
  {
    id: 4,
    title: "Wolverine",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: WolverineBanner,
  },
  {
    id: 5,
    title: "The Dark Knight Rises",
    date: "20 July",
    day: "Tue",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: BatmanBanner,
  },
  {
    id: 6,
    title: "Man of Steel",
    date: "14 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: SupermanBanner,
  },
  {
    id: 7,
    title: "Spiderman Homecoming",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: SpiderBanner,
  },
  {
    id: 8,
    title: "Captain America: The First Avenger",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: false,
    img: CaptainBanner,
  },
  {
    id: 9,
    title: "Thor: The Dark World",
    date: "12 Jun",
    day: "Fri",
    time: "8:00pm",
    desc: "description",
    status: true,
    img: ThorBanner,
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
  const [movieData, setMovieData] = useState(data);
  const [movieOptions, setMoviesOptions] = useState(null);
  const [book, setBook] = useState(false);
  const [movieId, setMovieId] = useState(initialBook);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [adultCount, setAdultCount] = useState(1);
  const [isUser, setIsUser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  useEffect(() => {
    async function MoviesAPI() {
      try {
        const response = await API.movies();
        const data = [];
        const options = [];
        response.data.map((item) => {
          const obj = { value: item.id, label: item.title };
          options.push(obj);
          data.push(item);
        });
        setMoviesOptions(options);
        setMovieData(data);
      } catch (e) {}
    }
    MoviesAPI();
  }, []);

  const handleChange = (selectedMovie) => {
    setSelectedMovie({ selectedMovie });
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
  return (
    <>
      <Banner />
      <div className="pt-10 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        <Breadcrumbs category="Movies" />

        <div className="my-5 lg:p-10 xl:p-10 p-2 text-white bg-innerBG rounded-xl">
          <div className="mb-2">
            <img
              src={JokerBanner}
              alt="banner"
              className="w-full lg:h-31.3rem xl:h-31.3rem h-auto rounded-xl object-cover"
            />
            <div className="flex flex-wrap py-4 justify-between">
              <div className="">
                <div className="text-xl font-semibold">Impractical Jokers</div>
                <div>Grab great seats to "The Scoopski Potatoes Tour" now!</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8">
            <div className="flex flex-wrap">
              <div className="w-full xl:w-1/2 text-xl font-semibold">
                All Movies Near You
              </div>
              <div className="w-full xl:w-1/2 flex flex-wrap justify-between xl:mt-0 lg:mt-0 mt-2">
                <div className="lg:w-1/2 xl:w-1/2 w-1/2 px-1">
                  <div className="w-full">
                    <Select
                      value={selectedMovie}
                      onChange={handleChange}
                      options={movieOptions}
                      placeholder="Select Event"
                      className="focus:outline-none border-0"
                      classNamePrefix="text-secondary bg-theme focus:outline-none react-select-container"
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 xl:w-1/2 w-1/2 px-1">
                  <div
                    className="w-full bg-theme rounded border-gray-300"
                    htmlFor="date"
                  >
                    <DatePicker
                      id="date"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className=" w-40 xl:w-72 lg:w-72 border rounded bg-theme px-2 py-1 text-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {movieData.map((item) => {
            const src = C.URL + "/" + item.image;
            const month = dateFormat(item.date, "mmmm");
            const day = dateFormat(item.date, "dS");
            const date = day + " " + month.substring(0, 3);
            const weekDay = dateFormat(item.date, "dddd");
            const { id, title, time, is_active, selling_price } = item;
            return (
              <div className="mt-8" key={id}>
                <div className="flex flex-wrap hover:bg-theme items-center  p-2 rounded-xl">
                  <div className="lg:w-28 xl:w-1/12 w-full xl:p-0 lg:p-0 pb-5">
                    <div className="flex items-center xl:justify-start lg:justify-start justify-center">
                      <img
                        src={src}
                        alt="thumb"
                        className="lg:w-24 xl:w-24 rounded-lg w-40 h-56 lg:h-32 xl:h-32 shadow-lg object-cover"
                      />
                    </div>
                  </div>
                  <div className="lg:w-1/6 xl:w-1/6 w-1/2 lg:p-2 p-0 ">
                    <div className="font-semibold lg:text-sm xl:text-sm text-xs ">
                      <div className="text-secondary">{date}</div>
                      <div className="flex flex-wrap items-center">
                        <div>{weekDay.substring(0, 3)}</div>
                        <div className="h-1 w-1 rounded-full bg-secondary mx-2 "></div>
                        <div>{time}</div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/5 xl:w-1/2 w-3/4 p-2">
                    <div className="lg:text-xl xl:text-xl text-base font-semibold">
                      {title}
                    </div>
                    {/* <div className="font-light">{desc}</div> */}
                  </div>

                  <div className="lg:w-12 xl:w-1/12 w-1/2 p-1">
                    <div className="">
                      {is_active ? (
                        <div className="bg-green-500 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                        </div>
                      ) : (
                        <div className="bg-red-600 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:w-1/6 xl:w-1/6 w-1/2 p-1">
                    <div className="">
                      <Button
                        onClick={() =>
                          handleBooking(
                            id,
                            title,
                            time,
                            date,
                            src,
                            selling_price
                          )
                        }
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                    <div>Movie Tile </div>
                    <div className="font-medium text-primary">
                      {movieId.title}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Movie Date </div>
                    <div className="font-medium text-primary">
                      {movieId.date}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Movie Time </div>
                    <div className="font-medium text-primary">
                      {movieId.time}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div>Movie Price </div>
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
