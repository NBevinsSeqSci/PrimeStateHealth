"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export type FluencyResult = {
  rawScore: number;
  totalEntries: number;
  validAnimals: string[];
  invalidEntries: string[];
  allEntries: string[];
  durationSeconds: number;
};

type FluencyWord = {
  text: string;
  isAnimal: boolean;
};

const ANIMAL_WORDS = new Set<string>([
  "dog", "cat", "puppy", "kitten", "hamster", "gerbil", "guinea pig", "rabbit",
  "bunny", "mouse", "rat", "parrot", "budgie", "goldfish", "canary", "cockatiel",
  "cow", "bull", "calf", "pig", "hog", "boar", "sheep", "ram", "ewe", "goat",
  "horse", "stallion", "mare", "foal", "donkey", "mule", "chicken", "hen",
  "rooster", "duck", "goose", "turkey", "lion", "tiger", "leopard", "cheetah",
  "jaguar", "panther", "cougar", "puma", "lynx", "bobcat", "wolf", "coyote",
  "fox", "bear", "grizzly", "panda", "hyena", "jackal", "elephant", "giraffe",
  "zebra", "rhino", "rhinoceros", "hippo", "hippopotamus", "buffalo", "bison",
  "antelope", "impala", "gazelle", "moose", "elk", "deer", "reindeer", "caribou",
  "monkey", "ape", "gorilla", "chimpanzee", "chimp", "orangutan", "baboon",
  "lemur", "gibbon", "squirrel", "chipmunk", "hedgehog", "mole", "badger",
  "weasel", "otter", "raccoon", "skunk", "beaver", "ferret", "hare", "groundhog",
  "porcupine", "armadillo", "kangaroo", "wallaby", "koala", "wombat", "platypus",
  "seal", "walrus", "dolphin", "porpoise", "whale", "orca", "narwhal", "manatee",
  "fish", "shark", "ray", "salmon", "trout", "tuna", "cod", "bass", "carp",
  "catfish", "pike", "eel", "octopus", "squid", "jellyfish", "crab", "lobster",
  "shrimp", "clam", "oyster", "snail", "starfish", "seahorse", "eagle", "hawk",
  "falcon", "vulture", "owl", "crow", "raven", "magpie", "jay", "pigeon", "dove",
  "sparrow", "swallow", "robin", "cardinal", "heron", "stork", "crane", "pelican",
  "swan", "flamingo", "gull", "seagull", "penguin", "peacock", "pheasant", "quail",
  "emu", "ostrich", "kiwi", "lizard", "gecko", "iguana", "chameleon", "snake",
  "python", "cobra", "viper", "rattlesnake", "turtle", "tortoise", "crocodile",
  "alligator", "frog", "toad", "newt", "salamander", "ant", "bee", "wasp",
  "butterfly", "moth", "beetle", "ladybug", "dragonfly", "grasshopper", "cricket",
  "fly", "mosquito", "spider", "tarantula", "scorpion", "centipede", "worm",
  "camel", "llama", "alpaca", "yak", "sloth", "meerkat", "mongoose", "bat",
  "dingo", "ocelot", "mammal", "bird", "reptile", "amphibian", "insect",
]);

function normalizeAnimalWord(raw: string): string {
  let w = raw.trim().toLowerCase();
  if (!w) return "";
  w = w.replace(/[.,!?]/g, "");
  if (w.endsWith("s") && w.length > 3) {
    const singular = w.slice(0, -1);
    if (ANIMAL_WORDS.has(singular)) return singular;
  }
  return w;
}

function isAnimal(word: string): boolean {
  const normalized = normalizeAnimalWord(word);
  if (!normalized) return false;
  return ANIMAL_WORDS.has(normalized);
}

export default function FluencyTest({
  onComplete,
}: {
  onComplete: (result: FluencyResult) => void;
}) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [input, setInput] = useState("");
  const [words, setWords] = useState<FluencyWord[]>([]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      const allEntries = words.map((w) => w.text);
      const validAnimals = words.filter((w) => w.isAnimal).map((w) => w.text);
      const invalidEntries = words.filter((w) => !w.isAnimal).map((w) => w.text);

      onComplete({
        rawScore: validAnimals.length,
        totalEntries: words.length,
        validAnimals,
        invalidEntries,
        allEntries,
        durationSeconds: 60,
      });
      return;
    }

    const timer = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, timeLeft, words, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) {
      setInput("");
      return;
    }

    const normalized = raw.toLowerCase();
    const alreadyEntered = words.some((w) => w.text.toLowerCase() === normalized);
    if (alreadyEntered) {
      setInput("");
      return;
    }

    const animalFlag = isAnimal(raw);
    setWords((prev) => [...prev, { text: raw, isAnimal: animalFlag }]);
    setInput("");
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">Verbal Fluency</h3>
        <p className="text-slate-600">
          When you start, type as many <strong>animals</strong> as you can think
          of in 60 seconds.
          <br />
          Press Enter after each word.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Start Timer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg text-slate-900">Category: ANIMALS</div>
        <div className="flex items-center gap-2 font-bold bg-slate-100 px-4 py-2 rounded-full text-slate-900">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {timeLeft}s
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an animal..."
          autoFocus
          className="text-lg"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Add
        </button>
      </form>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[200px] text-left">
        <div className="text-xs text-slate-500 mb-3">
          {words.length} unique words entered &bull;{" "}
          {words.filter((w) => w.isAnimal).length} counted as animals
        </div>
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span
              key={i}
              className={[
                "px-3 py-1 rounded-full text-sm font-medium shadow-sm capitalize border",
                w.isAnimal
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-800",
              ].join(" ")}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
