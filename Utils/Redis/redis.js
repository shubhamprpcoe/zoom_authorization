import redis from "redis";

export const setRedisData = async (redisClient, key , value ) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, (err, result) => {
          if (err) {
            console.error('Error setting data in Redis:', err);
            reject(err);
          } else {
            console.log(`Data set in Redis for key '${key}': ${value}`);
            resolve(result);
          }
        });
      });
};
