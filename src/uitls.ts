/**
 * Rounds a number to a specified decimal precision.
 * @param number - The number to round
 * @param precision - Number of decimal places to round to
 * @returns The rounded number
 * @example
 * roundNumber(3.14159, 2) // Returns 3.14
 * roundNumber(10.8675, 3) // Returns 10.868
 */
export function roundNumber(number: number, precision: number) {
    const factor = 10 ** precision;

    return Math.round(number * factor) / factor;
}

/**
 * Calculates the dot product of two number arrays by multiplying corresponding elements and summing the results.
 * @param numbersA - First array of numbers
 * @param numbersB - Second array of numbers
 * @returns The dot product of the two arrays
 * @throws Error if arrays have different lengths
 * @example
 * getDot([1, 2, 3], [4, 5, 6]) // Returns 32
 */
export function getDot(numbersA: number[], numbersB: number[]): number {
    if (numbersA.length !== numbersB.length) {
        throw new Error('The length of numbers does not match.');
    }

    const multipliedNumbers = numbersA.map((value, index) => value * numbersB[index]);

    return multipliedNumbers.reduce((prev, curr) => prev + curr, 0);
}
