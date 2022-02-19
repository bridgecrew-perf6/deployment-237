import { useEffect } from "react";
import Banner from "../../components/banner/banner";
import Checkout from "./checkout";
export default function Index() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Banner />
      <div className="lg:px-16 xl:px-24 px-8 text-white text-3xl">Checkout</div>
      <div className="flex flex-wrap pt-5 lg:px-16 xl:px-24 px-8">
        <div className="w-full xl:w-3/4">
          <Checkout />
        </div>
        <div className="w-full xl:w-1/4 order-first xl:order-last">
          <div className="flex flex-col content-center">
            <div className="">
              {/* <img src={Banner} alt="banner" className="w-full px-10" /> */}
            </div>
            <div className="text-center text-secondary my-1 text-2xl">
              Avenger Endgame
            </div>
            <div className="text-left text-white">
              <span className="text-secondary text-semibold mr-1">
                Director:
              </span>
              Joe Russo, Anthony Russo, Joss Whedon
            </div>
            <div className="text-left text-white">
              <span className="text-secondary text-semibold mr-1">Cast:</span>
              Scarlett Johansson, Robert Downey, Jr., Chris Evans
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
