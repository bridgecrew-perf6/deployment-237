import React, { useState } from "react";
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
import { Check, Delete, Edit, Email, Phone, Save } from "@material-ui/icons";

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
    date: "12-06-2021",
    ticketId: "MTG001",
    name: "Vaibhav Sinha",
    category: "Movie",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    amount: 123,
  },
  {
    id: 2,
    date: "12-06-2021",
    ticketId: "MTG002",
    name: "Vaibhav Sinha",
    category: "Movie",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: false,
    amount: 123,
  },
  {
    id: 3,
    date: "12-06-2021",
    ticketId: "MTG003",
    name: "Vaibhav Sinha",
    category: "Movie",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    amount: 123,
  },
  {
    id: 4,
    date: "12-06-2021",
    ticketId: "MTG004",
    name: "Vaibhav Sinha",
    category: "Event",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: false,
    amount: 123,
  },
  {
    id: 5,
    date: "12-06-2021",
    ticketId: "MTG005",
    name: "Vaibhav Sinha",
    category: "Concert",
    email: "vaibhavsinha619@gmail.com",
    phoneNumber: "6205630243",
    status: true,
    amount: 123,
  },
];

export default function Transaction() {
  const classes = useStyles();
  const [sortedArray, setSortedArray] = useState(rows);
  const [isEdit, setIsEdit] = useState(false);

  const [filteredData, setFilteredData] = useState(null);

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

  const handleEdit = (id) => {
    const data = rows.filter((item) => {
      if (item.id == id) {
        return item;
      }
    });
    setFilteredData(data);
    setIsEdit(true);
  };

  const handleSave = (id) => {
    console.log(id);
  };
  const handleDelete = (id) => {
    console.log(id);
  };

  const [state, setState] = useState(
    filteredData ? filteredData[0].status : false
  );

  // const handleChange = (event) => {
  //   setState(!state);
  //   // console.log;
  //   console.log(state);
  // };

  console.log(state);
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="uppercase font-medium text-secondary">Transaction</div>
      <div className=" font-medium text-gray-400 mb-2">
        All Transaction History
      </div>
      <hr />
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Ticket Id</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Phone Number</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-200 cursor-default"
                >
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell>{row.ticketId}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <span className="text-blue-800 underline">
                      <a href={`mailto:${row.email}`}>{row.email}</a>
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <span className="font-bold">{row.phoneNumber}</span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-bold">
                      ${Number(row.amount).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.status ? (
                      <div className="bg-green-500 rounded-full w-10 h-6 relative">
                        <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                      </div>
                    ) : (
                      <div className="bg-red-600 rounded-full w-10 h-6 relative">
                        <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-2">
                      <div
                        onClick={() => handleEdit(row.id)}
                        className="cursor-pointer"
                      >
                        <Edit fontSize="small" />
                      </div>
                      |
                      <div
                        onClick={() => handleDelete(row.id)}
                        className="cursor-pointer"
                      >
                        <Delete fontSize="small" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {isEdit && (
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
                {/* <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {filteredData[0].name}
                    </h3>
                  </div>
                </div> */}
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Email
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Email />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={filteredData[0].email}
                        // onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Phone Number
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Phone />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={filteredData[0].phoneNumber}
                        // onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
                  </div>

                  <div className="w-1/2 px-3 mb-3">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold px-1"
                    >
                      Status
                    </label>
                    <div className="flex">
                      {/* {state}
                      {filteredData[0].status} */}
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            checked={filteredData[0].status}
                            // onChange={handleChange}
                            name="checkedB"
                          />
                        }
                        className="pl-2"
                        // label="iOS style"
                      />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsEdit(false)}
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
