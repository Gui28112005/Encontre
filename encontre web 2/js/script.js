let comercios = [];
let pageSize = 10; // Quantos comércios serão carregados por vez
let currentPage = 1;

const carregarComercios = async (page = 1) => {
    loading = true;
    try {
        exibirLoader(true); // Exibir loader

        const response = await fetch(`https://backendecontre2.azurewebsites.net/comercio?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();

        comercios = comercios.concat(data); // Adicionar novos comércios ao array existente
        exibirComercios(data);

        currentPage++; // Incrementa a página atual para o próximo carregamento
    } catch (error) {
        console.error(error);
    } finally {
        loading = false;
        exibirLoader(false); // Esconder loader
    }
};

const exibirComercios = (comerciosParaExibir) => {
    const container = document.getElementById('comerciosContainer');
    const fragment = document.createDocumentFragment();

    comerciosParaExibir.forEach(comercio => {
        const comercioDiv = document.createElement('div');
        comercioDiv.className = 'comercio-item';
        comercioDiv.innerHTML = `
            <!-- Aqui vai o conteúdo dos comércios como já estava -->
        `;
        fragment.appendChild(comercioDiv);
    });

    container.appendChild(fragment);
};

// Carregar mais comércios quando o usuário rolar a página
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        carregarComercios(currentPage);
    }
};

// Função chamada ao carregar a página
window.onload = function() {
    carregarComercios(currentPage);
};