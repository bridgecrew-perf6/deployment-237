import Popcorn from "./../../assets/icons/popcorn.png";
import Tomato from "../../assets/icons/tomato.png";
export default function Card(props) {
  const { img, name, rating, popularity, price, sellingPrice, discount } =
    props;

  return (
    <div className="w-full relative hover:shadow-xl 31.3rem relative">
      <div
        className="h-96 bg-cover rounded-lg"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      <div className="-mt-2 h-1/4  rounded bg-gradient-to-r from-primary to-secondary w-full text-white p-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg chivo">
        <div className="text-2xl pb-3 h-16">{name}</div>
        <div className="flex flex-row py-3 text-center">
          <div className="w-1/2">
            <img src={Tomato} alt="tomato" className="float-left mr-2" />
            <div>{rating}%</div>
          </div>
          <div className="w-1/2">
            <img src={Popcorn} alt="popcorn" className="float-left mr-2" />
            <div>{popularity}%</div>
          </div>
        </div>
        <div className="flex flex-row pt-3 text-center text-lg">
          <div className="w-1/2">
            {discount > 0 && <div>$ {sellingPrice}</div>}
          </div>
          <div className={`w-1/2 ${discount > 0 && "line-through"}`}>
            <div>$ {price}</div>
          </div>
        </div>
      </div>
      {discount > 0 && (
        <div className="absolute text-white bg-gradient-to-r from-primary to-secondary top-1 rounded-xl h-5 w-20 right-1 px-auto">
          <div className="mx-auto text-center text-sm font-semibold">
            -{discount}%
          </div>
        </div>
      )}
    </div>
  );
}
