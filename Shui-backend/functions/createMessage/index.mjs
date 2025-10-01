import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { doc } from "../../services/db.mjs";
import crypto from "node:crypto";

const Shui_table = process.env.TABLE_NAME;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { username, text } = body;
    if (!username || !text) return json(400, { error: "username and text are required" });

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await doc.send(new PutCommand({
      TableName: Shui_table,
      Item: {
        PK: `MSG#${id}`,
        SK: "MSG",
        id, username, text, createdAt,
        TYPE: "MESSAGE",
        USER: `USER#${username}`
      },
      ConditionExpression: "attribute_not_exists(PK)"
    }));

    return json(201, { id, username, text, createdAt });
  } catch (e) {
    console.error(e);
    return json(500, { error: e.message || "Server error" });
  }
};

const json = (s, d) => ({ statusCode: s, headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
