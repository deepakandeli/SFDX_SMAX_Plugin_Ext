//To Run this --> bin/dev svmxc-x:clone -x plugin_2@svmxc-ext.com -u deepak.a@5245trial.com
import { flags,SfdxCommand } from '@salesforce/command';
import { exec } from 'child_process';



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
    // Run the 'sfdx svmxc:retrieve' command

    //Checklist
    console.log('Retrieving Express '+this.flags.targetusername);
    exec('sfdx svmxc:retrieve -u '+this.flags.targetusername, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }else{
        console.log('Target Username '+this.flags.deployusername);
        exec('sfdx svmxc:deploy -u '+this.flags.deployusername, (errorD: any, stdoutD: any, stderrD: any) => {
          if (errorD) {
            console.error(`Error: ${errorD}`);
            return;
          }else{
            
          }
          console.log(`stdout: ${stdoutD}`);
          console.log(`stderr: ${stderrD}`);
      });
    }

      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
}