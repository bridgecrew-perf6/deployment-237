import Bg1 from "../../assets/images/bg1.png";
import Bg2 from "../../assets/images/bg2.png";

import Bg3 from "../../assets/images/bg3.png";
import Bg4 from "../../assets/images/bg4.png";

export default function MostVisited() {
  return (
    <div className="lg:my-10 xl:my-10 my-0 lg:px-24 xl:px-24 px-4 my-4">
      <div className="text-white text-2xl uppercase flex flex-wrap justify-between my-5">
        <div>
          <div>Most visited places</div>
          <div className="text-xs capitalize">Browse Popular location</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        <div
          className="row-span-2 bg-green-200 rounded-xl bg-cover shadow-lg hover:shadow-xl relative bg-blend-difference lg:h-auto xl:h-auto h-72"
          style={{ backgroundImage: `url(${Bg1})` }}
        >
          <div
            className="text-center text-white text-lg text-semibold absolute bottom-5 left-1/2 translate50 px-5 py-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div>Texas</div>
            <div className="text-xs">9 events</div>
          </div>
        </div>

        <div
          className=" bg-green-200 rounded-xl bg-cover shadow-lg hover:shadow-xl relative bg-blend-difference h-72"
          style={{ backgroundImage: `url(${Bg2})` }}
        >
          <div
            className="text-center text-white text-lg text-semibold absolute bottom-5 left-1/2 translate50 px-5 py-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div>Texas</div>
            <div className="text-xs">9 events</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div
            className="lg:w-72 xl:w-72 w-40 bg-green-200 rounded-xl bg-cover shadow-lg hover:shadow-xl relative bg-blend-difference lg:h-72 xl:h-72 h-44 sm:h-40"
            style={{ backgroundImage: `url(${Bg3})` }}
          >
            <div
              className="text-center text-white text-lg text-semibold absolute bottom-5 left-1/2 translate50 px-5 py-1 rounded-lg"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div>Texas</div>
              <div className="text-xs">9 events</div>
            </div>
          </div>
          <div
            className="lg:w-72 xl:w-72 w-40 bg-green-200 rounded-xl bg-cover shadow-lg hover:shadow-xl relative bg-blend-difference lg:h-72 xl:h-72 h-44 sm:h-40"
            style={{ backgroundImage: `url(${Bg4})` }}
          >
            <div
              className="text-center text-white text-lg text-semibold absolute bottom-5 left-1/2 translate50 px-5 py-1 rounded-lg"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div>Texas</div>
              <div className="text-xs">9 events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
