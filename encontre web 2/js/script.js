let comercios = [];
let filteredComercios = [];
let loading = true;

const carregarComercios = async () => {
    loading = true;
    try {
        exibirLoader(true); // Exibir loader

        const response = await fetch('https://backendecontre2.azurewebsites.net/comercio');
        const data = await response.json();

        // Processar dados
        comercios = data;
        filteredComercios = data;

        // Preencher selects enquanto ainda carrega os dados
        const cidadesUnicas = [...new Set(data.map(comercio => comercio.cidade))];
        const estadosUnicos = [...new Set(data.map(comercio => comercio.estado))];

        setSelectOptions('estado', estadosUnicos, 'Selecione o Estado');
        setSelectOptions('cidade', cidadesUnicas, 'Selecione a Cidade');
        
        exibirComercios(filteredComercios);

    } catch (error) {
        console.error(error);
    } finally {
        loading = false;
        exibirLoader(false); // Esconder loader
    }
};

// Função para exibir um "loader"
const exibirLoader = (estado) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = estado ? 'block' : 'none';
    }
};

// Modificar a função exibirComercios para usar DocumentFragment para melhorar a performance na adição ao DOM
const exibirComercios = (comerciosParaExibir) => {
    const container = document.getElementById('comerciosContainer');
    if (container) {
        container.innerHTML = ''; // Limpa o container
        const fragment = document.createDocumentFragment();

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
                            <div class="icon-container">
                                <a href="${comercio.link_cardapio || '#'}" target="_blank">
                                    <img src="./img/icons8-cardápio-50.png" alt="Cardápio" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="${comercio.link_facebook || '#'}" target="_blank">
                                    <img src="./img/icons8-facebook-novo-50.png" alt="Facebook" class="icon" />
                                </a>
                            </div> 
                            <div class="icon-container">
                                <a href="${comercio.link_instagram || '#'}" target="_blank">
                                    <img src="./img/icons8-instagram-48.png" alt="Instagram" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="${comercio.telefone ? 'https://api.whatsapp.com/send?phone=' + comercio.telefone.replace(/\D/g, '') : '#'}" target="_blank">
                                    <img src="./img/icons8-whatsapp-50.png" alt="WhatsApp" class="icon" />
                                </a>
                            </div>
                            <div class="icon-container">
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comercio.cidade || 'localização não disponível')}" target="_blank">
                                    <img src="./img/icons8-google-maps-novo-48.png" alt="Maps" class="icon" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="descricao-container">
                    <h2>Sobre Nós:</h2>
                    <p class="description">${comercio.descricao || 'Descrição não disponível'}</p>
                </div>
            `;
            fragment.appendChild(comercioDiv);
        });

        // Adicionar todos os elementos de uma vez ao DOM para melhorar a performance
        container.appendChild(fragment);
    }
};

// Função chamada ao carregar a página
window.onload = function() {
    carregarComercios();
    // Verificação de cookies
    if (document.cookie.indexOf("cookies_accepted=true") === -1) {
        setTimeout(function() {
            const cookieConsent = document.getElementById('cookie-consent');
            if (cookieConsent) {
                cookieConsent.style.display = 'flex';
            }
        }, 1000);
    } else {
        const consentMessage = document.getElementById('consent-message');
        if (consentMessage) {
            consentMessage.style.display = 'block';
        }
    }
};