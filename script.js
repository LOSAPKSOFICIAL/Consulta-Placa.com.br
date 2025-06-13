const SEU_TOKEN = 'a05dd595d049235b1109e0a5fc922363';

const campoParametro = document.getElementById('parametro');
const resultado = document.getElementById('resultado');
const btnNovaConsulta = document.getElementById('nova-consulta');
const form = document.getElementById('consulta-form');
const btnConsultar = document.getElementById('consultar-btn');

// Estado inicial
resultado.style.display = "none";
btnNovaConsulta.style.display = "none";
campoParametro.style.display = "block";
btnConsultar.style.display = "inline-block";

function exibeCarregando() {
    resultado.style.display = "block";
    resultado.innerHTML = `<div style="text-align:center;font-size:1.18em;color:#444;background:#f4f5f7;border-radius:6px;padding:22px 0;">Consultando...</div>`;
}

function exibeResultado(parametro, marca, modelo, anoFabri, anoModelo) {
    resultado.innerHTML = `
        <div class="linha-dado"><span class="dado-label">Placa:</span> <span class="dado-valor">${parametro}</span></div>
        <div class="linha-dado"><span class="dado-label">Marca:</span> <span class="dado-valor">${marca}</span></div>
        <div class="linha-dado"><span class="dado-label">Modelo:</span> <span class="dado-valor">${modelo}</span></div>
        <div class="linha-dado"><span class="dado-label">Ano Fabricação:</span> <span class="dado-valor">${anoFabri}</span></div>
        <div class="linha-dado"><span class="dado-label">Ano Modelo:</span> <span class="dado-valor">${anoModelo}</span></div>
    `;
    resultado.style.display = "block";
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const parametro = campoParametro.value.trim();

    if (!parametro) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Por favor, informe a placa para consultar.'
        });
        return;
    }

    // Atualiza layout para "consultando"
    campoParametro.style.display = "none";
    btnConsultar.style.display = "none";
    btnNovaConsulta.style.display = "inline-block";

    exibeCarregando();

    const url = `https://wdapi2.com.br/consulta/${encodeURIComponent(parametro)}/${SEU_TOKEN}`;

    try {
        const res = await fetch(url);

        let data;
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = null;
        }

        // Tratamento dos erros mais comuns
        if (!res.ok || !data || typeof data !== "object" || data === null) {
            let msg = "Erro ao consultar a API.";
            if (text.includes("406") || text.toLowerCase().includes("sem resultados")) {
                msg = "Não foram encontrados resultados para a placa informada.";
            } else if (text.includes("401") || text.toLowerCase().includes("placa inválida")) {
                msg = "Placa inválida!";
            } else if (text.includes("402") || text.toLowerCase().includes("token inválido")) {
                msg = "Token inválido!";
            } else if (text.includes("429") || text.toLowerCase().includes("limite")) {
                msg = "Limite de consultas atingido. Tente novamente mais tarde!";
            }
            resultado.innerHTML = `<div style="text-align:center;font-size:1.1em;color:#b11;background:#fee;border-radius:6px;padding:20px 0;">${msg}</div>`;
            resultado.style.display = "block";
            return;
        }

        let marca = data.MARCA || data.marca || "-";
        const marcaNormalizada = marca.replace(/\./g, '').toUpperCase();

        if (marca === "VW") {
            marca = "VOLKSWAGEN";
        } else if (marcaNormalizada === "MBENZ") {
            marca = "Mercedes Benz";
        } else if (marca === "CHEV"){
            marca = "CHEVROLET";
        }

        const modelo = data.MODELO || data.modelo || "-";
        const anoFabri = data.ano || "-";
        const anoModelo = data.anoModelo || data.ano_modelo || "-";

        exibeResultado(parametro, marca, modelo, anoFabri, anoModelo);
    } catch (err) {
        resultado.innerHTML = `<div style="text-align:center;font-size:1.1em;color:#b11;background:#fee;border-radius:6px;padding:20px 0;">Erro ao consultar a API.</div>`;
        resultado.style.display = "block";
        console.error(err);
    }
});

btnNovaConsulta.addEventListener('click', function () {
    campoParametro.value = '';
    resultado.style.display = "none";
    campoParametro.style.display = "block";
    btnConsultar.style.display = "inline-block";
    btnNovaConsulta.style.display = "none";
    campoParametro.focus();
});
