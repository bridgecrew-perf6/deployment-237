import React, { useState } from "react";
import {
  AccessTime,
  AttachMoney,
  CalendarToday,
  Category,
  Create,
  Image,
  Person,
  Place,
  Star,
  Theaters,
  TimelapseOutlined,
} from "@material-ui/icons";
import DatePicker from "react-datepicker";

const style = {
  control: (base) => ({
    ...base,
    boxShadow: "none",
  }),
};

export default function Manage() {
  const [category, setCategory] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  // console.log(startDate.getUTCMonth() + 1);
  // console.log(startDate.getUTCFullYear());

  return (
    <div>
      <div>
        <div className="flex flex-wrap -mx-3 chivo">
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="email"
              className="text-xs font-semibold px-1 text-theme"
            >
              Category
            </label>

            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Category fontSize="small" />
              </div>
              <select
                type="name"
                name="name"
                id="name"
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Joker"
              >
                <option value="concerts">Concerts</option>
                <option value="events">Events</option>
                <option value="movies">Movies</option>
              </select>
            </div>
            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="name"
              className="text-xs font-semibold px-1 text-theme"
            >
              Name
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Theaters fontSize="small" />
              </div>
              <input
                type="name"
                name="name"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Joker"
              />
            </div>
            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/4 xl:w-1/4 w-1/2 px-3 mb-5">
            <label
              htmlFor="name"
              className="text-xs font-semibold px-1 text-theme"
            >
              Date
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <CalendarToday fontSize="small" />
              </div>
              <div className="w-auto">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  // showTimeSelect
                  // dateFormat="MMMM d, yyyy h:mm aa"
                  className="xl:w-60 lg:w-60 w-40 text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                />
              </div>
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/4 xl:w-1/4 w-1/2 px-3 mb-5">
            <label
              htmlFor="name"
              className="text-xs font-semibold px-1 text-theme xl:ml-7 lg:ml-7"
            >
              Time
            </label>
            <div className="flex justify-end">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <AccessTime fontSize="small" />
              </div>
              <div className="w-auto">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  dateFormat="h:mm aa"
                  className="xl:w-60 lg:w-60 w-40 text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                />
              </div>
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="name"
              className="text-xs font-semibold px-1 text-theme"
            >
              Name
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Theaters fontSize="small" />
              </div>
              <input
                type="name"
                name="name"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Joker"
              />
            </div>
            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          {category === "movies" && (
            <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
              <label
                htmlFor="rating"
                className="text-xs font-semibold px-1 text-theme"
              >
                Rating
              </label>
              <div className="flex">
                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                  <Star fontSize="small" />
                </div>
                <input
                  type="rating"
                  name="rating"
                  id="name"
                  // onChange={handleChange}
                  className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                  placeholder="99%"
                />
              </div>
              {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
            </div>
          )}
          {category === "movies" && (
            <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
              <label
                htmlFor="popularity"
                className="text-xs font-semibold px-1 text-theme"
              >
                Popularity
              </label>
              <div className="flex">
                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                  <Star fontSize="small" />
                </div>
                <input
                  type="popularity"
                  name="popularity"
                  id="name"
                  // onChange={handleChange}
                  className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                  placeholder="98%"
                />
              </div>
              {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
            </div>
          )}

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="poster"
              className="text-xs font-semibold px-1 text-theme"
            >
              Poster
            </label>
            <div className="flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Image fontSize="small" />
              </div>
              <label className="w-full text-gray-400" htmlFor="poster">
                Upload Poster
              </label>
              <input type="file" id="poster" className="hidden" />
            </div>
            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="rating"
              className="text-xs font-semibold px-1 text-theme"
            >
              Venue
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Place fontSize="small" />
              </div>
              <input
                type="rating"
                name="rating"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Royal Albert Hall"
              />
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5">
            <label
              htmlFor="rating"
              className="text-xs font-semibold px-1 text-theme"
            >
              Artist
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Person fontSize="small" />
              </div>
              <input
                type="rating"
                name="rating"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Adele"
              />
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>
          
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 xl:-mt-20 lg:-mt-20">
            <label
              htmlFor="rating"
              className="text-xs font-semibold px-1 text-theme"
            >
              Price
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <AttachMoney fontSize="small" />
              </div>
              <input
                type="rating"
                name="rating"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="100.00"
              />
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>

{category === "movies" && (
          <div className="lg:w-1/2 xl:w-1/2 w-full px-3 mb-5 xl:-mt-20 lg:-mt-20">
            <label
              htmlFor="rating"
              className="text-xs font-semibold px-1 text-theme"
            >
              Price
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <AttachMoney fontSize="small" />
              </div>
              <input
                type="rating"
                name="rating"
                id="name"
                // onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="100.00"
              />
            </div>

            {/* {errorEmail.field === "email" && (
              <p className="text-xs text-red-600 mt-2">{errorEmail.message}</p>
            )} */}
          </div>)}
        </div>

        <div className="flex -mx-3 playfair">
          <div className="w-full px-3 mb-20">
            <button
              className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
              //   onClick={handleClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
