namespace sb.ecs.components
{
    export class AngularTargetTracking extends sb.ecs.Component
    {
        //inspectables
        public angularVelocity: number = 0.2;
        public courseCorrection: number = 0.005;

        public targetableTag: string;
        public dotProduct: number = 0;
        public crossProduct: number = 0;
        public angleToTarget: number = 0;

        private _targetedEntity: sb.ecs.Entity = null;
        private _targetEntityTransform: Transform;

        //helpers
        private _vec2Target: sb.math.Vec2 = new sb.math.Vec2();
        private _vec2Position: sb.math.Vec2 = new sb.math.Vec2();
        private _currentAngularVelocity = 0;
        private _minAngle = 0.00001;



        //requires target component | transform component
        private _targetComponent: Target;
        private _transformComponent: Transform;

        constructor()
        {
            super(true);

            this.setInspectable("angularVelocity", "number");
            this.setInspectable("courseCorrection", "number");
        }

        public attached()
        {
            this._targetComponent = <Target>this.entity.getComponent("Target");
            this._transformComponent = <Transform>this.entity.getComponent("Transform");
        }

        public update(deltaMS: number, deltaSC: number)
        {

            if (this._targetComponent.targetedTransform)
            {
                //console.log("got comp")
                //console.log(this._targetComponent.targetedTransform)
                let dx: number = this._targetComponent.targetedTransform.x - this._transformComponent.x;
                let dy: number = this._targetComponent.targetedTransform.y - this._transformComponent.y;

                this._vec2Target.set(dx, dy);



                this._vec2Position.set(Math.cos(this._transformComponent.rotation), Math.sin(this._transformComponent.rotation));

                if (this._vec2Target.length() > this._minAngle)
                    this._vec2Target.normalize();

                if (this._vec2Position.length() > this._minAngle)
                    this._vec2Position.normalize();




                //shows correct direction to rotate [-1, 1]
                this.crossProduct = this._vec2Position.x * this._vec2Target.y - this._vec2Position.y * this._vec2Target.x;

                this.dotProduct = this._vec2Position.x * this._vec2Target.x + this._vec2Position.y * this._vec2Target.y;

                //avoid floating point errors Math.Acos needs values betweeen [-1,1] otherwise will result a NaN
                if (this.dotProduct>1)
                    this.dotProduct = 1;

                if (this.dotProduct < -1)
                    this.dotProduct = -1;               

                this.angleToTarget = Math.acos(this.dotProduct);

                let courseCorrectionAngle = this.angleToTarget * this.courseCorrection;

                //increase rotation velocity
                if (this.crossProduct < 0)
                    courseCorrectionAngle = -courseCorrectionAngle;

                this._currentAngularVelocity = this.crossProduct * this.angularVelocity + courseCorrectionAngle;

                this._transformComponent.rotation += this._currentAngularVelocity;
                // console.log(this._currentAngularVelocity)
                /*
                let dx: number = this._targetComponent.targetedTransform.x - this._transformComponent.x;
                let dy: number = this._targetComponent.targetedTransform.y - this._transformComponent.y;

                this._vec2Target.set(dx + 0.000001, dy + 0.000001).normalize(); //must not be zero otherwise "normalise()" would trow an error; target might be stuck at 0 ..180 angle ???
                this._vec2Position.set(Math.cos(this._transformComponent.rotation) , Math.sin(this._transformComponent.rotation)).normalize();

                //console.log(this._vec2Position);

                //console.log(Math.sin(this._transformComponent.rotation), Math.cos(this._transformComponent.rotation))

                this.dotProduct = this._vec2Position.x * this._vec2Target.x + this._vec2Position.y * this._vec2Target.y;
                this.crossProduct = this._vec2Position.x * this._vec2Target.y - this._vec2Position.y * this._vec2Target.x;
                this.angleToTarget = Math.acos(this.dotProduct);

                //console.log(this.crossProduct);

                this._transformComponent.rotation += (this.angleToTarget * this.crossProduct)/10;


               // let resultRotation: number = this.rotationSpeed * this.crossProduct * deltaSC;
               // this._transformComponent.rotation += resultRotation;
               */
            }
        }

        public get targetedEntity(): sb.ecs.Entity
        {
            if (!this._targetedEntity)             
            {
                //aquire target
                let tagManager = this.entityManager.tagManager;
                let targetables = tagManager.getFilteredEntitySlots(tagManager.getNumericTag(this.targetableTag));

                let randomIndex = Math.floor(Math.random() * (targetables.length - 1));

                this._targetedEntity = targetables[randomIndex].entity;
            }

            return this._targetedEntity;
        }

    }
}