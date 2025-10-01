import { doc } from "../../services/db.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const Shui_table = process.env.TABLE_NAME;

export const handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const username = qs.username?.trim();
    const order = (qs.order || "desc").toLowerCase();
    const forward = order === "asc";

    if (username) {
      const resp = await doc.send(new QueryCommand({
        TableName: Shui_table,
        IndexName: "GSI_ByUser_ByDate",
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: { "#u": "USER" },
        ExpressionAttributeValues: { ":u": `USER#${username}` },
        ScanIndexForward: forward
      }));
      return json(200, (resp.Items || []).map(publicMsg));
    }

    const resp = await doc.send(new QueryCommand({
      TableName: Shui_table,
      IndexName: "GSI_All_ByDate",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: { "#t": "TYPE" },
      ExpressionAttributeValues: { ":t": "MESSAGE" },
      ScanIndexForward: forward
    }));
    return json(200, (resp.Items || []).map(publicMsg));
  } catch (e) {
    return json(500, { error: e.message || "Serverfel" });
  }
};

function publicMsg(i){ return { id: i.id, username: i.username, text: i.text, createdAt: i.createdAt }; }
function json(status, data){ return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }; }
