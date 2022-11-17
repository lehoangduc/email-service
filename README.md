This is a Full-stack Email Service repository (accepts the necessary information and sends emails) deployed at [https://d1ije3e2oexrr4.cloudfront.net/](https://d1ije3e2oexrr4.cloudfront.net/)

### Tech stacks
- Backend: NestJS - A NodeJS framework (with some libraries: nodemailer...)
- Frontend: Next.js - A ReactJS framework (with Antd UI framework...)

### How to run on local enviroment

Run backend server:

```bash
cd backend
cp .env.example .env.development # then change env variables
yarn && yarn dev
```

Run frontend server:

```bash
cd frontend
cp .env.example .env.development # then change env variables
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### How to test

Run end to end testing (Please review `backend/test/app.e2e-spec.ts` file)
```bash
cd backend
cp .env.test.example .env.test # then change env variables
yarn test:e2e
```

Run unit tests (Please review `backend/src/mailer/mailer.service.spec.ts` file)
```bash
cd backend
cp .env.test.example .env.test # then change env variables
yarn test
``` 

### Deploy on AWS
- To achieve high performace, high scalability & easy to deploy, we are using API Gateway + Lambda for hosting backend and Cloudfront + S3 for hosting frontend source codes
- Install & config serverless framework [https://www.serverless.com/framework/docs/getting-started/](https://www.serverless.com/framework/docs/getting-started/)

Deploy backend
```bash
cd backend
cp .env.example .env.production # then change env variabless
yarn deploy
```

Deploy frontend
- Create S3 bucket
- Create Cloudfront distribution and point to the S3 bucket

```bash
cd frontend
cp .env.example .env.production # then change env variables
yarn build
# then upload all files in "out" folder to S3 bucket at root directory
```

### Missing parts
- UI for input CC & BCC email addresses