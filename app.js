'use strict'

const express = require('express')
const fileType = require('file-type')
const fs = require('fs')
var https = require('https')
const app = express()
const router = express.Router()
var Stream = require('stream').Transform

const port 	   = process.env.PORT || 8080;

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
        //http_res.setEncoding('utf8');
        var data = new Stream();
        http_res.on('data', function (chunk) {
          data.push(chunk);    
        });
        http_res.on('end', function (chunk) {
          res.writeHead(200, {'Content-Type': 'application/ogg' })        
          res.end(data.read(), 'binary')   
        });
  
      });
      
      http_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      
      http_req.end();
  
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
        //http_res.setEncoding('utf8');
        var data = new Stream();
        http_res.on('data', function (chunk) {
          data.push(chunk);    
        });
        http_res.on('end', function (chunk) {
          res.writeHead(200, {'Content-Type': 'application/ogg' })        
          res.end(data.read(), 'binary')   
        });
  
      });
      
      http_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      
      http_req.end();
  
  });


app.use('/', router)

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        console.error("req: ", req);
                
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})


app.listen(port)
console.log(`App Runs on ${port}`)
