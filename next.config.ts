import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O `next dev` 16.3 cria arquivos de instruções para agentes na raiz; o projeto não usa.
  agentRules: false,
};

export default nextConfig;
