import axios from "axios";

import * as c from "./../const";

axios.interceptors.request.use(
  (req) => {
     if(localStorage.getItem("tenat_event") && localStorage.getItem("tenat_event") !== "all")
     {
      req.headers.Authorization = localStorage.getItem("tenat_event");
     }
     return req;
  },
  (err) => {
     return Promise.reject(err);
  }
);

// import cors from "cors";
export async function add_category(data) {
  try {
    let url = c.CATEGORY;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

//CHART
export async function chart(data) {
  try {
    let url = c.CHART;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

// export async function delete_category(data) {
//   try {
//     let url = c.DELETE_CATEGORY + "/" + data;
//     let res = await axios.get(url);
//     return res;
//   } catch (e) {
//     return e.response;
//   }
// }

export async function register(data) {
  try {
    let url = c.REGISTER;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function search(data) {
  try {
    let url = c.SEARCH;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function reset(data) {
  try {
    let url = c.RESET;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}
export async function getAllStates() {
  try {
    let url = c.STATES;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function getAllCitiesByState(data) {
  try {
    let url = c.CITIESBYSTATE + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}
export async function earning_by_vendor(data) {
  try {
    let url = c.EARNING_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e;
  }
}
export async function earning_by_admin() {
  try {
    let url = c.EARNING_BY_ADMIN;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function category() {
  try {
    let url = c.CATEGORY;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function getTags() {
  try {
    let url = c.TAGS;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function vendor_update(data) {
  try {
    let url = c.VENDOR;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}
export async function withdrawal_history(data) {
  try {
    let url = c.WITHDRAWAL_HISTORY + "?id=" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function withdrawal_request(data) {
  try {
    let url = c.WITHDRAWAL_REQUEST;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function withdrawal_request_by_vendor() {
  try {
    let url = c.WITHDRAWAL_REQUEST_BY_VENDOR;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function change_password(data) {
  try {
    let url = c.CHANGE_PASSWORD;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function refund(data) {
  console.log(data);
  const expDate =
    "20" +
    data.credit_card.exp_date.substr(-2) +
    "-" +
    data.credit_card.exp_date.substr(0, 2);
    const varNma = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: c.API_KEY,
          transactionKey: c.TRANSACTION_KEY,
        },
        refId: "123456",
        transactionRequest: {
          transactionType: "refundTransaction",
          amount: data.amount,
          payment: {
            creditCard: {
              cardNumber: data.credit_card.card_number,
              expirationDate: expDate,
              cardCode: data.credit_card.cvv,
            },
          },
          refTransId: data.transId
        },
      },
    };

    try {
      const url = c.PAYMENT;
      const pres = await axios.post(url, varNma);
  
      if (
        pres.data.hasOwnProperty("transactionResponse") &&
        pres.data.transactionResponse.responseCode == 1
      ) {
  
        const finalData = {
          ...data,
          ...pres.data,
        };

        try {
          let url = c.REFUND+'/'+data.id;
          let res = await axios.get(url);
          return res;
        } catch (e) {
          return e.response;
        }
      }  else {
        return { 'status': 409, "msg": pres.data.transactionResponse.errors[0].errorText };
      }
    } catch (e) {
      return e.response;
    }
}


export async function book_now(data) {


  const expDate =
    "20" +
    data.credit_card.exp_date.substr(-2) +
    "-" +
    data.credit_card.exp_date.substr(0, 2);

  const varNma = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: c.API_KEY,
        transactionKey: c.TRANSACTION_KEY,
      },
      refId: "123456",
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: data.amount,
        payment: {
          creditCard: {
            cardNumber: data.credit_card.card_number,
            expirationDate: expDate,
            cardCode: data.credit_card.cvv,
          },
        },
        authorizationIndicatorType: {
          authorizationIndicator: "final",
        },
      },
    },
  };

  try {
    const url = c.PAYMENT;
    const pres = await axios.post(url, varNma);

    if (
      pres.data.hasOwnProperty("transactionResponse") &&
      pres.data.transactionResponse.responseCode == 1
    ) {

      const finalData = {
        ...data,
        ...pres.data,
      };

      try {
        let url = c.BOOKING;
        let res = await axios.post(url, finalData);
        let transactionDetails = {
          status: 200,
          transaction_id: "292093390449",
        };
        return transactionDetails;
      } catch (e) {
        return e.response;
      }
    } else {
      return { 'status': 409, "msg": pres.data.transactionResponse.errors[0].errorText };
    }
  } catch (e) {
    return e.response;
  }

  // if (responseCode === 1) {
  //   try {
  //     let url = c.BOOKING;
  //     let res = await axios.post(url, data);
  //     return res;
  //   } catch (e) {
  //     return e.response;
  //   }
  // } else {
  //   console.log("transaction failure");
  // }
}

export async function user_update(data) {
  try {
    let url = c.USER;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function user_delete(data) {
  try {
    let url = c.USER_DELELTE + "/" + data;

    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function vendor_delete(data) {
  try {
    let url = c.VENDOR_DELETE + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function subscription(data) {
  try {
    let url = c.SUBSCRIBE;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function reset_password(data) {
  try {
    let url = c.RESET_PASSWORD;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function get_subscription(data) {
  try {
    let url = c.SUBSCRIBE;
    let res = await axios.get(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

//BOOKING

export async function get_booking() {
  try {
    let url = c.BOOKING;
    let res = await axios.get(url);
    console.log(res);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function get_booking_by_vendor(data) {
  try {
    let url = c.BOOKING_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

// Ticket scanner
export async function get_ticket_scanner(data) {
  try {
    let url = c.GET_TS + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_ticket_scanner(data) {
  try {
    let url = c.DELETE_TS + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function create_ticket_scanner(data) {
  try {
    let url = data.id ? c.UPDATE_TS : c.CREATE_TS;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function earning_by_vendor_by_id(data) {
  try {
    let url = c.EARNING_BY_VENDOR_BY_ID + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function get_booking_by_user(data) {
  try {
    let url = c.BOOKING_BY_USER + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_booking_by_vendor(data) {
  try {
    let url = c.DELETE_BOOKING_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function blog_posting(data) {
  try {
    let url = c.BLOG;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

//UPDATE BOOKING STATUS
export async function update_booking_status(data) {
  try {
    let url = c.UPDATE_BOOKING_STATUS;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

// GET BOOKING STATUS FOR CHECK ALREADY SCANNED OR NOT
export async function get_booking_status(data) {
  try {
    let url = c.GET_BOOKING_STATUS + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

//PAID WITHDRAWAL HISTORY
export async function paid_withdrawal_history(data) {
  try {
    let url = c.PAID_WITHDRAWAL_HISTORY;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

//EVENTS
export async function event() {
  try {
    let url = c.EVENT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function upcoming_event() {
  try {
    let url = c.UPCOMING_EVENT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function now_showing_event() {
  try {
    let url = c.NOW_SHOWING_EVENT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function exclusive_event() {
  try {
    let url = c.EXCLUSIVE_EVENT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function add_event(data) {
  try {
    let url = c.EVENT;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function add_coupon(data) {
  try {
    let url = c.COUPON;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function coupon() {
  try {
    let url = c.COUPON;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function concert_offer() {
  try {
    let url = c.CONCERT_OFFER;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function event_offer() {
  try {
    let url = c.EVENT_OFFER;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function validate_coupon(data) {
  try {
    let url = c.VALIDATE_COUPON + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function event_by_vendor(data) {
  try {
    let url = c.EVENT_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function update_event(data) {
  try {
    let url = c.EVENT;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_event(data) {
  try {
    let url = c.DELETE_EVENT + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function update_event_status(data) {
  try {
    let url = c.UPDATE_EVENT_STATUS;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_coupon(data) {
  try {
    let url = c.DELETE_COUPON + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function update_category(data) {
  try {
    let url = c.CATEGORY;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_category(data) {
  try {
    let url = c.DELETE_CATEGORY + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

//CONCERTS
export async function concert() {
  try {
    let url = c.CONCERT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function upcoming_concert() {
  try {
    let url = c.UPCOMING_CONCERT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function now_showing_concert() {
  try {
    let url = c.NOW_SHOWING_CONCERT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function exclusive_concert() {
  try {
    let url = c.EXCLUSIVE_CONCERT;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function add_concert(data) {
  try {
    let url = c.CONCERT;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function concert_by_vendor(data) {
  try {
    let url = c.CONCERT_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function update_concert(data) {
  try {
    let url = c.CONCERT;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function delete_concert(data) {
  try {
    let url = c.DELETE_CONCERT + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

//MOVIES
export async function movies() {
  try {
    let url = c.MOVIE;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}
export async function movie_by_vendor(data) {
  try {
    let url = c.MOVIE_BY_VENDOR + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function delete_movie(data) {
  try {
    let url = c.DELETE_MOVIES + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function add_movies(data) {
  try {
    let url = c.MOVIE;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}
export async function update_movies(data) {
  try {
    let url = c.MOVIE;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function blog_fetching() {
  try {
    let url = c.BLOG;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function single_blog(data) {
  try {
    let url = c.BLOG + "?id=" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function single_event(data) {
  try {
    let url = c.EVENT + "?id=" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function single_concert(data) {
  try {
    let url = c.CONCERT + "?id=" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function update_blog(data) {
  try {
    let url = c.BLOG;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function payment(data) {
  try {
    const options = {
      headers: {
        // authorization:
        //   "MTM2NDU0MmI5OGRlYjliMjZkYzU5OWE3YjgyNzJiOTBiNjk1MDU1ODZmNDMxMmZkZWNmNjYxMDY3NDE4ZmM5Yg==",
        Accept: "application/json",

        // apikey: "y6pWAJNyJyjGv66IsVuWnklkKUPFbb0a",
        // token: "fdoa-a480ce8951daa73262734cf102641994c1e55e7cdf4c02b6",
        apikey: "y6pWAJNyJyjGv66IsVuWnklkKUPFbb0a",
        token: "fdoa-a480ce8951daa73262734cf102641994c1e55e7cdf4c02b6",
        Authorization:
          "MzBjY2ZiZjM0NjMxZjU0ZDcwNzc2NjRjMGRhNDRhNmEwYWZlYzBjNDZlN2MyMGQ5ZThlYWI1MTQ1NmM2NzNlMw",
        // "Access-Control-Allow-Origin": "*",
      },
    };
    let url = "https://api-cert.payeezy.com/v1/transactions";
    // let url = `https://cors-anywhere.herokuapp.com/${payUrl}`;
    console.log(data);
    let res = await axios.get(url, data, options);
    return res;
  } catch (e) {
    console.log(e);
    return e.response;
  }
}

export async function delete_blog(data) {
  try {
    let url = c.DELETE_BLOG + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function login(data) {
  try {
    let url = c.LOGIN;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function contact_us(data) {
  try {
    let url = c.CONTACT_US;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function vendor() {
  try {
    let url = c.VENDOR;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function user() {
  try {
    let url = c.USER;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function single_user(data) {
  try {
    let url = c.USER + "?id=" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

//BOOKING HISTORY REPORT
export async function booking_history(data) {
  try {
    let url = c.BOOKING_HISTORY;
    let res = await axios.post(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function commission(data) {
  try {
    let url = c.COMMISSION + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}

//eXCEL REPORT
export async function excel_report(data) {
  try {
    let url = c.EXCEL_REPORT;
    let res = await axios.get(url, data);
    return res;
  } catch (e) {
    return e.response;
  }
}

export async function transactions(data) {
  try {
    let url = c.TRANSACTIONS + "/" + data;
    let res = await axios.get(url);
    return res;
  } catch (e) {
    console.log(e);
  }
}


// export async function category() {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.CATEGORY;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function sub_category(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.SUB_CATEGORY + "=" + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function category_wise_product(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.CATEGORY_WISE_PRODUCT + "=" + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function trending_product() {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.TRENDING_PRODUCTS;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function popular_category() {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.POPULAR_CATEGORY;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function get_wishlist(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.GET_WISHLIST + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function product_section_all(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         // Accept: "application/json",
//       },
//     };
//     let url = c.PRODUCT_SECTION_ALL + "=" + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function product_section() {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.PRODUCT_SECTION;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function login(data) {
//   try {
//     let url = c.LOGIN;
//     let res = await axios.post(url, data);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function product_details(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.PRODUCT + "=" + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function place_order(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.PLACE_ORDER + "=" + data;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function hotDeals() {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.HOT_DEALS;
//     let res = await axios.get(url, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// // POST METHODS

// export async function upload_prescription(data) {
//   try {
//     const options = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "multipart/form-data",
//       },
//     };
//     let url = c.UPLOAD_PRESCRIPTION;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function reset_password(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//       },
//     };
//     let url = c.RESET_PASSWORD;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function wishlist_store(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//       },
//     };
//     let url = c.WISHLIST_STORE;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function reset(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//       },
//     };
//     let url = c.RESET;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function search_key(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//       },
//     };
//     let url = c.SEARCH_KEY;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function subscribe(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//       },
//     };
//     let url = c.SUBSCRIBE;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function update_profile(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "multipart/form-data",
//       },
//     };
//     let url = c.UPDATE_PROFILE;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function change_password(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "multipart/form-data",
//       },
//     };
//     let url = c.CHANGE_PASSWORD;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     // console.log(e);
//   }
// }

// export async function order_place(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "multipart/form-data",
//       },
//     };
//     let url = c.ORDER;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function register(data) {
//   try {
//     let url = c.REGISTER;
//     let res = await axios.post(url, data);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function contact_us(data) {
//   try {
//     const options = {
//       headers: {
//         authorization:
//           "$2y$10$x4l3Nyiw../BnmWcHcDI3On9ySvVUlKz6MEzbHvsaK0Gsi5G9.W7e",
//         Accept: "application/json",
//       },
//     };
//     let url = c.CONTACT_US;
//     let res = await axios.post(url, data, options);
//     return res;
//   } catch (e) {
//     console.log(e);
//   }
// }

// // export async function uploadNews(data) {
// //   try {
// //     const options = {
// //       headers: {
// //         authorization: "ABCDEFGHIJK",
// //         Accept: "application/json",
// //       },
// //     };
// //     let res = await axios.post(c.NEWS, data, options);
// //     return res;
// //   } catch (e) {
// //     console.log(e);
// //   }
// // }
