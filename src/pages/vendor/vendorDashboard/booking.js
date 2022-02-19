import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(date, category, email, amount, status) {
  return { date, category, email, amount, status };
}

const rows = [
  createData(
    "06-12-2021",
    "Movie",
    "vaibhavsinha619@gmail.com",
    24.0,
    "confirmed"
  ),
  createData(
    "06-10-2021",
    "Event",
    "vaibhavsinha619@gmail.com",
    37.0,
    "confirmed"
  ),
  createData(
    "06-03-2021",
    "Movie",
    "vaibhavsinha619@gmail.com",
    24.0,
    "cancelled"
  ),
  createData("05-28-2021", "Concert", "sankar@webart.com", 67.0, "confirmed"),
  createData(
    "05-24-2021",
    "Movie",
    "vaibhavsinha619@gmail.com",
    49.0,
    "pending"
  ),
];

export default function Booking() {
  const classes = useStyles();
  const [sortedArray, setSortedArray] = useState(rows);

  const sortAsc = () => {
    const data = sortedArray.sort((a, b) => {
      return parseInt(a.amount) - parseInt(b.amount);
    });
    setSortedArray(data);
  };

  const sortDesc = () => {
    const data = sortedArray.sort((a, b) => {
      return parseInt(b.amount) - parseInt(a.amount);
    });
    setSortedArray(data);
  };

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Booking</div>
      <div className=" font-medium text-gray-400 mb-2">All Booking History</div>
      <hr />
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Date{" "}
                {/* <button onClick={sortAsc}>
                  <ArrowUpward />
                </button>
                <button onClick={sortDesc}>
                  <ArrowDownward />
                </button> */}
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedArray.map((row, index) => {
              //   console.log(row);
              return (
                <TableRow
                  key={index}
                  className="hover:bg-gray-200 cursor-default"
                >
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>
                    <span className="text-blue-800 underline">
                      <a href={`mailto:${row.email}`}>{row.email}</a>
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.status === "confirmed" ? (
                      <span className="text-green-600 capitalize font-semibold">
                        {row.status}
                      </span>
                    ) : row.status === "pending" ? (
                      <span className="text-yellow-600 capitalize font-semibold">
                        {row.status}
                      </span>
                    ) : (
                      <span className="text-red-600 capitalize font-semibold">
                        {row.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-bold">{row.amount}</span>
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
