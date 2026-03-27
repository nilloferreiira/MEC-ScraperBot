import * as cheerio from "cheerio"
import axios from "axios"
import https from "https"

const insecureAgent = new https.Agent({ rejectUnauthorized: false })

const getFeaturedMECNews = async () => {
	try {
		// Esta url esta pegando a ultima noticia em destaque
		const { data } = await axios.get("https://www.gov.br/mec/pt-br", {
			httpsAgent: insecureAgent,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,all;q=0.8",
				"Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
				Referer: "https://www.google.com/",
				"Cache-Control": "no-cache"
			}
		})

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
		const { data: newsHtml } = await axios.get(newsLink!, {
			httpsAgent: insecureAgent,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1"
			}
		})
		const $news = cheerio.load(newsHtml)

		const title = $news("h1").text().trim()
		const subtitle = $news("div.documentDescription").text().trim()
		const PublishedDate = $news("span.documentPublished .value").text().trim()

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
			data: PublishedDate,
			url: newsLink
		}
	} catch (error) {
		console.error("Error accessing MEC website:", error)
		return { error: "Erro ao acessar o site do MEC" }
	}
}

const getLatestMECNews = async () => {
	try {
		// Esta url pega a noticia mais recente
		const { data } = await axios.get("https://www.gov.br/mec/pt-br/assuntos/noticias", {
			httpsAgent: insecureAgent,
			withCredentials: true,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1"
			}
		})

		const $ = cheerio.load(data)

		// alterar para pegar a primeira de todas
		const newsLink = $(".noticias li .titulo a").first().attr("href")

		if (!newsLink) {
			return {
				Error: {
					status: 400,
					msg: "Não foi possível selecionar o link da notícia"
				}
			}
		}
		// Abre a noticia mais recente
		const { data: newsHtml } = await axios.get(newsLink!, {
			httpsAgent: insecureAgent,
			withCredentials: true,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1"
			}
		})
		const $news = cheerio.load(newsHtml)

		const title = $news("h1").text().trim()
		const subtitle = $news("div.documentDescription").text().trim()
		const PublishedDate = $news("span.documentPublished .value").text().trim()

		// Pega o conteudo html da parte da noticia para filtrar apenas o texto
		const contentHtml = $news("#parent-fieldname-text").html()

		if (!contentHtml) {
			throw new Error("Conteúdo da notícia não encontrado")
		}

		const $content = cheerio.load(contentHtml)

		// Extrai e limpa o texto
		const newsContent = $content.text().trim()

		return {
			titulo: title,
			subtitulo: subtitle,
			corpo: newsContent,
			data: PublishedDate,
			url: newsLink
		}
	} catch (error) {
		console.error("Erro ao acessar o site do MEC:", error)
		return { error: "Erro ao acessar o site do MEC" }
	}
}

export const webScrapping = { getFeaturedMECNews, getLatestMECNews }
