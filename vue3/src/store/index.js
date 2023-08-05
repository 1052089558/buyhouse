import { defineStore } from 'pinia'
export const useUserStore = defineStore({
id: 'user', // id必填，且需要唯一
persist: {
    enabled: true, // 开启存储
    // **strategies: 指定存储位置以及存储的变量都有哪些,该属性可以不写，不写的话默认是存储到sessionStorage里边，默认存储state里边的所有数据**
    strategies:[
    //   { storage: localStorage, paths: ['studyCourse', 'num']}
      // storage 存储到哪里 sessionStorage/localStorage
      // paths是一个数组,要存储缓存的变量,当然也可以写多个
      // paths如果不写就默认存储state里边的所有数据，如果写了就存储指定的变量
    ]
  },


state: () => {

return {
  id: "citylist", // id必填，且需要唯一
  persist: {
    enabled: true, // 开启存储
    // **strategies: 指定存储位置以及存储的变量都有哪些,该属性可以不写，不写的话默认是存储到sessionStorage里边，默认存储state里边的所有数据**
    // strategies:[
    //   { storage: localStorage, paths: ['studyCourse', 'num']}
    // storage 存储到哪里 sessionStorage/localStorage
    // paths是一个数组,要存储缓存的变量,当然也可以写多个
    // paths如果不写就默认存储state里边的所有数据，如果写了就存储指定的变量
    // ]
  },
//   name: '凉白开'
}
},
actions: {

// updateName(name) {
//   this.name =  this.name=="凉白开"?name:"凉白开"
// }
},
getters: {

// fullName: (state) => {
//   return "你到底是谁？是"+state.name+"吗"
// }
}
})