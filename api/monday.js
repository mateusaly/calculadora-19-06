// VERSÃO CORRIGIDA USANDO A SINTAXE UNIVERSAL (CommonJS)
module.exports = async (request, response) => {
    // 1. Pega a chave de API de um local seguro (Variáveis de Ambiente)
    const MONDAY_API_KEY = process.env.MONDAY_API_KEY;

    // 2. Pega a query que o frontend enviou
    const { query, variables } = request.body;

    // 3. Verifica se a chave de API está configurada no servidor
    if (!MONDAY_API_KEY) {
        return response.status(500).json({ message: "Chave de API do Monday não configurada no servidor." });
    }

    try {
        // 4. Faz a chamada REAL para a API do Monday, usando a chave secreta
        const mondayResponse = await fetch("https://api.monday.com/v2", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MONDAY_API_KEY}`, 
            },
            body: JSON.stringify({ query, variables }),
        });

        // 5. Analisa a resposta do Monday
        const mondayData = await mondayResponse.json();
        
        if (mondayData.errors) {
             console.error("GraphQL Error:", mondayData.errors);
             return response.status(400).json(mondayData);
        }

        // 6. Envia a resposta de sucesso do Monday de volta para o frontend
        response.status(200).json(mondayData);

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Erro interno no servidor intermediário." });
    }
};