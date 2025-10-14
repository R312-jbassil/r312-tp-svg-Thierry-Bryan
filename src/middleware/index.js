import pb from "../utils/pb.js";

export const onRequest = async (context, next) => {
  console.log("🚀 MIDDLEWARE START - URL:", context.url.pathname);

  // === GESTION DES LANGUES ===

  // Si c'est un POST pour changer de langue ET que l'URL n'est pas une API
  if (
    context.request.method === "POST" &&
    !context.url.pathname.startsWith("/api/")
  ) {
    try {
      // Cloner la requête pour pouvoir lire le body
      const clonedRequest = context.request.clone();
      const form = await clonedRequest.formData();
      const lang = form.get("language");

      // Vérifier que c'est bien un changement de langue
      if (lang === "en" || lang === "fr") {
        // Enregistrer la préférence dans un cookie
        context.cookies.set("locale", String(lang), {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });

        // Rediriger vers la même page en GET
        return Response.redirect(
          new URL(context.url.pathname + context.url.search, context.url),
          303
        );
      }
    } catch (error) {
      // Si ce n'est pas un formulaire de langue, continuer normalement
      console.log("Not a language form, continuing...");
    }
  }

  // Déterminer la langue pour cette requête
  const cookieLocale = context.cookies.get("locale")?.value;

  // Choisir la langue finale
  context.locals.lang =
    cookieLocale === "fr" || cookieLocale === "en"
      ? cookieLocale
      : context.preferredLocale ?? "fr"; // Changé 'en' en 'fr' par défaut

  console.log("🌐 Language set to:", context.locals.lang);

  // === GESTION DE L'AUTHENTIFICATION ===

  const cookie = context.cookies.get("pb_auth")?.value;

  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
      console.log("👤 User authenticated:", context.locals.user?.email);
    }
  }

  // Pour les routes API - LAISSER PASSER SANS LIRE LE BODY
  if (context.url.pathname.startsWith("/api/")) {
    if (
      !context.locals.user &&
      context.url.pathname !== "/api/login" &&
      context.url.pathname !== "/api/signup"
    ) {
      console.log("🚫 API access denied - no user");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    return next(); // IMPORTANT: ne pas lire le body ici
  }

  // Pour les autres pages
  if (!context.locals.user) {
    if (
      context.url.pathname !== "/login" &&
      context.url.pathname !== "/signup" &&
      context.url.pathname !== "/"
    ) {
      console.log("🔄 Redirecting to login");
      return Response.redirect(new URL("/login", context.url), 303);
    }
  }

  console.log(
    "✅ MIDDLEWARE END - User:",
    context.locals.user ? "AUTHENTICATED" : "NOT AUTHENTICATED"
  );
  console.log("✅ MIDDLEWARE END - Lang:", context.locals.lang);

  // Continuer le traitement normal
  return next();
};
