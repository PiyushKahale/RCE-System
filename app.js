const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compiler = require("compilex");
const options = { stats: true };


compiler.init(options);

 
app.use("/codemirror-5.65.18", express.static("D:/Projects/RCE_System/codemirror-5.65.18"))
app.use(bodyParser.json());

app.get("/", (req, res) => {
    compiler.flush(() => {
        console.log("File Deleted....");
    })
    res.sendFile("D:/Projects/RCE_System/index.html");
}); 

app.post("/compile", (req, res) => {
    var code = req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;

    try{
        if(lang == "C++" || lang == "C") {
            if(!input) {
                // for windows
                var envData = { OS : "windows" , cmd : "g++", options:{setTimeout: 10000 }}; // (uses g++ command to compile )
                compiler.compileCPP(envData , code , function (data) {
                    if(data.output) {
                        res.send(data);
                    } else {
                        res.send({output: "error"});
                    }
                });
            } else {
                //for windows  
                var envData = { OS : "windows" , cmd : "g++", options:{setTimeout: 10000 }}; // (uses g++ command to compile )
                compiler.compileCPPWithInput(envData , code , input , function (data) {
                    if(data.output) {
                        res.send(data);
                    } else {
                        res.send({output: "error"});
                    }
                });
            }
        }
        else if(lang == "Java") {
            if(!input) {
                var envData = { OS : "windows" }; 
                compiler.compileJava( envData , code , function(data){
                    if(data.output) {
                        res.send(data);
                    }else {
                        res.send({output: "error"});
                    }
                }); 
            } else {
                    //if windows  
                var envData = { OS : "windows"}; 
                compiler.compileJavaWithInput( envData , code , input ,  function(data){
                    if(data.output) {
                        res.send(data);
                    }else {
                        res.send({output: "error"});
                    }
                });
            }
        }
        else if(lang == "Python") {
            if(!input) {
                var envData = { OS : "windows"}; 
                compiler.compilePython( envData , code , function(data){
                    if(data.output) {
                        res.send(data);
                    } else {
                        res.send({output: "error"});
                    }
                });    
            } else {
                var envData = { OS : "windows"};  
                compiler.compilePythonWithInput( envData , code , input ,  function(data){
                   if(data.output) {
                    res.send(data);
                   } else {
                    res.send({output: "error"});
                   }
                });
            }
        }
    } catch(err) {
        console.log(err);
        console.log("Error Occurs...");
    }    
})

app.listen(8080, (req, res) => {
    console.log("Server is Listening on port 8080...");
});