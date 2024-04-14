import { defineStore } from 'pinia';

const useTemporaryUserStore = defineStore('TemporaryUser', {
  state: () => {
    return {
      temporaryUserAccount: "", // 临时账号
    };
  }, 
  actions: {
    // 添加游客临时账号
    async addTemporaryUserAccount() {
      var now = new Date();
      var timestamp =
        now.getMonth() +
        1 +
        "" +
        now.getDate() +
        "" +
        now.getHours() +
        "" +
        now.getMinutes() +
        "" +
        now.getSeconds();
      var randomNum = Math.floor(Math.random() * 10001); // 生成 0 到 10000 之间的整数
      this.temporaryUserAccount = "游客" + timestamp + randomNum;
      localStorage.setItem('temporaryUserAccount', this.temporaryUserAccount);
    },
    // 从 localStorage 中获取账户名并存入 Pinia
    async loadTemporaryUserAccountFromLocalStorage() {
      const storedAccount = localStorage.getItem('temporaryUserAccount');
      if (storedAccount) {
        this.temporaryUserAccount = storedAccount;
      }
    },
     // 清除 localStorage 和 Pinia 中的临时用户账户
     async clearAll() {
        localStorage.removeItem('temporaryUserAccount');
        this.temporaryUserAccount = "";
      }
  }
});

export default useTemporaryUserStore;
