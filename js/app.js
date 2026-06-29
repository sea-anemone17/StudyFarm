import { loadState, saveState } from "./storage.js";
import { renderApp } from "./render.js";
import { bindEvents } from "./events.js";

let state = loadState();

function getState() {
  return state;
}

function setState(nextState) {
  state = nextState;
  saveState(state);
}

function render() {
  renderApp(state);
}

bindEvents({ getState, setState, render });
render();
