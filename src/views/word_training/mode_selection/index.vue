<template>
    <div id="mode_selection">
        <div>
            <router-link :to="{
                        path: '/word/training',
                    }">
                    <ArrowLeftOutlined  style="fontSize :66px;color:black"/>
            </router-link>
            <span class="title">请选择游戏难度</span>
        </div>
        
        <div style="background-color: white; margin-top: 100px;background-color: transparent;margin-left: 70px;">
            <a-row :gutter="16" style="display: flex; justify-content: center;">
                <a-col :span="8">
                    <router-link :to="{
                        path: '/word/training/typeSelection',
                        query: {
                            mode:mode_selection,
                            difficulty: 0
                        }
                    }">
                        <a-card  hoverable class="card">
                            <template #title>
                                <p style="text-align: center;">训练模式</p>
                            </template>
                            <p>card content</p>
                        </a-card>
                    </router-link>
                </a-col>
                <a-col :span="8">
                    <router-link :to="{
                        path: '/word/training/typeSelection',
                        query: {
                            mode:mode_selection,
                            difficulty: 1
                        }
                    }">
                        <a-card hoverable class="card">
                            <template #title>
                                <p style="text-align: center;">挑战模式</p>
                            </template>
                            <p>card content</p>
                        </a-card></router-link>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

const route = useRoute()
//获取选择的游戏模式
const mode_selection = route.query.mode;



</script>

<style scoped>
#mode_selection {
    width: 100%;
    height: 100%;
    position: fixed;
    background: url('@/assets/images/background.png') no-repeat;
    background-size: cover;
}

.title {
    display: block;
    text-align: center;
    margin: 5px 0 10px 0;
    font-size: 30px;
}

.card {
    width: 400px;
    height: 300px;
}
</style>
    