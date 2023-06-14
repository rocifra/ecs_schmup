namespace sb.util
{

    export class ArrayUtil
    {

        public static fastSplice(array: Array<any>, startIndex: number, removeCount: number = 1)
        {
            for (let i = startIndex; i < array.length; i++)
            {
                array[i] = array[i + removeCount];               
            }

            array.length -= removeCount;
        }
    }
}
