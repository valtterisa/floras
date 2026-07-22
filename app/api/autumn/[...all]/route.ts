import { autumnHandler } from "autumn-js/next";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const { GET, POST } = autumnHandler({
  identify: async () => {
    try {
      const token = await convexAuthNextjsToken();
      if (!token) return { customerId: undefined } as any;
      const me = await fetchQuery((api as any).users.me, {}, { token });
      if (!me) return { customerId: undefined } as any;
      return {
        customerId: me.id,
        customerData: { name: me.name, email: me.email },
      };
    } catch {
      return { customerId: undefined } as any;
    }
  },
});
