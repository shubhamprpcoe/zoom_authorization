import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {} from "dotenv/config";
import {
  amqplib_CreateChannel,
  amqplib_PublishChannel,
  amqplib_SubscribeChannel,
} from "./Utils/RabitMq/RabitMq.js";

import { connectToRedis } from "./Utils/Redis/connectRedis.js";
import { setRedisData } from "./Utils/Redis/redis.js";

const app = express();

// CORS policy
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// cookieParser
app.use(cookieParser());

const { DATABASE_URL, PORT, BINDING_KEY } = process.env;
const port = PORT || 5001;


app.use(express.json());

//connect to redis
let redisClient
( async function (){
   redisClient = await connectToRedis();

})()

// // connect to rabirmq channel (queue name, special binding key of exchanage to queue)
export let rabbitMqChannelToReciveData;
(async function () {
  rabbitMqChannelToReciveData = await amqplib_CreateChannel(
    "QueueName_redis_userRegistrationData",
    "BindingKey_Aurhorization"
  );
  //revive data from queue (channel of connection, queue name, special binding key of exchanage to queue)
  let data = await amqplib_SubscribeChannel(
    rabbitMqChannelToReciveData,
    "st1",
    BINDING_KEY
  );

  if (data) {
    let recivedData = JSON.parse(data);
    
    setRedisData(redisClient, recivedData.token, recivedData.expires);
  }
})();

// Define a route

// app.use("/SignUpRoute", router);

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
