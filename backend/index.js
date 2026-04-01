const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "AutoVerwaltungDB-luka";

exports.handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method || event.httpMethod;

    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "OK" })
      };
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (!body.kennzeichen) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Kennzeichen fehlt" })
        };
      }

      await dynamo.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            Kennzeichen: body.kennzeichen
          }
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Gespeichert" })
      };
    }

    if (method === "GET") {
      const result = await dynamo.send(
        new ScanCommand({
          TableName: TABLE_NAME
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(result.Items || [])
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" })
    };
  } catch (error) {
    console.error("Lambda error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Interner Fehler",
        error: error.message
      })
    };
  }
};