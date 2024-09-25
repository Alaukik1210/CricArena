// TournamentHostingForm.js
import React, { useState } from "react";

const TournamentHostingForm = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    tournamentName: "",
    startDate: "",
    endDate: "",
    numberOfTeams: 2,
    teams: [{ name: "", players: [{ name: "", role: "", phoneNumber: "" }] }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTeamChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeams = [...formData.teams];
    updatedTeams[index] = { ...updatedTeams[index], [name]: value };
    setFormData((prevState) => ({
      ...prevState,
      teams: updatedTeams,
    }));
  };

  const handlePlayerChange = (teamIndex, playerIndex, e) => {
    const { name, value } = e.target;
    const updatedTeams = [...formData.teams];
    updatedTeams[teamIndex].players[playerIndex] = {
      ...updatedTeams[teamIndex].players[playerIndex],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      teams: updatedTeams,
    }));
  };

  const addTeam = () => {
    setFormData((prevState) => ({
      ...prevState,
      teams: [
        ...prevState.teams,
        { name: "", players: [{ name: "", role: "", phoneNumber: "" }] },
      ],
    }));
  };

  const addPlayer = (teamIndex) => {
    const updatedTeams = [...formData.teams];
    updatedTeams[teamIndex].players.push({
      name: "",
      role: "",
      phoneNumber: "",
    });
    setFormData((prevState) => ({
      ...prevState,
      teams: updatedTeams,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tournament Hosting Form Data:", formData);
    // Add your form submission logic here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-3xl mx-auto p-4 font-cabinet-black mb-20 bg-goldx text-gray-400 shadow rounded-lg"
    >
      <h2 className="text-3xl font-bold font-cabinet-black text-center text-gold mb-4">
        Host a Tournament
      </h2>
      <input
        type="text"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleChange}
        placeholder="Organization Name"
        required
        className="border-0 outline-none rounded-xl text-gold bg-black  p-2  w-full"
      />
      <input
        type="text"
        name="tournamentName"
        value={formData.tournamentName}
        onChange={handleChange}
        placeholder="Tournament Name"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />
      <div className="flex space-x-4">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="border-0 rounded-xl bg-black  p-2  w-full"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="border-0 rounded-xl bg-black  p-2  w-full"
        />
      </div>
      <input
        type="number"
        name="numberOfTeams"
        value={formData.numberOfTeams}
        onChange={handleChange}
        min="2"
        max="16"
        placeholder="Number of Teams"
        required
        className="border-0 rounded-xl bg-black  p-2  w-full"
      />

      {formData.teams.map((team, teamIndex) => (
        <div key={teamIndex} className=" p-2 rounded-3xl border-black pt-4">
          <div className="text-center">
          <h3 className="text-xl mb-2 text-gold font-semibold">
            Team {teamIndex + 1}
          </h3>
          </div>
         
          <input
            type="text"
            name="name"
            value={team.name}
            onChange={(e) => handleTeamChange(teamIndex, e)}
            placeholder="Team Name"
            required
            className="border-0 rounded-xl bg-black  p-2  w-full mb-2"
          />
          {team.players.map((player, playerIndex) => (
            <div key={playerIndex} className="flex space-x-4 mb-2">
              <input
                type="text"
                name="name"
                value={player.name}
                onChange={(e) => handlePlayerChange(teamIndex, playerIndex, e)}
                placeholder="Player Name"
                required
                className="border-0 rounded-xl bg-black  p-2  w-full"
              />
              <input
                type="text"
                name="role"
                value={player.role}
                onChange={(e) => handlePlayerChange(teamIndex, playerIndex, e)}
                placeholder="Role (e.g., Bowler, Batsman)"
                required
                className="border-0 rounded-xl bg-black  p-2  w-full"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={player.phoneNumber}
                onChange={(e) => handlePlayerChange(teamIndex, playerIndex, e)}
                placeholder="Phone Number"
                required
                className="border-0 rounded-xl bg-black  p-2  w-full"
              />
            </div>
          ))}
          <div className="text-center">
          <button
            type="button"
            onClick={() => addPlayer(teamIndex)}
            className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center"
          >
            Add Player
          </button>
          </div>
          
        </div>
      ))}
      <div className="text-center">
      <button
        type="button"
        onClick={addTeam}
        className="group relative h-8 w-40 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center"
      >
        Add Team
      </button>
      </div>
     
      <br />
      <div className="text-center">
      <button
        type="submit"
        className="group relative h-8 w-80 overflow-hidden rounded-2xl bg-goldx text-lg font-bold border-2 border-gold text-gold text-center "
      >
        Host Tournament
      </button>
      </div>
      
    </form>
  );
};

export default TournamentHostingForm;
