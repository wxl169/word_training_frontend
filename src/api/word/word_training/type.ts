export type WordTriningBeginRequest={
    mode:number;    //模式（0：英语选义，1：中文选义，2：填空拼写）
    difficulty:number;//难度（0：训练模式，1：挑战模式）
    wordTypeList:string[];//单词类型
    
}