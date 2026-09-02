import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { useUIStore } from '../store/index';
import { HeaderScrollController } from './headerScrollController.js';

export default class HeaderStyleScrollHandler extends HeaderScrollController {
    constructor(rules = [], defaultStyle = '') {
        const store = useUIStore();
        super(rules, defaultStyle, style => { if (store.headerStyle !== style) store.setHeaderStyle(style); });
        this.store = store;
        store.setHeaderStyle(defaultStyle);
    }
    destroy(resetStyle = true) {
        super.destroy();
        if (resetStyle) this.store.setHeaderStyle('');
    }
}

export function useHeaderStyleScrollHandler(rules = [], defaultStyle = '', options = {}) {
    let handler = null;
    let active = true;
    onMounted(async () => {
        await nextTick();
        if (!active) return;
        handler = new HeaderStyleScrollHandler(rules, defaultStyle);
        handler.init();
    });
    onBeforeUnmount(() => {
        active = false;
        handler?.destroy(options.resetOnUnmount !== false);
        handler = null;
    });
}
