// Screen manager - handles switching between screens
export class ScreenManager {
  constructor(container) {
    this.container = container;
    this.currentScreen = null;
    this.screens = {};
  }
  
  register(name, renderFn) {
    this.screens[name] = renderFn;
  }
  
  show(name, data) {
    if (!this.screens[name]) {
      console.error(`Screen "${name}" not found`);
      return;
    }
    
    this.currentScreen = name;
    this.screens[name](this.container, data);
  }
}
