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
                            ${renderSocialLinks(comercio)}
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

// Função para renderizar os links das redes sociais
const renderSocialLinks = (comercio) => {
    let linksHtml = '';
    if (comercio.instagram) {
        linksHtml += `<a href="${comercio.instagram}" target="_blank"><img src="instagram-icon.png" alt="Instagram" class="social-icon" /></a>`;
    }
    if (comercio.facebook) {
        linksHtml += `<a href="${comercio.facebook}" target="_blank"><img src="facebook-icon.png" alt="Facebook" class="social-icon" /></a>`;
    }
    if (comercio.website) {
        linksHtml += `<a href="${comercio.website}" target="_blank"><img src="website-icon.png" alt="Website" class="social-icon" /></a>`;
    }
    // Adicione mais redes sociais conforme necessário
    return linksHtml || '<p>Não disponível</p>';
};