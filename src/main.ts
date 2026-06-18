import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import '@/style/base.css'
import '@/style/index.css'

createApp(App).use(router).use(ElementPlus, { size: 'large' }).mount('#app')
