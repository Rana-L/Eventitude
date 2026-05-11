const updateEvent = async (eventId, updatedEvent) => {
  try {
    const response = await fetch(`http://localhost:3333/event/${eventId}`, {
      method: "PATCH",
      headers: {
        "X-Authorization": localStorage.getItem("session_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error(`Error updating event ${eventId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    return Promise.reject(error);
  }
};

export const patchService = {
  updateEvent,
};
