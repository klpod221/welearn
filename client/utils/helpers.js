// String to base64 conversion
export const stringToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// Convert KB to MB
export const kbToMb = (kb) => {
  return (kb / 1024).toFixed(2);
};
