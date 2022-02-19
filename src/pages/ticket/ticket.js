import React from "react";
import PDF from "react-to-pdf";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
const ref = React.createRef();

export default function Ticket(props) {
  const location = useLocation();

  const ticket = location.state.ticket;
  return (
    <div className="bg-white">
      <div className="bg-white mt-10" ref={ref}>
        <div className=" divide-y-2 divide-innerBG divide-dashed ticket-cont sm:w-full">
          <div className="flex flex-col">
            <div className="flex p-5 rounded-xl justify-left bg-innerBG">
              <img src={Logo} alt="my ticket genius" className="w-auto h-24" />
              <div className="ml-10 playfair flex flex-col my-auto text-3xl text-white">
                Event Mania
              </div>
            </div>
            <div class="grid grid-rows-2 grid-flow-col gap-4 my-4 text-innerBG event-txt">
              <div class="col-span-2">
                <div className="font-light">{ticket.booking_type} Name</div>
                <div className="font-semibold text-xl">{ticket.item_name}</div>
              </div>
              <div class="col-span-2">
                <div className="font-light">Address</div>
                <div className="font-semibold text-xl">{ticket.address}</div>
              </div>
              <div class="md:row-span-2 col-span-2 my-auto ">
                <div className="flex flex-col text-right">
                  <div className="font-light">Ticket #</div>
                  <span className="font-bold text-4xl">{ticket.TICKET_ID}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-evenly pt-2 barcode-cont">
            <div className="my-auto">
              <QRCode
                value={ticket.booking_id}
                level="H"
                fgColor="#0A1E5E"
                size="110"
              />
            </div>
            <div className="my-auto qr2">
              <Barcode
                value={ticket.booking_id}
                lineColor="#0A1E5E"
                height="90"
              />
            </div>
          </div>
        </div>
      </div>

      <PDF targetRef={ref} filename="MyTicket.pdf" x={0} y={20}>
        {({ toPdf }) => (
          <div className="text-center w-full pdf-btn">
            <button
              className="bg-gradient-to-r from-primary to-secondary py-2 lg:px-1 xl:px-1 px-8 lg:w-24 xl:w-24 w-auto  text-xs tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary text-white transition duration-500 ease-in-out focus:outline-none"
              onClick={toPdf}
            >
              Save as PDF
            </button>
          </div>
        )}
      </PDF>
    </div>
  );
}
