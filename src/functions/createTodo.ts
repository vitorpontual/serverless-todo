import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid"

import { document } from "src/utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;

}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo

  const todo_id = uuid()

  document.put({
    TableName: "todos",
    Item: {
      id: todo_id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline)
    }
  }).promise()

  console.log(todo_id)
 
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created successfully!",
      }),
      
    headers: {
      "Content-Type": "application/json"
    }
  }
}