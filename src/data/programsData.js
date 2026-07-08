// Static metadata for each program category.
// All leaderboard data is fetched live from Supabase.
export const programsData = {
  athlete: {
    title: 'Youngest Fastest Athlete',
    heroImage: '/assets/hero_athletics.png',
    description: 'NASPE India\'s premier grassroot athletics ranking platform focusing on speed, stamina, and agility.',
    metricName: 'Timing',
  },
  skater: {
    title: 'Youngest Fastest Skater',
    heroImage: '/assets/hero_skating.png',
    description: 'Compete with the fastest minds on wheels. The official national ranking leaderboard for junior skating talent.',
    metricName: 'Timing',
  },
  cyclist: {
    title: 'Youngest Fastest Cyclist',
    heroImage: '/assets/hero_cycling.png',
    description: 'Pedal to the metal. Discover, track, and rank the top young cycling champions across India.',
    metricName: 'Timing',
  },
  dancer: {
    title: 'Youngest Dancer',
    heroImage: '/assets/kids_dancing.png',
    description: 'Celebrating rhythm, grace, and expressions. The national ranking platform for India\'s finest young dancers.',
    metricName: 'Score',
  },
  musician: {
    title: 'Youngest Musician',
    heroImage: '/assets/kids_singing.png',
    description: 'Honoring vocal and instrumental talents. Check out the rising stars in Indian student music circles.',
    metricName: 'Score',
  },
  artist: {
    title: 'Youngest Artist',
    heroImage: '/assets/kids_drawing.png',
    description: 'Where imagination meets canvas. View the official national rank list for student drawing and painting.',
    metricName: 'Score',
  },
  highjump: {
    title: 'High Jump Program',
    heroImage: '/assets/hero_athletics.png',
    description: 'Reaching new heights. The ultimate ranking platform for young high jumpers across India.',
    metricName: 'Height',
  },
  throw: {
    title: 'Throw Program',
    heroImage: '/assets/hero_athletics.png',
    description: 'Showcasing strength and technique in various throwing events for young champions.',
    metricName: 'Distance',
  },
};
