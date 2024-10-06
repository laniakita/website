/*
 * The following defines two different methods to
 * disable active CloudFront distributions in an
 * AWS account. Because it's important to disable
 * the distributions ASAP, these methods can be
 * referred to as "kill switches".
 *
 * The first kill switch is activated when a
 * Budget reaches a hard threshold, which will
 * send a notification to an SNS Topic, that
 * will invoke a Lambda function that can
 * actually bring down, and or disable, active
 * CloudFront distributions.
 *
 * The second kill switch is designed to avoid
 * the caveat of the first, which is the fact
 * that the AWS Budget metric is only updated
 * three times per day. This second switch,
 * routinely fetches usage metrics from CloudWatch
 * for all CloudFront distributions, and sends a
 * notification to the SNS Topic that invokes
 * the CloudFront disabler "kill switch" Lambda,
 * once the usage metrics are beyond the defined
 * usage limits.
 *
 * These CloudFront Distribution kill switch
 * methods are implementations of the ones
 * demonstrated by Burak Can Kus^1, in SST/Pulumi.
 * The Lambda function handlers are also heavily
 * inspired by their example source code.
 *  
 * -----------------------------------------------
 *
 * 1. Disable AWS CloudFront Distributions
 *    if Budget is Exceeded.
 *    https://blog.burakcankus.com/2024/03/31/disable-aws-cloudfront-distributions-if-budget-is-exceeded.html.
 *    Retrieved Septermber 6th, 2024.
 *
 */

// CloudFront is global, so some thing's need to be deployed to US-EAST-1.
const useast1 = new aws.Provider("useast1", { region: "us-east-1" });
// This let's us get our Account info dynamically.
const current = await aws.getCallerIdentity({});

// Policy to disable active CloudFront distributions
export const killSwitchPolicy = new aws.iam.Policy(
  "disable-cloudfront-policy",
  {
    name: "disable-cloudfront-policy",
    path: "/",
    description:
      "Allows policyholder to list distributions, update distributions, and get distribution configs",
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: [
            "cloudfront:ListDistributions",
            "cloudfront:UpdateDistribution",
            "cloudfront:GetDistributionConfig",
          ],
          Resource: "*",
        },
      ],
    }),
  },
);

// The disable-cloudfront-policy is attached to the Role, which will be
// assigned to a Lambda func that disables CloudFront distributions on exec.
export const killSwitchRole = new aws.iam.Role("BudgetCloudFrontDisableRole", {
  name: "budget_cloudfront_disable_role",
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Sid: "",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
      },
    ],
  }),
  managedPolicyArns: [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    killSwitchPolicy.arn,
  ],
});

/*
 * Our CloudFront disabler function or distribution "kill switch", is
 * assigned the budget_cloudfront_disable_role, which lets it find all
 * our cloudfront distributions, and "updates" them to a disabled state.
 */
export const killSwitch = new sst.aws.Function(
  "KillSwitch",
  {
    handler: "packages/functions/disable-cloudfront-distributions/index.handler",
    architecture: "arm64",
    role: killSwitchRole.arn,
    timeout: "5 seconds",
  },
  { provider: useast1 },
);

/*
 * We create a new SNS Topic, which can be
 * connected to a budget alert, that upon
 * triggering, will notify it (SNS topic),
 * which will invoke our distribution
 * disabler function.
 */
export const killSwitchSnsTopic = new sst.aws.SnsTopic(
  "BudgetAlertSNS",
  {
    transform: {
      topic: {
        name: "budget-alert-sns",
      },
    },
  },
  { provider: useast1 },
);

/*
 * This is the body of the SNS Topic Policy assigned
 * to the "kill switch" SNS. The Policy is
 * declared here, to inject its ARN.
 */
const killSwitchSnsTopicPolicy = killSwitchSnsTopic.arn.apply((arn) =>
  aws.iam.getPolicyDocumentOutput({
    policyId: "__default_policy_ID",
    statements: [
      {
        actions: [
          "SNS:Subscribe",
          "SNS:SetTopicAttributes",
          "SNS:RemovePermission",
          "SNS:Receive",
          "SNS:Publish",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:AddPermission",
        ],
        conditions: [
          {
            test: "StringEquals",
            variable: "AWS:SourceOwner",
            values: [current.accountId],
          },
        ],
        effect: "Allow",
        principals: [
          {
            type: "AWS",
            identifiers: ["*"],
          },
        ],
        resources: [arn],
        sid: "__default_statement_ID",
      },
      {
        sid: "BudgetAction",
        effect: "Allow",
        principals: [
          {
            type: "Service",
            identifiers: ["budgets.amazonaws.com"],
          },
        ],
        actions: ["SNS:Publish"],
        resources: [arn],
      },
    ],
  }),
);

/*
 * This is what actually creates the Policy,
 * and assigns it to the "kill switch" SNS Topic.
 * It also injects the body of the policy declared
 * above. It's deployed to US-EAST-1 so it can
 * operate with the Global CloudFront distributions.
 */
export const defaultKillSwitchSnsTopicPolicy = new aws.sns.TopicPolicy(
  "default",
  {
    arn: killSwitchSnsTopic.arn,
    policy: killSwitchSnsTopicPolicy.apply(
      (killSwitchSnsTopicPolicy) => killSwitchSnsTopicPolicy.json,
    ),
  },
  { provider: useast1 },
);

/*
 * This subscribes our distribution "kill switch" SNS to the
 * Lambda function that will actually disable our CloudFront
 * distributions upon invocation. This is deployed to
 * US-EAST-1, because that's where the "kill switch" SNS
 * Topic currently exists.
 */
export const killSwitchLambdaTarget = new aws.sns.TopicSubscription(
  "kill_switch_lambda_target",
  {
    topic: killSwitchSnsTopic.arn,
    protocol: "lambda",
    endpoint: killSwitch.arn,
  },
  { provider: useast1 },
);

/*
 * This is the budget that will trigger the alert
 * to the "kill switch" SNS, once it's beyond
 * 95% of the "hard" budget threshold.
 */
export const hardBudget = new aws.budgets.Budget("hard_budget", {
  name: "Hard budget",
  budgetType: "COST",
  limitAmount: "20.00",
  limitUnit: "USD",
  timeUnit: "MONTHLY",
  notifications: [
    {
      comparisonOperator: "GREATER_THAN",
      threshold: 95,
      thresholdType: "PERCENTAGE",
      notificationType: "ACTUAL",
      subscriberSnsTopicArns: [killSwitchLambdaTarget.arn],
    },
  ],
});

/*
 * Because AWS only refreshes the Budget metrics 3x a day,
 * it might be a good idea to have a backup "kill switch".
 * The following creates a Lambda function, which is
 * scheduled by Event Bridge, to periodically check the
 * current CloudFront usage metrics. If an invocation
 * reveals the usage metrics are beyond the defined
 * limits (default: Free tier), then it will trigger the
 * "kill switch" SNS Topic, which will invoke the
 * distribution disabler lambda function.
 */

/*
 * This defines a Policy body, which injects the ARN
 * of the "kill switch" SNS Topic.
 */
const monitorPolicy = killSwitchSnsTopic.arn.apply((arn) =>
  aws.iam.getPolicyDocument({
    statements: [
      {
        effect: "Allow",
        actions: ["cloudwatch:GetMetricData", "cloudfront:ListDistributions"],
        resources: ["*"],
      },
      {
        effect: "Allow",
        actions: ["sns:Publish"],
        resources: [arn],
      },
    ],
  }),
);

/*
 * This creates the actual Policy, which will let
 * the Lambda function fetch the current CloudFront
 * usage metrics, for all our distributions. It
 * also gives it the power to send a message to
 * the "kill switch" SNS Topic.
 */
export const monitorMetricsPolicy = new aws.iam.Policy(
  "lambda-monitor-metrics-sns-policy",
  {
    name: "lambda-monitor-metrics-sns-policy",
    path: "/",
    description:
      "Allows policyholder to list distributions, get distribution metrics from Cloudwatch, and send SNS to disable distributions",
    policy: monitorPolicy.apply((monitorPolicy) => monitorPolicy.json),
  },
);

/*
 * This is the body of the Role which will be
 * assigned to the metric fetcher Lambda function.
 */
const metricsRole = aws.iam.getPolicyDocument({
  statements: [
    {
      actions: ["sts:AssumeRole"],
      principals: [
        {
          type: "Service",
          identifiers: ["lambda.amazonaws.com"],
        },
      ],
    },
  ],
});

/*
 * This is creates the actual Role, which integrates the
 * body of the Role above, and the monitor-metrics-sns-policy.
 */
export const monitorMetricsRole = new aws.iam.Role("monitorMetricsRole", {
  name: "monitor_metrics_role",
  assumeRolePolicy: metricsRole.then((metricsRole) => metricsRole.json),
  managedPolicyArns: [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    monitorMetricsPolicy.arn,
  ],
});

/*
 * This creates the actual Lambda function which fetch
 * the CloudFront usage metrics from CloudWatch. It's
 * defined in the US-EAST-1 region, because CloudFront
 * is Global.
 */
export const monitorCloudFrontMetrics = new sst.aws.Function(
  "MonitorCloudFrontMetrics",
  {
    handler: "packages/functions/metrics-monitor/index.handler",
    architecture: "arm64",
    role: monitorMetricsRole.arn,
    link: [killSwitchSnsTopic],
    timeout: "5 seconds",
  },
  { provider: useast1 },
);

/*
 * This defines the body of the Role Policy
 * of the Event Bridge scheduler.
 */
const scheduleRolePolicy = aws.iam.getPolicyDocument({
  statements: [
    {
      actions: ["sts:AssumeRole"],
      effect: "Allow",
      principals: [
        {
          type: "Service",
          identifiers: ["scheduler.amazonaws.com"],
        },
      ],
    },
  ],
});

/*
 * This injects the ARN of the metrics fetcher function.
 * into the body of the Policy, which will be assigned
 * to the EventBridge schedule executioner.
 */
const invokeLambdaPolicy = monitorCloudFrontMetrics.arn.apply((arn) =>
  aws.iam.getPolicyDocument({
    statements: [
      {
        actions: ["lambda:InvokeFunction"],
        effect: "Allow",
        resources: [arn],
      },
    ],
  }),
);

/*
 * This creates the actual role to be used
 * by the EventBridge schedule executioner.
 */
export const metricsExecutionRole = new aws.iam.Role("MetricsScheduleRole", {
  name: "metrics_schedule_executioner_role",
  assumeRolePolicy: scheduleRolePolicy.then(
    (scheduleRolePolicy) => scheduleRolePolicy.json,
  ),
  inlinePolicies: [
    {
      name: "invoke-metrics-lambda",
      policy: invokeLambdaPolicy.apply(
        (invokeLambdaPolicy) => invokeLambdaPolicy.json,
      ),
    },
  ],
});

/*
 * This creates the scheduler for the metrics
 * fetcher Lambda function. It's set to invoke
 * the Lambda metric monitor function hourly,
 * and the schedule executioner is assigned
 * the role which let's it invoke said function.
 *
 * The EventBridge scheduler is deployed to
 * US-EAST-1, because that's where the target
 * Lambda function exists.
 */
export const monitorEventBridgeSchedule = new aws.scheduler.Schedule(
  "MonitorMetricsSchedule",
  {
    name: "monitor-metrics-schedule",
    groupName: "default",
    flexibleTimeWindow: {
      mode: "OFF",
    },
    scheduleExpression: "rate(1 hours)",
    target: {
      arn: monitorCloudFrontMetrics.arn,
      roleArn: metricsExecutionRole.arn,
    },
  },
  { provider: useast1 },
);
