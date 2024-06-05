const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');


// Function to retrieve image from S3 bucket and encode it as base64 
const imageToBase64FromS3 = async (region, bucketName, objectKey) => {
    const s3Client = new S3Client({ region }); // Use the provided region
    const getObjectParams = {
        Bucket: bucketName,
        Key: objectKey
    };
    try {
        const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
        const imageBuffer = await streamToBuffer(Body);
        return imageBuffer.toString('base64');
    } catch (error) {
        console.error("Error retrieving image from S3:", error);
        throw error;
    }
};

// Helper function to convert readable stream to buffer
const streamToBuffer = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
};

exports.handler = async (event) => {
    const { region, bucketName, objectKey } = event;
    const modelId = event.modelId || "anthropic.claude-3-haiku-20240307-v1:0";
    const inputText = "What's in this image?";

    const messages = {
        role: "user",
        content: [
            { type: "text", text: "Image 1:" },
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: await imageToBase64FromS3(region, bucketName, objectKey) } },
            { type: "text", text: inputText }
        ]
    };

    const payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [messages]
    };

    const response = await generateVisionAnswer(payload, modelId);
    
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};


const generateVisionAnswer = async (payload, modelId) => {
    const bedrockRuntimeClient = new BedrockRuntimeClient({ region: "us-east-1" });

    const jsonString = JSON.stringify(payload);
    const command = new InvokeModelCommand({ contentType: "application/json", body: JSON.stringify(payload), modelId });

    const apiResponse = await bedrockRuntimeClient.send(command);
    const responseBodyBinary = apiResponse.body;
    const responseBodyString = Buffer.from(responseBodyBinary).toString('utf-8'); // Convert binary data to string

    let responseBody;
    try {
        responseBody = JSON.parse(responseBodyString);
    } catch (error) {
        console.error("Error parsing response body:", error);
        return { error: "Invalid response from API" };
    }

    return responseBody.content[0].text;
};
