//import du package http de Node
const http = require("http");

const app = require("./app");

//fonction qui renvoie un port valide, qu'il soit fourni sous la forme de numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//process.env.PORT est utilisé si le port 4000 n'est pas disponible
const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

//fonction qui recherche les erreurs et les gère
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//fonction appelée à chaque requête
//paramètre fonction app qui utilise express
//utilisation de la méthode end pour renvoyer une réponse string
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

//écouteur d'événement consignant le port ou canal nommé sur lequel le serveur s'exécute
server.listen(port);
