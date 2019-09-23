export default {
    // 列表
    changeCenterDialogVisible(state, res) {
        ////console.log(state);
        state.centerDialogVisible = res;
    },
    menuBoxS(state, res) {
        ////console.log(state);
        state.secondMenuu = res;
    },
    tradeStatistics(state,res){
        state.trade = res;
    },
    updateCurrentMenu(state,res){
        state.currentMenu = res.key;
    },
    updatePathTitle(state,res){
        state.pathTitle = res.key;
    },
    loginTimeOut(state,res){
        state.loginState.state = res.key;
        state.loginState.username = res.username;
        state.loginState.error = res.error;
        state.loginState.timestamp = res.timestamp;
    },
    
}
