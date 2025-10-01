import { doc } from "../../services/db.mjs";
import {UpdateCommand, GetCommand} from "@aws-sdk/lib-dynamodb";

const Shui_table = process.env.TABLE_NAME;

export const handler = async (event) => {
    try {
        const id = event.pathParameters?.id;
        const {text} = JSON.parse(event.body || "{}");
        if (!id || !text) return json(400, {error: "id and text are required"});

        const key = {PK: `MSG#${id}`, SK: "MSG"};
        const found = await doc.send(new GetCommand({TableName: Shui_table, Key: key}));
        if (!found.Item) return json(404, {error: "Message not found"});

        await doc.send(new UpdateCommand({
            TableName: Shui_table,
            Key: key,
            UpdateExpression: "SET #t = :text",
            ExpressionAttributeNames: {"#t": "text"},
            ExpressionAttributeValues: {":text": text},
            ConditionExpression: "attribute_exists(PK)"
        }));

        return json(200, publicMsg({...found.Item, text}));
    } catch (error) {
        if (error.name === "ConditionalCheckFailedException")
            return json(404, {error: "Message not found"});
            return json (500, {error: error.message || "Server error"});
        }
        };

        function publicMsg(i) {
            return {id: i.id, username: i.username, text: i.text, createdAt: i.createdAt};
        }
        function json(status, data) {
            return {statusCode: status, headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)};
        }