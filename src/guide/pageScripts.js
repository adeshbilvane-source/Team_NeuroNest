const homeFreeOptions = [
  { label: 'Activity', route: '/patient/activities', targetId: 'home-activity-card' },
  { label: 'Family', route: '/patient/family', targetId: 'home-family-card' },
  { label: 'Videos', route: '/patient/videos-library', targetId: 'home-videos-card' },
  { label: 'Emergency', route: '/patient/emergency', targetId: 'home-emergency-button' },
];

const activityOptions = [
  { label: 'Picture game', route: '/patient/games/identify-picture', targetId: 'activities-picture-game' },
  { label: 'Memory cards', route: '/patient/games/memory-match', targetId: 'activities-memory-cards' },
  { label: 'Jigsaw', route: '/patient/games/jigsaw', targetId: 'activities-jigsaw' },
  { label: 'Sort buttons', route: '/patient/games/button-sorting', targetId: 'activities-sort-buttons' },
  { label: 'Yoga & Rest', route: '/patient/yoga', targetId: 'activities-yoga' },
];

const gamesHubOptions = [
  { label: 'Picture game', route: '/patient/games/identify-picture', targetId: 'gameshub-picture-game' },
  { label: 'Memory cards', route: '/patient/games/memory-match', targetId: 'gameshub-memory-cards' },
  { label: 'Jigsaw', route: '/patient/games/jigsaw', targetId: 'gameshub-jigsaw' },
  { label: 'Sort buttons', route: '/patient/games/button-sorting', targetId: 'gameshub-sort-buttons' },
  { label: 'Yoga & Rest', route: '/patient/yoga', targetId: 'gameshub-yoga' },
];

const memoryCategoryOptions = [
  { label: 'Fruits & Veg', route: '/patient/games/memory-match', targetId: 'memory-match-fruits' },
  { label: 'Shapes', route: '/patient/games/memory-match', targetId: 'memory-match-shapes' },
  { label: 'Household', route: '/patient/games/memory-match', targetId: 'memory-match-household' },
  { label: 'Numbers', route: '/patient/games/memory-match', targetId: 'memory-match-numbers' },
];

const identifyTabOptions = [
  { label: 'Random', route: '/patient/games/identify-picture', targetId: 'identify-random-tab' },
  { label: 'Family photos', route: '/patient/games/identify-picture', targetId: 'identify-family-tab' },
  { label: 'My surroundings', route: '/patient/games/identify-picture', targetId: 'identify-surroundings-tab' },
];

const jigsawOptions = [
  { label: 'Photo Jigsaw', route: '/patient/games/jigsaw', targetId: 'jigsaw-photo-mode' },
  { label: 'Numbers', route: '/patient/games/jigsaw', targetId: 'jigsaw-numbers-mode' },
  { label: 'View Full Photo', route: '/patient/games/jigsaw', targetId: 'jigsaw-view-photo' },
];

const buttonSortingOptions = [
  { label: 'By shape', route: '/patient/games/button-sorting', targetId: 'button-sorting-shape' },
  { label: 'By colour', route: '/patient/games/button-sorting', targetId: 'button-sorting-color' },
];

const videosOptions = [
  { label: 'Videos', route: '/patient/videos-library', targetId: 'videos-tab-videos' },
  { label: 'Library', route: '/patient/videos-library', targetId: 'videos-tab-library' },
];

const yogaOptions = [
  { label: 'Mountain Pose', route: '/patient/yoga', targetId: 'yoga-mountain-pose' },
  { label: 'Supported Tree Pose', route: '/patient/yoga', targetId: 'yoga-supported-tree' },
  { label: 'Seated Chair Twist', route: '/patient/yoga', targetId: 'yoga-chair-twist' },
  { label: 'Seated Forward Fold', route: '/patient/yoga', targetId: 'yoga-forward-fold' },
  { label: 'Gentle Cat-Cow Flow', route: '/patient/yoga', targetId: 'yoga-cat-cow' },
];

const getSingleOptionScript = (label, route, targetId) => ({
  onEnter: `Now say or press ${label}.`,
  targetId,
  route,
  options: [{ label, route, targetId }],
  single: true,
});

const pageScripts = {
  home: ({ activeScheduledWalkthrough, scheduledTask }) => {
    if (activeScheduledWalkthrough) {
      return getSingleOptionScript('Activity', '/patient/activities', 'home-activity-card');
    }

    return {
      onEnter: 'You can say or tap Activity, Family, Videos, or Emergency.',
      targetId: null,
      options: homeFreeOptions,
    };
  },

  activities: ({ activeScheduledWalkthrough, scheduledTask }) => {
    if (activeScheduledWalkthrough) {
      const taskName = (scheduledTask?.taskName || '').toLowerCase();
      if (taskName.includes('memory')) {
        return getSingleOptionScript('Memory cards', '/patient/games/memory-match', 'activities-memory-cards');
      }
      if (taskName.includes('yoga') || taskName.includes('rest')) {
        return getSingleOptionScript('Yoga and Rest', '/patient/yoga', 'activities-yoga');
      }
      if (taskName.includes('picture') || taskName.includes('family')) {
        return getSingleOptionScript('Picture game', '/patient/games/identify-picture', 'activities-picture-game');
      }
    }

    return {
      onEnter: 'Choose Picture game, Memory cards, Jigsaw, Sort buttons, or Yoga and Rest.',
      targetId: 'activities-picture-game',
      options: activityOptions,
    };
  },

  gamesHub: ({ activeScheduledWalkthrough, scheduledTask }) => {
    if (activeScheduledWalkthrough) {
      const taskName = (scheduledTask?.taskName || '').toLowerCase();
      if (taskName.includes('yoga') || taskName.includes('rest')) {
        return getSingleOptionScript('Yoga and Rest', '/patient/yoga', 'gameshub-yoga');
      }
      if (taskName.includes('memory')) {
        return getSingleOptionScript('Memory cards', '/patient/games/memory-match', 'gameshub-memory-cards');
      }
      if (taskName.includes('picture') || taskName.includes('family')) {
        return getSingleOptionScript('Picture game', '/patient/games/identify-picture', 'gameshub-picture-game');
      }
    }

    return {
      onEnter: 'Choose Picture game, Memory cards, Jigsaw, Sort buttons, or Yoga and Rest.',
      targetId: 'gameshub-picture-game',
      options: gamesHubOptions,
    };
  },

  identifyPicture: ({ activeScheduledWalkthrough, currentTab } = {}) => {
    if (activeScheduledWalkthrough) {
      return {
        onEnter: 'What is shown in the picture? Please answer with the visible option label.',
        targetId: null,
        options: [
          { label: 'Car', route: '/patient/games/identify-picture', targetId: null },
          { label: 'Cat', route: '/patient/games/identify-picture', targetId: null },
          { label: 'Banana', route: '/patient/games/identify-picture', targetId: null },
        ],
      };
    }

    return {
      onEnter: currentTab === 'Family photos'
        ? 'What is shown in the picture? Choose the answer that matches the photo.'
        : currentTab === 'My surroundings'
          ? 'What is shown in the picture? Choose the answer that matches the scene.'
          : 'What is shown in the picture? Choose the correct answer from the list.',
      targetId: null,
      options: identifyTabOptions,
    };
  },

  memoryMatch: ({ activeScheduledWalkthrough, currentCategory } = {}) => {
    if (activeScheduledWalkthrough) {
      return getSingleOptionScript('Fruits and Veg', '/patient/games/memory-match', 'memory-match-fruits');
    }

    return {
      onEnter: currentCategory
        ? `Find the matching pair in the ${currentCategory} cards.`
        : 'Find the matching pair in the cards.',
      targetId: 'memory-match-fruits',
      options: memoryCategoryOptions,
    };
  },

  jigsaw: ({ activeScheduledWalkthrough, currentMode } = {}) => {
    if (activeScheduledWalkthrough) {
      return {
        onEnter: 'Tap one piece to select, then tap another piece to swap. Rebuild the full photo.',
        targetId: 'jigsaw-photo-mode',
        options: [{ label: 'Photo Jigsaw', route: '/patient/games/jigsaw', targetId: 'jigsaw-photo-mode' }],
        single: true,
      };
    }

    return {
      onEnter: currentMode === 'numbers'
        ? 'Tap one piece to select, then tap another piece to swap. Put the numbers in order.'
        : 'Tap one piece to select, then tap another piece to swap. Rebuild the full photo.',
      targetId: currentMode === 'numbers' ? 'jigsaw-numbers-mode' : 'jigsaw-photo-mode',
      options: jigsawOptions,
    };
  },

  buttonSorting: ({ activeScheduledWalkthrough, currentMode } = {}) => {
    if (activeScheduledWalkthrough) {
      return {
        onEnter: 'Select a button from above, then tap the matching shape bin below.',
        targetId: 'button-sorting-shape',
        options: [{ label: 'By shape', route: '/patient/games/button-sorting', targetId: 'button-sorting-shape' }],
        single: true,
      };
    }

    return {
      onEnter: currentMode === 'color'
        ? 'Select a button from above, then tap the matching colour bin below.'
        : 'Select a button from above, then tap the matching shape bin below.',
      targetId: currentMode === 'color' ? 'button-sorting-color' : 'button-sorting-shape',
      options: buttonSortingOptions,
    };
  },

  videosLibrary: ({ activeScheduledWalkthrough, currentTab } = {}) => {
    if (activeScheduledWalkthrough) {
      return getSingleOptionScript('Videos', '/patient/videos-library', 'videos-tab-videos');
    }

    return {
      onEnter: currentTab === 'library'
        ? 'Browse your uploaded videos and family library items.'
        : 'Your uploaded videos and calming videos are available here.',
      targetId: currentTab === 'library' ? 'videos-tab-library' : 'videos-tab-videos',
      options: videosOptions,
    };
  },

  yoga: ({ activeScheduledWalkthrough } = {}) => {
    if (activeScheduledWalkthrough) {
      return {
        onEnter: 'Choose a pose to begin. Say or tap the pose you want.',
        targetId: null,
        options: yogaOptions,
      };
    }

    return {
      onEnter: 'Choose a pose to begin. Say or tap the pose you want.',
      targetId: 'yoga-mountain-pose',
      options: yogaOptions,
    };
  },
};

export default pageScripts;
