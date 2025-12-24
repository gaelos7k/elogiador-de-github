import { z } from "zod";
import { NextResponse } from "next/server";
import OpenAI, { type APIError } from "openai";
import redis from "@/services/redis";

const repoSchema = z.object({
  name: z.string(),
  description: z.string().max(350).optional(),
  isFork: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  stars: z.number().nonnegative().int(),
  language: z.string().max(48).regex(/\w+/).optional(),
  forksCount: z.number().nonnegative().int(),
  isArchived: z.boolean(),
  openIssues: z.number().nonnegative().int(),
});

const schema = z.object({
  username: z
    .string()
    .min(2)
    .max(39)
    .regex(/^(?!-)[A-Za-z0-9-]+(?!-)$/),
  name: z.string().max(48).optional(),
  bio: z.string().max(160).optional(),
  createdAt: z.string().datetime(),
  location: z.string().max(48).optional(),
  publicRepos: z.number().nonnegative().int(),
  followers: z.number().nonnegative().int(),
  following: z.number().nonnegative().int(),
  repos: z.array(repoSchema).max(5),
  language: z.string().length(2),
});

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  // Validação de variáveis de ambiente obrigatórias
  if (!process.env.BASE_URL || !process.env.API_KEY || !process.env.MODEL) {
    console.error("Missing required environment variables");
    return Response.json(
      {
        error:
          "Configuração do servidor incompleta. Entre em contato com o administrador.",
      },
      {
        status: 500,
      }
    );
  }

  const { success, data, error } = schema.safeParse(await req.json());
  if (!success) {
    console.error(error);

    return Response.json(
      {
        error:
          "Requisição inválida. Caso acredite que isso é um erro, avise na aba Issue do repositório no GitHub.",
      },
      {
        status: 400,
      }
    );
  }

  const cachedAnalysis = await redis?.get(
    "analysis:" + data.username.toLowerCase()
  );
  if (cachedAnalysis) {
    return new NextResponse(cachedAnalysis as string);
  }

  try {
    let systemPrompt = `Você é um mentor técnico empolgado que ELOGIA e INCENTIVA desenvolvedores analisando seus perfis GitHub.

FOCO: Reconheça o esforço, os projetos interessantes, as tecnologias que a pessoa está estudando e dê incentivo personalizado.

ESTRUTURA:

Parágrafo 1: Cumprimente pelo nome e destaque algo POSITIVO (quantidade de repos, variedade de tecnologias, ou seguidores). NÃO mencione tempo de criação da conta.

[LINHA EM BRANCO]

Texto: "Vamos aos projetos:"

[LINHA EM BRANCO]

• **Nome-do-Repo** com **X estrelas**: O que o projeto faz + elogio sobre a tecnologia ou problema que resolve.
• **Outro-Repo** com **Y estrelas**: O que o projeto faz + reconhecimento do esforço ou habilidade demonstrada.
• **Terceiro-Repo**: O que o projeto faz + incentivo a continuar nessa direção.

[LINHA EM BRANCO]

Parágrafo final: Incentivo personalizado focado nas tecnologias que usa e no que deve continuar fazendo.

EXEMPLO:

Olá Gabriel! Vi que você tem **16 repositórios** trabalhando principalmente com **Python** e **JavaScript** - uma ótima combinação para desenvolvimento moderno. Você segue **7 pessoas** e tem **2 seguidores**, mostrando foco em aprendizado.

Vamos aos projetos:

• **Background-Removal-API** com **10 estrelas**: API em Python para remover fundo de imagens. Excelente escolha de problema prático para resolver!
• **numeroSecretoAlura** com **0 estrelas**: Jogo de lógica com JavaScript. Investir tempo em fundamentos de programação é essencial para crescer.
• **Cadastro-e-login-com-Fastify** com **1 estrela**: Sistema de autenticação com Fastify. Dominar autenticação é fundamental para qualquer desenvolvedor.

Continue explorando projetos que resolvem problemas reais. Sua dedicação em aprender múltiplas tecnologias está construindo uma base sólida!

REGRAS:
- SEMPRE elogie e incentive
- Foque no que a pessoa ESTÁ FAZENDO de bom
- Use **negrito** para nomes e números
- Seja específico sobre as tecnologias
- Tom empolgado e motivador`;

    if (data.language == "en") {
      systemPrompt +=
        "\n\nIMPORTANT: Respond in English. Focus on PRAISING and ENCOURAGING!";
    } else {
      systemPrompt +=
        "\n\nIMPORTANTE: Responda em Português. Foque em ELOGIAR e INCENTIVAR!";
    }

    let prompt = `Analise o seguinte perfil do GitHub:\n\n`;
    prompt += `- Username: "${data.username}"\n`;
    prompt += `- Total de repositórios: ${data.publicRepos}\n`;
    prompt += `- Seguidores: ${data.followers}\n`;
    prompt += `- Seguindo: ${data.following}\n`;

    if (data.name) prompt += `- Nome: "${data.name}"\n`;
    if (data.location) prompt += `- Localização: "${data.location}"\n`;
    if (data.bio) prompt += `- Bio: "${data.bio}"\n`;

    if (data.repos.length > 0) {
      prompt += `\nRepositórios para análise:\n`;

      for (const repo of data.repos.slice(0, 5)) {
        prompt += `\n${repo.name}:\n`;
        prompt += `- Descrição: ${repo.description ?? "sem descrição"}\n`;
        prompt += `- Estrelas: ${repo.stars}\n`;
        prompt += `- Linguagem: ${repo.language ?? "não especificada"}\n`;
        if (repo.isFork) prompt += `- É um fork\n`;
        if (repo.isArchived) prompt += `- Está arquivado\n`;
      }
    }

    const completion = await client.chat.completions.create({
      model: process.env.MODEL as string,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1280,
      stream: true,
    });

    let content = "";
    const stream = new ReadableStream({
      async pull(controller) {
        for await (const event of completion) {
          const choice = event.choices[0];
          const text = choice.delta.content;
          content += text;
          controller.enqueue(text);
        }

        if (redis) {
          redis.set("analysis:" + data.username.toLowerCase(), content);
          redis.expire("analysis:" + data.username.toLowerCase(), 60 * 10);
        }

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (e) {
    if ((e as APIError).status == 429) {
      return Response.json(
        {
          error: "O servidor encontra-se sobrecarregado :(",
        },
        {
          status: 500,
        }
      );
    }

    console.error(e);

    return Response.json(
      {
        error: "Erro interno.",
      },
      {
        status: 500,
      }
    );
  }
}
