<template>
  <template v-if="loading">
    <LoadingDetail></LoadingDetail>
  </template>
  <div v-else-if="quarterly">

    <!-- Mobile Hero Section (iOS-like) -->
    <div class="md:hidden relative w-full overflow-hidden">
      <!-- Blurred Background Layer -->
      <div 
        :style="`background-image: url(${quarterly.quarterly.splash || quarterly.quarterly.cover})`"
        class="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60"
      ></div>
      
      <!-- Main Image (sets container height) -->
      <img 
        :src="quarterly.quarterly.splash || quarterly.quarterly.cover" 
        class="relative z-0 w-full h-auto"
        alt="Quarterly Cover"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
      
      <!-- Content Overlay -->
      <div class="absolute inset-0 z-20 flex flex-col justify-end p-6 pb-12 text-white">
        <!-- Title -->
        <h1 class="text-3xl font-bold mb-3 leading-tight drop-shadow-lg">
          {{ quarterly.quarterly.title }}
        </h1>
        
        <!-- Date -->
        <p class="text-sm mb-4 opacity-90 drop-shadow-md">
          {{ quarterly.quarterly.human_date }}
        </p>
        
        <!-- Description (truncated) -->
        <p class="text-sm mb-4 opacity-90 line-clamp-3 drop-shadow-md">
          {{ quarterly.quarterly.description }}
        </p>
        <button 
          @click="open = !open" 
          class="text-white font-medium underline text-sm mb-6 text-left drop-shadow-md"
          v-if="quarterly.quarterly.introduction && (Math.abs(quarterly.quarterly.introduction.length - quarterly.quarterly.description.length) > 100)"
        >
          more
        </button>
        
        <!-- READ Button -->
        <div v-if="lessonTarget" class="flex justify-center mb-6">
          <router-link 
            :to="`${lessonTarget}`" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-16 rounded-full uppercase text-sm tracking-wide transition-colors duration-200 shadow-lg"
          >
            Read
          </router-link>
        </div>
        
        <!-- Features Icons -->
        <div class="flex justify-center gap-4 mb-4" v-if="quarterly.quarterly.features && quarterly.quarterly.features.length">
          <div v-for="feature in quarterly.quarterly.features" :key="`quarterly_${quarterly.quarterly.path}_feature_mobile_${feature.title}`" class="inline">
            <img :src="feature.image" class="w-5 h-5 inline opacity-90 drop-shadow-md" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Lessons List -->
    <div class="md:hidden px-6 py-8 bg-gray-50">
      <div class="mb-6">
        <div class="flex items-start mb-6" v-for="(lesson, i) in quarterly.lessons" :key="`quarterly_${quarterly.quarterly.path}_lessons_mobile_${i}`">
          <span v-if="/^\d*$/.test(lesson.id)" class="text-4xl font-bold text-gray-300 mr-4 mt-1">{{ parseInt(lesson.id) }}</span>
          <span v-else class="text-5xl font-bold text-gray-300 mr-4 align-middle -mt-1">{{ 'ꞏ' }}</span>

          <div class="flex-1">
            <router-link :to="`/${this.$route.params.lang}/${this.$route.params.quarter}/${lesson.id}/01`" class="text-lg font-bold text-gray-900 hover:text-ss-primary">
              {{lesson.title}}
            </router-link>
            <p class="text-gray-500 text-sm mt-1">
              {{DayJS(lesson.start_date, 'DD/MM/YYYY').format('MMM DD')}} - {{DayJS(lesson.end_date, 'DD/MM/YYYY').format('MMM DD')}}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Credits Section -->
      <div class="mt-8 pt-6 border-t border-gray-200" v-if="quarterly.quarterly.credits && quarterly.quarterly.credits.length">
        <div v-for="credit in quarterly.quarterly.credits" class="mb-4" :key="`quarterly_${quarterly.path}_credits_mobile_${credit.name}`">
          <p class="font-bold text-gray-900">{{credit.name}}</p>
          <p class="text-gray-500">{{credit.value}}</p>
        </div>
      </div>
    </div>

    <!-- Desktop Layout (Original - unchanged) -->
    <div class="hidden md:flex my-10">
      <div class="shrink-1 flex justify-center md:justify-start md:flex-col md:items-end md:w-3/12">
        <div :style="`background-image:url(${quarterly.quarterly.cover})`" class="shrink-0 w-32 h-48 md:min-w-ss-cover md:max-w-ss-cover md:max-h-ss-cover md:min-h-ss-cover bg-center bg-cover mb-4 rounded shadow-gray-400 shadow-lg"></div>
        <div class="ml-4 md:m-0 md:text-right">
          <p class="md:mt-4 uppercase text-gray-400 text-xs">{{quarterly.quarterly.human_date}}</p>
          <div class="mt-4">
            <div v-for="feature in quarterly.quarterly.features" class="inline mr-3 last:mr-0" :key="`quarterly_${quarterly.quarterly.path}_feature_${feature.title}`">
              <img :src="feature.image" class="w-4 inline" />
            </div>
          </div>
          <div class="mt-4 md:text-right">
            <div v-for="credit in quarterly.quarterly.credits" class="mb-4" :key="`quarterly_${quarterly.path}_credits_${credit.name}`">
              <p class="font-bold">{{credit.name}}</p>
              <p class="text-gray-500">{{credit.value}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 md:ml-8 md:mt-0">
        <p class="mb-4 text-3xl font-bold">{{quarterly.quarterly.title}}</p>
        <a :href="publishingInfo.data.url" target="_blank" v-if="publishingInfo && publishingInfo.data" class="rounded p-4 bg-gray-100 hover:bg-gray-200 flex mb-4 justify-between items-center">
          <p class="text-gray-500 text-sm">{{publishingInfo.data.message}}</p>
          <ChevronRightIcon class="shrink-0 ml-3 w-5 h-5 bg-ss-primary rounded-full text-white" />
        </a>
        <div class="mb-4">
          {{quarterly.quarterly.description}}
          <button @click="open = !open" class="text-blue-600 font-medium italic underline outline-none" v-if="quarterly.quarterly.introduction && (Math.abs(quarterly.quarterly.introduction.length - quarterly.quarterly.description.length) > 100)">more</button>
        </div>
        <Popup :open="open" @closed="open = false">
          <Markdown v-if="quarterly.quarterly.introduction" :markdown="quarterly.quarterly.introduction"></Markdown>
        </Popup>
        <div v-if="lessonTarget">
          <router-link :to="`${lessonTarget}`" class="rounded-full text-white px-6 tracking-wider text-xs font-bold uppercase py-2 bg-ss-primary active:bg-blue-500 hover:drop-shadow-lg ease-in duration-200">Read</router-link>
        </div>
        <div class="mt-6 mb-4">
          <div class="flex items-center" v-for="(lesson, i) in quarterly.lessons" :key="`quarterly_${quarterly.quarterly.path}_lessons_${i}`">
            <span v-if="/^\d*$/.test(lesson.id)" class="text-2xl font-bold text-gray-400 mr-4">{{ parseInt(lesson.id) }}</span>
            <span v-else class="text-5xl font-bold text-gray-400 mr-4 align-middle -mt-3">{{ 'ꞏ' }}</span>

            <div class="mb-4">
              <router-link :to="`/${this.$route.params.lang}/${this.$route.params.quarter}/${lesson.id}/01`" class="text-xl font-bold text-ss-primary hover:underline">{{lesson.title}}</router-link>
              <p class="text-gray-500 text-sm">{{DayJS(lesson.start_date, 'DD/MM/YYYY').format('MMM DD')}} - {{DayJS(lesson.end_date, 'DD/MM/YYYY').format('MMM DD')}}</p>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div v-for="feature in quarterly.quarterly.features" class="mb-4" :key="`quarterly_${quarterly.path}_feature_${feature.title}`">
            <div class="flex items-center">
              <img :src="feature.image" class="h-3 mr-2" />
              <p class="font-bold">{{feature.title}}</p>
            </div>
            <p class="text-gray-500">{{feature.description}}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Popup for both mobile and desktop -->
    <Popup :open="open" @closed="open = false">
      <Markdown v-if="quarterly.quarterly.introduction" :markdown="quarterly.quarterly.introduction"></Markdown>
    </Popup>
  </div>
</template>

<script>
import { useTitle } from '@vueuse/core'
import DayJS from 'dayjs'
import DayJSIsBetween from 'dayjs/plugin/isBetween'
import DayJSCustomParseFormat from 'dayjs/plugin/customParseFormat'
import Popup from '@/components/Popup.vue'
import Markdown from '@/components/Markdown.vue'
import ct from 'countries-and-timezones'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import LoadingDetail from '@/components/Shimmer/LoadingDetail.vue'

DayJS.extend(DayJSIsBetween)
DayJS.extend(DayJSCustomParseFormat)

export default {
  components: { Popup, Markdown, ChevronRightIcon, LoadingDetail },
  data () {
    return {
      DayJS,
      loading: false,
      quarterly: null,
      open: false,
      publishingInfo: null
    }
  },
  computed: {
    lessonTarget: function () {
      if (!this.quarterly || !this.quarterly.lessons.length) { return null }
      let now = DayJS().startOf("day")
      let lesson = this.quarterly.lessons.find(x => {
        let startDate = DayJS(x.start_date, "DD/MM/YYYY").startOf("day")
        let endDate = DayJS(x.end_date, "DD/MM/YYYY").endOf("day")
        return DayJS(now).isBetween(startDate, endDate, null, '[]')
      }) || this.quarterly.lessons[0]
      return `/${this.$route.params.lang}/${this.$route.params.quarter}/${lesson.id}`
    }
  },
  methods: {
    getQuarterly: async function () {
      this.loading = true

      const quarterly = await this.$api.get(`${this.$route.params.lang}/quarterlies/${this.$route.params.quarter}/index.json`)
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const timezone = ct.getTimezone(browserTimezone)
      if (timezone) {
        if (timezone.countries.length) {
          const publishingInfo = await this.$api.post(`/misc/publishing/info`, {
            "country": timezone.countries[0].toLowerCase(),
            "language": this.$route.params.lang
          })
          this.publishingInfo = publishingInfo.data
        }
      }

      this.quarterly = quarterly.data
      this.loading = false
      const title = useTitle()
      title.value = `${this.quarterly.quarterly.title} - Sabbath School`
    }
  },
  async created () {

  },
  async mounted () {
    await this.getQuarterly()
  },
  head () {
    return {
      meta: [
        {
          name: 'theme-color',
          content: () => this.quarterly ? this.quarterly.quarterly.color_primary : '',
        },
      ],
    }
  }
}
</script>