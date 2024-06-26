const API_ROUTE_PREFIX = "/api/notes";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch(getApiUrl(url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        }),
  );
};

export const getNotes = ({ age, search, page } = {}) => {
  return req(`?age=${age}&search=${search}&page=${page}`);
};

export const createNote = (title, markdown) => {
  const options = {
    method: "POST",
    body: {
      title,
      markdown,
    },
  };

  return req("", options);
};

export const getNote = (id) => {
  return req(`/${id}`);
};

export const archiveNote = (id) => {
  const options = {
    method: "POST",
  };

  return req(`/${id}/archive`, options);
};

export const unarchiveNote = (id) => {
  const options = {
    method: "POST",
  };

  return req(`/${id}/unarchive`, options);
};

export const editNote = (id, title, markdown) => {
  const options = {
    method: "PUT",
    body: {
      title,
      markdown,
    },
  };

  return req(`/${id}`, options);
};

export const deleteNote = (id) => {
  const options = {
    method: "DELETE",
  };

  return fetch(getApiUrl(`/${id}`), options);
};

export const deleteAllArchived = () => {
  const options = {
    method: "DELETE",
  };

  return fetch(getApiUrl("/archived"), options);
};

const getApiUrl = (route) => {
  return window.location.origin + API_ROUTE_PREFIX + route;
};

// export const notePdfUrl = (id) => {};
