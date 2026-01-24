import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer } from "lucide-react";

export type FluencyResult = {
  rawScore: number; // number of valid animal words
  totalEntries: number; // number of unique words accepted
  validAnimals: string[]; // unique valid animal words
  invalidEntries: string[]; // unique non-animal words
  allEntries: string[]; // in case you ever change to allow duplicates
  durationSeconds: number; // total time allowed (60)
};

type FluencyWord = {
  text: string;
  isAnimal: boolean;
};

const ANIMAL_WORDS = new Set<string>([
  "dog",
  "cat",
  "puppy",
  "kitten",
  "hamster",
  "gerbil",
  "guinea pig",
  "rabbit",
  "bunny",
  "mouse",
  "rat",
  "parrot",
  "budgie",
  "budgerigar",
  "goldfish",
  "canary",
  "cockatiel",
  "lovebird",
  "finch",
  "cow",
  "bull",
  "calf",
  "pig",
  "hog",
  "boar",
  "sow",
  "sheep",
  "ram",
  "ewe",
  "goat",
  "kid",
  "horse",
  "stallion",
  "mare",
  "foal",
  "colt",
  "filly",
  "donkey",
  "burro",
  "mule",
  "chicken",
  "hen",
  "rooster",
  "cockerel",
  "duck",
  "drake",
  "goose",
  "gander",
  "turkey",
  "lion",
  "tiger",
  "leopard",
  "cheetah",
  "jaguar",
  "panther",
  "cougar",
  "puma",
  "lynx",
  "bobcat",
  "wolf",
  "coyote",
  "fox",
  "bear",
  "grizzly",
  "black bear",
  "polar bear",
  "brown bear",
  "panda",
  "red panda",
  "hyena",
  "jackal",
  "elephant",
  "african elephant",
  "asian elephant",
  "giraffe",
  "zebra",
  "rhino",
  "rhinoceros",
  "white rhino",
  "black rhino",
  "hippo",
  "hippopotamus",
  "buffalo",
  "bison",
  "water buffalo",
  "antelope",
  "impala",
  "gazelle",
  "springbok",
  "wildebeest",
  "gnu",
  "kudu",
  "eland",
  "moose",
  "elk",
  "deer",
  "reindeer",
  "caribou",
  "fallow deer",
  "roe deer",
  "monkey",
  "ape",
  "gorilla",
  "chimpanzee",
  "chimp",
  "orangutan",
  "baboon",
  "lemur",
  "marmoset",
  "tamarin",
  "gibbon",
  "bonobo",
  "squirrel",
  "chipmunk",
  "hedgehog",
  "mole",
  "vole",
  "shrew",
  "badger",
  "weasel",
  "stoat",
  "ermine",
  "otter",
  "raccoon",
  "skunk",
  "possum",
  "opossum",
  "beaver",
  "ferret",
  "mink",
  "martin",
  "pine marten",
  "hare",
  "groundhog",
  "woodchuck",
  "gopher",
  "prairie dog",
  "chinchilla",
  "gerenuk",
  "porcupine",
  "armadillo",
  "kangaroo",
  "wallaby",
  "koala",
  "wombat",
  "tasmanian devil",
  "quokka",
  "quoll",
  "numbat",
  "bandicoot",
  "bilby",
  "platypus",
  "echidna",
  "seal",
  "sea lion",
  "fur seal",
  "walrus",
  "dolphin",
  "bottlenose dolphin",
  "porpoise",
  "whale",
  "blue whale",
  "humpback whale",
  "fin whale",
  "orca",
  "killer whale",
  "narwhal",
  "beluga",
  "manatee",
  "dugong",
  "fish",
  "shark",
  "great white shark",
  "hammerhead shark",
  "tiger shark",
  "whale shark",
  "ray",
  "stingray",
  "manta ray",
  "salmon",
  "trout",
  "tuna",
  "albacore",
  "cod",
  "haddock",
  "herring",
  "anchovy",
  "sardine",
  "mackerel",
  "bass",
  "carp",
  "catfish",
  "pike",
  "perch",
  "barracuda",
  "piranha",
  "eel",
  "moray eel",
  "flounder",
  "halibut",
  "sole",
  "grouper",
  "snapper",
  "octopus",
  "squid",
  "cuttlefish",
  "nautilus",
  "jellyfish",
  "anemone",
  "coral",
  "crab",
  "hermit crab",
  "lobster",
  "shrimp",
  "prawn",
  "krill",
  "clam",
  "oyster",
  "mussel",
  "scallop",
  "snail",
  "slug",
  "starfish",
  "sea star",
  "sea urchin",
  "sea cucumber",
  "seahorse",
  "eagle",
  "bald eagle",
  "golden eagle",
  "hawk",
  "falcon",
  "peregrine falcon",
  "vulture",
  "buzzard",
  "kite",
  "osprey",
  "owl",
  "barn owl",
  "snowy owl",
  "crow",
  "raven",
  "magpie",
  "jay",
  "blue jay",
  "pigeon",
  "dove",
  "sparrow",
  "swallow",
  "martin",
  "robin",
  "bluebird",
  "cardinal",
  "warbler",
  "wren",
  "blackbird",
  "thrush",
  "finch",
  "lark",
  "starling",
  "heron",
  "egret",
  "stork",
  "crane",
  "pelican",
  "cormorant",
  "swan",
  "flamingo",
  "ibis",
  "spoonbill",
  "gull",
  "seagull",
  "tern",
  "albatross",
  "puffin",
  "penguin",
  "peacock",
  "peahen",
  "pheasant",
  "quail",
  "grouse",
  "cockatoo",
  "macaw",
  "parakeet",
  "lovebird",
  "emu",
  "ostrich",
  "kiwi",
  "lizard",
  "gecko",
  "iguana",
  "chameleon",
  "monitor lizard",
  "komodo dragon",
  "skink",
  "snake",
  "python",
  "boa",
  "boa constrictor",
  "cobra",
  "king cobra",
  "viper",
  "adder",
  "rattlesnake",
  "anaconda",
  "turtle",
  "tortoise",
  "terrapin",
  "sea turtle",
  "box turtle",
  "crocodile",
  "alligator",
  "caiman",
  "gavial",
  "gharial",
  "frog",
  "tree frog",
  "poison dart frog",
  "toad",
  "newt",
  "salamander",
  "axolotl",
  "ant",
  "carpenter ant",
  "fire ant",
  "bee",
  "honeybee",
  "bumblebee",
  "wasp",
  "hornet",
  "yellowjacket",
  "butterfly",
  "monarch butterfly",
  "swallowtail",
  "moth",
  "silkworm",
  "beetle",
  "ladybug",
  "ladybird",
  "stag beetle",
  "weevil",
  "dragonfly",
  "damselfly",
  "grasshopper",
  "cricket",
  "locust",
  "katydid",
  "stick insect",
  "walking stick",
  "fly",
  "housefly",
  "horsefly",
  "mosquito",
  "flea",
  "tick",
  "aphid",
  "cicada",
  "praying mantis",
  "mantis",
  "firefly",
  "spider",
  "tarantula",
  "black widow",
  "scorpion",
  "mite",
  "harvestman",
  "daddy longlegs",
  "centipede",
  "millipede",
  "earthworm",
  "worm",
  "leech",
  "barnacle",
  "camel",
  "dromedary",
  "bactrian camel",
  "llama",
  "alpaca",
  "yak",
  "reindeer",
  "caribou",
  "water buffalo",
  "anteater",
  "aardvark",
  "aardwolf",
  "sloth",
  "meerkat",
  "mongoose",
  "okapi",
  "tapir",
  "saiga",
  "capybara",
  "agouti",
  "paca",
  "degu",
  "jerboa",
  "bat",
  "fruit bat",
  "flying fox",
  "arctic fox",
  "red fox",
  "fennec fox",
  "dingo",
  "snow leopard",
  "clouded leopard",
  "caracal",
  "serval",
  "ocelot",
  "margay",
  "sun bear",
  "sloth bear",
  "spectacled bear",
  "oryx",
  "hartebeest",
  "topi",
  "bongo",
  "dik-dik",
  "narwhal",
  "beluga",
  "manatee",
  "dugong",
  "lemur",
  "warthog",
  "wild boar",
  "eland",
  "sable antelope",
  "mammal",
  "bird",
  "fish",
  "reptile",
  "amphibian",
  "insect",
  "spider",
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

export function FluencyTest({ onComplete }: { onComplete: (result: FluencyResult) => void }) {
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
        <h3 className="text-2xl font-bold text-primary">Verbal Fluency</h3>
        <p className="text-muted-foreground">
          When you start, type as many <strong>animals</strong> as you can think of in 60 seconds.
          <br />
          Press Enter after each word.
        </p>
        <Button onClick={() => setStarted(true)} size="lg" className="w-full">
          Start Timer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">Category: ANIMALS</div>
        <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
          <Timer size={16} /> {timeLeft}s
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
        <Button type="submit">Add</Button>
      </form>

      <div className="p-4 bg-slate-50 border rounded-xl min-h-[200px] text-left">
        <div className="text-xs text-muted-foreground mb-2">
          {words.length} unique words entered • {words.filter((w) => w.isAnimal).length} counted as animals
        </div>
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span
              key={i}
              className={[
                "px-3 py-1 rounded-full text-sm font-medium shadow-sm capitalize border",
                w.isAnimal ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800",
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
