import Hero from "./components/Hero";
import Video from "./components/Video";
import WhyCricArena from "./components/WhyCricArena";
import Upcoming from "./components/Upcoming";
import Join from "./components/Join";
import About from "./components/About";
import Joinus from "./components/Joinus";
import CricketScoreboard from "./components/CricketScoreboard";

function App() {
  return (
    <>
      <div className="bg-black">
        <div className="bg-hero-pattern h-[30vh]  md:h-screen bg-cover bg-no-repeat bg-center flex flex-col ">
          <div className="mt-0">
            <Hero />
          </div>
        </div>
        <Join />
        <Video />
        <WhyCricArena />
        <Upcoming />
        <About />
        <Joinus />
        {/* <CricketScoreboard/> */}
      </div>
    </>
  );
}

export default App;
