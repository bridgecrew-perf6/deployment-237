import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const data = [
  {
    id: 1,
    title: "",
    image: "",
    description: "",
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
        containerClass="container-with-dots py-10"
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
              <div className=" rounded-xl shadow-lg hover:shadow-xl">
                <div>
                  <img
                    src={item.image}
                    alt={index}
                    className="h-56 bg-cover rounded-t-lg w-full"
                  />
                </div>
                <div className="h-56 bg-secondary relative rounded-b-lg">
                  <div className="absolute py-1 px-2 bg-red-700 text-white font-semibold text-sm -mt-4 left-2">
                    {item.date}
                  </div>
                  <div className="text-center text-white">
                    <div className="pt-5 pb-2 text-xl font-bold">
                      {item.title}
                    </div>
                    <div className="lg:px-10 xl:px-10 px-4 blog">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}
