import * as data from './state';

export default{
    loginTimeOut:({commit})=>{
        commit(data.loginState);
    },
    updatePathTitle:({commit})=>{
        commit(data.pathTitle);
    }
}