<template>
    <div>
        <a-table sticky :columns="columns" :data-source="data" :pagination="rolePage" :scroll="{ x: 1500 }" row-key="id">
            <template #id="{ text, record, index }">
                {{ index + 1 }}
            </template>
            <!-- 搜索框 -->
            <template #title>
                <a-row>
                    <span style="font-size: 25px; font-weight: bold; sans-serif;">单词管理</span>
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

                    <!-- 新增单词类型信息 -->
                    <div style="padding-top: 10px;margin-left: 100px;">
                        <a-button type="primary" @click="showAdd = true">上传单词</a-button>
                        <a-modal v-model:open="showAdd" title="批量上传单词" ok-text="" cancel-text="取消"
                            :ok-button-props="{ disabled: true }">
                            <a-upload-dragger name="file" :multiple="false" :customRequest="customUpload">
                                <p class="ant-upload-drag-icon">
                                    <inbox-outlined></inbox-outlined>
                                </p>
                                <p class="ant-upload-text">请上传符合模版的Excel表格</p>
                                <p>
                                    可以点击按钮，在文件夹中要上传的Excel表格。
                                    也可以通过将Excel表格拖动到当前组件中上传文件。
                                </p>
                                <p class="ant-upload-hint">
                                    请点击下方按钮下载文件上传模板，按照模板格式填写数据！
                                </p>
                            </a-upload-dragger>

                            <a-button style="margin-top: 10px;margin-left: 180px;" @click="downloadFile">
                                <template #icon>
                                    <DownloadOutlined />
                                </template>
                                下载模板
                            </a-button>
                        </a-modal>
                    </div>
                </a-row>
            </template>

            <!-- 数据展示 -->
            <template #bodyCell="{ column, record }">
                <!-- 英 -->
                <template v-if="column.key === 'pronounceEnglish'">
                    <a-space align="center">
                        <a-tooltip placement="topLeft" :title="record.pronounceEnglish">
                            {{ record.pronounceEnglish }}
                        </a-tooltip>
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size"
                            @click="playAudio(`http://dict.youdao.com/dictvoice?type=1&audio=${record.word}`)" />
                    </a-space>
                </template>
                <!-- 美 -->
                <template v-if="column.key === 'pronounceAmerica'">
                    <a-space align="center">
                        <a-tooltip placement="topLeft" :title="record.pronounceAmerica">
                            {{ record.pronounceAmerica }}
                        </a-tooltip>
                        <a-button shape="circle" :icon="h(SoundOutlined)" :size="size"
                            @click="playAudio(`http://dict.youdao.com/dictvoice?type=0&audio=${record.word}`)" />
                    </a-space>

                </template>
                <!-- 单词类型 -->
                <template v-if="column.key === 'type'">
                    <a-space :size="[1, 1]" wrap>
                        <template v-for="item in record.type" :key="item">
                            <a-tag color="blue">{{ item }}</a-tag>
                        </template>
                    </a-space>
                </template>
                <!-- 图片 -->
                <template v-if="column.key === 'image'">
                    <img :src="record.image" alt="" style="width: 50px; height: 50px;" />
                </template>
                <!-- 翻译 -->
                <template v-if="column.key === 'translation'">
                    <a-space-compact direction="vertical">
                        <a-tooltip placement="topLeft" :title="record.translation">
                            <div v-for="item in record.translation" :key="item">
                                <span>{{ item }}</span>
                            </div>
                        </a-tooltip>
                    </a-space-compact>
                </template>
                <!-- 例句 -->
                <template v-if="column.key === 'example'">
                    <a-space-compact direction="vertical">
                        <div v-for="(value, key) in record?.example" :key="key">
                            <span>{{ key }}</span><br>
                            <span>{{ value }}</span>
                        </div>
                    </a-space-compact>
                </template>
                <!-- 同义词 -->
                <template v-if="column.key === 'synonym'">
                    <a-space :size="[1, 1]" wrap>
                        <template v-for="item in record.synonym" :key="item">
                            <a href="#">{{ item }}</a>,
                        </template>
                    </a-space>
                </template>
                <!-- 反义词 -->
                <template v-if="column.key === 'antonym'">
                    <a-space :size="[1, 1]" wrap>
                        <template v-for="item in record.antonym" :key="item">
                            <a href="#">{{ item }}</a>
                        </template>
                    </a-space>
                </template>
                <!-- 时态复数 -->
                <template v-if="column.key === 'exchange'">
                    <a-space-compact direction="vertical">
                        <a-tooltip placement="topLeft" :title="record.exchange">
                            <div v-for="(value, key) in record?.exchange" :key="key">
                                <span>{{ key }}:&nbsp;</span>
                                <span>{{ value }}</span>
                            </div>
                        </a-tooltip>
                    </a-space-compact>
                </template>
                <!-- 操作 -->
                <template v-if="column.key === 'operation'">
                    <a-space warp>
                        <a-tooltip title="修改按钮">
                            <a-button type="primary" size="small" @click="onUpdate(record)">
                                <template #icon>
                                    <FormOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-popconfirm title="确认删除?" @confirm="onDelete(record.id)">
                            <a-tooltip title="删除按钮">
                                <a-button type="primary" size="small" danger>
                                    <template #icon>
                                        <DeleteOutlined />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>


    <!-- 修改单词信息 -->
    <div>
        <a-modal v-model:open="visible" title="修改单词信息" ok-text="确认" cancel-text="取消" @ok="onOk">
            <a-form ref="formRef" :model="formData" name="form_in_modal" :rules="rules">
                <a-form-item ref="word" label="单词" name="word">
                    <a-input v-model:value="formData.word" />
                </a-form-item>
                <a-form-item ref="translation" label="翻译" name="ttranslationr">
                    <a-input v-model:value="formData.translation" />
                </a-form-item>
                <a-form-item ref="example" label="例句" name="example">
                    <a-input v-model:value="formData.example" />
                </a-form-item>

                <a-form-item name="type" label="单词类型">
                    <a-tree-select v-model:value="formData.type" style="width: 200px" :tree-data="backendData"
                                tree-checkable allow-clear :show-checked-strategy="SHOW_PARENT" placeholder="请选择单词类型"
                                :field-names="{
                                    children: 'childerWordTypeList',
                                    label: 'typeName',
                                    value: 'typeName',
                                }" tree-node-filter-prop="typeName" />
                </a-form-item>

            </a-form>
            <a-form-item ref="pronounceEnglish" label="英" name="pronounceEnglish">
                <a-input v-model:value="formData.pronounceEnglish" />
            </a-form-item>
            <a-form-item ref="pronounceAmerica" label="美" name="pronounceAmerica">
                <a-input v-model:value="formData.pronounceAmerica" />
            </a-form-item>
            <a-form-item ref="synonym" label="同义词" name="synonym">
                <a-input v-model:value="formData.synonym" />
            </a-form-item>
            <a-form-item ref="antonym" label="反义词" name="antonym">
                <a-input v-model:value="formData.antonym" />
            </a-form-item>
            <a-form-item ref="exchange" label="时态复数" name="exchange">
                <a-input v-model:value="formData.exchange" />
            </a-form-item>
        </a-modal>
    </div>
</template>



<script lang="ts" setup>
import { message, type FormInstance, TreeSelect } from 'ant-design-vue';
import {
    DeleteOutlined, FormOutlined, SearchOutlined, CloseOutlined, DownloadOutlined, SoundOutlined
} from '@ant-design/icons-vue';
import { onMounted, reactive, ref, toRaw, type UnwrapRef, h } from 'vue';
import type { DeleteRequest } from '@/api/user/type';
import type { WordListRequest, WordListVO, WordUpdateRequest } from '@/api/word/word/type';
import { deleteWord, getWordById, getWordList, updateWord, uploadWord } from '@/api/word/word';
import type { WordTypeListVO } from '@/api/word/word_type/type';
import {  getWordTypeListVO } from '@/api/word/word_type';
import axios from 'axios';
import type { SizeType } from 'ant-design-vue/es/config-provider';
import type { Rule } from 'ant-design-vue/es/form';

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
        width: 100,
        dataIndex: 'word',
        key: 'word',
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: '翻译',
        dataIndex: 'translation',
        key: 'translation',
        width: 150,
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
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        width: 100,
        ellipsis: true,
    },
    {
        title: '例句',
        dataIndex: 'example',
        key: 'example',
        width: 300,
        ellipsis: true,
    },
    {
        title: '英式发音',
        dataIndex: 'pronounceEnglish',
        key: 'pronounceEnglish',
        width: 200,
        ellipsis: true,
    },
    {
        title: '美式发音',
        dataIndex: 'pronounceAmerica',
        key: 'pronounceAmerica',
        width: 200,
        ellipsis: true,
    },
    {
        title: '同义词',
        dataIndex: 'synonym',
        key: 'synonym',
        width: 150,
        ellipsis: true,
    },
    {
        title: '反义词',
        dataIndex: 'antonym',
        key: 'antonym',
        width: 150,
        ellipsis: true,
    },
    {
        title: '时态复数',
        dataIndex: 'exchange',
        key: 'exchange',
        width: 200,
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
    pageSize: 5,
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
        const response = await getWordList(wordListRequest);
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

//删除单词id
const DeleteRequest = {
    id: 0
}

//删除按钮
const onDelete = async (key: number) => {
    DeleteRequest.id = key
    //管理员删除用户信息
    try {
        const response = await deleteWord(DeleteRequest);
        if (response.code === 0 && response.data) {
            // 接受数据成功  
            message.success(response.message || '删除单词成功');
            getWordListAll(formState)
        } else {
            // 处理错误  
            message.error(response.message || '删除单词失败');
        }
    } catch (error) {
        // 处理请求错误  
        message.error('删除单词数据时发生错误');
        console.error(error);
    }
};


//是否弹出修改单词信息弹框
const visible = ref(false);

//需要修改的用户信息
const formData: UnwrapRef<WordUpdateRequest> = reactive({
    id: 0,
    word: '',
    translation: '',
    type: [],
    image: '',
    example: '',
    pronounceEnglish: '',
    pronounceAmerica: '',
    synonym: '',
    antonym: '',
    exchange: '',
})


//修改按钮
const onUpdate = async (wordListVO: WordListVO) => {
    DeleteRequest.id = wordListVO.id;
    const res = await getWordById(DeleteRequest)
    if (res.code == 0) {
        const data = res.data;
        visible.value = true;
        formData.word = data.word;
        formData.id = data.id;
        formData.translation = data.translation;
        formData.type = data.type;
        formData.image = data.image;
        formData.example = data.example;
        formData.pronounceEnglish = data.pronounceEnglish;
        formData.pronounceAmerica = data.pronounceAmerica;
        formData.synonym = data.synonym;
        formData.antonym = data.antonym;
        formData.exchange = data.exchange;
    } else {
        message.error(res.message)
    }
}

const formRef = ref<FormInstance>();

//弹框中：确认修改信息
const onOk = () => {
    formRef.value
        .validateFields()
        .then(async (values: any) => {
            const res = updateWord(toRaw(formData));
            if ((await res).code == 0) {
                message.success('修改成功');
                visible.value = false;
                getWordListAll(formState)
            } else {
                message.error((await res).message);
            }
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
};


// 批量上传单词
const showAdd = ref(false);
const customUpload = async (options: { file: string | Blob; onSuccess: (arg0: Boolean) => void; onError: (arg0: string) => void; }) => {
    // options 包含了上传文件的信息和一些回调函数，如下所示：
    // options.file: 要上传的文件对象
    // options.onSuccess: 上传成功的回调函数
    // options.onError: 上传失败的回调函数
    // options.onProgress: 上传进度的回调函数
    const formData = new FormData();
    formData.append('file', options.file);

    // 发送文件上传请求
    try {
        // 发送文件上传请求
        const res = await uploadWord(formData);
        if (res.code === 0 && res.data) {
            // 文件上传成功，调用 onSuccess 回调函数
            message.success("上传成功");
            options.onSuccess(res.data); // 这里可以传递上传成功的数据给回调函数
        } else {
            // 文件上传失败，调用 onError 回调函数
            message.error(res.message);
            options.onError("上传失败");
        }
    } catch (error) {
        // 文件上传异常，调用 onError 回调函数
        message.error("上传异常");
        options.onError("上传异常");
    }
}

//下载文件
const downloadFile = async () => {
    try {
        const response = await axios.get('/word/download', {
            responseType: 'blob', // 告诉axios响应的数据类型是二进制数据
        });
        // 创建一个blob对象，用于存储文件内容
        const blob = new Blob([response.data]);
        // 创建一个a标签用于下载文件
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        // 设置下载文件的文件名
        link.download = 'wordDownload.csv';
        // 模拟点击a标签进行下载
        link.click();
    } catch (error) {
        console.error('下载文件失败:', error);
    }
}

//播放单词音频
const playAudio = (url: string) => {
    console.log(url)
    // 创建新的音频元素
    const audio = new Audio(url);
    // 播放声音
    audio.play();
}


//表单验证
const rules: Record<string, Rule[]> = {
    word: [
        { required: true, message: '请输入单词名', trigger: 'change' },
    ],
    type: [{ required: true, message: '请选择单词类型', trigger: 'change' }],
    translation: [{ required: true, message: '请输入单词翻译', trigger: 'change' }],
};

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
</style>
  