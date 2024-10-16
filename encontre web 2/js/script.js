let comercios = [];
let filteredComercios = [];
let loading = true;
let currentPage = 0;
const itemsPerPage = 10; // Número de itens por página

const carregarComercios = async () => {
    loading = true;
    
    // Tente pegar dados do cache primeiro
    const cachedData = localStorage.getItem('comercios');
    if (cachedData) {
        comercios = JSON.parse(cachedData);
        filteredComercios = comercios;
        initializeFilters(); // Inicializa opções de estado e cidade
        exibirComercios(filteredComercios.slice(0, itemsPerPage)); // Exibe primeira página
        loading = false;
    }

    try {
        const response = await fetch('https://backendecontre2.azurewebsites.net/comercio');
        const data = await response.json();
        comercios = data;
        filteredComercios = data;

        // Armazene dados no localStorage
        localStorage.setItem('comercios', JSON.stringify(data));

        initializeFilters(); // Inicializa opções de estado e cidade
        exibirComercios(filteredComercios.slice(0, itemsPerPage)); // Exibe primeira página
    } catch (error) {
        console.error(error);
    } finally {
        loading = false;
    }
};

const initializeFilters = () => {
    const cidadesUnicas = [...new Set(comercios.map(comercio => comercio.cidade))];
    const estadosUnicos = [...new Set(comercios.map(comercio => comercio.estado))];
    setSelectOptions('estado', estadosUnicos, 'Selecione o Estado');
    setSelectOptions('cidade', cidadesUnicas, 'Selecione a Cidade');
};

const setSelectOptions = (selectId, options, defaultText) => {
    const select = document.getElementById(selectId);
    if (select) {
        select.innerHTML = `<option value="">${defaultText}</option>`; // Limpa opções anteriores
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    }
};

const exibirComercios = (comerciosParaExibir) => {
    const container = document.getElementById('comerciosContainer');
    if (container) {
        comerciosParaExibir.forEach(comercio => {
            const comercioDiv = document.createElement('div');
            comercioDiv.className = 'comercio-item';
            comercioDiv.innerHTML = `
                <img src="${comercio.imagem_capa || 'https://via.placeholder.com/300'}" alt="${comercio.nome}" class="comercio-image" />
                <div class="comercio-header">
                    <h3>${comercio.nome}</h3>
                </div>
                <div class="redes-sociais-container">
                    <h2>De onde Somos?</h2>
                    <div class="info-container">
                        <p class="info-item">Cidade: ${comercio.cidade || 'Não disponível'}</p>
                        <p class="info-item">Estado: ${comercio.estado || 'Não disponível'}</p>
                        <p class="info-item">Telefone: ${comercio.telefone || 'Não disponível'}</p>
                    </div>
                </div>
                <div class="redes-sociais-container">
                    <h2>Nossas Redes Sociais:</h2>
                    <div class="info-container">
                        <div class="links-container">
                            <!-- Ícones de redes sociais aqui -->
                        </div>
                    </div>
                </div>
                <div class="descricao-container">
                    <h2>Sobre Nós:</h2>
                    <p class="description">${comercio.descricao || 'Descrição não disponível'}</p>
                </div>
            `;
            container.appendChild(comercioDiv);
        });
    }
};

// Carrega mais comércios ao rolar a página
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
        carregarMaisComercios();
    }
});

const carregarMaisComercios = () => {
    if (filteredComercios.length > currentPage * itemsPerPage) {
        currentPage++;
        exibirComercios(filteredComercios.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));
    }
};

window.onload = function() {
    carregarComercios();
    // Verificação de cookies (mantido)
};