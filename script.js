const baseChecklist = [
  "Documento com CPF e dados cadastrais atualizados.",
  "Última declaração entregue e recibo, se houver.",
  "Informes de rendimentos e informes bancários de 31/12/2025."
];

const profileChecklist = {
  assalariado: ["Informe de rendimentos do empregador."],
  aposentado: ["Informe de rendimentos do INSS, previdência privada ou fonte pagadora."],
  autonomo: ["Livro-caixa, recibos, notas emitidas e comprovantes de despesas dedutíveis."],
  empresario: ["Informe de pró-labore, distribuição de lucros e participações societárias."]
};

const eventChecklist = {
  dependentes: "CPF, data de nascimento e comprovantes de dependentes, pensão ou guarda.",
  saude: "Comprovantes de despesas médicas, odontológicas e informe do plano de saúde.",
  investimentos: "Informes de corretoras, bancos digitais, criptoativos, posição de 31/12 e apurações mensais.",
  imoveis: "Contrato, escritura, financiamento, aluguel recebido/pago e dados de compra ou venda de imóvel.",
  bens: "CRLV, recibos, contratos e dados de compra ou venda de veículos e outros bens.",
  dividas: "Saldos, contratos e informes de empréstimos, financiamentos e dívidas em 31/12."
};

const plans = {
  essencial: {
    title: "Plano recomendado: IRPF Essencial",
    copy: "Ideal para declarações simples com informes de rendimento, bancos, saúde e bens básicos."
  },
  investidor: {
    title: "Plano recomendado: IRPF Investidor",
    copy: "Recomendado quando existem investimentos, renda variável, cripto, exterior ou muitos informes."
  },
  patrimonial: {
    title: "Plano recomendado: IRPF Patrimonial",
    copy: "Indicado para imóveis, aluguel, venda de bens, herança, dependentes complexos ou maior risco fiscal."
  }
};

const form = document.querySelector("#triage-form");
const checklist = document.querySelector("#checklist");
const recommendationTitle = document.querySelector("#recommendation-title");
const recommendationCopy = document.querySelector("#recommendation-copy");
const whatsappLink = document.querySelector("#whatsapp-link");
const copyButton = document.querySelector("#copy-summary");

let currentSummary = "";

function getCheckedEvents() {
  return [...document.querySelectorAll('input[name="events"]:checked')].map((input) => input.value);
}

function pickPlan(profile, status, events) {
  if (events.includes("imoveis") || events.includes("bens") || profile === "empresario") {
    return "patrimonial";
  }

  if (events.includes("investimentos") || profile === "autonomo") {
    return "investidor";
  }

  if (status === "retificacao" && events.length >= 2) {
    return "patrimonial";
  }

  return "essencial";
}

function buildChecklist(profile, status, events) {
  const items = [...baseChecklist, ...(profileChecklist[profile] || [])];

  events.forEach((event) => {
    items.push(eventChecklist[event]);
  });

  if (status === "atraso") {
    items.push("Verificar multa por atraso, DARF gerado e data de transmissão.");
  }

  if (status === "retificacao") {
    items.push("Separar declaração original, recibo e motivo da retificação.");
  }

  return [...new Set(items)];
}

function renderChecklist(items) {
  checklist.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    checklist.appendChild(li);
  });
}

function updateWhatsApp(summary) {
  const text = encodeURIComponent(summary);
  whatsappLink.href = `https://wa.me/5500000000000?text=${text}`;
}

function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("client-name") || "Cliente";
  const profile = data.get("profile");
  const status = data.get("status");
  const events = getCheckedEvents();
  const planKey = pickPlan(profile, status, events);
  const plan = plans[planKey];
  const items = buildChecklist(profile, status, events);

  recommendationTitle.textContent = plan.title;
  recommendationCopy.textContent = plan.copy;
  renderChecklist(items);

  currentSummary = [
    `Triagem ORISCONTA - ${name}`,
    plan.title,
    `Perfil: ${profile}`,
    `Situação: ${status}`,
    `Eventos: ${events.length ? events.join(", ") : "sem eventos adicionais"}`,
    "Checklist:",
    ...items.map((item) => `- ${item}`)
  ].join("\n");

  updateWhatsApp(currentSummary);
}

copyButton.addEventListener("click", async () => {
  if (!currentSummary) {
    form.requestSubmit();
  }

  try {
    await navigator.clipboard.writeText(currentSummary);
    copyButton.textContent = "Resumo copiado";
    setTimeout(() => {
      copyButton.textContent = "Copiar resumo";
    }, 1800);
  } catch {
    copyButton.textContent = "Selecione e copie";
  }
});

form.addEventListener("submit", handleSubmit);
