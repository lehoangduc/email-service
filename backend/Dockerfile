FROM  public.ecr.aws/lambda/nodejs:18-arm64

COPY package.json yarn.lock ./

RUN npm i -g yarn && yarn --production

COPY dist ./

CMD [ "dist/index.handler" ]