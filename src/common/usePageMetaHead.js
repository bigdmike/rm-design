import { computed, unref } from "vue";
import { useHead } from "@unhead/vue";

export function usePageMetaHead({ uiStore, route, customMeta = {} }) {
    const basePageMeta = computed(() => {
        return (
            uiStore.pageMeta.find((meta) => meta.PageTitle === "所有頁面") || {
                Title: "",
                Content: "",
                Image: "",
            }
        );
    });

    const activePageMeta = computed(() => {
        return uiStore.pageMeta.find((meta) => meta.PageTitle === route.meta.title);
    });

    const customTitle = computed(() => unref(customMeta.title) || "");
    const customDescription = computed(() => unref(customMeta.description) || "");
    const customImage = computed(() => unref(customMeta.image) || "");
    const customUrl = computed(() => unref(customMeta.url) || "");

    const resolvedTitle = computed(() => {
        const activeTitle = customTitle.value || activePageMeta.value?.Title;
        const baseTitle = basePageMeta.value.Title;
        return `${activeTitle ? activeTitle + " | " : ""}${baseTitle}`;
    });

    const resolvedDescription = computed(() => {
        return customDescription.value || activePageMeta.value?.Content || basePageMeta.value.Content;
    });

    const resolvedUrl = computed(() => {
        return customUrl.value || import.meta.env.VITE_API_URL + route.fullPath;
    });

    const resolvedImage = computed(() => {
        const image = customImage.value || activePageMeta.value?.Image || basePageMeta.value.Image;

        if (!image) {
            return "";
        }

        if (/^https?:\/\//i.test(image)) {
            return image;
        }

        return uiStore.imageUrl(image);
    });

    useHead({
        title: () => resolvedTitle.value,
        meta: [
            {
                property: "og:url",
                name: "og:url",
                content: () => resolvedUrl.value,
                vmid: "og:url",
            },
            {
                property: "og:title",
                name: "og:title",
                content: () => resolvedTitle.value,
                vmid: "og:title",
            },
            {
                property: "og:description",
                name: "og:description",
                content: () => resolvedDescription.value,
                vmid: "og:description",
            },
            {
                property: "twitter:description",
                name: "twitter:description",
                content: () => resolvedDescription.value,
                vmid: "twitter:description",
            },
            {
                property: "description",
                name: "description",
                content: () => resolvedDescription.value,
                vmid: "description",
            },
            {
                property: "og:image",
                name: "og:image",
                content: () => resolvedImage.value,
                vmid: "og:image",
            },
            {
                property: "apple-mobile-web-app-title",
                name: "apple-mobile-web-app-title",
                content: () => resolvedTitle.value,
                vmid: "apple-mobile-web-app-title",
            },
            {
                property: "application-name",
                name: "application-name",
                content: () => resolvedTitle.value,
                vmid: "application-name",
            },
            {
                property: "og:site_name",
                name: "og:site_name",
                content: () => basePageMeta.value.Title,
                vmid: "og:site_name",
            },
            {
                property: "og:type",
                name: "og:type",
                content: "website",
                vmid: "og:type",
            },
            {
                property: "og:locale",
                name: "og:locale",
                content: "zh_tw",
                vmid: "og:locale",
            },
        ],
    });

    return {
        basePageMeta,
        activePageMeta,
    };
}