import pb from "../../utils/pb.js";
import { Collections } from "../../utils/pocketbase-types.js";

export const POST = async ({ request, cookies }) => {
  try {
    const { email, password, confirmPassword } = await request.json();

    // Vérifications côté serveur
    if (!email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis" }),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ error: "Les mots de passe ne correspondent pas" }),
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Le mot de passe doit contenir au moins 8 caractères" }),
        { status: 400 }
      );
    }

    // Créer l'utilisateur dans PocketBase
    const userData = {
      email: email,
      password: password,
      passwordConfirm: confirmPassword,
    };

    console.log("Création utilisateur:", email);
    const user = await pb.collection(Collections.Users).create(userData);

    // Authentifier automatiquement l'utilisateur après inscription
    const authData = await pb
      .collection(Collections.Users)
      .authWithPassword(email, password);

    // Sauvegarder le cookie d'authentification
    cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    console.log("✅ Utilisateur créé et connecté:", authData.record.email);

    return new Response(
      JSON.stringify({ 
        success: true,
        user: authData.record,
        message: "Compte créé avec succès !" 
      }),
      { status: 201 }
    );

  } catch (err) {
    console.error("❌ Erreur inscription:", err);
    
    // Gestion des erreurs spécifiques de PocketBase
    if (err.status === 400) {
      const errorMessage = err.response?.data?.email?.message || 
                          err.response?.data?.password?.message ||
                          "Erreur de validation";
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Erreur lors de la création du compte" }),
      { status: 500 }
    );
  }
};