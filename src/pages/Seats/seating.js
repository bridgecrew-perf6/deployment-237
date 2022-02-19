import { SeatsioClient, Region } from "seatsio";
import Banner from "../../components/banner/banner";
import Button from "../../components/button/button";
// import useScript from "./useScript";
function Seating() {
  // useScript("https://cdn-na.seatsio.net/chart.js");
  async function fun() {
    let client = new SeatsioClient(
      Region.NA(),
      "f1309c1b-99bd-4274-be79-a383143b19dc"
    );

    console.log(client.events.book());

    //     // FOR CREATING CHART AND EVENT
    //     // let chart =  await client.charts.create();
    //     // let event = await client.events.create(chart.key)

    //     //  FOR FETCHING REPORTS OF PARTICULAR EVENT

    //     //  byStatus
    //     //  byCategoryLabel
    //     //  byCategoryKey
    //     //  byLabel
    //     //  byOrderId

    //     let report = await client.eventReports.byStatus(
    //       "7bad5f82-650a-4ca7-8c76-6463c67d25ff"
    //     );
    //     console.log(report);
  }
  fun();

  // var chart = new seatsio.SeatingChart({
  //     divId: "chart",
  //     workspaceKey: "f1309c1b-99bd-4274-be79-a383143b19dc",
  //     event: "6f401611-6263-6dbe-bae1-1ada4178cbb8"
  // }).render();

  //  console.log(seatingChart.selectedObjects);
  var selectedSeats = [];
  const SeatsIo = window.seatsio;
  console.log("🚀 ~ file: seating.js ~ line 36 ~ Seating ~ SeatsIo", SeatsIo);

  const chart = new SeatsIo.SeatingChart({
    divId: "seatChart",
    workspaceKey: "23950b1c-23d5-452f-a91b-ba5a40cdd09e",
    event: "103a45cd-95da-4b54-b8c3-09401fbd6601",
    pricing: [
      { category: 1, price: 80 },
      { category: 2, price: 40 },
      { category: 3, price: 30 },
    ],
    priceFormatter: function (price) {
      return "$" + price;
    },
    onObjectSelected: function (object) {
      // add the selected seat id to the array
      selectedSeats.push(object.label);
    },
    onObjectDeselected: function (object) {
      // remove the deselected seat id from the array
      var index = selectedSeats.indexOf(object.label);
      if (index !== -1) selectedSeats.splice(index, 1);
    },
  }).render();

  const handleClick = () => {
    console.log("Clicked");
    console.log(selectedSeats);
    async function fun() {
      let client = new SeatsioClient(
        Region.NA(),
        "f1309c1b-99bd-4274-be79-a383143b19dc"
      );

      const response = client.events.book(
        "103a45cd-95da-4b54-b8c3-09401fbd6601",
        selectedSeats
      );
      console.log(response);
    }
    fun();
  };

  return (
    <>
      <Banner />
      <div>
        <div style={{ height: "580px" }}>
          <div className="text-white">Please select you seats</div>
          <div id="seatChart"></div>
        </div>
      </div>
      <Button onClick={handleClick}>Book</Button>
      {/* <h2>ad</h2> */}
    </>
  );
}

export default Seating;
