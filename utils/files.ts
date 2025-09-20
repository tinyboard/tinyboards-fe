/** Convert a data URL to a File object. */
export const dataURLtoFile = (dataURL: string): File => {
  const type = dataURL.split(";")[0].slice(5);

  const arr = dataURL.split(",");
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `upload.${type.split("/")[1]}`, { type: type });
};
