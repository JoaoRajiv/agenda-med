export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";

  // 1. Remove absolutamente tudo que não for número
  const cleaned = phone.replace(/\D/g, "");

  // 2. Se o número não tiver 11 dígitos (DDD + 9 números),
  // retorna o valor original para não mostrar uma máscara quebrada.
  if (cleaned.length !== 11) return phone;

  // 3. Aplica a máscara com segurança
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
