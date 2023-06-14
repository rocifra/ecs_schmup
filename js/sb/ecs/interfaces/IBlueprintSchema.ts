interface IBlueprintSchema extends Object
{
    tags: Array<string>;
    components: { [key: string]: any }
}