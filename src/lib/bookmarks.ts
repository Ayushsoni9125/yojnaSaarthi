// Client-side bookmark cache and synchronization utility

let bookmarksFetchPromise: Promise<string[]> | null = null;

export function getCachedBookmarkedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("userBookmarks");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isSchemeBookmarked(schemeId: string): boolean {
  const ids = getCachedBookmarkedIds();
  return ids.includes(schemeId);
}

export function addBookmarkLocal(schemeId: string): void {
  if (typeof window === "undefined") return;
  const ids = getCachedBookmarkedIds();
  if (!ids.includes(schemeId)) {
    const next = [...ids, schemeId];
    localStorage.setItem("userBookmarks", JSON.stringify(next));
    window.dispatchEvent(new Event("bookmarks-updated"));
  }
}

export function removeBookmarkLocal(schemeId: string): void {
  if (typeof window === "undefined") return;
  const ids = getCachedBookmarkedIds();
  const next = ids.filter((id) => id !== schemeId);
  localStorage.setItem("userBookmarks", JSON.stringify(next));
  window.dispatchEvent(new Event("bookmarks-updated"));
}

export async function syncUserBookmarks(): Promise<string[]> {
  if (typeof window === "undefined") return [];
  if (bookmarksFetchPromise) return bookmarksFetchPromise;

  bookmarksFetchPromise = (async () => {
    try {
      const res = await fetch("/api/bookmarks", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const ids: string[] = json.data
            .map((b: any) => {
              if (!b) return null;
              if (typeof b.schemeId === "object" && b.schemeId?._id) {
                return b.schemeId._id.toString();
              }
              if (typeof b.schemeId === "string") {
                return b.schemeId;
              }
              return null;
            })
            .filter(Boolean);

          localStorage.setItem("userBookmarks", JSON.stringify(ids));
          window.dispatchEvent(new Event("bookmarks-updated"));
          return ids;
        }
      }
    } catch (err) {
      console.error("Failed to sync bookmarks from server:", err);
    } finally {
      bookmarksFetchPromise = null;
    }
    return getCachedBookmarkedIds();
  })();

  return bookmarksFetchPromise;
}
