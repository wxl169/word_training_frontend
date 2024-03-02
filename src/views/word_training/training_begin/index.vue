<template>
    <div id="training_begin">
        <EnglishSelections v-if="mode_selection == 0" :difficulty="difficulty" :wordTypeList="wordTypeList"></EnglishSelections>
        <ChineseSelections v-if="mode_selection == 1" :difficulty="difficulty" :wordTypeList="wordTypeList"> </ChineseSelections>
        <WordSpell  v-if="mode_selection == 2" :difficulty="difficulty" :wordTypeList="wordTypeList"></WordSpell>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import EnglishSelections from '@/components/training_begin/english_selections/index.vue';
import ChineseSelections from '@/components/training_begin/chinese_selections/index.vue';
import WordSpell from '@/components/training_begin/word_spell/index.vue';


const route = useRoute()
//游戏模式（0：英语选义，1：中文选义，2：填空拼写）
const mode_selection = route.query.mode;
//游戏难度（0：训练模式，1：挑战模式）
const difficulty = route.query.difficulty;
//单词类型
const wordTypeList = route.query.wordTypeList;

</script>

<style scoped>
#training_begin {
    width: 100%;
    height: 100%;
    position: fixed;
    background: url('@/assets/images/background.png') no-repeat;
    background-size: cover;
}
</style>