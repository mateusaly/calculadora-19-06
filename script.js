// FASE 1 - SCRIPT RECONSTRUÍDO E LIMPO
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script reconstruído iniciado.");

    // ===================================================================================
    // 1. CONSTANTES E VARIÁVEIS GLOBAIS
    // ===================================================================================
    const ESTOQUE_BOARD_ID = 9372486321;
    const ORCAMENTOS_BOARD_ID = 9373086154;
    const PRECO_M2_COLUMN_ID = "numeric_mkrybp6w";
    const ESTOQUE_COLUMN_ID = "numeric_mkryfs28";
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
    const totalCostDisplay = document.getElementById('total-cost');
    // Adicione outras referências se necessário...

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
        let totalCost = 0;
        const selectedMaterialName = materialSelect.value;
        const materialInfo = materialsData.find(m => m.name === selectedMaterialName);
        const materialPricePerM2 = materialInfo ? parseFloat(materialInfo.column_values.find(c => c.id === PRECO_M2_COLUMN_ID)?.text || '0') : 0;

        document.querySelectorAll('.environment-block').forEach(envBlock => {
            envBlock.querySelectorAll('.stone-item-cb:checked').forEach(checkbox => {
                const medidasInputs = checkbox.closest('div').querySelector('.item-medidas').querySelectorAll('.medida');
                const comprimentoCm = parseFloat(medidasInputs[0].value) || 0;
                const larguraCm = parseFloat(medidasInputs[1].value) || 0;
                if(comprimentoCm > 0 && larguraCm > 0 && materialPricePerM2 > 0) {
                    const areaM2 = (comprimentoCm / 100) * (larguraCm / 100);
                    totalCost += areaM2 * materialPricePerM2;
                }
            });
        });
        
        document.querySelectorAll('input[name="cuba"]:checked').forEach(cuba => {
            totalCost += PRECOS_CUBAS[cuba.value];
        });

        // Adicionar outras lógicas de custo aqui (mão de obra, frete, etc.)

        totalCostDisplay.textContent = `R$ ${totalCost.toFixed(2)}`;
    }

    // ===================================================================================
    // 5. EVENT LISTENERS E INICIALIZAÇÃO
    // ===================================================================================
    
    // Adiciona um listener geral no formulário para recalcular tudo sempre que algo mudar
    form.addEventListener('input', calculateTotal);

    addEnvironmentBtn.addEventListener('click', addEnvironment);

    // Listener para mostrar/esconder medidas quando uma peça é selecionada
    environmentsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('stone-item-cb')) {
            e.target.closest('div').querySelector('.item-medidas').classList.toggle('hidden', !e.target.checked);
        }
    });

    // Listener para remover ambientes
    environmentsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-environment-btn')) {
            e.target.closest('.environment-block').remove();
            calculateTotal();
        }
    });
    
    function init() {
        populateCheckboxes();
        addEnvironment();
        fetchMaterials();
        // fetchHistory(); // Deixamos o histórico para a Fase 2
    }

    init();
});