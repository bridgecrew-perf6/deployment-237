import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import * as API from "./../../api/api";
import dateFormat from "dateformat";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import {
    Edit,
    Delete
} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    buttonColor: {
        backgroundColor: '#041232',
        color: 'white',
    },
    greenBadge: {
        backgroundColor: '#46ba80',
        color: 'white'
    }
});

const DeleteModal = ({
    isDelete,
    deleteEvt,
    cancelDel
}) => {
    return (
        <>
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
                                className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none mx-2"
                                onClick={deleteEvt}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-4 xl:px-4 px-8 lg:w-44 xl:w-44 w-auto  text-sm tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary uppercase text-white transition duration-500 ease-in-out focus:outline-none opacity-80"
                                cancel
                                onClick={cancelDel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function TicketScanner({ setCreate, setEdit,tenat_event }) {
    const classes = useStyles();
    const history = useHistory();
    const [tableData, setTableData] = useState([]);
    const [isDelete, setIsDelete] = useState({
        isOpen: false,
        delData: null
    });
    const [loading, setLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
        TicketScanners();
    }, [tenat_event]);

    async function TicketScanners() {
        setLoading(true);
        try {
            const res = await API.get_ticket_scanner(userData.id);
            if (res.status == 200) {
                setTableData(res.data);
            }
            setLoading(false);
        } catch (e) { }
    }

    const deleteTS = async (item) => {
        setIsDelete({
            ...isDelete,
            isOpen: true,
            delData: item
        });
    }
    const confirmDelete = async (data) => {
        try {
            const res = await API.delete_ticket_scanner(isDelete.delData.id);
            if (res.data && res.data.message) {
                cancelDelete();
                TicketScanners();
            }
        } catch (e) { }
    }

    const cancelDelete = () => {
        setIsDelete({
            ...isDelete,
            isOpen: false
        })
    }
    return (
        <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
            <div className={classes.header}>
                <span>
                    <div className="uppercase font-medium text-secondary">Ticket Scanner</div>
                    <div className=" font-medium text-gray-400 mb-2">All Ticket Scanners</div>
                </span>
                <span>
                    <Button variant="contained" size="small" className={classes.buttonColor}
                        onClick={() => setCreate()}>
                        Create Ticket Scanner
                    </Button>
                </span>
            </div>
            <hr />
            {loading ? <div className="w-full h-auto rounded-xl shadow-lg bg-white mt-5 p-4">
                Loading...
            </div> :
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>User Name</TableCell>
                                {/* <TableCell>Phone Number</TableCell>
                                <TableCell>Street Address</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Zip Code</TableCell> */}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(tableData && tableData.length > 0) ? tableData.map((item, index) => {
                                return (
                                    <TableRow
                                        key={index}
                                        className="hover:bg-gray-200 cursor-default"
                                    >
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {item.username}
                                        </TableCell>
                                        {/* <TableCell>{item.number}</TableCell>
                                        <TableCell>{item.street_address}</TableCell>
                                        <TableCell>{item.state}</TableCell>
                                        <TableCell>{item.city_name}</TableCell>
                                        <TableCell>{item.zip}</TableCell> */}
                                        <TableCell>
                                            <Edit style={{ cursor: "pointer" }} fontSize="small" onClick={() => setEdit(item)} />
                                            <Delete style={{ cursor: "pointer" }} fontSize="small" onClick={() => deleteTS(item)} />
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : <>
                                <div className="w-full h-auto p-4">
                                    No Data Found
                                </div>
                            </>}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {isDelete.isOpen && <DeleteModal delData={isDelete} deleteEvt={confirmDelete} cancelDel={cancelDelete} />}
        </div>
    );
}
