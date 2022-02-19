import React, { useEffect, useState } from "react";
import Button from "../../components/button/button";
import Button2 from "../../components/button/button2";
import Carousel from "react-multi-carousel";
import Card from "../../components/card/card";
import "react-multi-carousel/lib/styles.css";
// import MovieCarousel from "../../components/carousel/moviesCarousel";
import { Link } from "react-router-dom";
import * as API from "./../../api/api";
import * as C from "../../const";
import dateFormat from "dateformat";

const data = [
  {
    id: 1,
    title: "",
    image: "",
    address: "",
    date: "",
  },
];

export default function Movies() {
  const [movieData, setMovieData] = useState(data);
  const [mData, setMData] = useState(data);

  useEffect(() => {
    async function MoviesAPI() {
      try {
        const response = await API.movies();
        const data = [];
        setMData(response.data);
        response.data.map((item) => {
          data.push(item);
        });
        setMovieData(data);
      } catch (e) {}
    }
    MoviesAPI();
  }, []);

  // const NowShowing = () => {
  //   mData.map((item) => {
  //     const data = [];
  //     if (item.tag == "Now Showing") {
  //       data.push(item);
  //     }
  //     setMoviesData(data);
  //   });
  // };

  return (
    <>
      <div className="lg:mb-10 xl:mb-10 lg:mt-32 xl:mt-32 lg:px-24 xl:px-24 px-4">
        <div className="text-white text-2xl uppercase flex flex-wrap justify-between my-5">
          <div>
            <div>Movies</div>
            <div className="text-xs capitalize">
              Be sure not to miss these Movies today
            </div>
          </div>
          <div className="flex flex-wrap my-2 justify-center">
            <div className="mx-1 my-1">
              <Button
              //  onClick={NowShowing}
              >
                Now Showing
              </Button>
            </div>
            <div className="mx-1 my-1">
              <Button2>Coming Soon</Button2>
            </div>
            <div className="mx-1 my-1">
              <Button2>Exclusive</Button2>
            </div>
          </div>
        </div>

        {/* <MovieCarousel /> */}
        <div className="">
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={false}
            className=""
            containerClass="container-with-dots pb-10"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 1366,
                },
                items: 4,
                partialVisibilityGutter: 40,
              },
              ipad: {
                breakpoint: {
                  max: 1366,
                  min: 1024,
                },
                items: 3,
                partialVisibilityGutter: 40,
              },
              mobile: {
                breakpoint: {
                  max: 464,
                  min: 200,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 464,
                },
                items: 2,
                partialVisibilityGutter: 30,
              },
            }}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {/* {data.map((item, index) => { */}
            {movieData.map((item, index) => {
              const src = C.URL + "/" + item.image;
              const month = dateFormat(item.date, "mmmm");
              const day = dateFormat(item.date, "dS");
              const date = day + " " + month.substring(0, 3);
              return (
                <div className="lg:mx-4 xl:mx-4 mx-2" key={index}>
                  <Link to="/movies">
                    <Card
                      img={src}
                      name={item.title}
                      rating={item.rating}
                      popularity={item.popularity}
                      price={item.price}
                      discount={item.discount}
                      sellingPrice={item.selling_price}
                    />
                  </Link>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </>
  );
}
