import pb from "../../utils/pb.js";
import { Collections } from "../../utils/pocketbase-types.js";

export async function DELETE({ request }) {
  try {
    const { id } = await request.json();

    if (!id) {
      throw new Error("ID manquant");
    }

    await pb.collection(Collections.Svg).delete(id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur suppression SVG:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
