/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "BudgetAlertSNS": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "KillSwitch": {
      "name": string
      "type": "sst.aws.Function"
    }
    "MonitorCloudFrontMetrics": {
      "name": string
      "type": "sst.aws.Function"
    }
    "Showcase": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}