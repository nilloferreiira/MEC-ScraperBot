import * as cheerio from "cheerio"
import axios from "axios"

const getLatestMECNews = async () => {
  try {
    // Esta url esta pegando a ultima noticia em destaque
    const { data } = await axios.get("https://www.gov.br/mec/pt-br")
    // Possivel atualizacao da url para pegar literalmente a noticia mais recente possivel
    //   "https://www.gov.br/mec/pt-br/assuntos/noticias"

    const $ = cheerio.load(data)

    const newsLink = $(".foto-sobreposta-grande a.imag").first().attr("href")

    if (!newsLink) {
      return {
        Error: {
          status: 400,
          msg: "Não foi possível selecionar o link da notícia"
        }
      }
    }
    // Abre a noticia mais recente
    const { data: noticiaHtml } = await axios.get(newsLink!)
    const $news = cheerio.load(noticiaHtml)

    const title = $news("h1").text().trim()
    const subtitle = $news("div.documentDescription").text().trim()
    // Pega o conteudo html da parte da noticia para filtrar apenas o texto
    const htmlContent = $news("#parent-fieldname-text").html()

    if (!htmlContent) {
      throw new Error("News content not found.")
    }

    const $content = cheerio.load(htmlContent)

    // Extrai e limpa o texto
    const newsContent = $content.text().trim()

    return {
      titulo: title,
      subtitulo: subtitle,
      corpo: newsContent,
      url: newsLink
    }
  } catch (error) {
    console.error("Error accessing MEC website:", error)
    return { error: "Erro ao acessar o site do MEC" }
  }
}

export const webScrapping = { getLatestMECNews }
