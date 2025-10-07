import pb from "../utils/pb.js"; // ← AJOUTER CETTE LIGNE

export const onRequest = async (context, next) => {
    console.log("Middleware exécuté pour la route:", context.url.pathname);
    
  const cookie = context.cookies.get("pb_auth")?.value;

  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
    }
  }

  // Pour les routes API
  if (context.url.pathname.startsWith("/api/")) {
    if (!context.locals.user && context.url.pathname !== "/api/login") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    return next();
  }

  // Pour les autres pages
  if (!context.locals.user) {
    if (context.url.pathname !== "/login" && context.url.pathname !== "/") {
      return Response.redirect(new URL("/login", context.url), 303);
    }
  }
  console.log("Utilisateur authentifié:", context.locals.user);
  

  return next();
};
