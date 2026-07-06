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
  athlete: {
    title: 'ATHLETE PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'India’s premier grassroot athletics ranking platform focusing on speed, stamina, and agility.',
    metricName: 'Timing',
    participants: generateParticipants('athlete', 30, 'Timing')
  },
  highjump: {
    title: 'HIGH JUMP PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Reaching new heights. The ultimate ranking platform for young high jumpers.',
    metricName: 'Height',
    participants: generateParticipants('highjump', 30, 'Score')
  },
  throw: {
    title: 'THROW PROGRAM',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    description: 'Showcasing strength and technique in various throwing events.',
    metricName: 'Distance',
    participants: generateParticipants('throw', 30, 'Score')
  }
};
