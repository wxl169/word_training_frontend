<template>
  <div id="home">
    <a-card style="margin-top: 20px; border-radius: 8px;background-color: transparent;">
      <div style="
          background-position: 100% -30%;
          background-repeat: no-repeat;
          background-size: 274px auto;
        ">
        <a-row type="flex" justify="center">
          <a-col :span="24">
            <a-typography-title style="text-align: center;">🎉欢迎使用英语单词训练系统 🎉</a-typography-title>
          </a-col>
        </a-row>
        <div
          style="font-size: 20pxpx; line-height: 22px; margin-top: 16px; margin-bottom: 32px; width: 100%;margin-left: 100px;">
          <a-typography strong>
            <a-typography :level="2" style="font-size: 20px;">英语单词训练系统是一款 🛠</a-typography>
            <a-typography :level="3">
              💼
              <br />
              💻
              <br />
              🤝
              <br />
              📈
              <br />
              🏁
            </a-typography>
          </a-typography>
        </div>
        <!-- <div style="display: flex; flex-wrap: wrap; gap: 16px;">
          <a-card
            index="1"
            href="https://api.qimuu.icu/"
            title="<a-typography :level='5'>多样化的接口选择</a-typography>"
            :desc="<a-typography strong>平台上提供丰富多样的接口供您选择，涵盖了各个领域的功能和服务，满足不同需求。</a-typography>"
          />
          <a-card
            index="2"
            href="https://api.qimuu.icu/"
            title="<a-typography :level='5'>在线调试功能</a-typography>"
            :desc="<a-typography strong>您可以在平台上进行接口在线调试，快速验证接口的功能和效果，节省了开发调试的时间和工作量。</a-typography>"
          />
          <InfoCard
            index="3"
            href="https://api.qimuu.icu/"
            title="<a-typography :level='5'>客户端 SDK 支持</a-typography>"
            :desc="<a-typography strong>为了方便开发者集成接口到自己的代码中，平台提供了客户端 SDK，使调用接口变得更加简单和便捷。</a-typography>"
          />
          <InfoCard
            index="4"
            href="https://api.qimuu.icu/"
            title="<a-typography :level='5'>AI 助力数据分析</a-typography>"
            :desc="<a-typography strong>平台引入了讯飞星火 AI，能帮助您快速分析 Excel 表数据变化趋势等信息。</a-typography>"
          />
        </div> -->
      </div>
    </a-card>
  </div>
  <a-float-button tooltip="任务栏" style="width: 55px; height: 55px;" @click="showModal">
    <template #icon>
      <CarryOutOutlined style="font-size: 22px;" />
    </template>
  </a-float-button>
  <Task v-if="open" />
</template>

<script lang="ts" setup>
import { CarryOutOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import Task from '@/components/task/index.vue';

// 定义响应式变量
const open = ref(false);

// 点击任务栏按钮显示模态框
const showModal = () => {
  if(open.value == true){
     open.value = false;
  }else{
    open.value = true;
  }
};

</script>

<style scoped>
#home {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('@/assets/images/background.png') no-repeat;
  background-size: cover;
}

/* 样式 */
</style>