<template>
    <div>
        <span class="title">单词训练</span>
        <p style="text-align: center; font-size: 30px;">请选择游戏模式</p>
        <div style="background-color: #ececec; padding: 20px">
            <a-row :gutter="16">
                <a-col :span="8">
                    <router-link to="/word/training/modeSelect">
                        <a-card title="英文选义">
                            <p>card content</p>
                        </a-card>
                    </router-link>
                </a-col>
                <a-col :span="8">
                    <router-link to="/word/training/modeSelect">
                        <a-card title="中文选词">
                            <p>card content</p>
                        </a-card></router-link>
                </a-col>
                <a-col :span="8">
                    <router-link to="/word/training/modeSelect">
                        <a-card title="填空拼写">
                            <p>card content</p>
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
.title {
    display: block;
    text-align: center;
    margin: 5px 0 10px 0;
    font-size: 45px;
}
</style>