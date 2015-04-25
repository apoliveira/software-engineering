var fs = require("fs");

 if(!fs.existsSync("pdfs")){
     fs.mkdirSync("pdfs", 0766, function(err){
       if(err){ 
         console.log(err);
         response.send("ERROR! Can't make the directory! \n");    // echo the result back
       }
     });   
 }
