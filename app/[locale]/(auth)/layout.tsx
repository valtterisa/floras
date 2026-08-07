import type { ReactNode } from "react";
import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
