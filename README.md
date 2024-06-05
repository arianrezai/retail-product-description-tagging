# Retail Product Description Tagging 

## Overview 
This project creates a serverless application using AWS CDK. It generates product descriptions based on product images utilizing Amazon Bedrock and Claude 3. The application consists of a Lambda function interacting with Amazon Bedrock, a DynamoDB table storing generated descriptions, and an API Gateway handling requests.

## Components

- **productDescriptionFunction**: A Lambda function generating product descriptions from product images using Amazon Bedrock.
- **productDescriptionApi**: An API Gateway managing requests to the Lambda function.
- **DynamoDbTable**: A DynamoDB table storing the generated product descriptions.

## How to Use

Follow these steps to deploy and utilize the application:

1. Install the necessary dependencies by running:
   ```
   npm install
   ```

2. Deploy the application to AWS by executing:
   ```
   cdk deploy
   ```

3. Utilize the API Gateway to submit a request to the Lambda function along with a product image.

4. The Lambda function will then generate a product description based on the image and store it in the DynamoDB table.

Ensure you have the AWS Command Line Interface (CLI) installed and configured with the required permissions before executing the deployment command.