const http = require("http");
const fs = require("fs");
const path = require("path");
const validateFormFields = require("./validationRules/formValidation");

const PORT = 5050;

const databasePath = path.join(__dirname, "database.json");


const server = http.createServer((req, res) => {

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    if (req.method === "GET" && req.url === "/") {
        fs.readFile(path.join(__dirname, "public", "index.html"), (error, content) => {
            if (error) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                })
                res.end("Internal Server Error")
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                })
                res.end(content);
            }
        })
    } else if (req.method === "GET" && req.url.startsWith("/public/")) {
        const filePath = path.join(__dirname, req.url);

        const extname = path.extname(filePath);

        let contentType = "text/plain"

        switch (extname) {
            case ".html":
                contentType = "text/html";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".js":
                contentType = "application/javascript";
                break;
            default:
                contentType = "text/plain";
                break;
        }

        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Page Not Found")
            } else {
                res.writeHead(200, { "Content-Type": contentType });
                res.end(content);
            }
        });

    } else if (req.method === "POST" && req.url === "/submit-form") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        })

        req.on("end", () => {
            const formData = JSON.parse(body);

            const validationErrors = validateFormFields(formData);

            if (validationErrors.length > 0) {
                res.writeHead(400, {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({
                    validationErrors
                }))
                return;
            }

            fs.readFile(databasePath, (error, data) => {
                if (error) {
                    res.writeHead(500, {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*'
                    })
                    res.end(JSON.stringify({
                        error: "Internal Server Error"
                    }))
                    
                    return;
                }

                let database = [];

                if (data.length > 0) {
                    database = JSON.parse(data);
                }

                database.push(formData);

                fs.writeFile(databasePath, JSON.stringify(database, null, 2), (error) => {
                    if (error) {
                        res.writeHead(500, {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*'
                        })
                        
                        res.end(JSON.stringify({
                            error: "Internal Server Error"
                        }))

                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*'
                    })

                    res.end(JSON.stringify({
                        message: "Form data submitted successfully",
                        data: formData
                    }))
                })
            })
        })
    } else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        })
        res.end("Page Not Found")
    }
})

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});