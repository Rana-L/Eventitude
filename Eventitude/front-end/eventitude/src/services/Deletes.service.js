// Event Management
const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:3333/event/${eventId}`, {
      method: "DELETE",
      headers: {
        "X-Authorization": localStorage.getItem("session_token"),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting event ${eventId}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Err", error);
    return await Promise.reject(error);
  }
};

// Event Question Management

const deleteQuestion = async (questionId) => {
  try {
    const response = await fetch(
      `http://localhost:3333/question/${questionId}`,
      {
        method: "DELETE",
        headers: {
          "X-Authorization": localStorage.getItem("session_token"),
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error deleting event ${questionId}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Err", error);
    return await Promise.reject(error);
  }
};

const downvoteQuestion = (questionId) => {
  return fetch(
    `http://localhost:3333/question/${questionId}/vote`,
    {
      method: "DELETE",
      headers: {
        "X-Authorization": localStorage.getItem("session_token"),
        "Content-Type": "application/json",
      },
    }
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting event ${questionId}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.log("Err", error);
        return Promise.reject(error);
      })
  );
};

export const deletesService = {
  deleteEvent,
  deleteQuestion,
  downvoteQuestion,
};
