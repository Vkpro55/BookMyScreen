import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";
import banner4 from "../assets/banner4.avif";
import m1 from "../assets/m1.avif";
import m2 from "../assets/m2.avif";
import m3 from "../assets/m3.avif";
import m4 from "../assets/m4.avif";
import m5 from "../assets/m5.avif";
import m6 from "../assets/m6.avif";
import m7 from "../assets/m7.avif";
import m8 from "../assets/m8.avif";
import m9 from "../assets/m9.avif";
import m10 from "../assets/m10.avif";
import e1 from "../assets/e1.avif";
import e2 from "../assets/e2.avif";
import e3 from "../assets/e3.avif";
import e4 from "../assets/e4.avif";
import e5 from "../assets/e5.avif";

export const banners: string[] = [banner1, banner2, banner3, banner4];

export const movies = [
  {
    id: 1,
    title: "Maa",
    genre: "Fantasy/Horror/Mythological/Thriller",
    rating: 7.2,
    votes: "2.7K",
    img: m1,
    promoted: true,
  },
  {
    id: 2,
    title: "Kannappa",
    genre: "Action/Drama/Fantasy/Period",
    rating: 7.3,
    votes: "10.7K",
    img: m2,
    promoted: true,
  },
  {
    id: 3,
    title: "Mission: Impossible - The Final Reckoning",
    genre: "Action/Adventure/Thriller",
    rating: 8.6,
    votes: "84.1K",
    img: m3,
  },
  {
    id: 4,
    title: "F1: The Movie",
    genre: "Action/Drama/Sports",
    rating: 9.5,
    votes: "6.8K",
    img: m4,
  },
  {
    id: 5,
    title: "From the World of John Wick: Ballerina",
    genre: "Action/Thriller",
    rating: 8.7,
    votes: "15.2K",
    img: m5,
  },
  //  {
  //     "id": 6,
  //     "title": "M3GAN 2.0",
  //     "genre": "Horror/Sci-Fi/Thriller",
  //     "rating": 8.4,
  //     "votes": "117",
  //     "img": m6
  //   },
  //   {
  //     "id": 7,
  //     "title": "Housefull 5",
  //     "genre": "Comedy/Thriller",
  //     "rating": 6.1,
  //     "votes": "56.3K",
  //     "img": m7
  //   },
  //   {
  //     "id": 8,
  //     "title": "Sitaare Zameen Par",
  //     "genre": "Comedy/Drama/Sports",
  //     "rating": 8.5,
  //     "votes": "39.6K",
  //     "img": m8
  //   },
  //   {
  //     "id": 9,
  //     "title": "Naruto the Movie: Ninja Clash in the Land of Snow",
  //     "genre": "Action/Adventure/Animation/Comedy",
  //     "rating": 9.6,
  //     "votes": "51",
  //     "img": m9
  //   },
  //   {
  //     "id": 10,
  //     "title": "28 Years Later",
  //     "genre": "Horror/Thriller",
  //     "rating": 7.9,
  //     "votes": "3.7K",
  //     "img": m10
  //   }
];

export const events = [
  {
    title: "COMEDY SHOWS",
    subtitle: "205+ Events",
    img: e1,
  },
  {
    title: "AMUSEMENT PARK",
    subtitle: "20+ Events",
    img: e2,
  },
  {
    title: "THEATRE SHOWS",
    subtitle: "80+ Events",
    img: e3,
  },
  {
    title: "KIDS",
    subtitle: "25+ Events",
    img: e4,
  },
  {
    title: "ADVENTURE & FUN",
    subtitle: "10+ Events",
    img: e5,
  },
];

export const languages = [
  "Hindi",
  "English",
  "English 7D",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Japanese",
  "Telugu",
];

export const allMovies = [
  {
    id: 1,
    title: "Maa",
    genre: "Fantasy/Horror/Mythological/Thriller",
    rating: 7.2,
    votes: "2.7K",
    img: m1,
    promoted: true,
    languages: "Hindi",
    age: "UA16+",
  },
  {
    id: 2,
    title: "Kannappa",
    genre: "Action/Drama/Fantasy/Period",
    rating: 7.3,
    votes: "10.7K",
    img: m2,
    promoted: true,
    languages: "Telugu, Hindi, Tamil, Malayalam",
    age: "UA13+",
  },
  {
    id: 3,
    title: "Mission: Impossible - The Final Reckoning",
    genre: "Action/Adventure/Thriller",
    rating: 8.6,
    votes: "84.1K",
    img: m3,
    languages: "English, Hindi, Telugu, Tamil",
    age: "UA13+",
  },
  {
    id: 4,
    title: "F1: The Movie",
    genre: "Action/Drama/Sports",
    rating: 9.5,
    votes: "6.8K",
    img: m4,
    languages: "English, Hindi, Tamil, Telugu",
    age: "UA16+",
  },
  {
    id: 5,
    title: "From the World of John Wick: Ballerina",
    genre: "Action/Thriller",
    rating: 8.7,
    votes: "15.2K",
    img: m5,
    languages: "English",
    age: "A",
  },
  {
    id: 6,
    title: "M3GAN 2.0",
    genre: "Horror/Sci-Fi/Thriller",
    rating: 8.4,
    votes: "117",
    img: m6,
    languages: "English, Hindi",
    age: "UA16+",
  },
  {
    id: 7,
    title: "Housefull 5",
    genre: "Comedy/Thriller",
    rating: 6.1,
    votes: "56.3K",
    img: m7,
    languages: "Hindi",
    age: "U",
  },
  {
    id: 8,
    title: "Sitaare Zameen Par",
    genre: "Comedy/Drama/Sports",
    rating: 8.5,
    votes: "39.6K",
    img: m8,
    languages: "Hindi",
    age: "U",
  },
  {
    id: 9,
    title: "Naruto the Movie: Ninja Clash in the Land of Snow",
    genre: "Action/Adventure/Animation/Comedy",
    rating: 9.6,
    votes: "51",
    img: m9,
    languages: "Japanese, Hindi",
    age: "UA",
  },
  {
    id: 10,
    title: "28 Years Later",
    genre: "Horror/Thriller",
    rating: 7.9,
    votes: "3.7K",
    img: m10,
    languages: "English",
    age: "A",
  },
];
