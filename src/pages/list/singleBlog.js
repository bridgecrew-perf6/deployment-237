import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/breadcrumb/breadcrumb";

import { useParams } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import * as API from "./../../api/api";
import * as C from "./../../const";
import dateFormat from "dateformat";
import Banner from "../../components/banner/banner";

const initialBlog = {
  title: "",
  image: "",
  description: "",
};
export default function SingleBlog(props) {
  const { id } = useParams();
  const [blog, setBlog] = useState(initialBlog);
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
    async function blog() {
      try {
        const response = await API.single_blog(id);
        console.log(response.data);
        setBlog(response.data);
      } catch (e) {}
    }
    blog();
  }, [id]);

  const src = C.URL + "/" + blog.image;
  const month = dateFormat(blog.created_at, "mmmm");
  const day = dateFormat(blog.created_at, "dS");
  const year = dateFormat(blog.created_at, "yy");
  const date = day + " " + month.substring(0, 3) + "' " + year;

  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        <Breadcrumbs title={blog.title} category="Blog" />
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl single-blog-block">
          <div className="mb-2">
            <div className="relative overflow-hidden single-blog-img-block">
              
              <img
                src={src}
                alt="banner"
                className="w-full blur h-auto mx-auto object-fill single-blog-bg-img"
              />
              <img
                src={src}
                alt="banner"
                className="w-10/12 absolute imageBlur h-auto mx-auto object-contain single-blog-img"
              />
            </div>
            {/* <img
              src={src}
              alt="banner"
              className="w-full lg:h-31.3rem xl:h-31.3rem h-auto rounded-xl object-cover"
            /> */}
            <div className="flex flex-wrap pt-4 justify-between">
              <div className="single-blog-content">
                <div className="xl:text-sm text-xs font-light">{date}</div>
                <div className="md:text-xl text-lg font-bold md:my-4 my-3 underline">
                  {blog.title}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: blog.description,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Filters */}
        </div>
      </div>
    </>
  );
}
