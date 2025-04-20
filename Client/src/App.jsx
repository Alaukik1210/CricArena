import Hero from "./components/Hero";
import Video from "./components/Video";
import WhyCricArena from "./components/WhyCricArena";
import Upcoming from "./components/Upcoming";
import Join from "./components/Join";
import About from "./components/About";
import Joinus from "./components/Joinus";
import CricketScoreboard from "./components/CricketScoreboard";
import ServicesHub from "./components/ServicesHub";
import Matchups from "./components/Matchups";

function App() {
  return (
    <>
      <div className="bg-black z-10">
        <div className="bg-hero-pattern  md:h-screen bg-cover bg-no-repeat bg-center flex flex-col ">
          <div className="mt-0">
            <Hero />
          </div>
        </div>
        <Join />
        {/* <Video /> */}
        <ServicesHub/>
        {/* <WhyCricArena /> */}
        <Upcoming />
        <Matchups/>
        <About />
        <Joinus />
        {/* <CricketScoreboard/> */}
      </div>
    </>
  );
}

export default App;
