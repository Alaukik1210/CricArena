import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Batsman {
  id: number;
  name: string;
  score: number;
  status: "Not Out" | "Out";
  onStrike: boolean;
}

interface Bowler {
  id: number;
  name: string;
  wickets: number;
  runs: number;
  overs: number;
}

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
  const [batsmen, setBatsmen] = useState<Batsman[]>([
    { id: 1, name: "Batsman 1", score: 0, status: "Not Out", onStrike: true },
    { id: 2, name: "Batsman 2", score: 0, status: "Not Out", onStrike: false },
  ]);
  const [bowlers, setBowlers] = useState<Bowler[]>([
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

  const saveToLocalStorage = useCallback(() => {
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

  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  const addRuns = (runs: number) => {
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
        const newBowler: Bowler = {
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
      const newBatsman: Batsman = {
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

  const handleNameChange = (type: "batsman" | "bowler", id: number, newName: string) => {
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
    <div className="flex h-full w-full justify-center font-body pt-40 pb-16">
      <div className="flex min-h-[80vh] w-[700px] max-w-full flex-col items-center justify-center rounded border border-rule bg-surface p-8 text-ink">
        <h1 className="mb-6 font-display text-4xl uppercase tracking-wide text-pending">
          Cricket Scoreboard
        </h1>

        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-32 rounded border border-rule bg-surface-sunk p-2 text-center text-ink"
            />
            <span className="text-2xl font-semibold">VS</span>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-32 rounded border border-rule bg-surface-sunk p-2 text-center text-ink"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="w-[400px] rounded border border-rule bg-surface p-4">
            <h2 className="mb-4 font-display text-3xl uppercase tracking-wide text-pending">
              Innings: {currentInnings}
            </h2>
            <div className="flex text-2xl justify-between mb-2">
              <span>
               <span className="text-ink-soft">{team1Name}</span> : {team1Score}/{team1Wickets}
              </span>
              <span>
              <span className="text-ink-soft">{team2Name}</span>: {team2Score}/{team2Wickets}
              </span>
            </div>
            <div className="mb-2">
              <span>
              <span className="text-ink-soft">Overs: </span> {overs}.{balls}
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
        className="mr-2 w-[120px] rounded border border-rule bg-surface-sunk p-1 text-center text-ink"
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
        className="mr-2 w-[120px] rounded border border-rule bg-surface-sunk p-1 text-center text-ink"
      />
      <span>{bowler.wickets} wickets, {bowler.runs} runs ({bowler.overs} overs)</span>
    </div>
  ))}
</div>
          </div>

          <div className="flex flex-col w-[200px] ml-24 space-y-4">
            <button
              className="rounded border-2 border-pending px-4 py-2 text-pending"
              onClick={() => addRuns(1)}
            >
              Add 1 Run
            </button>
            <button
              className="rounded border-2 border-pending px-4 py-2 text-pending"
              onClick={() => addRuns(2)}
            >
              Add 2 Run
            </button>
            <button
              className="rounded border-2 border-pending px-4 py-2 text-pending"
              onClick={() => addRuns(3)}
            >
              Add 3 Run
            </button>
            <button
              className="rounded border-2 border-pending px-4 py-2 text-pending"
              onClick={() => addRuns(4)}
            >
              Add 4 Runs
            </button>
            <button
              className="rounded border-2 border-pending px-4 py-2 text-pending"
              onClick={() => addRuns(6)}
            >
              Add 6 Runs
            </button>
            <button
              className="rounded border-2 border-pending bg-surface px-4 py-2 text-pending"
              onClick={addWicket}
            >
              Add Wicket
            </button>
            <button
              className="rounded border-2 border-pending bg-surface px-4 py-2 text-pending"
              onClick={switchInnings}
            >
              Switch Innings
            </button>
            
          </div>
          

        </div>

        {matchFinished && (
          <div className="mt-6 rounded border border-rule bg-surface-sunk p-4 text-ink">
            <h2 className="text-2xl font-bold mb-2">Match Finished</h2>
            <p>The winner is: {getWinner()}</p>
          </div>
        )}

        <button
          className="mt-6 rounded bg-pending px-4 py-2 text-surface"
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
              className="fixed inset-0 flex items-center justify-center bg-ink/50"
            >
              <div className="rounded border border-rule bg-surface p-8 text-ink">
                <h2 className="text-2xl font-bold mb-4">New Batsman</h2>
                <input
                  type="text"
                  value={newBatsmanName}
                  onChange={(e) => setNewBatsmanName(e.target.value)}
                  placeholder="Enter new batsman name"
                  className="mb-4 w-full rounded border border-rule bg-surface-sunk p-2 text-ink"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="rounded bg-urgent px-4 py-2 text-surface"
                    onClick={() => setShowNewBatsmanModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-go px-4 py-2 text-surface"
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
