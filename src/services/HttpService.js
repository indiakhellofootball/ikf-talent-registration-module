import Axios from "axios";
import { encryptRequestPayload } from "../utils/Encryption";
const Config = require("../config/ClientConfig").DEVELOPMENT;

// Axios.interceptors.response

export const postRequest = async (baseUrl, requestPayload) => {
  try {
    // if (!Config.ENV || !Config.ENV === "development")
    requestPayload = await encryptRequestPayload(requestPayload);
    let response = await Axios.post(
      Config.API_ENDPOINT + baseUrl,
      requestPayload
    );
    return response;
  } catch (error) {
    throw new Error("Server Is Not Responding,Please Try Again Later !");
  }
};
