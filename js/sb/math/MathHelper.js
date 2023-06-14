var sb;
(function (sb) {
    var math;
    (function (math) {
        class MathHelper {
            static randomNumberFromRange(minNum, maxNum) {
                return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
            }
            static randomChance(chance = 0.5) {
                let eventOccurance = false;
                let randomNum = Math.random();
                if (randomNum <= chance)
                    eventOccurance = true;
                return eventOccurance;
            }
            static isPrime(num) {
                for (let i = 2, s = Math.sqrt(num); i <= s; i++)
                    if (num % i === 0)
                        return false;
                return num !== 1;
            }
            //distance between 2 points
            static euclideanDistance(point1, point2) {
                var dx = point2.x - point1.x;
                var dy = point2.y - point1.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
            /** Moves a radian angle into the range [-PI, +PI], while keeping the direction intact. */
            static normalizeAngle(angle) {
                // move to equivalent value in range [0 deg, 360 deg] without a loop
                angle = angle % this.TWO_PI;
                // move to [-180 deg, +180 deg]
                if (angle < -Math.PI)
                    angle += this.TWO_PI;
                if (angle > Math.PI)
                    angle -= this.TWO_PI;
                return angle;
            }
        }
        MathHelper.TWO_PI = Math.PI * 2.0;
        math.MathHelper = MathHelper;
    })(math = sb.math || (sb.math = {}));
})(sb || (sb = {}));
//# sourceMappingURL=MathHelper.js.map