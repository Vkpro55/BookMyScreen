import prisma, { Format, SeatStatus } from "../prisma.js";

/* eslint-disable no-console */

// Helper to convert duration string "2h 15m" to minutes
const parseDuration = (durationStr: string): number => {
  const durationRegex = /(\d+)h\s*(?:(\d+)m)?/;
  const match = durationRegex.exec(durationStr);
  if (!match) return 120; // default to 2 hours
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
};

// Helper to generate seat categories and pricing
const generateSeatCategories = (
  totalSeats: number,
): Record<number, { category: string; price: number }> => {
  const categories: Record<number, { category: string; price: number }> = {};
  const premiumCount = Math.floor(totalSeats * 0.2); // 20% premium
  const executiveCount = Math.floor(totalSeats * 0.4); // 40% executive
  let seatNum = 1;

  // Premium seats (back rows)
  for (let i = 0; i < premiumCount; i++) {
    categories[seatNum++] = { category: "PREMIUM", price: 510 };
  }
  // Executive seats (middle)
  for (let i = 0; i < executiveCount; i++) {
    categories[seatNum++] = { category: "EXECUTIVE", price: 290 };
  }
  // Normal seats (front)
  while (seatNum <= totalSeats) {
    categories[seatNum++] = { category: "NORMAL", price: 270 };
  }

  return categories;
};

async function main(): Promise<void> {
  console.log("Cleaning database...");

  await prisma.showSeat.deleteMany();
  await prisma.show.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.row.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.movie.deleteMany();

  // Real movies data
  const moviesData = [
    {
      id: "maa",
      title: "Maa",
      description:
        "The story of a mother who becomes Kali to end a demonic curse rooted in fear, blood, and betrayal.",
      duration: parseDuration("2h 15m"),
      genre: ["Fantasy", "Horror", "Mythological", "Thriller"],
      releaseDate: new Date("2025-06-27"),
      languages: ["Hindi"],
      certification: "UA16+",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790461/jn7silixkmp7caq0gpwr.avif",
      rating: 7.2,
      votes: 2700,
      format: Format.TWO_D,
    },
    {
      id: "kannappa",
      title: "Kannappa",
      description: "The tale of Kannappa, a devoted follower of Lord Shiva.",
      duration: parseDuration("2h 30m"),
      genre: ["Action", "Mythological"],
      releaseDate: new Date("2025-08-01"),
      languages: ["Telugu", "Hindi", "Tamil", "Malayalam"],
      certification: "UA13+",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790461/fkbk6wzzxrvbn3ysrums.avif",
      rating: 7.3,
      votes: 10700,
      format: Format.TWO_D,
    },
    {
      id: "mission_impossible",
      title: "Mission: Impossible - The Final Reckoning",
      description:
        "Ethan Hunt returns for a high-stakes mission to save the world from impending doom.",
      duration: parseDuration("2h 40m"),
      genre: ["Action", "Thriller"],
      releaseDate: new Date("2025-07-18"),
      languages: ["English", "Hindi", "Telugu", "Tamil"],
      certification: "UA13+",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790462/yomilxtf8umhsqekxzvv.avif",
      rating: 8.6,
      votes: 84100,
      format: Format.IMAX,
    },
    {
      id: "f1_movie",
      title: "F1: The Movie",
      description:
        "An inside look at the world of Formula 1 racing and its iconic champions.",
      duration: parseDuration("2h"),
      genre: ["Sports", "Documentary"],
      releaseDate: new Date("2025-07-10"),
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      certification: "UA16+",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790461/psdublbrlv4crojvtzqc.avif",
      rating: 9.5,
      votes: 96800,
      format: Format.IMAX,
    },
    {
      id: "ballerina",
      title: "From the World of John Wick: Ballerina",
      description:
        "A ballerina assassin seeks revenge in the dark world of the High Table.",
      duration: parseDuration("2h 10m"),
      genre: ["Action", "Thriller"],
      releaseDate: new Date("2025-07-25"),
      languages: ["English"],
      certification: "A",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790461/pdw9hxw1xlz1abpyenzc.avif",
      rating: 8.7,
      votes: 15200,
      format: Format.TWO_D,
    },
    {
      id: "metro_in_dino",
      title: "Metro In Dino",
      description:
        "Multiple stories of love and life intertwine in the bustling metro city of Mumbai.",
      duration: parseDuration("2h 10m"),
      genre: ["Romance", "Drama"],
      releaseDate: new Date("2025-09-02"),
      languages: ["Hindi"],
      certification: "UA",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751826680/u4vtkrc4iinsiyjwqrsu.avif",
      rating: 7.5,
      votes: 8600,
      format: Format.TWO_D,
    },
    {
      id: "how_to_train_dragon",
      title: "How to Train Your Dragon: Return of Night Fury",
      description:
        "Hiccup and Toothless return for a magical journey as a new Night Fury rises.",
      duration: parseDuration("1h 45m"),
      genre: ["Animation", "Fantasy", "Adventure"],
      releaseDate: new Date("2025-09-10"),
      languages: ["English", "Hindi"],
      certification: "UA",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751826680/lkpu6rs2rxu4jckxtony.avif",
      rating: 8.8,
      votes: 32500,
      format: Format.THREE_D,
    },
    {
      id: "jurassic_park",
      title: "Jurassic Park: Rebirth",
      description:
        "Dinosaurs return in a world no longer in control — the race for survival begins anew.",
      duration: parseDuration("2h 35m"),
      genre: ["Sci-Fi", "Adventure", "Action"],
      releaseDate: new Date("2025-09-01"),
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      certification: "UA16+",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790815/kw1gearclw4vjmnkxw0o.avif",
      rating: 9.0,
      votes: 60500,
      format: Format.IMAX,
    },
    {
      id: "sitaare_zameen",
      title: "Sitaare Zameen Par",
      description:
        "A heartwarming story of a teacher who helps a dyslexic child discover the star within.",
      duration: parseDuration("2h 20m"),
      genre: ["Drama", "Family"],
      releaseDate: new Date("2025-07-12"),
      languages: ["Hindi"],
      certification: "UA",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790462/huw3x0efjerh3zxoqtaq.avif",
      rating: 8.5,
      votes: 39600,
      format: Format.TWO_D,
    },
    {
      id: "megan_2",
      title: "M3GAN 2.0",
      description:
        "M3GAN returns with upgraded AI and deadlier instincts in this spine-chilling tech horror sequel.",
      duration: parseDuration("1h 55m"),
      genre: ["Horror", "Sci-Fi", "Thriller"],
      releaseDate: new Date("2025-07-22"),
      languages: ["English", "Hindi"],
      certification: "A",
      posterUrl:
        "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751790461/zfxzrvffdu8zfled6nzt.avif",
      rating: 8.4,
      votes: 117,
      format: Format.TWO_D,
    },
  ];

  // Real theaters data
  const cities = [
    {
      name: "Mumbai",
      state: "Maharashtra",
      areas: ["Andheri", "Bandra", "Powai", "Borivali"],
    },
    {
      name: "Delhi",
      state: "Delhi",
      areas: ["Connaught Place", "Saket", "Dwarka", "Karol Bagh"],
    },
    {
      name: "Bangalore",
      state: "Karnataka",
      areas: ["Whitefield", "Koramangala", "Indiranagar", "Marathahalli"],
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      areas: ["Banjara Hills", "Gachibowli", "Madhapur", "Ameerpet"],
    },
    {
      name: "Kolkata",
      state: "West Bengal",
      areas: ["Salt Lake", "New Town", "Park Street", "Gariahat"],
    },
  ];

  const brands = ["PVR", "INOX", "Cinepolis"] as const;
  const logos = {
    PVR: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/omht27letnpbbaj2w0op.avif",
    INOX: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/yxjgnxhxlccfdon3fyzg.avif",
    Cinepolis:
      "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751788726/eebu3t34depdmmgxyknq.avif",
  } as const;

  const theatersData: {
    id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    logo: string;
  }[] = [];
  const screensByTheater: Record<string, string[]> = {};

  for (const city of cities) {
    const numTheatres = 2; // 2 theaters per city for demo
    for (let i = 0; i < numTheatres; i++) {
      const brand = brands[i % brands.length];
      const area = city.areas[i % city.areas.length] ?? "Central";
      const theaterId = `theater_${city.state.replace(/\s+/g, "_")}_${i}`;

      if (brand === undefined) continue; // skip if brand is not defined
      theatersData.push({
        id: theaterId,
        name: `${brand} ${area}`,
        location: `${area}, ${city.name}`,
        city: city.name,
        state: city.state,
        logo: logos[brand],
      });

      // Create 3 screens per theater
      screensByTheater[theaterId] = [];
      for (let s = 0; s < 3; s++) {
        screensByTheater[theaterId].push(`screen_${theaterId}_${s + 1}`);
      }
    }
  }

  const screensData = Object.entries(screensByTheater).flatMap(
    ([theaterId, screenIds]) =>
      screenIds.map((screenId, idx) => ({
        id: screenId,
        name: `Screen ${idx + 1}`,
        theaterId,
      })),
  );

  // Generate rows (A, B, C, D) and seats for each screen
  const rowLabels = ["A", "B", "C", "D"];
  const seatsPerRow = 10;
  const rowsData = screensData.flatMap((screen) =>
    rowLabels.map((label) => ({
      id: `row_${screen.id}_${label}`,
      label,
      screenId: screen.id,
    })),
  );

  const seatsData = rowsData.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, index) => ({
      id: `seat_${row.id}_${index + 1}`,
      number: index + 1,
      rowId: row.id,
    })),
  );

  // Time slots for shows
  const timeSlots = ["09:00", "12:30", "16:00", "19:00", "22:00"];

  // Generate shows
  const showsData: {
    id: string;
    movieId: string;
    screenId: string;
    startTime: Date;
    format: Format;
    audioType: string;
  }[] = [];
  const formats: Format[] = [
    Format.TWO_D,
    Format.THREE_D,
    Format.IMAX,
    Format.PVR_PXL,
  ];
  let showCounter = 0;

  for (const movie of moviesData.slice(0, 5)) {
    // Use first 5 movies for demo
    for (const theater of theatersData) {
      const theaterScreens = screensByTheater[theater.id];
      if (!theaterScreens) continue; // skip if no screens found
      for (const screenId of theaterScreens) {
        for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
          for (const slot of timeSlots) {
            const showId = `show_${showCounter++}`;
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + dayOffset);
            const [hours, minutes] = slot.split(":").map(Number);

            if (hours === undefined || minutes === undefined) continue; // skip if time parsing fails
            showDate.setHours(hours, minutes, 0, 0);

            const selectedFormat: Format =
              formats[Math.floor(Math.random() * formats.length)] ??
              Format.TWO_D;
            showsData.push({
              id: showId,
              movieId: movie.id,
              screenId,
              startTime: showDate,
              format: selectedFormat,
              audioType: Math.random() > 0.5 ? "Dolby Atmos" : "Stereo",
            });
          }
        }
      }
    }
  }

  // Create all data
  await prisma.movie.createMany({ data: moviesData });
  await prisma.theater.createMany({ data: theatersData });
  await prisma.screen.createMany({ data: screensData });
  await prisma.row.createMany({ data: rowsData });
  await prisma.seat.createMany({ data: seatsData });
  await prisma.show.createMany({ data: showsData });

  // Generate show seats with proper pricing
  const showSeatEntries: {
    id: string;
    showId: string;
    seatId: string;
    status: SeatStatus;
    price: string;
  }[] = [];
  const totalSeatsPerScreen = rowLabels.length * seatsPerRow;
  const seatCategories = generateSeatCategories(totalSeatsPerScreen);

  for (const show of showsData) {
    for (const seat of seatsData) {
      const category = seatCategories[seat.number] ?? {
        category: "NORMAL",
        price: 270,
      };
      const status =
        Math.random() > 0.7
          ? SeatStatus.BOOKED
          : Math.random() > 0.8
            ? SeatStatus.BLOCKED
            : SeatStatus.AVAILABLE;

      showSeatEntries.push({
        id: `show_seat_${show.id}_${seat.id}`,
        showId: show.id,
        seatId: seat.id,
        status,
        price: category.price.toFixed(2),
      });
    }
  }

  await prisma.showSeat.createMany({ data: showSeatEntries });

  // Log statistics
  const finalCounts = await Promise.all([
    prisma.movie.count(),
    prisma.theater.count(),
    prisma.screen.count(),
    prisma.row.count(),
    prisma.seat.count(),
    prisma.show.count(),
    prisma.showSeat.count(),
  ]);

  console.log("\n✅ Seed completed successfully:");
  console.log(`  🎬 Movies: ${finalCounts[0]}`);
  console.log(`  🏛️  Theaters: ${finalCounts[1]}`);
  console.log(`  🎥 Screens: ${finalCounts[2]}`);
  console.log(`  📊 Rows: ${finalCounts[3]}`);
  console.log(`  🪑 Seats: ${finalCounts[4]}`);
  console.log(`  🎞️  Shows: ${finalCounts[5]}`);
  console.log(`  🎫 Show Seats: ${finalCounts[6]}\n`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
