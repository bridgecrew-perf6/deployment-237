import React, { useState } from "react";
import { Image, Title } from "@material-ui/icons";
import CKEditor from "ckeditor4-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as API from "./../../api/api";
const initialFormData = {
  title: "",
  description: "",
  image: "",
};

export default function Blog() {
  const [formData, setFormData] = useState(initialFormData);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorImage, setErrorImage] = useState("");
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {
    let flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      let requestObj = new FormData();
      requestObj.append("title", formData.title);
      requestObj.append("description", formData.description);
      requestObj.append("image", formData.image);
      await API.blog_posting(requestObj);
    } catch (e) {}
  };

  function validateInput() {
    const { title, description, image } = formData;
    let flag = true;

    if (title) {
      setErrorTitle({
        field: "title",
        message: "",
      });
    } else {
      setErrorTitle({
        field: "title",
        message: "Please enter the blog title",
      });
      flag = false;
    }

    if (description) {
      setErrorDescription({
        field: "description",
        message: "",
      });
    } else {
      setErrorDescription({
        field: "description",
        message: "Please enter the blog description",
      });
      flag = false;
    }

    if (image) {
      setErrorImage({
        field: "image",
        message: "",
      });
    } else {
      setErrorImage({
        field: "image",
        message: "Please upload the blog image",
      });
      flag = false;
    }
    return flag;
  }

  const handleFileUpload = (e) => {
    const img = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: img });
  };

  const handleEditor = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e });
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex flex-wrap -mx-3 chivo">
          <div className="lg:w-1/2 xl:w-1/2 w-full relative px-3 mb-8">
            <label
              htmlFor="title"
              className="text-xs font-semibold px-1 text-theme"
            >
              Title
            </label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Title fontSize="small" />
              </div>
              <input
                type="text"
                name="title"
                id="title"
                onChange={handleChange}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                placeholder="Blog Title"
              />
            </div>
            {errorTitle.field === "title" && (
              <p className="text-xs absolute text-red-600 mt-2">
                {errorTitle.message}
              </p>
            )}
          </div>

          <div className="lg:w-1/2 xl:w-1/2 w-full relative px-3 mb-8">
            <label
              htmlFor="poster"
              className="text-xs font-semibold px-1 text-theme"
            >
              Blog Image
            </label>
            <div className="flex bg-white py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <Image fontSize="small" />
              </div>
              <label className="w-full text-gray-400" htmlFor="poster">
                Upload Image
              </label>
              <input
                type="file"
                id="poster"
                name="image"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            {errorImage.field === "image" && (
              <p className="text-xs absolute text-red-600 mt-2">
                {errorImage.message}
              </p>
            )}
          </div>

          <div className="w-full relative px-3 mb-8">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold px-1 text-theme"
            >
              Confirm Password
            </label>
            <div className="flex">
              {/* <CKEditor
                data=""
                name="description"
                onChange={handleEditor}
                className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
              /> */}
              <ReactQuill name="about" theme="snow" value="" onChange={(e) => handleEditor(e, 'description')}
                className="text-theme outline-none focus:border-innerBG"
                modules={modules}
                formats={formats}
                style={{ width: "100%", height: '100%' }} />
            </div>
            {errorDescription.field === "description" && (
              <p className="text-xs absolute text-red-600 mt-2">
                {errorDescription.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex -mx-3 playfair">
          <div className="w-full px-3 mb-20">
            <button
              className="block w-full max-w-xs  bg-gradient-to-r from-primary to-secondary hover:to-primary font-bold hover:from-secondary text-white rounded-lg px-3 py-3 font-semibold focus:outline-none"
              onClick={handleClick}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
