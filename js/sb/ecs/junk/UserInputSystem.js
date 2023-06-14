var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class UserInputSistem extends sb.ecs.System {
                constructor(params) {
                    super(false);
                    this._keyIntents = new Map();
                    this._actionObject = {
                        ended: false,
                        isTouch: false,
                        pointerX: 0,
                        pointerY: 0
                    };
                }
                //access to other systems
                activated() {
                }
                deactivated() {
                }
                bindKeyboardAction(intentName, key) {
                    if (this._keyIntents.has(key)) {
                        Logger.warn(`An Intent  [${this._keyIntents.get(key)}] already registered to key [${key}]`);
                    }
                    else {
                        this._keyIntents.set(key, intentName);
                    }
                }
            }
            systems.UserInputSistem = UserInputSistem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=UserInputSystem.js.map