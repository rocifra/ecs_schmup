namespace sb.ecs.managers
{
    
    export class BlueprintManager
    {
        private _blueprints: Map<string, Blueprint> = new Map();
        private _entityManager: sb.ecs.EntityManager;

        constructor(entityManager: sb.ecs.EntityManager)
        {
            this._entityManager = entityManager;
        }

        public parseBlueprintsFromJSON(blueprintsObject: IBlueprintSchema): void
        {
            Logger.log(" * * * * * Begin parsing blueprints");

            //check if valid json
            if (!blueprintsObject)
            {
                Logger.warn("JSON object invalid - ", blueprintsObject);
                return
            }
            else
            {
                //create a blueprint for each key found in blueprintsNode
                for (let blueprintName in blueprintsObject)
                {
                    let blueprintInstance = new Blueprint(blueprintName, blueprintsObject[blueprintName], this._entityManager);

                    this._blueprints.set(blueprintName, blueprintInstance);                   
                }
            }
        }

        public getBlueprint(name: string): Blueprint
        {
            let blueprint: Blueprint = this._blueprints.get(name);

            if (!blueprint)
                Logger.warn( "Cannot find blueprint - " + name);


            return blueprint
        }
    }

    class Blueprint
    {
        public name: string
        public components: Map<string, any> = new Map();
        public tags: Array<number> = [];
        private _entityManager: sb.ecs.EntityManager;

        constructor(blueprintName: string, blueprintData: IBlueprintSchema, entityManager: sb.ecs.EntityManager)
        {
            Logger.log("[", blueprintName, "]");

            this._entityManager = entityManager;

            //parse blueprint data
            //parse components
            if (blueprintData.hasOwnProperty("components"))
            {
                //iterate through blueprint "components" node to get each component
                let componentsNode: { [componentName: string]: any } = blueprintData.components;

                for (let componentName in componentsNode)
                {
                    Logger.log(" - ", componentName);

                    let attributes = componentsNode[componentName];
                    this.components.set(componentName, attributes);
                }
            }
            else
            {
                Logger.warn("Missing key [components] in blueprints json object!");
            }

            //parse tags
            if (blueprintData.hasOwnProperty("tags"))
            {
                let tagsArray: Array<string> = blueprintData.tags;

                for (let i = 0; i < tagsArray.length; i++)
                {
                    let numericTag = this._entityManager.tagManager.getNumericTag(tagsArray[i], true);
                    this.tags.push(numericTag);
                }
            }
        }

       
    }
}