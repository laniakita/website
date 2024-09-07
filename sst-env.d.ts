/* tslint:disable */
/* eslint-disable */
import "sst"
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
    "Web": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
export {}
