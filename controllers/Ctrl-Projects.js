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
  const projectObject = JSON.parse(req.body.project);
  delete projectObject._id;
  delete projectObject._userId;

  const project = new Project({
    ...projectObject,
    userId: req.auth.userId,
    pictures: `${req.protocol}://${req.get("host")}/pictures/${
      req.file.filename
    }`,
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
      if (project.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = project.pictures.split("/pictures/")[1];
        fs.unlink(`pictures/${filename}`, () => {
          Project.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


exports.modifyProject = (req, res, next) => {
  const projectObject = req.file
    ? {
        ...JSON.parse(req.body.project),
        pictures: `${req.protocol}://${req.get("host")}/pictures/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete projectObject._userId;
  Project.findOne({ _id: req.params.id })
    .then((project) => {
      if (project.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Project.updateOne(
          { _id: req.params.id },
          { ...projectObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Projet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


