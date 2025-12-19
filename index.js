const form = document.querySelector('form');
const input = document.querySelector('input');
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const wispUrl = "wss://factwiki.me.cdn.cloudflare.net/wisp/";
    
    // Устанавливаем транспорт Epoxy
    // Мы передаем путь к нашему mjs файлу и адрес виспа
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);

    // Регаем SW
    await navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix
    });

    let url = input.value.trim();
    if (!url.startsWith('http')) url = 'https://www.google.com/search?q=' + url;

    location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});
