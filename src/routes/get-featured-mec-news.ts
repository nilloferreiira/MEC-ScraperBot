import { FastifyInstance } from "fastify"
import { webScrapping } from "../utils/web-scrapping"

export async function getFeaturedNewsRoute(app: FastifyInstance) {
  app.get("/featured-news", async () => {
    try {
      console.log("Trying fetching data...")
      const featuredNews = await webScrapping.getFeaturedMECNews()
      if (featuredNews.Error?.status === 400) {
        return { error: "Failed to fetch latest MEC news" }
      }

      console.log("Data fetched.")

      return featuredNews
    } catch (error) {
      console.log(error)
      return { error: "An error occurred while fetching latest MEC news" }
    }
  })
}
