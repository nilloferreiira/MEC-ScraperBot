import { FastifyInstance } from "fastify"
import { webScrapping } from "../utils/web-scrapping"

export async function getData(app: FastifyInstance) {
  app.get("/get-data", async () => {
    try {
      console.log("Trying fetching data...")
      const LatestMECNews = await webScrapping.getLatestMECNews()
      if (LatestMECNews.Error?.status === 400) {
        return { error: "Failed to fetch latest MEC news" }
      }

      console.log("Data fetched.")

      return LatestMECNews
    } catch (error) {
      console.log(error)
      return { error: "An error occurred while fetching latest MEC news" }
    }
  })
}
