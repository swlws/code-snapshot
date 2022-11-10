/**
 * 将Unicode编码，转化为单子节
 *
 * convert a Unicode string to a string in which
 * each 16-bit unit occupies only one byte
 *
 * @param {*} string
 * @returns
 */
function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

/**
 * 还原为Unicode
 *
 * @param {*} binary
 * @returns
 */
function fromBinary(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const charCodes = new Uint16Array(bytes.buffer);
  let result = "";
  for (let i = 0; i < charCodes.length; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

// a string that contains characters occupying > 1 byte
const myString = "☸☹☺☻☼☾☿";

// 编码
const encoded = btoa(toBinary(myString));
console.log(encoded); // OCY5JjomOyY8Jj4mPyY=

// 解码
console.log(fromBinary(atob(encoded)));
