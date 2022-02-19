import React, { useState, useEffect } from "react";
import {
    Email,
    Person,
    VpnKey,
    Visibility,
    VisibilityOff
} from "@material-ui/icons";
import * as API from "../../api/api";
import * as appUtil from "../../helper/appUtils";
import CityData from "../../data/city.json";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import Multiselect from 'multiselect-react-dropdown';

const initialError = {
    field: "",
    message: "",
};

export const SwalPopup = ({
    setOpen,
    setClose,
    errorList
}) => {
    return (
        <>
            <Dialog
                open={setOpen}
                onClose={setClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"The given data was invalid."}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ marginBottom: '0px !important' }}>
                        <List dense={true}>
                            {errorList.map((eData, eIndex) => {
                                return <ListItem>
                                    <ListItemText
                                        primary={`${eIndex + 1}  ${eData}`}
                                        secondary={null}
                                    />
                                </ListItem>
                            })}
                        </List>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={setClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default function TicketScannerForm({ setCreate, editData,eventsList }) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [stateDatas, setStateDatas] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [msg, setMsg] = useState(null);
    const [eventIds, setEventIds] = useState([]);
    const event_ids = [];

    const onEventSelected = (selectedList, selectedItem) => {
        eventIds.push(selectedItem['id']);
        setEventIds(eventIds);
    }

    const onEventDeSelected = (selectedList, removedItem) => {
        let temp = eventIds;
        let index = temp.indexOf(removedItem['id']);
        temp.splice(index, 1);
        setEventIds(temp);
    }


    const [togglePasEye, setPasEye] = useState(false);
    const [toggleCnfPasEye, setCnfPasEye] = useState(false);

    useEffect(() => {
        if (editData && editData.id) {
            setEditFields(editData);
        }
    }, []);

    const setEditFields = (item) => {
        for (var prop in item.scanner_events) {
            event_ids.push(item.scanner_events[prop].id)
            setEventIds(event_ids);
        }
        setFormData({
            ...formData,
            id: item.id,
            scannerEvents : item.scanner_events,
            first_name: item.first_name,
            last_name: item.last_name,
            number: item.number,
            email: item.email,
            username: item.username,
            city_name: item.city_name,
            street_address: item.street_address,
            state: item.state,
            zip: item.zip,
            password: "",
            conf_password: "",
        });
    }

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        conf_password: ""
    });

    const [errorEmail, setErrorEmail] = useState("");
    const [errorUName, setErrorUName] = useState(initialError);
    const [errorPassword, setErrorPassword] = useState(initialError);
    const [errorCnfPassword, setErrorCnfPassword] = useState("");
    const [openSwal, setOpenSwal] = useState(false);
    const [errorList, setErrList] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const cityOptions = [];
    CityData.map((item) => {
        const option = {
            value: item.id.toString(),
            label: item.en_name,
        };
        cityOptions.push(option);
    });

    const handleClick = async () => {
        setMsg(null);
        const flag = validateInput();
        if (!flag) {
            return;
        }
        formData.is_active = 1;
        formData.event_ids = eventIds;
        formData.vendor_id = userData.id;
        formData.first_name = `Ticket Scanner - ${userData.first_name}`;
        formData.last_name = `Ticket Scanner - ${userData.last_name}`;
        formData.number = userData.number;
        formData.city_name = userData.city_name;
        await API.create_ticket_scanner(formData).then(res => {
            if (res.data.errors) {
                let errorArray = [];
                Object.keys(res.data.errors).map(key => {
                    errorArray.push(res.data.errors[key][0]);
                });
                setErrList(errorArray)
                setOpenSwal(true);
            } else {
                setCreate();
            }
        }).catch(err => {
        })
    };

    const closeSwall = () => {
        setOpenSwal(false);
    }

    function validateInput() {
        const {
            email,
            username,
            password,
            conf_password
        } = formData;
        let flag = true;

        if (email != null) {
            setErrorEmail({
                field: "email",
                message: "",
            });
        } else {
            setErrorEmail({
                field: "email",
                message: "Please enter email address",
            });
            flag = false;
        }

        if (username != null) {
            setErrorUName({
                field: "username",
                message: "",
            });
        } else {
            setErrorUName({
                field: "username",
                message: "Please enter user name",
            });
            flag = false;
        }

        let validateUN = appUtil.validateName(username);
        if (validateUN === 1) {
            setErrorUName({
                field: "username",
                message: "",
            });
        }
        if (!(validateUN === 1)) {
            let msg = "";
            if (validateUN === 0) {
                msg = "Please enter user name";
                flag = false;
            } else {
                // msg = "Please check user name format";
                flag = true;
            }
            setErrorUName({
                field: "username",
                message: msg,
            });
        }

        let validateEmail = appUtil.validateEmail(email);
        if (validateEmail === 1) {
            setErrorEmail({
                field: "email",
                message: "",
            });
        }
        if (!(validateEmail === 1)) {
            let msg = "";
            if (validateEmail === 0) {
                msg = "Please enter your email.";
            } else {
                msg = "Please check your email format.";
            }
            setErrorEmail({
                field: "email",
                message: msg,
            });
            flag = false;
        }

        if (editData && editData.id) {
            if (password === "") {
                delete formData.password;
                delete formData.conf_password;
            } else {
                let validatePassword = appUtil.validatePass(password);
                let validateCnfPassword = appUtil.validatePass(conf_password);
                let msgPass = "", msgCnfPass = "";
                // Validate password in edit mode if entered
                if (validatePassword === 1 || validatePassword === 0) {
                    setErrorPassword({
                        field: "password",
                        message: "",
                    });
                } else {
                    msgPass =
                        "Password must contains minimum eight characters, at least one letter, one number and one special character.";
                    flag = false;
                }
                setErrorPassword({
                    field: "password",
                    message: msgPass,
                });

                // Validate confirm password in edit mode if entered
                if (validateCnfPassword === 1 || validateCnfPassword === 0) {
                    setErrorCnfPassword({
                        field: "conf_password",
                        message: "",
                    });
                } else if (password !== conf_password) {
                    msgCnfPass = "Confirm password does not match.";
                    flag = false;
                } else {
                    msgCnfPass =
                        "Password must contains minimum eight characters, at least one letter, one number and one special character.";
                    flag = false;
                }
                setErrorCnfPassword({
                    field: "conf_password",
                    message: msgCnfPass,
                });
            }
        } else {
            let validatePassword = appUtil.validatePass(password);
            if (validatePassword === 1) {
                setErrorPassword({
                    field: "password",
                    message: "",
                });
            }
            if (!(validatePassword === 1)) {
                let msg = "";
                if (validatePassword === 0) {
                    msg = "Please enter the password.";
                } else {
                    msg =
                        "Password must contains minimum eight characters, at least one letter, one number and one special character.";
                }
                setErrorPassword({
                    field: "password",
                    message: msg,
                });
                flag = false;
            }

            let validateCnfPassword = appUtil.validatePass(conf_password);
            if (validateCnfPassword === 1) {
                setErrorCnfPassword({
                    field: "conf_password",
                    message: "",
                });
            }
            if (!(validateCnfPassword === 1)) {
                let msg = "";

                if (validateCnfPassword === 0) {
                    msg = "Please enter the confirm password.";
                } else if (password !== conf_password) {
                    msg = "Password does not match.";
                } else {
                    msg =
                        "Password must contains minimum eight characters, at least one letter, one number and one special character.";
                }
                setErrorCnfPassword({
                    field: "conf_password",
                    message: msg,
                });
                flag = false;
            }
        }
        return flag;
    }

    return (
        <div>
            <div className="flex flex-wrap">
                <div className="w-full xl:my-0 lg:my-0 my-5 p-2 relative h-auto">
                    <div className="p-6 overflow-visible shadow-lg rounded-2xl h-full bg-white">
                        <div>
                            <span className="text-lg font-semibold">{'Create'} Ticket Scanner</span>
                            <div className="flex flex-wrap -mx-3 mt-2 chivo">
                                <div className="w-full px-3 mb-5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-semibold px-1 text-theme"
                                    >
                                        User Name
                                    </label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <Person fontSize="small" />
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            readOnly={false}
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                                            placeholder="vaibhavsinha619"
                                        />
                                    </div>
                                    {errorUName.field === "username" && (
                                        <p className="absolute text-xs text-red-600 mt-2">
                                            {errorUName.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full px-3 mb-5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-semibold px-1 text-theme"
                                    >
                                        Assign Event
                                    </label>
                                    <div className="flex">
                                    <Multiselect
                                        className="w-full"
                                        showArrow="true"
                                        selectedValues={formData.scannerEvents}
                                        onSelect={onEventSelected}
                                        onRemove={onEventDeSelected}
                                        options={eventsList} // Options to display in the dropdown
                                        displayValue="title" // Property name to display in the dropdown options
                                    />
                                    </div>
                                </div>
                                <div className="w-full px-3 mb-5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-semibold px-1 text-theme"
                                    >
                                        Email
                                    </label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            readOnly={false}
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                                            placeholder="vaibhavsinha619@gmail.com"
                                        />
                                    </div>
                                    {errorEmail.field === "email" && (
                                        <p className="absolute text-xs text-red-600 mt-2">
                                            {errorEmail.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full px-3 mb-5">
                                    <label
                                        htmlFor="password"
                                        className="text-xs font-semibold px-1 text-theme"
                                    >
                                        Password
                                    </label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <VpnKey fontSize="small" />
                                        </div>
                                        <input
                                            type={!togglePasEye ? "password" : "text"}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                                            placeholder="********"
                                        />
                                        <div style={{ marginLeft: -35 }} className="z-10 text-center flex items-center justify-center">
                                            {!togglePasEye ?
                                                <Visibility style={{ cursor: "pointer" }} fontSize="small" onClick={() => setPasEye(!togglePasEye)} />
                                                : <VisibilityOff style={{ cursor: "pointer" }} fontSize="small" onClick={() => setPasEye(!togglePasEye)} />
                                            }
                                        </div>
                                    </div>
                                    {errorPassword.field === "password" && (
                                        <p className="absolute text-xs text-red-600 mt-2">
                                            {errorPassword.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full px-3 mb-5">
                                    <label
                                        htmlFor="conf_password"
                                        className="text-xs font-semibold px-1 text-theme"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <VpnKey fontSize="small" />
                                        </div>
                                        <input
                                            type={!toggleCnfPasEye ? "password" : "text"}
                                            name="conf_password"
                                            id="conf_password"
                                            value={formData.conf_password}
                                            onChange={handleChange}
                                            className="w-full text-theme -ml-10 pl-10 pr-3 py-2 rounded-2xl border-2 border-gray-200 outline-none focus:border-innerBG"
                                            placeholder="********"
                                        />
                                        <div style={{ marginLeft: -35 }} className="z-10 text-center flex items-center justify-center">
                                            {!toggleCnfPasEye ?
                                                <Visibility style={{ cursor: "pointer" }} fontSize="small" onClick={() => setCnfPasEye(!toggleCnfPasEye)} />
                                                : <VisibilityOff style={{ cursor: "pointer" }} fontSize="small" onClick={() => setCnfPasEye(!toggleCnfPasEye)} />
                                            }
                                        </div>
                                    </div>
                                    {errorCnfPassword.field === "conf_password" && (
                                        <p className="absolute text-xs text-red-600 mt-2">
                                            {errorCnfPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex -mx-3 playfair py-3">
                                <div className="px-3" style={{ width: '20%' }}>
                                    <button
                                        className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-2xl px-3 py-3 font-semibold focus:outline-none"
                                        onClick={handleClick}
                                    >
                                        Save
                                    </button>
                                </div>
                                <div className="px-3" style={{ width: '20%' }}>
                                    <button
                                        className="block w-full max-w-xs mx-auto bg-gradient-to-r from-primary to-secondary hover:to-primary uppercase font-bold hover:from-secondary text-white rounded-2xl px-3 py-3 font-semibold focus:outline-none"
                                        onClick={setCreate}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-green-400 text-center my-2">
                                {msg}
                            </div>
                            {openSwal && <SwalPopup setOpen={openSwal} setClose={closeSwall} errorList={errorList} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
