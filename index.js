const form = document.querySelector('form');
const input = document.querySelector('input');

// 1. Создаем воркер для BareMux через Blob (чтобы не зависеть от путей)
const blob = new Blob([
    `importScripts('https://cdn.jsdelivr.net/npm/@mercuryworkshop/bare-mux@1.8.3/dist/worker.js');`
], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const connection = new BareMux.BareMuxConnection(workerUrl);

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("Кнопка нажата, начинаем запуск...");

    const wispUrl = "wss://wisp.mercurywork.shop/";
    
    try {
        // 2. Устанавливаем транспорт
        console.log("Устанавливаем транспорт Wisp...");
        await connection.setTransport("https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@0.3.11/dist/index.mjs", [{ wisp: wispUrl }]);
        console.log("Транспорт установлен успешно");

        // 3. Регистрация Service Worker
        // Используем относительный путь для GitHub Pages
        if ('serviceWorker' in navigator) {
            console.log("Регистрируем SW...");
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: __uv$config.prefix
            });
            console.log("SW зарегистрирован, область (scope):", registration.scope);
        } else {
            throw new Error("Ваш браузер не поддерживает Service Workers");
        }

        // 4. Подготовка URL
        let url = input.value.trim();
        if (!url.startsWith('http')) {
            url = 'https://www.google.com/search?q=' + url;
        }

        const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
        console.log("Переходим по адресу:", encodedUrl);

        // 5. Переход
        window.location.href = encodedUrl;

    } catch (err) {
        console.error("Критическая ошибка:", err);
        alert("ОШИБКА: " + err.message + "\nПосмотрите консоль (F12) для деталей.");
    }
});
