/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
//import * as SvmxcRetrieve from 'svmxc-sfdx/lib/commands/svmxc/retrieve/';
//import { SvmxcCommand } from 'svmxc-sfdx/lib/commands/';
import { AnyJson } from '@salesforce/ts-types';
//const SvmxcRetrieve = require('svmxc-sfdx/lib/commands/svmxc/retrieve');
const packageScript = require('../../scripts/packageProcessor.js');


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
//const messages = Messages.loadMessages('svmxc-sfdx-ext', 'org');

export default class Package extends SfdxCommand {
  public static description = 'Retrieves a package from ServiceMax using Package.xml';
  
  public static args = [];
  protected static flagsConfig = {
    path: flags.string({
      char: 'x',
      description: 'Path to the package.xml file',
      required: true
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const xmlPath = this.flags.path;
    const listOfComp = packageScript.processPackageFile(xmlPath);
    console.log(listOfComp);
    //await SvmxcRetrieve.run(['svmxc: retrieve','-u', this.org.getUsername()]);
    // Return an object to be displayed with --json
    return { };
  }
}
