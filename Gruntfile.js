'use strict';
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            app: 'app'
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.app %>/public'
                    ]
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/public/{,*/}*.html',
                    '<%= config.app %>/public/css/{,*/}*.css',
                    '<%= config.app %>/public/images/{,*/}*',
                    '<%= config.app %>/public/fonts/{,*/}*',
                    '<%= config.app %>/public/js/{,*/}*'
                ]
            },
            compass: {
                files: ['**/*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            nunjucks: {
                files: ['app/src/templates/**'],
                tasks: ['nunjucks']
            },
            copy: {
                files: ['app/src/images/*', 'app/src/fonts/*'],
                tasks: ['copy:main']
            },
            concat: {
                files: ['app/src/js/*'],
                tasks: ['concat:dist']
            },
            hugo: {
                files: ['app/src/blog/*'],
                tasks: ['hugo']
            }

        },
        nunjucks: {
            options: {
                paths: ['app/src/templates'],
                data: grunt.file.readJSON('app/src/templates/context.json')
            },
            render: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/src/templates/',
                        src: '*.html',
                        dest: 'app/public/',
                        ext: '.html'
                    }
                ]
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: ['app/src/stylesheets'],
                    cssDir: ['app/public/css'],
                    environment: 'development'
                }
            },
            prod: {
                options: {
                    sassDir: ['app/src/stylesheets'],
                    cssDir: ['app/public/css'],
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/src/images',
                        src: '**/*',
                        dest: 'app/public/images/'
                    },
                    {
                        expand: true,
                        cwd: 'app/src/fonts',
                        src: '**/*',
                        dest: 'app/public/fonts/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/fontawesome/fonts/',
                        src: '**/*',
                        dest: 'app/public/fonts/'
                    }
                ]

            }
        },
        concat: {
            dev: {
                options: {
                  separator: ';\n'
                },
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/waypoints/lib/jquery.waypoints.js',
                    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'app/src/js/**/*'
                ],
                dest: 'app/public/js/scripts.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'app/public/js/scripts.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/waypoints/lib/jquery.waypoints.js',
                        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
                        'app/src/js/**/*'
                    ]
                }
            }
        }
    });

    // Load the plugin
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');

    //Hugo task
    grunt.registerTask('hugo', 'hugo task', function(target){
        var done = this.async();
        var args = ['--source=app/src/blog/', '--destination=../../../app/public/blog/'];
        var hugo = require('child_process').spawn('hugo', args, {'stdio': 'inherit'});
        hugo.on('error', function(){ done(); });
        hugo.on('exit', function(){ done(); });
    });

    // Default task(s).
    grunt.registerTask('default', [
        'connect:livereload',
        'compass:dev',
        'nunjucks',
        'hugo',
        'copy',
        'concat',
        'watch'
    ]);
    // prod build
    grunt.registerTask('prod', [
        'compass:prod',
        'nunjucks',
        'hugo',
        'copy',
        'concat',
        'uglify:dist'
    ]);
    // dev build
    grunt.registerTask('dev', [
        'compass:dev',
        'nunjucks',
        'hugo',
        'copy',
        'concat',
        'uglify:dist'
    ]);

};
