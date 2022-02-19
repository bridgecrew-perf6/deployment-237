//import BannerImg from "./../../assets/images/banner.png";
import Hero from "../../assets/images/bgHome.jpeg";
//import BannerImgM from "./../../assets/images/banner-m.png";
export default function Banner() {
  return (
    <>
      <div
        className="hidden lg:block xl:block w-full bg-red-200 bg-cover bg-center profile-page-banner"
        style={{ backgroundImage: `url(${Hero})`, height: "150px" }}
      ></div>
      <div
        className="lg:hidden xl:hidden block h-80 w-full bg-red-200 bg-cover bg-center profile-page-banner"
        style={{ backgroundImage: `url(${Hero})` }}
      ></div>
    </>
  );
}
