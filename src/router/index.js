import { createRouter, createWebHistory } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { setI18nLanguage, loadLocaleMessages } from '../i18n';
import HomeView from '@/views/HomeView.vue';
import locales from '@/locales';
import { useLanguageStore } from '@/stores/language';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/:lang',
			name: 'quarterlies',
			component: () => import('../views/Quarterlies.vue'),
		},
		{
			path: '/:lang/:quarter',
			name: 'lessons',
			component: () => import('../views/Lessons.vue'),
		},
		{
			path: '/:lang/:quarter/:lesson/:day?',
			name: 'read',
			component: () => import('../views/Read.vue'),
		},
		{
			path: '/language',
			name: 'languages',
			component: () => import('../views/Languages.vue'),
		},
	],
});

/**
 * TODO: refactor to use the store that fetches the languages from API instead of using locales
 */
router.beforeEach(async (to, from, next) => {
	const paramsLocale = to.params.lang;
	if (paramsLocale) {
		const found = locales.find((element) => element.code === paramsLocale);
		if (!found) {
			next('/');
		} else {
			useLanguageStore().locale = found;
			const i18n = useI18n();

			if (!i18n.global.availableLocales.includes(paramsLocale)) {
				await loadLocaleMessages(i18n, paramsLocale);
			}

			setI18nLanguage(i18n, paramsLocale);
		}
	}
	next();
});

export default router;
