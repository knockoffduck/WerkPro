import { databases, APPWRITE_CONFIG, tablesDB } from './appwrite';
import { ID } from 'appwrite';

export const DEFAULT_EXERCISES = [
  {
    "name": "Barbell Back Squat",
    "target_body_part": "Legs (Quads/Glutes)",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Barbell Deadlift",
    "target_body_part": "Posterior Chain",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Barbell Bench Press",
    "target_body_part": "Chest",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Standing Overhead Press",
    "target_body_part": "Shoulders",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Leg Press (Plate Loaded)",
    "target_body_part": "Legs",
    "category": "Strength - Machine"
  },
  {
    "name": "Hack Squat",
    "target_body_part": "Legs (Quads)",
    "category": "Strength - Machine"
  },
  {
    "name": "Lat Pulldown",
    "target_body_part": "Back (Lats)",
    "category": "Strength - Machine"
  },
  {
    "name": "Seated Cable Row",
    "target_body_part": "Back",
    "category": "Strength - Machine"
  },
  {
    "name": "Dumbbell Chest Press",
    "target_body_part": "Chest",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Dumbbell Bicep Curl",
    "target_body_part": "Arms (Biceps)",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Tricep Rope Pushdown",
    "target_body_part": "Arms (Triceps)",
    "category": "Strength - Cable"
  },
  {
    "name": "Sled Push",
    "target_body_part": "Full Body / Legs",
    "category": "Functional / HIIT"
  },
  {
    "name": "Kettlebell Swing",
    "target_body_part": "Posterior Chain",
    "category": "Functional / HIIT"
  },
  {
    "name": "Battle Ropes",
    "target_body_part": "Upper Body / Cardio",
    "category": "Functional / HIIT"
  },
  {
    "name": "Box Jump",
    "target_body_part": "Legs / Explosive",
    "category": "Functional / HIIT"
  },
  {
    "name": "Assault Bike / Air Bike",
    "target_body_part": "Full Body / Cardio",
    "category": "Cardio"
  },
  {
    "name": "Concept2 Rower",
    "target_body_part": "Full Body / Cardio",
    "category": "Cardio"
  },
  {
    "name": "SkiErg",
    "target_body_part": "Upper Body / Cardio",
    "category": "Cardio"
  },
  {
    "name": "Reformer Pilates - Carriage Lunge",
    "target_body_part": "Legs / Glutes",
    "category": "Pilates (The Studio)"
  },
  {
    "name": "Reformer Pilates - The Hundred",
    "target_body_part": "Core",
    "category": "Pilates (The Studio)"
  },
  {
    "name": "Leg Extension",
    "target_body_part": "Legs (Quads)",
    "category": "Strength - Machine"
  },
  {
    "name": "Seated Leg Curl",
    "target_body_part": "Legs (Hamstrings)",
    "category": "Strength - Machine"
  },
  {
    "name": "Pec Deck / Machine Fly",
    "target_body_part": "Chest",
    "category": "Strength - Machine"
  },
  {
    "name": "Romanian Deadlift (RDL)",
    "target_body_part": "Hamstrings / Glutes",
    "category": "Strength - Free Weight"
  },
  {
    "name": "Hanging Leg Raise",
    "target_body_part": "Core",
    "category": "Strength - Bodyweight"
  }
];

export const seedExercises = async () => {
  try {
    const promises = DEFAULT_EXERCISES.map(exercise => 
      tablesDB.createRow({
        databaseId: APPWRITE_CONFIG.databaseId,
        tableId: APPWRITE_CONFIG.collections.exercises,
        rowId: ID.unique(),
        data: exercise
      })
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error seeding exercises:', error);
    return { success: false, error };
  }
};
