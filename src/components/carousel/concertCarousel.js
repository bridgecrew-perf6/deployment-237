import Carousel from "react-multi-carousel";
import Card from "../card/concertCard";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
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

export default function MovieCarousel() {
  return (
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
        {data.map((item, index) => {
          return (
            <div className="mx-4" key={index}>
              <Link to="/concerts">
                <Card
                  img={item.image}
                  name={item.title}
                  rating={item.rating}
                  popularity={item.popularity}
                  artist={item.artist}
                  address={item.address}
                  date={item.date}
                />
              </Link>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
