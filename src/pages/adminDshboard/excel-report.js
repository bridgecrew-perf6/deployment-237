import React,{useEffect,useState} from 'react'
import * as API from "./../../api/api";
const Excelreport = () => {
    const [excel, setExcel] = useState([])
    const excelData = async () => {
        try {
            const respons = await API.excel_report();
            setExcel(respons.data.message)
            console.log("respons", respons.data.message);
        } catch (e){
            console.log("Error", e);
        }
    }
    useEffect(() => {
        excelData()
        
    }, [])
    return (
        <>
            <div className="w-full h-auto rounded-xl shadow-lg bg-white p-4">
                <h2 className="text-lg font-semibold">{excel}</h2>
            </div>
        </>
    )
}

export default Excelreport
