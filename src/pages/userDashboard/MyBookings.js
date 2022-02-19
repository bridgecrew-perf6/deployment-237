import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as API from "./../../api/api";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(date, category, email, amount, status) {
  return { date, category, email, amount, status };
}

export default function MyBookings() {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    async function BookingHistory() {
      try {
        const res = await API.get_booking_by_user(userData.id);
        const data = [];
        res.data.map((item) => {
          data.push(item);
        });
        setBookingData(data);
      } catch (e) { }
    }
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    BookingHistory();
  }, []);
  return (
    <div className="w-full my-booking-page-wrapper">
      {/* <div className="md:px-5 lg:px-8 xl:px-8 md:py-4 px-4 py-3 bg-innerBG  lg:text-xl text-lg text-semibold rounded-lg w-full shadow-md">
        My Bookings
      </div> */}
      <div className="bg-white w-full h-auto rounded-xl shadow-lg p-4">
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                {(dimensions.width < 910) &&
                  <TableCell align="center">
                    <span className="">Download</span>
                  </TableCell>
                }
                <TableCell>
                  <span className=" w-32">Date </span>
                </TableCell>

                <TableCell>
                  <span className="">Booking Id</span>
                </TableCell>
                <TableCell>
                  <span className="">Booking Type</span>
                </TableCell>
                <TableCell>
                  <span className="">Event Name</span>
                </TableCell>
                <TableCell align="center">
                  <span className="">Payment Status</span>
                </TableCell>
                <TableCell align="right">
                  <span className="">Amount</span>
                </TableCell>
                {(dimensions.width > 910) &&
                  <TableCell align="center">
                    <span className="">Download</span>
                  </TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingData.map((item, index) => {
                const created_date = new Date(item.created_at.replace(/-/g, "/"));
                const month = dateFormat(created_date, "mmmm");
                const day = dateFormat(created_date, "dS, yyyy");
                const date = month.substring(0, 3) + " " + day;
                return (
                  <TableRow
                    key={index}
                    className="cursor-default"
                  >
                    {(dimensions.width < 910) &&
                      <TableCell align="right">
                        {item.payment_status == "1" ? (
                          <Link
                            exact
                            to={{
                              pathname: `/ticket/${item.TICKET_ID}`,
                              state: { ticket: item },
                            }}
                          >
                            <Button>
                              Download
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled>
                            Download
                          </Button>
                        )}
                      </TableCell>
                    }
                    <TableCell component="th" scope="row">
                      <span className=" text-xs">{date}</span>
                    </TableCell>
                    <TableCell>
                      <span className=" text-xs">
                        {item.booking_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className=" text-xs">
                        {item.booking_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-xs">
                        {item.item_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.payment_status == "1" ? (
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
                      <span className="font-bold text-xs">
                        ${" "}
                        {Number(
                          Number(item.amount) - Number(item.discount)
                        ).toFixed(2)}
                      </span>
                    </TableCell>
                    {(dimensions.width > 910) &&
                      <TableCell align="right">
                        {item.payment_status == "1" ? (
                          <Link
                            exact
                            // target="_blank"
                            to={{
                              pathname: `/ticket/${item.TICKET_ID}`,
                              state: { ticket: item },
                            }}
                          >
                            <Button>
                              Download
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled>
                            Download
                          </Button>
                        )}
                      </TableCell>
                    }
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
