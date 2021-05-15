import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid"

import { document } from "src/utils/dynamodbClient";
import * as dayjs from "dayjs";

interface ICreateTodo {
  title: string;
  deadline: Date;

}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo

  const date_deadline = dayjs(deadline).format('DD-MM-YYYY')
  console.log(date_deadline)

  const todo_id = uuid()

  document.put({
    TableName: "todos",
    Item: {
      id: todo_id,
      user_id,
      title,
      done: false,
      deadline: date_deadline 
    }
  }).promise()

 
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created successfully!",
      todo: {
        id: todo_id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline)
      }
      }),
      
    headers: {
      "Content-Type": "application/json"
    }
  }
}