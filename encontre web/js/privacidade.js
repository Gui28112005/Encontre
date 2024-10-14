function showTranslation(lang) {
    document.querySelectorAll('.content').forEach((el) => {
        el.style.display = 'none';
    });
    document.querySelector('#content-' + lang).style.display = 'block';
}