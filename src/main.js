import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/fontIcon/iconfont.css";
import { post, fetch } from "./http";

Vue.config.productionTip = false

Vue.use(ElementUI, {
    size: "small", 
});

Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
