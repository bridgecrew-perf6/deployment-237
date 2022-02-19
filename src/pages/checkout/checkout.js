import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PaymentIcon from "@material-ui/icons/Payment";
import CheckIcon from "@material-ui/icons/Check";
import StepConnector from "@material-ui/core/StepConnector";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage: "linear-gradient( 95deg,#C4282C 0%,#ED821F 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage: "linear-gradient( 95deg, #C4282C 0%,#ED821F 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#0A1E5E",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage: "linear-gradient( 90deg, #C4282C 0%, #ED821F 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage: "linear-gradient( 136deg, #C4282C 0%, #ED821F 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <ReceiptIcon />,
    2: <PaymentIcon />,
    3: <CheckIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // background: "red",
  },
  button: {
    // color: "white",
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Ticket", "Payment", "Confirmation"];
}

function getStepContent(
  step,
  adultCount,
  setAdultCount,
  childCount,
  setChildCount
) {
  switch (step) {
    case 0:
      return (
        <div className="divide-y px-4 xl:px-10 divide-secondary h-96">
          <div className="text-right cursor-pointer py-2">
            Select New Showtime
          </div>
          <div className="py-2">
            <div>How many tickets</div>
            <div className="my-5">
              <span className="mr-5 text-lg">Adults</span>
              <ButtonGroup
                size="small"
                aria-label="small outline-none button group"
                className="bg-white"
              >
                {/* {displayCounter && ( */}
                <Button
                  className="focus:outline-none"
                  onClick={() => setAdultCount(adultCount - 1)}
                >
                  -
                </Button>
                <Button disabled>{adultCount}</Button>

                <Button
                  className="focus:outline-none"
                  onClick={() => setAdultCount(adultCount + 1)}
                >
                  +
                </Button>
              </ButtonGroup>
            </div>
            <div className="my-5">
              <span className="mr-6 text-lg">Childs</span>
              <ButtonGroup
                size="small"
                aria-label="small outline-none button group"
                className="bg-white"
              >
                {/* {displayCounter && ( */}
                <Button
                  className="focus:outline-none"
                  onClick={() => setChildCount(childCount - 1)}
                >
                  -
                </Button>
                <Button disabled>{childCount}</Button>

                <Button
                  className="focus:outline-none"
                  onClick={() => setChildCount(childCount + 1)}
                >
                  +
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="divide-y px-10 divide-secondary h-96">
          Payment Gateway
        </div>
      );
    case 2:
      return (
        <div className="divide-y px-10 divide-secondary h-96">Confirmation</div>
      );
    default:
      return "Unknown step";
  }
}

export default function Checkout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(1);

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        style={{ background: "#001232" }}
      >
        {steps.map((label) => (
          <Step key={label} className="bg-theme px-2">
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              className="text-white"
            >
              <span className="text-white">{label}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="lg:px-16 xl:px-24 px-8 text-white">
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>Thank you</Typography>
            <Button onClick={handleReset} className={classes.button}>
              <span className="text-white">Reset</span>
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(
                activeStep,
                adultCount,
                setAdultCount,
                childCount,
                setChildCount
              )}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                <span className="text-white"> Back</span>
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
