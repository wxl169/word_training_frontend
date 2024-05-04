<template>
    <div id="mode_selection">
        <div>
            <a-space align="center">
                <router-link :to="{ path: '/word/training' }" style="margin-right: auto;">
                    <ArrowLeftOutlined style="font-size: 66px; color: black;" />
                </router-link>
                <span class="title">请选择游戏难度</span>
                <span style="margin-left: 300px;font-size: 20px;"
                    v-if="loginUserId != 0 && loginUserId != null">今日剩余挑战次数: 
                    <span style="color: red;">{{ challengeNum }} &nbsp;</span>次
                </span>
            </a-space>
        </div>

        <!-- 选择训练难度 -->
        <div style="background-color: white; margin-top: 100px;background-color: transparent;margin-left: 70px;">
            <a-row :gutter="16" style="display: flex; justify-content: center;">
                <a-col :span="8">
                    <router-link :to="{
                        path: '/word/training/typeSelection',
                        query: {
                            mode: mode_selection,
                            difficulty: 0
                        }
                    }">
                        <a-card hoverable class="card">
                            <template #title>
                                <p style="text-align: center;">训练模式</p>
                            </template>
                            <p>card content</p>
                        </a-card>
                    </router-link>
                </a-col>
                <a-col :span="8">
                    <router-link :to="{
                        path: loggedIn ? '/word/training/typeSelection' : '/login',
                        query: {
                            mode: mode_selection,
                            difficulty: 1
                        }
                    }">
                        <a-card hoverable class="card">
                            <template #title>
                                <p style="text-align: center;">挑战模式</p>
                            </template>
                            <p>card content</p>
                        </a-card>
                    </router-link>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { getUserInfo } from '@/api/user';

const route = useRoute()
//获取选择的游戏模式
const mode_selection = route.query.mode;

const loginUserId = ref(0)
const challengeNum = ref(0);
// 假设未登录
const loggedIn = ref(false) 
//判断当前用户是否登录并取出剩余挑战次数
onMounted(async () => {
        //获取剩余挑战次数
        const res = await getUserInfo();
        if (res.code == 0) {
            loginUserId.value = res.data.id as number;
            challengeNum.value = res.data.challengeNum as number;
            loggedIn.value = true;
        }
});

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
    text-align: center;
    font-size: 30px;
    margin-left: 580px
}

.card {
    width: 400px;
    height: 300px;
}
</style>