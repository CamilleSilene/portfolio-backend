const mongoose = require("mongoose");

//création d'un schéma de données avec les éléments reqis et leur type attendus
//utilisation de la méthode Schema généré par Mongoose
const projectSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  pictures: { type: String, required: true },
  link: { type: String, required: true},
  github: { type: Number, required: true },
  tags: { type: String, required: true },  
});

//export du schéma pour le rendre disponible pour Express
//la méthode .model le rend utilisable
module.exports = mongoose.model("Project", projectSchema);
