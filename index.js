/* 
 * Primary file for API
 *
 *
*/

// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Starting the HTTP server.
httpServer.listen(config.httpPort, function () {
    console.log('The server is listening on port ' + config.httpPort + ' on ' + config.envName + ' environment\n');
});

// All the srver logic for server(s)
var unifiedServer = function (req, res) {
    // Get the url and parse it
    var parsedURL = url.parse(req.url, true);

    // Get the path
    var path = parsedURL.pathname.toLocaleLowerCase();
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    var queryStringObject = parsedURL.query;

    // Get the http method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new stringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function(data) {
        buffer += decoder.end();

        //Choose the handler this request should go to
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request specified in the router
        chosenHandler( data, function(statusCode, payload) {
            // Use the status code called back by the handler, or default o 200
            statusCode = typeof(statusCode) == 'number' ? statusCode:200;

            // Use the payload called back the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload:{};

            // Convert the payload to string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the rquest
            console.log ('Request path:\n', trimmedPath);
            console.log ('\nRequest method:\n', method);
            console.log ('\nRequest query:\n', queryStringObject);
            console.log ('\nRequest headers:\n', headers);
            console.log ('\nRequest pay load:\n', buffer);
            console.log ('\nResponse status code:\n', statusCode);
            console.log ('\nResponse pay load:\n', payloadString);
        });

    });
};

// Define handlers
var handlers = {};

// Sample handler
handlers.hello = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(200, {'content' : 'Welcome from hello route handler...'});
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define request router
var router = {
    'hello': handlers.hello
};