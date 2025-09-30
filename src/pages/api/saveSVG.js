import pb from '../../js/pocketbase';
export const POST = async ({ request }) => {
  try {
    const { prompt, svg } = await request.json();
    if (!prompt || !svg) {
      return new Response(JSON.stringify({ error: 'Prompt ou SVG manquant.' }), { status: 400 });
    }

    // Adresse de l'API PocketBase (adapter si besoin)
    const pbUrl = process.env.PB_URL || 'http://127.0.0.1:8090';
    const collection = 'code_svg';

    // Création de l'enregistrement dans PocketBase
    const res = await fetch(`${pbUrl}/api/collections/${collection}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, svg_code: svg }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};