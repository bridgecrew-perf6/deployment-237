import React, { useEffect, useState } from "react";
import Button from "../../components/button/button";
import Button2 from "../../components/button/button2";
// import Carousel from "react-multi-carousel";
import Carousel from 'react-grid-carousel';
import Card from "../../components/card/concertCard";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import * as API from "./../../api/api";
import * as C from "../../const";
import dateFormat from "dateformat";
import { useHistory } from "react-router";

const data = [
  {
    id: "",
    title: "",
    rating: "",
    popularity: "",
    image: "",
    artist: "",
    address: "",
    date: "",
  },
];

export default function Concerts() {
  const history = useHistory();
  const [concertData, setConcertData] = useState(data);
  const [tag, setTag] = useState("nowShowing");
  const [loaderShowing, setLoaderShowing] = useState(false);
  const [loaderUpcoming, setLoaderUpcoming] = useState(false);
  const [loaderExclusive, setLoaderExclusive] = useState(false);
  useEffect(() => {
    async function ConcertApi() {
      try {
        const response = await API.now_showing_concert();
        const data = [];
        response.data.map((item) => {
          data.push(item);
        });
        setConcertData(data);
      } catch (e) {}
    }
    ConcertApi();
  }, []);

  const onClick = async (props) => {
    setTag(props);
    if (props === "nowShowing") {
      setLoaderShowing(true);
      const response = await API.now_showing_concert();
      const data = [];
      response.data.map((item) => {
        data.push(item);
      });
      setLoaderShowing(false);
      setConcertData(data);
    } else if (props === "upcoming") {
      setLoaderUpcoming(true);
      const response = await API.upcoming_concert();
      const data = [];
      response.data.map((item) => {
        data.push(item);
      });
      setConcertData(data);
      setLoaderUpcoming(false);
    } else {
      setLoaderExclusive(true);
      const response = await API.exclusive_concert();
      const data = [];
      response.data.map((item) => {
        data.push(item);
      });
      setConcertData(data);
      setLoaderExclusive(false);
    }
  };

  return (
    <div className="lg:my-1 xl:my-8 my-0 lg:px-24 xl:px-24 px-4 lg:py-0 md:py-5 py-2">
      <div className="text-white text-2xl uppercase flex flex-wrap justify-between my-5">
        <div>
          <div>Comedy</div>
          <div className="text-xs capitalize">
          Be sure not to miss these comedy shows today
          </div>
        </div>
        <div className="flex flex-wrap my-2 md:justify-center events-show-btn">
          <div className="lg:mx-1 ml-1 my-1">
            {tag === "nowShowing" ? (
              <Button>
                {loaderShowing ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <span>Now Showing</span>
                )}
              </Button>
            ) : (
              <Button2
                onClick={() => onClick("nowShowing")}
                disabled={loaderShowing}
              >
                Now Showing
              </Button2>
            )}
          </div>
          <div className="lg:mx-1 ml-1 my-1">
            {tag === "upcoming" ? (
              <Button>
                {loaderUpcoming ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <span>Coming Soon</span>
                )}
              </Button>
            ) : (
              <Button2
                onClick={() => onClick("upcoming")}
                disabled={loaderUpcoming}
              >
                Coming Soon
              </Button2>
            )}
          </div>
          <div className="lg:mx-1 ml-1 my-1">
            {tag === "exclusive" ? (
              <Button>
                {loaderExclusive ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <span>Exclusive</span>
                )}
              </Button>
            ) : (
              <Button2
                onClick={() => onClick("exclusive")}
                disabled={loaderExclusive}
              >
                Exclusive
              </Button2>
            )}
          </div>
        </div>
      </div>

      {/* <ConcertCarousel /> */}

        <div className="grid xl:grid-cols-4 md:grid-cols-3 custom-small sm:grid-cols-2 md:gap-3 gap-4">
          {concertData.map((item, index) => {
              const src = C.URL + "/" + item.image;
              const month = dateFormat(item.date, "mmmm");
              const day = dateFormat(item.date, "dS");
              const date = day + " " + month.substring(0, 3);
              return (
                  <div className="lg:mx-4 xl:mx-4 mx-2" key={index}>
                    <Link exact to={"/concert/" + item.id}>
                      <Card
                        img={src}
                        name={item.title}
                        artist={item.artist}
                        address={item.address}
                        date={date}
                        price={item.price}
                        discount={item.discount}
                        sellingPrice={item.selling_price}
                      />
                    </Link>
                  </div>
              );
            })}
        </div>
        <div className="show-all-btn text-center">
        <button class="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out" onClick={() => history.push({ pathname: "/concerts", })}>
          Show All Comedy
        </button>
      </div>
    </div>
  );
}
