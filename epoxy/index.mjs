// Epoxy Transport for Wisp Proxy
// Это скомпилированный клиент для работы через WebSocket
import {
    EpoxyClient
} from 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@0.3.11/dist/index.mjs';

class EpoxyTransport {
    constructor(wispUrl) {
        this.wispUrl = wispUrl;
        this.client = null;
    }

    async init() {
        this.client = await EpoxyClient.connect(this.wispUrl);
    }

    async fetch(url, options) {
        if (!this.client) await this.init();
        return await this.client.fetch(url, options);
    }

    // Внутренние методы для работы bare-mux
    async connect(url, protocols) {
        if (!this.client) await this.init();
        return await this.client.connect(url, protocols);
    }
}

// Экспорт для bare-mux
export default EpoxyTransport;
