<template>
    <div id="mode_selection">
        <div>
            <a-space style="display: flex; align-items: center;">
                <router-link :to="{
                    path: '/word/training/modeSelect',
                    query: {
                        mode: mode_selection
                    },
                }" style="margin-right: auto;">
                    <ArrowLeftOutlined style="fontSize: 66px; color: black;" />
                </router-link>
                <span class="title">请选择单词类别</span>
            </a-space>
        </div>

        <!-- 单词类型 -->
        <div style="position: relative; height: 100vh;">
            <a-checkbox-group v-model:value="wordTypeList" style="width: 100%;margin-top: 100px;">
                <a-row style="margin-left: 200px;" :gutter="16">
                    <a-col :span="8">
                        <a-checkbox class="type_select" v-for="item in wordTypeChilderList" :key="item.id"
                            :value="item.typeName">
                            {{ item.typeName }}
                        </a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
            <a-button type="primary" ghost class="begin_button" @click="createTopic(wordTypeList)">开始训练</a-button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { onMounted } from 'vue';
import { getWordTypeChilderList } from '@/api/word/word_type';
import { createWordTraining } from '@/api/word/word_training';
import useUserStore from "@/store/modules/user";
import useTemporaryUserStore from "@/store/modules/temporary_user";
import pinia from "@/store";
import { message } from 'ant-design-vue';
import router from '@/router';
import type { WordTrainingTotalVO } from '@/api/word/word_training/type';

const userStore = useUserStore(pinia);
const temporaryUserStore = useTemporaryUserStore(pinia);


const route = useRoute()
//游戏模式（0：英语选义，1：中文选义，2：填空拼写）
const mode_selection = route.query.mode;
//游戏难度（0：训练模式，1：挑战模式）
const difficulty = route.query.difficulty;

const wordTypeList = ref([]);
const wordTypeChilderList = ref([])
const wordTrainingTotalVO = ref<WordTrainingTotalVO>();

//获取单词类型
onMounted(async () => {
    const res = await getWordTypeChilderList();
    if (res.code == 0) {
        wordTypeChilderList.value = res.data;
    }
})
//单词题目生成条件
const wordTriningBeginRequest = ({
    mode: mode_selection, //模式（0：英语选义，1：中文选义，2：填空拼写）
    difficulty: difficulty, //难度（0：训练模式，1：挑战模式）
    wordTypeList: wordTypeList.value, //单词类型
    temporaryUserAccount: "",//临时用户账号
})

//生成题目
const createTopic = async (wordTypeList: string[]) => {
    wordTriningBeginRequest.wordTypeList = wordTypeList;
    temporaryUserStore.loadTemporaryUserAccountFromLocalStorage();
    //判断是否登陆
    if (userStore.userAccount != "") {
        if (temporaryUserStore.temporaryUserAccount != "") {
            wordTriningBeginRequest.temporaryUserAccount = temporaryUserStore.temporaryUserAccount;
            temporaryUserStore.clearAll();
        }
    } else {
        //获取临时用户
        if (temporaryUserStore.temporaryUserAccount == "") {
            //暂无临时用户
            temporaryUserStore.addTemporaryUserAccount();
        }
        wordTriningBeginRequest.temporaryUserAccount = temporaryUserStore.temporaryUserAccount;
    }
    const res = await createWordTraining(wordTriningBeginRequest);
    if (res.code == 0) {
        wordTrainingTotalVO.value = res.data;
        // 跳转页面
        router.push({
            path: '/word/training/trainingBegin',
            query: {
                mode: mode_selection,
                difficulty: difficulty,
                wordTrainingVO: JSON.stringify(wordTrainingTotalVO.value.wordTrainingVO), 
                total: wordTrainingTotalVO.value.total,
            }
        });
    } else {
        message.error(res.message);

    }
}
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
    margin-left: 580px;
}

.card {
    width: 400px;
    height: 300px;
}

.begin_button {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
}

.type_select {
    font-size: 20px;
    margin-left: 50px;
    margin-top: 50px;
}
</style>