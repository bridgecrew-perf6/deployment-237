import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
//import BGHome from "./assets/images/bgHome.jpeg";
import Footer from "./pages/footer/footer";
import Header from "./pages/header/header";
import HeroBlock from "./pages/heroBlock/heroBlock";
import Concerts from "./pages/concerts/concerts";
import Events from "./pages/events/events";
import MyTicket from "./pages/ticket/ticket";
import EventLists from "./pages/list/eventList";
import ConcertLists from "./pages/list/concertList";
import Blog from "./pages/blog/blog";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import VendorRegistration from "./pages/vendor/registration";
import VendorLogin from "./pages/vendor/login";
import Checkout from "./pages/checkout/index";
import Dashboard from "./pages/vendorDashboard";
import AdminDashboard from "./pages/adminDshboard";
import ForgotPassword from "./pages/login/forgotPassword";
// import Profile from "./pages/profile";
import Profile from "./pages/userDashboard";
import SingleBlog from "./pages/list/singleBlog";
import SingleEvent from "./pages/list/singleEvent";
import SingleConcert from "./pages/list/singleConcert";
import ContactUs from "./pages/contactUs/contactUs";
import ResetPassword from "./pages/ResetPassword/resetPassword";
import PrivacyPolicy from "./pages/static/privacyPolicy";
import List from "./pages/list/list";
import FAQ from "./pages/static/FAQ";
import AboutUs from "./pages/static/about";
import TermsOfUse from "./pages/static/termOfUse";
import Payment from "./pages/payment/payment";
import Offers from "./pages/list/offer";
import Seats from "./pages/Seats/seats";
import TicketScannerDashboard from './pages/ticketScannerDashboard';
function App() {
  const isUserAuth = localStorage.getItem("isUserAuth") === "true";
  // const isVendorAuth = localStorage.getItem("isVendorAuth");
  return (
    <Router>
      <div
        className="bg-contain bg-repeat"
        style={{ background: "rgb(18,18,18)" }}
      >
        <Switch>
          <Route exact path="/">
            <Header />
            <HeroBlock />
            {/* <Movies /> */}
            <Events />
            <Concerts />
            {/* <MostVisited /> */}
            {/* <Blogs /> */}
            <Footer />
          </Route>
          {/* <Route path="/movies">
            <Header />
            <MovieLists />
            <Footer />
          </Route> */}

          <Route path="/search">
            <Header />
            <List />
            <Footer />
          </Route>

          <Route path="/offers">
            <Header />
            <Offers />
            <Footer />
          </Route>

          <Route path="/concerts">
            <Header />
            <ConcertLists />
            <Footer />
          </Route>
          <Route exact path="/events">
            <Header />
            <EventLists />
            <Footer />
          </Route>
          <Route exact path="/blog">
            <Header />
            <Blog />
            <Footer />
          </Route>
          <Route path="/blog/:id">
            <Header />
            <SingleBlog />
            <Footer />
          </Route>
          <Route path="/event/:id">
            <Header />
            <SingleEvent />
            <Footer />
          </Route>
          <Route path="/concert/:id">
            <Header />
            <SingleConcert />
            <Footer />
          </Route>
          <Route path="/ticket/:id">
            <MyTicket />
          </Route>

          <Route path="/forgotPassword">
            <Header />
            <ForgotPassword />
            <Footer />
          </Route>
          <Route path="/register">
            <Header />
            <Register />
            <Footer />
          </Route>
          <Route path="/seats">
            <Header />
            <Seats />
            <Footer />
          </Route>
          <Route path="/contact-us">
            <Header />
            <ContactUs />
            <Footer />
          </Route>
          <Route path="/vendor-register">
            <Header />
            <VendorRegistration />
            <Footer />
          </Route>
          <Route path="/vendor-login">
            <Header />
            <VendorLogin />
            <Footer />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
            <Footer />
          </Route>
          <Route path="/login">
            <Header />
            <Login />
            <Footer />
          </Route>
          <Route path="/forgot-password">
            <Header />
            <ResetPassword />
            <Footer />
          </Route>
          <Route exact path="/profile">
            {/* <Header /> */}
            <Profile />
            {/* <Footer /> */}
          </Route>
          <Route exact path="/privacy-policy">
            <Header />
            <PrivacyPolicy />
            <Footer />
          </Route>
          <Route exact path="/about-us">
            <Header />
            <AboutUs />
            <Footer />
          </Route>
          <Route exact path="/terms-of-use">
            <Header />
            <TermsOfUse />
            <Footer />
          </Route>
          <Route exact path="/faqs">
            <Header />
            <FAQ />
            <Footer />
          </Route>
          <Route exact path="/payment">
            <Header />
            <Payment />
            <Footer />
          </Route>
          <Route
            exact
            path="/login"
            render={() => {
              console.log("User : " + isUserAuth);
              return isUserAuth ? (
                <Redirect to="/profile" />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />

          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/ts-dashboard" component={TicketScannerDashboard} />
        </Switch>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
