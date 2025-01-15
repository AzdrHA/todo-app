export const translatePriority = (priority) => {
    switch (priority) {
        case 'low':
            return 'basse';
        case 'medium':
            return 'moyenne';
        case 'high':
            return 'haute';
        default:
            return 'inconnue';
    }
}