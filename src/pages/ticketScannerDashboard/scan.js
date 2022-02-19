import { useState, useEffect } from "react";
import { CameraAlt, ConfirmationNumber, Person } from "@material-ui/icons";
import QrReader from "react-qr-reader";
import Button from "../../components/button/button";
import * as API from "../../api/api";
const initialResult = {
  delay: 50000,
  result: "",
};
export default function Scan() {
  const [formData, setFormData] = useState(initialResult);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);
  const [msg, setMsg] = useState("");
  const [failMsg, setFailMsg] = useState("");
  const [scannedMsg, setScannedMsg] = useState("");
  const [scannedTc, setScannedTc] = useState(false);
  const [loader, setLoader] = useState(false);
  const handleCamera = () => {
    setSubmitButton(false);
    setCameraOpen(true);
  };
  const handleScan = (data) => {
    if (data) {
      API.get_booking_status(data).then(res => {
        if (res.data && res.data.message === "Already Scanned") {
          setScannedTc(true);
          setCameraOpen(false);
          setCameraOpen(true);
          setScannedMsg("Ticket already scanned.!");
          setTimeout(() => {
            setScannedMsg("");
            setScannedTc(false);
            setScannedTc(false);
            setCameraOpen(false);
            setCameraOpen(true);
          }, 3000);
        } else {
          setFormData({
            ...formData,
            result: data,
          });
          setCameraOpen(false);
          setSubmitButton(true);
        }
      })
    }
  };

  const handleError = (err) => {
    console.error(err);
  };
  const previewStyle = {
    height: 300,
    width: 300,
  };

  const handleSubmit = async () => {
    setMsg("");
    setFailMsg("");
    setLoader(true);
    try {
      const requestObj = {
        booking_id: formData.result,
      };
      const response = await API.update_booking_status(requestObj);
      if (response.status === 200) {
        setFormData({
          ...formData,
          result: "",
        });
        setMsg(response.data.message);
        setLoader(false);
      } else {
        setLoader(false);
        setFailMsg("Not a valid ticket");
      }
    } catch (e) {}
  };
  
  useEffect(() => {
    return () => {
      setCameraOpen(false);
    }
  }, []);
  
  return (
    <div className="w-full h-auto rounded-xl shadow-lg bg-white lg:p-6 md:p-5 p-4 dashboard-top-space scan-wrapper">
      <div className="flex flex-row justify-between">
        <div>
          <div className="uppercase lg:text-xs text-sm font-semibold text-theme">Scan</div>
          <div className=" font-medium text-gray-400 mb-2">Scan</div>
        </div>
      </div>
      <div>
        <div>
          <div className="flex mb-5">
            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
              <ConfirmationNumber fontSize="small" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={formData.result}
              // onChange={handleChange}
              className="xl:w-1/2 lg:w-1/2 w-full text-theme md:-ml-10 -ml-9 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-innerBG"
              placeholder="Booking Id"
            />
            <div
              className=" my-auto p-2 ml-2 border-2 rounded-lg border-gray-200"
              onClick={handleCamera}
            >
              <CameraAlt />
            </div>
          </div>
          {scannedMsg && <div className="text-red-500 my-3" style={{ fontSize: '20px' }}>{scannedMsg}</div>}
          {cameraOpen && (
            <QrReader
              delay={300}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              legacymode={true}
              className={scannedTc ? "scanning-cam" : "qr-reader-block"}
            />
          )}
          {submitButton && (
            <>
              <Button onClick={handleSubmit} disable={loader}>
                {loader ? (
                  <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
              {msg && <div className="text-green-500">{msg}</div>}
              {failMsg && <div className="text-red-500">{failMsg}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
