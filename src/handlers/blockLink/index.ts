import axios from "axios";
// import { isValidURL, ValidateIPaddress } from "@/utils/checkValidURL";
export function isValidURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export function getValidImageURL(url: string) {
  if (isValidURL(url)) {
    return url;
  } else {
    let nurl;
    if (process.env.NODE_ENV == "development") {
      nurl = `http://localhost:3000${url}`;
    } else {
      nurl = `https://lumbytes.com${url}`;
    }
    return nurl;
  }
}

// validate IP address
export function ValidateIPaddress(ipaddress: string) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
}

export async function fetchMetaData(url: string) {
  const { data } = await axios.post(`/fetchMetaData`, {
    url,
  });
  return data;
}

export function markInvalidInput(msg: string) {
  return {
    success: 0,
    msg,
  };
}

// block if
// 1. url is not valid
// 2. url is an IP address
// 3. url is a localhost
//
export async function KeyPressEventHandler(link: string) {
  const validURL = isValidURL(link);

  if (validURL) {
    const u = new URL(link);
    const validIPDomain = ValidateIPaddress(u.hostname);
    const httpProtocol = u.protocol === "http:";
    const localDomain =
      u.hostname === "localhost" || u.hostname === "127.0.0.1";

    if (localDomain) {
      return markInvalidInput("Local domain is not allowed.");
    }
    if (validIPDomain || httpProtocol) {
      return markInvalidInput("Insecure URL");
    }
  } else {
    return markInvalidInput("Invalid URL");
  }

  const data = await fetchMetaData(link);
  return data;
}
