/*
 * grunt-environment-vars
 * https://github.com/krlos2011/grunt-environment-vars
 *
 * Copyright (c) 2015 Carlos Fernández
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('environment', 'Automation of reading environment from yml file and write in html files like window var', function (){

    var options = this.options({
      file: 'environment.yml',
      varName: 'ENVIRONMENT'
    });
    var regex = /(<!--\s*environment\s*-->)[^]*(<!--\s*\/environment\s*-->)/mg;

    if( !grunt.file.exists(options.file) ){
      grunt.fail.fatal('file: ' + options.file + 'is not found');
    }

    var environment = grunt.file.readYAML(options.file),
        _ = require('jengine-utils'),
        dest = grunt.config.process(this.data.dest) || [];

    if( environment[this.target] === undefined ){
      grunt.log.warn(this.target + ' not found in settings');
    }

    environment = _.merge({}, environment.common || {}, environment[this.target] || {});

    dest.forEach(function (file){
      var html = grunt.file.read(file);

      if( !html.match(regex) ){
        grunt.log.warn('no tag environment find in ' + file);
        return;
      }

      html = html.replace(regex, '$1\n<script>\nwindow.' + options.varName + ' = ' + JSON.stringify(environment, null, 2) + ';\n</script>\n$2');
      grunt.file.write(file, html);

    });

  });

}