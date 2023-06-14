var sb;
(function (sb) {
    var util;
    (function (util) {
        class ArrayUtil {
            static fastSplice(array, startIndex, removeCount = 1) {
                for (let i = startIndex; i < array.length; i++) {
                    array[i] = array[i + removeCount];
                }
                array.length -= removeCount;
            }
        }
        util.ArrayUtil = ArrayUtil;
    })(util = sb.util || (sb.util = {}));
})(sb || (sb = {}));
//# sourceMappingURL=ArrayUtil.js.map