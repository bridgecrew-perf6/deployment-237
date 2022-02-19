import React from "react";
import PDF from "react-to-pdf";

const ref = React.createRef();

const PDFButton = (props) => {
  //   const [show, setShow] = useState(false);
  console.log(props);
  return (
    <>
      <div className="" ref={ref}>
        {props.data}
      </div>

      <PDF targetRef={ref} filename="MyTicket.pdf">
        {({ toPdf }) => (
          <button
            className="bg-gradient-to-r from-primary to-secondary
                        //  py-2 lg:px-1 xl:px-1 px-8 lg:w-24 xl:w-24 w-auto  text-xs tracking-normal rounded-3xl border border-white hover:to-primary hover:from-secondary text-white transition duration-500 ease-in-out focus:outline-none"
            onClick={toPdf}
          >
            Download
          </button>
        )}
      </PDF>
    </>
  );
};

export default PDFButton;
