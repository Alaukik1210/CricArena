import { useState, type ChangeEvent, type FormEvent } from "react";

const fieldClass = "w-full rounded border border-rule bg-surface-sunk p-2 text-ink placeholder:text-ink-soft";

const PlayerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    playingRole: "",
    experience: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Player Registration Form Data:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="flex h-screen items-center justify-center font-display">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-4 rounded border border-rule bg-surface p-4 text-ink shadow"
      >
        <h2 className="mb-4 text-2xl font-bold text-pending">Player Registration</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className={fieldClass}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className={fieldClass}
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className={fieldClass}
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className={fieldClass}
        />
        <select
          name="playingRole"
          value={formData.playingRole}
          onChange={handleChange}
          required
          className={fieldClass}
        >
          <option value="">Select Playing Role</option>
          <option value="batsman">Batsman</option>
          <option value="bowler">Bowler</option>
          <option value="all-rounder">All-rounder</option>
          <option value="wicket-keeper">Wicket-keeper</option>
        </select>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Cricket Experience"
          rows={3}
          required
          className={fieldClass}
        />
        <div className="text-center">
          <button
            type="submit"
            className="h-8 w-40 rounded border-2 border-pending bg-pending text-center text-lg font-bold text-surface transition-opacity hover:opacity-90"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerRegistrationForm;
