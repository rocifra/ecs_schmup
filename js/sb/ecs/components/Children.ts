namespace sb.ecs.components
{
    interface IChildBlueprintData
    {
        blueprintID: string;
        pivotX: number;
        pivotY: number;
        pivotRotation: number;
        rotationLock: boolean;
    }

    class ChildEntityNode
    {
        blueprintID: string;
        pivotX: number;
        pivotY: number;
        pivotRotation: number;
        rotationLock: boolean;
        childTransform: sb.ecs.components.Transform;
        entity: sb.ecs.Entity;
    }

    //requires Transform component   
    export class Children extends sb.ecs.Component
    {
        private _childBlueprints: Array<IChildBlueprintData>;
        private _childEntityNodes: Array<ChildEntityNode> = [];
        private _parentTransform: Transform;
        private _childEntityNodePool: sb.data.ObjectPool;

        constructor()
        {
            super(true); this.setInspectable("childBlueprints", "array");
        }

        private childNodeConstructor = (): ChildEntityNode => { return new ChildEntityNode(); }

        private updateChildNodeTransform = (childNode: ChildEntityNode) =>
        {
            childNode.childTransform.x = this._parentTransform.x + Math.cos(this._parentTransform.rotation) * childNode.pivotX - Math.sin(this._parentTransform.rotation) * childNode.pivotY;
            childNode.childTransform.y = this._parentTransform.y + Math.cos(this._parentTransform.rotation) * childNode.pivotY + Math.sin(this._parentTransform.rotation) * childNode.pivotX;

            //set rotation	
            if (childNode.rotationLock)
                childNode.childTransform.rotation = this._parentTransform.rotation + childNode.pivotRotation;

             //force update - TODO
                    //childNode.entity.update(deltaMS, deltaSC);
        }

        public initialized()
        {
            this._childEntityNodePool = new sb.data.ObjectPool(this.childNodeConstructor, 1000, true, 1, "ChildEntityNode");
        }



        public attached(): void
        {            //get refs
            this._parentTransform = <Transform>this.entity.getComponent("Transform");
        }

        public activated(): void
        {
            //add children to manager
            for (let i = 0; i < this._childEntityNodes.length; i++)
            {
                let entityNode = this._childEntityNodes[i];
                this.updateChildNodeTransform(entityNode);
                this.entityManager.addEntity(entityNode.entity);
            }
        }

        public deactivated(): void
        {
            console.log("deac")
            this._childBlueprints = null;

            //recycle child nodes
            for (let i = 0; i < this._childEntityNodes.length; i++)
                this._childEntityNodePool.returnInstanceToPool(this._childEntityNodes[i]);

            this._childEntityNodes.length = 0;
        }


        public update(deltaMS: number, deltaSC: number) 
        {
            //update child transforms
            for (let i = 0; i < this._childEntityNodes.length; i++)
            {
                let childNode = this._childEntityNodes[i];

                if (childNode.childTransform)
                    this.updateChildNodeTransform(childNode);
            }
        }

        public set childBlueprints(childBlueprints: Array<IChildBlueprintData>)
        {
            this._childBlueprints = childBlueprints;

            //create entities
            for (let i = 0; i < this._childBlueprints.length; i++)
            {
                let blueprintData: IChildBlueprintData = this._childBlueprints[i];
                let entity = this.entityManager.createEntityFromBlueprint(blueprintData.blueprintID);
                let childEntityNode = <ChildEntityNode>this._childEntityNodePool.getInstanceFromPool();

                childEntityNode.blueprintID = blueprintData.blueprintID;
                childEntityNode.entity = entity;
                childEntityNode.pivotX = blueprintData.pivotX;
                childEntityNode.pivotY = blueprintData.pivotY;
                childEntityNode.pivotRotation = blueprintData.pivotRotation;
                childEntityNode.rotationLock = blueprintData.rotationLock;
                childEntityNode.childTransform = <Transform>entity.getComponent("Transform", false);                     

                this._childEntityNodes.push(childEntityNode);
            }
        }
    }
}