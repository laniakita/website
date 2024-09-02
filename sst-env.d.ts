/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "APP_URL": {
      "type": "sst.sst.Linkable"
      "url": string
    }
    "Web": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
export {}
