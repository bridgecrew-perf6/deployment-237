import { useEffect, useState } from "react";
import * as API from "./../../api/api";
import Select from "react-select";
import CityData from "../../data/city.json";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { CSVLink } from "react-csv";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const initialData = {
  city_name: "",
  event_id: "",
  booking_type: "",
};

const initialSearchData = [
  {
    amount: "",
    booking_id: "",
    booking_type: "",
    discount: "",
    item_name: "",
    ticket_no: "",
  },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();

export default function Reports(props) {
  const classes = useStyles();
  const vendor = JSON.parse(localStorage.getItem("userData"));
  const [eventOptions, setEventOptions] = useState([]);
  const [concertOptions, setConcertOptions] = useState([]);
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const reportFilename = `${months[date.getMonth()]}_${date.getDate()}_${date.getFullYear()}_report.csv`;

  const cityOptions = [];
  CityData.map((item) => {
    const option = {
      value: item.id.toString(),
      label: item.en_name,
      name: "city_name",
    };
    cityOptions.push(option);
  });

  useEffect(() => {
    async function Data() {
      try {
        const response = await API.event_by_vendor(vendor.id);
        const options = [];
        response.data[0].events.map((item) => {
          const obj = { value: item.id, label: item.title, name: "event_id" };
          options.push(obj);
        });
        setEventOptions(options);

        const response1 = await API.concert_by_vendor(vendor.id);
        const options1 = [];
        response1.data[0].concert.map((item) => {
          const obj = { value: item.id, label: item.title, name: "event_id" };
          options1.push(obj);
        });
        setConcertOptions(options1);
      } catch (e) { }
    }
    Data();
  }, [props.tenat_event]);

  const categoryOptions = [
    { value: "1", label: "Event", name: "booking_type" },
    { value: "2", label: "Concert", name: "booking_type" },
  ];

  const typeOptions = [
    { value: "0", label: "All", name: "type" },
    { value: "1", label: "Checked In", name: "type" },
  ];

  const handleChange = (e) => {
    console.log(e);
    setFormData({
      ...formData,
      [e.name]:
        e.name === "city_name"
          ? e.label
          : e.name === "booking_type"
            ? e.label
            : e.value,
    });
  };

  const handleClick = async () => {
    setShow(true);
    setLoading(true);
    setSearchData([]);
    const { city_name, event_id, booking_type,type } = formData;
    try {
      const requestObj = {
        city_name: city_name ? city_name : "",
        event_id: props.tenat_event == "all" ? event_id : props.tenat_event,
        booking_type: booking_type,
        type :type
      };
      const response = await API.booking_history(requestObj);
      const data = [];
      console.log(response);
      if (response.status === 200) {
        setLoading(false);
        response.data.data.map((item) => data.push(item));
      }
      setSearchData(data);
    } catch (e) { }
  };
  return (
    <>
      <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4 dashboard-top-space">
        <div className="uppercase font-medium text-secondary">Reports</div>
        <div className=" font-medium text-gray-400 mb-2">All Reports</div>
        <hr />
        <div className="w-full flex flex-wrap">
          <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
            <div className="w-full">
              <Select
                //   value={selectedMovie}
                //   onChange={handleChange}
                onChange={(e) => {
                  setCategory(e.label);
                  handleChange(e);
                }}
                options={categoryOptions}
                placeholder="Select Category"
                className="focus:outline-none border-0"
                classNamePrefix="focus:outline-none react-select-container"
              />
            </div>
          </div>
          <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
            <div className="w-full">
              <Select
                onChange={handleChange}
                options={typeOptions}
                placeholder="Select Ticket Type"
                className="focus:outline-none border-0"
                classNamePrefix="focus:outline-none react-select-container"
              />
            </div>
          </div>
        </div>

        {category === "Event" && (
          <div className="w-full flex flex-wrap justify-between">
            <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
              <div className="w-full">
                <Select
                  onChange={handleChange}
                  options={cityOptions}
                  placeholder="Select City"
                  className="focus:outline-none border-0"
                  classNamePrefix="focus:outline-none react-select-container"
                />
              </div>
            </div>
            {props.tenat_event == "all" && (
              <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
                <div className="w-full">
                  <Select
                    //   value={selectedMovie}
                    onChange={handleChange}
                    value={eventOptions.lenght > 0 && eventOptions[0]}
                    options={eventOptions}
                    placeholder="Select Event"
                    className="focus:outline-none border-0"
                    classNamePrefix="focus:outline-none react-select-container"
                  />
                </div>
              </div>
            )}
           
            <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
              <div className="w-full flex flex-row justify-center">
                <button
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                  onClick={handleClick}
                >
                  Search
                </button>
                {searchData.length > 0 && <CSVLink filename={reportFilename} className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto
                  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white
                  transition duration-500 ease-in-out focus:outline-none text-center" data={searchData}>
                  Export
                </CSVLink>}
              </div>
            </div>
          </div>
        )}
        {category === "Concert" && (
          <div className="w-full flex flex-wrap justify-between">
            <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
              <div className="w-full">
                <Select
                  onChange={handleChange}
                  options={cityOptions}
                  placeholder="Select City"
                  className="focus:outline-none border-0"
                  classNamePrefix="focus:outline-none react-select-container"
                />
              </div>
            </div>
            <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
              <div className="w-full">
                <Select
                  //   value={selectedMovie}
                  onChange={handleChange}
                  value={concertOptions.lenght > 0 && concertOptions[0]}
                  options={concertOptions}
                  placeholder="Select Concert"
                  className="focus:outline-none border-0"
                  classNamePrefix="focus:outline-none react-select-container"
                />
              </div>
            </div>
            <div className="lg:w-1/3 xl:w-1/3 w-full  xl:mt-4 lg:mt-4 mt-4 px-1">
              <div className="w-full flex flex-row justify-center">
                <button
                  className="bg-gradient-to-r from-primary to-secondary
       py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none"
                  onClick={handleClick}
                >
                  Search
                </button>
                {searchData.length > 0 && <CSVLink filename={reportFilename} className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto
                  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white
                  transition duration-500 ease-in-out focus:outline-none text-center" data={searchData}>
                  Export
                </CSVLink>}
              </div>
            </div>
          </div>
        )}
      </div>
      {show ? (
        loading ? (
          <div className="w-full h-auto rounded-xl shadow-lg bg-white mt-5 p-4">
            Loading...
          </div>
        ) : searchData.length > 0 ? (
          <div className="w-full h-auto rounded-xl shadow-lg bg-white mt-5 p-4">
            {/* <div className="uppercase font-medium text-secondary">Transaction</div>
        <div className=" font-medium text-gray-400 mb-2">
          All Transaction History
        </div> */}
            {/* <hr /> */}
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Booking Id</TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Ticket Number</TableCell>
                    <TableCell>Number of Ticket</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Discount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchData.map((item, index) => {
                    console.log(item);
                    return (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-200 cursor-default"
                      >
                        <TableCell component="th" scope="row">
                          {item.booking_id}
                        </TableCell>
                        <TableCell>{item.item_name}</TableCell>
                        <TableCell>{item.ticket_no}</TableCell>
                        <TableCell>{item.ticket_slot}</TableCell>
                        <TableCell align="right">
                          <span className="font-bold">
                            ${Number(item.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          ${Number(item.discount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          searchData && (
            <div className="w-full h-auto rounded-xl shadow-lg bg-white mt-5 p-4">
              No Data Found
            </div>
          )
        )
      ) : (
        <></>
      )}
    </>
  );
}
