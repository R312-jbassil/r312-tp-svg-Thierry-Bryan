// src/pages/api/generate-svg.js
import { OpenAI } from "openai";

// Récupération du token d'accès à partir des variables d'environnement
const HF_TOKEN = import.meta.env.HF_TOKEN;

// Fonction exportée pour gérer les requêtes POST
export const POST = async ({ request }) => {
  try {
    const { prompt } = await request.json();

    console.log("Prompt reçu:", prompt);

    // Utilise directement l'approche Hugging Face
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Tu es un générateur de code SVG. Génère uniquement du code SVG valide sans explication. Retourne seulement le code SVG entre les balises <svg>...</svg>.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          top_p: 1,
          model: "deepseek-ai/DeepSeek-R1:fireworks-ai",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const result = await response.json();
    console.log("Réponse API:", result);

    const message = result.choices[0].message.content || "";

    // Recherche d'un élément SVG dans le message généré
    const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/i);
    const svg = svgMatch
      ? svgMatch[0]
      : `<svg width="100" height="100"><text x="10" y="50" fill="red">Erreur génération SVG</text></svg>`;

    console.log("SVG extrait:", svg);

    return new Response(JSON.stringify({ svg }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);

    // Fallback SVG simple
    const fallbackSVG = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#60a5fa"/>
      <text x="50" y="55" text-anchor="middle" fill="white" font-size="12">SVG</text>
    </svg>`;

    return new Response(JSON.stringify({ svg: fallbackSVG }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};