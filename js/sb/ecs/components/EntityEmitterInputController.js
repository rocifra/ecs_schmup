var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component
            class EntityEmitterInputController extends sb.ecs.Component {
                constructor() {
                    super(false);
                    this.stateControlSignalName = null;
                    this._stateControlSignalInstance = null;
                    this.beginEmit = () => {
                        this._entityEmitterComponent.paused = false;
                    };
                    this.endEmit = () => {
                        this._entityEmitterComponent.paused = true;
                    };
                    this.setInspectable("stateControlSignalName", "string");
                }
                attached() {
                    this._entityEmitterComponent = this.entity.getComponent("EntityEmitter");
                    this._stateControlSignalInstance = this.entity.entityManager.signals.getStateControlSignal(this.stateControlSignalName);
                }
                activated() {
                    this._stateControlSignalInstance.on.add(this.beginEmit);
                    this._stateControlSignalInstance.off.add(this.endEmit);
                }
            }
            components.EntityEmitterInputController = EntityEmitterInputController;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=EntityEmitterInputController.js.map