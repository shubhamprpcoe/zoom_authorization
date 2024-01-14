import redis from "redis";

// export const connectToRedis = async () => {
//   try {
//     const client = redis.createClient(6379, "127.0.0.1");
//     await client.connect();
//     await client.on("connect", (err) => {
//       if (err) {
//         throw err;
//       } else {
//         console.log("connected to redis");
//       }
//     });

//     return client
//   } catch (error) {
//     console.log(error);
//   }
// };

export const connectToRedis = async () => {
   return new Promise(async (resolve, reject) => {
    
    const client = redis.createClient(6379, "127.0.0.1");
      client.connect();
      client.on("connect", () => {
        console.log("Connected to Redis");
        resolve(client); // Resolve the promise with the Redis client
      });
  
      client.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        reject(err); // Reject the promise with the error
      });
   })
  };