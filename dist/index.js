"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var ws_1 = __importDefault(require("ws"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var node_sass_1 = __importDefault(require("node-sass"));
var DBHandle_1 = __importDefault(require("./handlers/DBHandle"));
var CQHandle_1 = __importDefault(require("./handlers/CQHandle"));
var config_1 = __importDefault(require("./configs/config"));
var app = express_1.default();
// Custom listening port
var http_port = config_1.default.http_port;
var ws_port = config_1.default.ws_port;
// Set ejs as default template engine
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Body parser
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Resolve static directory: public
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use('/', require('./routes/main'));
app.use('/tata', require('./routes/tata'));
// Watch scss change
fs_1.default.exists(path_1.default.join(__dirname, 'scss'), function (ext) {
    if (ext) {
        var watch = fs_1.default.watch(path_1.default.join(__dirname, 'scss'));
        watch.on('change', function (type, filename) {
            setTimeout(function () {
                var suffix = path_1.default.extname(filename);
                var outputName = path_1.default.join(__dirname, '../public/assets/css', path_1.default.basename(filename, suffix) + '.css');
                node_sass_1.default.render({
                    file: path_1.default.join(__dirname, 'scss', filename),
                    outFile: outputName,
                    outputStyle: 'compressed',
                    sourceMap: true
                }, function (err, result) {
                    if (err) {
                        console.log('[Error] sass render err ->', err);
                    }
                    else {
                        fs_1.default.writeFile(outputName, result.css, function (err) {
                            if (err) {
                                console.log('[Error] sass save err ->', err);
                            }
                        });
                    }
                });
            }, 3000);
        });
    }
});
console.log('\
  __    __  _   _     _   _____   _____   _____  \n\
  \\ \\  / / | | | |   / / |  _  \\ /  _  \\ |_   _| \n\
   \\ \\/ /  | | | |  / /  | |_| | | | | |   | |   \n\
    }  {   | | | | / /   |  _  { | | | |   | |   \n\
   / /\\ \\  | | | |/ /    | |_| | | |_| |   | |   \n\
  /_/  \\_\\ |_| |___/     |_____/ \\_____/   |_|   \n');
// Get connection with Database
DBHandle_1.default.then(function () {
    // Server listening
    var server = http_1.default.createServer(app);
    if (http_port !== ws_port) {
        server.listen(http_port, function () {
            console.log('[Debug] XivBot listening on port: %s', http_port);
            // WebSocket Server
            var wss = new ws_1.default.Server({
                port: ws_port
            }, function () {
                console.log('[Debug] XivBot websocket listening on port: %s', ws_port);
                CQHandle_1.default(wss);
            });
        });
    }
    else {
        var wss_1 = new ws_1.default.Server({
            noServer: true
        });
        CQHandle_1.default(wss_1);
        server.on('upgrade', function upgrade(request, socket, head) {
            wss_1.handleUpgrade(request, socket, head, function done(ws) {
                wss_1.emit('connection', ws, request);
            });
        });
        server.listen(http_port, function () {
            console.log('[Debug] XivBot listening on port: %s', http_port, ', websocket is the same port.');
        });
    }
}).catch(function (err) {
    console.log('[Error]', err);
});
