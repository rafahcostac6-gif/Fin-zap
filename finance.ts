import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  CARDS,
  CATEGORIES,
  COST_ACTIONS,
  INVESTMENTS,
  LOAN_SCHEDULE,
  TRANSACTIONS,
} from "@/lib/seed-data";
import { currentMonthKey, monthKey, num, shiftMonth, uid } from "@/lib/utils";

type CategoryRow = {
  id: string;
  name: string;
  kind: "income" | "expense";
  tone: string;
  icon: string;
};

type CardRow = {
  id: string;
  name: string;
  holder: string | null;
  brand: string | null;
  credit_limit: string | number;
  closing_day: number;
  due_day: number;
};

type TxRow = {
  id: string;
  occurred_on: string;
  description: string;
  amount: string | number;
  direction: "in" | "out";
  category_id: string | null;
  card_id: string | null;
  installment_label: string | null;
  status: string;
  notes: string | null;
  cat_name: string | null;
  cat_tone: string | null;
  card_name: string | null;
};

type InvRow = {
  id: string;
  month: string;
  contribution: string | number;
  yield_amount: string | number;
  balance: string | number;
};

type LoanRow = {
  id: string;
  installment: number;
  due_on: string;
  opening_balance: string | number;
  interest_amount: string | number;
  amortization: string | number;
  payment: string | number;
  closing_balance: string | number;
  paid: boolean;
};

type GoalRow = {
  id: string;
  name: string;
  target_amount: string | number;
  current_amount: string | number;
  deadline: string | null;
  kind: string;
};

type CostRow = {
  id: string;
  expense_name: string;
  current_amount: string | number;
  target_amount: string | number;
  status: string;
  action_note: string | null;
};

type SettingsRow = {
  monthly_yield_rate: string | number;
  invest_pct: string | number;
  emergency_target: string | number;
  loan_principal: string | number;
  loan_installment: string | number;
  loan_cet: string | number;
};

async function ensureSeeded(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ user_id: string }>`
    select user_id from profiles where user_id = ${userId}
  `;
  if (existing.length) return;

  const catIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const id = uid("cat");
    catIds.set(c.key, id);
    await sql`
      insert into categories (id, user_id, name, kind, tone, icon)
      values (${id}, ${userId}, ${c.name}, ${c.kind}, ${c.tone}, ${c.icon})
    `;
  }

  const cardIds = new Map<string, string>();
  for (const c of CARDS) {
    const id = uid("card");
    cardIds.set(c.key, id);
    await sql`
      insert into cards (id, user_id, name, holder, brand, credit_limit, closing_day, due_day)
      values (${id}, ${userId}, ${c.name}, ${c.holder}, ${c.brand}, ${c.limit}, ${c.closing}, ${c.due})
    `;
  }

  for (const t of TRANSACTIONS) {
    await sql`
      insert into transactions (
        id, user_id, occurred_on, description, amount, direction,
        category_id, card_id, installment_label, status, notes
      ) values (
        ${uid("tx")}, ${userId}, ${t.date}::date, ${t.desc}, ${t.amount}, ${t.dir},
        ${catIds.get(t.cat) ?? null}, ${t.card ? (cardIds.get(t.card) ?? null) : null},
        ${t.inst ?? null}, ${t.status}, ${t.notes ?? null}
      )
    `;
  }

  for (const i of INVESTMENTS) {
    await sql`
      insert into investments (id, user_id, month, contribution, yield_amount, balance)
      values (${uid("inv")}, ${userId}, ${i.month}::date, ${i.contribution}, ${i.yieldAmount}, ${i.balance})
    `;
  }

  for (const p of LOAN_SCHEDULE) {
    await sql`
      insert into loan_payments (
        id, user_id, installment, due_on, opening_balance, interest_amount,
        amortization, payment, closing_balance, paid
      ) values (
        ${uid("loan")}, ${userId}, ${p.installment}, ${p.due}::date, ${p.open}, ${p.interest},
        ${p.amort}, ${p.payment}, ${p.close}, false
      )
    `;
  }

  const lastInv = INVESTMENTS[INVESTMENTS.length - 1];
  await sql`
    insert into goals (id, user_id, name, target_amount, current_amount, deadline, kind)
    values (
      ${uid("goal")}, ${userId}, ${"Reserva de emergência"}, ${10000},
      ${lastInv.balance}, ${"2026-11-30"}::date, ${"emergency"}
    )
  `;

  for (const a of COST_ACTIONS) {
    await sql`
      insert into cost_actions (id, user_id, expense_name, current_amount, target_amount, status, action_note)
      values (${uid("cost")}, ${userId}, ${a.name}, ${a.current}, ${a.target}, ${a.status}, ${a.note})
    `;
  }

  await sql`
    insert into settings (user_id) values (${userId})
  `;

  await sql`
    insert into profiles (user_id, display_name, seeded_at)
    values (${userId}, ${"Casa"}, now())
  `;
}

function mapTx(row: TxRow) {
  return {
    id: row.id,
    occurredOn: row.occurred_on,
    description: row.description,
    amount: num(row.amount),
    direction: row.direction,
    categoryId: row.category_id,
    cardId: row.card_id,
    installment: row.installment_label,
    status: row.status,
    notes: row.notes,
    categoryName: row.cat_name,
    categoryTone: row.cat_tone,
    cardName: row.card_name,
  };
}

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const categories = await sql<CategoryRow>`
      select id, name, kind, tone, icon from categories where user_id = ${context.userId} order by kind, name
    `;
    const cards = await sql<CardRow>`
      select id, name, holder, brand, credit_limit, closing_day, due_day
      from cards where user_id = ${context.userId} order by name
    `;
    return {
      categories,
      cards: cards.map((c) => ({
        id: c.id,
        name: c.name,
        holder: c.holder,
        brand: c.brand,
        creditLimit: num(c.credit_limit),
        closingDay: c.closing_day,
        dueDay: c.due_day,
      })),
    };
  });

export const getOverview = createServerFn({ method: "GET" })
  .validator((input: { month?: string } | undefined) => input ?? {})
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const month = data.month && /^\d{4}-\d{2}$/.test(data.month) ? data.month : currentMonthKey();
    const start = `${month}-01`;
    const next = `${shiftMonth(month, 1)}-01`;
    const yearStart = `${month.slice(0, 4)}-01-01`;

    const monthTx = await sql<TxRow>`
      select t.id, t.occurred_on::text as occurred_on, t.description, t.amount, t.direction,
             t.category_id, t.card_id, t.installment_label, t.status, t.notes,
             c.name as cat_name, c.tone as cat_tone, k.name as card_name
      from transactions t
      left join categories c on c.id = t.category_id
      left join cards k on k.id = t.card_id
      where t.user_id = ${context.userId}
        and t.occurred_on >= ${start}::date
        and t.occurred_on < ${next}::date
      order by t.occurred_on, t.description
    `;

    const history = await sql<{ month: string; income: string | number; expense: string | number }>`
      select to_char(date_trunc('month', occurred_on), 'YYYY-MM') as month,
             coalesce(sum(case when direction = 'in' then amount else 0 end), 0) as income,
             coalesce(sum(case when direction = 'out' then amount else 0 end), 0) as expense
      from transactions
      where user_id = ${context.userId}
        and occurred_on >= ${yearStart}::date
      group by 1
      order by 1
    `;

    const investments = await sql<InvRow>`
      select id, month::text as month, contribution, yield_amount, balance
      from investments where user_id = ${context.userId} order by month
    `;

    const loan = await sql<LoanRow>`
      select id, installment, due_on::text as due_on, opening_balance, interest_amount,
             amortization, payment, closing_balance, paid
      from loan_payments where user_id = ${context.userId} order by installment
    `;

    const goals = await sql<GoalRow>`
      select id, name, target_amount, current_amount, deadline::text as deadline, kind
      from goals where user_id = ${context.userId} order by kind
    `;

    const costs = await sql<CostRow>`
      select id, expense_name, current_amount, target_amount, status, action_note
      from cost_actions where user_id = ${context.userId} order by current_amount desc
    `;

    const settingsRows = await sql<SettingsRow>`
      select monthly_yield_rate, invest_pct, emergency_target, loan_principal, loan_installment, loan_cet
      from settings where user_id = ${context.userId}
    `;

    const income = monthTx.filter((t) => t.direction === "in").reduce((s, t) => s + num(t.amount), 0);
    const expense = monthTx.filter((t) => t.direction === "out").reduce((s, t) => s + num(t.amount), 0);
    const paidOut = monthTx
      .filter((t) => t.direction === "out" && t.status === "paid")
      .reduce((s, t) => s + num(t.amount), 0);
    const pendingOut = expense - paidOut;
    const received = monthTx
      .filter((t) => t.direction === "in" && t.status === "received")
      .reduce((s, t) => s + num(t.amount), 0);

    const byCategory = new Map<string, { name: string; tone: string; total: number }>();
    for (const t of monthTx) {
      if (t.direction !== "out") continue;
      const key = t.cat_name ?? "Outros";
      const prev = byCategory.get(key) ?? { name: key, tone: t.cat_tone ?? "muted", total: 0 };
      prev.total += num(t.amount);
      byCategory.set(key, prev);
    }

    const lastInv = investments.at(-1);
    const invBalance = lastInv ? num(lastInv.balance) : 0;
    const nextLoan = loan.find((p) => !p.paid);
    const emergency = goals.find((g) => g.kind === "emergency");
    const savings = costs.reduce((s, c) => s + Math.max(0, num(c.current_amount) - num(c.target_amount)), 0);

    const upcoming = monthTx
      .filter((t) => t.direction === "out" && t.status !== "paid")
      .slice()
      .sort((a, b) => a.occurred_on.localeCompare(b.occurred_on))
      .slice(0, 6)
      .map(mapTx);

    const insights = buildInsights({
      month,
      income,
      expense,
      invBalance,
      emergencyTarget: emergency ? num(emergency.target_amount) : 10000,
      nextLoan: nextLoan
        ? { due: nextLoan.due_on, payment: num(nextLoan.payment), installment: nextLoan.installment }
        : null,
      costs: costs.map((c) => ({
        name: c.expense_name,
        current: num(c.current_amount),
        target: num(c.target_amount),
        status: c.status,
      })),
      byCategory: [...byCategory.values()],
      monthTx: monthTx.map(mapTx),
    });

    return {
      month,
      income,
      expense,
      balance: income - expense,
      ratio: income > 0 ? (income - expense) / income : 0,
      paidOut,
      pendingOut,
      received,
      leftover: income - expense,
      byCategory: [...byCategory.values()].sort((a, b) => b.total - a.total),
      history: history.map((h) => ({
        month: h.month,
        income: num(h.income),
        expense: num(h.expense),
        balance: num(h.income) - num(h.expense),
      })),
      investmentBalance: invBalance,
      nextLoan: nextLoan
        ? {
            due: nextLoan.due_on,
            payment: num(nextLoan.payment),
            installment: nextLoan.installment,
            remaining: num(nextLoan.opening_balance),
          }
        : null,
      emergency: emergency
        ? {
            name: emergency.name,
            current: invBalance,
            target: num(emergency.target_amount),
            deadline: emergency.deadline,
          }
        : null,
      potentialSaving: savings,
      upcoming,
      insights,
      recent: monthTx.slice(-8).reverse().map(mapTx),
      settings: settingsRows[0]
        ? {
            yieldRate: num(settingsRows[0].monthly_yield_rate),
            investPct: num(settingsRows[0].invest_pct),
            emergencyTarget: num(settingsRows[0].emergency_target),
            loanPrincipal: num(settingsRows[0].loan_principal),
            loanInstallment: num(settingsRows[0].loan_installment),
            loanCet: num(settingsRows[0].loan_cet),
          }
        : null,
    };
  });

function buildInsights(input: {
  month: string;
  income: number;
  expense: number;
  invBalance: number;
  emergencyTarget: number;
  nextLoan: { due: string; payment: number; installment: number } | null;
  costs: { name: string; current: number; target: number; status: string }[];
  byCategory: { name: string; total: number }[];
  monthTx: { description: string; amount: number; installment: string | null; direction: string }[];
}) {
  const items: { id: string; tone: "ok" | "warn" | "risk" | "info"; title: string; body: string }[] = [];
  const leftover = input.income - input.expense;
  const suggested = leftover * 0.5;

  if (input.income > 0) {
    items.push({
      id: "audit",
      tone: leftover > 0 ? "ok" : "risk",
      title: "Auditoria do mês",
      body: leftover >= 0
        ? `Sobram ${formatInsightMoney(leftover)} neste mês (${Math.round((leftover / input.income) * 100)}% da receita). Aporte sugerido: ${formatInsightMoney(suggested)}.`
        : `O mês fecha negativo em ${formatInsightMoney(Math.abs(leftover))}. Priorize cortar gerais e cartão antes de investir.`,
    });
  }

  const top = input.byCategory[0];
  if (top) {
    items.push({
      id: "leak",
      tone: top.total > input.income * 0.2 ? "warn" : "info",
      title: "Detector de vazamentos",
      body: `${top.name} é a maior saída (${formatInsightMoney(top.total)}). Planos de saúde somados passam de R$ 500/mês — vale um combo familiar.`,
    });
  }

  const pendingCuts = input.costs.filter((c) => c.status === "pending" && c.current > c.target);
  const save = pendingCuts.reduce((s, c) => s + (c.current - c.target), 0);
  if (save > 0) {
    items.push({
      id: "cuts",
      tone: "warn",
      title: "Redução de custos",
      body: `${pendingCuts.length} contas ainda dá para negociar. Economia potencial: ${formatInsightMoney(save)}/mês — ${formatInsightMoney(save * 12)} no ano.`,
    });
  }

  const reservePct = input.emergencyTarget > 0 ? input.invBalance / input.emergencyTarget : 0;
  items.push({
    id: "reserve",
    tone: reservePct >= 1 ? "ok" : reservePct >= 0.4 ? "info" : "warn",
    title: "Plano de riqueza",
    body:
      reservePct >= 1
        ? `Reserva completa. Mantenha o aporte e deixe o CDB trabalhar.`
        : `Reserva em ${Math.round(reservePct * 100)}% da meta de ${formatInsightMoney(input.emergencyTarget)}. Faltam ${formatInsightMoney(Math.max(0, input.emergencyTarget - input.invBalance))}.`,
  });

  if (input.nextLoan) {
    items.push({
      id: "loan",
      tone: "info",
      title: "Otimizador de caixa",
      body: `Parcela ${input.nextLoan.installment}/36 do LECCA (${formatInsightMoney(input.nextLoan.payment)}) vence em ${formatDate(input.nextLoan.due)}. Pague depois do adiantamento do dia 5 para não furar o caixa.`,
    });
  }

  const lastParcel = input.monthTx.find((t) => t.installment?.includes("/6") && t.description.toLowerCase().includes("sof"));
  if (lastParcel) {
    items.push({
      id: "sofa",
      tone: "ok",
      title: "Parcelamento acabando",
      body: `Sofá ${lastParcel.installment} — depois disso o caixa ganha ${formatInsightMoney(lastParcel.amount)} todo mês.`,
    });
  }

  return items;
}

function formatInsightMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export const listTransactions = createServerFn({ method: "GET" })
  .validator((input: { month?: string; direction?: string } | undefined) => input ?? {})
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const month = data.month && /^\d{4}-\d{2}$/.test(data.month) ? data.month : currentMonthKey();
    const start = `${month}-01`;
    const next = `${shiftMonth(month, 1)}-01`;
    const rows = await sql<TxRow>`
      select t.id, t.occurred_on::text as occurred_on, t.description, t.amount, t.direction,
             t.category_id, t.card_id, t.installment_label, t.status, t.notes,
             c.name as cat_name, c.tone as cat_tone, k.name as card_name
      from transactions t
      left join categories c on c.id = t.category_id
      left join cards k on k.id = t.card_id
      where t.user_id = ${context.userId}
        and t.occurred_on >= ${start}::date
        and t.occurred_on < ${next}::date
      order by t.occurred_on desc, t.created_at desc
    `;
    const list = rows.map(mapTx).filter((t) => !data.direction || t.direction === data.direction);
    const income = list.filter((t) => t.direction === "in").reduce((s, t) => s + t.amount, 0);
    const expense = list.filter((t) => t.direction === "out").reduce((s, t) => s + t.amount, 0);
    return { month, items: list, income, expense, balance: income - expense };
  });

export const addTransaction = createServerFn({ method: "POST" })
  .validator((input: {
    occurredOn: string;
    description: string;
    amount: number;
    direction: "in" | "out";
    categoryId?: string | null;
    cardId?: string | null;
    installment?: string | null;
    status?: string;
    notes?: string | null;
  }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!data.description.trim() || !Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("Informe descrição e um valor válido.");
    }
    const sql = await getSql();
    const id = uid("tx");
    await sql`
      insert into transactions (
        id, user_id, occurred_on, description, amount, direction,
        category_id, card_id, installment_label, status, notes
      ) values (
        ${id}, ${context.userId}, ${data.occurredOn}::date, ${data.description.trim()}, ${data.amount},
        ${data.direction}, ${data.categoryId ?? null}, ${data.cardId ?? null},
        ${data.installment ?? null}, ${data.status ?? (data.direction === "in" ? "received" : "pending")},
        ${data.notes ?? null}
      )
    `;
    return { id };
  });

export const toggleTransaction = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; direction: string; status: string }>`
      select id, direction, status from transactions where id = ${data.id} and user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row) throw new Error("Lançamento não encontrado");
    const next =
      row.direction === "in"
        ? row.status === "received"
          ? "pending"
          : "received"
        : row.status === "paid"
          ? "pending"
          : "paid";
    await sql`
      update transactions set status = ${next} where id = ${data.id} and user_id = ${context.userId}
    `;
    return { status: next };
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from transactions where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const upsertCard = createServerFn({ method: "POST" })
  .validator((input: {
    id?: string;
    name: string;
    holder?: string;
    brand?: string;
    creditLimit: number;
    closingDay: number;
    dueDay: number;
  }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.id) {
      await sql`
        update cards
        set name = ${data.name}, holder = ${data.holder ?? null}, brand = ${data.brand ?? null},
            credit_limit = ${data.creditLimit}, closing_day = ${data.closingDay}, due_day = ${data.dueDay}
        where id = ${data.id} and user_id = ${context.userId}
      `;
      return { id: data.id };
    }
    const id = uid("card");
    await sql`
      insert into cards (id, user_id, name, holder, brand, credit_limit, closing_day, due_day)
      values (${id}, ${context.userId}, ${data.name}, ${data.holder ?? null}, ${data.brand ?? null},
              ${data.creditLimit}, ${data.closingDay}, ${data.dueDay})
    `;
    return { id };
  });

export const getCards = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const month = currentMonthKey();
    const start = `${month}-01`;
    const next = `${shiftMonth(month, 1)}-01`;
    const cards = await sql<CardRow>`
      select id, name, holder, brand, credit_limit, closing_day, due_day
      from cards where user_id = ${context.userId} order by name
    `;
    const spend = await sql<{ card_id: string; total: string | number }>`
      select card_id, coalesce(sum(amount), 0) as total
      from transactions
      where user_id = ${context.userId}
        and direction = 'out'
        and card_id is not null
        and occurred_on >= ${start}::date
        and occurred_on < ${next}::date
      group by card_id
    `;
    const spendMap = new Map(spend.map((s) => [s.card_id, num(s.total)]));
    const parcels = await sql<TxRow>`
      select t.id, t.occurred_on::text as occurred_on, t.description, t.amount, t.direction,
             t.category_id, t.card_id, t.installment_label, t.status, t.notes,
             c.name as cat_name, c.tone as cat_tone, k.name as card_name
      from transactions t
      left join categories c on c.id = t.category_id
      left join cards k on k.id = t.card_id
      where t.user_id = ${context.userId}
        and t.installment_label is not null
        and t.occurred_on >= ${start}::date
      order by t.occurred_on
    `;
    return {
      month,
      cards: cards.map((c) => {
        const used = spendMap.get(c.id) ?? 0;
        const limit = num(c.credit_limit);
        return {
          id: c.id,
          name: c.name,
          holder: c.holder,
          brand: c.brand,
          creditLimit: limit,
          closingDay: c.closing_day,
          dueDay: c.due_day,
          used,
          available: Math.max(0, limit - used),
        };
      }),
      parcels: parcels.map(mapTx),
    };
  });

export const getInvestments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const rows = await sql<InvRow>`
      select id, month::text as month, contribution, yield_amount, balance
      from investments where user_id = ${context.userId} order by month
    `;
    const settings = await sql<SettingsRow>`
      select monthly_yield_rate, invest_pct, emergency_target, loan_principal, loan_installment, loan_cet
      from settings where user_id = ${context.userId}
    `;
    const rate = settings[0] ? num(settings[0].monthly_yield_rate) : 0.0115;
    const last = rows.at(-1);
    const startBalance = last ? num(last.balance) : 0;
    const projection = projectInvestment(startBalance, 2000, rate, 24);
    return {
      history: rows.map((r) => ({
        id: r.id,
        month: monthKey(r.month),
        contribution: num(r.contribution),
        yieldAmount: num(r.yield_amount),
        balance: num(r.balance),
      })),
      rate,
      emergencyTarget: settings[0] ? num(settings[0].emergency_target) : 10000,
      current: startBalance,
      projection,
    };
  });

function projectInvestment(start: number, aporte: number, rate: number, months: number) {
  const out: { monthOffset: number; contribution: number; yieldAmount: number; balance: number }[] = [];
  let bal = start;
  for (let i = 1; i <= months; i++) {
    const yieldAmount = bal * rate;
    bal = bal + aporte + yieldAmount;
    out.push({ monthOffset: i, contribution: aporte, yieldAmount, balance: bal });
  }
  return out;
}

export const addContribution = createServerFn({ method: "POST" })
  .validator((input: { amount: number; month?: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error("Informe um aporte válido.");
    const sql = await getSql();
    const month = (data.month && /^\d{4}-\d{2}$/.test(data.month) ? data.month : currentMonthKey()) + "-01";
    const settings = await sql<SettingsRow>`
      select monthly_yield_rate from settings where user_id = ${context.userId}
    `;
    const rate = settings[0] ? num(settings[0].monthly_yield_rate) : 0.0115;
    const prev = await sql<InvRow>`
      select id, month::text as month, contribution, yield_amount, balance
      from investments where user_id = ${context.userId} order by month desc limit 1
    `;
    const lastBal = prev[0] ? num(prev[0].balance) : 0;
    const yieldAmount = lastBal * rate;
    const balance = lastBal + data.amount + yieldAmount;
    const existing = await sql<{ id: string }>`
      select id from investments where user_id = ${context.userId} and month = ${month}::date
    `;
    if (existing[0]) {
      await sql`
        update investments
        set contribution = ${data.amount}, yield_amount = ${yieldAmount}, balance = ${balance}
        where id = ${existing[0].id} and user_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into investments (id, user_id, month, contribution, yield_amount, balance)
        values (${uid("inv")}, ${context.userId}, ${month}::date, ${data.amount}, ${yieldAmount}, ${balance})
      `;
    }
    await sql`
      update goals set current_amount = ${balance}
      where user_id = ${context.userId} and kind = 'emergency'
    `;
    return { balance };
  });

export const getLoan = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const rows = await sql<LoanRow>`
      select id, installment, due_on::text as due_on, opening_balance, interest_amount,
             amortization, payment, closing_balance, paid
      from loan_payments where user_id = ${context.userId} order by installment
    `;
    const settings = await sql<SettingsRow>`
      select loan_principal, loan_installment, loan_cet, monthly_yield_rate
      from settings where user_id = ${context.userId}
    `;
    const inv = await sql<InvRow>`
      select id, month::text as month, contribution, yield_amount, balance
      from investments where user_id = ${context.userId} order by month desc limit 1
    `;
    const payments = rows.map((r) => ({
      id: r.id,
      installment: r.installment,
      dueOn: r.due_on,
      opening: num(r.opening_balance),
      interest: num(r.interest_amount),
      amort: num(r.amortization),
      payment: num(r.payment),
      closing: num(r.closing_balance),
      paid: Boolean(r.paid),
    }));
    const totalInterest = payments.reduce((s, p) => s + p.interest, 0);
    const totalPaid = payments.reduce((s, p) => s + p.payment, 0);
    const remaining = payments.filter((p) => !p.paid);
    const next = remaining[0] ?? null;
    const rate = settings[0] ? num(settings[0].monthly_yield_rate) : 0.0116;
    const avgInterest = totalInterest / Math.max(payments.length, 1);
    const cruzamento = buildCruzamento(inv[0] ? num(inv[0].balance) : 2528.75, 1500, rate, avgInterest, 36);
    return {
      principal: settings[0] ? num(settings[0].loan_principal) : 13600,
      installment: settings[0] ? num(settings[0].loan_installment) : 560,
      cet: settings[0] ? num(settings[0].loan_cet) : 0.0243,
      totalInterest,
      totalPaid,
      remainingCount: remaining.length,
      remainingBalance: next ? next.opening : 0,
      next,
      payments,
      cruzamento,
    };
  });

function buildCruzamento(
  startInvest: number,
  aporte: number,
  yieldRate: number,
  avgLoanInterest: number,
  months: number,
) {
  const rows: {
    month: number;
    loanInterest: number;
    yieldAmount: number;
    diff: number;
    balance: number;
  }[] = [];
  let bal = startInvest;
  let cross: number | null = null;
  for (let i = 1; i <= months; i++) {
    const yieldAmount = bal * yieldRate;
    bal = bal + aporte + yieldAmount;
    const diff = yieldAmount - avgLoanInterest;
    if (cross === null && diff > 0) cross = i;
    rows.push({ month: i, loanInterest: avgLoanInterest, yieldAmount, diff, balance: bal });
  }
  return {
    avgLoanInterest,
    crossMonth: cross,
    totalYield: rows.reduce((s, r) => s + r.yieldAmount, 0),
    totalLoanInterest: avgLoanInterest * months,
    finalBalance: rows.at(-1)?.balance ?? startInvest,
    rows,
  };
}

export const toggleLoanPaid = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update loan_payments set paid = not paid
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const getPlanning = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded(context.userId);
    const sql = await getSql();
    const goals = await sql<GoalRow>`
      select id, name, target_amount, current_amount, deadline::text as deadline, kind
      from goals where user_id = ${context.userId}
    `;
    const costs = await sql<CostRow>`
      select id, expense_name, current_amount, target_amount, status, action_note
      from cost_actions where user_id = ${context.userId} order by current_amount desc
    `;
    const inv = await sql<InvRow>`
      select balance from investments where user_id = ${context.userId} order by month desc limit 1
    `;
    return {
      goals: goals.map((g) => ({
        id: g.id,
        name: g.name,
        target: num(g.target_amount),
        current: g.kind === "emergency" && inv[0] ? num(inv[0].balance) : num(g.current_amount),
        deadline: g.deadline,
        kind: g.kind,
      })),
      costs: costs.map((c) => ({
        id: c.id,
        name: c.expense_name,
        current: num(c.current_amount),
        target: num(c.target_amount),
        saving: Math.max(0, num(c.current_amount) - num(c.target_amount)),
        status: c.status,
        note: c.action_note,
      })),
    };
  });

export const setCostStatus = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update cost_actions set status = ${data.status}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const askAssistant = createServerFn({ method: "POST" })
  .validator((input: { question: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const question = data.question.trim();
    if (!question) return { ok: false as const, error: "Escreva uma pergunta." };
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Assistente indisponível neste ambiente." };

    const sql = await getSql();
    const month = currentMonthKey();
    const start = `${month}-01`;
    const next = `${shiftMonth(month, 1)}-01`;
    const tx = await sql<{ description: string; amount: string | number; direction: string; status: string; cat: string | null }>`
      select t.description, t.amount, t.direction, t.status, c.name as cat
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${context.userId}
        and t.occurred_on >= ${start}::date
        and t.occurred_on < ${next}::date
    `;
    const snapshot = tx
      .map((t) => `${t.direction === "in" ? "+" : "-"} ${t.description} (${t.cat ?? "—"}): ${num(t.amount)} [${t.status}]`)
      .join("\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content:
              "Você é o assistente do Bolso360, app de finanças pessoais de uma família brasileira. Responda em português, curto e direto, com valores em R$. Use só os dados fornecidos. Sem enrolação.",
          },
          {
            role: "user",
            content: `Mês ${month}. Lançamentos:\n${snapshot || "(vazio)"}\n\nPergunta: ${question}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: "Não consegui consultar o assistente agora." };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { ok: true as const, text: body.choices?.[0]?.message?.content ?? "" };
  });
