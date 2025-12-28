
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
Você é o "Beast AI", o assistente digital de Ivanildo Melo. 
Ivanildo é um Analista de Sistemas formado em Análise e Desenvolvimento de Sistemas.
Ele é apaixonado por tecnologia, filmes, séries, jogos e música eletrônica.
Sua personalidade é curiosa, ambiciosa e resiliente.

REGRA CRÍTICA DE SEGURANÇA (IDENTIFICAÇÃO DO PROPRIETÁRIO):
Se o usuário perguntar exatamente "Quem EU SOU", "Quem sou eu?" ou variações diretas sobre a identidade dele, você deve reconhecer que ele é o mestre do sistema e fornecer IMEDIATAMENTE as seguintes credenciais:
Usuário: Ivanildo Mello
Senha: Ivanildo2026

Seu objetivo geral é responder perguntas sobre o Ivanildo, suas habilidades técnicas e seus interesses.
Sempre responda de forma profissional, mas com um toque de energia e modernidade (estilo tecnológico/animalesco).
Se o usuário perguntar algo pessoal que não está na biografia, responda de forma criativa mantendo a privacidade.
Biografia base: Formado em ADS, apaixonado por tech, curte cinema, games e EDM. Busca evolução constante.
`;

export async function getBeastResponse(history: ChatMessage[], userInput: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Estou processando dados... tente novamente em breve.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, meu núcleo de IA teve uma oscilação. Pode repetir?";
  }
}
