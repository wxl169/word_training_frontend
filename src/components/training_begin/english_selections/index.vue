<template>
    <a-spin tip="正在生成练习题" v-if="!isShow" style="width: 100%;height: 100%;">
        <a-alert message="正在生成练习题" description="请不要离开页面，系统正在生成英语单词练习题，离开页面将会重新等待。" style="height: 800px;"></a-alert>
    </a-spin>
    <div style="margin-top: 10px" v-else>
        <a-layout style="background-color: transparent">
            <!-- 题目头部 -->
            <a-layout-header id="headerStyle">
                <a-row type="flex" justify="center" align="middle">
                    <!-- 生命值 -->
                    <a-col :span="8" v-if="difficulty == 1">
                        <a-space>
                            <div v-for="(life, index) in lives" :key="index">
                                <HeartTwoTone v-if="life" two-tone-color="#f5222d" style="font-size: 30px" />
                                <HeartOutlined v-else style="font-size: 30px" />
                            </div>
                        </a-space>
                    </a-col>
                    <!-- 时间控件 -->
                    <a-col :span="8" v-if="difficulty == 1">
                        <a-statistic-countdown :value="deadline" format="mm:ss" :value-style="valueStyle" :title="title"
                            @finish="onFinish" />
                    </a-col>
                    <a-col :span="8" v-if="difficulty == 0">
                    </a-col>
                    <a-col :span="8" v-if="difficulty == 0">
                    </a-col>
                    <!-- 结束按钮 -->
                    <a-col :span="8">
                        <a-button danger @click="showConfirm">结束训练</a-button>
                    </a-col>
                </a-row>
            </a-layout-header>
            
            <!-- 选题区域 -->
            <a-layout-content id="contentStyle">
                <!--题目区 -->
                <div id="questionArea">
                    <!-- 单词 -->
                    <h1 style="text-align: center; font-size: 36px">{{wordTrainingVO.word}}</h1>
                    <!-- 音标 -->
                    <p style="text-align: center">
                        英：{{ wordTrainingVO.pronounceEnglish }}
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size"
                            style="border: none;background-color: transparent;"
                            @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${wordTrainingVO.word}`)" />
                        &nbsp;&nbsp;
                        美：{{wordTrainingVO.pronounceAmerica}}
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size"
                            style="border: none;background-color: transparent;"
                            @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${wordTrainingVO.word}`)" />
                    </p>
                </div>
                <!-- 答题区 -->
                <div id="answerArea">
                    <a-radio-group v-model:value="answer" optionType="button" @change="onChange">
                        <a-radio value="1" class="radioStyle" :title="wordTrainingVO.questionA" style="margin-top: 50px;">{{ wordTrainingVO.questionA }}</a-radio>
                        <a-radio value="2" class="radioStyle" :title="wordTrainingVO.questionB" >{{ wordTrainingVO.questionB }}</a-radio>
                        <a-radio value="3" class="radioStyle" :title="wordTrainingVO.questionC" >{{ wordTrainingVO.questionC }}</a-radio>
                        <a-radio value="4" class="radioStyle" :title="wordTrainingVO.questionD" >{{ wordTrainingVO.questionD }}</a-radio>
                    </a-radio-group>
                </div>
            </a-layout-content>
            <!-- 完成情况展示区域 -->
            <a-layout-footer id="footerStyle">
                <a-progress :percent="(wordTrainingVO.questionNumber / total * 100).toFixed(2)" />
            </a-layout-footer>
        </a-layout>

    </div>
</template>

<script setup lang="ts">
import { ref, h, computed, createVNode } from 'vue';
import { SoundOutlined, HeartTwoTone, HeartOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
import { Modal, message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
const size = ref<SizeType>('small');
import useUserStore from "@/store/modules/user";
import useTemporaryUserStore from "@/store/modules/temporary_user";
import pinia from "@/store";
import { doJugement } from '@/api/word/word_training';
import router from '@/router';

const userStore = useUserStore(pinia);
const temporaryUserStore = useTemporaryUserStore(pinia);


const isShow = ref(true);
const route = useRoute()
//游戏模式（0：英语选义，1：中文选义，2：填空拼写）
const mode_selection = route.query.mode;
//游戏难度（0：训练模式，1：挑战模式）
const difficulty = route.query.difficulty;
//总题目数
const total = route.query.total;
//题目
const wordTrainingVO = JSON.parse(route.query.wordTrainingVO);
//用户选择的答案
const answer = ref<string>('');
const wordTrainingJudgementDTO = {
    temporaryUserAccount:'',
    answer: '',
    mode: mode_selection,
    difficulty: difficulty,
    questionNumber:wordTrainingVO.questionNumber,
}



// 点击提交答案，进入下一题
const onChange = async() => {
    wordTrainingJudgementDTO.answer = answer.value;
    temporaryUserStore.loadTemporaryUserAccountFromLocalStorage();
     //判断是否登陆
     if (userStore.userAccount != "") {
            wordTrainingJudgementDTO.temporaryUserAccount = userStore.userAccount;
    } else {
        //获取临时用户
        wordTrainingJudgementDTO.temporaryUserAccount = temporaryUserStore.temporaryUserAccount;
    }
    const res = await doJugement(wordTrainingJudgementDTO);
    if(res.code == 0 && res.data != null && res.data.isTrue == true){
        //下一题
        router.push({
            path: '/word/training/trainingBegin',
            query: {
                mode: mode_selection,
                difficulty: difficulty,
                wordTrainingVO: JSON.stringify(res.data.wordTrainingVO), 
                total: res.data.total,
            }
        });
        //刷新页面
        message.success('回答正确');
    }else{
        message.error('回答错误');
    }
}




// 挑战模式的倒计时
const deadline = ref(Date.now() + 1000 * 15); // 设置15秒倒计时
const title = ref('倒计时');
const valueStyle = computed(() => ({
    fontSize: '30px',
    color: '#f50',
}));
//挑战模式计时结束
const onFinish = () => {
    title.value = '时间结束';
    // 在这里可以添加倒计时结束后的其他逻辑
    console.log('倒计时结束');
    //1.显示正确结果
};

// 生命值
const lives = ref([true, true, true]);
const reduceLife = () => {
    const index = lives.value.findIndex(life => life);
    if (index !== -1) {
        lives.value[index] = false;
    }
};

//结束训练
const showConfirm = () => {
    Modal.confirm({
        title: '您确定要结束训练吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '点击结束训练后将结算您的成绩',
        okText() {
            return '确定';
        },
        cancelText() {
            return '取消';
        },
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};



//播放单词音频
const playAudio = (url: string) => {
    console.log(url)
    // 创建新的音频元素
    const audio = new Audio(url);
    // 播放声音
    audio.play();
}
</script>



<style scoped>
/* 头样式 */
#headerStyle {
    text-align: center;
    height: 80px;
    padding-inline: 80px;
    line-height: 80px;
    font-size: 28px;
    background-color: transparent;
}

/* 答题区样式 */
#contentStyle {
    text-align: center;
    background-color: transparent;
}

/* 底部样式 */
#footerStyle {
    text-align: center;
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    height: auto;
    padding: 10px;
    z-index: 999;
    /* 确保它在页面上的其他内容之上 */
    background-color: transparent;
}

#questionArea {
    margin-top: 35px;
}

.ant-radio-group {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.radioStyle {
    display: flex;
    height: 50px;
    line-height: 50px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 20px;
}

.ant-radio-button-wrapper {
    margin-bottom: 8px;
}

* {
    margin-block-start: 0px;
    margin-block-end: 0px
}
</style>