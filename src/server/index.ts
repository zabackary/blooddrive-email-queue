import { doGet, doPost } from "./webapp";

topLevelFunction.doGet = doGet;
topLevelFunction.doPost = doPost;

export interface ServerGlobals {
  doGet: typeof doGet;
  doPost: typeof doPost;
}
