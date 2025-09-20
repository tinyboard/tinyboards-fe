/** Convert a data URL to a File object. */
export const dataURLtoFile = (dataURL: string | ArrayBuffer): File => {
  let dataURLStr: string;
  if (typeof dataURL === "string") {
    dataURLStr = dataURL;
  } else {
    dataURLStr = Buffer.from(dataURL).toString();
  }
  const type = dataURLStr.split(";")[0].slice(5);

  const arr = dataURLStr.split(",");
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `upload.${type.split("/")[1]}`, { type: type });
};
