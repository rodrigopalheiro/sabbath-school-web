<template>
  <div class="mt-10">
    <div class="flex justify-between">
      <button @click="hasHistory ? $router.go(-1) : $router.push('/')" class="flex items-center rounded hover:bg-ss-primary hover:text-white text-ss-primary pr-2 pl-1 py-1.5">
        <ChevronLeftIcon class="shrink-0 w-3 h-3 mr-1" />
        <span>Go back</span>
      </button>
      <div class="w-1/3">
        <div class="relative">
          <input type="text" v-model="query" class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-ss-primary focus:border-ss-primary" placeholder="Search for a language" />
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="shrink-0 w-3 h-3"  />
          </div>
        </div>
      </div>
    </div>

    <div class="my-10 grid grid-cols-2 lg:grid-cols-4 gap-1">
      <router-link :to="`/${lang.code}`" class="bg-white py-12 px-4 text-center hover:z-10 hover:relative hover:shadow-neutral-300 hover:shadow-2xl" v-for="(lang, i) in filteredLanguages" :key="`language_${i}`">
        <p class="font-bold text-2xl text-gray-500">{{lang.native}}</p>
        <p class="mt-2 text-gray-300">{{lang.en}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useLanguageStore } from '@/stores/language'

export default {
  data () {
    return {
      query: '',
      
    }
  },
  components: { ChevronLeftIcon, MagnifyingGlassIcon },
  computed: {
    hasHistory: function () { return window.history.length > 2 },
    filteredLanguages() {
      const query = this.query.toLowerCase();
      return this.languages.filter(lang => {
        const native = lang.native.toLowerCase();
        const en = lang.en.toLowerCase();
        return native.includes(query) || en.includes(query);
      });
    },
  },
  async mounted() {
    // TODO: fetch API languages, given it has native language value
    const languages = await this.$api.get('/languages/index.json')
    this.languages = languages.data
  }
}
</script>