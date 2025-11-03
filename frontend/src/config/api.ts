export const API_BASE_URL: string = (import.meta as any).env?.VITE_API_BASE_URL || "";

if (!API_BASE_URL) {
  // Em tempo de desenvolvimento, avisar se a env não estiver definida
  // Não lançar erro aqui para não quebrar o bundle; os consumidores podem validar.
  // console.warn("VITE_API_BASE_URL não definida. Configure em .env.local ou .env.");
}
