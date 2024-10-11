const Project = require("../models/Projects");
const db = require("mongodb");
const mongoose = require('mongoose');
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
  delete projectObject._id;
  
  const project = new Project({
    ...projectObject,
    cover: `${req.protocol}://${req.get("host")}/pictures/${req.file.filename}`,
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

//Delete Project
exports.deleteProject = (req, res, next) => {
  Project.findOne({ _id: req.params.id })
    .then((project) => {
      console.log(project);

      // Vérifie si project.cover existe et contient au moins un élément
      if (project.cover && project.cover.length > 0) {
        const filename = project.cover[0].split("/pictures/")[1];
        
        fs.unlink(`pictures/${filename}`, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Erreur lors de la suppression du fichier: ", unlinkErr);
          }

          // Supprime le projet même si la suppression de l'image échoue
          Project.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Projet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error: "Impossible de supprimer le projet." }));
        });
      } else {
        // Si pas de cover, supprime simplement le projet
        Project.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Projet supprimé (sans image) !" });
          })
          .catch((error) => res.status(401).json({ error: "Impossible de supprimer le projet." }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Projet non trouvé." });
    });
};

//Modify Project
exports.modifyProject = (req, res, next) => {
  if (req.file) {
    console.log('Fichier reçu:', req.file);
  } else {
    console.log('Aucun fichier reçu');
  }
  let projectObject = undefined;
  if(req.file) {
    projectObject = {
      ...JSON.parse(req.body.project),
      cover: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
    }
  } else {
    projectObject = { ...JSON.parse(req.body.project) }
  }
  console.log(projectObject);
    Project.updateOne({ _id: req.params.id },{ ...projectObject, _id: req.params.id })
        .then((result) => {
          res.status(200).json({ message: "Projet modifié avec succès !" });
        })
        .catch((error) => {
          console.error("Erreur lors de la modification du projet:", error);
          res.status(400).json({ error: "Erreur lors de la modification du projet" });
        });
    };
    
  


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