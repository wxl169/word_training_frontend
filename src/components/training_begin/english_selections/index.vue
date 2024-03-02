<template>
    <div>
            <h1>英文选义</h1>
            
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps(['difficulty','wordTypeList'])
console.log(props.difficulty)
console.log(props.wordTypeList)



onMounted(() => {
    console.log("英文选义")
    //组成练习题


})

</script>

<style scoped>

</style>