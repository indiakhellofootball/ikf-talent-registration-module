import Axios from "axios";
import IP from "../../config/ClientConfig";
import { encryptRequestPayload } from "./Encryption";
export const sendPostRequest = async (uri, payload, options) => {
  let response = await Axios.post(
    IP.IP + ":" + IP.PORT + uri,
    await encryptRequestPayload(payload),
    options
  );
  return response;
};
