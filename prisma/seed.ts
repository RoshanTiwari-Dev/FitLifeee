import { PrismaClient, PlanTier } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  
  // Clean in reverse dependency order
  await prisma.workoutExercise.deleteMany({});
  await prisma.workoutLog.deleteMany({});
  await prisma.fitnessGoal.deleteMany({});
  await prisma.progressEntry.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.gymLocation.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.workoutPlan.deleteMany({});

  console.log("Database cleaned. Seeding started...");

  // 1. Seed Core Subscription Plans
  console.log("Seeding plans...");
  const plans = [
    {
      name: "Silver Pass",
      slug: "silver-pass",
      price: 999.0,
      duration: 1,
      tier: PlanTier.SILVER,
      description: "Perfect for beginners looking to start their fitness journey.",
      features: JSON.stringify([
        "Access to your selected Home Gym branch",
        "Standard cardio & strength equipment",
        "Free locker room & shower access",
        "Basic workout plans catalog",
        "WiFi access"
      ]),
      popular: false,
      active: true,
    },
    {
      name: "Gold All-Access",
      slug: "gold-all-access",
      price: 1999.0,
      duration: 1,
      tier: PlanTier.GOLD,
      description: "Our most popular tier. Work out anywhere in India, anytime.",
      features: JSON.stringify([
        "All-India gym access (25+ locations)",
        "Premium equipment & free weights area",
        "Unlimited group classes (Yoga, Zumba, HIIT)",
        "Digital Gym Card & mobile app tracking",
        "Steam room & sauna access",
        "1 Free body composition analysis per month"
      ]),
      popular: true,
      active: true,
    },
    {
      name: "Platinum Elite",
      slug: "platinum-elite",
      price: 3499.0,
      duration: 1,
      tier: PlanTier.PLATINUM,
      description: "The ultimate fitness experience with dedicated coaching and nutrition.",
      features: JSON.stringify([
        "All-India gym access (25+ locations)",
        "4 Sessions with a Certified Personal Trainer/mo",
        "Customized diet & nutrition plan",
        "VIP locker room & towel service",
        "Complimentary healthy juice/shake per day",
        "Unlimited guest passes (1 check-in per visit)"
      ]),
      popular: false,
      active: true,
    }
  ];

  const createdPlans = [];
  for (const plan of plans) {
    const p = await prisma.plan.create({ data: plan });
    createdPlans.push(p);
  }
  console.log(`Seeded ${createdPlans.length} plans.`);

  // 2. Seed 21+ Exercises
  console.log("Seeding exercises...");
  const exercisesData = [
    // Chest
    {
      name: "Flat Barbell Bench Press",
      slug: "flat-barbell-bench-press",
      muscleGroup: "Chest",
      equipment: "Barbell",
      difficulty: "Intermediate",
      instructions: "Lie flat on a bench, grip the barbell slightly wider than shoulder-width, unrack, and lower it to your mid-chest. Press the bar back up until your arms are fully extended.",
      tips: JSON.stringify([
        "Keep your feet flat on the floor for stability",
        "Do not bounce the bar off your chest",
        "Retract your shoulder blades to protect your joints"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Incline Dumbbell Press",
      slug: "incline-dumbbell-press",
      muscleGroup: "Chest",
      equipment: "Dumbbells",
      difficulty: "Intermediate",
      instructions: "Set a bench to a 30-45 degree incline. Hold a dumbbell in each hand, start with weights at chest level, and press them straight up over your upper chest until lock-out.",
      tips: JSON.stringify([
        "Control the descent slowly (2-3 seconds)",
        "Keep elbows tucked at a 45-degree angle",
        "Squeeze chest muscles at the top"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Cable Crossover",
      slug: "cable-crossover",
      muscleGroup: "Chest",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      instructions: "Stand in the middle of a dual cable machine with handles set high. Take a step forward, lean slightly, and pull the cables down and together in an arc in front of your waist.",
      tips: JSON.stringify([
        "Keep a slight bend in your elbows throughout",
        "Focus on stretching the chest at the starting position",
        "Engage your core to prevent swinging"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80"
    },
    // Back
    {
      name: "Pull-Ups",
      slug: "pull-ups",
      muscleGroup: "Back",
      equipment: "Bodyweight",
      difficulty: "Intermediate",
      instructions: "Grasp a pull-up bar with an overhand grip, slightly wider than shoulder-width. Pull your body upward until your chin clears the bar, then slowly lower back down.",
      tips: JSON.stringify([
        "Avoid swinging or using momentum (kipping)",
        "Engage your lats by imagining pulling your elbows down",
        "If too difficult, use an assistant band"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Bent-Over Barbell Row",
      slug: "bent-over-barbell-row",
      muscleGroup: "Back",
      equipment: "Barbell",
      difficulty: "Intermediate",
      instructions: "Hold a barbell with a shoulder-width overhand grip, hinge forward at the hips with knees slightly bent. Pull the bar to your lower ribs, squeezing your shoulder blades at the top.",
      tips: JSON.stringify([
        "Keep your spine neutral (flat back) to avoid injury",
        "Pull with your elbows, not your wrists",
        "Look slightly ahead on the floor, not up at the mirror"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Wide-Grip Lat Pulldown",
      slug: "wide-grip-lat-pulldown",
      muscleGroup: "Back",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      instructions: "Sit at a lat pulldown machine, grip the wide bar with a wider-than-shoulder-width grip. Pull the bar down to your upper chest while leaning back slightly.",
      tips: JSON.stringify([
        "Do not pull the bar behind your neck",
        "Control the upward path to stretch your lats",
        "Keep shoulders down and chest proud"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80"
    },
    // Shoulders
    {
      name: "Overhead Barbell Press",
      slug: "overhead-barbell-press",
      muscleGroup: "Shoulders",
      equipment: "Barbell",
      difficulty: "Intermediate",
      instructions: "Clean a barbell to your collarbone or unrack it at shoulder height. Press the bar straight up overhead, extending your arms and pushing your head forward slightly at lockout.",
      tips: JSON.stringify([
        "Squeeze your glutes and core to stabilize your spine",
        "Keep wrists stacked straight over elbows",
        "Lower the bar under control back to your upper chest"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Dumbbell Lateral Raise",
      slug: "dumbbell-lateral-raise",
      muscleGroup: "Shoulders",
      equipment: "Dumbbells",
      difficulty: "Beginner",
      instructions: "Stand holding dumbbells at your sides. Keeping a slight bend in elbows, raise the weights out to the sides until your arms are parallel to the floor, then lower slowly.",
      tips: JSON.stringify([
        "Lead the movement with your elbows, not your hands",
        "Avoid shrugging or using trap muscles",
        "Keep a tiny forward tilt at the top"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Cable Face Pull",
      slug: "cable-face-pull",
      muscleGroup: "Shoulders",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      instructions: "Set a pulley at upper-chest height with a rope attachment. Pull the handles toward your face, splitting the rope, while flaring your elbows and rotating your hands back.",
      tips: JSON.stringify([
        "Focus on squeezing the rear delts and upper back",
        "Hold the contraction for 1-2 seconds",
        "Do not use excessive weight that forces you to lean back"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80"
    },
    // Legs
    {
      name: "Barbell Back Squat",
      slug: "barbell-back-squat",
      muscleGroup: "Legs",
      equipment: "Barbell",
      difficulty: "Intermediate",
      instructions: "Rest a barbell on your upper back traps, feet shoulder-width apart. Squat down by hinging your hips back and bending knees until thighs are parallel to the floor. Push through heels to stand.",
      tips: JSON.stringify([
        "Keep your knees aligned over your toes",
        "Maintain a straight, upright chest",
        "Brace your core before descending"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Romanian Deadlift (RDL)",
      slug: "romanian-deadlift",
      muscleGroup: "Legs",
      equipment: "Barbell",
      difficulty: "Intermediate",
      instructions: "Stand holding a barbell. Hinge at your hips, pushing your butt back, and slide the bar down your thighs while keeping knees slightly bent. Lower until you feel a hamstrings stretch, then return.",
      tips: JSON.stringify([
        "Keep the barbell close to your legs at all times",
        "Keep your back flat and neck aligned with spine",
        "Squeeze glutes at the top of the movement"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Leg Press",
      slug: "leg-press",
      muscleGroup: "Legs",
      equipment: "Machine",
      difficulty: "Beginner",
      instructions: "Sit in the leg press machine, place feet shoulder-width on the platform. Release safety locks, lower the platform by bending knees to 90 degrees, and press it back up.",
      tips: JSON.stringify([
        "Do not lock out your knees at the top",
        "Ensure your lower back stays pressed flat against the seat",
        "Do not let your knees cave inward"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    // Arms
    {
      name: "Barbell Bicep Curl",
      slug: "barbell-bicep-curl",
      muscleGroup: "Arms",
      equipment: "Barbell",
      difficulty: "Beginner",
      instructions: "Stand holding a barbell with an underhand grip. Keep elbows close to your torso, curl the bar up toward shoulders by contracting your biceps, then lower it slowly to the start.",
      tips: JSON.stringify([
        "Avoid swinging the body to lift the weight",
        "Keep elbows fixed at your sides",
        "Lower the bar all the way down for a full range of motion"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Dumbbell Hammer Curl",
      slug: "dumbbell-hammer-curl",
      muscleGroup: "Arms",
      equipment: "Dumbbells",
      difficulty: "Beginner",
      instructions: "Stand with dumbbells in hands, palms facing each other (neutral grip). Keeping elbows tucked, curl the weights up to shoulders and slowly lower back down.",
      tips: JSON.stringify([
        "Squeeze the forearms and outer biceps at the top",
        "Control both the lift and the drop",
        "Can be performed alternating arms or together"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Tricep Rope Pushdown",
      slug: "tricep-rope-pushdown",
      muscleGroup: "Arms",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      instructions: "Attach a rope to a high pulley. Hold rope ends, start with elbows bent at 90 degrees, and push the rope down by extending elbows, flaring the rope outward at the bottom.",
      tips: JSON.stringify([
        "Keep elbows pinned to your ribs",
        "Squeeze triceps at the bottom lockout",
        "Keep your wrists straight"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Overhead Dumbbell Extension",
      slug: "overhead-dumbbell-extension",
      muscleGroup: "Arms",
      equipment: "Dumbbells",
      difficulty: "Beginner",
      instructions: "Sit or stand, holding a heavy dumbbell vertically in both hands overhead. Lower the weight behind your head by bending elbows, then push it back up to the start.",
      tips: JSON.stringify([
        "Keep elbows pointed forward, not flared out",
        "Keep core tight to prevent lower back arching",
        "Lower under control to avoid hitting your neck"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    // Core
    {
      name: "Hanging Leg Raise",
      slug: "hanging-leg-raise",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "Advanced",
      instructions: "Hang from a pull-up bar. Keeping legs straight, lift them up in front of you until they are parallel to the floor or higher, then lower them slowly back down.",
      tips: JSON.stringify([
        "Control the speed to minimize body swing",
        "Focus on flexing the pelvis upward to activate abs",
        "Bend knees if straight legs is too difficult"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Plank",
      slug: "plank",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      instructions: "Place forearms on the floor parallel, toes tucked, and raise body into a straight line from head to heels. Hold this position by contracting your core.",
      tips: JSON.stringify([
        "Do not let your hips sag down or rise up",
        "Keep neck in a neutral alignment",
        "Squeeze glutes and quads for extra stability"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Cable Crunch",
      slug: "cable-crunch",
      muscleGroup: "Core",
      equipment: "Cable Machine",
      difficulty: "Intermediate",
      instructions: "Kneel beneath a high pulley with a rope attachment. Hold rope ends by your ears, and flex your spine to pull elbows down towards your knees, contracting your abs.",
      tips: JSON.stringify([
        "Hinge at the spine, not the hips (keep hips stationary)",
        "Exhale fully and squeeze abs at the bottom",
        "Do not pull with your arms, use your core"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80"
    },
    // Full Body
    {
      name: "Kettlebell Swing",
      slug: "kettlebell-swing",
      muscleGroup: "Full Body",
      equipment: "Kettlebell",
      difficulty: "Intermediate",
      instructions: "Stand with feet shoulder-width, holding a kettlebell. Hinge at hips to swing the kettlebell between legs, then snap hips forward forcefully to swing it up to eye level.",
      tips: JSON.stringify([
        "This is a hip hinge, not a squat",
        "Keep arms relaxed, the power comes from glutes and hips",
        "Keep back flat and core locked throughout"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Burpees",
      slug: "burpees",
      muscleGroup: "Full Body",
      equipment: "Bodyweight",
      difficulty: "Intermediate",
      instructions: "From standing, squat down, jump feet back into a push-up position, perform a push-up, jump feet back forward to hands, and jump explosively into the air with hands up.",
      tips: JSON.stringify([
        "Keep a steady breathing rhythm",
        "Land softly on your feet during jumps",
        "Modify by removing the push-up if fatigue sets in"
      ]),
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const createdExercises = [];
  for (const ex of exercisesData) {
    const e = await prisma.exercise.create({ data: ex });
    createdExercises.push(e);
  }
  console.log(`Seeded ${createdExercises.length} exercises.`);

  // 3. Seed 8+ Workout Plans
  console.log("Seeding workout plans...");
  const workoutPlansData = [
    {
      name: "Full Body Blast",
      slug: "full-body-blast",
      category: "Full Body",
      difficulty: "Beginner",
      duration: 45,
      calories: 400,
      description: "An intensive full-body routine designed for beginners to build conditioning and burn calories.",
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      featured: true,
      exercises: [
        { slug: "barbell-back-squat", sets: 3, reps: "10", restSeconds: 90 },
        { slug: "flat-barbell-bench-press", sets: 3, reps: "10", restSeconds: 90 },
        { slug: "wide-grip-lat-pulldown", sets: 3, reps: "12", restSeconds: 60 },
        { slug: "plank", sets: 3, reps: "60 seconds", restSeconds: 60 },
        { slug: "burpees", sets: 3, reps: "10", restSeconds: 60 }
      ]
    },
    {
      name: "Upper Body Power",
      slug: "upper-body-power",
      category: "Strength",
      difficulty: "Intermediate",
      duration: 60,
      calories: 450,
      description: "Focus on building a strong, powerful chest, back, and shoulders with complex lifts.",
      imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=800&q=80",
      featured: true,
      exercises: [
        { slug: "flat-barbell-bench-press", sets: 4, reps: "8", restSeconds: 120 },
        { slug: "bent-over-barbell-row", sets: 4, reps: "8", restSeconds: 120 },
        { slug: "overhead-barbell-press", sets: 3, reps: "8", restSeconds: 90 },
        { slug: "pull-ups", sets: 3, reps: "to failure", restSeconds: 90 },
        { slug: "dumbbell-lateral-raise", sets: 3, reps: "12", restSeconds: 60 }
      ]
    },
    {
      name: "Leg Day Destroyer",
      slug: "leg-day-destroyer",
      category: "Legs",
      difficulty: "Advanced",
      duration: 65,
      calories: 550,
      description: "An advanced, high-volume leg routine targeting quads, hamstrings, and glutes.",
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      featured: false,
      exercises: [
        { slug: "barbell-back-squat", sets: 4, reps: "8", restSeconds: 120 },
        { slug: "romanian-deadlift", sets: 4, reps: "10", restSeconds: 90 },
        { slug: "leg-press", sets: 3, reps: "12", restSeconds: 90 }
      ]
    },
    {
      name: "Push Day Workout",
      slug: "push-day",
      category: "Strength",
      difficulty: "Intermediate",
      duration: 50,
      calories: 400,
      description: "Classic push split focusing on pushing muscles: Chest, Shoulders, and Triceps.",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      featured: false,
      exercises: [
        { slug: "flat-barbell-bench-press", sets: 3, reps: "8", restSeconds: 90 },
        { slug: "incline-dumbbell-press", sets: 3, reps: "10", restSeconds: 90 },
        { slug: "overhead-barbell-press", sets: 3, reps: "8", restSeconds: 90 },
        { slug: "tricep-rope-pushdown", sets: 3, reps: "12", restSeconds: 60 },
        { slug: "overhead-dumbbell-extension", sets: 3, reps: "10", restSeconds: 60 }
      ]
    },
    {
      name: "Pull Day Workout",
      slug: "pull-day",
      category: "Strength",
      difficulty: "Intermediate",
      duration: 50,
      calories: 380,
      description: "Classic pull routine focusing on pulling muscles: Back, Biceps, and Rear Delts.",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      featured: false,
      exercises: [
        { slug: "pull-ups", sets: 3, reps: "to failure", restSeconds: 90 },
        { slug: "bent-over-barbell-row", sets: 3, reps: "10", restSeconds: 90 },
        { slug: "wide-grip-lat-pulldown", sets: 3, reps: "12", restSeconds: 60 },
        { slug: "barbell-bicep-curl", sets: 3, reps: "10", restSeconds: 60 },
        { slug: "dumbbell-hammer-curl", sets: 3, reps: "12", restSeconds: 60 }
      ]
    },
    {
      name: "HIIT Fat Burner",
      slug: "hiit-fat-burner",
      category: "Cardio",
      difficulty: "Beginner",
      duration: 30,
      calories: 350,
      description: "Fast-paced, high-intensity intervals designed to burn maximum fat and improve endurance.",
      imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
      featured: true,
      exercises: [
        { slug: "burpees", sets: 4, reps: "45 seconds work", restSeconds: 15 },
        { slug: "kettlebell-swing", sets: 4, reps: "45 seconds work", restSeconds: 15 },
        { slug: "burpees", sets: 4, reps: "30 seconds work", restSeconds: 30 }
      ]
    },
    {
      name: "Core Crusher",
      slug: "core-crusher",
      category: "Core",
      difficulty: "Beginner",
      duration: 20,
      calories: 180,
      description: "Quick, effective abdominal workout that builds deep core stability and six-pack aesthetics.",
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      featured: false,
      exercises: [
        { slug: "hanging-leg-raise", sets: 3, reps: "12", restSeconds: 45 },
        { slug: "cable-crunch", sets: 3, reps: "15", restSeconds: 45 },
        { slug: "plank", sets: 3, reps: "60 seconds hold", restSeconds: 45 }
      ]
    },
    {
      name: "Arms & Shoulders Hypertrophy",
      slug: "arms-shoulders-hypertrophy",
      category: "Strength",
      difficulty: "Advanced",
      duration: 55,
      calories: 390,
      description: "Focused hypertrophy session to pump up the shoulders, biceps, and triceps.",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      featured: false,
      exercises: [
        { slug: "overhead-barbell-press", sets: 3, reps: "8", restSeconds: 90 },
        { slug: "dumbbell-lateral-raise", sets: 4, reps: "12", restSeconds: 45 },
        { slug: "barbell-bicep-curl", sets: 3, reps: "10", restSeconds: 60 },
        { slug: "tricep-rope-pushdown", sets: 3, reps: "12", restSeconds: 60 },
        { slug: "dumbbell-hammer-curl", sets: 3, reps: "10", restSeconds: 60 }
      ]
    }
  ];

  for (const wp of workoutPlansData) {
    const plan = await prisma.workoutPlan.create({
      data: {
        name: wp.name,
        slug: wp.slug,
        category: wp.category,
        difficulty: wp.difficulty,
        duration: wp.duration,
        calories: wp.calories,
        description: wp.description,
        imageUrl: wp.imageUrl,
        featured: wp.featured,
      }
    });

    // Seed connector mappings
    for (let index = 0; index < wp.exercises.length; index++) {
      const exerciseItem = wp.exercises[index];
      const matchEx = createdExercises.find(e => e.slug === exerciseItem.slug);
      if (matchEx) {
        await prisma.workoutExercise.create({
          data: {
            workoutPlanId: plan.id,
            exerciseId: matchEx.id,
            sets: exerciseItem.sets,
            reps: exerciseItem.reps,
            restSeconds: exerciseItem.restSeconds,
            order: index + 1
          }
        });
      }
    }
  }
  console.log("Seeded workout plans and exercises associations.");

  // 4. Seed 25+ Gym Locations across major Indian cities
  console.log("Seeding gym locations...");
  const citiesLocations = [
    { name: "FiTLiFe Platinum - Bandra", city: "Mumbai", state: "Maharashtra", address: "3rd Floor, Link Square Mall, Linking Rd, Bandra West", lat: 19.0607, lng: 72.8361, rating: 4.8 },
    { name: "FiTLiFe Gold - Andheri", city: "Mumbai", state: "Maharashtra", address: "Premium Hub, Veera Desai Rd, Andheri West", lat: 19.1363, lng: 72.8293, rating: 4.6 },
    { name: "FiTLiFe Elite - Connaught Place", city: "Delhi", state: "Delhi", address: "Block E, Inner Circle, Connaught Place", lat: 28.6304, lng: 77.2177, rating: 4.7 },
    { name: "FiTLiFe Gold - Saket", city: "Delhi", state: "Delhi", address: "Select Citywalk Office Block, Saket", lat: 28.5287, lng: 77.2195, rating: 4.5 },
    { name: "FiTLiFe Platinum - Indiranagar", city: "Bengaluru", state: "Karnataka", address: "100 Feet Road, Near HAL 2nd Stage, Indiranagar", lat: 12.9719, lng: 77.6412, rating: 4.9 },
    { name: "FiTLiFe Gold - Koramangala", city: "Bengaluru", state: "Karnataka", address: "80 Feet Rd, 4th Block, Koramangala", lat: 12.9338, lng: 77.6244, rating: 4.6 },
    { name: "FiTLiFe Elite - Koregaon Park", city: "Pune", state: "Maharashtra", address: "Plaza Towers, Lane 5, Koregaon Park", lat: 18.5362, lng: 73.8930, rating: 4.8 },
    { name: "FiTLiFe Gold - Kothrud", city: "Pune", state: "Maharashtra", address: "DP Road, Near Karishma Society, Kothrud", lat: 18.5074, lng: 73.8077, rating: 4.4 },
    { name: "FiTLiFe Platinum - Jubilee Hills", city: "Hyderabad", state: "Telangana", address: "Road No. 36, Near Metro Station, Jubilee Hills", lat: 17.4300, lng: 78.4075, rating: 4.9 },
    { name: "FiTLiFe Gold - Gachibowli", city: "Hyderabad", state: "Telangana", address: "Financial District Main Rd, Gachibowli", lat: 17.4401, lng: 78.3489, rating: 4.7 },
    { name: "FiTLiFe Platinum - Nungambakkam", city: "Chennai", state: "Tamil Nadu", address: "Khader Nawaz Khan Rd, Nungambakkam", lat: 13.0605, lng: 80.2513, rating: 4.8 },
    { name: "FiTLiFe Gold - Adyar", city: "Chennai", state: "Tamil Nadu", address: "Sardar Patel Rd, Kasturba Nagar, Adyar", lat: 13.0063, lng: 80.2574, rating: 4.5 },
    { name: "FiTLiFe Platinum - CG Road", city: "Ahmedabad", state: "Gujarat", address: "Shital Varsha Mall, C.G. Road, Navrangpura", lat: 23.0270, lng: 72.5621, rating: 4.7 },
    { name: "FiTLiFe Gold - Satellite", city: "Ahmedabad", state: "Gujarat", address: "Dev Arc Mall, S.G. Highway, Satellite", lat: 23.0238, lng: 72.5074, rating: 4.5 },
    { name: "FiTLiFe Elite - Salt Lake", city: "Kolkata", state: "West Bengal", address: "Sector V, Block EP & GP, Salt Lake City", lat: 22.5726, lng: 88.4339, rating: 4.6 },
    { name: "FiTLiFe Gold - Ballygunge", city: "Kolkata", state: "West Bengal", address: "Rash Behari Avenue, Ballygunge", lat: 22.5208, lng: 88.3662, rating: 4.5 },
    { name: "FiTLiFe Platinum - DLF Phase 3", city: "Gurugram", state: "Haryana", address: "Cyber City Horizon Tower, DLF Phase 3", lat: 28.4901, lng: 77.0805, rating: 4.9 },
    { name: "FiTLiFe Gold - Sector 45", city: "Gurugram", state: "Haryana", address: "Unitech Cyber Park, Sector 45", lat: 28.4410, lng: 77.0543, rating: 4.4 },
    { name: "FiTLiFe Elite - Sector 62", city: "Noida", state: "Uttar Pradesh", address: "Stellar IT Park, Sector 62", lat: 28.6273, lng: 77.3725, rating: 4.6 },
    { name: "FiTLiFe Gold - C-Scheme", city: "Jaipur", state: "Rajasthan", address: "MGF Metropolitan Mall, C-Scheme", lat: 26.9075, lng: 75.8055, rating: 4.5 },
    { name: "FiTLiFe Elite - Sector 17", city: "Chandigarh", state: "Punjab", address: "Bridge Road, Sector 17-D", lat: 30.7421, lng: 76.7790, rating: 4.7 },
    { name: "FiTLiFe Gold - Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", address: "Riverside Mall, Vipin Khand, Gomti Nagar", lat: 26.8529, lng: 80.9736, rating: 4.6 },
    { name: "FiTLiFe Gold - Vijay Nagar", city: "Indore", state: "Madhya Pradesh", address: "C21 Mall, AB Road, Vijay Nagar", lat: 22.7533, lng: 75.8937, rating: 4.5 },
    { name: "FiTLiFe Gold - Maharana Pratap Nagar", city: "Bhopal", state: "Madhya Pradesh", address: "Zone-I, M.P. Nagar", lat: 23.2324, lng: 77.4326, rating: 4.4 },
    { name: "FiTLiFe Gold - Ramdaspeth", city: "Nagpur", state: "Maharashtra", address: "Central Bazaar Road, Ramdaspeth", lat: 21.1388, lng: 79.0762, rating: 4.4 },
    { name: "FiTLiFe Gold - VIP Road", city: "Visakhapatnam", state: "Andhra Pradesh", address: "VIP Road, Siripuram", lat: 17.7230, lng: 83.3150, rating: 4.5 }
  ];

  const amenitiesList = [
    ["WiFi", "Cardio Zone", "CrossFit Area", "Locker Room", "Shower"],
    ["WiFi", "Cardio Zone", "CrossFit Area", "Locker Room", "Steam Bath", "Juice Bar", "Personal Trainers"],
    ["WiFi", "Cardio Zone", "CrossFit Area", "Locker Room", "Steam Bath", "Sauna", "Swimming Pool", "Diet Cafe", "Personal Trainers"]
  ];

  let locationCount = 0;
  for (let i = 0; i < citiesLocations.length; i++) {
    const loc = citiesLocations[i];
    
    // Distribute amenities based on rating or cycle them
    let selectedAmenities = amenitiesList[0];
    if (loc.rating >= 4.8) {
      selectedAmenities = amenitiesList[2]; // Premium
    } else if (loc.rating >= 4.6) {
      selectedAmenities = amenitiesList[1]; // Mid
    }

    await prisma.gymLocation.create({
      data: {
        name: loc.name,
        city: loc.city,
        state: loc.state,
        address: loc.address,
        phone: `+91 ${9000000000 + i}`,
        email: `contact.${loc.city.toLowerCase().replace(/\s+/g, "")}@fitlifegym.in`,
        lat: loc.lat,
        lng: loc.lng,
        amenities: JSON.stringify(selectedAmenities),
        timings: "05:00 AM - 10:00 PM (Mon-Sat), 06:00 AM - 08:00 PM (Sun)",
        rating: loc.rating,
        active: true,
        imageUrl: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80`
      }
    });
    locationCount++;
  }
  console.log(`Seeded ${locationCount} gym locations.`);

  console.log("Database Seeding successfully completed!");
}

main()
  .catch((e) => {
    console.error("Error while seeding: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
