// implement your posts router here
const express = require("express");
const posts = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  posts
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  posts
    .findById(id)
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
      res.status(200).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist"})
    } else {
      const messages = await posts.findPostComments(req.params.id)
      res.json(messages)
    }
  } catch (err) {
    res.status(500).json({ message: "The comments information could not be retrieved"})
  }
});

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }
  posts
    .insert(req.body)
    .then(({ id }) => {
      return posts.findById(id);
    })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          message: "There was an error while saving the post to the database",
        });
    });
});

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    posts
      .findById(req.params.id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return posts.update(req.params.id, req.body);
        }
      })
      .then((data) => {
        if (data) {
          return posts.findById(req.params.id);
        }
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "The post information could not be modified" });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await posts.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await posts.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

module.exports = router;
