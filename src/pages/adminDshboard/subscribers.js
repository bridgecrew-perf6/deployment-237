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
import * as API from "./../../api/api";
import { Delete, Edit, Email, Phone } from "@material-ui/icons";
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

const rows = [
  {
    id: 1,
    date: "06-12-2021",
    name: "Vaibhav Sinha",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    accountDetails: {
      bank: "ABC Bank",
      account: "123123123123",
      ifsc: "ABC000123",
    },
  },
  {
    id: 2,
    date: "06-12-2021",
    name: "Sankar Bera",
    email: "sankar@webart.com",
    phoneNumber: "6205630243",
    status: true,
    accountDetails: {
      bank: "ABC Bank",
      account: "123123123123",
      ifsc: "ABC000123",
    },
  },
  {
    id: 3,
    date: "06-12-2021",
    name: "Abir Paul",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: false,
    accountDetails: {
      bank: "ABC Bank",
      account: "123123123123",
      ifsc: "ABC000123",
    },
  },
  {
    id: 4,
    date: "06-12-2021",
    name: "Tanmoy",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: false,
    accountDetails: {
      bank: "ABC Bank",
      account: "123123123123",
      ifsc: "ABC000123",
    },
  },
  {
    id: 5,
    date: "06-12-2021",
    name: "Tamal",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    accountDetails: {
      bank: "ABC Bank",
      account: "123123123123",
      ifsc: "ABC000123",
    },
  },
];

const initialVendorList = {
  id: "",
  account_no: "",
  bank_name: "",
  ifsc: "",
  created_at: "",
  email: "",
  first_name: "",
  last_name: "",
  number: "",
  password: "",
  updated_at: "",
};

export default function Subscribers() {
  const classes = useStyles();
  const [vendorList, setVendorList] = useState([initialVendorList]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function vendorApi() {
      try {
        const data = [];
        const res = await API.get_subscription();
        res.data.map((item) => {
          data.push(item);
        });
        setVendorList(data);
        setLoading(false);
      } catch (e) {}
    }
    vendorApi();
  }, []);

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Subscribers</div>
      <div className=" font-medium text-gray-400 mb-2">All Subscribers</div>
      <hr />
      {loading ? (
        <div className="my-2 text-lg">Loading...</div>
      ) : vendorList.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorList.map((vendor) => {
                const date = dateFormat(vendor.created_at, "mmmm dS, yyyy");
                // const time = dateFormat(vendor.created_at, "h: MM: ss");
                return (
                  <TableRow
                    key={vendor.id}
                    className="hover:bg-gray-200 cursor-default"
                  >
                    <TableCell component="th" scope="row">
                      <div>{date}</div>
                      {/* <div>{time}</div> */}
                    </TableCell>

                    <TableCell>
                      <span className="text-blue-800 underline">
                        <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="my-2 text-lg">No data found</div>
      )}
    </div>
  );
}
