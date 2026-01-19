const fs = require("fs-extra");
const path = require("path");

console.log(
  "-------------------START OF BUILD ENV SCRIPT-------------------\n"
);
console.log("Target ENV : ", process.env.target + "\n");

const NODE_ENV = process.env.target || "dev";
const sourceName = ".env." + NODE_ENV;
const theSourceFile = path.join(path.resolve(), sourceName);
const targetName = ".env";
let theDestinationFile = path.join(path.resolve(), targetName);
let xcconfigFile = path.join(path.resolve(), "ios/tmp.xcconfig");

fs.stat(theSourceFile, (error) => {
  if (error == null) {
    fs.readFile(theSourceFile, (_, buf) => {
      if (typeof buf !== "undefined") {
        console.log(`You have hit "${NODE_ENV}" environment\n`);
        fs.writeFile(theDestinationFile, buf.toString(), (err) => {
          if (err) {
            console.log("ERROR " + err);
            throw err;
          }
          console.log(
            "-------------------END OF BUILD ENV SCRIPT-------------------\n"
          );
        });
        fs.writeFile(xcconfigFile, buf.toString(), (err) => {
          if (err) {
            console.log("ERROR " + err);
            throw err;
          }
        });
      } else {
        console.log("ENV File " + theSourceFile + " does not exist\n");
        console.log(
          "-------------------END OF BUILD SCRIPT-------------------\n"
        );
      }
    });
  } else if (error.code === "ENOENT") {
    console.log("else ENV File " + theSourceFile + " does not exist\n");
    console.log("-------------------END OF BUILD SCRIPT-------------------\n");
  } else {
    console.log("Some other error: ", error.code);
  }
});
