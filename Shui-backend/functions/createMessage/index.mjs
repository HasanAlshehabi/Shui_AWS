import {dynamoDBDocClient} from "@aws-sdk/client-dynamodb";
import {PutCommand} from "@aws-sdk/lib-dynamodb";

const ddb = dynamoDBDocClient();
const Shui_table = process.env.MESSAGES_TABLE;


export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { username, text } = body;
    if (!username || !text) return json(400, { error: "username och text krävs" });

    const id = randomId();
    const createdAt = new Date().toISOString();

    const item = {
      PK: `MSG#${id}`,
      SK: "MSG",
      id, username, text, createdAt,
      TYPE: "MESSAGE",
      USER: `USER#${username}`
    };

    await ddb.send(new PutCommand({
      TableName: Shui_table,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK)"
    }));

    return json(201, publicMsg(item));
  } catch (e) {
    return json(500, { error: e.message || "Serverfel" });
  }
};

function publicMsg(i){ return { id: i.id, username: i.username, text: i.text, createdAt: i.createdAt }; }
function json(status, data){ return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }; }
function randomId(){ return [...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,"0")).join(""); }
