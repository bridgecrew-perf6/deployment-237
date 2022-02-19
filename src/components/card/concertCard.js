export default function Card(props) {
  const { img, name, address, date } = props;
  // const p = price ? JSON.parse(price) : null;

  return (
    <>
      <div className="w-full relative hover:shadow-xl 31.3rem md:block custom-sm-block hidden">
        <div
          className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
          style={{ backgroundImage: `url(${img})` }}
        ></div>

        <div className="-mt-2 h-1/4 rounded bg-gradient-to-r from-primary to-secondary w-full text-white p-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg">
          <div className="text-2xl pb-2 h-16">
            <div className="text-xl leading-tight h-12 title overflow-hidden">
              {name}
            </div>
            {/* <div className="text-sm">{artist}</div> */}
          </div>
          <div className="flex flex-row pt-2 card-address">
            <div className="text-white title">{address}</div>
          </div>
        </div>

        <div className="absolute text-white text-md top-0 left-3 text-center bg-secondary p-2 w-12 rounded-b-lg ">
          {date}
        </div>
      </div>
      <div className="w-full 31.3rem mobile-events-posters bg-gradient-to-r from-primary to-secondary">
        <div
          className="xl:h-96 lg:h-80 md:h-72 h-96 bg-cover bg-center rounded-lg custom-thumb-img"
        >
          <img src={img} alt="event-posters" />
        </div>

        <div className="-mt-2 h-1/4 rounded bg-gradient-to-r from-primary to-secondary w-full text-white p-5 divide-y divide-dashed divide-opacity-30 divide-gray-100 shadow-lg  event-card">
          <div className="text-2xl pb-2 h-16">
            <div className="text-xl leading-tight h-12 title overflow-hidden event-heading">
              {name}
            </div>
            {/* <div className="text-sm">{artist}</div> */}
          </div>
          <div className="flex flex-row pt-2 card-address">
            <div className="text-white title event-address">{address}</div>
          </div>
          <div className="text-white text-md top-0 left-3 text-center bg-secondary p-2 w-12 rounded-b-lg event-date">
            {date}
          </div>
        </div>

        
      </div>
    </>
  );
}
