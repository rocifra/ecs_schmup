namespace sb.math
{

    export class MathHelper
    {

        private static TWO_PI: number = Math.PI * 2.0;

        public static randomNumberFromRange(minNum: number, maxNum: number): number 
        {
            return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
        }

        public static randomChance(chance: number = 0.5): boolean
        {
            let eventOccurance: boolean = false;
            let randomNum: number = Math.random();

            if (randomNum <= chance)
                eventOccurance = true;

            return eventOccurance
        }

        public static isPrime(num: number): boolean
        {
            for (let i = 2, s = Math.sqrt(num); i <= s; i++)
                if (num % i === 0) return false;

            return num !== 1;
        }

        //distance between 2 points
        public static euclideanDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number
        {
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /** Moves a radian angle into the range [-PI, +PI], while keeping the direction intact. */
        public static normalizeAngle(angle: number): number
        {
            // move to equivalent value in range [0 deg, 360 deg] without a loop
            angle = angle % this.TWO_PI;

            // move to [-180 deg, +180 deg]
            if (angle < -Math.PI) angle += this.TWO_PI;
            if (angle > Math.PI) angle -= this.TWO_PI;

            return angle;
        }

    }
}