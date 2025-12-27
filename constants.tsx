
import React from 'react';
import { FlowColor } from './types';

/**
 * Updated Flow Colors: Including RED between DARK_RED and BRIGHT_RED.
 */
export const COLOR_MAP: Record<FlowColor, string> = {
  [FlowColor.PURPLE_BLACK]: 'bg-[#4c1d1d]', 
  [FlowColor.BROWN]: 'bg-[#78350f]',        
  [FlowColor.DARK_RED]: 'bg-[#991b1b]',      
  [FlowColor.RED]: 'bg-[#dc2626]',           
  [FlowColor.BRIGHT_RED]: 'bg-[#ef4444]',    
  [FlowColor.PALE_RED]: 'bg-[#fecaca]',      
};

export const SYMPTOMS = [
  { id: 'nothing', label: '没啥感觉', icon: 'fa-face-smile' },
  { id: 'cramps', label: '腹痛', icon: 'fa-heart-pulse' },
  { id: 'headache', label: '头疼', icon: 'fa-cloud-sun' },
  { id: 'fatigue', label: '没力气', icon: 'fa-bed' },
  { id: 'breast', label: '胀胀的', icon: 'fa-circle-notch' },
  { id: 'acne', label: '冒痘痘', icon: 'fa-star' },
  { id: 'bloating', label: '小肚子胀', icon: 'fa-bowl-food' },
];

export const MOODS = [
  { id: 'happy', label: '晴朗', icon: 'fa-sun' },
  { id: 'irritable', label: '有一点烦', icon: 'fa-cloud-bolt' },
  { id: 'anxious', label: '心慌慌', icon: 'fa-water' },
  { id: 'sad', label: '想哭哭', icon: 'fa-cloud-showers-heavy' },
  { id: 'calm', label: '平静', icon: 'fa-leaf' },
  { id: 'energetic', label: '活力满满', icon: 'fa-rocket' },
];
