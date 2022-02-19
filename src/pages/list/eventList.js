import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";
import Button from "../../components/button/button";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as API from "./../../api/api";
import * as C from "../../const";
import Select from "react-select";
import Banner from "../../components/banner/banner";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
const data = [
  {
    id: 1,
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
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [eventData, setEventData] = useState([data]);
  const [movieOptions, setMoviesOptions] = useState(null);
  const [banner, setBanner] = useState({ image: "" });
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    async function MoviesAPI() {
      try {
        const response = await API.event();
        const data = [];
        const options = [];
        response.data.map((item) => {
          const obj = { value: item.id, label: item.title };
          options.push(obj);
          data.push(item);
        });
        setBanner(data[data.length - 1]);
        setMoviesOptions(options);
        setEventData(data);
      } catch (e) { }
    }
    MoviesAPI();
  }, []);

  const handleChange = (selectedMovie) => {
    setSelectedMovie({ selectedMovie });
    history.push({ pathname: `/event/${selectedMovie.value}` });
  };
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4 event-listing-wrapper">
        <Breadcrumbs category="events" />
        <div className="xl:my-5 mt-5 lg:p-10 xl:p-10 p-5 item item-center text-white bg-innerBG rounded-xl event-listing">
          <div className="relative md:py-0 my-auto grid xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 md:gap-3 gap-5 overflow-hidden custom-small">

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
                    return item.amount;
                  })
                )
                : "0";

              return (
                <>
                  <div className="relative md:block event-xs-none" key={id}>
                    <div className="address flex sm:flex-col flex-col w-full rounded-xl justify-between event-listing-card">
                      <div className="w-full rounded-t-lg">
                        <img
                          src={src}
                          alt="thumb"
                          className="img-icon shadow-lg object-cover event-listing-img rounded-t-lg"
                        />
                      </div>
                      <div className="font-semibold event-date absolute text-white text-md top-0 left-3 text-center bg-secondary p-3 w-22 rounded-b-lg ">
                        <div className="text-gray-300">{date}</div>
                        <div className="flex flex-wrap items-center text-gray-300">
                          <div>{weekDay.substring(0, 3)}</div>
                          <div className="h-1 w-1 rounded-full bg-secondary xl:mx-1"></div>
                          <div>
                            {starting_time && starting_time.substring(0, 5)}
                          </div>
                        </div>
                      </div>
                      <div className="pt-5 divide-y divide-dashed divide-opacity-30 divide-gray-100">
                        <div className="event-place font-semibold title xl:h-16 h-12">
                          {title}
                        </div>
                        <div className="event-city font-light title">{address}</div>
                      </div>



                    </div>
                    <div class="flex xl:pt-5 xl:pb-8 pt-4 pb-5 xl:items-center	justify-between lg:flex-row flex-col">
                      <div className="my-auto  event-price  font-semibold mr-5">
                        $ {Number(min).toFixed(2)}{" "}
                        <span className=" font-normal	onwards">onwards</span>
                      </div>

                      <div className="event-ticket-btn">
                        <Link exact to={"/event/" + item.id}>
                          <Button>See Ticket</Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* FOR MOBILE */}
                  <div className="w-full 31.3rem mobile-events-posters bg-gradient-to-r from-primary to-secondary events-page-mobile">
                    <div
                      className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
                    >
                      <img src={src} alt="event-posters" />
                    </div>

                    <div className="-mt-2 h-1/4 rounded bg-gradient-to-r from-primary to-secondary w-full text-white p-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg event-card">
                      <div className="text-2xl pb-2 h-16">
                        <div className="text-xl leading-tight h-12 title overflow-hidden event-heading">
                          {title}
                        </div>
                        {/* <div className="text-sm">{artist}</div> */}
                      </div>
                      <div className="flex flex-row pt-2 card-address">
                        <div className="text-white title event-address">{address}</div>
                      </div>
                      <div className="flex event-timing-date">
                        <div className="text-white text-md top-0 left-3 text-center bg-secondary p-2 w-12 rounded-b-lg event-date">
                          {date}
                        </div>
                        <div className="flex flex-wrap items-center text-gray-300">
                          <div>{weekDay.substring(0, 3)}</div>
                          <div className="h-1 w-1 rounded-full bg-secondary xl:mx-1"></div>
                          <div>
                            {starting_time && starting_time.substring(0, 5)}
                          </div>
                        </div>
                      </div>

                    </div>

                    <div class="flex items-center w-full event-ticket-pricing">
                      <div className="event-price font-semibold w-2/4">
                        $ {Number(min).toFixed(2)}{" "}
                        <span className=" font-normal	onwards">onwards</span>
                      </div>

                      <div className="w-2/4 text-right" >
                        <Link exact to={"/event/" + item.id}>
                          <Button>See Ticket</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}


          </div>


          <div className="flex test-event-block grid xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 md:gap-3 gap-5">
            <div className="mb-2">
              <div className="md:text-left text-center">
                <div className="">
                  <div className="event-h3 font-semibold">{banner.title}</div>
                  <div class="pt-2 event-h5 font-semibold  sm:w-3/4">Grab great seats to "{banner.title}" now!</div>
                </div>
                <div class="md:pt-7 pt-5 w-full">
                  <Link exact to={"/event/" + banner.id}>
                    <button class="seeticket-btn-lg rounded-3xl border border-white  uppercase text-white uppercase rounded-full bg-gradient-to-r from-primary to-secondary py-2 py-2 lg:px-4 xl:px-4 md:px-8 px-4 lg:w-44 xl:w-44 w-auto text-sm">See Ticket</button>
                    {/* <Button><span class="see-ticket">See Ticket</span></Button> */}
                  </Link>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="filter-events">
              <div className="flex flex-wrap flex-col md:justify-start justify-center md:text-left text-center">
                <div className="event-h3 font-semibold mb-lg-5 mb-3">
                  All Events Near You
                </div>
                <div className="w-full event-input flex flex-wrap flex-col justify-between xl:mt-0 lg:mt-0 mt-2">
                  <div className=" w-full lg:mb-8 mb-5">
                    <div className="w-full">
                      <Select
                        value={selectedMovie}
                        onChange={handleChange}
                        options={movieOptions}
                        placeholder="Select Event"
                        className="event-select-input focus:outline-none border-0"
                        classNamePrefix="text-secondary bg-theme focus:outline-none react-select-container"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div
                      className="w-full rounded border-gray-300"
                      htmlFor="date"
                    >
                      <DatePicker
                        id="date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className=" w-full border rounded bg-theme px-2 py-1 pr-20 text-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
