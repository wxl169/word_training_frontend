<template>
    <div id="word_training">
        <span class="title">单词训练</span>
        <p style="text-align: center; font-size: 30px;">请选择游戏模式</p>
        <div style="background-color: white; padding: 0px 20px 20px 20px">
            <a-row :gutter="16">
                <a-col :span="8">
                    <router-link :to="{ path: '/word/training/modeSelect', query: { mode: 0 } }">
                        <a-card hoverable>
                            <template #title>
                                <p style="text-align: center;">英语选义</p>
                            </template>
                            <template #cover>
                                <img alt="example" src="@/assets/images/word_training/english_selections.png"
                                    style="width: 100%;height: 280px;" />
                            </template>
                            <p style="text-align: center;">根据系统随机生成的英语单词选择它的正确释义</p>
                        </a-card>
                    </router-link>
                </a-col>
                <a-col :span="7">
                    <router-link :to="{ path: '/word/training/modeSelect', query: { mode: 1 } }">
                        <a-card hoverable>
                            <template #title>
                                <p style="text-align: center;">中文选词</p>
                            </template>
                            <template #cover>
                                <img alt="example" src="@/assets/images/word_training/chinese_selections.png"
                                    style="width: 100%;height: 280px;" />
                            </template>
                            <p style="text-align: center;">根据系统随机生成的中文翻译选择与它对应的英语单词</p>
                        </a-card>
                    </router-link>
                </a-col>
                <a-col :span="8">
                    <router-link :to="{ path: '/word/training/modeSelect', query: { mode: 2 } }">
                        <a-card hoverable>
                            <template #title>
                                <p style="text-align: center;">填空拼写</p>
                            </template>
                            <template #cover>
                                <img alt="example" src="@/assets/images/word_training/word_spell.png"
                                    style="width: 100%;height: 280px;" />
                            </template>
                            <p style="text-align: center;">根据系统随机生成的英语单词与翻译从选项中选择正确的拼写补全单词</p>
                        </a-card>
                    </router-link>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#word_training {
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
    font-size: 45px;
}
</style>