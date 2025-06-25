import axios from "axios"
import OpenAI from "openai"

interface JsonNews {
  titulo: string
  subtitulo: string
  corpo: string
  data: string
  url: string
}

const apiKey = process.env.OPENAI_API_KEY!
const endpoint = "https://api.openai.com/v1/chat/completions"
const instructions = {
  systemFormatNews: `
    **Instruções para Redação de Artigo para o Blog da Bonsae:**

    1. **Leitura do JSON da Notícia:**
      - Analise o JSON fornecido que contém a notícia mais recente capturada do site de notícias.
      - Extraia as seguintes informações essenciais do JSON:
        - Título da Notícia
        - Data da Publicação
        - Autor (se disponível)
        - Fonte do Site de Notícias
        - Resumo da Notícia
        - Corpo do Texto (conteúdo completo da notícia)
        - Categoria/Tags relevantes (ex: Educação, Tecnologia, Inovação Acadêmica)

    2. **Interpretação da Notícia:**
      - Com base no conteúdo extraído, identifique o tema central da notícia e como ele pode se relacionar com o universo acadêmico, gestão educacional, inovação pedagógica ou outra área relevante para o público-alvo do site Bonsae (coordenadores, professores, diretores acadêmicos, etc.).
      - Identifique palavras-chave e termos relevantes que possam melhorar a indexação do artigo em motores de busca, considerando o público-alvo da Bonsae. Priorize palavras-chave relacionadas a: “gestão acadêmica”, “tecnologia educacional”, “inovação em educação”, “plataforma de ensino”, “ferramentas de gestão educacional”, entre outras.

    3. **Estrutura e Organização do Post:**
      - **Título SEO-Friendly:**
        - Crie um título que seja cativante e otimizado para SEO. O título deve incluir a principal palavra-chave identificada e ser claro sobre o benefício ou o interesse para o público-alvo. Por exemplo: "Como [Tema da Notícia] Está Transformando a Gestão Acadêmica em Instituições de Ensino".
      - **Introdução:**
        - Inicie com um parágrafo introdutório de 2-3 frases que capture o interesse dos leitores, destacando como a notícia se relaciona diretamente com desafios ou oportunidades no contexto educacional. Utilize uma palavra-chave principal logo no início.
      - **Corpo do Texto:**
        - Divida o corpo do artigo em seções claras com subtítulos (H2) que organizem a informação de forma lógica e fluida.
        - Inclua pelo menos 2-3 subtítulos relevantes para SEO que utilizem palavras-chave e frases relacionadas. Ex.: "Impactos do [Tema da Notícia] na Gestão Acadêmica", "Como [Tema da Notícia] Pode Influenciar o Futuro da Educação".
        - Adicione insights e análises que ajudem a conectar a notícia ao contexto dos leitores do blog. Ex.: “Como coordenadores podem aplicar essas ideias em suas instituições”.
        - Use listas ou bullets para destacar pontos importantes, benefícios, desafios, ou recomendações.
      - **Conclusão:**
        - Finalize com um parágrafo de conclusão que resume os principais pontos e convida à ação ou reflexão. Ex.: "Quer saber mais sobre como otimizar a gestão acadêmica na sua instituição? Explore nossas soluções na Bonsae."
      - **Call to Action (CTA):**
        - Inclua um CTA claro ao final do artigo para engajar os leitores a explorar outras áreas do site Bonsae, como “Solicite uma Demonstração” ou “Baixe nosso E-book sobre Inovação Acadêmica”.

    4. **SEO e Otimização para WordPress:**
      - Certifique-se de incluir uma meta descrição de até 160 caracteres que resuma o artigo de forma atraente e inclua a palavra-chave principal.
      - Utilize tags apropriadas para o WordPress (ex: "Gestão Acadêmica", "Tecnologia Educacional", "Inovação na Educação").
      - Siga as boas práticas de SEO, como o uso de links internos (para outras páginas do Bonsae) e externos (para fontes relevantes e confiáveis).
      - Verifique a legibilidade do texto, mantendo frases curtas e parágrafos com até 3-4 linhas.

    5. Instruções para Formatação de Notícias:

      - A estrutura da notícia enviada para a API deve seguir o seguinte formato em JSON para garantir consistência e facilitar o processamento. Utilize os seguintes campos para compor a notícia:

            {
        "title": "Como a Nova Etapa Única do SISU em 2025 Está Transformando o Processo de Acesso ao Ensino Superior",
        "intro": "O Sistema de Seleção Unificada (SISU) anunciou uma mudança significativa em seu cronograma para 2025, com uma etapa única de inscrição.",
        "content": [
          {
            "heading": "A Inovação do SISU 2025: Uma Única Etapa de Inscrição",
            "text": "De acordo com o edital publicado pelo MEC, o processo seletivo do SISU 2025 terá uma única etapa de inscrição..."
          },
          {
            "heading": "Impactos do SISU 2025 na Seleção de Candidatos",
            "text": "A alteração no cronograma do SISU pode aumentar a concorrência entre os candidatos e otimizar a distribuição de vagas nas universidades públicas..."
          }
        ],
        "conclusion": "O futuro da educação superior no Brasil está em constante transformação. A novidade trazida pelo SISU 2025 é um exemplo de inovação, podendo melhorar o acesso de estudantes ao ensino superior.",
        "cta": "Para descobrir como a Bonsae pode te ajudar a otimizar a gestão acadêmica em sua instituição, solicite uma demonstração hoje.",
        "meta": "Descubra como a novidade do SISU 2025 com a sua etapa única de inscrição está impulsionando a transformação da gestão acadêmica no ensino superior.",
        "tags": [
          "gestão acadêmica",
          "inovação educacional",
          "SISU 2025",
          "processo seletivo",
          "tecnologia educacional"
        ]
      }
      
      - Considerações:

      A estrutura do conteúdo (content) pode ser expandida conforme necessário, adicionando mais objetos com heading e text para cada seção adicional.
      Os campos são todos opcionais, mas ao menos o title e o intro devem ser fornecidos para garantir que a notícia tenha contexto.

    ### Exemplos de Palavras-Chave Relevantes para o SEO:

    - Gestão Acadêmica
    - Plataforma de Ensino
    - Tecnologia Educacional
    - Inovação em Educação
    - Ferramentas de Gestão Educacional
    - Transformação Digital na Educação
    - Coordenadores Acadêmicos
    - Diretores de Instituições de Ensino

  `,

  systemFormatHtml: `
  Analise este HTML bruto de um site de notícias e identifique as tags HTML que contêm:

  O título da notícia
  O conteúdo principal da notícia
  A data de publicação
  Para cada elemento, me retorne:

  A tag HTML correspondente.
  Possíveis identificadores únicos, como id, class ou outros atributos úteis para web scraping.
  Certifique-se de considerar o contexto do HTML para identificar corretamente os elementos.
  `
}

const openai = new OpenAI({
  apiKey
})
// teste
async function openAiResponse() {
  try {
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-4", // Ou 'gpt-3.5-turbo'
        messages: [
          { role: "system", content: "Você é um assistente útil." },
          { role: "user", content: "Ola, pode me dizer que dia é hoje?" }
        ],
        temperature: 0.7 // Controla a criatividade da resposta.
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (error) {
    return error
  }
}

// teste
async function openaiAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um assistente útil." },
        { role: "user", content: "qual é o limite quando X tende a 0" }
      ]
    })
    return response.choices[0].message.content
  } catch (error) {
    return error
  }
}

// meio do caminho
async function formatJsonNews(news: {}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: instructions.systemFormatNews },
        { role: "user", content: JSON.stringify(news) + " retorne em JSON" }
      ]
    })
    return response.choices[0].message.content
  } catch (error) {
    return { message: "Error durting gpt fomarting", error: error }
  }
}

async function formatHtmlNews(html: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: instructions.systemFormatHtml },
        {
          role: "user",
          content:
            html +
            " me retorne uma lista de objetos das tags com seus respectivos atributos"
        }
      ]
    })
    return response.choices[0].message.content
  } catch (error) {
    console.log(`error: ${error}`)
    return { msg: "Erro ao formatar com IA.", error: error }
  }
}
export const gpt = { openAiResponse, openaiAPI, formatJsonNews, formatHtmlNews }
