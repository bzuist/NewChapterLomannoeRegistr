import { authorities } from "./authorities";

export interface principal{
  authorities: authorities[];
  username: string;
}
