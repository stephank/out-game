fs = require 'fs'
connect = require 'connect'
browserify = require 'browserify'
uglify = require 'uglify-js'

main = './game.coffee'


option '-c', '--compress', "Enable bundle compression"
option '-p', '--port', "Port to listen on"


# Write a compressed bundle for static serving in production.
task 'build', (options) ->
  b = browserify()
  b.register 'post', uglify if options.compress
  b.require main, root: __dirname
  fs.writeFileSync 'game.js', b.bundle()


# Watch and serve using browserify, for easy developent.
task 'serve', (options) ->
  b = browserify mount: '/game.js'
  b.register 'post', uglify if options.compress
  b.require main, root: __dirname, watch: yes

  server = connect.createServer()
  server.use connect.logger()
  server.use b
  server.use connect.static __dirname

  server.listen options.port or 20080, ->
    { address, port } = server.address()
    address = '127.0.0.1' if address is '0.0.0.0'
    console.log "Listening on http://#{address}:#{port}/"
