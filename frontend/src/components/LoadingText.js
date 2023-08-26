import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const welcomeAndExamples = [
  "Welcome to Your AI Recommendation App...",
  "Want similar artists to Taylor Swift?",
  "Want similar books to The Great Gatsby?",
  "Want similar movies to Jungle Book?",
];

const messages = [
  "Generating witty dialog...",
  "Swapping time and space...",
  "Spinning violently around the y-axis...",
  "Tokenizing real life...",
  "Bending the spoon...",
  "Filtering morale...",
  "Don't think of purple hippos...",
  "We need a new fuse...",
  "Have a good day...",
  "Upgrading Windows, your PC will restart several times. Sit back and relax...",
  "640K ought to be enough for anybody...",
  "The architects are still drafting...",
  "The bits are breeding...",
  "We're building the buildings as fast as we can...",
  "Would you prefer chicken, steak, or tofu?...",
  "(Pay no attention to the man behind the curtain)...",
  "...and enjoy the elevator music...",
  "Please wait while the little elves draw your map...",
  "Don't worry - a few bits tried to escape, but we caught them...",
  "Would you like fries with that?...",
  "Checking the gravitational constant in your locale...",
  "Go ahead -- hold your breath!...",
  "...at least you're not on hold...",
  "Hum something loud while others stare...",
  "You're not in Kansas any more...",
  "The server is powered by a lemon and two electrodes...",
  "Please wait while a larger software vendor in Seattle takes over the world...",
  "We're testing your patience...",
  "As if you had any other choice...",
  "Follow the white rabbit...",
  "Why don't you order a sandwich?...",
  "While the satellite moves into position...",
  "keep calm and npm install...",
  "The bits are flowing slowly today...",
  "Dig on the 'X' for buried treasure... ARRR!...",
  "It's still faster than you could draw it...",
  "The last time I tried this the monkey didn't survive. Let's hope it works better this time...",
  "I should have had a V8 this morning...",
  "My other loading screen is much faster...",
  "Testing on Timmy... We're going to need another Timmy...",
  "Reconfoobling energymotron...",
  "(Insert quarter)...",
  "Are we there yet?...",
  "Have you lost weight?...",
  "Just count to 10...",
  "Why so serious?...",
  "It's not you. It's me...",
  "Counting backwards from Infinity...",
  "Don't panic...",
  "Embiggening Prototypes...",
  "Do not run! We are your friends!...",
  "Do you come here often?...",
  "Warning: Don't set yourself on fire...",
  "We're making you a cookie...",
  "Creating time-loop inversion field...",
  "Spinning the wheel of fortune...",
  "Loading the enchanted bunny...",
  "Computing chance of success...",
  "I'm sorry Dave, I can't do that...",
  "Looking for exact change...",
  "All your web browser are belong to us...",
  "All I really need is a kilobit...",
  "I feel like I'm supposed to be loading something...",
  "What do you call 8 Hobbits? A Hobbyte...",
  "Should have used a compiled language...",
  "Is this Windows?...",
  "Adjusting flux capacitor...",
  "Please wait until the sloth starts moving...",
  "Don't break your screen yet!...",
  "I swear it's almost done...",
  "Let's take a mindfulness minute...",
  "Unicorns are at the end of this road, I promise...",
  "Listening for the sound of one hand clapping...",
  "Keeping all the 1's and removing all the 0's...",
  "Putting the icing on the cake. The cake is not a lie...",
  "Cleaning off the cobwebs...",
  "Making sure all the i's have dots...",
  "We are not liable for any broken screens as a result of waiting...",
  "We need more dilithium crystals...",
  "Where did all the internets go...",
  "Connecting Neurotoxin Storage Tank...",
  "Granting wishes...",
  "Time flies when you’re having fun...",
  "Get some coffee and come back in ten minutes...",
  "Spinning the hamster…",
  "99 bottles of beer on the wall...",
  "Stay awhile and listen...",
  "Be careful not to step in the git-gui...",
  "You shall not pass! yet...",
  "Load it and they will come...",
  "Convincing AI not to turn evil...",
  "There is no spoon. Because we are not done loading it...",
  "Your left thumb points to the right and your right thumb points to the left...",
  "How did you get here?...",
  "Wait, do you smell something burning?...",
  "Computing the secret to life, the universe, and everything...",
  "When nothing is going right, go left!!...",
  "Searching for lost socks...",
  "Summoning magic code monkeys...",
  "Counting to infinity... twice...",
  "Brewing coffee for the servers...",
  "Entangling quantum bits...",
  "Channeling inner sloth energy...",
  "Converting procrastination to progress...",
  "Assembling digital puzzle pieces...",
  "Finding the meaning of life...",
  "Training hamsters to power the app...",
  "Waking up the hamsters...",
  "Trying to catch a unicorn...",
  "Wishing upon a shooting star...",
  "Dialing up the nostalgia...",
  "Sending carrier pigeons for data transfer...",
  "Chasing ones and zeros...",
  "Rounding up the digital sheep...",
  "Whispering sweet nothings to the algorithms...",
  "Giving the app a pep talk...",
  "Building castles in the cloud...",
  "Unscrambling an egg...",
  "Testing the patience of a saint...",
  "Debugging the debugger...",
  "Waiting for a black hole to open...",
  "Trying to herd cats...",
  "Searching for the Internet's lost treasure...",
  "Shouting 'Abracadabra' at the server racks...",
  "Untangling Christmas lights...",
  "Converting bug reports into feature requests...",
  "Training the app's AI to do a backflip...",
  "Charging the virtual reality hamster wheel...",
  "Teaching squirrels to type...",
  "Gathering cosmic dust for a smoother experience...",
  "Evolving the app's consciousness...",
  "Putting together a jigsaw puzzle made of memes...",
  "Finding Waldo in binary code...",
  "Whispering secrets to the digital elves...",
  "Convincing the app it's not a toaster...",
  "Waiting for the code fairy to sprinkle magic...",
  "Polishing the pixels to a blinding shine...",
  "Inventing new colors for the loading screen...",
  "Navigating through the maze of possibilities...",
  "Searching for the lost city of cache...",
  "Tickling the app's funny bone...",
  "Rehearsing Shakespearean monologues for the CPU...",
  "Unwrapping virtual presents...",
  "Dusting off the ones and twos...",
  "Finding the missing link in the code evolution...",
  "Exploring the matrix for hidden easter eggs...",
  "Balancing the app's karma...",
  "Training squirrels to lift heavy data...",
  "Asking the servers for their favorite knock-knock joke...",
  "Juggling bits and bytes...",
  "Lining up the ducks in a row...",
  "Battling cosmic rays with a lightsaber...",
  "Searching for the needle in the digital haystack...",
  "Counting the pixels on a digital rainbow...",
  "Petting virtual kittens for good luck...",
  "Mixing a potion of code and caffeine...",
  "Tuning the app's chakras for optimal performance...",
  "Baking cookies for the debugging gnomes...",
  "Dancing the Macarena with the data packets...",
  "Giving the app a motivational pep talk...",
  "Sending good vibes through the binary wind...",
  "Asking the cloud for a favor...",
  "Channeling the spirits of ancient programmers...",
  "Brainstorming clever error messages...",
  "Checking the crystal ball for loading progress...",
  "Offering virtual high-fives to the code sprites...",
  "Chanting incantations for faster load times...",
  "Searching for the pot of gold at the end of the code rainbow...",
  "Playing hide and seek with the app's hidden features...",
  "Picking up spare ones and zeroes...",
  "Giving the app a motivational montage...",
  "Consulting the digital fortune teller...",
  "Summoning the app's inner child...",
  "Calibrating the quantum flux capacitor...",
  "Asking the server hamsters for tech support...",
  "Debugging the debugging process...",
  "Coaxing the app out of its shyness...",
  "Asking the loading bar to do a dance...",
  "Drawing mustaches on the server avatars...",
  "Checking the app's horoscope for loading advice...",
  "Making snow angels in the pixel dust...",
  "Explaining to the app that patience is a virtue...",
  "Training the app to do cartwheels...",
  "Searching for the lost city of WiFi...",
  "Whispering 'Hakuna Matata' to the loading bar...",
  "Spreading fairy dust on the digital pathways...",
  "Checking the map for loading shortcuts...",
  "Preparing a playlist for the loading journey...",
  "Offering loading tips to the loading screen...",
  "Teaching the app to count backwards from infinity...",
  "Asking the servers for the meaning of life...",
  "Finding the loading progress in the tea leaves...",
  "Checking the app's aura for good vibes...",
  "Giving the app a virtual pat on the back...",
  "Searching for the perfect loading dance partner...",
  "Checking the app's loading bar's ID for a lucky number...",
  "Reminding the app that loading is a marathon, not a sprint...",
  "I hope these additional suggestions bring a smile to your users' faces!",
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffleArray(messages);


export const WelcomeMessages = () => {
  const theme = useTheme();
  const categories = ['Music', 'Books', 'Movies', 'TV Shows'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="welcome-message-text-motion"
    >
      <span>AI Recommendations For: </span>
      <Typewriter
        words={categories}
        loop={true}
        cursor
        cursorStyle="_"
        delaySpeed={505}
        deleteSpeed={150}
        typeSpeed={110}
        pauseTime={3000}
      />
    </motion.div>
  );
};
const LoadingText = () => {
  const theme = useTheme();

  return (
    <div className="loading-text-message" style={{color: theme.palette.text.primary}}>
    <Typewriter
      words={messages}
      loop={false}
      cursor
      cursorStyle="_"
      delaySpeed={145}
      deleteSpeed={40}
      typeSpeed={70}
    />
  </div>
  );
}
export default LoadingText;
