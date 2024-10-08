const mongoose = require("mongoose");

//création d'un schéma de données avec les éléments reqis et leur type attendus
//utilisation de la méthode Schema généré par Mongoose
const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover: [{ type: String, required: false }],
  // pictures: [{ type: String, required: false }],
  link: { type: String, required: false},
  github: { type: String, required: true },
  tags: [{ type: String, required: true }],  
});

//export du schéma pour le rendre disponible pour Express
//la méthode .model le rend utilisable
module.exports = mongoose.model("Project", projectSchema);
