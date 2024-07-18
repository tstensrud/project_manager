export function customSortFloors(floors) {
    return floors.sort((a, b) => {
        const regex = /^([a-zA-Z]*)(\d*)$/;
        
        // Extract parts using regex
        const [, aLetters, aNumbers] = a.match(regex);
        const [, bLetters, bNumbers] = b.match(regex);
        
        // Compare letters first
        if (aLetters < bLetters) return -1;
        if (aLetters > bLetters) return 1;

        // Compare numbers (convert to integer for proper numeric comparison)
        const aNum = aNumbers ? parseInt(aNumbers, 10) : 0;
        const bNum = bNumbers ? parseInt(bNumbers, 10) : 0;

        // Reverse numeric comparison
        return aNum - bNum;
    });
}