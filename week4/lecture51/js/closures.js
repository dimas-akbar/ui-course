function makeMultiplier (multiplier) {
    return(
        function (x) {
            return multiplier * x;
        }
    );
}

var doubleAll = makeMultiplier(2);
var tripleAll = makeMultiplier(3);

console.log(this);
console.log(doubleAll(10));
console.log(tripleAll(3));