import { useState, type ChangeEvent, type FormEvent } from "react";

const fieldClass = "w-full rounded border border-rule bg-surface-sunk p-2 text-ink placeholder:text-ink-soft";

const TicketBookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    matchDate: "",
    tickets: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Ticket Booking Form Data:", formData);
  };

  return (
    <div className="h-screen font-display">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-4 rounded border border-rule bg-surface p-4 text-ink shadow"
      >
        <h2 className="mb-4 text-2xl font-bold text-pending">Book Match Tickets</h2>
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
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Match Location"
          required
          className={fieldClass}
        />
        <input
          type="date"
          name="matchDate"
          value={formData.matchDate}
          onChange={handleChange}
          required
          className={fieldClass}
        />
        <input
          type="number"
          name="tickets"
          value={formData.tickets}
          onChange={handleChange}
          min="1"
          max="10"
          placeholder="Number of Tickets"
          required
          className={fieldClass}
        />
        <div className="text-center">
          <button
            type="submit"
            className="h-8 w-40 rounded border-2 border-pending bg-pending text-center text-lg font-bold text-surface transition-opacity hover:opacity-90"
          >
            Book Tickets
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketBookingForm;
