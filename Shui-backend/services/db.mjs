// services/db.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Let Lambda pick region from environment; defaults to eu-north-1
const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "eu-north-1" });

// High-level Document client (use this in handlers)
const doc = DynamoDBDocumentClient.from(ddb);

export { ddb, doc };
