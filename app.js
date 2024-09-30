const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compiler = require("compilex");
const options = { stats: true };
const path = require('path');

compiler.init(options);

// Serve the CodeMirror files from a relative path
app.use("/codemirror-5.65.18", express.static(path.join(__dirname, "codemirror-5.65.18")));
app.use(bodyParser.json());

// Serve the index.html file from a relative path
app.get("/", (req, res) => {
    compiler.flush(() => {
        console.log("File Deleted...."); 
    });
    res.sendFile(path.join(__dirname, "index.html")); // Changed to relative path
}); 

app.post("/compile", (req, res) => {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;

    try {
        let envData = { OS: "windows", cmd: "g++", options: { setTimeout: 10000 } }; // Default to C++

        if (lang === "C++" || lang === "C") {
            if (!input) {
                compiler.compileCPP(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileCPPWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Java") {
            envData = { OS: "windows" }; // Update environment for Java
            if (!input) {
                compiler.compileJava(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compileJavaWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        } else if (lang === "Python") {
            envData = { OS: "windows" }; // Update environment for Python
            if (!input) {
                compiler.compilePython(envData, code, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            } else {
                compiler.compilePythonWithInput(envData, code, input, (data) => {
                    res.send(data.output ? data : { output: "error" });
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ output: "error", message: "Internal Server Error" });
    }
});

// Start the server
app.listen(8080, () => {
    console.log("Server is Listening on port 8080...");
});
