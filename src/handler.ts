import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const params = {
      Bucket: 'my-bucket',
      Key: 'data.json'
    };

    const data = await s3.getObject(params).promise();
    const metadata = await s3.headObject(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        fileContents: data.Body?.toString(),
        fileMetadata: metadata
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data from S3' })
    };
  }
};
