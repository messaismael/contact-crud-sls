# Contacts CRUD REST API

This project is built using [Serverless Framework](https://github.com/serverless) with Nodejs. It includes 5 functions, each executing a specific business process (Create, Update, Delete, List and Retrieve), and each triggered by an API Gateway.

### Tools

- Serverless Framework
- Nodejs
- DynamoDb
- API Gateway
- Aws-sdk


### Continuous Deployment

For deployment we used **Github Actions** to automate the deployment process with Serverless Framework.You have to provide the right AWS user credentials into you the github Action in your repository as below.

![Github Secret variables](./images/Screenshot%202023-12-19%20at%2019.10.06.png)


To get **SERVERLESS_ACCESS_KEY**, you should follow [this](https://www.serverless.com/framework/docs/guides/cicd/running-in-your-own-cicd).

The deployment supports multi-stage based on these branche names: 
  - main: "prod" 
  - develop: "dev" 

After deploying, you should see output after the `Serverless Deploy` step in the workflow similar to:

```bash
Deploying sls-crud to stage dev (us-east-1)

✔ Service deployed to stack sls-crud-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
```

### Author

[Ismael Messa](https://messaismael.com)