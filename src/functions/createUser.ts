import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid"
import { hash } from 'bcrypt'

import { document } from "../utils/dynamodbClient"

interface ICreateUser {
  username: string;
  password: string;

} 

export const handle: APIGatewayProxyHandler = async (event) => {
  const { username, password } = JSON.parse(event.body) as ICreateUser;

  const response = await document.scan({
    TableName: "users",
    ProjectionExpression: "username, id"
  }).promise()

  const  userAlreadyExists = response.Items.find(user => user.username === username)

  if(userAlreadyExists) return {
    statusCode: 409,
    body: JSON.stringify({
      error: "User Already Exists!"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }

  const user_id = uuid()

  const passwordCrypt = await hash(password, 8)

  document.put({
    TableName: "users",
    Item: {
      id: user_id,
      username,
      password: passwordCrypt
    }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "User Created",
      user: {
        id: user_id,
        username
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
  
}