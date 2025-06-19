// VERSÃO DE TESTE MÍNIMA
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script de teste iniciado.");

    // Referências mínimas do DOM
    const materialSelect = document.getElementById('material-select');
    
    // Constantes essenciais
    const ESTOQUE_BOARD_ID = 9372486321;
    const PRECO_M2_COLUMN_ID = "numeric_mkrybp6w";

    // Função de API simplificada
    async function mondayApiCall(query) {
        console.log("Fazendo chamada para /api/monday...");
        const response = await fetch('/api/monday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`Falha na chamada da API, status: ${response.status}`);
        }
        console.log("Resposta da API recebida.");
        return response.json();
    }

    // Função única para buscar e mostrar os materiais
    async function fetchAndShowMaterials() {
        materialSelect.innerHTML = '<option>Buscando materiais no Monday.com...</option>';
        console.log("Buscando materiais...");
        try {
            const query = `query { boards(ids: ${ESTOQUE_BOARD_ID}) { items_page(limit: 50) { items { name, column_values(ids:["${PRECO_M2_COLUMN_ID}"]) { id, text } } } } }`;
            const response = await mondayApiCall(query);
            
            console.log("Resposta completa do Monday:", response); // Log para ver a resposta completa

            const items = response.data.boards[0].items_page.items;
            console.log("Itens extraídos:", items); // Log para ver os itens

            materialSelect.innerHTML = '<option value="">-- Selecione um Material --</option>';
            if (items && items.length > 0) {
                items.forEach(item => {
                    const priceColumn = item.column_values.find(c => c.id === PRECO_M2_COLUMN_ID);
                    const price = priceColumn ? priceColumn.text : '0';
                    
                    const option = document.createElement('option');
                    option.value = item.name;
                    option.textContent = `${item.name} (R$ ${parseFloat(price).toFixed(2)} / m²)`;
                    materialSelect.appendChild(option);
                });
                console.log("Dropdown de materiais populado com sucesso!");
            } else {
                console.log("Nenhum item encontrado na resposta do Monday.");
                materialSelect.innerHTML = '<option>Nenhum material encontrado.</option>';
            }

        } catch (error) {
            console.error("ERRO DETALHADO NA EXECUÇÃO:", error);
            materialSelect.innerHTML = '<option>Ocorreu um erro ao carregar.</option>';
        }
    }

    // Inicia o processo
    fetchAndShowMaterials();
});