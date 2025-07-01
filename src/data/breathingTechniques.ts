
export const techniques = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 0 },
    '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    '6-2-6-2': { inhale: 6, hold: 2, exhale: 6, pause: 2 },
    'simple': { inhale: 4, hold: 0, exhale: 4, pause: 0 }
};

export const breathingTechniques = [
    {
        id: '4-4-4-4',
        name: 'Box Breathing',
        description: 'Equal counts for inhale, hold, exhale, and pause',
        instructions: 'Breathe in for 4, hold for 4, breathe out for 4, pause for 4',
        timing: techniques['4-4-4-4']
    },
    {
        id: '4-7-8',
        name: '4-7-8 Breathing',
        description: 'Relaxing breath technique for sleep and stress relief',
        instructions: 'Breathe in for 4, hold for 7, breathe out for 8',
        timing: techniques['4-7-8']
    },
    {
        id: '6-2-6-2',
        name: 'Coherent Breathing',
        description: 'Balanced breathing for focus and calm',
        instructions: 'Breathe in for 6, hold for 2, breathe out for 6, pause for 2',
        timing: techniques['6-2-6-2']
    },
    {
        id: 'simple',
        name: 'Simple Breathing',
        description: 'Basic in and out breathing',
        instructions: 'Breathe in for 4, breathe out for 4',
        timing: techniques['simple']
    }
];
