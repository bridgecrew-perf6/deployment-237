const RegEx = {
  // email: /^([\w-]+@([\w-]+\.)+[\w-]{2,20})?$/,
  email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
  number: /^-?[\d.]+(?:e-?\d+)?$/,
  price: /^\d{1,8}(?:\.\d{1,2})?$/,
  address: /^[a-zA-Z\s\d.#:\-;,'\\ ]+$/,
  name: /^[a-zA-Z ]+$/,
  city: /^[a-zA-Z . 0-9]+$/,
  mobileNumber: /^(\+{0,1}?[0-9]{1,3}-{0,1}? {0,1}?)?[0-9]{9,11}$/,
  numberFormat: /^[0-9 ]+$/,
  message: /^[a-zA-Z\s\d . -]+$/,
  couponCode: /^[A-Z0-9-]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};
function capitalize(str) {
  str = str.split(" ");

  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(" ");
}

export function toUpperCase(str) {
  if (str) {
    return str.toUpperCase();
  }
  return str;
}

// export function base64Encode(value) {
//   if (value) {
//     return btoa(value);
//   }
//   return value;
// }

// export function base64Decode(value) {
//   if (value) {
//     return atob(value);
//   }
//   return value;
// }

function getFormatedInteger(value) {
  try {
    value = Math.round(parseInt(value));
    return format(value);
  } catch (error) {
    console.log("Error Parsing int");
  }
  return value;
}

function getFormatedFloat(value) {
  try {
    value = Math.round(parseFloat(value));
    return format(value);
  } catch (error) {
    console.log("Error Parsing float");
  }
  return value;
}

function format(x) {
  var negative = x < 0,
    str = String(negative ? -x : x),
    arr = [],
    i = str.indexOf("."),
    j;

  if (i === -1) {
    i = str.length;
  } else {
    for (j = str.length - 1; j > i; j--) {
      arr.push(str[j]);
    }
    arr.push(".");
  }
  i--;

  for (j = 0; i >= 0; i--, j++) {
    if (j > 2 && j % 2 === 1) {
      arr.push(",");
    }
    arr.push(str[i]);
  }

  if (negative) {
    arr.push("-");
  }

  return arr.reverse().join("");
}

const ascendingSortListBasedOnKey = (key) => {
  return function (a, b) {
    if (a[key] > b[key]) {
      return 1;
    } else if (a[key] < b[key]) {
      return -1;
    }
    return 0;
  };
};

const descendingSortListBasedOnKey = (key) => {
  return function (a, b) {
    if (a[key] > b[key]) {
      return -1;
    } else if (a[key] < b[key]) {
      return 1;
    }
    return 0;
  };
};

const descendingSortList = () => {
  return function (a, b) {
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    }
    return 0;
  };
};

const descendingDateSortListBasedOnKey = (key) => {
  return function (a, b) {
    const aTime = new Date(a[key]).getTime();
    const bTime = new Date(b[key]).getTime();
    if (aTime > bTime) {
      return -1;
    } else if (aTime < bTime) {
      return 1;
    }
    return 0;
  };
};

const getSumFromArray = (array) => {
  let sum = 0.0;
  try {
    sum = array.reduce((accumulator, element) => {
      return accumulator + parseFloat(element);
    }, 0.0);
  } catch (error) {
    console.log("error parsing float value : ", error, array);
  }
  return sum.toFixed(2);
};

export const APP_UTIL = {
  getFormatedInteger: getFormatedInteger,
  getFormatedFloat: getFormatedFloat,
  ascendingSortListBasedOnKey: ascendingSortListBasedOnKey,
  descendingSortListBasedOnKey: descendingSortListBasedOnKey,
  descendingSortList: descendingSortList,
  getSumFromArray: getSumFromArray,
  descendingDateSortListBasedOnKey: descendingDateSortListBasedOnKey,
  capitalize: capitalize,
};

export function validatePrice(price) {
  let errorPrice = 0;
  if (price.trim() === "") {
    errorPrice = 0;
  } else if (RegEx.numberFormat.test(price)) {
    errorPrice = 1;
  } else {
    errorPrice = 2;
  }
  return errorPrice;
}

export function validateRating(price) {
  let errorRating = 0;
  if (price.trim() === "") {
    errorRating = 0;
  } else if (RegEx.number.test(price)) {
    errorRating = 1;
  } else {
    errorRating = 2;
  }
  return errorRating;
}

export function validateEmail(email) {
  let errorEmail = 0;
  if (email.trim() === "") {
    errorEmail = 0;
  } else if (RegEx.email.test(email)) {
    errorEmail = 1;
  } else {
    errorEmail = 2;
  }
  return errorEmail;
}

export function validateAddress(address) {
  let errorName = 0;
  if (address.toString() === "") {
    errorName = 0;
  } else if (RegEx.address.test(address)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}

export function validateCity(city) {
  let errorName = 0;
  if (city.toString() === "") {
    errorName = 0;
  } else if (RegEx.city.test(city)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}
export function validateHieght(hieght) {
  let errorName = 0;
  if (hieght.trim() === "") {
    errorName = 0;
  } else if (RegEx.numberFormat.test(hieght)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}
export function validateName(name) {
  let errorName = 0;
  if (name.toString() === "") {
    errorName = 0;
  } else if (RegEx.name.test(name)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}

export function validateMessage(name) {
  let errorName = 0;
  if (name.toString() === "") {
    errorName = 0;
  } else if (RegEx.message.test(name)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}

export function validateMedicalId(name) {
  let errorName = 0;
  if (name.toString() === "") {
    errorName = 0;
  } else if (RegEx.numberFormat.test(name)) {
    errorName = 1;
  } else {
    errorName = 2;
  }
  return errorName;
}

export function validatePass(pass) {
  let errorPassNo = 0;
  if (pass.trim() === "") {
    errorPassNo = 0;
    //   } else if (RegEx.password.test(pass)) {
    // } else if (pass.length >= 8 && pass.length < 32) {
  } else if (RegEx.password.test(pass)) {
    errorPassNo = 1;
  } else {
    errorPassNo = 2;
  }
  return errorPassNo;
}

export function validatePhoneNumber(phone) {
  let errorPhoneNo = 0;
  if (phone.trim() === "") {
    errorPhoneNo = 0;
  } else if (RegEx.mobileNumber.test(phone) && phone.length === 10) {
    errorPhoneNo = 1;
  } else {
    errorPhoneNo = 2;
  }
  return errorPhoneNo;
}

export function validatePinCode(pin) {
  let errorPin = 0;
  if (pin.trim() === "") {
    errorPin = 0;
  } else if (pin.length === 6) {
    errorPin = 1;
  } else {
    errorPin = 2;
  }
  return errorPin;
}

// export function checkProductInCart(productId, productsInCart) {
//   let flag = false;
//   if (productsInCart.hasOwnProperty("data")) {
//     if (productsInCart.data.hasOwnProperty("productList")) {
//       productsInCart.data.productList.map((data, index) => {
//         if (productId.trim() + "" === data.id.trim() + "") {
//           flag = true;
//         }
//       });
//     }
//   }
//   return flag;
// }
// export async function appSettings() {
//   let multiProductInCart = "false";
//   let multiProductInCartResp = await commonService.getSettings("");

//   multiProductInCartResp.map((item, index) => {
//     if (item.hasOwnProperty("settingName")) {
//       if (item.settingName == "multiProductInCart") {
//         multiProductInCart = item.settingValue;
//       }
//     }
//   });
//   return multiProductInCart;
// }

export function getDisplayDate(value) {
  if (value) {
    try {
      const d = new Date(value);
      return (
        ("0" + d.getDate()).slice(-2) +
        "/" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "/" +
        d.getFullYear()
      );
    } catch (error) {
      console.log("Error displaying date in the required format : ", error);
    }
  }
  return value;
}

export function getCountryCode() {
  const COUNTRY_CODE = "+91";

  return COUNTRY_CODE;
}
