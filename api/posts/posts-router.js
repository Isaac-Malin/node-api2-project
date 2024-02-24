// implement your posts router here
const express = require('express')
const posts = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
  posts.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  posts.findById(id)
    .then(post => {
      if(!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

router.get('/:id/comments', (req, res) => {
  const { id } = req.params
  posts.findCommentById(id)
    .then(post => {
      if(!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ message: "The comments information could not be retrieved"})
    })
})

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post"})
  }
  posts.insert(req.body)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({message: "There was an error while saving the post to the database"})
    })
})

router.put('/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post"})
  }
  posts.update(req.params.id, req.body)
    .then(post => {
      if(!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ message: "The post information could not be modified" })
    })
})

router.delete('/:id', (req, res) => {
  posts.remove(req.params.id)
    .then(post => {
      if(!post) {
        return res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ message: "The post could not be removed" })
    })
})
module.exports = router