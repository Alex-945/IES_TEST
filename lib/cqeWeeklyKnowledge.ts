export type ProjectMemoryItem = {
  customer: string;
  product: string;
  project: string;
};

export type GlossaryItem = {
  zh: string;
  en: string;
  note?: string;
};

export const projectMemory: ProjectMemoryItem[] = [
  { customer: "Kostal", product: "AUTO OPT,3394,LOWER HOUSING+PLATE,WHITE", project: "Jiading" },
  { customer: "Kostal", product: "AUTO OPT,3394,LOWER HOUSING+PLATE,BLACK (NIO FOB)", project: "Jiading" },
  { customer: "Kostal/NIO", product: "FOB 汽車鑰匙(黑)", project: "Jiading" },
  { customer: "Kostal/NIO", product: "BTM 藍牙模組 (NIO BTM)", project: "Jiading" },
  { customer: "Kostal/BYD", product: "BTM 藍牙模組 (BYD UWB)", project: "Pudong" },
  { customer: "Kostal/JMC", product: "CCU (Center control unit)", project: "Changning" },
  { customer: "Kostal/JMC", product: "CCU JCE3-V / JCE3-T", project: "Changning" },
  { customer: "Kostal/JMC", product: "ZCU (Zone Control Unit)", project: "SongJiang" },
  { customer: "Kostal/JMC", product: "BDM 區域控制模組", project: "HONGQIAO" },
  { customer: "Baidu", product: "RSU 路側放大器", project: "Minjiang" },
  { customer: "HCMF", product: "新天窗馬達組合 NSPR", project: "Fengxian" },
  { customer: "HCMF/STAL", product: "天窗馬達ECU (NSPR/OETM)", project: "Jinshan" },
  { customer: "HCMF/STAL", product: "天窗馬達ECU (ZhouShan)", project: "ZhouShan" },
  { customer: "Kostal/Volvo", product: "電動窗控制開關 (CMA5/CMA6)", project: "Hat-trick" },
  { customer: "Kostal/MMC", product: "電動窗控制開關 (MMC)", project: "Hat-trick" },
  { customer: "Kostal/GWM", product: "門模塊控制器 DCU", project: "Tianchi" },
  { customer: "Kostal/AUDI", product: "門模塊控制器 DCU", project: "Hengshan" },
  { customer: "Kostal/VW", product: "門模塊控制器 DCU", project: "Hengshan" },
  { customer: "Kostal/Mazda", product: "車載充電機 OBC", project: "Qingpu" },
  { customer: "Kostal/Mazda", product: "OBC DCDC / DC Filter", project: "Qingpu" },
  { customer: "Forvia", product: "Car Audio (Shoko Main board)", project: "Shoko" },
  { customer: "Boach Wuxi", product: "高壓風扇電機控制器", project: "TBD" },
  { customer: "HCMF/GWM", product: "天窗馬達組合 Roof ECU (HCMF SPR)", project: "Zhoushan" },
  { customer: "HCMF", product: "CEER DCU", project: "Jiangshan" }
];

export const glossary: GlossaryItem[] = [
  { zh: "分析中", en: "Under FA", note: "Use this exact status wording." },
  { zh: "查無異常", en: "NTF (No Trouble Found)", note: "Do not translate freely." },
  { zh: "AOI 大圖已確認現象存在", en: "AOI image confirmed the defect existence" },
  { zh: "已召開初次分析會議", en: "Initial analysis meeting held" },
  { zh: "詳細請見 one pager", en: "Please refer to one pager for details" },
  { zh: "已安排換貨", en: "Replacement arranged" },
  { zh: "待客戶確認", en: "Pending customer confirmation" },
  { zh: "已退回分析", en: "Returned for analysis" },
  { zh: "刮痕", en: "scratch" },
  { zh: "裂紋", en: "crack" },
  { zh: "短路", en: "short circuit" },
  { zh: "開路", en: "open circuit" },
  { zh: "少錫", en: "insufficient solder" },
  { zh: "多錫", en: "excess solder" },
  { zh: "冷焊", en: "cold solder" },
  { zh: "錫珠", en: "solder ball" },
  { zh: "氣泡", en: "void" },
  { zh: "缺件", en: "component missing" },
  { zh: "錯件", en: "wrong component" },
  { zh: "極性反", en: "polarity reversed" },
  { zh: "偏移", en: "shifted" },
  { zh: "分層", en: "delamination" },
  { zh: "氧化", en: "oxidation" },
  { zh: "異物", en: "foreign material" },
  { zh: "凹陷", en: "dent" },
  { zh: "變形", en: "deformation" },
  { zh: "功能失效", en: "function failure" },
  { zh: "無法連線", en: "connection failure" },
  { zh: "燒毀", en: "burned" }
];

export function buildProjectMemoryText(limit = 20) {
  return projectMemory
    .slice(0, limit)
    .map((item) => `${item.customer} | ${item.product} | ${item.project}`)
    .join("\n");
}

export function buildGlossaryText() {
  return glossary
    .map((item) => `${item.zh} => ${item.en}${item.note ? ` (${item.note})` : ""}`)
    .join("\n");
}
