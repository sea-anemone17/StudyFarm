import {createInitialState,migrateState} from "./state.js";const STORAGE_KEY="study_farm_kiwi_v2";
export function loadState(){const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return createInitialState();try{return migrateState(JSON.parse(raw));}catch{return createInitialState();}}
export function saveState(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
export function exportState(state){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`study-farm-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(url);}
