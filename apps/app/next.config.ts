import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the project root to silence the multiple lockfiles warning
    // and help Turbopack find hoisted packages
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
