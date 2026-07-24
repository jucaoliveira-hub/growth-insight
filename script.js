/* ==========================================================
   Growth Insight — Dashboard de Performance com IA
   Vanilla JS. Sem frameworks, sem build step.
   ========================================================== */

let rows = [];
let lineChartInstance = null;
let barChartInstance = null;

const statusMsg = document.getElementById('statusMsg');
const fileLabel = document.getElementById('fileLabel');
const csvInput = document.getElementById('csvInput');
const fileDrop = document.getElementById('fileDrop');

// ---------- CSV PARSING ----------
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      const raw = (values[i] || '').trim();
      obj[h] = ['spend', 'clicks', 'impressions', 'conversions', 'revenue'].includes(h)
        ? parseFloat(raw.replace(',', '.')) || 0
        : raw;
    });
    return obj;
  });
}

function handleFile(file) {
  if (!file) return;
  fileLabel.textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      rows = parseCSV(e.target.result);
      if (!rows.length) throw new Error('Arquivo vazio ou em formato inesperado.');
      statusMsg.textContent = `${rows.length} linhas carregadas com sucesso.`;
      renderAll();
    } catch (err) {
      statusMsg.textContent = 'Não consegui ler esse arquivo. Confira se as colunas batem com o esperado.';
      console.error(err);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

csvInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
fileDrop.addEventListener('click', () => csvInput.click());
fileDrop.addEventListener('dragover', (e) => { e.preventDefault(); fileDrop.classList.add('dragover'); });
fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));
fileDrop.addEventListener('drop', (e) => {
  e.preventDefault();
  fileDrop.classList.remove('dragover');
  handleFile(e.dataTransfer.files[0]);
});

document.getElementById('loadSample').addEventListener('click', async () => {
  statusMsg.textContent = 'Carregando dados de exemplo…';
  try {
    const res = await fetch('sample-data.csv');
    const text = await res.text();
    rows = parseCSV(text);
    fileLabel.textContent = 'sample-data.csv (exemplo)';
    statusMsg.textContent = `${rows.length} linhas de exemplo carregadas.`;
    renderAll();
  } catch (err) {
    statusMsg.textContent = 'Não encontrei sample-data.csv — confira se o arquivo está na mesma pasta.';
  }
});

// ---------- KPI CALCULATION ----------
function computeTotals(data) {
  const totals = data.reduce((acc, r) => {
    acc.spend += r.spend || 0;
    acc.clicks += r.clicks || 0;
    acc.impressions += r.impressions || 0;
    acc.conversions += r.conversions || 0;
    acc.revenue += r.revenue || 0;
    return acc;
  }, { spend: 0, clicks: 0, impressions: 0, conversions: 0, revenue: 0 });

  totals.roas = totals.spend ? totals.revenue / totals.spend : 0;
  totals.cpa = totals.conversions ? totals.spend / totals.conversions : 0;
  totals.roi = totals.spend ? (totals.revenue - totals.spend) / totals.spend : 0;
  totals.ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
  return totals;
}

function fmtCurrency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
function fmtPct(v) {
  return (v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
}

function renderKPIs(totals) {
  document.getElementById('kpiSpend').textContent = fmtCurrency(totals.spend);
  document.getElementById('kpiRevenue').textContent = fmtCurrency(totals.revenue);
  document.getElementById('kpiRoas').textContent = totals.roas.toFixed(2) + 'x';
  document.getElementById('kpiCpa').textContent = fmtCurrency(totals.cpa);
  document.getElementById('kpiRoi').textContent = fmtPct(totals.roi);
  document.getElementById('kpiPanel').hidden = false;
}

// ---------- CHARTS ----------
function groupBy(data, key) {
  return data.reduce((acc, r) => {
    const k = r[key] || 'N/A';
    (acc[k] = acc[k] || []).push(r);
    return acc;
  }, {});
}

function renderCharts(data) {
  const byDate = groupBy(data, 'date');
  const dates = Object.keys(byDate).sort();
  const spendSeries = dates.map(d => byDate[d].reduce((s, r) => s + r.spend, 0));
  const revenueSeries = dates.map(d => byDate[d].reduce((s, r) => s + r.revenue, 0));

  const byCampaign = groupBy(data, 'campaign');
  const campaigns = Object.keys(byCampaign);
  const roasSeries = campaigns.map(c => {
    const t = computeTotals(byCampaign[c]);
    return +t.roas.toFixed(2);
  });

  const gridColor = 'rgba(255,255,255,0.06)';
  const textColor = '#8b96aa';

  if (lineChartInstance) lineChartInstance.destroy();
  if (barChartInstance) barChartInstance.destroy();

  lineChartInstance = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'Investimento', data: spendSeries, borderColor: '#f0b429', backgroundColor: 'rgba(240,180,41,0.1)', tension: 0.3, fill: true },
        { label: 'Receita', data: revenueSeries, borderColor: '#29d9c2', backgroundColor: 'rgba(41,217,194,0.12)', tension: 0.3, fill: true }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });

  barChartInstance = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: campaigns,
      datasets: [{ label: 'ROAS', data: roasSeries, backgroundColor: '#29d9c2', borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }
  });

  document.getElementById('chartPanel').hidden = false;
}

function renderAll() {
  const totals = computeTotals(rows);
  renderKPIs(totals);
  renderCharts(rows);
  document.getElementById('aiPanel').hidden = false;
}

// ---------- AI INSIGHT ----------
const apiKeyInput = document.getElementById('apiKey');
const modelInput = document.getElementById('modelName');
const insightOutput = document.getElementById('insightOutput');

// Restore saved key (stored locally in the visitor's own browser only)
apiKeyInput.value = localStorage.getItem('gi_api_key') || '';
apiKeyInput.addEventListener('change', () => localStorage.setItem('gi_api_key', apiKeyInput.value));

function buildSummaryPayload() {
  const totals = computeTotals(rows);
  const byCampaign = groupBy(rows, 'campaign');
  const campaignSummary = Object.entries(byCampaign).map(([name, data]) => {
    const t = computeTotals(data);
    return { campaign: name, spend: +t.spend.toFixed(2), revenue: +t.revenue.toFixed(2), roas: +t.roas.toFixed(2), cpa: +t.cpa.toFixed(2) };
  });
  return { totals, campaignSummary };
}

function typeOut(text) {
  insightOutput.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'terminal-line';
  insightOutput.appendChild(p);
  let i = 0;
  const speed = 12;
  function step() {
    if (i <= text.length) {
      p.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      p.appendChild(cursor);
    }
  }
  step();
}

// Fallback insight generator — runs with zero external dependencies,
// so the dashboard is fully functional even without an API key.
function generateDemoInsight(payload) {
  const { totals, campaignSummary } = payload;
  const best = [...campaignSummary].sort((a, b) => b.roas - a.roas)[0];
  const worst = [...campaignSummary].sort((a, b) => a.roas - b.roas)[0];
  return `[modo demo — sem chamada de API]

Investimento total de ${fmtCurrency(totals.spend)} gerou ${fmtCurrency(totals.revenue)} em receita, um ROAS médio de ${totals.roas.toFixed(2)}x e ROI de ${fmtPct(totals.roi)}.

A campanha "${best.campaign}" teve o melhor desempenho (ROAS ${best.roas}x) e é a principal candidata a receber mais orçamento. Já "${worst.campaign}" apresentou o menor ROAS (${worst.roas}x) — vale revisar segmentação e criativos antes de escalar o investimento.

CPA médio ficou em ${fmtCurrency(totals.cpa)}. Configure sua Gemini API Key acima para gerar uma leitura mais aprofundada, com recomendações específicas por campanha.`;
}

async function callGemini(payload) {
  const key = apiKeyInput.value.trim();
  const model = modelInput.value.trim() || 'gemini-2.0-flash';
  const prompt = `Você é um analista de growth marketing. Com base nestes dados agregados de campanhas (JSON abaixo), escreva um resumo executivo curto (máx. 120 palavras) em português, no tom de um relatório para diretoria: destaque o desempenho geral, aponte a melhor e a pior campanha por ROAS, e dê uma recomendação prática de realocação de orçamento.\n\nDados:\n${JSON.stringify(payload)}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Erro ${res.status} ao chamar a API do Gemini.`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'A API respondeu, mas sem texto utilizável.';
}

document.getElementById('generateInsight').addEventListener('click', async () => {
  if (!rows.length) {
    typeOut('Carregue um CSV (ou os dados de exemplo) antes de gerar o resumo.');
    return;
  }
  const payload = buildSummaryPayload();
  const key = apiKeyInput.value.trim();

  insightOutput.innerHTML = '<p class="terminal-line muted">Gerando resumo…</p>';

  if (!key) {
    setTimeout(() => typeOut(generateDemoInsight(payload)), 300);
    return;
  }

  try {
    const text = await callGemini(payload);
    typeOut(text);
  } catch (err) {
    typeOut(`Não consegui falar com a API do Gemini (${err.message}). Mostrando modo demo:\n\n` + generateDemoInsight(payload));
  }
});
