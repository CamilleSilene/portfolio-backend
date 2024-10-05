const Project = require("../models/Projects");
const fs = require("fs");


exports.getAllProject = (req, res, next) => {
  Project.find()
    .then((projects) => res.status(200).json(projects))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneProject = (req, res, next) => {
  Project.findOne({ _id: req.params.id })
    .then((project) => res.status(200).json(project))
    .catch((error) => res.status(404).json({ error }));
};

exports.createProject = (req, res, next) => {
  const projectObject = req.body;
  delete projectObject._id;

  const project = new Project({
    ...projectObject,
  });
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

exports.deleteProject = (req, res, next) => {
  Project.findOne({ _id: req.params.id })
    .then((project) => {
      Project.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({ message: "Objet supprimé !" });
      })
      .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


exports.modifyProject = (req, res, next) => {
  const projectObject = { ...req.body };

  Project.findOne({ _id: req.params.id })
    .then((project) => {
        Project.updateOne(
          { _id: req.params.id },
          { ...projectObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Projet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    )
    .catch((error) => {
      res.status(400).json({ error });
    });
};


