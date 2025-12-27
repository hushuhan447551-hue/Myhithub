
export enum FlowVolume {
  SPOTTING = '点滴',
  LIGHT = '少量',
  MEDIUM = '中量',
  HEAVY = '大量'
}

export enum FlowColor {
  PURPLE_BLACK = '深紫黑',
  BROWN = '红褐',
  DARK_RED = '深红',
  RED = '红色',
  BRIGHT_RED = '鲜红',
  PALE_RED = '淡红'
}

export enum FlowTexture {
  NORMAL = '正常',
  THICK = '粘稠',
  THIN = '稀少',
  CLOTS = '血块'
}

export interface LogEntry {
  date: string; // ISO string YYYY-MM-DD
  volume: FlowVolume;
  color: FlowColor;
  texture: FlowTexture;
  painLevel: number; // 0-5
  symptoms: string[];
  moods: string[];
  note?: string;
}

export interface CycleStats {
  averageLength: number;
  lastPeriodDate: string;
  nextPeriodDate: string;
  isPredicting: boolean;
}
