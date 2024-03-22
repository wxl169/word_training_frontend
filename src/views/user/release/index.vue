<template>
    <a-card
      style="width: 100%"
      :tab-list="tabList"
      :active-tab-key="key"
      @tabChange="(key: string) => onTabChange(key, 'key')"
    >
      <template #customTab="item">
        <span v-if="item.key === 'tab1'">
          <home-outlined />
          {{ item.tab }}
        </span>
      </template>
      <div v-if="key === 'tab1'">ss</div>
      <div v-else-if="key === 'tab2'">2</div>
    </a-card>
  </template>
  <script lang="ts" setup>
  import { HomeOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';

//   菜单栏
  const tabList = [
    {
      key: 'tab1',
      tab: '文章',
    },
    {
      key: 'tab2',
      tab: '评论',
    },
  ];
  
  const key = ref('tab1');
  const noTitleKey = ref('app');
  
  const onTabChange = (value: string, type: string) => {
    console.log(value, type);
    if (type === 'key') {
      key.value = value;
    } else if (type === 'noTitleKey') {
      noTitleKey.value = value;
    }
  };
  </script>