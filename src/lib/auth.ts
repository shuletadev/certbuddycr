// This is a UI-only mock: no requests are sent anywhere and nothing is persisted.
// It exists to pin down the auth *shape* the real migration needs to wire up —
// guest vs authenticated state touches the sidebar, save affordances, and the
// Usage & Account surface almost everywhere in the real product.
export type AuthState = { status: "guest" } | { status: "authenticated"; username: string };

export const GUEST: AuthState = { status: "guest" };

export function isAuthenticated(auth: AuthState): auth is { status: "authenticated"; username: string } {
  return auth.status === "authenticated";
}

// Cosmetic only — mimics the shape of the real site's one-time recovery code
// without implying any real entropy/security guarantee.
export function generateMockRecoveryCode(): string {
  const groups = Array.from({ length: 4 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
  return groups.join("-");
}
