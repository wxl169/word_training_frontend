<template>
    <div class="card-container">
        <a-card class="custom-card">
            <template #title>
                <div class="card-title">
                    <span>任务栏</span>

                </div>
            </template>
            <a-collapse v-model:activeKey="activeKey" ghost>
                <a-collapse-panel key="1">
                    <template #header>
                        任务1
                    </template>
                    <p>任务描述</p>
                </a-collapse-panel>
                <a-collapse-panel key="2" >
                    <template #header>
                        任务1
                    </template>
                    <p>{{ text }}</p>
                </a-collapse-panel>
            </a-collapse>
        </a-card>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';

const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
const activeKey = ref(['1']);

watch(activeKey, val => {
    console.log(val);
});

</script>

<style scoped>
.card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 66vh;
}

.custom-card {
    width: 500px;
    max-width: 90vw;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    padding: 20px;
}

.custom-card[data-v-2560f7a0] /deep/ {
    padding: 0 !important;
}
</style>