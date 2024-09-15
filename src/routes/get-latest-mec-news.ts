import { FastifyInstance } from "fastify"
import { webScrapping } from "../utils/web-scrapping"

export async function getLatestNewsRoute(app: FastifyInstance) {
  app.get("/latest-news", async () => {
    try {
      console.log("Trying fetching data...")
      const latestNews = await webScrapping.getLatestMECNews()
      if (latestNews.Error?.status === 400) {
        return { error: "Failed to fetch latest MEC news" }
      }

      console.log("Data fetched.")

      return latestNews
    } catch (error) {
      console.log(error)
      return { error: "An error occurred while fetching latest MEC news" }
    }
  })
}
