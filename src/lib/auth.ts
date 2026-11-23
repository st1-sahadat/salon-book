import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";


const client = new MongoClient(process.env.DB_URI as string);
const db = client.db("salon-book");
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: ["admin", "customer"],
        input: false,
        defaultValue: "customer"
      },
      isBlocked: {
        type: "boolean",
        input: false,
        defaultValue: false
      }
    }
  },
  //email 
  emailAndPassword: {
    enabled: true,
  },
  //social
  socialProviders: {

  },
});