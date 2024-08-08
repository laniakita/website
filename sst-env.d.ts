/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "DevSharpLayer": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "LaniAkitaWeb": {
      "type": "sst.aws.Nextjs"
      "url": string
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
