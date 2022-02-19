import React, { useEffect, useState } from 'react';
import {
  Theaters
} from '@material-ui/icons';
import {
  Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import dateFormat from "dateformat";
import { makeStyles } from "@material-ui/core/styles";

import * as API from "../../api/api";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonColor: {
    backgroundColor: '#041232',
    color: 'white',
  },
  redBadge: {
    backgroundColor: '#dc2626',
    color: 'white'
  },
  greenBadge: {
    backgroundColor: '#46ba80',
    color: 'white'
  }
});

const Dashboard = ({ tenat_event }) => {
  // Hooks
  useEffect(() => {
    getAllBookingHistory();
  }, [tenat_event])

  // Simple const vars
  const classes = useStyles();
  const userData = JSON.parse(localStorage.getItem("userData"));

  // State vars
  const [tableData, setTableData] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(false);

  const [scannedTickets, setScannedTickets] = useState(0);
  const [notScannedTickets, setNotScannedTickets] = useState(0);

  // Functions
  const getAllBookingHistory = async () => {
    setLoading(true);
    const res = await API.get_booking_by_vendor(userData.vendor_id);
    setTotalTickets(res.data.length);
    let sTicketCount = 0, nsTicketCount = 0;
    res.data.map(rData => {
      (rData.checkin_status === 1 || rData.checkin_status === "1") ? sTicketCount++ : nsTicketCount++;
    });
    setScannedTickets(sTicketCount);
    setNotScannedTickets(nsTicketCount);
    setTableData(res.data);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex flex-wrap dashboard-wrapper">
        <div className="xl:w-1/4 lg:w-2/4 md:w-2/4 w-full xl:my-2 xl:my-2 mt-5 mb-5 md:p-2 relative xl:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-yellow-500 flex justify-center py-2 dashboard-stats-icon">
              <Theaters style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1 stats-heading">
                Tickets
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {totalTickets}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-1/4 lg:w-2/4 md:w-2/4 w-full xl:my-2 xl:my-2 mt-5 mb-5 md:p-2 relative xl:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-red-500 flex justify-center py-2 dashboard-stats-icon">
              <Theaters style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1 stats-heading">
                Tickets Scanned
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {scannedTickets}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-1/4 lg:w-2/4 md:w-2/4 w-full xl:my-2 xl:my-2 mt-5 mb-5 md:p-2 relative xl:h-36 dashboard-stats">
          <div className="p-3 overflow-visible shadow-lg rounded-2xl bg-white">
            <div className="xl:w-20 xl:h-20 -mt-6 absolute rounded shadow-lg absolute bg-red-500 flex justify-center py-2 dashboard-stats-icon">
              <Theaters style={{ fontSize: 60, color: "#f0f0f0" }} />
            </div>
            <div className="xl:h-24 dashboard-stats-content">
              <div className="text-right md:text-xl text-lg text-gray-500 py-1 stats-heading">
                Tickets Outstanding
              </div>
              <div className="text-right xl:text-2xl text-xl font-semibold text-gray-600">
                {notScannedTickets}
              </div>
            </div>
          </div>
        </div>

        {/* Booking history table for ticket scanner */}
        <div className="w-full xl:my-0 lg:my-0 my-5 md:p-2 relative h-auto table-spacing">
          <div className="md:p-6 p-4 overflow-visible shadow-lg rounded-2xl h-full bg-white">
            <div className={classes.header}>
              <span>
                <div className="uppercase font-medium text-secondary">Booking History</div>
                <div className=" font-medium text-gray-400 mb-2">All Booking History</div>
              </span>
            </div>
            <hr />
            {loading ? <div className="w-full h-auto rounded-xl shadow-lg bg-white mt-5 p-4">
              Loading...
            </div> :
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Date</b></TableCell>
                      <TableCell><b>Booking Id</b></TableCell>
                      <TableCell><b>Booking Type</b></TableCell>
                      <TableCell><b>Ticket Info</b></TableCell>
                      <TableCell><b>Name</b></TableCell>
                      <TableCell><b>User Name</b></TableCell>
                      <TableCell><b>Checkin Status</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData && tableData.map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-200 cursor-default"
                        >
                          <TableCell component="th" scope="row"> {item.date} </TableCell>
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
                            {(item.checkin_status === "1" || item.checkin_status === 1) ?
                              <Chip className={classes.greenBadge} label="Checked In" />
                              :
                              <Chip className={classes.redBadge} label="Not Checked In" variant="outlined" />}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;