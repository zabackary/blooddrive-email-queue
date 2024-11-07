import { doGet, sendMail } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.sendMail = sendMail;

export interface ServerGlobals {
  doGet: typeof doGet;
  sendMail: typeof sendMail;
}
