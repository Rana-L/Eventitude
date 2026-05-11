// User Management

// Register a new user
const signup = (data) => {
  return fetch("http://localhost:3333/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        throw "Bad request. Please try again.";
      } else {
        alert(response.status);
        throw new Error("Registration failed. Please try again.");
      }
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

const login = (email, password) => {
  return fetch("http://localhost:3333/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        throw "Bad request. Please try again.";
      } else {
        throw new Error("Login failed. Please try again.");
      }
    })
    .then((rJson) => {
      localStorage.setItem("user_id", rJson.user_id);
      localStorage.setItem("session_token", rJson.session_token);
      return rJson;
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

const logout = () => {
  return fetch("http://localhost:3333/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("session_token");
        return;
      } else if (response.status === 401) {
        throw "Unauthorized. Not logged in.";
      } else {
        throw new Error("Logout failed. Please try again.");
      }
    })
    .catch((error) => {
      console.log("Err", error);
      return Promise.reject(error);
    });
};

// Event Management

const createEvent = (eventData) => {
  return fetch("http://localhost:3333/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Creating event failed. Please try again.");
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

const attendEvent = async (attendee) => {
  try {
    const response = await fetch(
      `http://localhost:3333/event/${attendee.eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": localStorage.getItem("session_token"),
        },
        body: JSON.stringify({
          name: attendee.name,
          email: attendee.email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error registering for event ${attendee.eventId}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error registering for event ${attendee.eventId}:`, error);
    return Promise.reject(error);
  }
};

//Event Question Management

const createQuestion = (eventId, questionData) => {
  return fetch(`http://localhost:3333/event/${eventId}/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": localStorage.getItem("session_token"),
    },
    body: JSON.stringify(questionData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Creating question failed. Please try again.");
      }
    })
    .then((resJson) => {
      return resJson;
    })
    .catch((error) => {
      console.error("Error creating question:", error);
      return Promise.reject(error);
    });
};

const upvoteQuestion = async (questionId) => {
  try {
    const response = await fetch(
      `http://localhost:3333/question/${questionId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": localStorage.getItem("session_token"),
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

export const postsService = {
  signup,
  login,
  logout,
  createEvent,
  attendEvent,
  createQuestion,
  upvoteQuestion,
};
