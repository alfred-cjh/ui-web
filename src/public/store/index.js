import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);


import {state} from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'


import ResourceGroup from './resource-group'


export default new vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        ResourceGroup,
    }
})

