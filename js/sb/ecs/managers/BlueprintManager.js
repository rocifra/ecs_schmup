var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var managers;
        (function (managers) {
            class BlueprintManager {
                constructor(entityManager) {
                    this._blueprints = new Map();
                    this._entityManager = entityManager;
                }
                parseBlueprintsFromJSON(blueprintsObject) {
                    Logger.log(" * * * * * Begin parsing blueprints");
                    //check if valid json
                    if (!blueprintsObject) {
                        Logger.warn("JSON object invalid - ", blueprintsObject);
                        return;
                    }
                    else {
                        //create a blueprint for each key found in blueprintsNode
                        for (let blueprintName in blueprintsObject) {
                            let blueprintInstance = new Blueprint(blueprintName, blueprintsObject[blueprintName], this._entityManager);
                            this._blueprints.set(blueprintName, blueprintInstance);
                        }
                    }
                }
                getBlueprint(name) {
                    let blueprint = this._blueprints.get(name);
                    if (!blueprint)
                        Logger.warn("Cannot find blueprint - " + name);
                    return blueprint;
                }
            }
            managers.BlueprintManager = BlueprintManager;
            class Blueprint {
                constructor(blueprintName, blueprintData, entityManager) {
                    this.components = new Map();
                    this.tags = [];
                    Logger.log("[", blueprintName, "]");
                    this._entityManager = entityManager;
                    //parse blueprint data
                    //parse components
                    if (blueprintData.hasOwnProperty("components")) {
                        //iterate through blueprint "components" node to get each component
                        let componentsNode = blueprintData.components;
                        for (let componentName in componentsNode) {
                            Logger.log(" - ", componentName);
                            let attributes = componentsNode[componentName];
                            this.components.set(componentName, attributes);
                        }
                    }
                    else {
                        Logger.warn("Missing key [components] in blueprints json object!");
                    }
                    //parse tags
                    if (blueprintData.hasOwnProperty("tags")) {
                        let tagsArray = blueprintData.tags;
                        for (let i = 0; i < tagsArray.length; i++) {
                            let numericTag = this._entityManager.tagManager.getNumericTag(tagsArray[i], true);
                            this.tags.push(numericTag);
                        }
                    }
                }
            }
        })(managers = ecs.managers || (ecs.managers = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=BlueprintManager.js.map