# 📊 Growth Insight

Dashboard de performance de marketing que transforma um CSV de campanhas em KPIs visuais **e** um resumo executivo gerado por IA (Gemini) — pronto para reportar à liderança.

> **"Não basta ter o dado. Growth é sobre transformar dado em decisão."**

O **Growth Insight** nasceu de uma dor real: relatórios de performance (CPA, ROAS, ROI) exigem que alguém sente e escreva a leitura estratégica toda semana. Este projeto automatiza essa última milha — os números viram gráfico, e o gráfico vira um parágrafo de análise, gerado por IA a partir dos dados reais carregados.

---

## 🎯 O Problema vs. A Solução

Dashboards tradicionais mostram números, mas exigem que um analista humano interprete e escreva a narrativa toda vez. O Growth Insight fecha esse ciclo:

- **Upload de CSV → KPIs automáticos:** investimento, receita, ROAS, CPA e ROI calculados na hora, sem planilha.
- **Visualização instantânea:** evolução de investimento vs. receita, e ROAS por campanha, para identificar rápido onde realocar orçamento.
- **Resumo executivo por IA:** um clique envia os KPIs agregados (nunca dados brutos/sensíveis) para a API do Gemini, que devolve uma leitura de diretoria — melhor e pior campanha, e uma recomendação prática.
- **Modo demo sem API key:** o dashboard funciona 100% mesmo sem configurar nenhuma chave, com um gerador de insight local baseado em regras — ótimo para testar ou apresentar sem depender de custo de API.

## 🚀 Funcionalidades Principais

- **Importação de CSV** por clique ou arrastar-e-soltar.
- **5 KPIs consolidados:** Investimento, Receita, ROAS médio, CPA médio, ROI.
- **2 visualizações:** série temporal (investimento vs. receita) e ranking de ROAS por campanha, com Chart.js.
- **Insight por IA:** integração direta com a API do Gemini (`generateContent`), com fallback automático em modo demo se não houver chave configurada ou se a chamada falhar.
- **Privacidade:** a API key fica salva apenas no `localStorage` do navegador de quem está usando — nunca é enviada a nenhum servidor além da própria API do Google.

## 💻 Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black) ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2.svg?style=for-the-badge&logo=google&logoColor=white)

- **Vanilla JS** para parsing de CSV, cálculo de KPIs e orquestração da UI (sem frameworks, sem build step).
- **Chart.js** para as visualizações.
- **Gemini API** (`generateContent`) para a geração do resumo executivo em linguagem natural.
- **LocalStorage** para persistir a API key só no navegador do usuário.

## 🔧 Como Utilizar (Localmente)

1. Clone este repositório:
   ```bash
   git clone https://github.com/jucaoliveira-hub/growth-insight.git
   ```
2. Abra a pasta do projeto e clique duas vezes em `index.html` (ou publique via GitHub Pages / Netlify).
3. Clique em **"Usar dados de exemplo"** para ver o dashboard funcionando na hora — ou suba seu próprio CSV com as colunas:
   ```
   date, campaign, market, spend, clicks, impressions, conversions, revenue
   ```
4. (Opcional) Abra "Configurar API do Gemini", cole sua chave gerada em [aistudio.google.com](https://aistudio.google.com/app/apikey) e clique em **"Gerar resumo executivo"** para uma leitura por IA baseada nos seus dados reais.

## 🗺️ Próximos passos

- [ ] Exportar o resumo executivo em PDF.
- [ ] Suporte a múltiplos formatos de data e moeda.
- [ ] Comparação entre dois períodos (semana atual vs. anterior).

---

## 👤 Autor

**Juca Dolci** — *Growth Strategist & AI Builder*

- **Portfólio:** [jucadolci.netlify.app](https://jucadolci.netlify.app/)
- **LinkedIn:** [linkedin.com/in/jucaaoliveiraa](https://www.linkedin.com/in/jucaaoliveiraa)
- **E-mail:** jucaaoliveiraa.13@gmail.com

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
