import { Duration, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AiderGithubWorkflowsTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'AiderGithubWorkflowsTestQueue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'AiderGithubWorkflowsTestTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    // Create S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: 'my-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Lambda function
    const myLambda = new lambda.NodejsFunction(this, 'MyLambda', {
      functionName: 'my-lambda',
      entry: 'src/handler.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(30),
    });

    // Grant Lambda permissions to read from S3
    bucket.grantRead(myLambda);
  }
}
