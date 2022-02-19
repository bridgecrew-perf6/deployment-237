import Logo from "./../../assets/images/logo.png";
import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";

import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dashboard from "./dashboard";
import Manage from "./manage";
import Profile from "./password";
import {
  AccountBalance,
  History,
  HistoryOutlined,
  Lock,
} from "@material-ui/icons";
import Transaction from "./transaction";
import Booking from "./booking";
import { Link } from "react-router-dom";

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
    height: "100vh",
    backgroundColor: "#f0f0f0",
    backgroundSize: "cover",
    backgroundPosition: "bottom right",
    padding: theme.spacing(3),
    // backgroundPosition: "fixed",
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
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
        return <Dashboard />;
      case "Password":
        return <Profile />;
      case "Transaction":
        return <Transaction />;
      case "Booking History":
        return <Booking />;
      case "Manage":
        return <Manage />;
      default:
        return <div>Dashboard</div>;
    }
  };

  const drawer = (
    <div>
      <div className="flex justify-center mt-1">
        <Link to="/">
          <img src={Logo} alt="sd" className="h-20" />
        </Link>
      </div>
      {/* <div className={classes.toolbar} /> */}
      {/* <Divider /> */}
      <List>
        <ListItem button onClick={() => setTab("Dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <Divider />

        <ListItem button onClick={() => setTab("Manage")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage" />
        </ListItem>

        <ListItem button onClick={() => setTab("Transaction")}>
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Transaction" />
        </ListItem>

        <ListItem button onClick={() => setTab("Booking History")}>
          <ListItemIcon>
            <HistoryOutlined />
          </ListItemIcon>
          <ListItemText primary="Booking History" />
        </ListItem>

        <ListItem button onClick={() => setTab("Password")}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText primary="Password" />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
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
