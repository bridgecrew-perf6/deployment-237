import Logo from "./../../assets/images/logo.png";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { useLocation } from "react-router-dom";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import { useHistory } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dashboard from "./dashboard";
import Manage from "./manage";
import Category from "./category";
import Profile from "./password";
import {
  AccountBalance,
  Assignment,
  CategoryOutlined,
  Edit,
  ExitToApp,
  History,
  HistoryOutlined,
  Lock,
  PostAdd,
  Subscriptions,
  Theaters,
} from "@material-ui/icons";
import VendorList from "./vendorList";
import UserList from "./userList";
import Booking from "./booking";
import { Link } from "react-router-dom";
import Blog from "./blog";
import EditBlog from "./editBlog";
import Subscribers from "./subscribers";
import WithdrawalHistory from "./withdrawalHistory";
import EventHistory from "./eventHistroy";
import MovieHistory from "./movieHistory";
import ConcertHistory from "./concertHistory";
import Reports from "./reports";
import Excelreport from "./excel-report";
import { MenuItem, Select } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  bgWhite : {
    backgroundColor : "white",
    width : "100%",
  },
  appBar: {
    backgroundColor: "#001232",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    height: "100%",
    backgroundColor: "#f0f0f0",
    // backgroundImage: `url(${DashboardBG})`,
    backgroundSize: "cover",
    backgroundPosition: "bottom right",
    padding: theme.spacing(3),
    // backgroundPosition: "fixed",
  },
  alignright : {
    textAlign:"right",
  }
}));

function ResponsiveDrawer(props) {
  const history = useHistory();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isDelete, setIsDelete] = useState(false);
  const [eventsList , setEventList] = useState(JSON.parse(localStorage.getItem("events")));
  const [selectedEvent, setSelectedEvent ] = useState(localStorage.getItem("tenat_event") ? localStorage.getItem("tenat_event") : "all");
  const handleEventChange = (selectedEvent) => {
    localStorage.setItem("tenat_event",selectedEvent.target.value);
    setSelectedEvent(selectedEvent.target.value);
  }
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("isAdminAuth") === "true";

    // window["scrollTo"]({ top: 0, behavior: "smooth" });
    if (!isAdminAuth) {
      history.push({ pathname: "/login" });
      return false;
    }
  }, []);

  // const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [tab, setTab] = useState("Dashboard");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = (tab) => {
    switch (tab) {
      case "Dashboard":
        return <Dashboard userData={userData} tenat_event={selectedEvent} />;
      case "Password":
        return <Profile />;
      case "Withdrawal History":
        return <WithdrawalHistory />;
      case "Booking History":
        return <Booking tenat_event={selectedEvent}/>;
      case "Manage Vendor":
        return <VendorList />;
      case "Manage User":
        return <UserList />;
      case "Blog":
        return <EditBlog />;
      case "Subscribers":
        return <Subscribers />;
      case "Events":
        return <EventHistory />;
      // case "Movies":
      //   return <MovieHistory />;
      case "Concerts":
        return <ConcertHistory />;
      case "Category":
        return <Category />;
      case "Reports":
        return <Reports setEventList={setEventList} eventsList={eventsList}/>;
      case "excel-Reports":
        return <Excelreport />;
      default:
        return <div>Dashboard</div>;
    }
  };

  const logout = () => {
    window.localStorage.clear();
    localStorage.setItem("isAdminAuth", false);
    history.replace({
      ...location,
      state: undefined,
    });
    history.push({
      pathname: "/login",
    });
  };

  const drawer = (
    <div>
      <div className="flex justify-center mt-1">
        {/* <Link to="/"> */}
        <img src={Logo} alt="sd" className="h-20" />
        {/* </Link> */}
      </div>
      {/* <div className={classes.toolbar} /> */}
      {/* <Divider /> */}
      <List className="dashboard-sidebar">
        <ListItem
          button
          onClick={() => setTab("Dashboard")}
          selected={tab == "Dashboard"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <Divider />

        <ListItem
          button
          onClick={() => setTab("Manage Vendor")}
          selected={tab == "Manage Vendor"}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Vendor" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Manage User")}
          selected={tab == "Manage User"}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItem>

        {/* <ListItem
          button
          onClick={() => setTab("Blog")}
          selected={tab == "Blog"}
        >
          <ListItemIcon>
            <PostAdd />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItem> */}

        <ListItem
          button
          onClick={() => setTab("Blog")}
          selected={tab == "Blog"}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Withdrawal History")}
          selected={tab == "Withdrawal History"}
        >
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Withdrawal History" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Subscribers")}
          selected={tab == "Subscribers"}
        >
          <ListItemIcon>
            <Subscriptions />
          </ListItemIcon>
          <ListItemText primary="Subscribers" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Events")}
          selected={tab == "Events"}
        >
          <ListItemIcon>
            <Theaters />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Concerts")}
          selected={tab == "Concerts"}
        >
          <ListItemIcon>
            <Theaters />
          </ListItemIcon>
          <ListItemText primary="Concerts" />
        </ListItem>

        {/* <ListItem
          button
          onClick={() => setTab("Movies")}
          selected={tab == "Movies"}
        >
          <ListItemIcon>
            <Theaters />
          </ListItemIcon>
          <ListItemText primary="Movies" />
        </ListItem> */}

        <ListItem
          button
          onClick={() => setTab("Category")}
          selected={tab == "Category"}
        >
          <ListItemIcon>
            <CategoryOutlined />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Booking History")}
          selected={tab == "Booking History"}
        >
          <ListItemIcon>
            <HistoryOutlined />
          </ListItemIcon>
          <ListItemText primary="Booking History" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Reports")}
          selected={tab == "Reports"}
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("excel-Reports")}
          selected={tab == "excel-Reports"}
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Excel-Reports" />
        </ListItem>

        <ListItem
          button
          onClick={() => setTab("Password")}
          selected={tab == "Password"}
        >
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText primary="Password" />
        </ListItem>

        <ListItem button onClick={() => setIsDelete(true)}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
  const container =
    props.window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className="event-header">
        <Grid md="6" className="mobile-toggle">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {tab}
          </Typography>
        </Grid>
        <Grid md="6" className={classes.alignright}>
          <label htmlFor="email" className="text-xs font-semibold px-1">
            Select Event
          </label>
          <div className="select-all-events flex justify-end">
            <Select value={selectedEvent} className={classes.bgWhite} onChange={handleEventChange}>
            <MenuItem value={"all"}>
              All Events
            </MenuItem>
              {eventsList?.map(option => {
                  return (
                    <MenuItem key={option.id} value={option.id}>
                      {option.title ?? option.title}
                    </MenuItem>
                  );
              })}
            </Select>
          </div>
        </Grid>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {/* flexGrow: 1, height: "100vh", backgroundColor: "#F0F0F0", padding:
        theme.spacing(3), */}
        <div className={classes.toolbar} />
        {renderContent(tab)}
      </main>

      {isDelete && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full logout-confirmation">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Sure, you want to logout?
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2"
                  onClick={logout}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-80"
                  cancel
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

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
