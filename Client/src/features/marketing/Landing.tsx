import Hero from "./Hero";
import Join from "./Join";
import ServicesHub from "./ServicesHub";
import Upcoming from "./Upcoming";
import Matchups from "./Matchups";
import About from "./About";
import Joinus from "./Joinus";

const Landing = () => {
    return (
        <div className="bg-black z-10">
            <div className="bg-hero-pattern md:h-screen bg-cover bg-no-repeat bg-center flex flex-col">
                <div className="mt-0">
                    <Hero />
                </div>
            </div>
            <Join />
            <ServicesHub />
            <Upcoming />
            <Matchups />
            <About />
            <Joinus />
        </div>
    );
};

export default Landing;
