import fastify from "fastify"
import cors from "@fastify/cors"
import { getData } from "./routes/get-data"

const app = fastify()

app.register(cors, {
  origin: true
})

app.register(getData)

app.get("/", async () => {
  return "API online"
})

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
    host: "0.0.0.0"
  })
  .then(() => console.log("Server running!"))
