import { doGet, upload } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.upload = upload;

export interface ServerGlobals {
  doGet: typeof doGet;
  upload: typeof upload;
}
