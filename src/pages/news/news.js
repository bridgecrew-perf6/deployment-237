import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import * as API from "./../../api/api";
import * as C from "./../../const";
import { Link } from "react-router-dom";

import dateFormat from "dateformat";
const initialBlog = [];

export default function News() {
  const [blog, setBlog] = useState(initialBlog);

  useEffect(() => {
    async function BlogApi() {
      try {
        const response = await API.blog_fetching();
        const data = [];
        response.data.map((item) => {
          if (item.is_active == "1") {
            data.push(item);
          }
        });
        setBlog(data);
      } catch (e) {}
    }
    BlogApi();
  }, []);

  return (
    <div className="lg:my-20 xl:my-20 my-10 lg:px-24 xl:px-24 px-0">
      <div className="text-center text-white text-3xl">Latest News</div>
      {/* <BlogCarousel /> */}

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
          {blog.map((item) => {
            const src = C.URL + "/" + item.image;
            const month = dateFormat(item.created_at, "mmmm");
            const day = dateFormat(item.created_at, "dS");
            const date = day + " " + month.substring(0, 3);
            return (
              <div className="mx-4" key={item.id}>
                <Link
                  exact
                  to={"/blog/" + item.id}

                  // params={{ testvalue: "hello" }}
                >
                  <div className=" rounded-xl shadow-lg hover:shadow-xl">
                    <div>
                      <img
                        src={src}
                        alt={item.id}
                        className="h-56 bg-cover rounded-t-lg w-full"
                      />
                    </div>
                    <div className="h-56 bg-secondary relative rounded-b-lg">
                      <div className="absolute py-1 px-2 bg-red-700 text-white font-semibold text-sm -mt-4 left-2">
                        {date}
                      </div>
                      <div className="text-center text-white">
                        <div className="pt-5 pb-1 px-4 text-xl font-bold blog-title">
                          {item.title}
                        </div>
                        <div
                          className="lg:px-10 xl:px-4 px-4 blog"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
