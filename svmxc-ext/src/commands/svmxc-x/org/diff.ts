//To Run this --> bin/dev svmxc-x:clone -x plugin_2@svmxc-ext.com -u deepak.a@5245trial.com
//import { promisify } from "util";
import { compare, Options } from 'dir-compare';
import { flags,SfdxCommand } from '@salesforce/command';
import { execSync } from 'child_process';
var fs = require('fs');


export default class Diff extends SfdxCommand {
  static description = 'Compare the 2 servicemax orgs for config';
  public static args = [];
  protected static flagsConfig = {
    deployusername: flags.string({
      char: 'x',
      description: 'Username or alias of Target Org ',
      required: true
    })
  };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = false;
  
    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;
  

  async run(): Promise<void> {
    console.log('Source Username '+this.flags.targetusername);
    console.log('Target Username '+this.flags.deployusername);



    //let compNames:string[] =['checklist','dvr','expression','mapping','opdoc','transaction','wizard','inventory','mobilepermission','apppermission','configprofile','mobileconfig'];
    let compNames:string[] =['checklist','dvr','expression','mapping','opdoc','inventory','mobilepermission','apppermission','configprofile','mobileconfig'];
    const retProms=this.executeRetrieve(compNames,this.flags.targetusername,this.flags.deployusername);
    retProms.then(()=>{
      console.log('Inside Then');
      const options: Options = { compareSize: true,compareContent:true };
      compare('./diff/'+this.flags.targetusername+'/svmxc/', './diff/'+this.flags.deployusername+'/svmxc/', options)
      .then(this.executeComparision)
      .catch(error => console.error(error));
    });
  }

  executeRetrieveCommand(compName,usr){
    // Run the 'sfdx svmxc:retrieve:<comp>' command
    console.log('Retrieving '+compName+' for user '+usr);

    var dir_usr = './diff/'+usr;
    if (!fs.existsSync(dir_usr)){
      fs.mkdirSync(dir_usr, { recursive: true });
    }

    execSync('sfdx svmxc:retrieve:'+compName+' -u '+usr+' -d --json --loglevel TRACE -p '+dir_usr);
  }
  async executeRetrieve(compNames,usr1,usr2){
    for(var index in compNames)
    {
      this.executeRetrieveCommand(compNames[index],usr1);
      this.executeRetrieveCommand(compNames[index],usr2);
    }
  }

  executeComparision(res){
    let filesMissinginTarget= Array<string>();
    let filesMissinginSrc= Array<string>();   
        for(var index in res.diffSet){
          const curEntry = res.diffSet[index];
          if(curEntry.type1==='file' || curEntry.type2==='file'){
            //console.log(curEntry);
            if(curEntry.name1 != undefined && curEntry.name2 === undefined){
              filesMissinginTarget.push(curEntry.relativePath+'\\'+curEntry.name1);
            }else if(curEntry.name1 === undefined && curEntry.name2 != undefined){
              filesMissinginSrc.push(curEntry.relativePath+'\\'+curEntry.name2);
            }
          }
        }
        //console.log('filesMissinginTarget '+filesMissinginTarget);
        //console.log('filesMissinginSrc '+filesMissinginSrc);
        //this.writeArrayToFile('./diff/filesMissinginTarget.txt',filesMissinginTarget);
        //this.writeArrayToFile('./diff/filesMissinginSrc.txt',filesMissinginSrc);

        var file = fs.createWriteStream('./diff/filesMissinginTarget.txt');
        filesMissinginTarget.forEach(function(v) { file.write(v+ '\n'); });
        file.end();

        var file = fs.createWriteStream('./diff/filesMissinginSrc.txt');
        filesMissinginSrc.forEach(function(v) { file.write(v+ '\n'); });
        file.end();
  }

  /*writeArrayToFile(name:string,arr:string[]){
    var file = fs.createWriteStream(name);
    arr.forEach(function(v) { file.write(v+ '\n'); });
    file.end();
  }*/
}