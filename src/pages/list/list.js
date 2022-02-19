import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";
import Button from "../../components/button/button";

import * as C from "../../const";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from "dateformat";
import Banner from "../../components/banner/banner";
import { useLocation } from "react-router-dom";

export default function List(props) {
  const location = useLocation();

  const [data, setData] = useState(location.state.data);

  const [movies, setMovies] = useState(data.movies ? data.movies : null);
  const [events, setEvents] = useState(data.events ? data.events : null);
  const [concerts, setConcerts] = useState(
    data.concerts ? data.concerts : null
  );

  // const handleChange = (selectedMovie) => {
  //   setSelectedMovie({ selectedMovie });
  //   console.log(`Option selected:`, selectedMovie);
  // };
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full d-flex bg-theme lg:px-16 xl:px-24 px-4">
        <Breadcrumbs category="Search" />
        <div className="xl:my-5 mt-5 lg:p-8 xl:p-10 p-5 item item-center text-white bg-innerBG rounded-xl search-results">
          {/* Filters */}
          <div className="">
            <div className="flex flex-wrap">
              <div className="w-full xl:w-1/2 text-xl font-semibold mb-3">
                All Concerts/ Events related to your search
              </div>
            </div>
          </div>
          {data.message && (
            <div className="text-2xl font-semibold md:py-4 pt-3">No Results Found</div>
          )}

          <div className="lg:mt-8 mt-4 font-semibold search-sub-heading">Concerts</div>
          <div className="search-event-list">
            {concerts ? (
              concerts.map((item) => {
                const src = C.URL + "/" + item.image;
                const month = dateFormat(item.date, "mmmm");
                const day = dateFormat(item.date, "dS");
                const date = day + " " + month.substring(0, 3);
                const weekDay = dateFormat(item.date, "dddd");
                return (
                  <>
                    <div className="search-events lg:mt-5 md:mt-4 mt-3 md:block hidden" key="12">
                      <div className="flex lg:flex-wrap search-event-box search-event-bg items-center lg:p-4 md:p-3 p-0 rounded-xl justify-between">
                        <div className="lg:w-28 xl:w-1/12 xl:p-0 lg:p-0 lg:pb-5 search-event-img">
                          <div className="flex items-center xl:justify-start lg:justify-start md:justify-start justify-center">
                            <img
                              src={src}
                              alt="thumb"
                              className="lg:w-24 xl:w-24 rounded-lg md:w-40 lg:h-32 xl:h-32 shadow-lg object-cover"
                            />
                          </div>
                        </div>
                        <div className="lg:w-1/6 xl:w-1/6 lg:p-2 p-0 search-event-date">
                          <div className="font-semibold lg:text-sm xl:text-sm text-xs search-event-date-block">
                            <div className="text-white">{date}</div>
                            <div className="flex flex-wrap items-center">
                              <div>{weekDay.substring(0, 3)}</div>
                              <div className="h-1 w-1 rounded-full bg-white mx-2 "></div>
                              <div>{item.time}</div>
                            </div>
                          </div>
                        </div>
                        <div className="lg:w-2/5 xl:w-1/2 p-2 search-event-title">
                          <div className="lg:text-lg xl:text-xl text-base font-semibold search-event-heading">
                            {item.title}
                          </div>
                        </div>
                        <div className="lg:w-12 xl:w-1/12 p-1 search-event-switch">
                          <div className="">
                            {item.is_active ? (
                              <div className="bg-green-500 rounded-full w-10 h-6 relative">
                                <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                              </div>
                            ) : (
                              <div className="bg-red-600 rounded-full w-10 h-6 relative">
                                <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="lg:w-1/6 xl:w-1/6 p-1 search-event-btn">
                          <div className="">
                            <Link exact to={"/concert/" + item.id}>
                              <Button>See ticket</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full 31.3rem mobile-events-posters bg-gradient-to-r from-primary to-secondary events-page-mobile p-3">
                          <div
                            className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
                          >
                            <img src={src} alt="event-posters" />
                          </div>
                          <div className="rounded bg-gradient-to-r from-primary to-secondary w-full text-white py-5 pl-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg event-card">
                            <div className="text-2xl pb-2 h-16">
                              <div className="text-xl leading-tight h-12 title overflow-hidden event-heading">
                                {item.title}
                              </div>
                            </div>
                            <div className="flex event-timing-date flex flex-col py-2">
                              <div className="text-white">{date}</div>
                              <div className="text-white text-md top-0 left-3 text-center bg-secondary rounded-b-lg event-date flex items-center">
                                <div>{weekDay.substring(0, 3)}</div>
                                <div className="h-1 w-1 rounded-full bg-white mx-2"></div>
                                <div>12:00 PM</div>
                              </div>
                            </div>

                          </div>
                          <div class="flex items-center w-full event-ticket-pricing">
                            <div className="event-price w-2/4">
                              <div className="">
                                {item.is_active ? (
                                  <div className="bg-green-500 rounded-full w-10 h-6 relative">
                                    <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                                  </div>
                                ) : (
                                  <div className="bg-red-600 rounded-full w-10 h-6 relative">
                                    <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="w-2/4 text-right" >
                              <Link exact to={"/event/" + item.id}>
                                <Button>See Ticket</Button>
                              </Link>
                            </div>
                          </div>
                      </div>
                  </>
                );
              })
            ) : (
              <div className="text-base py-3">No Concerts Found</div>
            )}
          </div>
          <div className="lg:mt-8 mt-4 font-semibold search-sub-heading">Events</div>
            <div className="search-event-list">
              {events ? (
                events.map((item) => {
                  const src = C.URL + "/" + item.image;
                  const month = dateFormat(item.date, "mmmm");
                  const day = dateFormat(item.date, "dS");
                  const date = day + " " + month.substring(0, 3);
                  const weekDay = dateFormat(item.date, "dddd");
                  return (
                    <>
                      <div className="search-events lg:mt-5 md:mt-4 mt-3 md:block hidden" key="12">
                        <div className="flex lg:flex-wrap search-event-box search-event-bg items-center lg:p-4 md:p-3 p-0 rounded-xl justify-between">
                          <div className="lg:w-28 xl:w-1/12 xl:p-0 lg:p-0 lg:pb-5 search-event-img">
                            <div className="flex items-center xl:justify-start lg:justify-start md:justify-start justify-center">
                              <img
                                src={src}
                                alt="thumb"
                                className="lg:w-24 xl:w-24 rounded-lg md:w-40 lg:h-32 xl:h-32 shadow-lg object-cover"
                              />
                            </div>
                          </div>
                          <div className="lg:w-1/6 xl:w-1/6 lg:p-2 p-0 search-event-date">
                            <div className="font-semibold lg:text-sm xl:text-sm text-xs search-event-date-block">
                              <div className="text-white">{date}</div>
                              <div className="flex flex-wrap items-center">
                                <div>{weekDay.substring(0, 3)}</div>
                                <div className="h-1 w-1 rounded-full bg-white mx-2"></div>
                                <div>{item.time}</div>
                              </div>
                            </div>
                          </div>
                          <div className="lg:w-2/5 xl:w-1/2 p-2 search-event-title">
                            <div className="lg:text-lg xl:text-xl text-base font-semibold search-event-heading">
                              {item.title}
                            </div>
                          </div>
                          <div className="lg:w-12 xl:w-1/12 p-1 search-event-switch">
                            <div className="">
                              {item.is_active ? (
                                <div className="bg-green-500 rounded-full w-10 h-6 relative">
                                  <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                                </div>
                              ) : (
                                <div className="bg-red-600 rounded-full w-10 h-6 relative">
                                  <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="lg:w-1/6 xl:w-1/6 p-1 search-event-btn">
                            <div className="">
                              <Link exact to={"/event/" + item.id}>
                                <Button>See Ticket</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full 31.3rem mobile-events-posters bg-gradient-to-r from-primary to-secondary events-page-mobile p-3">
                          <div
                            className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
                          >
                            <img src={src} alt="event-posters" />
                          </div>
                          <div className="rounded bg-gradient-to-r from-primary to-secondary w-full text-white py-5 pl-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg event-card">
                            <div className="text-2xl pb-2 h-16">
                              <div className="text-xl leading-tight h-12 title overflow-hidden event-heading">
                                {item.title}
                              </div>
                            </div>
                            <div className="flex event-timing-date flex flex-col py-2">
                              <div className="text-white">{date}</div>
                              <div className="text-white text-md top-0 left-3 text-center bg-secondary rounded-b-lg event-date flex items-center">
                                <div>{weekDay.substring(0, 3)}</div>
                                <div className="h-1 w-1 rounded-full bg-white mx-2"></div>
                                <div>12:00 PM</div>
                              </div>
                            </div>

                          </div>
                          <div class="flex items-center w-full event-ticket-pricing">
                            <div className="event-price w-2/4">
                              <div className="">
                                {item.is_active ? (
                                  <div className="bg-green-500 rounded-full w-10 h-6 relative">
                                    <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                                  </div>
                                ) : (
                                  <div className="bg-red-600 rounded-full w-10 h-6 relative">
                                    <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="w-2/4 text-right" >
                              <Link exact to={"/event/" + item.id}>
                                <Button>See Ticket</Button>
                              </Link>
                            </div>
                          </div>
                      </div>
                
                    </>
                  );
                })
              ) : (
                <div className="text-base py-3">No Events Found</div>
              )}
            </div>

          {/* <div className="mt-8">Movies</div>
          {movies ? (
            movies.map((item) => {
              const src = C.URL + "/" + item.image;
              const month = dateFormat(item.date, "mmmm");
              const day = dateFormat(item.date, "dS");
              const date = day + " " + month.substring(0, 3);
              const weekDay = dateFormat(item.date, "dddd");
              return (
                <div className="" key="12">
                  <div className="flex flex-wrap hover:bg-theme items-center  p-2 rounded-xl">
                    <div className="lg:w-28 xl:w-1/12 w-full xl:p-0 lg:p-0 pb-5">
                      <div className="flex items-center xl:justify-start lg:justify-start justify-center">
                        <img
                          src={src}
                          alt="thumb"
                          className="lg:w-24 xl:w-24 rounded-lg w-40 h-56 lg:h-32 xl:h-32 shadow-lg object-cover"
                        />
                      </div>
                    </div>
                    <div className="lg:w-1/6 xl:w-1/6 w-1/2 lg:p-2 p-0 ">
                      <div className="font-semibold lg:text-sm xl:text-sm text-xs ">
                        <div className="text-secondary">{date}</div>
                        <div className="flex flex-wrap items-center">
                          <div>{weekDay.substring(0, 3)}</div>
                          <div className="h-1 w-1 rounded-full bg-secondary mx-2 "></div>
                          <div>{item.time}</div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-2/5 xl:w-1/2 w-3/4 p-2">
                      <div className="lg:text-xl xl:text-xl text-base font-semibold search-event-heading">
                        {item.title}
                      </div>
                    </div>

                    <div className="lg:w-12 xl:w-1/12 w-1/2 p-1">
                      <div className="">
                        {item.is_active ? (
                          <div className="bg-green-500 rounded-full w-10 h-6 relative">
                            <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                          </div>
                        ) : (
                          <div className="bg-red-600 rounded-full w-10 h-6 relative">
                            <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-1/6 xl:w-1/6 w-1/2 p-1">
                      <div className="">
                        <Button>Book Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Movies Found</div>
          )}*/}
        </div>
      </div>
    </>
  );
}
