const form = document.getElementById('proxyForm');
const input = document.getElementById('urlInput');

// Создаем воркер BareMux из CDN, чтобы не трахаться с локальными файлами
const blob = new Blob([
    `importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@1.8.3/dist/worker.js');`
], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const connection = new BareMux.BareMuxConnection(workerUrl);

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const wispUrl = document.getElementById('wispServerSelect').value;
    
    try {
        // Устанавливаем транспорт Epoxy напрямую из CDN
        await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@0.3.11/dist/index.mjs", [{ wisp: wispUrl }]);

        // Регаем UV Service Worker
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('./sw.js', {
                scope: __uv$config.prefix
            });
        }

        let url = input.value.trim();
        if (!url.startsWith('http')) url = 'https://www.google.com/search?q=' + url;

        // Переходим
        location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    } catch (err) {
        console.error("Ошибка:", err);
        alert("Ошибка запуска: " + err.message);
    }
});
