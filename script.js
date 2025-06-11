// Substitua 'SEU_TOKEN_AQUI' pelo seu token real da API
const SEU_TOKEN = 'a05dd595d049235b1109e0a5fc922363';
 
document.getElementById('consulta-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const parametro = document.getElementById('parametro').value.trim();
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = "Consultando...";
 
    if (!parametro) {
        resultado.innerHTML = "Por favor, informe o parâmetro de pesquisa.";
        return;
    }
 
    const url = `https://wdapi2.com.br/consulta/${encodeURIComponent(parametro)}/${SEU_TOKEN}`;
 
    try {
        const res = await fetch(url);
        if (!res.ok) {
            resultado.innerHTML = `Erro ao consultar API: ${res.status}`;
            return;
        }
        const data = await res.json();
 
        // Compatibilidade com campos em maiúsculo/minúsculo
        let marca = data.MARCA || data.marca || "-";
        // Normaliza para garantir o tratamento correto, ignorando maiúsculas/minúsculas e pontos
        const marcaNormalizada = marca.replace(/\./g, '').toUpperCase();
 
        if (marca === "VW") {
            marca = "VOLKSWAGEN";
        } else if (marcaNormalizada === "MBENZ") {
            marca = "Mercedes Benz";
        }
 
        const modelo = data.MODELO || data.modelo || "-";
        const anoFabri = data.ano || "-";
        const anoModelo = data.anoModelo || data.ano_modelo || "-";
 
        resultado.innerHTML = `
            <div class="linha-dado"><span class="dado-label">Marca:</span> <span class="dado-valor">${marca}</span></div>
            <div class="linha-dado"><span class="dado-label">Modelo:</span> <span class="dado-valor">${modelo}</span></div>
            <div class="linha-dado"><span class="dado-label">Ano Fabricação:</span> <span class="dado-valor">${anoFabri}</span></div>
            <div class="linha-dado"><span class="dado-label">Ano Modelo:</span> <span class="dado-valor">${anoModelo}</span></div>
        `;
    } catch (err) {
        resultado.innerHTML = "Erro ao consultar a API.";
        console.error(err);
    }
});
 