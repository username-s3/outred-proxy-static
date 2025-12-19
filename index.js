const form = document.getElementById('proxyForm');
const input = document.getElementById('urlInput');
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1. Указываем Wisp транспорт
    const wispUrl = document.getElementById('bareServerSelect').value;
    
    try {
        // Проверяем/ставим транспорт
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        
        // 2. Регистрируем Service Worker
        await navigator.serviceWorker.register('./sw.js', {
            scope: __uv$config.prefix
        });

        // 3. Кодируем URL и переходим
        let url = input.value.trim();
        if (!url.startsWith('http')) url = 'https://google.com/search?q=' + url;
        
        location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    } catch (err) {
        alert("Ошибка запуска прокси: " + err.message);
        console.error(err);
    }
});
