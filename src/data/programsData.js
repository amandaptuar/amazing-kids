// Helper to generate random date of birth
const generateDOB = (age) => {
  const year = new Date().getFullYear() - age;
  return `15-0${Math.floor(Math.random() * 9) + 1}-${year}`;
};

// Helper to generate participants
const generateParticipants = (categoryName, count, metricType) => {
  const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Kabir', 'Aryan', 'Ishaan', 'Shaurya', 'Dhruv', 'Rishi', 'Ananya', 'Diya', 'Kiara', 'Aadhya', 'Priya', 'Riya', 'Avni', 'Myra', 'Kavya', 'Sana'];
  const lastNames = ['Sharma', 'Verma', 'Patil', 'Deshmukh', 'Singh', 'Kapoor', 'Gupta', 'Joshi', 'Kulkarni', 'Reddy'];
  const schools = ['Delhi Public School', 'Ryan International', 'Podar International', 'Kendriya Vidyalaya', 'Don Bosco', 'St. Marys High School'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Rajasthan'];
  const districts = ['Pune', 'Nashik', 'Mumbai', 'Jaipur', 'Surat', 'Bangalore'];

  return Array.from({ length: count }, (_, i) => {
    const age = Math.floor(Math.random() * (12 - 5 + 1)) + 5; // ages 5-12
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const faceId = Math.floor(Math.random() * 80) + 1;
    
    // Generate metric based on type
    let metricValue = '';
    if (metricType === 'Timing') {
      const minutes = Math.floor(Math.random() * 2);
      const seconds = Math.floor(Math.random() * 40) + 20;
      metricValue = `${minutes}:${seconds}s`;
    } else if (metricType === 'Score') {
      metricValue = (Math.random() * (100 - 80) + 80).toFixed(1) + '/100';
    }

    return {
      id: `${categoryName}-${i + 1}`,
      rank: i + 1,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      age: age,
      dob: generateDOB(age),
      school: schools[Math.floor(Math.random() * schools.length)],
      state: states[Math.floor(Math.random() * states.length)],
      district: districts[Math.floor(Math.random() * districts.length)],
      taluka: 'Central',
      air: i + 1, // All India Rank
      metric: metricValue,
      photo: `https://randomuser.me/api/portraits/${gender}/${faceId}.jpg`
    };
  });
};

export const programsData = {
  athletic: {
    title: 'ATHLETIC PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'India’s premier grassroot athletics ranking platform focusing on speed, stamina, and agility.',
    metricName: 'Timing',
    participants: generateParticipants('athletic', 30, 'Timing')
  },
  cycling: {
    title: 'CYCLING PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Professional cycling rankings for young kids across 3-wheel and 2-wheel categories.',
    metricName: 'Timing',
    participants: generateParticipants('cycling', 30, 'Timing')
  },
  skating: {
    title: 'SKATING PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Quad and Inline skating competitions tracking speed and technique.',
    metricName: 'Timing',
    participants: generateParticipants('skating', 30, 'Timing')
  },
  dancer: {
    title: 'DANCE PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Showcasing extraordinary rhythm and grace. Ranked by professional judges.',
    metricName: 'Score',
    participants: generateParticipants('dancer', 30, 'Score')
  },
  artist: {
    title: 'ARTIST PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Celebrating creativity in coloring, drawing, and painting among young artists.',
    metricName: 'Score',
    participants: generateParticipants('artist', 30, 'Score')
  },
  musician: {
    title: 'MUSICIAN PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Vocal and instrumental talent evaluation for the next generation of musical prodigies.',
    metricName: 'Score',
    participants: generateParticipants('musician', 30, 'Score')
  }
};
