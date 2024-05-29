/* tslint:disable */
/* eslint-disable */
import "sst";
declare module "sst" {
  export interface Resource {
    SharpLayer: {
      type: "sst.sst.Secret";
      value: string;
    };
  }
}
export {};
