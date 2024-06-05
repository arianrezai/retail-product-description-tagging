import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ProductDescriptionTaggingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'LambdaNodeStack', {
      code: lambda.Code.fromAsset('./src'),
      functionName: 'BedrockInvocationLambda',
      handler: 'index.handler',
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(300),
      environment: {
        AWS_BEDROCK_REGION: 'us-east-1', // Replace with the desired region
      },
    });

    // Grant the Lambda function permission to access Amazon Bedrock
    lambdaFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'BedrockAccess', {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['bedrock:*'],
            resources: ['*'],
          }),
        ],
      })
    );
  }
}
