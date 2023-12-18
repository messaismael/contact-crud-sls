import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
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
      statusCode: 200,
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

    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
       contactId,
      },
    });

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        contactId: contactId,
        name: name,
        number: number,
      },
    });

    const contactResponse = await dbClient.send(getCommand);
    if (contactResponse.Item) {
      await dbClient.sent(putCommand);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "The contact has been created successfully!",
        }),
      };
    } else {
      throw Error("The contact doesn't exist.");
    }
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
    TableName: TABLE_NAME,
  });

  try {
    const response = await dbClient.send(command);
    return {
      statusCode: 200,
      body: response.Items,
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
        error
      }),
    };
  }
};
