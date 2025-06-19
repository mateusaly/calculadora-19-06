// VERSÃO FINAL COMPLETA - 19/06/2025
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================================
    // 1. CONFIGURAÇÃO E CONSTANTES
    // ===================================================================================
    const ESTOQUE_BOARD_ID = 9372486321;
    const ORCAMENTOS_BOARD_ID = 9373086154;
    const PRECO_M2_COLUMN_ID = "numeric_mkrybp6w";
    const ESTOQUE_COLUMN_ID = "numeric_mkryfs28";

    // IDs do quadro de Orçamentos
    const SALESPERSON_COLUMN_ID = "text_mks0v79y";
    const CLIENT_COLUMN_ID = "text_mkry3fgw";
    const EMAIL_COLUMN_ID = "email_mks08rq9";
    const TOTAL_COLUMN_ID = "numeric_mkryvq1k";
    const ITEMS_COLUMN_ID = "text_mkry6hxt";
    const DATE_COLUMN_ID = "data";
    const JSON_DATA_COLUMN_ID = "text_mkry709q";

    const ITENS_PEDRA = ['Bancada', 'Fechamento lateral esquerdo', 'Frontão', 'Saia', 'Rodabase', 'Tabeira', 'Baguete', 'Soleira', 'Pingadeira', 'Virada', 'Borda de Piscina', 'Divisória', 'Escada Pisada', 'Escada Espelho', 'Lavatório Esculpido', 'Lavatório com Cuba', 'Mesa', 'Painel', 'Painel de Parede', 'Patamar', 'Peitoril', 'Rodapé'];
    const PRECOS_CUBAS = { 'Cuba 01 (Cozinha / Área Gourmet)': 450.00, 'Cuba 02 (Cozinha / Área Gourmet)': 550.00, 'Cuba Lavatório': 300.00, 'Cuba Lavanderia': 250.00 };
    
    let materialsData = [];
    let historyData = [];

    // ===================================================================================
    // 2. REFERÊNCIAS DO DOM
    // ===================================================================================
    const form = document.getElementById('quote-form');
    const historySelect = document.getElementById('history-select');
    const materialSelect = document.getElementById('material-select');
    const environmentsContainer = document.getElementById('environments-container');
    const addEnvironmentBtn = document.getElementById('add-environment-btn');
    const environmentTemplate = document.getElementById('environment-template').firstElementChild;
    const cubasContainer = document.getElementById('cubas-container');
    const freteInput = document.getElementById('frete-input');
    const priceAdjustmentInput = document.getElementById('price-adjustment');
    const totalCostDisplay = document.getElementById('total-cost');
    const costBreakdownContainer = document.getElementById('cost-breakdown');
    // Adicione outras referências se forem necessárias

    // ===================================================================================
    // 3. FUNÇÕES DE API (JÁ VALIDADAS)
    // ===================================================================================
    async function mondayApiCall(query) {
        const response = await fetch('/api/monday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error(`Falha na chamada da API, status: ${response.status}`);
        return response.json();
    }

    async function fetchMaterials() {
        materialSelect.innerHTML = '<option>Buscando materiais...</option>';
        try {
            const query = `query { boards(ids: ${ESTOQUE_BOARD_ID}) { items_page(limit: 500) { items { name, column_values(ids:["${PRECO_M2_COLUMN_ID}"]) { id, text } } } } }`;
            const response = await mondayApiCall(query);
            materialsData = response.data.boards[0].items_page.items;
            populateMaterials();
        } catch (error) {
            console.error("Erro ao buscar materiais:", error);
            materialSelect.innerHTML = '<option>Erro ao carregar.</option>';
        }
    }
    // Adicionar fetchHistory se quiser testá-lo também

    // ===================================================================================
    // 4. LÓGICA DA UI E CÁLCULOS
    // ===================================================================================
    function populateMaterials() {
        materialSelect.innerHTML = '<option value="">-- Selecione um Material --</option>';
        materialsData.forEach(item => {
            const price = item.column_values.find(c => c.id === PRECO_M2_COLUMN_ID)?.text || '0';
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = `${item.name} (R$ ${parseFloat(price).toFixed(2)} / m²)`;
            materialSelect.appendChild(option);
        });
    }

    function populateCheckboxes() {
        cubasContainer.innerHTML = '';
        Object.keys(PRECOS_CUBAS).forEach(name => {
            const price = PRECOS_CUBAS[name];
            cubasContainer.innerHTML += `<label><input type="checkbox" name="cuba" value="${name}"> ${name} - R$ ${price.toFixed(2)}</label>`;
        });
    }

    function addEnvironment() {
        const newEnvironment = environmentTemplate.cloneNode(true);
        const stoneItemsContainer = newEnvironment.querySelector('.stone-items-container');
        stoneItemsContainer.innerHTML = '';
        ITENS_PEDRA.forEach(item => {
            const uniqueId = `item-${Date.now()}-${Math.random()}`;
            stoneItemsContainer.innerHTML += `
                <div>
                    <label><input type="checkbox" class="stone-item-cb" value="${item}"> ${item}</label>
                    <div id="${uniqueId}" class="item-medidas hidden">
                        <input type="number" step="1" min="0" class="medida" placeholder="Comprimento (cm)">
                        <input type="number" step="1" min="0" class="medida" placeholder="Largura (cm)">
                    </div>
                </div>`;
        });
        environmentsContainer.appendChild(newEnvironment);
    }
    
    function calculateTotal() {
        let subtotalCost = 0;
        let totalLinearMeters = 0;
        let breakdownItems = [];
        
        const selectedMaterialName = materialSelect.value;
        const materialInfo = materialsData.find(m => m.name === selectedMaterialName);
        const materialPricePerM2 = materialInfo ? parseFloat(materialInfo.column_values.find(c => c.id === PRECO_M2_COLUMN_ID)?.text || '0') : 0;

        document.querySelectorAll('.environment-block').forEach(envBlock => {
            const envName = envBlock.querySelector('.environment-name').value.trim() || "Ambiente sem nome";
            envBlock.querySelectorAll('.stone-item-cb:checked').forEach(checkbox => {
                const medidasInputs = checkbox.closest('div').querySelector('.item-medidas').querySelectorAll('.medida');
                const comprimentoCm = parseFloat(medidasInputs[0].value) || 0;
                const larguraCm = parseFloat(medidasInputs[1].value) || 0;

                if (comprimentoCm > 0 && larguraCm > 0 && materialPricePerM2 > 0) {
                    const areaM2 = (comprimentoCm / 100) * (larguraCm / 100);
                    const linearMeters = ((comprimentoCm / 100) * 2) + ((larguraCm / 100) * 2);
                    const itemCost = areaM2 * materialPricePerM2;

                    subtotalCost += itemCost;
                    totalLinearMeters += linearMeters;
                    breakdownItems.push({ category: 'Peças de Pedra', description: `${checkbox.value} (${envName})`, details: `${areaM2.toFixed(3)} m²`, subtotal: itemCost });
                }
            });
        });

        document.querySelectorAll('input[name="cuba"]:checked').forEach(cuba => {
            const price = PRECOS_CUBAS[cuba.value];
            subtotalCost += price;
            breakdownItems.push({ category: 'Cubas', description: cuba.value, details: '1 un.', subtotal: price });
        });

        const localidade = document.querySelector('input[name="localidade"]:checked').value;
        let maoDeObraCost = 0;
        if (totalLinearMeters > 0) {
            const custoLinear = totalLinearMeters * 200;
            if (localidade === 'mogi') {
                maoDeObraCost = Math.max(200, custoLinear);
                breakdownItems.push({ category: 'Mão de Obra', description: `Serviço - Mogi e Região`, details: `${totalLinearMeters.toFixed(2)}m lineares`, subtotal: maoDeObraCost });
            } else if (localidade === 'sp') {
                maoDeObraCost = Math.max(280, custoLinear);
                breakdownItems.push({ category: 'Mão de Obra', description: `Serviço - Capital SP`, details: `${totalLinearMeters.toFixed(2)}m lineares`, subtotal: maoDeObraCost });
            }
        }

        const frete = parseFloat(freteInput.value) || 0;
        const ajustePercentual = parseFloat(priceAdjustmentInput.value) || 0;
        const subtotalFinal = subtotalCost + maoDeObraCost;
        const ajusteValor = subtotalFinal * (ajustePercentual / 100);
        const totalCost = subtotalFinal + frete + ajusteValor;

        return { totalCost, breakdownItems, subtotal: subtotalFinal, frete, ajuste: ajusteValor };
    }

    function updateBreakdownUI(items, subtotal, frete, ajuste, total) {
        totalCostDisplay.textContent = `R$ ${total.toFixed(2)}`;

        if (items.length === 0) {
            costBreakdownContainer.innerHTML = `<p class="breakdown-placeholder">Selecione itens para ver o resumo detalhado.</p>`;
            return;
        }

        let html = `<table><thead><tr><th>Descrição</th><th>Detalhes</th><th>Subtotal</th></tr></thead><tbody>`;
        let currentCategory = "";
        items.forEach(item => {
            if (item.category !== currentCategory) {
                currentCategory = item.category;
                html += `<tr class="category-header"><td colspan="3">${currentCategory}</td></tr>`;
            }
            html += `<tr><td>${item.description}</td><td>${item.details}</td><td>R$ ${item.subtotal.toFixed(2)}</td></tr>`;
        });
        html += `</tbody></table>`;
        
        html += `<table style="margin-top: 20px; width: 50%; float: right; text-align: right; border: none;">
                    <tr style="border: none;"><td style="font-weight: bold; border: none;">Subtotal dos Itens:</td><td style="border: none;">R$ ${subtotal.toFixed(2)}</td></tr>
                    <tr style="border: none;"><td style="font-weight: bold; border: none;">Frete:</td><td style="border: none;">R$ ${frete.toFixed(2)}</td></tr>
                    <tr style="border: none;"><td style="font-weight: bold; border: none;">Ajuste (${ajuste >= 0 ? '+' : ''}${priceAdjustmentInput.value || 0}%):</td><td style="border: none;">R$ ${ajuste.toFixed(2)}</td></tr>
                 </table><div style="clear:both;"></div>`;
                 
        costBreakdownContainer.innerHTML = html;
    }

    function handleFormChange() {
        const result = calculateTotal();
        updateBreakdownUI(result.breakdownItems, result.subtotal, result.frete, result.ajuste, result.totalCost);
    }
    
    // ===================================================================================
    // 5. EVENT LISTENERS E INICIALIZAÇÃO
    // ===================================================================================
    
    form.addEventListener('input', handleFormChange);
    addEnvironmentBtn.addEventListener('click', addEnvironment);
    
    environmentsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('stone-item-cb')) {
            e.target.closest('div').querySelector('.item-medidas').classList.toggle('hidden', !e.target.checked);
        }
    });

    environmentsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-environment-btn')) {
            e.target.closest('.environment-block').remove();
            handleFormChange();
        }
    });
    
    function init() {
        const quoteDateInput = document.getElementById('quote-date');
        quoteDateInput.valueAsDate = new Date();
        populateCheckboxes();
        addEnvironment();
        fetchMaterials();
        // fetchHistory(); // Deixamos o histórico para a Fase 2
        handleFormChange();
    }

    init();
});