export function customSortFloors(floors) {
    return floors.sort((a, b) => {
        const regex = /^([a-zA-Z]*)(\d*)$/;
    
        const [, aLetters, aNumbers] = a.match(regex);
        const [, bLetters, bNumbers] = b.match(regex);
        
        if (aLetters < bLetters) return -1;
        if (aLetters > bLetters) return 1;

        const aHasLeadingZero = aNumbers.startsWith('0');
        const bHasLeadingZero = bNumbers.startsWith('0');

        const aNum = aNumbers ? parseInt(aNumbers, 10) : 0;
        const bNum = bNumbers ? parseInt(bNumbers, 10) : 0;

        if (aHasLeadingZero && bHasLeadingZero) {
            return bNum - aNum;
        }

        if (aHasLeadingZero) return -1;
        if (bHasLeadingZero) return 1;

        return aNum - bNum;
    });
}