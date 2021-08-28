/**
 * @file Manages electron contextBridge, used to create a safe, bi-directional,
 * synchronous bridge across isolated contexts.
 */

// ━━ IMPORT PACKAGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// » IMPORT ELECTRON APIS
const { ipcRenderer, contextBridge } = require('electron');

// » CREATE CONTEXT BRIDGE
contextBridge.exposeInMainWorld('appRuntime', {
  send: (channel, payload) => ipcRenderer.send(channel, payload),
  subscribeOnce: (channel, listener) => {
    const subscription = (event, ...args) => listener(...args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  subscribe: (channel, handler) => ipcRenderer.on(channel, handler),
  unsubscribe: (channel, handler) => ipcRenderer.on(channel, handler),
});
