import { create } from "zustand"
import { persist } from "zustand/middleware"

// 📧 Email cache store interface
interface EmailCacheStore {
  // 🗂️ Map of userId -> email
  emailCache: Record<string, string>
  
  // ➕ Add email to cache
  setEmail: (userId: string, email: string) => void
  
  // 🔍 Get email from cache (returns undefined if not found)
  getEmail: (userId: string) => string | undefined
  
  // 🧹 Clear cache
  clearCache: () => void
}

// 🏪 Create persisted email cache store
export const useEmailCacheStore = create<EmailCacheStore>()(
  persist(
    (set, get) => ({
      emailCache: {},
      
      setEmail: (userId, email) =>
        set((state) => ({
          emailCache: { ...state.emailCache, [userId]: email },
        })),
      
      getEmail: (userId) => get().emailCache[userId],
      
      clearCache: () => set({ emailCache: {} }),
    }),
    {
      name: "email-cache-storage", // 💾 localStorage key
    }
  )
)
