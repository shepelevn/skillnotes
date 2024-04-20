const PREFIX = "http://localhost:3000/api/notes";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
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


  return req("", options);
};

export const getNote = (id) => {
  return req(`/${id}`);
};

export const archiveNote = {};

export const unarchiveNote = {};

export const editNote = (id, title, markdown) => {};

export const deleteNote = (id) => {};

export const deleteAllArchived = () => {};

export const notePdfUrl = (id) => {};
