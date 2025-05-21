// String to base64 conversion
export const stringToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};
