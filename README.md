# UI Test project using Backbone.js

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1.  [Node.js][]: We use Node to run a development web server and build the project.
    Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install


Run the following commands in two separate terminals.

The first one will start a back-end running at port 8000:

    npm run-script serve
    
The second will start a front-end running at a default http port 80:
    
    npm start

Npm is also used to manage dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### Managing dependencies

To add a library as a runtime dependency of your application, you would run following command:

    npm install <library_name>

To add a library as a development dependency, you would run following command:

    npm install --save-dev <library_name>


## Building for production

To optimize the application for production, run:

    npm build

Then navigate to [http://localhost](http://localhost) in your browser.

### Client tests

Unit tests are written with [Jasmine][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

    npm test




[node.js]: https://nodejs.org/
[jasmine]: http://jasmine.github.io/2.0/introduction.html
