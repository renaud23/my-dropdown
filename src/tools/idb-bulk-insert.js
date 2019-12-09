const BULK_LIMIT = 300;

/* */
const pushTask = (store, transaction) => ([first, ...rest] = []) => {
  if (first) {
    const request = store.add(first);
    request.onsuccess = () => {
      if (rest.length) {
        pushTask(store, transaction)(rest);
      }
    };

    request.onerror = e => {
      throw e;
    };
  }
};

/* */
const split = (entities, limit = BULK_LIMIT) => {
  return entities.reduce(
    ([f, ...r], n, i) => {
      return (i + 1) % limit === 0 ? [[n], f, ...r] : [[n, ...f], ...r];
    },
    [[]]
  );
};

/* */
const bulkPush = (db, name, hook) => ([first, ...rest], i = 0) => {
  try {
    if (first) {
      console.debug("bulk", i, first.length);
      const transaction = db.transaction(name, "readwrite");
      const store = transaction.objectStore(name);
      pushTask(store, transaction)(first);
      transaction.oncomplete = () => {
        bulkPush(db, name, hook)(rest, i + 1);
      };
      transaction.onerror = e => {
        throw e;
      };
    } else {
      hook();
    }
  } catch (e) {
    throw e;
  }
};

/* */
export default (db, store, hook = () => null) => (entities = []) => {
  const lots = split(entities, BULK_LIMIT);
  return new Promise((resolve, reject) => {
    try {
      bulkPush(db, store, hook)(lots);
    } catch (e) {
      reject(e);
    }
  });
};
