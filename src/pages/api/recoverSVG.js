import pb from "../../utils/pb.js";
import { Collections } from "../../utils/pocketbase-types.js";

export const GET = async () => {
  try {
    console.log("Récupération des SVG...");

    // Récupère tous les SVG
    const records = await pb.collection(Collections.Svg).getFullList({
      sort: "-created",
    });

    console.log("SVG trouvés:", records);

    return new Response(JSON.stringify({ svgs: records }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return new Response(JSON.stringify({ svgs: [], error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
};
