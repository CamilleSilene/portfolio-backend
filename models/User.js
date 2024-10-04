const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//création d'un schéma de données avec les éléments requis et leur type attendu
//utilisation de la méthode Schema généré par Mongoose
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "L'adresse mail renseignée n'est pas valide"],
  },
  password: { type: String, required: true },
});

//utilisation du plugin de vérification du caractère unique de la donnée
userSchema.plugin(uniqueValidator);

//export du schéma pour le rendre disponible pour Express
//la méthode .model le rend utilisable
module.exports = mongoose.model("User", userSchema);
