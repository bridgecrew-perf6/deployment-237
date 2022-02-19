import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  ControlPoint,
  Delete,
  Edit,
  Title,
  Image,
  CategoryRounded,
} from "@material-ui/icons";
import * as API from "../../api/api";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const initialData = {
  name: "",
};

const initialError = {
  field: "",
  message: "",
};

export default function Booking() {
  const classes = useStyles();
  const [categoryData, setCategoryData] = useState([{ name: "" }]);
  const [formData, setFormData] = useState(initialData);
  const [addBlog, setAddBlog] = useState(false);
  const [errorName, setErrorName] = useState(initialError);
  const [categoryId, setCategoryId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [errorUpdateName, setErrorUpdateName] = useState(initialError);
  useEffect(() => {
    async function EventHistory() {
      try {
        const response = await API.category();
        const data = [];
        response.data.map((item) => {
          return data.push(item);
        });
        setCategoryData(data);
      } catch (e) {}
    }
    EventHistory();
  }, [addBlog, isEdit, isDelete]);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      ["name"]: value,
    });
  };

  const handleAdd = async () => {
    const flag = validateInput();
    console.log(flag);
    if (!flag) {
      return;
    }
    try {
      const requestObj = {
        name: formData.name,
      };
      const response = await API.add_category(requestObj);
      if (response.status == 200) {
        setAddBlog(false);
      }
    } catch (e) {}
  };

  const validateInput = () => {
    const { name } = formData;
    let flag = true;
    if (name) {
      setErrorName({
        field: "name",
        message: "",
      });
    } else {
      setErrorName({
        field: "name",
        message: "Please enter the name",
      });
      flag = false;
    }
    return flag;
  };

  const handleDelete = (id) => {
    setCategoryId(id);
    setIsDelete(true);
  };

  const handleEdit = (id) => {
    const data = categoryData.filter((item) => {
      if (item.id === id) {
        return item;
      }
    });
    setFilteredData(data[0]);
    setIsEdit(true);
  };

  const handleCategoryEdit = (e) => {
    const { name, value } = e.target;
    setFilteredData({
      ...filteredData,
      [name]: value,
    });
  };

  const validateUpdateData = () => {
    const { name } = filteredData;
    let flag = true;
    if (name) {
      setErrorUpdateName({
        field: "name",
        message: "",
      });
    } else {
      setErrorUpdateName({
        field: "name",
        message: "Please enter the name",
      });
      flag = false;
    }
    return flag;
  };

  const handleUpdate = async () => {
    const flag = validateUpdateData();
    if (!flag) {
      return;
    }
    // return;
    try {
      let requestObj = {
        id: filteredData.id,
        name: filteredData.name,
      };

      const response = await API.update_category(requestObj);
      console.log(response);
      if (response.status == 200) {
        setIsEdit(false);
      }
    } catch (e) {}
  };

  const handleBlogDelete = async () => {
    try {
      console.log(categoryId);
      const response = await API.delete_category(categoryId);
      console.log(response);
      if (response.status == 200) {
        setIsDelete(false);
        // setIsEdit(false);
      }
    } catch (e) {}
  };

  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
      <div className="flex flex-row justify-between">
        <div>
          <div className="uppercase font-medium text-secondary">Category</div>
          <div className=" font-medium text-gray-400 mb-2">All Category</div>
        </div>
        <div>
          <button
            onClick={() => setAddBlog(true)}
            className="px-4 py-2 bg-gray-100 focus:outline-none rounded-xl hover:bg-gray-200"
          >
            <ControlPoint /> Add New Category
          </button>
        </div>
      </div>

      <hr />

      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>

              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData.map((item) => {
              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-200 cursor-default"
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    <div className="flex gap-2 justify-end">
                      <div
                        onClick={() => handleEdit(item.id)}
                        className="cursor-pointer"
                      >
                        <Edit fontSize="small" />
                      </div>
                      |
                      <div
                        onClick={() => handleDelete(item.id)}
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
                      Category
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <CategoryRounded />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="title"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                        placeholder="Category Name"
                      />
                    </div>

                    {errorName.field === "name" && (
                      <p className="text-xs text-red-600 mt-2 absolute">
                        {errorName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAdd}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setAddBlog(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <div className="bg-white pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="w-full px-3 mb-3">
                      <label
                        htmlFor="title"
                        className="text-xs font-semibold px-1"
                      >
                        Category Name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <CategoryRounded />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="title"
                          value={filteredData.name}
                          onChange={handleCategoryEdit}
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
                          placeholder="Category Name"
                        />
                      </div>
                      {errorUpdateName.field === "name" && (
                        <p className="text-xs text-red-600 mt-2 absolute">
                          {errorUpdateName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
    </div>
  );
}
