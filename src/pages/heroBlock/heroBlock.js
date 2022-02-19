import React, { useEffect, useState } from "react";
// import Hero from "../../assets/images/hero.jpg";
import LanguageData from "../../data/language.json";
import Hero from "../../assets/images/bgHome.jpeg";
import Ticket1 from "../../assets/icons/ticket1.png";
import Ticket2 from "../../assets/icons/ticket2.png";
import Ticket3 from "../../assets/icons/ticket3.png";
import City from "../../assets/icons/city.png";
import DatePng from "../../assets/icons/date.png";
import Cinema from "../../assets/icons/cinema.png";
import Button from "../../components/button/button";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import { useHistory } from "react-router";
import * as API from "./../../api/api";

const initalFormData = {
  title: "",
  artist: "",
  address: "",
  category: "",
  language: "",
  tag: "",
  about: "",
  date: "",
};

export default function HeroBlock() {
  const history = useHistory();
  const [formData, setFormData] = useState(initalFormData);
  const [startDate, setStartDate] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    EventHistory();
  }, [])
  
  const EventHistory = async() => {
    try {
      const response = await API.category();
      setCategoryData(response.data);
    } catch (e) { }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    try {
      const requestObj = {
        title: formData.title,
        artist: formData.artist,
        address: formData.address,
        category: formData.category,
        language: formData.language,
        tag: formData.tag,
        about: formData.about,
        date: startDate ? dateFormat(startDate, "m/d/yyyy") : "",
      };
      const response = await API.search(requestObj);
      history.push({
        pathname: "/search",
        state: { data: response.data },
      });
    } catch (e) { }
  };
  return (
    <div
      className="bg-red-500 bg-cover relative lg:px-24 xl:px-24 px-4 home-bg"
      style={{ backgroundImage: `url(${Hero})` }}
    >
      {/* <div className="text-white lg:text-7xl xl:text-7xl text-5xl uppercase pt-60 font-black text-center">
        <div>Book your </div>
        <div>
          tickets for <span className="text-secondary">event</span>
        </div>
      </div> */}
      <div className="lg:pt-60 md:pt-24 lg:hidden xl:hidden block home-mobile-padding"></div>
      <div className="lg:pt-40 lg:pb-14 md:pb-14 pb-8">
        <div className="bg-red-200 searchSection rounded-lg p-5 mx-auto">
          <div className="text-white flex flex-wrap justify-between searchsection-heading">
              <div>
                <div className="text-sm">Welcome to Event Mania</div>
                <div className="text-3xl uppercase ">What are you looking for?</div>
              </div>
              <div className="flex flex-wrap lg:mt-0 mt-5">
                <Link to="/events">
                  <div
                    className="mx-2 rounded-3xl lg:w-36 xl:w-36 md:w-36 w-auto my-auto py-2 px-4 text-center text-black flex justify-around"
                    style={{ background: "#C1C1C1" }}
                  >
                    <div className="uppercase font-semibold lg:block xl:block md:block">
                      Events
                    </div>
                  </div>
                </Link>
                <Link to="/concerts">
                  <div
                    className="mx-2 rounded-3xl lg:w-36 xl:w-36 md:w-36 w-auto my-auto py-2 px-4 text-center text-black flex justify-around"
                    style={{ background: "#C1C1C1" }}
                  >
                    <div className="uppercase font-semibold lg:block md:block  xl:block">
                      Comedy
                    </div>
                  </div>
                </Link>
              </div>
          </div>

          <div
            className="py-2 lg:mt-8 md:mt-4 mt-0 flex lg:flex-wrap xl:flex-wrap flex-wrap items-end rounded-xl justify-evenly lg:px-5"
          >
            {/* <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <input
                  type="text"
                  name="title"
                  className="lg:w-4/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                  placeholder="Event Name"
                  onChange={handleChange}
                />
              </div>
            </div> */}
            
            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <input
                  type="text"
                  name="artist"
                  className="lg:w-4/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                  placeholder="Artist"
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <input
                  type="text"
                  name="address"
                  className="lg:w-4/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                  placeholder="Address"
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <select
                  type="text"
                  name="category"
                  id="category"
                  onChange={handleChange}
                  className="w-full lg:w-7/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                >
                  <option disabled selected>Select category</option>
                  {categoryData.map((item) => {
                    return <option value={item.name} className="text-black">{item.name}</option>;
                  })}
                </select>
              </div>
            </div>
            
            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <select
                  type="text"
                  name="language"
                  id="language"
                  onChange={handleChange}
                  className="w-full lg:w-7/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                >
                  <option value="" disabled selected>
                    Select language
                  </option>
                  {LanguageData.map((item) => {
                    return (
                      <option value={item.name} key={item.code} className="text-black">
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <input
                  type="text"
                  name="tag"
                  className="lg:w-4/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                  placeholder="Tag"
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                <input
                  type="text"
                  name="about"
                  className="lg:w-4/5 w-9/12 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                  placeholder="About"
                  onChange={handleChange}
                />
              </div>
            </div> */}

            <div className="md:w-3/6 lg:w-1/3 xl:w-1/3 w-full my-auto search-input">
              <div className="border-b-2 relative pb-1">
                {/* <img src={DatePng} alt="zoom" className="float-left mr-2" /> */}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  // maxDate={new Date()}
                  placeholderText="Select Date"
                  // className="xl:w-72 lg:w-72 w-64 bg-transparent text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg text-white outline-none focus:border-innerBG placeholder-white text-sm"
                  className="lg:w-60 xl:w-60 w-48 h-10 rounded-xl bg-transparent focus:outline-none text-white placeholder-white placeholder-font-semibold text-sm px-2"
                />
              </div>
            </div>
            <div className="lg:w-1/3 xl:w-1/3 w-full my-auto search-btn">
              <div className="relative pb-1 text-center">
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
