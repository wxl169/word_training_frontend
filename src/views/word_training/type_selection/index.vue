<template>
    <div id="mode_selection">
        <div>
            <router-link :to="{
                path: '/word/training/modeSelect',
                query:{
                    mode:mode_selection
                },
            }">
                <ArrowLeftOutlined style="fontSize :66px;color:black" />
            </router-link>
            <span class="title">请选择单词类别</span>
        </div>

        <!-- 单词类型 -->
        <div style="position: relative; height: 100vh;">
            <a-checkbox-group v-model:value="wordTypeList" style="width: 100%;margin-top: 100px;">
                <a-row style="margin-left: 200px;" :gutter="16">
                    <a-col :span="8">
                        <a-checkbox class="type_select" 
                        v-for="item in wordTypeChilderList" :key="item.id" :value="item.typeName">
                            {{ item.typeName }}
                        </a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>

            <router-link  :to="{
                 path: '/word/training/trainingBegin',
                        query: {
                            mode:mode_selection,
                            difficulty: difficulty,
                            wordTypeList:wordTypeList
                        }
            }">
                <a-button type="primary" ghost class="begin_button">开始训练</a-button>
            </router-link >
            
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { onMounted } from 'vue';
import { getWordTypeChilderList } from '@/api/word/word_type';

const route = useRoute()
//游戏模式（0：英语选义，1：中文选义，2：填空拼写）
const mode_selection = route.query.mode;
//游戏难度（0：训练模式，1：挑战模式）
const difficulty = route.query.difficulty;

const wordTypeList = ref(['四级']);
const wordTypeChilderList = ref([])


//获取单词类型
onMounted(async () => {
    const res = await getWordTypeChilderList();
    if (res.code == 0) {
        wordTypeChilderList.value = res.data;
    }
})


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

.begin_button{
    position: fixed; 
    bottom: 80px; 
    left: 50%; 
    transform: translateX(-50%);
    width: 200px;
}
.type_select{
    font-size:20px;
    margin-left: 50px;
    margin-top: 50px;
}
</style>
    