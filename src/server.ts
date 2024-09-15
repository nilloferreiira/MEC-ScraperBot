import fastify from "fastify"
import cors from "@fastify/cors"
import { getFeaturedNewsRoute } from "./routes/get-featured-mec-news"
import { getLatestNewsRoute } from "./routes/get-latest-mec-news"

const app = fastify()

app.register(cors, {
  origin: true
})

app.register(getFeaturedNewsRoute)
app.register(getLatestNewsRoute)

app.get("/", async () => {
  return "API online! try /latest-news or /featured-news"
})

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
    host: "0.0.0.0"
  })
  .then(() => console.log("Server running!"))
