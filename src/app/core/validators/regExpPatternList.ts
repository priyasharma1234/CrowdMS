export const regExpPattern: { [key: string]: string | RegExp } = {

  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  GSTIN2: /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[0-9]{1}[Zz]{1}[0-9]{1}$/,
  PAN: /^[A-Za-z]{3}[Pp]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/,
  //Udyogno: /^[A-Za-z]{2}d{2}[A-Za-z]{1}d{7}&/,
  Udyogno: /^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{7}$/,
  UdyamRegNo:/^[A-Z]{5}[-][0-9]{2}[-][0-9]{2}[-][0-9]{7}$/,
  validDateYYYYMMDD: /^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/,
  validDateDDMMYYYY: /^2[0-9]|3[01]-(0[1-9]|1[0-9]|[0-9]{4}-(0[1-9]|1[012]))$/,
  alpha: /^[A-Za-z]+$/,
  numeric: /^[0-9]+$/,
  alphanumeric: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
  mobile: /^[456789][0-9]{9}$/,
  // prev
  //  email: /^\S+@\S+\.[A-Za-z]\S+$/,
  //new
  email: /[a-z0-9\._%+!$&*=^|~#%'`?{}\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  accountNumber: /^[A-Za-z0-9]{9,18}$/,
  pincode: /^\d{6}$/,
  alphanumericdot: /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
  alphaWithSpecialChar: /^[a-zA-Z\s\W]+$/,
  cin: /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/
};
