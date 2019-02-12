const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http);
var totalCurrentUsers = 0;
var inUseName = [];

app.use(cors());

app.get('/', (req, res, next) => {
    res.status(200).sendFile(__dirname + "\\index.html");
});

io.on("connection", (socket) => {
    totalCurrentUsers++;
    console.log(`Total Current Users: ${totalCurrentUsers}`);

    socket.on("msg", (obj) => {
        console.log(obj);
        obj.valid = true;
        for (let i = 0; i < inUseName.length; i++) {
            if (obj.username == inUseName[i]) {
                obj.valid = false;
            }
        }

        if (obj.valid && obj.username != "Anonymous") {
            inUseName.push(obj.username);
        }
        
        io.emit("msg", obj);
    });

    socket.on("disconnect", () => {
        totalCurrentUsers--;
        console.log(`Total Current Users: ${totalCurrentUsers}`);
    });
});

http.listen(80, () => {
    console.log(`Listening on PORT: 80`);
});