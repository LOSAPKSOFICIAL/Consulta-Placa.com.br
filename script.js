const SEU_TOKEN = 'a05dd595d049235b1109e0a5fc922363';

const campoParametro = document.getElementById('parametro');
const resultado = document.getElementById('resultado');
const btnLimpar = document.getElementById('limpar-campo');

// Esconde elementos ao carregar a página
btnLimpar.style.display = "none";
resultado.style.display = "none";

// Ao clicar em Limpar Campo
btnLimpar.addEventListener('click', function () {
    campoParametro.value = '';
    resultado.style.display = "none";
    btnLimpar.style.display = "none";
});

// Ao submeter o formulário
document.getElementById('consulta-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const parametro = campoParametro.value.trim();
    resultado.innerHTML = "Consultando...";
    resultado.style.display = "block";

    if (!parametro) {
        resultado.innerHTML = "Por favor, informe o parâmetro de pesquisa.";
        btnLimpar.style.display = "none";
        return;
    }

    const url = `https://wdapi2.com.br/consulta/${encodeURIComponent(parametro)}/${SEU_TOKEN}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            resultado.innerHTML = `Erro ao consultar API: ${res.status}`;
            btnLimpar.style.display = "block";
            return;
        }
        const data = await res.json();

        let marca = data.MARCA || data.marca || "-";
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
        btnLimpar.style.display = "block";
    } catch (err) {
        resultado.innerHTML = "Erro ao consultar a API.";
        btnLimpar.style.display = "block";
        console.error(err);
    }
});