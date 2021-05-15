import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";


export const handle: APIGatewayProxyHandler = async (event) => {
  const { todo_id } = event.pathParameters;
  
  const response = await document.scan({
    TableName: "todos",
    ProjectionExpression: "id, user_id, title, deadline, done"
  }).promise()

  const  todo = response.Items.find(todo => todo.id === todo_id)

  
  console.log(todo)
  
  return {
    statusCode: 200,
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json"
    }
  }
}