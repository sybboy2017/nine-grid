import Vue from 'vue';
import '@fes/mo-static/css/ui.reset.css'; // 可引入static静态资源
import {
    Shell,
} from '@fes/mkv-frame'; // 固定
import ComponentVersion from './grid/componentVersion.vue';
import DomVersion from './grid/domVersion.vue';
import '../../lib/meta';
import VueRouter from 'vue-router';

Vue.use(Shell); // 固定
Vue.use(VueRouter);

// router
const routes = [
  { path: '/', component: ComponentVersion },
  { path: '/dom', component: DomVersion }
]

const router = new VueRouter({
  routes 
})


// html基本组件、data
const shell = new Shell({
    el: '#root',
    data: {
        
    },
	router: router
});

export default shell;
