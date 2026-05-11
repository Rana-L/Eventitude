const getEvents = () => {
  const eventIds = Array.from({ length: 50 }, (_, i) => i + 1);
  const fetchPromises = eventIds.map((eventId) =>
    fetch(`http://localhost:3333/event/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching event ${eventId}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Error fetching event ${eventId}:`, error);
        return null;
      })
  );

  return Promise.all(fetchPromises)
    .then((events) => events.filter(Boolean))
    .catch((error) => {
      console.error("Error fetching events:", error);
      return Promise.reject(error);
    });
};

const getThreeEvents = () => {
  const eventIds = [4, 5, 6];
  const fetchPromises = eventIds.map((eventId) =>
    fetch(`http://localhost:3333/event/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching event ${eventId}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Error fetching event ${eventId}:`, error);
        return null;
      })
  );

  return Promise.all(fetchPromises)
    .then((events) => events.filter(Boolean))
    .catch((error) => {
      console.error("Error fetching events:", error);
      return Promise.reject(error);
    });
};

const getSingleEvent = (eventId) => {
  return fetch(`http://localhost:3333/event/${eventId}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

// Editting the event
const getEventById = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:3333/event/${eventId}`, {
      method: "GET",
      headers: {
        "X-Authorization": localStorage.getItem("session_token"),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching event ${eventId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

const searchEvent = () => {
  return fetch("http://localhost:3333/search")
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

export const getService = {
  getEvents,
  getThreeEvents,
  getSingleEvent,
  getEventById,
  searchEvent,
};
