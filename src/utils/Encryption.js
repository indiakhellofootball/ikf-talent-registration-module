import uniqid from "uniqid";
import { CryptoJS } from "node-cryptojs-aes";
const encryptAESKeyWithRSA = require("./EncryptionHelper.min.js");
export const encryptRequestPayload = async (requestPayload) => {
  let aesKey = uniqid();
  let ikfek = await encryptAESKeyWithRSA(aesKey);
  let ikfrp = CryptoJS.AES.encrypt(
    JSON.stringify(requestPayload),
    aesKey
  ).toString();
  return { ikfek, ikfrp };
};
