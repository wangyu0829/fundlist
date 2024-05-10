import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import arraySupport from 'dayjs/plugin/arraySupport'
import isToday from 'dayjs/plugin/isToday'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { register } from 'swiper/element/bundle'

import 'dayjs/locale/zh-cn'

import './assets/iconfont/iconfont.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

dayjs.locale('zh-cn')
dayjs.extend(localeData)
dayjs.extend(arraySupport)
dayjs.extend(isToday)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)

register()
