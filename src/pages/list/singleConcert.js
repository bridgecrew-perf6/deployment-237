import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useParams } from "react-router-dom";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import "react-datepicker/dist/react-datepicker.css";
import * as API from "./../../api/api";
import * as C from "./../../const";
import dateFormat from "dateformat";
import Banner from "../../components/banner/banner";
import Button from "../../components/button/button";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import ArtistImage from "../../assets/images/artist.png";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import ShowMore from "react-show-more";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import {
  BusinessCenter,
  CalendarToday,
  Call,
  Group,
  Person,
  Theaters,
  WatchLater,
  ConfirmationNumber,
} from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const initialBlog = {
  title: "",
  image: "",
  description: "",
};
const initialBook = {
  id: "",
  title: "",
  time: "",
  date: "",
  userData: "",
};
export default function SingleBlog(props) {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [blog, setBlog] = useState(initialBlog);
  const [book, setBook] = useState(false);
  const [movieId, setMovieId] = useState(initialBook);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [adultCount, setAdultCount] = useState(1);
  const [isUser, setIsUser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [isExpired, setIsExpired] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [successCoupon, setSuccessCoupon] = useState(false);
  const [failCoupon, setFailCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    async function blog() {
      try {
        const response = await API.single_concert(id);
        setBlog(response.data);
        setPackageData(JSON.parse(response.data.price));
      } catch (e) {}
    }
    blog();
  }, [id]);

  const src = C.URL + "/" + blog.image;
  const artistSrc = C.URL + "/" + blog.artist_image;

  const handleBook = async () => {
    try {
      const requestObj = {
        user_id: userData.id,
        booking_type: "Concert",
        item_id: movieId.id,
        item_quantity: adultCount,
        item_discount: movieId.item_discount,
        item_price: movieId.item_price,
        item_sell_price: movieId.item_sell_price,
        package: movieId.package,
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

  const total = Number(movieId.item_sell_price) * Number(adultCount) - discount;

  const data = {
    user_id: userData ? userData.id : "",
    ticket_name: blog.title,
    booking_type: "Concert",
    item_id: movieId.id,
    item_quantity: adultCount,
    item_discount: movieId.item_discount,
    item_price: movieId.item_price,
    item_sell_price: movieId.item_sell_price,
    package: movieId.package,
    coupon: coupon,
    total: total,
  };

  const handlePackageBooking = () => {
    const {
      id,
      title,
      starting_time,
      date,
      event_key,
      workspaceKey,
      secret_key,
      image,
    } = blog;

    const today = new Date();
    const eventTime = starting_time.substring(0, 5);
    const eventDate = new Date(date);
    const eventDateTime = new Date(
      dateFormat(eventDate, `dddd mmmm dd, yyyy ${eventTime}`)
    );
    if (today > eventDateTime) {
      setIsExpired(true);
    }
    // else if (userData) {
    //   if (userData.role == 1) {
    //     // setBook(true);
    //     const data = {
    //       id: id,
    //       title: title,
    //       time: starting_time,
    //       date: date,
    //       src: src,
    //       booking_type: "Concert",
    //       userData: userData,
    //       packageData: packageData,
    //       // item_price: props.amount,
    //       // item_discount: props.discount ? props.discount : "0",
    //       // item_sell_price: props.selling_price,
    //       // package: props.package_name,
    //       // total: props.selling_price,
    //       event_key: event_key,
    //       tax: blog.tax,
    //       workspaceKey: workspaceKey,
    //       secret_key: secret_key,
    //       image: image,
    //     };
    //     history.push({ pathname: "/seats", state: { data: data } });
    //     setMovieId(data);
    //   } else {
    //     setIsVendor(true);
    //   }
    // }
    else {
      const data = {
        id: id,
        title: title,
        time: starting_time,
        date: date,
        src: src,
        booking_type: "Event",
        userData: (userData && userData.role == 1) ? userData : null,
        packageData: packageData,
        event_key: event_key,
        workspaceKey: workspaceKey,
        secret_key: secret_key,
        tax: blog.tax,
        image: image,
      };
      history.push({ pathname: "/seats", state: { data: data } });
      setMovieId(data);
      // setIsUser(true);
    }
  };

  const ValidateCoupon = async () => {
    try {
      const response = await API.validate_coupon(`${coupon}/${id}`);
      if (response.status == 200) {
        setSuccessCoupon(true);
        setDiscount(response.data.data.discount_amount);
      }
      if (response.status == 404) {
        setFailCoupon(true);
      }
    } catch (e) {}
  };

  const min = packageData
    ? Math.min.apply(
        null,
        packageData.map(function (item) {
          return item.selling_price;
        })
      )
    : "0";

  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        <Breadcrumbs title={blog.title} category="concerts" />
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl">
          <div className="mb-2 w-full">
            <div className="relative overflow-hidden single-blog-img-block">
              <img
                src={src}
                alt="banner"
                className="w-full blur h-auto mx-auto object-fill single-blog-bg-img"
              />
              <img
                src={src}
                alt="banner"
                className="w-10/12 absolute imageBlur h-auto mx-auto object-contain single-blog-img"
              />
            </div>
            <div className="">
              <div className="">
                <div className="flex w-full flex-col flex-wrap my-3">
                  <div className="text-xl font-bold mb-2">{blog.title}</div>
                  <div className="text-md font-light single-concert-address">
                    <span className="font-semibold mr-2">{blog.address}</span> |{" "}
                    <span className="font-semibold mx-2">
                      {dateFormat(blog.date, "fullDate")}
                      <span className="font-normal mx-2">at</span>
                      {blog.starting_time && blog.starting_time.substring(0, 5)}
                      <span className="font-normal mx-2">onwards</span>|{" "}
                      <span className="font-semibold mx-2">
                        {blog.total_tickets}{" "}
                        {blog.total_tickets > 1 ? "tickets" : "ticket"}{" "}
                        remaining
                      </span>
                    </span>
                  </div>
                </div>
                <hr />
                <div className="flex flex-row flex-wrap justify-between md:divide-x-2 xl:divide-x-2 xl:divide-gray-200 lg:divide-gray-200 divide-opacity-50">
                  <div className="text-lg font-light mt-2 md:w-1/2 lg:w-3/5 xl:w-3/4 w-full single-concert-description">
                    <ShowMore lines={3} more="More" less="Less" anchorClass="">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.about,
                        }}
                      ></div>
                    </ShowMore>
                  </div>
                  <div className="text-lg font-light md:w-1/2 lg:w-2/5 xl:w-1/4 w-full mobile-hr">
                    {packageData.map((item) => {
                      return (
                        <div
                          className="md:px-2 flex flex-row justify-between flex flex-row md:my-3 mt-3 single-concerts-booking"
                          // style={{ width: "22rem" }}
                        >
                          <div className="w-full my-auto flex flex-col justify-between single-concerts-pricing">
                            {/* <div className="text-sm">{item.package_name}</div> */}
                            <div className="text-md text-gray-200">
                              $ {Number(min).toFixed(2)} onwards
                            </div>
                          </div>
                          <div className="my-auto book-now-btn">
                            <button
                              className="ml-3 bg-gradient-to-r from-primary to-secondary
                              py-2 lg:px-2 xl:px-2 px-8 w-40 text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                              onClick={() => handlePackageBooking()}
                            >
                              <span className="text-xs">Book Now</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* <hr /> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: blog.description,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-row flex-wrap">
          <div className="xl:w-1/4 lg:w-1/3 w-full flex lg:flex-col md:flex-row xl:gap-5 lg:gap-5 gap-5 single-concerts-filter lg:mb-0 mb-5">
            <div className="w-full p-3 sm:p-5 lg:p-5 xl:p-5 text-white bg-innerBG rounded-xl">
              <div className="text-lg font-semibold artist-share-heading">Artist</div>
              <div className="flex flex-row lg:justify-center items-center mt-5">
                <div className="flex-shrink-0">
                  <img
                    src={blog.artist_image ? artistSrc : ArtistImage}
                    alt="Artist"
                    className="rounded-full lg:w-20 lg:h-20 w-24 h-24 sm:w-16 sm:h-16 artist-share-image"
                  />
                </div>
                <div className="my-auto text-lg sm:ps-0 pl-3 flex-grow">{blog.artist}</div>
              </div>
            </div>
            <div className="w-full p-3 sm:p-5 lg:p-5 xl:p-5 text-white bg-innerBG rounded-xl">
              <div className="text-lg font-semibold sm:mb-3 mb-2 artist-share-heading">Share this event</div>
              <div className="flex flex-row gap-5 mt-2">
                <div>
                  <FacebookShareButton
                    url={window.location.href}
                    quote={
                      blog.title +
                      " - Concert Ticket - " +
                      blog.address +
                      " - Event Mania"
                    }
                    className="focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </FacebookShareButton>
                </div>
                <div>
                  <TwitterShareButton
                    url={window.location.href}
                    quote={
                      blog.title +
                      " - Concert Ticket - " +
                      blog.address +
                      " - Event Mania"
                    }
                    className="focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-3/4 lg:w-2/3 w-full lg:pl-5 xl:pl-5 text-white">
            <div className="bg-innerBG rounded-xl p-3 ">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    Terms and Condition
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-innerBG text-white">
                  <Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blog.terms,
                      }}
                      className="list-disc"
                    ></div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>
                    Disclaimer
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="bg-innerBG text-white">
                  <Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: blog.disclaimer,
                      }}
                    ></div>
                  </Typography>
                </AccordionDetails>
              </Accordion>
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
                      <Theaters /> {movieId.title}
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
                      <ConfirmationNumber /> Concert
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
                      <Person /> {movieId.userData.first_name}{" "}
                      {movieId.userData.last_name}
                    </div>
                    <div className="font-medium text-innerBG">
                      <Call /> {movieId.userData.number}
                    </div>
                  </div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  ></div>

                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div
                      className="text-md flex flex-row justify-between leading-6 font-light text-gray-900"
                      id="modal-title"
                    >
                      <div className="font-medium text-innerBG capitalize">
                        <Group /> Number of persons
                      </div>
                    </div>

                    <ButtonGroup
                      size="small"
                      aria-label="small outline-none button group"
                      className="bg-white my-auto"
                    >
                      {/* {displayCounter && ( */}
                      <button
                        className="bg-gradient-to-r from-primary to-secondary
       h-7 px-2 w-auto text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                        onClick={() => {
                          if (adultCount > 1) {
                            setAdultCount(adultCount - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <button disabled>
                        <div className="font-medium text-innerBG">
                          {adultCount}
                        </div>
                      </button>

                      <button
                        className="bg-gradient-to-r from-primary to-secondary
       h-7 px-2 w-auto text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                        onClick={() => {
                          setAdultCount(adultCount + 1);
                        }}
                      >
                        +
                      </button>
                    </ButtonGroup>
                  </div>
                  <div
                    className="text-md flex flex-row justify-between leading-6 font-light my-2 text-gray-900"
                    id="modal-title"
                  >
                    <div className="font-medium text-innerBG capitalize">
                      Price
                    </div>
                    <div className="font-medium text-innerBG text-right">
                      $ {movieId.item_sell_price} x {adultCount} person(s) = ${" "}
                      {Number(
                        Number(movieId.item_sell_price) * Number(adultCount)
                      ).toFixed(2)}
                    </div>
                  </div>
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
                    {/* <div className="font-medium text-innerBG capitalize">
                          Coupon Code
                        </div> */}
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
                  {/* </div> */}
                </div>

                {/* </div> */}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link to={{ pathname: "/payment", state: { data: data } }}>
                  <Button>Book Now</Button>
                </Link>

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

      {isExpired && (
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
                Opps! <span className="font-semibold">{blog.title}</span>{" "}
                concert is expired.
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link to="/concerts">
                  <Button>Back to concerts</Button>
                </Link>

                <Button
                  cancel
                  onClick={() => {
                    setIsExpired(false);
                  }}
                >
                  Cancel
                </Button>
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
