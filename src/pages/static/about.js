import { useEffect } from "react";
import Banner from "../../components/banner/banner";
export default function AboutUs() {
  useEffect(() => {
    window["scrollTo"]({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Banner />
      <div className="lg:pt-10 md:pt-5 pt-3.5 text-black w-full bg-theme lg:px-16 xl:px-24 px-4">
        {/* <Breadcrumbs title="Privacy Policy" category="Blog" /> */}
        <div className="my-5 xl:p-10 lg:p-8 md:p-5 p-5 text-white bg-innerBG rounded-xl">
          <div className="mb-2">
            <div className="flex flex-wrap justify-between">
              <div className="">
                <div className="text-xl font-bold mb-4 underline">
                  About Event Mania
                </div>
                <div>
                  <p className="mb-4">Your Privacy Rights</p>
                  <p className="mb-4"><b>Effective Date:</b> June 7,2021</p>
                  <p className="font-semibold mb-4">
                    This Privacy Policy applies to the sites and apps where it
                    appears.
                  </p>
                  <p className="mb-4">
                    This Policy describes how we treat personal information we
                    collect both online and offline. This includes on our
                    websites and in our apps. It also includes at our box
                    offices or in phone or email interactions you have with us.
                    If you live in Canada, please read our Canadian Privacy
                    Policy.
                  </p>
                  <p className="mb-4">
                    Our Privacy Notice has been designed with you in mind. How
                    the notice applies to you will depend on the way in which
                    you interact with us. For example, if you:
                  </p>
                  <ul className="list-disc ml-5">
                    <li className="mb-4">
                      Purchase a ticket from us, we will use the information you
                      provide us to fulfill our obligations to you in delivering
                      that service, and, where permitted, keep you up to date
                      about other events that may be of interest to you; and
                    </li>
                    <li className="mb-4">
                      When you browse our sites, we use cookies to tailor your
                      experience and hopefully provide you with a seamless
                      experience. Your choices and rights under each scenario
                      are explained in more detail below. Click on "Learn More"
                      under each icon for more information or scroll down to
                      read the full policy.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
        </div>
      </div>
    </>
  );
}
