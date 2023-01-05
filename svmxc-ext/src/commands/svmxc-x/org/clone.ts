//To Run this --> bin/dev svmxc-x:clone -x plugin_2@svmxc-ext.com -u deepak.a@5245trial.com
//import { promisify } from "util";
import { flags,SfdxCommand } from '@salesforce/command';
import { execSync } from 'child_process';
//const execPromise = promisify(exec);


export default class Clone extends SfdxCommand {
  static description = 'Clone a servicemax org for config';
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
    let compNames:string[] =['configprofile'];
    const retProms=this.executeRetrieve(compNames);
    retProms.then(()=>{
      console.log('Inside Then');
      for(var index in compNames) { 
        this.executeDeployCommand(compNames[index]);
      }
    });
  }

  executeDeployCommand(compName){
    // Run the 'sfdx svmxc:deploy:<comp>' command
    console.log('Deploying '+compName);
    execSync('sfdx svmxc:deploy:'+compName+' -u '+this.flags.deployusername+' --json --loglevel TRACE');
  }

  executeRetrieveCommand(compName){
    // Run the 'sfdx svmxc:retrieve:<comp>' command
    console.log('Retrieving '+compName);
    execSync('sfdx svmxc:retrieve:'+compName+' -u '+this.flags.targetusername+' -d --json --loglevel TRACE');
  }
  async executeRetrieve(compNames){
    for(var index in compNames)
    {
      this.executeRetrieveCommand(compNames[index]);
    }
  }
}