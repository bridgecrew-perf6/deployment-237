import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";

import Banner from "../../components/banner/banner";
import * as API from "./../../api/api";
import * as C from "./../../const";
import { Link } from "react-router-dom";

const initialBlog = [];
export default function Blog() {
  const [blog, setBlog] = useState(initialBlog);

  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
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
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        <Breadcrumbs category="Blog" />
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl blog-block">
          <div className="md:text-3xl text-2xl font-semibold mb-3">Blog</div>
          <div>
            Whether you're traveling to an entertainment hotspot like Vegas or
            Broadway, looking for a family show or making plans for a seasonal
            event, we'll guide you to the perfect live entertainment experience.
          </div>

          <div className="flex flex-wrap xl:mt-10 lg:mt-7">
            {blog.map((item) => {
              const src = C.URL + "/" + item.image;
              return (
                <div
                  className="xl:w-1/4 lg:w-1/3 md:w-3/6 w-full lg:my-4 mt-6 md:px-4 rounded-lg blog-card"
                  key={item.id}
                >
                  <Link exact to={"/blog/" + item.id}>
                    {/* <Link to={{pathname: `/${this.props.testvalue}`, search: `?backUr */}
                    <div className="h-full rounded-lg cursor-pointer shadow-lg hover:shadow-xl bg-theme">
                      <div
                        className="w-full bg-green-200 rounded-t-lg bg-cover bg-center blog-card-img"
                        style={{ backgroundImage: `url(${src})` }}
                      ></div>
                      <div className="lg:p-5 p-4 cursor-pointer">
                        <div className="blog-title pb-2 text-md font-bold">
                          {item.title}
                        </div>
                        <div
                          className="blog2 text-sm blog-content"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
            {/* {data.map((item) => {
              return (
                <div className="lg:w-1/3 xl:w-1/4 w-full h-80 my-4 px-4 rounded-lg">
                  <div className="h-full rounded-lg cursor-pointer shadow-lg hover:shadow-xl bg-theme">
                    <div
                      className="w-full h-1/2 bg-green-200 rounded-t-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.img})` }}
                    ></div>
                    <div className="px-5 cursor-pointer">
                      <div className="text-center py-2 text-lg font-semibold">
                        {item.title}
                      </div>
                      <div className="blog2 text-sm">{item.description}</div>
                    </div>
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
      </div>
    </>
  );
}
