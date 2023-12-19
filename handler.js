import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME || "";

const client = new DynamoDBClient({});
const dbClient = DynamoDBDocumentClient.from(client);

export const createContact = async (event) => {
  const { name, number } = JSON.parse(event.body);

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      contactId: Math.random().toString(36).slice(2),
      name: name,
      number: number,
    },
  });

  try {
    await dbClient.send(command);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "The contact has been created successfully!",
      }),
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to create the contact!",
      }),
    };
  }
};

export const updateContact = async (event) => {
  const { contactId } = event.pathParameters;
  const { name, number } = JSON.parse(event.body);

  try {
    if (contactId === null || contactId === "")
      throw Error("Contact Id not provided");

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        contactId,
      },
      ExpressionAttributeNames: {
        "#n": "name",
        "#num": "number",
      },
      UpdateExpression: "set #n = :n, #num = :num",
      ExpressionAttributeValues: {
        ":n": name,
        ":num": number,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await dbClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "The contact has been updated successfully!",
        response: response,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to create the contact!",
        error,
      }),
    };
  }
};

export const getAllContact = async (event) => {
  const command = new ScanCommand({
    ProjectionExpression: "contactId, #n, #num",
    ExpressionAttributeNames: { "#n": "name", "#num": "number" },
    TableName: TABLE_NAME,
  });

  try {
    const response = await dbClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to get contacts!",
        error,
      }),
    };
  }
};

export const retrieveContact = async (event) => {
  const { contactId } = event.pathParameters;
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Kek: {
      contactId
    }
  });

  try {
    if(contactId === null) throw Error("Contact ID not provided!");

    const response = await dbClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to retrieve the contact!",
        error,
      }),
    };
  }
};

export const deleteContact = async (event) => {
  const { contactId } = event.pathParameters;

  try {
    if (contactId === null || contactId === "")
      throw Error("Contact Id not provided");

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        contactId,
      },
    });
    const response = await dbClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        response,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to delete the contact!",
        error,
      }),
    };
  }
};
