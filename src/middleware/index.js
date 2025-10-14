import pb from "../utils/pb.js";

export const onRequest = async (context, next) => {
  console.log("🚀 MIDDLEWARE START - URL:", context.url.pathname);

  const cookie = context.cookies.get("pb_auth")?.value;

  if (cookie) {
    pb.authStore.loadFromCookie(cookie);
    if (pb.authStore.isValid) {
      context.locals.user = pb.authStore.record;
    }
  }

  // Pour les routes API
  if (context.url.pathname.startsWith("/api/")) {
    if (
      !context.locals.user &&
      context.url.pathname !== "/api/login" &&
      context.url.pathname !== "/api/signup"
    ) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    return next();
  }

  // Pour les autres pages - AUTORISER /login ET /signup
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

  return next();
};
