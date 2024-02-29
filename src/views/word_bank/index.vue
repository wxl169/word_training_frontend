<template>
    <div>
        <a-table sticky :columns="columns" :data-source="data" :pagination="rolePage" :scroll="{ x: 1500 }" row-key="id">
            <template #id="{ text, record, index }">
                {{ index + 1 }}
            </template>
            <!-- 搜索框 -->
            <template #title>
                <a-row>
                    <span style="font-size: 25px; font-weight: bold; sans-serif;">单词百科</span>
                    <!-- 搜索栏 -->
                    <a-form layout="inline" style="margin-left: 30px;padding-top: 10px;" :model="formState">
                        <a-form-item label="单词">
                            <a-input placeholder="请输入需要查询的单词" v-model:value="formState.word"></a-input>
                        </a-form-item>
                        <a-form-item label="释义">
                            <a-input placeholder="请输入需要查询的释义" v-model:value="formState.translation"></a-input>
                        </a-form-item>
                        <a-form-item name="type" label="单词类型">
                            <a-tree-select v-model:value="formState.type" style="width: 200px" :tree-data="backendData"
                                tree-checkable allow-clear :show-checked-strategy="SHOW_PARENT" placeholder="请选择单词类型"
                                :field-names="{
                                    children: 'childerWordTypeList',
                                    label: 'typeName',
                                    value: 'typeName',
                                }" tree-node-filter-prop="typeName" />
                        </a-form-item>
                        <a-form-item>
                            <a-button @click="onSubmit">
                                <template #icon>
                                    <SearchOutlined />
                                </template>
                                搜索
                            </a-button>
                            <a-button style="margin-left: 5px;" danger @click="reset">
                                <template #icon>
                                    <CloseOutlined />
                                </template>
                                重置
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-row>
            </template>

            <!-- 数据展示 -->
            <template #bodyCell="{ column, record }">
                <!-- 单词 -->
                <template v-if="column.key === 'word'">
                    <a-space-compact direction="vertical">
                        <div>{{ record.word }}</div>
                        <div> 英：{{ record.pronounceEnglish }}
                            <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                                @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${record.word}`)" />
                        </div>
                        <div> 美：{{ record.pronounceAmerica }}
                            <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                                @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${record.word}`)" />
                        </div>
                    </a-space-compact>
                </template>
                <!-- 单词类型 -->
                <template v-if="column.key === 'type'">
                    <a-space :size="[1, 1]" wrap>
                        <template v-for="item in record.type" :key="item">
                            <a-tag color="blue">{{ item }}</a-tag>
                        </template>
                    </a-space>
                </template>
                <!-- 翻译 -->
                <template v-if="column.key === 'translation'">
                    <a-space-compact direction="vertical">
                        <div v-for="item in record.translation" :key="item">
                            <span>{{ item }}</span>
                        </div>
                    </a-space-compact>
                </template>
                <!-- 操作 -->
                <template v-if="column.key === 'operation'">
                    <a-space warp>
                        <a-tooltip title="查看详情">
                            <a-button type="dashed" ghost size="small" @click="onSelect(record.id)" style="color: black;">
                                <template #icon>
                                    <ZoomInOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip title="取消收藏" v-if="record.isCollection">
                            <a-button type="dashed" ghost size="small" @click="unCollection(record.id)">
                                <template #icon>
                                    <HeartTwoTone twoToneColor="red" />
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip title="收藏单词" v-else>
                            <a-button type="dashed" ghost size="small" @click="doCollection(record.id)"
                                style="color: black;">
                                <template #icon>
                                    <HeartOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                    </a-space>
                </template>
            </template>
        </a-table>
        <!-- 单词详情 -->
        <a-modal v-model:open="choose" cancelText="关闭" :ok-button-props="{ disabled: true }"
            style="width: 666px; height: 100%;">
            <a-card style="width: 600px;padding: 0;">
                <!-- 单词 -->
                <h1>{{ wordBankVO?.word }}</h1>
                <!-- 发音 -->
                <div class="pronounce">
                    英：{{ wordBankVO?.pronounceEnglish }}
                    <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                        @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${wordBankVO?.word}`)" />
                    &nbsp;&nbsp;
                    美：{{ wordBankVO?.pronounceAmerica }}
                    <a-button shape="circle" :icon="h(SoundOutlined)" :size="size" style="border: none;"
                        @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${wordBankVO?.word}`)" />
                </div>
                <!-- 释义 -->
                <h6 style="font-size: 13px;margin-top: 5px;">【释义】</h6>
                <a-space-compact direction="vertical">
                    <div v-for="item in wordBankVO?.translation" :key="item">
                        <span>{{ item }}</span>
                    </div>
                </a-space-compact>
            </a-card>
            <a-card style="width: 600px;padding: 0;" id="word">
                <!-- 例句 -->
                <h6 style="font-size: 13px;margin-top: 5px;">【例句】</h6>
                <a-space-compact direction="vertical" v-if="wordBankVO?.example != null">
                    <div v-for="(value, key) in wordBankVO?.example" :key="key">
                        <span>{{ key }}</span><br>
                        <span>{{ value }}</span>
                    </div>
                </a-space-compact>
                <a-space v-else>
                    无
                </a-space>
                <!-- 同义词 -->
                <h6 style="font-size: 13px;margin-top: 10px;">【同义词】</h6>
                <a-space :size="[1, 1]" wrap v-if="wordBankVO?.synonym != null">
                    <template v-for="item in wordBankVO?.synonym" :key="item">
                        {{ item }};&nbsp;
                    </template>
                </a-space>
                <a-space v-else>
                    无
                </a-space>
                <!-- 反义词 -->
                <h6 style="font-size: 13px;margin-top: 5px;">【反义词】</h6>
                <a-space :size="[1, 1]" wrap v-if="wordBankVO?.antonym != null">
                    <template v-for="item in wordBankVO?.antonym" :key="item">
                        <a href="#">{{ item }}</a>,
                    </template>
                </a-space>
                <a-space v-else>
                    无
                </a-space>
                <!-- 时态复数 -->
                <h6 style="font-size: 13px;margin-top: 5px;">【时态复数】</h6>
                <a-space-compact direction="vertical" v-if="wordBankVO?.exchange != null">
                    <div v-for="(value, key) in wordBankVO?.exchange" :key="key">
                        <span>{{ key }}：&nbsp;</span>
                        <span>{{ value }}</span>
                    </div>
                </a-space-compact>
                <a-space v-else>
                    无
                </a-space>
            </a-card>

        </a-modal>
    </div>
</template>



<script lang="ts" setup>
import { TreeSelect, message } from 'ant-design-vue';
import {
    ZoomInOutlined, SearchOutlined, CloseOutlined, SoundOutlined, HeartOutlined, HeartTwoTone
} from '@ant-design/icons-vue';
import { onMounted, reactive, ref, type UnwrapRef, h } from 'vue';
import type { WordListRequest, WordListVO } from '@/api/word/word/type';
import { getWordBankList, getWordDetails } from '@/api/word/word';
import { addCollection, deleteCollection } from '@/api/collection';
import type { WordTypeListVO } from '@/api/word/word_type/type';
import {  getWordTypeListVO } from '@/api/word/word_type';
import type { SizeType } from 'ant-design-vue/es/config-provider';
const size = ref<SizeType>('small');


//表格字段
const columns = [
    {
        title: '序号',
        width: 100,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        customRender: ({ text, record, index }) => index + 1,
    },
    {
        title: '单词',
        width: 300,
        dataIndex: 'word',
        key: 'word',
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 150,
        ellipsis: true,
    },
    {
        title: '翻译',
        dataIndex: 'translation',
        key: 'translation',
        ellipsis: true,
    },

    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
    },
];

//表格数据
let data = ref<WordListVO[]>([]);

//分页
const rolePage = reactive({
    total: 0,
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    showTotal: (total: number) => `共有${total}条数据`,
    //页容量改变是触发
    onShowSizeChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.pageSize = pageSize;
        getWordListAll(formState)
    },
    //页数改变是触发
    onChange: (current: number, pageSize: number) => {
        formState.pageSize = pageSize;
        formState.current = current;
        rolePage.current = current;
        getWordListAll(formState)
    }
});

//列表查询的参数
const wordListRequest = reactive({
    word: '',
    translation: '',
    type: [],
    current: rolePage.current,
    pageSize: rolePage.pageSize,
})

//向后台发送请求获取用户列表信息
const getWordListAll = async (wordListRequest: WordListRequest) => {
    try {
        const response = await getWordBankList(wordListRequest);
        if (response.code === 0) {
            // 接受数据成功  
            data.value = response.data?.rows as [];
            rolePage.total = response.data?.total as number
        } else {
            // 处理错误  
            message.error(response.message || '获取用户列表失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('请求用户列表时发生错误');
        console.error(error);
    }
};

//单词类型集合
const backendData = ref<WordTypeListVO[]>([]);
//单词类型
const SHOW_PARENT = TreeSelect.SHOW_CHILD;

//组件挂载完毕：发一次请求获取数据
onMounted(async () => {
    getWordListAll(wordListRequest);
    const res = await getWordTypeListVO();
    if (res.code == 0) {
        backendData.value = res.data
    }
})

//重置按钮
const reset = () => {
    formState.word = '';
    formState.type = [];
    formState.translation = '';
    formState.current = 1;
    formState.pageSize = rolePage.pageSize;
    rolePage.current = 1;
    getWordListAll(formState);
}

//表单数据
const formState: UnwrapRef<WordListRequest> = reactive({
    word: '',
    translation: '',
    type: [],
    current: rolePage.current,
    pageSize: rolePage.pageSize,
});

//搜索按钮
const onSubmit = () => {
    formState.current = 1;
    rolePage.current = 1;
    getWordListAll(formState)
}


//播放单词音频
const playAudio = (url: string) => {
    console.log(url)
    // 创建新的音频元素
    const audio = new Audio(url);
    // 播放声音
    audio.play();
}

//单词详情
const choose = ref(false);
const wordBankVO = ref<WordListVO>()

//单词id
const DeleteRequest = {
    id: 0,
}

//查看单词详情
const onSelect = async (id: number) => {
    DeleteRequest.id = id;
    const res = await getWordDetails(DeleteRequest)
    if (res.code == 0) {
        wordBankVO.value = res.data;
        choose.value = true
    } else {
        message.error(res.message)
    }
}

//收藏单词请求参数
const CollectionRequest = {
    id: 0,
    type: 1
}

//收藏单词
const doCollection = async (id: number) => {
    CollectionRequest.id = id;
    const res = await addCollection(CollectionRequest);
    if (res.code == 0 && res.data) {
        message.success("收藏成功");
        getWordListAll(formState);
    } else {
        message.error(res.message)
    }
}

//取消收藏
const unCollection = async (id: number) => {
    CollectionRequest.id = id;
    const res = await deleteCollection(CollectionRequest);
    if (res.code == 0 && res.data) {
        message.success("取消成功");
        getWordListAll(formState);
    } else {
        message.error(res.message)
    }
}



</script>


<style scoped>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
    background: #fafafa;
}

[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
    background: #1d1d1d;
}

* {
    margin-block-start: 0;
    margin-block-end: 0;
}

:global(.ant-card-body) {
    padding: 5px 10px 10px 24px !important;
}


#word {
    padding: 0%
}
</style>
  