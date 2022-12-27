var parseString = require('xml2js').parseString;
const fs =  require('fs');

module.exports = {
    processPackageFile: function(packageFilePath){
        var listOfComp=[];
        var packageXML = fs.readFileSync(packageFilePath, (err, data) => {if (err) throw err;});
        parseString(packageXML, function (err, result) {
            var types = result['Package'];    
            console.log('types ' +types.types.length);
            var arrOfTypes = types.types;
            if(arrOfTypes.length>0){
              var icounter=0
              for(i=0;i<arrOfTypes.length;i++){            
                var arrOfMem = arrOfTypes[i].members;
                var typeName=arrOfTypes[i].name;
                console.log('typeName '+typeName);
                console.log('arrOfMem.length '+arrOfMem.length);
                if(arrOfMem.length>0){
                  var arrOfComp = [];
                  for(j=0;j<arrOfMem.length;j++){
                    var jcounter=0;
                    console.log('arrOfMem['+j+'] '+arrOfMem[j].api[0]);
                    if(typeName=='sfmtargetmanager'){
                      //console.log('arrOfComp.length '+arrOfComp.length);
                      if(arrOfComp.length>= 1){
                        listOfComp[icounter++]=arrOfComp; 
                        arrOfComp = [];
                        jcounter=0;
                      }
                    }
                    arrOfComp[jcounter++]=arrOfMem[j].api[0];
                  }
                  listOfComp[icounter++]=arrOfComp;
                }
              }
            }
        });
        return listOfComp;
    }
}


