'use strict'

const express = require('express')
const fileType = require('file-type')
const fs = require('fs')
var https = require('https')
const request = require('request');
const app = express()
const router = express.Router()
const cors = require('cors');
var Stream = require('stream').Transform

const port 	   = process.env.PORT || 8080;

//request.defaults({ rejectUnauthorized: false })
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

router.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    console.log("image path:", imagepath)
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime
    console.log("image type:", mime)

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
})


router.get('/sample_image/:imagename', (req, res) => {
    let imagename = req.params.imagename
    let imagepath = "http://images.pexels.com/photos/36764/marguerite-daisy-beautiful-beauty.jpg"
    /*
      http.request(imagepath, function(response) {                                        
        var data = new Stream();                                                    
      
        response.on('data', function(chunk) {                                       
          data.push(chunk);                                                         
        });                                                                         
      
        response.on('end', function() {                                             
          //fs.writeFileSync('image.png', data.read());    
          //let mime = fileType(image).mime
          res.writeHead(200, {'Content-Type': 'image/jpeg' })
          res.end(data.read(), 'binary')                           
        });                                                                         
      }).end();   
    */ 
  
    var options = {
      host: 'images.pexels.com',
      port: 443,
      path: '/photos/36764/marguerite-daisy-beautiful-beauty.jpg',
      method: 'GET',
      rejectUnauthorized: false,
      requestCert: false,
      agent: false
      };
  
    var http_req = https.request(options, function(http_res) {      
      //http_res.setEncoding('utf8');
      var data = new Stream();
      http_res.on('data', function (chunk) {
        data.push(chunk);    
      });
      http_res.on('end', function (chunk) {
        res.writeHead(200, {'Content-Type': 'image/jpeg' })        
        res.end(data.read(), 'binary')   
      });
  
    });
  
    http_req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
  
    http_req.end();
    
  });
  
router.get('/download_image/:imagename', (req, res) => {
    let imagename = req.params.imagename  
    var options = {
      host: 'previews.moonrider.xyz',
      port: 443,
      path: '/'+imagename+'?v=1',
      method: 'GET',
      rejectUnauthorized: false,
      requestCert: false,
      agent: false
    };
  
    var http_req = https.request(options, function(http_res) {      
      //http_res.setEncoding('utf8');
      var data = new Stream();
      http_res.on('data', function (chunk) {
        data.push(chunk);    
      });
      http_res.on('end', function (chunk) {
        res.writeHead(200, {'Content-Type': 'image/jpeg' })        
        res.end(data.read(), 'binary')   
      });
  
    });
  
    http_req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
  
    http_req.end();
    
  });

router.get('/sample_audio_proxy/:audioname', (req, res) => {
    let audiopath = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg"  
    
    request.get(audiopath)
    .on('error', (err) => {
        console.log("song error: ", err)
    })
    .on('response', () => {        
    })
    .pipe(res);
    
    
})
  
router.get('/sample_audio/:audioname', (req, res) => {
    let audioname = req.params.audioname
    let audiopath = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg"  
  
      var options = {
        host: 'upload.wikimedia.org',
        port: 443,
        path: '/wikipedia/commons/c/c8/Example.ogg',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: false,
        agent: false
      };
      
      var http_req = https.request(options, function(http_res) {      
        
        //var data = new Stream();
        res.writeHead(200, {'Content-Type': 'application/ogg',
                            'Transfer-Encoding': 'chunked' })     
        http_res.on('data', function (chunk) {
          //data.push(chunk);    
          res.write(chunk);
        });
        http_res.on('end', function (chunk) {             
          //res.end(data.read(), 'binary')   
          res.end()
        });
  
      });
      
      http_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      
      http_req.end();
  
  });

router.get('/download_audio_proxy/:audioname', (req, res) => {
    let audioname = req.params.audioname  
    let audiopath = 'https://previews.moonrider.xyz/'+audioname+'?v=1'
    request.get(audiopath)
    .on('error', (err) => {
        console.log("proxy song error: ", err)
    })
    .on('response', () => {
        
    })
    .pipe(res);
  
  });

router.get('/download_audio/:audioname', (req, res) => {
    let audioname = req.params.audioname  
  
      var options = {
        host: 'previews.moonrider.xyz',
        port: 443,
        path: '/'+audioname+'?v=1',
        method: 'GET',
        rejectUnauthorized: false,
        requestCert: false,
        agent: false
      };
      
      var http_req = https.request(options, function(http_res) {      
        //var data = new Stream();
        res.writeHead(200, {'Content-Type': 'application/ogg',
                            'Transfer-Encoding': 'chunked' })     
        http_res.on('data', function (chunk) {
          //data.push(chunk);    
          res.write(chunk);
        });
        http_res.on('end', function (chunk) {             
          //res.end(data.read(), 'binary')   
          res.end()
        });
  
      });
      
      http_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      
      http_req.end();
  
  });

/*
app.head('/*', cors(), (req, res) => {
});
*/

app.use(cors());

app.use('/', router)

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        console.error("req: ", req);
                
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
})


app.listen(port)
console.log(`App Runs on ${port}`)
