<template>  
    <div>  
      <h1>文章详情</h1>  
      <p>文章ID: {{ id }}</p>  
      <!-- 其他文章内容 -->  
    </div>  
  </template>  
    
  <script setup lang="ts">  
  import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';  
    
  const route = useRoute();  
  const id = route.params.id;  
    
  // 你可以在这里添加其他响应式状态和方法  
  // 例如，使用 id 来获取文章数据  
  const articleData = ref(null); // 假设你有一个响应式引用来存储文章数据  
    
  // 你可以使用 onMounted 钩子来在组件挂载后获取数据  
  onMounted(async () => {  
    try {  
      // 假设你有一个获取文章数据的函数 getArticleById  
     
    } catch (error) {  
      console.error('Error fetching article data:', error);  
    }  
  });  
  </script>  
    
  <style scoped>  
  /* 你的样式 */  
  </style>