// VERSÃO FINAL COMPLETA E CORRIGIDA - 19/06/2025
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
    const LOGO_BASE64 = "data:image/jpeg;base64,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A0RmgOryPL/S+/8ADEnzf0vv/Y0RmgO7yPN/S+/8MSfL/S+/8Bo0ZoDu8ny/0vv/AAxJ8v8AS+/9jRmgO7yPL/S+/wDDEny/0vv/AGNEZoDu8jy/0vv/AAxJ8v8AS+/9jRGagO7yPL/S+/8ADEnzf0vv/Y0RmgO7yPN/S+/8MSfN/S+/8Bo0ZoDu8jy/0vv/AAxJ839L7/wGjRmgO7yPN/S+/wDDEnzf0vv/AAGjRmgO7yPN/S+/8MSfN/S+/wDAY0ZoDu8jy/0vv/DEny/0vv/Y0RmgO7yPL/S+/wDDEny/0vv/AGNEZoDu8jy/0vv/AAxJ8v8AS+/9jRGagO7yPL/S+/8ADEnzf0vv/Y0RmgO7yPN/S+/8MSfL/S+/8Bo0ZoDu8jy/0vv/AAxJ839L7/wGjRmgO7yPN/S+/wDDEnzf0vv/AAGjRmgO7yPN/S+/8MSfN/S+/wDAY0ZoDu8jy/0vv/DEny/0vv/Y0RmgO7yPL/S+/wDDEny/0vv/AGNEZoDu8jy/0vv/AAxJ8v8AS+/9jRGagO7yPL/S+/8ADEnzf0vv/Y0RmgO7yPN/S+/8MSfL/S+/8Bo0ZoDu8jy/0vv/AAxJ839L7/wGjRmgO7yPN/S+/wDDEnzf0vv/AAGjRmgO7yPN/S+/8MSfN/S+/wDAY0ZoDu8jy/0vv/DEny/0vv/Y0RmgO7yPL/S+/wDDEny/0vv/AGNEZoDu8jy/0vv/AAxJ8v8AS+/9jRGagCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIi-";

    let materialsData = [];
    let historyData = [];

    // ===================================================================================
    // 2. REFERÊNCIAS DO DOM
    // ===================================================================================
    const form = document.getElementById('quote-form');
    const historySelect = document.getElementById('history-select');
    const loadQuoteBtn = document.getElementById('load-quote-btn');
    const salespersonNameInput = document.getElementById('salesperson-name');
    const quoteDateInput = document.getElementById('quote-date');
    const clientNameInput = document.getElementById('client-name');
    const clientEmailInput = document.getElementById('client-email');
    const clientPhoneInput = document.getElementById('client-phone');
    const clientCpfCnpjInput = document.getElementById('client-cpf-cnpj');
    const clientAddressStreetInput = document.getElementById('client-address-street');
    const clientAddressNumberInput = document.getElementById('client-address-number');
    const clientAddressZipInput = document.getElementById('client-address-zip');
    const clientAddressComplementInput = document.getElementById('client-address-complement');
    const materialSelect = document.getElementById('material-select');
    const refreshMaterialsBtn = document.getElementById('refresh-materials-btn');
    const stockInfoDisplay = document.getElementById('stock-info');
    const environmentsContainer = document.getElementById('environments-container');
    const addEnvironmentBtn = document.getElementById('add-environment-btn');
    const environmentTemplate = document.getElementById('environment-template').firstElementChild;
    const cubasContainer = document.getElementById('cubas-container');
    const freteInput = document.getElementById('frete-input');
    const priceAdjustmentInput = document.getElementById('price-adjustment');
    const totalCostDisplay = document.getElementById('total-cost');
    const costBreakdownContainer = document.getElementById('cost-breakdown');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const statusMessageDiv = document.getElementById('status-message');

    // ===================================================================================
    // 3. FUNÇÕES DE API (SEGURAS)
    // ===================================================================================
    async function mondayApiCall(query, variables = {}) {
        try {
            const response = await fetch('/api/monday', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
            });
            const data = await response.json();
            if (data.errors) { throw new Error(data.errors.map(e => e.message).join('\n')); }
            if (!response.ok) { throw new Error(`API Error: ${data.message || response.statusText}`); }
            return data.data;
        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
            showStatusMessage(`Erro de API: ${error.message}`, 'error');
            throw error;
        }
    }

    async function fetchMaterials() {
        refreshMaterialsBtn.disabled = true;
        refreshMaterialsBtn.querySelector('svg').style.animation = 'spin 1s linear infinite';
        materialSelect.innerHTML = '<option value="">Buscando...</option>';
        const query = `query { boards(ids: ${ESTOQUE_BOARD_ID}) { items_page(limit: 50) { items { name column_values(ids: ["${PRECO_M2_COLUMN_ID}", "${ESTOQUE_COLUMN_ID}"]) { id text } } } } }`;
        try {
            const data = await mondayApiCall(query);
            materialsData = data.boards[0].items_page.items.map(item => ({
                name: item.name,
                price: parseFloat(item.column_values.find(c => c.id === PRECO_M2_COLUMN_ID)?.text || 0),
                stock: parseInt(item.column_values.find(c => c.id === ESTOQUE_COLUMN_ID)?.text || 0)
            })).sort((a, b) => a.name.localeCompare(b.name));
            populateMaterials();
        } catch (error) {
            materialSelect.innerHTML = '<option value="">Falha ao carregar</option>';
        } finally {
            refreshMaterialsBtn.disabled = false;
            refreshMaterialsBtn.querySelector('svg').style.animation = 'none';
        }
    }

    async function fetchHistory() {
        historySelect.innerHTML = '<option value="">Buscando...</option>';
        const query = `query { boards(ids: ${ORCAMENTOS_BOARD_ID}) { items_page(limit: 100) { items { id name column_values(ids: ["${JSON_DATA_COLUMN_ID}"]) { text } } } } }`;
        try {
            const data = await mondayApiCall(query);
            historyData = data.boards[0].items_page.items;
            historySelect.innerHTML = '<option value="">-- Selecione um orçamento para carregar --</option>';
            historyData.sort((a, b) => b.id - a.id).forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                historySelect.appendChild(option);
            });
        } catch (error) {
            historySelect.innerHTML = '<option value="">Falha ao carregar</option>';
        }
    }
    
    async function sendQuoteToMonday(quoteData) {
        const mutation = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) { create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues) { id } }`;
        const columnValues = {
            [SALESPERSON_COLUMN_ID]: quoteData.salespersonName,
            [CLIENT_COLUMN_ID]: quoteData.clientName,
            [EMAIL_COLUMN_ID]: { email: quoteData.clientEmail, text: quoteData.clientEmail },
            [TOTAL_COLUMN_ID]: quoteData.totalCost.toFixed(2),
            [DATE_COLUMN_ID]: quoteData.quoteDate,
            [ITEMS_COLUMN_ID]: quoteData.humanReadableDetails,
            [JSON_DATA_COLUMN_ID]: quoteData.jsonData,
        };
        const variables = {
            boardId: ORCAMENTOS_BOARD_ID,
            itemName: `Orçamento para ${quoteData.clientName || 'Cliente sem nome'}`,
            columnValues: JSON.stringify(columnValues),
        };
        try {
            const data = await mondayApiCall(mutation, variables);
            return data.create_item.id;
        } catch (error) {
            throw new Error('Falha ao salvar o orçamento no Monday.com');
        }
    }

    // ===================================================================================
    // 4. LÓGICA PRINCIPAL DA APLICAÇÃO
    // ===================================================================================
    
    function populateMaterials() {
        const currentSelection = materialSelect.value;
        materialSelect.innerHTML = '<option value="">-- Selecione um material --</option>';
        materialsData.forEach(material => {
            const option = document.createElement('option');
            option.value = material.name;
            option.textContent = `${material.name} (R$ ${material.price.toFixed(2)}/m²)`;
            materialSelect.appendChild(option);
        });
        if (currentSelection) {
            materialSelect.value = currentSelection;
        }
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
        environmentsContainer.appendChild(newEnvironment);
    }
    
    function populateFormWithData(data) {
        form.reset();
        environmentsContainer.innerHTML = '';
        
        salespersonNameInput.value = data.salespersonName || '';
        quoteDateInput.value = data.quoteDate || new Date().toISOString().split('T')[0];
        clientNameInput.value = data.clientName || '';
        clientEmailInput.value = data.clientEmail || '';
        clientPhoneInput.value = data.clientPhone || '';
        clientCpfCnpjInput.value = data.clientCpfCnpj || '';
        clientAddressStreetInput.value = data.clientAddressStreet || '';
        clientAddressNumberInput.value = data.clientAddressNumber || '';
        clientAddressZipInput.value = data.clientAddressZip || '';
        clientAddressComplementInput.value = data.clientAddressComplement || '';
        materialSelect.value = data.material || '';
        freteInput.value = data.frete || 0;
        priceAdjustmentInput.value = data.priceAdjustment || 0;

        populateCheckboxes();
        (data.cubas || []).forEach(cubaName => {
            const cubaCheckbox = document.querySelector(`input[name="cuba"][value="${cubaName}"]`);
            if(cubaCheckbox) cubaCheckbox.checked = true;
        });

        if (!data.environments || data.environments.length === 0) {
            addEnvironment();
        } else {
            data.environments.forEach(envData => {
                addEnvironment();
                const newEnvBlock = environmentsContainer.lastElementChild;
                newEnvBlock.querySelector('.environment-name').value = envData.name;
                envData.items.forEach(itemData => {
                    const itemCheckbox = newEnvBlock.querySelector(`.stone-item-cb[value="${itemData.name}"]`);
                    if(itemCheckbox) {
                        itemCheckbox.checked = true;
                        const medidasDiv = itemCheckbox.closest('div').querySelector('.item-medidas');
                        medidasDiv.classList.remove('hidden');
                        medidasDiv.querySelectorAll('.medida')[0].value = itemData.length;
                        medidasDiv.querySelectorAll('.medida')[1].value = itemData.width;
                    }
                });
            });
        }
        
        handleFormChange();
        showStatusMessage('Orçamento carregado com sucesso!', 'success');
    }

    function getFormDataAsObject() {
        const formData = {
            salespersonName: salespersonNameInput.value,
            quoteDate: quoteDateInput.value,
            clientName: clientNameInput.value,
            clientEmail: clientEmailInput.value,
            clientPhone: clientPhoneInput.value,
            clientCpfCnpj: clientCpfCnpjInput.value,
            clientAddressStreet: clientAddressStreetInput.value,
            clientAddressNumber: clientAddressNumberInput.value,
            clientAddressZip: clientAddressZipInput.value,
            clientAddressComplement: clientAddressComplementInput.value,
            material: materialSelect.value,
            frete: freteInput.value,
            priceAdjustment: priceAdjustmentInput.value,
            cubas: Array.from(document.querySelectorAll('input[name="cuba"]:checked')).map(cb => cb.value),
            environments: []
        };
        
        document.querySelectorAll('.environment-block').forEach(env => {
            const envData = { name: env.querySelector('.environment-name').value, items: [] };
            env.querySelectorAll('.stone-item-cb:checked').forEach(itemCb => {
                const medidasDiv = itemCb.closest('div').querySelector('.item-medidas');
                envData.items.push({
                    name: itemCb.value,
                    length: medidasDiv.querySelectorAll('.medida')[0].value,
                    width: medidasDiv.querySelectorAll('.medida')[1].value
                });
            });
            if(envData.items.length > 0 && envData.name) {
                formData.environments.push(envData);
            }
        });
        return formData;
    }

    function calculateTotal() {
        let subtotalCost = 0;
        let breakdownItems = [];
        let totalLinearMeters = 0;
        
        const selectedMaterialName = materialSelect.value;
        const materialInfo = materialsData.find(m => m.name === selectedMaterialName);
        const materialPricePerM2 = materialInfo ? materialInfo.price : 0;
        
        document.querySelectorAll('.environment-block').forEach(envBlock => {
            const envName = envBlock.querySelector('.environment-name').value.trim();
            envBlock.querySelectorAll('.stone-item-cb:checked').forEach(checkbox => {
                const medidasInputs = checkbox.closest('div').querySelector('.item-medidas').querySelectorAll('.medida');
                const comprimentoCm = parseFloat(medidasInputs[0].value) || 0;
                const larguraCm = parseFloat(medidasInputs[1].value) || 0;
                const areaM2 = (comprimentoCm / 100) * (larguraCm / 100);
                const linearMeters = (comprimentoCm / 100) * 2 + (larguraCm / 100) * 2;

                if (areaM2 > 0 && materialPricePerM2 > 0) {
                    const itemCost = areaM2 * materialPricePerM2;
                    subtotalCost += itemCost;
                    totalLinearMeters += linearMeters;
                    breakdownItems.push({ category: 'Peças de Pedra', description: `${checkbox.value} (${envName})`, details: `${areaM2.toFixed(4)}m²`, subtotal: itemCost });
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
            if (localidade === 'mogi') {
                maoDeObraCost = Math.max(200, totalLinearMeters * 200);
                breakdownItems.push({ category: 'Mão de Obra', description: `Serviço - Mogi e Região`, details: `${totalLinearMeters.toFixed(2)}m lineares`, subtotal: maoDeObraCost });
            } else if (localidade === 'sp') {
                maoDeObraCost = Math.max(280, totalLinearMeters * 200);
                breakdownItems.push({ category: 'Mão de Obra', description: `Serviço - Capital SP`, details: `${totalLinearMeters.toFixed(2)}m lineares`, subtotal: maoDeObraCost });
            }
        }
        
        const frete = parseFloat(freteInput.value) || 0;
        const ajustePercentual = parseFloat(priceAdjustmentInput.value) || 0;
        const subtotalComMaoDeObra = subtotalCost + maoDeObraCost;
        const ajusteValor = subtotalComMaoDeObra * (ajustePercentual / 100);
        const totalCost = subtotalComMaoDeObra + frete + ajusteValor;
        
        return { totalCost, breakdownItems, subtotal: subtotalComMaoDeObra, frete, ajuste: ajusteValor };
    }
    
    function updateBreakdownUI(items, subtotal, frete, ajuste, total) {
        totalCostDisplay.textContent = `R$ ${total.toFixed(2)}`;
        if (items.length === 0 && subtotal === 0) {
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

    async function generatePDF(quoteData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // ... sua lógica de PDF aqui ...
        doc.text("Orçamento", 14, 22);
        doc.save(`Orcamento_${quoteData.clientName || 'Cliente'}.pdf`);
    }

    function showStatusMessage(message, type, duration = 4000) {
        statusMessageDiv.textContent = message;
        statusMessageDiv.className = `status-${type}`;
        statusMessageDiv.classList.remove('hidden');
        setTimeout(() => statusMessageDiv.classList.add('hidden'), duration);
    }
    
    function handleFormChange() {
        const result = calculateTotal();
        updateBreakdownUI(result.breakdownItems, result.subtotal, result.frete, result.ajuste, result.totalCost);
    }

    // ===================================================================================
    // 5. EVENT LISTENERS
    // ===================================================================================
    form.addEventListener('input', handleFormChange);
    addEnvironmentBtn.addEventListener('click', addEnvironment);
    refreshMaterialsBtn.addEventListener('click', fetchMaterials);
    
    loadQuoteBtn.addEventListener('click', () => {
        const selectedId = historySelect.value;
        if (!selectedId) {
            return showStatusMessage('Por favor, selecione um orçamento do histórico.', 'error');
        }
        loadQuoteBtn.disabled = true;
        loadQuoteBtn.textContent = 'Carregando...';
        
        const quoteData = historyData.find(item => item.id === selectedId);
        const jsonString = quoteData?.column_values.find(c => c.id === JSON_DATA_COLUMN_ID)?.text;
        
        if (jsonString) {
            try {
                const parsedData = JSON.parse(jsonString);
                populateFormWithData(parsedData);
            } catch (e) {
                showStatusMessage('Erro: Os dados do histórico estão corrompidos.', 'error');
            }
        } else {
            showStatusMessage('Não foram encontrados dados detalhados para este orçamento (versão antiga).', 'info');
        }
        
        loadQuoteBtn.disabled = false;
        loadQuoteBtn.textContent = 'Carregar';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Adicionar lógica de validação do formulário aqui...
        
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.textContent = 'Gerando...';

        try {
            const formData = getFormDataAsObject();
            const { totalCost, breakdownItems } = calculateTotal();
            
            // Gerar o humanReadableDetails aqui, baseado no breakdown
            let humanReadableDetails = "";
            let currentCategory = "";
            breakdownItems.forEach(item => {
                if(item.category !== currentCategory) {
                    currentCategory = item.category;
                    humanReadableDetails += `\n${currentCategory}:\n`;
                }
                humanReadableDetails += `  - ${item.description} (${item.details}): R$ ${item.subtotal.toFixed(2)}\n`;
            });
            
            showStatusMessage('Salvando orçamento no Monday.com...', 'info');
            const newItemId = await sendQuoteToMonday({
                ...formData,
                totalCost,
                humanReadableDetails, 
                jsonData: JSON.stringify(formData)
            });

            showStatusMessage('Gerando PDF...', 'info');
            await generatePDF({ ...formData, totalCost, clientName: formData.clientName, breakdownItems });

            showStatusMessage(`Orçamento #${newItemId} salvo e PDF gerado!`, 'success');
            form.reset();
            init();

        } catch (error) {
            showStatusMessage(`Erro: ${error.message}`, 'error');
        } finally {
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.textContent = 'Gerar e Baixar PDF';
        }
    });
    
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

    // ===================================================================================
    // 6. INICIALIZAÇÃO
    // ===================================================================================
    function init() {
        quoteDateInput.valueAsDate = new Date();
        populateCheckboxes();
        addEnvironment();
        fetchMaterials();
        fetchHistory();
        handleFormChange();
    }

    init();
});