import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as API from "./../../api/api";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Booking({ tenat_event }) {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    async function BookingHistory() {
      try {
        const res = await API.get_booking_by_vendor(userData.id);
        const data = [];
        res.data.map((item) => {
          data.push(item);
        });
        setBookingData(data);
      } catch (e) { }
    }
    BookingHistory();
  }, [tenat_event]);
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Booking</div>
      <div className=" font-medium text-gray-400 mb-2">All Booking History</div>
      <hr />
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Booking Id</TableCell>
              <TableCell>Booking Type</TableCell>
              <TableCell>Ticket Info</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingData && bookingData.map((item, index) => {
              const date = moment(item.created_at).format("MMM Do, YYYY");
              return (
                <TableRow
                  key={index}
                  className="hover:bg-gray-200 cursor-default"
                >
                  <TableCell component="th" scope="row">
                    {date}
                  </TableCell>
                  <TableCell>{item.booking_id}</TableCell>
                  <TableCell>{item.booking_type}</TableCell>
                  <TableCell>{item.package} - {item.ticket_slot}</TableCell>
                  <TableCell className="w-1/4">
                    <span className="capitalize">{item.item_name}</span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.user_first_name + " " + item.user_last_name}
                  </TableCell>
                  <TableCell>
                    {(item.booking_status === "1" || item.booking_status === 1) ? (
                      <div className="bg-green-500 rounded-full w-10 h-6 relative">
                        <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                      </div>
                    ) : (
                      <div className="bg-red-600 rounded-full w-10 h-6 relative">
                        <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-bold">$ {item.amount}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
