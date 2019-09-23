import * as storeApi from '@/public/api/resource-group'

const actions = {
    editItem({
        
    }, data) {
        return new Promise((resolve, reject) => {
            storeApi.editItem(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    getItemList({
        
    }, data) {
        return new Promise((resolve, reject) => {
            storeApi.getItemList(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    createItem({
        
    }, data) {
        return new Promise((resolve, reject) => {
            storeApi.createItem(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },

    delItem({
        
    }, data) {
        return new Promise((resolve, reject) => {
            storeApi.delItem(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    actions
}