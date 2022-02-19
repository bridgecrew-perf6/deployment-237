import { useEffect } from "react";
import Banner from "../../components/banner/banner";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion() {
  const classes = useStyles();
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className={classes.root}>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl">
          <div className="text-xl font-bold mb-4 underline text-white">FAQs</div>
          <div className="rounded-xl">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Question 1</Typography>
              </AccordionSummary>
              <AccordionDetails className="bg-innerBG text-white">
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>Question 2</Typography>
              </AccordionSummary>
              <AccordionDetails className="bg-innerBG text-white">
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
