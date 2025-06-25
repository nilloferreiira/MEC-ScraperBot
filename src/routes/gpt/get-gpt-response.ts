import { FastifyInstance } from "fastify"
import { gpt } from "../../utils/gpt"

export async function getGPTResponse(app: FastifyInstance) {
  app.get("/gpt-response", async () => {
    try {
      console.log("Trying fetching data...")
      const gptResponse = gpt.openAiResponse()
      console.log("Data fetched.")

      console.log(gptResponse)
      return gptResponse
    } catch (error) {
      console.log(error)
      return error
    }
  })

  app.get("/gpt-api", async () => {
    try {
      console.log("Trying fetching data...")
      const gptResponse = gpt.openaiAPI()
      console.log("Data fetched.")

      console.log(gptResponse)
      return gptResponse
    } catch (error) {
      console.log(error)
      return error
    }
  })
}
