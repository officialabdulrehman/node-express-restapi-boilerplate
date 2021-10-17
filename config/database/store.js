import mongo from "connect-mongo";

let mongoStore = null;

export const GetMongoStore = (mongoUrl) => {
  if (mongoStore) {
    logger.info("Using previously created mongo store");
    return mongoStore;
  }

  if (!mongoUrl) throw new Error("need mongo url to create mongo store");

  console.log("Creating new mongo store");

  mongoStore = mongo.create({
    mongoUrl: mongoUrl,
  });

  return mongoStore;
};
