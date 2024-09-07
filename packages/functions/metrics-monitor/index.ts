// originally from: https://blog.burakcankus.com/2024/03/31/disable-aws-cloudfront-distributions-if-budget-is-exceeded.html#1 I've made some slight edits.
import { CloudFrontClient, ListDistributionsCommand } from "@aws-sdk/client-cloudfront";
import { CloudWatchClient, GetMetricDataCommand, MetricDataQuery } from "@aws-sdk/client-cloudwatch";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Context } from "aws-lambda";
import { Resource } from "sst";

const cloudFrontClient = new CloudFrontClient();
const cloudWatchClient = new CloudWatchClient();
const snsClient = new SNSClient();

const SNSTopicARN = Resource.BudgetAlertSNS.arn;

const metricsToTrack = {
  distribution: ["Requests", "BytesDownloaded"],
  function: ["FunctionInvocations"],
  limits: {
    Requests: 10_000_000,
    BytesDownloaded: 1_000_000_000_000,
    FunctionInvocations: 2_000_000,
  },
};

export async function handler(event: Event, context: Context) {
  console.log(`Event: ${JSON.stringify(event)}`);
  console.log(`Context: ${JSON.stringify(context)}`);
  try {
    // Get a list of all CloudFront distributions
    const distributionsResponse = await cloudFrontClient.send(new ListDistributionsCommand({}));

    // Creating a Set to store unique FunctionARN values
    const uniqueFunctionARNs = new Set();

    // Extracting DefaultCacheBehavior FunctionAssociations
    distributionsResponse.DistributionList.Items.forEach(item => {
      if (item.DefaultCacheBehavior && item.DefaultCacheBehavior.FunctionAssociations && item.DefaultCacheBehavior.FunctionAssociations.Items) {
        item.DefaultCacheBehavior.FunctionAssociations.Items.forEach(assoc => {
          uniqueFunctionARNs.add(assoc.FunctionARN);
        });
      }
    });

    // Extracting CacheBehaviors FunctionAssociations
    distributionsResponse.DistributionList.Items.forEach(item => {
      if (item.CacheBehaviors && item.CacheBehaviors.Items) {
        item.CacheBehaviors.Items.forEach(cacheBehavior => {
          if (cacheBehavior.FunctionAssociations && cacheBehavior.FunctionAssociations.Items) {
            cacheBehavior.FunctionAssociations.Items.forEach(assoc => {
              uniqueFunctionARNs.add(assoc.FunctionARN);
            });
          }
        });
      }
    });

    // Converting Set to array
    const allFunctionARNs = Array.from(uniqueFunctionARNs);

    // Get the start and end dates for the current month
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Create an array to hold all the MetricDataQueries
    const metricDataQueries = [];

    distributionsResponse.DistributionList.Items.forEach((distribution, i) => {
      metricsToTrack.distribution.forEach(metric => {
        metricDataQueries.push({
          Id: `distribution_${i + 1}_metric_${metric.toLowerCase()}`,
          MetricStat: {
            Metric: {
              Namespace: 'AWS/CloudFront',
              MetricName: metric,
              Dimensions: [{ Name: 'DistributionId', Value: distribution.Id }, { Name: 'Region', Value: 'Global' }]
            },
            Period: 300,
            Stat: 'Sum'
          },
          ReturnData: true
        });
      });
    });

    allFunctionARNs.forEach((functionARN: string, i) => {
      metricsToTrack.function.forEach(metric => {
        metricDataQueries.push({
          Id: `function_${i + 1}_metric_${metric.toLowerCase()}`,
          MetricStat: {
            Metric: {
              Namespace: 'AWS/CloudFront',
              MetricName: metric,
              Dimensions: [{ Name: "FunctionName", Value: functionARN.split(':function/')[1] }, { Name: 'Region', Value: 'Global' }]
            },
            Period: 300,
            Stat: 'Sum'
          },
          ReturnData: true
        });
      });
    });

    // Execute all promises concurrently and wait for all of them to resolve
    const metricsResults = await fetchCloudWatchMetrics(metricDataQueries, startDate, endDate);

    var exceeded = false;

    Object.keys(metricsResults).forEach(metricType => {
      const sum = metricsResults[metricType];
      console.log(`Metric Type: ${metricType}, Sum: ${sum}, Limit: ${metricsToTrack.limits[metricType]}`);
      if (sum >= metricsToTrack.limits[metricType]) {
        exceeded = true;
      }
    });

    if (exceeded) {
      const params = {
        Subject: 'CloudFront Metric Alert',
        Message: `Metric limit has been exceeded. Disabling all CloudFront Distributions!`,
        TopicArn: SNSTopicARN
      };
      await snsClient.send(new PublishCommand(params));
      console.log("SNS notification sent successfully.");

      return {
        statusCode: 201,
        body: "All CloudFront Distributions will be disabled. Limits has been exceeded."
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(metricsResults)
    };
  }
  catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: "An error occurred while retrieving CloudFront requests."
    };
  }
}

async function fetchCloudWatchMetrics(metricDataQueries: MetricDataQuery[], startDate: Date, endDate: Date) {
  try {
    // Get CloudWatch metrics for the specified metrics and dimensions
    const metricDataResponse = await cloudWatchClient.send(new GetMetricDataCommand({
      MetricDataQueries: metricDataQueries,
      StartTime: startDate,
      EndTime: endDate
    }));

    const aggregatedMetrics = {};

    // Process the responses for each metric
    metricDataResponse.MetricDataResults.forEach(metricData => {
      const metricType = metricData.Label.split(' ')[1];
      const sum = metricData.Values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      aggregatedMetrics[metricType] = (aggregatedMetrics[metricType] || 0) + sum;
    });

    return aggregatedMetrics;
  }
  catch (error) {
    console.error("Error fetching metric data:", error);
    return null;
  }
}
