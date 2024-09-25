import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CricketScoreboard = () => {
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [team1Score, setTeam1Score] = useState(0);
  const [team1Wickets, setTeam1Wickets] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team2Wickets, setTeam2Wickets] = useState(0);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [matchFinished, setMatchFinished] = useState(false);
  const [batsmen, setBatsmen] = useState([
    { id: 1, name: "Batsman 1", score: 0, status: "Not Out", onStrike: true },
    { id: 2, name: "Batsman 2", score: 0, status: "Not Out", onStrike: false },
  ]);
  const [bowlers, setBowlers] = useState([
    { id: 1, name: "Bowler 1", wickets: 0, runs: 0, overs: 0 },
  ]);
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false);
  const [newBatsmanName, setNewBatsmanName] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("cricketScoreboard");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTeam1Name(parsedData.team1Name);
      setTeam2Name(parsedData.team2Name);
      setTeam1Score(parsedData.team1Score);
      setTeam1Wickets(parsedData.team1Wickets);
      setTeam2Score(parsedData.team2Score);
      setTeam2Wickets(parsedData.team2Wickets);
      setCurrentInnings(parsedData.currentInnings);
      setOvers(parsedData.overs);
      setBalls(parsedData.balls);
      setMatchFinished(parsedData.matchFinished);
      setBatsmen(parsedData.batsmen);
      setBowlers(parsedData.bowlers);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [
    team1Name,
    team2Name,
    team1Score,
    team1Wickets,
    team2Score,
    team2Wickets,
    currentInnings,
    overs,
    balls,
    matchFinished,
    batsmen,
    bowlers,
  ]);

  const saveToLocalStorage = () => {
    const dataToSave = {
      team1Name,
      team2Name,
      team1Score,
      team1Wickets,
      team2Score,
      team2Wickets,
      currentInnings,
      overs,
      balls,
      matchFinished,
      batsmen,
      bowlers,
    };
    localStorage.setItem("cricketScoreboard", JSON.stringify(dataToSave));
  };

  const addRuns = (runs) => {
    if (matchFinished) return;
    if (currentInnings === 1) {
      setTeam1Score(team1Score + runs);
    } else {
      setTeam2Score(team2Score + runs);
    }
    setBatsmen(
      batsmen.map((batsman) =>
        batsman.onStrike ? { ...batsman, score: batsman.score + runs } : batsman
      )
    );
    setBowlers(
      bowlers.map((bowler, index) =>
        index === bowlers.length - 1
          ? { ...bowler, runs: bowler.runs + runs }
          : bowler
      )
    );
    updateBallCount();
    if (runs % 2 !== 0) {
      switchStrike();
    }
  };

  const addWicket = () => {
    if (matchFinished) return;
    if (currentInnings === 1) {
      if (team1Wickets < 9) {
        setTeam1Wickets(team1Wickets + 1);
        updateBatsmanStatus();
        setShowNewBatsmanModal(true);
      } else {
        switchInnings();
      }
    } else {
      if (team2Wickets < 9) {
        setTeam2Wickets(team2Wickets + 1);
        updateBatsmanStatus();
        setShowNewBatsmanModal(true);
      } else {
        finishMatch();
      }
    }
    setBowlers(
      bowlers.map((bowler, index) =>
        index === bowlers.length - 1
          ? { ...bowler, wickets: bowler.wickets + 1 }
          : bowler
      )
    );
    updateBallCount();
  };

  const updateBatsmanStatus = () => {
    setBatsmen(
      batsmen.map((batsman) =>
        batsman.onStrike ? { ...batsman, status: "Out" } : batsman
      )
    );
  };

  const updateBallCount = () => {
    const newBalls = balls + 1;
    setBalls(newBalls);
    if (newBalls === 6) {
      setOvers(overs + 1);
      setBalls(0);
      switchStrike();
      setBowlers(
        bowlers.map((bowler, index) =>
          index === bowlers.length - 1
            ? { ...bowler, overs: bowler.overs + 1 }
            : bowler
        )
      );

      const newBowlerName = prompt("Enter new bowler's name:");
      if (newBowlerName && newBowlerName.trim() !== "") {
        const newBowler = {
          id: bowlers.length + 1,
          name: newBowlerName,
          wickets: 0,
          runs: 0,
          overs: 0,
        };
        setBowlers([...bowlers, newBowler]);
      }
    }
  };

  const switchStrike = () => {
    setBatsmen(
      batsmen.map((batsman) =>
        batsman.status === "Not Out"
          ? { ...batsman, onStrike: !batsman.onStrike }
          : batsman
      )
    );
  };

  const switchInnings = () => {
    setCurrentInnings(2);
    setOvers(0);
    setBalls(0);
    setBatsmen([
      {
        id: batsmen.length + 1,
        name: "Batsman 1",
        score: 0,
        status: "Not Out",
        onStrike: true,
      },
      {
        id: batsmen.length + 2,
        name: "Batsman 2",
        score: 0,
        status: "Not Out",
        onStrike: false,
      },
    ]);
    setBowlers([
      {
        id: bowlers.length + 1,
        name: "Bowler 1",
        wickets: 0,
        runs: 0,
        overs: 0,
      },
    ]);
  };

  const finishMatch = () => {
    setMatchFinished(true);
  };

  const addNewBatsman = () => {
    if (newBatsmanName.trim() !== "") {
      const newBatsman = {
        id: batsmen.length + 1,
        name: newBatsmanName,
        score: 0,
        status: "Not Out",
        onStrike: true,
      };
      setBatsmen([...batsmen, newBatsman]);
      setShowNewBatsmanModal(false);
      setNewBatsmanName("");
    }
  };


  const getWinner = () => {
    if (team1Score > team2Score) return team1Name;
    if (team2Score > team1Score) return team2Name;
    return "It's a tie!";
  };

  const resetScoreboard = () => {
    setTeam1Name("Team 1");
    setTeam2Name("Team 2");
    setTeam1Score(0);
    setTeam1Wickets(0);
    setTeam2Score(0);
    setTeam2Wickets(0);
    setCurrentInnings(1);
    setOvers(0);
    setBalls(0);
    setMatchFinished(false);
    setBatsmen([
      { id: 1, name: "Batsman 1", score: 0, status: "Not Out", onStrike: true },
      {
        id: 2,
        name: "Batsman 2",
        score: 0,
        status: "Not Out",
        onStrike: false,
      },
    ]);
    setBowlers([{ id: 1, name: "Bowler 1", wickets: 0, runs: 0, overs: 0 }]);
    localStorage.removeItem("cricketScoreboard");
  };

  const handleNameChange = (type, id, newName) => {
    if (type === "batsman") {
      setBatsmen(
        batsmen.map((batsman) =>
          batsman.id === id ? { ...batsman, name: newName } : batsman
        )
      );
    } else if (type === "bowler") {
      setBowlers(
        bowlers.map((bowler) =>
          bowler.id === id ? { ...bowler, name: newName } : bowler
        )
      );
    }
  };

  return (
    <div className="h-full w-full flex justify-center font-cabinet-black ">
      <div className="h-[80vh] w-[700px] rounded-3xl bg-goldx text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl text-gold font-cabinet-black font-bold mb-6">
          Cricket Scoreboard
        </h1>

        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="bg-goldx p-2 rounded-lg text-center w-32"
            />
            <span className="text-2xl font-semibold">VS</span>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="bg-goldx p-2 rounded-lg text-center w-32"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 w-[400px] bg-black rounded-lg">
            <h2 className="text-3xl text-gold font-bold mb-4">
              Innings: {currentInnings}
            </h2>
            <div className="flex text-2xl justify-between mb-2">
              <span>
               <span className="text-goldy" >{team1Name}</span> : {team1Score}/{team1Wickets}
              </span>
              <span>
              <span className="text-goldy" >{team2Name}</span>: {team2Score}/{team2Wickets}
              </span>
            </div>
            <div className="mb-2">
              <span>
              <span className="text-goldy" >Overs: </span> {overs}.{balls}
              </span>
            </div>
            <div className="mb-4">
              {batsmen
                .filter((b) => b.status === "Not Out")
                .map((batsman) => (
                  <div key={batsman.id}>
                    <span>
                      {batsman.name} - {batsman.score}* (
                      {batsman.onStrike ? "on strike" : ""})
                    </span>
                  </div>
                ))}
            </div>
            <div className="mb-2">
              {bowlers.map((bowler) => (
                <div key={bowler.id}>
                  <span>
                    {bowler.name} - {bowler.wickets} wickets, {bowler.runs} runs
                    ({bowler.overs} overs)
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
  {batsmen.filter(b => b.status === 'Not Out').map(batsman => (
    <div key={batsman.id} className="flex items-center mb-2">
      <input 
        type="text" 
        value={batsman.name} 
        onChange={(e) => handleNameChange('batsman', batsman.id, e.target.value)}
        className="bg-goldx outline-none p-1 text-center text-gold rounded-lg w-[120px]    mr-2"
      />
      <span>{batsman.score}* ({batsman.onStrike ? 'on strike' : ''})</span>
    </div>
  ))}
</div>

<div className="mb-2">
  {bowlers.map(bowler => (
    <div key={bowler.id} className="flex items-center mb-2">
      <input 
        type="text" 
        value={bowler.name} 
        onChange={(e) => handleNameChange('bowler', bowler.id, e.target.value)}
        className="bg-goldx p-1 outline-none text-center text-gold rounded-lg w-[120px] mr-2"
      />
      <span>{bowler.wickets} wickets, {bowler.runs} runs ({bowler.overs} overs)</span>
    </div>
  ))}
</div>
          </div>

          <div className="flex flex-col w-[200px] ml-24 space-y-4">
            <button
              className="text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={() => addRuns(1)}
            >
              Add 1 Run
            </button>
            <button
              className="text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={() => addRuns(2)}
            >
              Add 2 Run
            </button>
            <button
              className="text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={() => addRuns(3)}
            >
              Add 3 Run
            </button>
            <button
              className="text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={() => addRuns(4)}
            >
              Add 4 Runs
            </button>
            <button
              className="text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={() => addRuns(6)}
            >
              Add 6 Runs
            </button>
            <button
              className="bg-black text-gold border-2 border-gold  px-4 py-2 rounded-lg"
              onClick={addWicket}
            >
              Add Wicket
            </button>
            <button
              className="bg-black text-gold border-2 border-gold px-4 py-2 rounded-lg"
              onClick={switchInnings}
            >
              Switch Innings
            </button>
            
          </div>
          

        </div>

        {matchFinished && (
          <div className="bg-gray-800 p-4 rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-2">Match Finished</h2>
            <p>The winner is: {getWinner()}</p>
          </div>
        )}

        <button
          className="bg-gold text-black px-4 py-2 rounded-lg mt-6"
          onClick={resetScoreboard}
        >
          Reset Scoreboard
        </button>

        <AnimatePresence>
          {showNewBatsmanModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-gray-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">New Batsman</h2>
                <input
                  type="text"
                  value={newBatsmanName}
                  onChange={(e) => setNewBatsmanName(e.target.value)}
                  placeholder="Enter new batsman name"
                  className="p-2 bg-gray-700 rounded-lg w-full mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-600 px-4 py-2 rounded-lg"
                    onClick={() => setShowNewBatsmanModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 px-4 py-2 rounded-lg"
                    onClick={addNewBatsman}
                  >
                    Add Batsman
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CricketScoreboard;
