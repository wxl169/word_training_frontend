//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type { BaseResponseWordTrainingJudgementVO, BaseResponseWordTrainingListVO, WordTrainingJudgementDTO, WordTriningBeginRequest } from "./type";
//项目用户相关的请求地址
enum API {
  GET_WORD_TRAINING_BEGIN_URL = "/word_training/begin",
  DO_JUDGEMENT = "/word_training/judgement",
}

//获取题目列表
export const createWordTraining = (data: WordTriningBeginRequest) =>
  request.post<any, BaseResponseWordTrainingListVO>(API.GET_WORD_TRAINING_BEGIN_URL, data);

//判断答题是否正确
export const doJugement = (data:WordTrainingJudgementDTO) =>
  request.post<any,BaseResponseWordTrainingJudgementVO>(API.DO_JUDGEMENT,data);





