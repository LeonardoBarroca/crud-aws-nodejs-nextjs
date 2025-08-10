import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDoc } from "../infra/dynamo-client.js";

const TABLE = process.env.TABLE_NAME || "EmployeesTable";

export class EmployeeRepository {
  async create(item) {
    try {
      await ddbDoc.send(new PutCommand({ TableName: TABLE, Item: item }));
      return item;
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      const res = await ddbDoc.send(new ScanCommand({ TableName: TABLE }));
      return res.Items || [];
    } catch (err) {
      throw err;
    }
  }

  async getById(id) {
    try {
      const res = await ddbDoc.send(
        new GetCommand({ TableName: TABLE, Key: { id } })
      );
      return res.Item || null;
    } catch (err) {
      throw err;
    }
  }

  async update(id, patch) {
    const updateFields = Object.keys(patch);
    if (updateFields.length === 0) return null;
    const UpdateExpression =
      "set " + updateFields.map((k, i) => `#${k} = :${k}`).join(", ");
    const ExpressionAttributeNames = updateFields.reduce(
      (acc, k) => ({ ...acc, [`#${k}`]: k }),
      {}
    );
    const ExpressionAttributeValues = updateFields.reduce(
      (acc, k) => ({ ...acc, [`:${k}`]: patch[k] }),
      {}
    );
    try {
      const res = await ddbDoc.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { id },
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
          ReturnValues: "ALL_NEW",
        })
      );
      return res.Attributes || null;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const existing = await this.getById(id);
      if (!existing) return false;
      await ddbDoc.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
      return true;
    } catch (err) {
      throw err;
    }
  }
}
