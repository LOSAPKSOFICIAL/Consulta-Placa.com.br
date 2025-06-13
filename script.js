const SEU_TOKEN = 'a05dd595d049235b1109e0a5fc922363';

const campoParametro = document.getElementById('parametro');
const resultado = document.getElementById('resultado');
const btnNovaConsulta = document.getElementById('nova-consulta');
const form = document.getElementById('consulta-form');
const btnConsultar = document.getElementById('consultar-btn');

resultado.style.display = "none";
btnNovaConsulta.style.display = "none";

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

    resultado.innerHTML = "Consultando...";
    resultado.style.display = "block";
    campoParametro.style.display = "none";
    btnConsultar.style.display = "none";
    btnNovaConsulta.style.display = "inline-block";

    const url = `https://wdapi2.com.br/consulta/${encodeURIComponent(parametro)}/${SEU_TOKEN}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        let marca = data.MARCA || data.marca || "-";
        if (marca === "VW") marca = "VOLKSWAGEN";
        else if ((marca || "").replace(/\./g, '').toUpperCase() === "MBENZ") marca = "Mercedes Benz";
        else if (marca === "CHEV") marca = "CHEVROLET";

        const modelo = data.MODELO || data.modelo || "-";
        const anoFabri = data.ano || "-";
        const anoModelo = data.anoModelo || data.ano_modelo || "-";

        resultado.innerHTML = `
            <div class="linha-dado"><span class="dado-label">Placa:</span> <span class="dado-valor">${parametro}</span></div>
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

btnNovaConsulta.addEventListener('click', function () {
    campoParametro.value = '';
    resultado.style.display = "none";
    campoParametro.style.display = "inline-block";
    btnConsultar.style.display = "inline-block";
    btnNovaConsulta.style.display = "none";
    campoParametro.focus();
});