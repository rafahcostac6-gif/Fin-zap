export type SeedTx = {
  date: string;
  desc: string;
  amount: number;
  dir: "in" | "out";
  cat: string;
  card?: string;
  inst?: string;
  status: "paid" | "pending" | "received";
  notes?: string;
};

export const CATEGORIES: { key: string; name: string; kind: "income" | "expense"; tone: string; icon: string }[] = [
  { key: "salario", name: "Salários", kind: "income", tone: "income", icon: "wallet" },
  { key: "aluguel", name: "Aluguel recebido", kind: "income", tone: "income", icon: "home" },
  { key: "extra", name: "Extra / 13º", kind: "income", tone: "income", icon: "spark" },
  { key: "saude", name: "Saúde", kind: "expense", tone: "chart-5", icon: "heart" },
  { key: "moradia", name: "Casa", kind: "expense", tone: "chart-2", icon: "home" },
  { key: "transporte", name: "Transporte", kind: "expense", tone: "chart-3", icon: "bus" },
  { key: "celular", name: "Celular", kind: "expense", tone: "chart-6", icon: "phone" },
  { key: "parcelado", name: "Parcelamentos", kind: "expense", tone: "chart-4", icon: "layers" },
  { key: "cartao", name: "Fatura cartão", kind: "expense", tone: "chart-4", icon: "card" },
  { key: "mercado", name: "Mercado", kind: "expense", tone: "chart-1", icon: "bag" },
  { key: "pessoal", name: "Pessoal", kind: "expense", tone: "chart-3", icon: "user" },
  { key: "emprestimo", name: "Empréstimo", kind: "expense", tone: "expense", icon: "landmark" },
  { key: "gerais", name: "Gerais", kind: "expense", tone: "muted", icon: "dots" },
];

export const CARDS: { key: string; name: string; holder: string; brand: string; limit: number; closing: number; due: number }[] = [
  { key: "neon", name: "Neon Iasmim", holder: "Iasmim", brand: "Neon", limit: 2500, closing: 20, due: 27 },
  { key: "ingrid", name: "Cartão Ingrid", holder: "Ingrid", brand: "Visa", limit: 2000, closing: 20, due: 27 },
  { key: "americanas", name: "Americanas", holder: "Casa", brand: "Americanas", limit: 800, closing: 25, due: 5 },
  { key: "credicard", name: "Credicard", holder: "Casa", brand: "Credicard", limit: 1500, closing: 20, due: 10 },
];

export const TRANSACTIONS: SeedTx[] = [
  // Jun/26
  { date: "2026-06-05", desc: "Neon Fasomim", amount: 86, dir: "out", cat: "parcelado", card: "neon", inst: "1/3", status: "paid" },
  { date: "2026-06-10", desc: "Plano Cecília", amount: 216, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-06-12", desc: "Água / Esgoto", amount: 230, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-06-15", desc: "Energia", amount: 95, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-06-20", desc: "Celular TIM", amount: 120, dir: "out", cat: "celular", status: "paid", notes: "Rafa e Gabriela" },
  { date: "2026-06-25", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-06-28", desc: "Internet Casa", amount: 135, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-06-30", desc: "Despesas gerais", amount: 1350, dir: "out", cat: "gerais", status: "paid" },
  { date: "2026-06-05", desc: "Apartamento Rafa", amount: 1475, dir: "in", cat: "aluguel", status: "received" },
  { date: "2026-06-07", desc: "Salário Rafa", amount: 1300, dir: "in", cat: "salario", status: "received" },
  { date: "2026-06-07", desc: "Salário Gabi", amount: 1500, dir: "in", cat: "salario", status: "received" },
  { date: "2026-06-10", desc: "Eliane Casa", amount: 250, dir: "in", cat: "extra", status: "received" },

  // Jul/26
  { date: "2026-07-05", desc: "Neon Fasomim", amount: 86, dir: "out", cat: "parcelado", card: "neon", inst: "2/3", status: "paid" },
  { date: "2026-07-05", desc: "Neon Iasmim", amount: 145, dir: "out", cat: "cartao", card: "neon", inst: "1/8", status: "paid" },
  { date: "2026-07-10", desc: "Plano Cecília", amount: 216, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-07-12", desc: "Água / Esgoto", amount: 230, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-07-15", desc: "Energia", amount: 95, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-07-20", desc: "Celular TIM", amount: 120, dir: "out", cat: "celular", status: "paid" },
  { date: "2026-07-25", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-07-28", desc: "Internet Casa", amount: 135, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-07-30", desc: "Despesas gerais", amount: 1350, dir: "out", cat: "gerais", status: "paid" },
  { date: "2026-07-05", desc: "Apartamento Rafa", amount: 1475, dir: "in", cat: "aluguel", status: "received" },
  { date: "2026-07-07", desc: "Salário Rafa", amount: 1300, dir: "in", cat: "salario", status: "received" },
  { date: "2026-07-07", desc: "Salário Gabi", amount: 1500, dir: "in", cat: "salario", status: "received" },
  { date: "2026-07-10", desc: "Eliane Casa", amount: 250, dir: "in", cat: "extra", status: "received" },

  // Ago/26
  { date: "2026-08-20", desc: "Guarda-roupa", amount: 60, dir: "out", cat: "parcelado", card: "neon", inst: "3/12", status: "paid" },
  { date: "2026-08-20", desc: "Perfumes Boticário", amount: 143, dir: "out", cat: "pessoal", status: "paid", notes: "Última parcela" },
  { date: "2026-08-20", desc: "Plano Cecília", amount: 250, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-08-20", desc: "Credicard", amount: 200, dir: "out", cat: "cartao", card: "credicard", status: "paid" },
  { date: "2026-08-20", desc: "Sofá", amount: 288, dir: "out", cat: "parcelado", card: "ingrid", inst: "4/6", status: "paid" },
  { date: "2026-08-31", desc: "Cartão Americanas", amount: 200, dir: "out", cat: "cartao", card: "americanas", status: "paid" },
  { date: "2026-08-20", desc: "Internet Casa", amount: 145, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-08-20", desc: "Transporte 20–31", amount: 131.2, dir: "out", cat: "transporte", status: "paid" },
  { date: "2026-08-28", desc: "Gasto avulso", amount: 250, dir: "out", cat: "gerais", status: "paid" },
  { date: "2026-08-31", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "paid" },
  { date: "2026-08-31", desc: "Luz e água", amount: 200, dir: "out", cat: "moradia", status: "paid" },
  { date: "2026-08-31", desc: "Celular TIM", amount: 140, dir: "out", cat: "celular", status: "paid", notes: "Rafa e Gabriela" },
  { date: "2026-08-31", desc: "Gabriela", amount: 100, dir: "out", cat: "pessoal", status: "paid" },
  { date: "2026-08-28", desc: "Despesas gerais", amount: 400, dir: "out", cat: "gerais", status: "paid" },
  { date: "2026-08-05", desc: "Adiantamento Rafa e Gabi", amount: 2870, dir: "in", cat: "salario", status: "received" },
  { date: "2026-08-20", desc: "Salário Rafa e Gabi", amount: 2200, dir: "in", cat: "salario", status: "received" },

  // Set/26 — mês atual
  { date: "2026-09-20", desc: "Guarda-roupa", amount: 60, dir: "out", cat: "parcelado", card: "neon", inst: "4/12", status: "pending" },
  { date: "2026-09-20", desc: "Cartão transporte", amount: 200, dir: "out", cat: "transporte", status: "pending" },
  { date: "2026-09-20", desc: "Sofá", amount: 288, dir: "out", cat: "parcelado", card: "ingrid", inst: "5/6", status: "pending" },
  { date: "2026-09-20", desc: "Ingrid", amount: 100, dir: "out", cat: "pessoal", status: "pending" },
  { date: "2026-09-20", desc: "Gás", amount: 65, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-09-20", desc: "Água / luz", amount: 200, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-09-20", desc: "Plano Cecília", amount: 240, dir: "out", cat: "saude", status: "pending", notes: "Hapvida" },
  { date: "2026-09-22", desc: "Compras", amount: 347, dir: "out", cat: "mercado", status: "pending" },
  { date: "2026-09-30", desc: "Celular TIM", amount: 140, dir: "out", cat: "celular", status: "pending" },
  { date: "2026-09-30", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "pending", notes: "Hapvida" },
  { date: "2026-09-30", desc: "Internet Casa", amount: 100, dir: "out", cat: "moradia", status: "pending", notes: "Claro" },
  { date: "2026-09-30", desc: "Cartão Iasmim", amount: 540, dir: "out", cat: "cartao", card: "neon", status: "pending" },
  { date: "2026-09-30", desc: "Americanas", amount: 200, dir: "out", cat: "cartao", card: "americanas", status: "pending" },
  { date: "2026-09-05", desc: "Adiantamento Rafa e Gabi", amount: 2870, dir: "in", cat: "salario", status: "received" },
  { date: "2026-09-20", desc: "Salário Rafa e Gabi", amount: 2200, dir: "in", cat: "salario", status: "received" },

  // Out/26 — planejado
  { date: "2026-10-20", desc: "Guarda-roupa", amount: 60, dir: "out", cat: "parcelado", card: "neon", inst: "5/12", status: "pending" },
  { date: "2026-10-20", desc: "Cartão Neon Iasmim", amount: 458, dir: "out", cat: "cartao", card: "neon", status: "pending" },
  { date: "2026-10-10", desc: "Plano Cecília", amount: 250, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-10-12", desc: "Água / Esgoto", amount: 178, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-10-20", desc: "Sofá", amount: 288, dir: "out", cat: "parcelado", card: "ingrid", inst: "6/6", status: "pending", notes: "Última parcela" },
  { date: "2026-10-30", desc: "Celular TIM", amount: 140, dir: "out", cat: "celular", status: "pending" },
  { date: "2026-10-30", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-10-30", desc: "Internet Casa", amount: 145, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-10-20", desc: "Credicard", amount: 200, dir: "out", cat: "cartao", card: "credicard", status: "pending" },
  { date: "2026-10-01", desc: "Parcela Empréstimo LECCA", amount: 560, dir: "out", cat: "emprestimo", inst: "1/36", status: "pending" },
  { date: "2026-10-05", desc: "Adiantamento Rafa e Gabi", amount: 2870, dir: "in", cat: "salario", status: "pending" },
  { date: "2026-10-20", desc: "Salário Rafa e Gabi", amount: 2210, dir: "in", cat: "salario", status: "pending" },

  // Nov/26
  { date: "2026-11-20", desc: "Guarda-roupa", amount: 60, dir: "out", cat: "parcelado", card: "neon", inst: "6/12", status: "pending" },
  { date: "2026-11-20", desc: "Neon Iasmim", amount: 458, dir: "out", cat: "cartao", card: "neon", status: "pending" },
  { date: "2026-11-10", desc: "Plano Cecília", amount: 250, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-11-12", desc: "Água / Esgoto", amount: 200, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-11-30", desc: "Celular TIM", amount: 140, dir: "out", cat: "celular", status: "pending" },
  { date: "2026-11-30", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-11-30", desc: "Internet Casa", amount: 100, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-11-20", desc: "Credicard", amount: 200, dir: "out", cat: "cartao", card: "credicard", status: "pending" },
  { date: "2026-11-01", desc: "Parcela Empréstimo LECCA", amount: 560, dir: "out", cat: "emprestimo", inst: "2/36", status: "pending" },
  { date: "2026-11-05", desc: "Adiantamento Rafa e Gabi", amount: 2870, dir: "in", cat: "salario", status: "pending" },
  { date: "2026-11-20", desc: "Salário Rafa e Gabi", amount: 2200, dir: "in", cat: "salario", status: "pending" },
  { date: "2026-11-20", desc: "1ª parcela 13º Rafa", amount: 1400, dir: "in", cat: "extra", status: "pending" },
  { date: "2026-11-20", desc: "1ª parcela 13º Gabriela", amount: 434, dir: "in", cat: "extra", status: "pending" },

  // Dez/26
  { date: "2026-12-20", desc: "Guarda-roupa", amount: 60, dir: "out", cat: "parcelado", card: "neon", inst: "7/12", status: "pending" },
  { date: "2026-12-20", desc: "Neon Iasmim", amount: 108, dir: "out", cat: "cartao", card: "neon", status: "pending" },
  { date: "2026-12-10", desc: "Plano Cecília", amount: 250, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-12-12", desc: "Água / Esgoto", amount: 178, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-12-30", desc: "Celular TIM", amount: 140, dir: "out", cat: "celular", status: "pending" },
  { date: "2026-12-30", desc: "Plano NENA", amount: 288, dir: "out", cat: "saude", status: "pending" },
  { date: "2026-12-30", desc: "Internet Casa", amount: 100, dir: "out", cat: "moradia", status: "pending" },
  { date: "2026-12-20", desc: "Casa Bahia", amount: 224, dir: "out", cat: "parcelado", inst: "5/5", status: "pending" },
  { date: "2026-12-20", desc: "Credicard", amount: 200, dir: "out", cat: "cartao", card: "credicard", status: "pending" },
  { date: "2026-12-20", desc: "Curso Eletrotécnico", amount: 300, dir: "out", cat: "parcelado", inst: "3/5", status: "pending" },
  { date: "2026-12-01", desc: "Parcela Empréstimo LECCA", amount: 560, dir: "out", cat: "emprestimo", inst: "3/36", status: "pending" },
  { date: "2026-12-05", desc: "Adiantamento Rafa e Gabi", amount: 2880, dir: "in", cat: "salario", status: "pending" },
  { date: "2026-12-20", desc: "Salário Rafa e Gabi", amount: 2200, dir: "in", cat: "salario", status: "pending" },
  { date: "2026-12-20", desc: "2ª parcela 13º Rafa", amount: 1400, dir: "in", cat: "extra", status: "pending" },
  { date: "2026-12-20", desc: "2ª parcela 13º Gabriela", amount: 434, dir: "in", cat: "extra", status: "pending" },
];

export const INVESTMENTS: { month: string; contribution: number; yieldAmount: number; balance: number }[] = [
  { month: "2026-06-01", contribution: 0, yieldAmount: 0, balance: 0 },
  { month: "2026-07-01", contribution: 0, yieldAmount: 0, balance: 0 },
  { month: "2026-08-01", contribution: 400, yieldAmount: 4.6, balance: 500 },
  { month: "2026-09-01", contribution: 2000, yieldAmount: 28.75, balance: 2528.75 },
];

export const COST_ACTIONS: { name: string; current: number; target: number; status: "pending" | "ok" | "paying_off"; note: string }[] = [
  { name: "Celular TIM", current: 140, target: 70, status: "pending", note: "Migrar para operadora digital (Claro/Vivo/C6)" },
  { name: "Plano NENA", current: 288, target: 180, status: "ok", note: "Inegociável no momento — manter" },
  { name: "Plano Cecília", current: 240, target: 160, status: "ok", note: "Verificar plano familiar/combo com NENA" },
  { name: "Internet Casa", current: 135, target: 100, status: "pending", note: "Negociar fidelidade ou trocar provedor" },
  { name: "Energia", current: 200, target: 150, status: "pending", note: "Hábitos de consumo e lâmpadas LED" },
  { name: "Água / Esgoto", current: 200, target: 200, status: "ok", note: "Custo fixo externo — sem ação imediata" },
  { name: "Neon Fasomim", current: 86, target: 0, status: "paying_off", note: "Parcelado — última parcela em julho" },
];

/** Price table from the LECCA proposal (36 months). */
export const LOAN_SCHEDULE: {
  installment: number;
  due: string;
  open: number;
  interest: number;
  amort: number;
  payment: number;
  close: number;
}[] = [
  { installment: 1, due: "2026-10-01", open: 13600, interest: 337.27, amort: 222.73, payment: 560, close: 13377.27 },
  { installment: 2, due: "2026-11-01", open: 13377.27, interest: 331.75, amort: 228.25, payment: 560, close: 13149.02 },
  { installment: 3, due: "2026-12-01", open: 13149.02, interest: 326.09, amort: 233.91, payment: 560, close: 12915.1 },
  { installment: 4, due: "2027-01-01", open: 12915.1, interest: 320.28, amort: 239.72, payment: 560, close: 12675.38 },
  { installment: 5, due: "2027-02-01", open: 12675.38, interest: 314.34, amort: 245.66, payment: 560, close: 12429.72 },
  { installment: 6, due: "2027-03-01", open: 12429.72, interest: 308.25, amort: 251.75, payment: 560, close: 12177.97 },
  { installment: 7, due: "2027-04-01", open: 12177.97, interest: 302.0, amort: 258.0, payment: 560, close: 11919.98 },
  { installment: 8, due: "2027-05-01", open: 11919.98, interest: 295.61, amort: 264.39, payment: 560, close: 11655.58 },
  { installment: 9, due: "2027-06-01", open: 11655.58, interest: 289.05, amort: 270.95, payment: 560, close: 11384.63 },
  { installment: 10, due: "2027-07-01", open: 11384.63, interest: 282.33, amort: 277.67, payment: 560, close: 11106.96 },
  { installment: 11, due: "2027-08-01", open: 11106.96, interest: 275.44, amort: 284.56, payment: 560, close: 10822.4 },
  { installment: 12, due: "2027-09-01", open: 10822.4, interest: 268.39, amort: 291.61, payment: 560, close: 10530.79 },
  { installment: 13, due: "2027-10-01", open: 10530.79, interest: 261.16, amort: 298.84, payment: 560, close: 10231.95 },
  { installment: 14, due: "2027-11-01", open: 10231.95, interest: 253.74, amort: 306.26, payment: 560, close: 9925.69 },
  { installment: 15, due: "2027-12-01", open: 9925.69, interest: 246.15, amort: 313.85, payment: 560, close: 9611.84 },
  { installment: 16, due: "2028-01-01", open: 9611.84, interest: 238.37, amort: 321.63, payment: 560, close: 9290.21 },
  { installment: 17, due: "2028-02-01", open: 9290.21, interest: 230.39, amort: 329.61, payment: 560, close: 8960.6 },
  { installment: 18, due: "2028-03-01", open: 8960.6, interest: 222.22, amort: 337.78, payment: 560, close: 8622.81 },
  { installment: 19, due: "2028-04-01", open: 8622.81, interest: 213.84, amort: 346.16, payment: 560, close: 8276.65 },
  { installment: 20, due: "2028-05-01", open: 8276.65, interest: 205.25, amort: 354.75, payment: 560, close: 7921.91 },
  { installment: 21, due: "2028-06-01", open: 7921.91, interest: 196.46, amort: 363.54, payment: 560, close: 7558.36 },
  { installment: 22, due: "2028-07-01", open: 7558.36, interest: 187.44, amort: 372.56, payment: 560, close: 7185.8 },
  { installment: 23, due: "2028-08-01", open: 7185.8, interest: 178.2, amort: 381.8, payment: 560, close: 6804.01 },
  { installment: 24, due: "2028-09-01", open: 6804.01, interest: 168.73, amort: 391.27, payment: 560, close: 6412.74 },
  { installment: 25, due: "2028-10-01", open: 6412.74, interest: 159.03, amort: 400.97, payment: 560, close: 6011.77 },
  { installment: 26, due: "2028-11-01", open: 6011.77, interest: 149.09, amort: 410.91, payment: 560, close: 5600.86 },
  { installment: 27, due: "2028-12-01", open: 5600.86, interest: 138.9, amort: 421.1, payment: 560, close: 5179.76 },
  { installment: 28, due: "2029-01-01", open: 5179.76, interest: 128.45, amort: 431.55, payment: 560, close: 4748.21 },
  { installment: 29, due: "2029-02-01", open: 4748.21, interest: 117.75, amort: 442.25, payment: 560, close: 4305.96 },
  { installment: 30, due: "2029-03-01", open: 4305.96, interest: 106.78, amort: 453.22, payment: 560, close: 3852.75 },
  { installment: 31, due: "2029-04-01", open: 3852.75, interest: 95.55, amort: 464.45, payment: 560, close: 3388.29 },
  { installment: 32, due: "2029-05-01", open: 3388.29, interest: 84.03, amort: 475.97, payment: 560, close: 2912.32 },
  { installment: 33, due: "2029-06-01", open: 2912.32, interest: 72.22, amort: 487.78, payment: 560, close: 2424.54 },
  { installment: 34, due: "2029-07-01", open: 2424.54, interest: 60.13, amort: 499.87, payment: 560, close: 1924.67 },
  { installment: 35, due: "2029-08-01", open: 1924.67, interest: 47.73, amort: 512.27, payment: 560, close: 1412.4 },
  { installment: 36, due: "2029-09-01", open: 1412.4, interest: 35.03, amort: 1412.4, payment: 1447.42, close: 0 },
];
