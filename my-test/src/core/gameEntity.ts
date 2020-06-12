import app from "../app";
import GameScriptType from "./gameScriptType";

export default class GameEntity extends pc.Entity {
  constructor(name?: string, app?: pc.Application) {
    super(name, app);
    setTimeout(() => {
      this.onLoad();
    }, 1);
  }

  set enabled(enabled: boolean) {
    super.enabled = enabled;
  }
  get enabled() {
    return super.enabled;
  }

  /**
   * 构造
   */
  onLoad() {
    let aaaaaa = this.addComponent("script") as pc.ScriptComponent;
    aaaaaa.create(GameScriptType);
  }
}
