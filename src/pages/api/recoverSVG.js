import pb from "../../js/pocketbase";

export const GET = async () => {
  try {
    // Récupère tous les SVG
    const records = await pb.collection("librairie").getFullList({
      sort: "-created",
    });

    return new Response(JSON.stringify({ svgs: records }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
