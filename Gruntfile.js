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
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= config.app %>/public'
                    ]
                }
            },
        },
        watch: {
            options: {
                livereload: true,
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/public/{,*/}*.html',
                    '<%= config.app %>/public/css/{,*/}*.css',
                    '<%= config.app %>/public/images/{,*/}*'
                ]
            },
            compass: {
                files: ['**/*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            jinja2: {
                files: ['app/src/templates/**'],
                tasks: ['jinja2:dev']
            },
            copy: {
                files: ['app/src/images/*', 'app/src/fonts/*'],
                tasks: ['copy:main']
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
                    environment: 'production'
                }
            },
        },
        jinja2: {
            dev: {
                options:{
                    template_path: 'app/src/templates',
                    context_path: 'app/src/templates/context'
                },
                files: [{
                    expand: true,
                    cwd: 'app/src/templates',
                    src: ['*.html'],
                    dest: 'app/public',
                    ext: '.html'
                }]
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
        }
    });

    // Load the plugin
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jinja2');


    // Default task(s).
    grunt.registerTask('default', ['connect:livereload', 'compass:dev', 'jinja2', 'copy', 'watch']);
    // prod build
    grunt.registerTask('prod', ['compass:prod']);

};
