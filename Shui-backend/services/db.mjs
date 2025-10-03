import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-north-1" });

const doc = DynamoDBDocumentClient.from(ddb);

export { ddb, doc };
