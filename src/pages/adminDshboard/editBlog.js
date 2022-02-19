import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ControlPoint, Delete, Edit, Image, Title } from "@material-ui/icons";
import CKEditor from "ckeditor4-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as C from "../../const";
import * as API from "../../api/api";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "red",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const initialUserList = {
  id: "",
  email: "",
  first_name: "",
  last_name: "",
  number: "",
};

const initialData = {
  id: "",
  image: "",
  title: "",
  description: "",
  status: "",
  old_image: "",
};

const initialBlogData = {
  title: "",
  description: "",
  image: "",
};

const inititalError = {
  field: "",
  message: "",
};

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

export default function EditBlog() {
  const classes = useStyles();
  const [blog, setBlog] = useState([initialUserList]);
  const [formData, setFormData] = useState(initialData);
  const [blogData, setBlogData] = useState(initialBlogData);
  const [isEdit, setIsEdit] = useState(false);
  const [addBlog, setAddBlog] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [errorTitle, setErrorTitle] = useState(inititalError);
  const [errorDescription, setErrorDescription] = useState(inititalError);
  const [errorImage, setErrorImage] = useState(inititalError);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function BlogApi() {
      try {
        const response = await API.blog_fetching();
        const data = [];
        response.data.map((item) => {
          return data.push(item);
        });
        setBlog(data);
        setLoading(false);
      } catch (e) {}
    }
    BlogApi();
  }, [isEdit]);

  const handleEdit = (id) => {
    const data = blog.filter((item) => {
      if (item.id === id) {
        const imageNameArray = item.image.split("/");
        setImageName(imageNameArray[imageNameArray.length - 1]);
        return item;
      }
      return;
    });
    setFilteredData(data[0]);
    setIsEdit(true);
  };

  const handleBlogEdit = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const img = e.target.files[0];
    setFormData({ ...formData, ["image"]: img });
    setImageName(img.name);
  };

  const handleStatusChange = (e) => {
    // setState(!state);
    setFilteredData({
      ...filteredData,
      ["is_active"]: !filteredData.is_active,
    });
  };

  const handleEditor = (e, fieldName) => {
    setFilteredData({ ...filteredData, ["description"]: e });
  };

  const handleUpdate = async () => {
    try {
      let requestObj = new FormData();
      requestObj.append("id", filteredData.id);
      requestObj.append("title", filteredData.title);
      requestObj.append("description", filteredData.description);
      if (formData.image) {
        requestObj.append("image", formData.image);
      }
      requestObj.append("old_image", filteredData.image);
      requestObj.append("is_active", filteredData.is_active ? "1" : "0");
      const response = await API.update_blog(requestObj);
      if (response.status == 200) {
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const handleDelete = (id) => {
    setBlogId(id);
    setIsDelete(true);
  };

  const handleBlogDelete = async () => {
    try {
      const response = await API.delete_blog(blogId);
      if (response.status == 200) {
        setIsDelete(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const addNewBlog = async () => {
    const flag = validateInput();
    if (!flag) {
      return;
    }
    try {
      let requestObj = new FormData();
      requestObj.append("title", blogData.title);
      requestObj.append("description", blogData.description);
      requestObj.append("image", blogData.image);
      const response = await API.blog_posting(requestObj);
      if (response.status == "200") {
        setAddBlog(false);
        setIsEdit(false);
      }
    } catch (e) {}
  };

  function validateInput() {
    const { title, description, image } = blogData;
    let flag = true;
    if (title) {
      if (title.length < 5) {
        setErrorTitle({
          field: "title",
          message: "Title must be atleast 5 characters",
        });
      }
      setErrorTitle({
        field: "title",
        message: "",
      });
    } else {
      setErrorTitle({
        field: "title",
        message: "Please enter the title",
      });
      flag = false;
    }

    if (description) {
      if (description.length < 20) {
        setErrorDescription({
          field: "description",
          message: "Description must be atleast 20 characters",
        });
      }
      setErrorDescription({
        field: "description",
        message: "",
      });
    } else {
      setErrorDescription({
        field: "description",
        message: "Please enter the description",
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

  const handleNewFileUpload = (e) => {
    const img = e.target.files[0];
    setBlogData({ ...blogData, ["image"]: img });
  };

  const handleNewEditor = (e) => {
    setBlogData({ ...blogData, ["description"]: e });
  };

  const handleNewBlog = (e) => {
    const { name, value } = e.target;
    setBlogData({
      ...blogData,
      [name]: value,
    });
  };

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="flex flex-row justify-between">
        <div>
          <div className="uppercase font-medium text-secondary">Blog</div>
          <div className=" font-medium text-gray-400 mb-2">
            All Posted Blogs
          </div>
        </div>
        <div>
          <button
            onClick={() => setAddBlog(true)}
            className="px-4 py-2 bg-gray-100 focus:outline-none rounded-xl hover:bg-gray-200"
          >
            <ControlPoint /> Add New Blog
          </button>
        </div>
      </div>
      <hr />
      {loading ? (
        <div className="my-2 text-lg">Loading...</div>
      ) : blog.length > 0 ? (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="w-1/8">Image</TableCell>
                <TableCell className="w-1/4">Title</TableCell>
                <TableCell className="w-3/5">Description</TableCell>
                {/* <TableCell>Account Details</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blog.map((blog) => {
                const src = C.URL + "/" + blog.image;
                return (
                  <TableRow
                    key={blog.id}
                    className="hover:bg-gray-200 cursor-default"
                  >
                    <TableCell>
                      <span className="capitalize ">
                        <img src={src} alt={blog.title} />
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize ">{blog.title}</span>
                    </TableCell>

                    <TableCell>
                      <span
                        className="blog2"
                        dangerouslySetInnerHTML={{
                          __html: blog.description,
                        }}
                      ></span>
                    </TableCell>

                    <TableCell>
                      {blog.is_active == "1" ? (
                        <div className="bg-green-500 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-green-500 absolute right-0"></div>
                        </div>
                      ) : (
                        <div className="bg-red-600 rounded-full w-10 h-6 relative">
                          <div className="h-6 w-6 bg-white rounded-full border-2 border-red-600 absolute"></div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-2">
                        <div
                          onClick={() => handleEdit(blog.id)}
                          className="cursor-pointer"
                        >
                          <Edit fontSize="small" />
                        </div>
                        |
                        <div
                          onClick={() => handleDelete(blog.id)}
                          className="cursor-pointer"
                        >
                          <Delete fontSize="small" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="my-2 text-lg">Not data found</div>
      )}

      {isEdit && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="title"
                      className="text-xs font-semibold px-1"
                    >
                      Title
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Title />
                      </div>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={filteredData.title}
                        onChange={handleBlogEdit}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="w-full px-3 mb-5 flex flex-row ">
                    <div className="w-2/3">
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
                        {imageName ? (
                          <label
                            className="w-full text-red-400"
                            htmlFor="poster"
                          >
                            {imageName}
                          </label>
                        ) : (
                          <label
                            className="w-full text-gray-400"
                            htmlFor="poster"
                          >
                            Upload Image
                          </label>
                        )}
                        <input
                          type="file"
                          id="poster"
                          className="hidden"
                          // value={filteredData[0].image}
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    <div className="w-1/3">
                      <div className="px-3 mb-3">
                        <label
                          htmlFor="email"
                          className="text-xs font-semibold px-1"
                        >
                          Status
                        </label>
                        <div className="flex">
                          {/* {state}
                      {filteredData[0].status} */}
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                checked={
                                  filteredData.is_active == "0" ? false : true
                                }
                                onChange={handleStatusChange}
                                name="checkedB"
                              />
                            }
                            className="pl-2"
                            // label="iOS style"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-3 mb-3">
                    <label
                      htmlFor="description"
                      className="text-xs font-semibold px-1"
                    >
                      Description
                    </label>
                    <div className="flex">
                      {/* <CKEditor
                        data={filteredData.description}
                        onChange={handleEditor}
                        className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      /> */}
                      <ReactQuill name="about" theme="snow" value={filteredData.description} onChange={(e) => handleEditor(e, 'description')}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules}
                        formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                    </div>
                    {/* {errorEmail.field === "email" && (
                          <p className="text-xs text-red-600 mt-2">
                            {errorEmail.message}
                          </p>
                        )} */}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDelete && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Sure, you want to delete?
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleBlogDelete}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addBlog && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex flex-col -mx-3 chivo">
                  <div className="w-full px-3 mb-6 relative">
                    <label
                      htmlFor="title"
                      className="text-xs font-semibold px-1"
                    >
                      Title
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <Title />
                      </div>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        // value={filteredData.title}
                        onChange={handleNewBlog}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Blog Title"
                      />
                    </div>
                    {errorTitle.field === "title" && (
                      <p className="text-xs text-red-600 mt-2 absolute">
                        {errorTitle.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full px-3 mb-5 flex flex-row relative">
                    <div className="w-full relative">
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
                        {blogData.image ? (
                          <label
                            className="w-full text-red-400"
                            htmlFor="poster"
                          >
                            {blogData.image.name}
                          </label>
                        ) : (
                          <label
                            className="w-full text-gray-400"
                            htmlFor="poster"
                          >
                            Upload Image
                          </label>
                        )}
                        <input
                          type="file"
                          id="poster"
                          className="hidden"
                          // value={filteredData[0].image}
                          onChange={handleNewFileUpload}
                        />

                        {errorImage.field === "image" && (
                          <p className="text-xs text-red-600 -bottom-5 absolute">
                            {errorImage.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-3 mb-6 relative">
                    <label
                      htmlFor="description"
                      className="text-xs font-semibold px-1"
                    >
                      Description
                    </label>
                    <div className="flex">
                      {/* <CKEditor
                        // data={filteredData.description}
                        onChange={handleNewEditor}
                        className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                      /> */}
                      <ReactQuill name="about" theme="snow" onChange={(e) => handleNewEditor(e)}
                        className="text-theme outline-none focus:border-innerBG"
                        modules={modules}
                        formats={formats}
                        style={{ width: "100%", height: '100%' }} />
                    </div>
                    {errorDescription.field === "description" && (
                      <p className="text-xs text-red-600 mt-2 absolute">
                        {errorDescription.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={addNewBlog}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setAddBlog(false);
                    setBlogData(initialBlogData);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
