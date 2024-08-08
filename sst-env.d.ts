/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "DevSharpLayer": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SharpLayer": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "TursoAuth": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "TursoUrl": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
export {}
