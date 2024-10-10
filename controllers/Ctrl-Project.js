const Project = require("../models/Projects");
const db = require("mongodb");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

//Get All Projects
exports.getAllProject = (req, res, next) => {
  Project.find()
    .then((projects) => res.status(200).json(projects))
    .catch((error) => res.status(400).json({ error }));
};

//Get One Project
exports.getOneProject = (req, res, next) => {
  Project.findOne({ _id: req.params.id })
    .then((project) => res.status(200).json(project))
    .catch((error) => res.status(404).json({ error }));
};


//Create Project
exports.createProject = (req, res, next) => {
  const projectObject = JSON.parse(req.body.project);
  console.log(req.body)
  delete projectObject._id;
  // console.log(req.file.filename)
  const project = new Project({
    ...projectObject,
    
    cover: `${req.protocol}://${req.get("host")}/pictures/${req.file.filename}`,
  });
  console.log(project.cover);
  project
    .save()
    .then(() => {
      res.status(201).json({ message: "Projet enregistré" });
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'optimisation de l'image :",
        error
      );
      res.status(500).json({
        error: "Une erreur s'est produite lors de l'optimisation de l'image.",
      });
    });
};

//Delete Project
exports.deleteProject = (req, res, next) => {
  console.log("delete project ",req.params.id)
  Project.findOne({ _id: req.params.id })
    .then((project) => {
      console.log(project);
        const filename = project.cover[0].split("/pictures/")[1];
        fs.unlink(`pictures/${filename}`, () => {
          Project.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Projet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error: "cant delete project" }));
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "project not found" });
    });
};

//Modify Project
exports.modifyProject = (req, res, next) => {
  console.log(req.body.project);
  const projectObject = req.file ?
{
  ...JSON.parse(req.body.project),
  cover: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`,
} : {...req.body};
  console.log(projectObject)
  Project.updateOne({ _id: req.params.id },{ ...projectObject, _id: req.params.id }, {upsert: true})
        .then(() => res.status(200).json({ message: "Projet modifié!" }))
        .catch((error) => res.status(401).json({ error }));
      }
    
  


//Get All Tags
exports.getAllTags = (req, res, next) => {
  Project.find().distinct("tags")
  .then((tags) => res.status(200).json(tags));
};


//Get Projects by tag
exports.getProjectsByTag = (req, res, next) => {
  Project.find({ tags: req.params.tag })
    .then((tag) => res.status(200).json(tag))
    .catch((error) => res.status(404).json({ error }));
};