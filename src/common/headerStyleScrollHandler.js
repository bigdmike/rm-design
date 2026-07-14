import { nextTick, onBeforeUnmount, onMounted } from "vue";
import { useUIStore } from "../store/index";

class HeaderStyleScrollHandler {
    constructor(headerScrollRules = [], defaultStyle = "") {
        this.uiStore = useUIStore();
        this.defaultStyle = defaultStyle;
        this.uiStore.setHeaderStyle(defaultStyle);
        this.headerScrollRules = headerScrollRules;
        this.sectionTriggerPoints = [];
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    updateSectionTriggerPoints() {
        this.sectionTriggerPoints = this.headerScrollRules
            .map((rule) => {
                const section = document.querySelector(rule.selector);
                if (!section) return null;

                return {
                    style: rule.style,
                    triggerY: section.getBoundingClientRect().top + window.scrollY - (rule.offset ?? 0),
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.triggerY - b.triggerY);
    }

    getHeaderStyleByScroll(scrollY) {
        let currentStyle = this.defaultStyle;
        this.updateSectionTriggerPoints();
        this.sectionTriggerPoints.forEach((point) => {
            if (scrollY >= point.triggerY) {
                currentStyle = point.style;
            }
        });

        return currentStyle;
    }

    applyHeaderStyleByScroll() {
        const nextStyle = this.getHeaderStyleByScroll(window.scrollY);
        if (this.uiStore.headerStyle !== nextStyle) {
            this.uiStore.setHeaderStyle(nextStyle);
        }
    }

    handleScroll() {
        this.applyHeaderStyleByScroll();
    }

    handleResize() {
        this.updateSectionTriggerPoints();
        this.applyHeaderStyleByScroll();
    }

    init() {
        this.updateSectionTriggerPoints();
        this.applyHeaderStyleByScroll();

        window.addEventListener("scroll", this.handleScroll, { passive: true });
        window.addEventListener("resize", this.handleResize);
    }

    destroy() {
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("resize", this.handleResize);
        this.uiStore.setHeaderStyle("");
    }
}

export default HeaderStyleScrollHandler;

export function useHeaderStyleScrollHandler(headerScrollRules = [], defaultStyle = "") {
    let headerStyleScrollHandler = null;

    onMounted(async () => {
        await nextTick();
        headerStyleScrollHandler = new HeaderStyleScrollHandler(headerScrollRules, defaultStyle);
        headerStyleScrollHandler.init();
    });

    onBeforeUnmount(() => {
        headerStyleScrollHandler?.destroy();
        headerStyleScrollHandler = null;
    });
}