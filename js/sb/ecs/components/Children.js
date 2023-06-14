var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class ChildEntityNode {
            }
            //requires Transform component   
            class Children extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this._childEntityNodes = [];
                    this.childNodeConstructor = () => { return new ChildEntityNode(); };
                    this.updateChildNodeTransform = (childNode) => {
                        childNode.childTransform.x = this._parentTransform.x + Math.cos(this._parentTransform.rotation) * childNode.pivotX - Math.sin(this._parentTransform.rotation) * childNode.pivotY;
                        childNode.childTransform.y = this._parentTransform.y + Math.cos(this._parentTransform.rotation) * childNode.pivotY + Math.sin(this._parentTransform.rotation) * childNode.pivotX;
                        //set rotation	
                        if (childNode.rotationLock)
                            childNode.childTransform.rotation = this._parentTransform.rotation + childNode.pivotRotation;
                        //force update - TODO
                        //childNode.entity.update(deltaMS, deltaSC);
                    };
                    this.setInspectable("childBlueprints", "array");
                }
                initialized() {
                    this._childEntityNodePool = new sb.data.ObjectPool(this.childNodeConstructor, 1000, true, 1, "ChildEntityNode");
                }
                attached() {
                    this._parentTransform = this.entity.getComponent("Transform");
                }
                activated() {
                    //add children to manager
                    for (let i = 0; i < this._childEntityNodes.length; i++) {
                        let entityNode = this._childEntityNodes[i];
                        this.updateChildNodeTransform(entityNode);
                        this.entityManager.addEntity(entityNode.entity);
                    }
                }
                deactivated() {
                    console.log("deac");
                    this._childBlueprints = null;
                    //recycle child nodes
                    for (let i = 0; i < this._childEntityNodes.length; i++)
                        this._childEntityNodePool.returnInstanceToPool(this._childEntityNodes[i]);
                    this._childEntityNodes.length = 0;
                }
                update(deltaMS, deltaSC) {
                    //update child transforms
                    for (let i = 0; i < this._childEntityNodes.length; i++) {
                        let childNode = this._childEntityNodes[i];
                        if (childNode.childTransform)
                            this.updateChildNodeTransform(childNode);
                    }
                }
                set childBlueprints(childBlueprints) {
                    this._childBlueprints = childBlueprints;
                    //create entities
                    for (let i = 0; i < this._childBlueprints.length; i++) {
                        let blueprintData = this._childBlueprints[i];
                        let entity = this.entityManager.createEntityFromBlueprint(blueprintData.blueprintID);
                        let childEntityNode = this._childEntityNodePool.getInstanceFromPool();
                        childEntityNode.blueprintID = blueprintData.blueprintID;
                        childEntityNode.entity = entity;
                        childEntityNode.pivotX = blueprintData.pivotX;
                        childEntityNode.pivotY = blueprintData.pivotY;
                        childEntityNode.pivotRotation = blueprintData.pivotRotation;
                        childEntityNode.rotationLock = blueprintData.rotationLock;
                        childEntityNode.childTransform = entity.getComponent("Transform", false);
                        this._childEntityNodes.push(childEntityNode);
                    }
                }
            }
            components.Children = Children;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Children.js.map