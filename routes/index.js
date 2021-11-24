const express = require("express");
const router = express.Router();

const myDb = require("../db/mySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/tasks");
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
// router.get("/references", async (req, res, next) => {
//   const query = req.query.q || "";
//   const page = +req.query.page || 1;
//   const pageSize = +req.query.pageSize || 24;
//   const msg = req.query.msg || null;
//   try {
//     let total = await myDb.getReferencesCount(query);
//     let references = await myDb.getReferences(query, page, pageSize);
//     res.render("./pages/index", {
//       references,
//       query,
//       msg,
//       currentPage: page,
//       lastPage: Math.ceil(total / pageSize),
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/tasks", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getTasksCount(query);
    let tasks = await myDb.getTasks(query, page, pageSize);
    res.render("./pages/index", {
      tasks,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// router.get("/references/:reference_id/edit", async (req, res, next) => {
//   const reference_id = req.params.reference_id;

//   const msg = req.query.msg || null;
//   try {
//     let ref = await myDb.getReferenceByID(reference_id);
//     let authors = await myDb.getAuthorsByReferenceID(reference_id);

//     console.log("edit reference", {
//       ref,
//       authors,
//       msg,
//     });

//     res.render("./pages/editReference", {
//       ref,
//       authors,
//       msg,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

router.get("/tasks/:taskID/edit", async (req, res, next) => {
  const taskID = req.params.taskID;

  const msg = req.query.msg || null;
  try {
    let task = await myDb.getTaskByID(taskID);
    let tags = await myDb.getTagsByTaskID(taskID);

    console.log("edit task", {
      task,
      tags,
      msg,
    });

    res.render("./pages/editTask", {
      task,
      tags,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

// router.post("/references/:reference_id/edit", async (req, res, next) => {
//   const reference_id = req.params.reference_id;
//   const ref = req.body;

//   try {
//     let updateResult = await myDb.updateReferenceByID(reference_id, ref);
//     console.log("update", updateResult);

//     if (updateResult && updateResult.changes === 1) {
//       res.redirect("/references/?msg=Updated");
//     } else {
//       res.redirect("/references/?msg=Error Updating");
//     }
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/tasks/:taskID/edit", async (req, res, next) => {
  const taskID = req.params.taskID;
  const task = req.body;

  try {
    let updateResult = await myDb.updateTaskByID(taskID, task);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/tasks/?msg=Updated");
    } else {
      res.redirect("/tasks/?msg=Error Updating");
    }
  } catch (err) {
    next(err);
  }
});

// router.post("/references/:reference_id/addAuthor", async (req, res, next) => {
//   console.log("Add author", req.body);
//   const reference_id = req.params.reference_id;
//   const author_id = req.body.author_id;

//   try {
//     let updateResult = await myDb.addAuthorIDToReferenceID(
//       reference_id,
//       author_id
//     );
//     console.log("addAuthorIDToReferenceID", updateResult);

//     if (updateResult && updateResult.changes === 1) {
//       res.redirect(`/references/${reference_id}/edit?msg=Author added`);
//     } else {
//       res.redirect(`/references/${reference_id}/edit?msg=Error adding author`);
//     }
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/tasks/:taskID/addTag", async (req, res, next) => {
  console.log("Add Tag", req.body);
  const taskID = req.params.taskID;
  const tagID = req.body.tagID;

  try {
    let updateResult = await myDb.addTagIDToTaskID(taskID, tagID);
    console.log("addTagIDToTaskID", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect(`/tasks/${taskID}/edit?msg=Tag added`);
    } else {
      res.redirect(`/tasks/${taskID}/edit?msg=Error adding tag`);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:taskID/removeTag/:tagID", async (req, res, next) => {
  console.log("Remove Tag", req.body);
  const taskID = req.params.taskID;
  const tagID = req.params.tagID;

  try {
    let updateResult = await myDb.removeTagIDFromTaskID(taskID, tagID);
    console.log("removeTagIDFromTaskID", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect(`/tasks/${taskID}/edit?msg=Tag removed`);
    } else {
      res.redirect(`/tasks/${taskID}/edit?msg=Error removing tag`);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:taskID/delete", async (req, res, next) => {
  const taskID = req.params.taskID;

  try {
    let deleteResult = await myDb.deleteTaskByID(taskID);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.changes === 1) {
      res.redirect("/tasks/?msg=Deleted");
    } else {
      res.redirect("/tasks/?msg=Error Deleting");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:taskID/finish", async (req, res, next) => {
  const taskID = req.params.taskID;

  try {
    let finishResult = await myDb.finishTaskByID(taskID);
    console.log("finish", finishResult);

    if (finishResult && finishResult.changes === 1) {
      res.redirect("/tasks/?msg=Finished");
    } else {
      res.redirect("/tasks/?msg=Error Fiishing");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/createTask", async (req, res, next) => {
  const task = req.body;

  try {
    const insertRes = await myDb.insertTask(task);

    console.log("Inserted", insertRes);
    res.redirect("/tasks/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/tags", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getTagsCount(query);
    let tags = await myDb.getTags(query, page, pageSize);
    console.log({ tags });
    console.log({ total });
    res.render("./pages/tags", {
      tags,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/tags/:id/delete", async (req, res, next) => {
  const id = req.params.id;
  try {
    await myDb.deleteTagByID(id);
    res.redirect("/tags");
  } catch (err) {
    next(err);
  }
});

router.post("/createTag", async (req, res, next) => {
  const tag = req.body;

  try {
    const insertTag = await myDb.insertTag(tag);

    console.log("Inserted", insertTag);
    res.redirect("/tags/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/lists", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getListsCount(query);
    let lists = await myDb.getLists(query, page, pageSize);
    console.log({ lists });
    console.log({ total });
    res.render("./pages/lists", {
      lists,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/lists/:listID/delete", async (req, res, next) => {
  const listID = req.params.listID;
  try {
    await myDb.deleteListByID(listID);
    res.redirect("/lists");
  } catch (err) {
    next(err);
  }
});

router.post("/createList", async (req, res, next) => {
  const list = req.body;

  try {
    const insertList = await myDb.insertList(list);

    console.log("Inserted", insertList);
    res.redirect("/lists/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;
