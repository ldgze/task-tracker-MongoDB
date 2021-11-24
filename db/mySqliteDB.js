const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function getTasks(query, page, pageSize) {
  console.log("getTasks", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Task
    WHERE title LIKE @query
    ORDER BY createDate DESC
    LIMIT @pageSize
    OFFSET @offset;
    `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getTasksCount(query) {
  console.log("getTasks", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Task
    WHERE title LIKE @query;
    `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getTaskByID(taskID) {
  console.log("getTaskByID", taskID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Task
    WHERE taskID = @taskID;
    `);

  const params = {
    "@taskID": taskID,
  };

  try {
    return await stmt.get(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function updateTaskByID(taskID, task) {
  console.log("updateTaskByID", taskID, task);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Task
    SET
      title = @title,
      dueDate = @dueDate,
      URL = @URL,
      priority = @priority

    WHERE
       taskID = @taskID;
    `);

  const params = {
    "@taskID": taskID,
    "@title": task.title,
    "@dueDate": task.dueDate,
    "@URL": task.URL,
    "@priority": task.priority,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function finishTaskByID(taskID) {
  console.log("finishTaskByID", taskID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Task
    SET
      status = 1

    WHERE
       taskID = @taskID;
    `);

  const params = {
    "@taskID": taskID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function deleteTaskByID(taskID) {
  console.log("deleteTaskByID", taskID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM Task
    WHERE
       taskID = @taskID;
    DELETE FROM Tag_Task
    WHERE
       taskID = @taskID;
    `);

  const params = {
    "@taskID": taskID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function insertTask(task) {
  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    Task(title, dueDate, URL, priority, createDate, status)

    VALUES(@title, 
    @dueDate, 
    @URL, 
    @priority,
    CURRENT_DATE,
    "0")
    `);

  try {
    return await stmt.run({
      "@title": task.title,
      "@dueDate": task.dueDate,
      "@URL": task.URL,
      "@priority": task.priority,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getTagsByTaskID(taskID) {
  console.log("getTagsByTaskID", taskID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Tag
    JOIN Tag_Task
    ON Tag_Task.tagID = Tag.tagID
    JOIN Task
    ON Tag_Task.taskID = Task.taskID
    WHERE Tag_Task.taskID = @taskID;
    `);

  const params = {
    "@taskID": taskID,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function addTagIDToTaskID(taskID, tagID) {
  console.log("addTagIDToTaskID", taskID, tagID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    INSERT INTO
    Tag_Task(taskID, tagID)
    VALUES (@taskID, @tagID);
    `);

  const params = {
    "@taskID": taskID,
    "@tagID": tagID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function removeTagIDFromTaskID(taskID, tagID) {
  console.log("removeTagIDFromTaskID", taskID, tagID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM
    Tag_Task
    WHERE taskID=@taskID AND tagID=@tagID;
    `);

  const params = {
    "@taskID": taskID,
    "@tagID": tagID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getTags(query, page, pageSize) {
  console.log("getTags", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Tag
    WHERE name LIKE @query
    ORDER BY name
    LIMIT @pageSize
    OFFSET @offset;
    `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getTagsCount(query) {
  console.log("getTags", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Tag
    WHERE name LIKE @query;
    `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function deleteTagByID(tagID) {
  console.log("deleteReferenceByID", tagID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM Tag
    WHERE
       tagID = @tagID;
    `);

  const params = {
    "@tagID": tagID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function insertTag(tag) {
  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    Tag
    VALUES (@tagID, @name);`);

  try {
    return await stmt.run({
      "@name": tag.name,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getLists(query, page, pageSize) {
  console.log("getLists", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM List
    WHERE name LIKE @query
    ORDER BY name
    LIMIT @pageSize
    OFFSET @offset;
    `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function getListsCount(query) {
  console.log("getLists", query);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM List
    WHERE name LIKE @query;
    `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function deleteListByID(listID) {
  console.log("deleteListByID", listID);

  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM List
    WHERE
       listID = @listID;
    `);

  const params = {
    "@listID": listID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

async function insertList(list) {
  const db = await open({
    filename: "./db/taskDB.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    List
    VALUES (@listID, @name);`);

  try {
    return await stmt.run({
      "@name": list.name,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

module.exports.getTasks = getTasks;
module.exports.getTasksCount = getTasksCount;
module.exports.insertTask = insertTask;
module.exports.getTaskByID = getTaskByID;
module.exports.updateTaskByID = updateTaskByID;
module.exports.deleteTaskByID = deleteTaskByID;
module.exports.getTagsByTaskID = getTagsByTaskID;
module.exports.addTagIDToTaskID = addTagIDToTaskID;
module.exports.removeTagIDFromTaskID = removeTagIDFromTaskID;
module.exports.getTags = getTags;
module.exports.getTagsCount = getTagsCount;
module.exports.getLists = getLists;
module.exports.getListsCount = getListsCount;
module.exports.deleteListByID = deleteListByID;
module.exports.insertList = insertList;
module.exports.deleteTagByID = deleteTagByID;
module.exports.insertTag = insertTag;
module.exports.finishTaskByID = finishTaskByID;
