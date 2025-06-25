import { FastifyInstance } from "fastify"
import { gpt } from "../../utils/gpt"
import { webScrapping } from "../../utils/web-scrapping"

export async function getFomartNews(app: FastifyInstance) {
  app.get("/gpt-format-mec", async () => {
    try {
      // webscraping the news
      console.log("Trying fetching data...")
      const jsonNews = await webScrapping.getFeaturedMECNews()

      if (jsonNews.Error?.status === 400) {
        return { error: "Failed to fetch latest MEC news" }
      }

      console.log("Data fetched.")

      // using AI to format it
      console.log("Formating news...")

      const formatedNews = await gpt.formatJsonNews(jsonNews)

      console.log("The news has been formated successfully.")
      return formatedNews
    } catch (error) {
      console.log(error)
      return { responseMessage: "Error during news formatting", error: error }
    }
  })

  app.get("/gpt-format-html", async () => {
    try {
      // webscraping the news
      console.log("Trying fetching data...")
      const jsonNews = await webScrapping.scrapingWithAI()

      // if (jsonNews.Error?.status === 400) {
      //   return { error: "Failed to fetch latest MEC news" }
      // }

      console.log("Data fetched.")
      return jsonNews
      // using AI to format it
      // console.log("Formating news...")

      // const formatedNews = await gpt.formatJsonNews(jsonNews)

      // console.log("The news has been formated successfully.")
      // return formatedNews
    } catch (error) {
      console.log(error)
      return { responseMessage: "Error during news formatting", error: error }
    }
  })
}
