###!
'Out' game, © 2011 Stéphan 'kosinus' Kochen.
Made for Ludum Dare 22. Licensed GPLv3, see the LICENSE file.
###


{ PI } = Math
TwoPI = PI * 2

unless window.requestAnimationFrame
  for prefix in ['moz', 'webkit', 'ms', 'o']
    if window["#{prefix}RequestAnimationFrame"]
      window.requestAnimationFrame = window["#{prefix}RequestAnimationFrame"]
      window.cancelRequestAnimationFrame = window["#{prefix}CancelRequestAnimationFrame"]
      break


buildCanvas = (options={}) ->

  # Building the main canvas.
  if options.id?
    x = y = 0
    w = 100
    h = 75

    element = document.getElementById options.id
    xScale = element.width / 100
    yScale = element.height / 75

  # Building an off-screen buffer.
  else
    [x, y, w, h] = options.area ? [0, 0, 100, 75]
    { xScale, yScale } = mainCanvas

    element = document.createElement 'canvas'
    element.width  = Math.ceil w * xScale
    element.height = Math.ceil h * yScale

  # Set up the coordinate system.
  context = element.getContext '2d'
  context.translate 0.5, 0.5
  context.scale xScale, yScale

  # Reposition the area / change the offset.
  reposition = (newX, newY) ->
    context.restore()
    context.save()
    x = newX
    y = newY
    context.translate -x, -y

  # Initial position / offset.
  context.save()
  reposition x, y

  # Convenience for blending to another canvas.
  blend = (c) -> c.context.drawImage element, x, y, w, h

  # All canvasses are passed around in this manner.
  { element, context, xScale, yScale, reposition, blend }

# Canvas element on the page.
mainCanvas = buildCanvas id: 'game'
[bodyTag] = document.getElementsByTagName 'body'
bodyTag.appendChild mainCanvas.element

# Game state.
levels = require './levels'
state = window.state = {}


# Wraps a bitmap containing collision data.
class CollisionMap

  constructor: (x, y, @w, @h) ->
    { @xScale, @yScale } = mainCanvas
    @reposition x, y
    @stride = Math.ceil w * @xScale / 8
    height  = Math.ceil h * @yScale
    @bitmap = new Uint8Array @stride * height

  reposition: (@x, @y) ->
    @ex = @x + @w
    @ey = @y + @h

  mapPixel: (x, y) ->
    idx = y * @stride + Math.floor(x / 8)
    bit = 1 << (x % 8)
    { idx, bit }

  map: (x, y) ->
    if x < @x or y < @y or x > @ex or @y > @ey
      return { idx: -1, bit: -1 }
    x = Math.round (x - @x) * @xScale
    y = Math.round (y - @y) * @yScale
    return @mapPixel x, y

  getPixel: (x, y) ->
    { idx, bit } = @mapPixel x, y
    return !!(@bitmap[idx] & bit)

  get: (x, y) ->
    { idx, bit } = @map x, y
    return idx isnt -1 and !!(@bitmap[idx] & bit)

  setPixel: (x, y) ->
    { idx, bit } = @mapPixel x, y
    @bitmap[idx] |= bit

  set: (x, y) ->
    { idx, bit } = @map x, y
    @bitmap[idx] |= bit unless idx is -1

  unsetPixel: (x, y) ->
    { idx, bit } = @mapPixel x, y
    @bitmap[idx] &= ~bit

  unset: (x, y) ->
    { idx, bit } = @map x, y
    @bitmap[idx] &= ~bit unless idx is -1

  putImageData: ({ data, width, height }, valueMap) ->
    for y in [0...height]
      for x in [0...width]
        base = (y * width + x) * 4
        r = data[base + 0]
        g = data[base + 1]
        b = data[base + 2]
        a = data[base + 3]
        if valueMap r, g, b, a
          @setPixel x, y
        else
          @unsetPixel x, y
    return


# You!
class Player

  size = 0.7
  moveDivisorSteps = [1, 2, 4, 8]
  speed = 0.30
  diagSpeed = Math.sqrt(speed * speed / 2)
  
  bodyTestOffsets = for a in [0...360] by 20
    { x: Math.sin(a) * size, y: Math.cos(a) * size }
  bodyTest = (x, y, map) ->
    for o in bodyTestOffsets
      ox = x + o.x
      oy = y + o.y
      return yes if map.get ox, oy
    return no

  constructor: ([@x, @y]) ->
    @movement = { x: 0, y: 0 }
    @actionResult = null

  move: ->
    dist = speed
    { x, y } = @movement
    if x isnt 0 and y isnt 0 then dist = diagSpeed

    state.tutorial = 2 if state.tutorial is 1 and x > 0

    # Über cheesy solid tests follow.
    if x isnt 0
      for div in moveDivisorSteps
        newX = @x + x * (dist / div)
        unless bodyTest newX, @y, state.level.collisionMap
          @x = newX
          break

    if y isnt 0
      for div in moveDivisorSteps
        newY = @y + y * (dist / div)
        unless bodyTest @x, newY, state.level.collisionMap
          @y = newY
          break

    @actionResult = @determineAction()

  testSentries: ->
    found = no

    for sentry in state.sentries when not sentry.disabled
      sentry.hostile = no

      dx = sentry.x - @x
      dy = sentry.y - @y
      continue if Math.sqrt(dx*dx + dy*dy) > sentry.radius

      if bodyTest @x, @y, sentry.getVisibilityMap()
        found = sentry.hostile = yes

    return found

  # Determine the result of pressing action at this time.
  determineAction: ->
    next = null
    placed = []
    for charge in state.charges when not charge.triggered
      if charge.placed
        placed.push charge
      else
        next = charge

    if next
      # Find the nearest wall within range.
      closest = { edge: null, dist: Infinity }
      state.level.eachEdgeNear @x, @y, 2, (edge, dist) =>
        { v1, v2, n } = edge
        # Check against current selection.
        return if dist >= closest.dist
        # Get the point on the wall closest to the player.
        p = { x: @x + n.x*dist, y: @y + n.y*dist }
        # Make sure the point is not too close to a corner.
        return if Math.abs(v1.x - p.x) < 0.5 and Math.abs(v1.y - p.y) < 0.5
        return if Math.abs(v2.x - p.x) < 0.5 and Math.abs(v2.y - p.y) < 0.5
        # Enforce a minimum distance between charges.
        for o in state.charges when charge.placed
          return if Math.abs(o.x - p.x) < 2 and Math.abs(o.y - p.y) < 2
        # Finally, calculate the angle the charge should face.
        a = Math.atan2 @y-p.y, @x-p.x
        # We're good, this is our best choice so far.
        closest = { p, a, dist }

      if closest.dist < 2
        if state.tutorial is 2 and state.sentries[0].x - @x < 5
          state.tutorial = 3

        return ['place', next, closest.p, closest.a]

    if placed.length > 0
      return ['trigger', placed]

    return null

  # Perform action.
  action: ->
    return no unless @actionResult

    [type] = @actionResult
    switch type

      when 'place'
        [type, charge, p, a] = @actionResult
        charge.place p, a

        if state.tutorial is 3
          state.tutorial = 4

      when 'trigger'
        [type, charges] = @actionResult
        charge.trigger() for charge in charges

        # Check failure.
        missed = no
        for sentry in state.sentries
          unless sentry.disabled
            sentry.hostile = yes
            missed = yes

        # FIXME: Don't really want state changes here, but oh well.
        state.counter = 0
        state.fsm = if missed then 'fail' else 'win'

      else
        return no

    @actionResult = @determineAction()
    return yes

  draw: ->
    c = mainCanvas.context
    c.lineWidth = 0.2
    c.fillStyle = '#fa3'
    c.strokeStyle = '#eee'
    c.beginPath()
    c.arc @x, @y, size, 0, TwoPI
    c.fill()
    c.stroke()


# Charges are the primary weapon.
class Charge

  effectRadius = 12
  size = PI / 40
  step = size * 2
  rotStep = step / 30

  constructor: ->
    @placed = no
    @triggered = no

  place: ({ @x, @y }, face) ->
    @placed = yes
    @faceStart = face - PI/2
    @faceEnd   = face + PI/2
    @rot = 0

  trigger: ->
    for sentry in state.sentries when not sentry.disabled
      dx = sentry.x - @x
      dy = sentry.y - @y
      length = Math.sqrt(dx*dx + dy*dy)
      sentry.disabled = yes if length < effectRadius
    @placed = no
    @triggered = yes

  drawEffectArea: ->
    return unless @placed
    c = mainCanvas.context
    c.strokeStyle = '#c60'
    c.lineWidth = 0.3
    for base in [0..TwoPI] by step
      a = base + @rot
      c.beginPath()
      c.arc @x, @y, effectRadius, a, a+size
      c.stroke()
    @rot = (@rot + rotStep) % step

  drawBody: ->
    return unless @placed
    c = mainCanvas.context
    c.fillStyle = '#fff'
    c.beginPath()
    c.moveTo @x, @y
    c.arc @x, @y, 0.4, @faceStart, @faceEnd
    c.fill()


# The enemy: mobile sentries.
class Sentry

  constructor: (options, @instructions) ->
    { @x, @y } = options
    @look = (options.look ? 0) * PI/180
    @radius = options.radius ? 15
    @moveSpeed = options.moveSpeed ? 0.18
    @turnSpeed = options.turnSpeed ? 0.07
    @halfFov = (options.fov ? 90) * PI/360

    @disabled = no
    @sightStyle = '#ff0'

    bufSize = @radius * 2
    @drawbuf = buildCanvas area: [0, 0, bufSize, bufSize]
    @vismap = new CollisionMap 0, 0, bufSize, bufSize
    @updatePos()
    @updateFov()

    @ip = 0
    @state = 'next'
    @targetX = @targetY = @targetLook = @waitRemaining = null

  # Update variables that depend on position.
  updatePos: ->
    sx = @x - @radius
    sy = @y - @radius
    @drawbuf.reposition sx, sy
    @vismap.reposition sx, sy

  # Update variables that depend on FoV and look angle.
  updateFov: ->
    @fovStart = @look - @halfFov
    @fovEnd   = @look + @halfFov

  # Run through sentry instructions.
  move: ->
    return if @disabled or @instructions.length is 0

    # 'next' is an inbetween state for incrementing the instruction pointer
    # and fetching the next instruction.
    if @state is 'next'
      [@state, args...] = @instructions[@ip]
      @ip = (@ip + 1) % @instructions.length
      switch @state
        when 'move' then [@targetX, @targetY] = args
        when 'turn' then @targetLook = args[0] * PI/180
        when 'wait' then [@waitRemaining] = args

    switch @state
      when 'move'
        dx = @targetX - @x
        dy = @targetY - @y
        dist = Math.sqrt(dx*dx + dy*dy)
        if Math.abs(dist) < @moveSpeed
          @x = @targetX
          @y = @targetY
          @state = 'next'
        else
          factor = @moveSpeed / dist
          @x += dx * factor
          @y += dy * factor
        @updatePos()

      when 'wait'
        @waitRemaining--
        @state = 'next' if @waitRemaining is 0

      when 'turn'
        @turnTo @targetLook

  # Player has been detected, this is the animation of the sentry homing in
  # on the player's location.
  homeOnPlayer: ->
    # Narrow the FoV for a focus effect.
    @targetFov ?= @halfFov / 2
    df = @targetFov - @halfFov
    @halfFov += df * 0.2

    # Turn towards the player.
    { player } = state
    @turnTo Math.atan2 player.y - @y, player.x - @x

  # Turning helper.
  turnTo: (a) ->
    da = a - @look
    da -= TwoPI if da >  PI
    da += TwoPI if da < -PI
    if Math.abs(da) < @turnSpeed
      @look = a
      @state = 'next'
    else
      turnSpeed = @turnSpeed
      turnSpeed *= -1 if da < 0
      @look = (@look + turnSpeed) % TwoPI
    @updateFov()

  # Fill the visibility drawing buffer with the given style.
  fillDrawbuf: (style) ->
    c = @drawbuf.context
    c.clearRect 0, 0, 100, 75

    c.globalCompositeOperation = 'source-over'
    state.level.drawOcclusion @x, @y, c, maxDist: @radius

    c.globalCompositeOperation = 'source-out'
    c.fillStyle = style
    c.beginPath()
    c.moveTo @x, @y
    c.arc @x, @y, @radius, @fovStart, @fovEnd
    c.fill()

  # Draw visible area to the canvas.
  drawVisibility: ->
    return if @disabled
    @fillDrawbuf '#433'
    @drawbuf.blend mainCanvas

  # Draw body to the canvas.
  drawBody: ->
    c = mainCanvas.context
    c.lineWidth = 0.2

    c.fillStyle = '#666'
    c.strokeStyle = '#999'
    c.beginPath()
    c.arc @x, @y, 0.8, 0, TwoPI
    c.fill()
    c.stroke()

    return if @disabled
    c.strokeStyle = @sightStyle
    c.beginPath()
    c.arc @x, @y, 0.8, @fovStart, @fovEnd
    c.stroke()

  # Return a bitmap of visibility data.
  getVisibilityMap: ->
    @fillDrawbuf '#fff'
    { width, height } = @drawbuf.element
    data = @drawbuf.context.getImageData 0, 0, width, height
    @vismap.putImageData data, (r, g, b, a) -> a > 128
    return @vismap



# Deals with structure/walls in the level.
class LevelStructure

  constructor: (walls) ->
    @walls = for [type, coords...] in walls

      # Slice up the coords array.
      coords = for x, i in coords by 2
        y = coords[i+1]
        { x, y }

      # Build edge structures.
      edges = for v1, i in coords
        # Need two vertices.
        if coords.length - i < 2
          break if type is 'flat'
          # Account for the closing edge.
          v2 = coords[0]
        else
          v2 = coords[i+1]

        # We also store the vector v1v2.
        v = { x: v2.x-v1.x, y: v2.y-v1.y }
        # And the length of the wall.
        length = Math.sqrt(v.x*v.x + v.y*v.y)
        # And a normal unit vector.
        n = { x: -v.y / length, y: v.x / length }

        { v1, v2, v, length, n }

      { type, coords, edges }

    @collisionMap = @buildCollisionMap()

  # Build a bitmap used when collision testing.
  buildCollisionMap: ->
    canvas = buildCanvas()
    c = canvas.context
    c.lineWidth = 0.3
    c.strokeStyle = '#000'

    # Draw black for solids.
    c.fillStyle = '#000'
    c.fillRect 0, 0, 100, 75
    for { type, coords } in @walls
      c.beginPath()
      for { x, y }, i in coords
        if i is 0
          c.moveTo x, y
        else
          c.lineTo x, y
      switch type
        when 'hollow'
          c.closePath()
          c.fillStyle = '#fff'
          c.fill()
        when 'solid'
          c.closePath()
          c.fillStyle = '#000'
          c.fill()
      c.stroke()

    # Create a bitmap.
    { width, height } = canvas.element
    data = c.getImageData 0, 0, width, height
    bitmap = new CollisionMap 0, 0, 100, 75
    bitmap.putImageData data, (r, g, b, a) -> r < 128
    return bitmap

  # Draw the level background.
  drawBase: ->
    c = mainCanvas.context

    for { type, coords } in @walls when type isnt 'flat'
      c.beginPath()
      for { x, y }, i in coords
        if i is 0
          c.moveTo x, y
        else
          c.lineTo x, y
      c.closePath()
      c.fillStyle = switch type
        when 'hollow' then '#300'
        when 'solid'  then '#000'
      c.fill()
    return

  # Draw lines for walls.
  drawWalls: ->
    c = mainCanvas.context
    c.lineWidth = 0.3
    c.strokeStyle = '#b44'

    c.beginPath()
    for { type, coords } in @walls
      for { x, y }, i in coords
        if i is 0
          c.moveTo x, y
        else
          c.lineTo x, y
      c.closePath() unless type is 'flat'
    c.stroke()

  # Find wall edges near a point.
  eachEdgeNear: (x, y, maxDist, iter) ->
    for wall in @walls
      for edge in wall.edges
        { v, v1, v2, n } = edge
        # Quick bounding box check.
        continue if Math.min(v1.x, v2.x) - x > maxDist
        continue if Math.min(v1.y, v2.y) - y > maxDist
        continue if x - Math.max(v1.x, v2.x) > maxDist
        continue if y - Math.max(v1.y, v2.y) > maxDist
        # Line distance check.
        # Project a vector from the line to the target, onto the normal.
        r = { x: v1.x-x, y: v1.y-y }
        dist = n.x*r.x + n.y*r.y
        iter edge, dist if Math.abs(dist) <= maxDist
    return

  # Draw black on canvas context `c` for occlusion as seen from point `(x,y)`.
  drawOcclusion: (x, y, c, options={}) ->
    maxDist = options.maxDist ? null

    c.fillStyle = '#000'

    extend = (v) ->
        dx = v.x - x
        dy = v.y - y
        dist = Math.sqrt(dx*dx + dy*dy)
        ux = dx / dist
        uy = dy / dist
        { x: v.x + ux * 10000, y: v.y + uy * 10000 }

    castFromEdge = ({ v1, v2 }) ->
      # Extrude this edge away from the light source.
      v3 = extend v2
      v4 = extend v1

      # Fill shadow.
      c.beginPath()
      c.moveTo v1.x, v1.y
      c.lineTo v2.x, v2.y
      c.lineTo v3.x, v3.y
      c.lineTo v4.x, v4.y
      c.closePath()
      c.fill()

    if options.maxDist?
      @eachEdgeNear x, y, options.maxDist, castFromEdge
    else
      for wall in @walls
        for edge in wall.edges
          castFromEdge edge
    return


# Input handling.
controller =
  initialize: ->
    @up = @down = @left = @right = @action = 0
    document.onkeydown = (e) => @keyDown e
    document.onkeyup = (e) => @keyUp e

  keyDown: (e) ->
    switch e.keyCode
      when 37 then @left = -1
      when 38 then @up = -1
      when 39 then @right = +1
      when 40 then @down = +1
      when 32 then @action = 1 if @action is 0
    @updateMovement()

  keyUp: (e) ->
    switch e.keyCode
      when 37 then @left = 0
      when 38 then @up = 0
      when 39 then @right = 0
      when 40 then @down = 0
      when 32 then @action = 0
    @updateMovement()

  updateMovement: ->
    state.player?.movement =
      x: @left + @right
      y: @up + @down

  dequeue: ->
    return if @action isnt 1
    @action = 2

    switch state.fsm
      when 'title' then state.title.dismiss()
      when 'play'  then state.player.action()


# Main loop and state handling.
#
# There's a global FSM that determines what's happening. States are:
# title, levelZoom, play, fail, win, end
gameLoop = window.gameLoop =
  interval: null

  initialize: ->
    state.fsm = 'title'
    state.counter = 0

    @initialize = ->

  start: ->
    return if @interval
    @initialize()
    @interval = setInterval (=> @tick()), 25

  stop: ->
    clearInterval @interval if @interval
    cancelRequestAnimationFrame? @frameRequest if @frameRequest
    @interval = @frameRequest = null

  # Start up a new level.
  loadLevel: (idx) ->
    state.levelIdx = idx
    level = levels[idx]

    state.title = level.title
    state.tutorial = level.tutorial or 0
    state.level = new LevelStructure level.walls
    state.player = new Player level.start
    state.charges = for i in [0...level.charges]
      new Charge
    state.sentries = for [options, waypoints...] in level.sentries
      new Sentry options, waypoints

    state.fsm = 'levelZoom'
    state.counter = 1

  # Restart the level.
  reloadLevel: ->
    @loadLevel state.levelIdx

  # Start the next level, or go to end.
  nextLevel: ->
    idx = state.levelIdx + 1
    if levels[idx]
      @loadLevel idx
    else
      state.fsm = 'end'
      state.counter = 0

  # Simulate a tick.
  tick: ->
    switch state.fsm

      when 'title'
        state.counter++
        @loadLevel 0 if state.counter is 100

      when 'play'
        state.player.move()
        for sentry in state.sentries
          sentry.move()
        if state.player.testSentries()
          state.fsm = 'fail'
          state.counter = 0
        else
          controller.dequeue()

      when 'fail'
        sightStyle = if state.counter % 10 > 5 then '#ff0' else '#f00'
        for sentry in state.sentries when sentry.hostile
          sentry.homeOnPlayer()
          sentry.sightStyle = sightStyle

        state.counter++
        @reloadLevel() if state.counter is 100

      when 'win'
        state.counter++
        @nextLevel() if state.counter is 100

    if window.requestAnimationFrame
      @frameRequest ||= requestAnimationFrame => @frame()
    else
      @frame()

  # Render a frame.
  frame: ->
    @frameRequest = null

    c = mainCanvas.context
    c.clearRect(0, 0, 100, 75)

    switch state.fsm

      when 'title'
        c.fillStyle = '#fff'
        c.font = 'bold italic 12px monospace'
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillText 'out', 50, 37.5

        c.globalCompositeOperation = 'source-atop'
        x = state.counter * 1.7 - 30
        g = c.createLinearGradient x, 0, x + 30, 30
        g.addColorStop 0.00, '#000'
        g.addColorStop 0.49, '#ccc'
        g.addColorStop 0.50, '#777'
        g.addColorStop 1.00, '#000'
        c.fillStyle = g
        c.fillRect 0, 0, 100, 75
        c.globalCompositeOperation = 'source-over'

      when 'levelZoom'
        state.counter = state.counter / 6 * 5
        scale = 1 - state.counter
        offset = state.counter / 2
        c.save()
        c.translate(offset * 100, offset * 75)
        c.scale(scale, scale)
        c.globalAlpha = scale
        @drawLevel()
        c.restore()

        if state.counter < 0.01
          state.fsm = 'play'
          # Call this here so that, at level start,
          # all input flags are off.
          controller.initialize()

      when 'play'
        @drawLevel()

      when 'fail'
        @drawLevel()

      when 'win'
        a = (100 - Math.max(60, state.counter)) / 40
        c.globalAlpha = a
        @drawLevel()

        a = Math.min(10, state.counter) / 10
        a = (100 - Math.max(80, state.counter)) / 20 if a is 1
        c.globalAlpha = a
        c.fillStyle = "#fff"
        c.font = 'bold italic 12px monospace'
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillText 'cleared!!', 50, 37.5

        c.globalAlpha = 1

      when 'end'
        c.fillStyle = '#fff'
        c.font = 'bold italic 12px monospace'
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillText 'fin', 50, 37.5

  # Helper for drawing all of the level.
  drawLevel: ->
    state.level.drawBase()
    for sentry in state.sentries
      sentry.drawVisibility()
    for charge in state.charges
      charge.drawEffectArea()
      charge.drawBody()
    state.player.draw()
    for sentry in state.sentries
      sentry.drawBody()
    state.level.drawWalls()
    @drawHud()

  drawHud: ->
    numCharges = 0
    for charge in state.charges
      numCharges++ unless charge.placed or charge.triggered

    c = mainCanvas.context
    c.fillStyle = "#ccc"
    c.font = 'bold 2px monospace'

    c.textBaseline = 'top'
    c.textAlign = 'left'
    c.fillText "level: #{state.levelIdx + 1}", 2, 2
    c.textAlign = 'right'
    c.fillText "charges: #{numCharges}", 98, 2
    c.textAlign = 'center'
    c.fillText state.title, 50, 2

    c.textBaseline = 'bottom'

    if state.tutorial
      text = switch state.tutorial
        when 1
          "Move to the right using the arrow keys"
        when 2
          "Keep moving right, up to the wall behind the sentry"
        when 3
          "Press the spacebar to deploy an EMP charge here"
        when 4
          "Press the spacebar again to trigger the charge"
        when 5
          "Place multiple charges, trigger once to destroy both sentries"
      if text
        c.fillText text, 50, 70

    text = switch state.player?.actionResult?[0]
      when 'place'
        'place charge'
      when 'trigger'
        c.fillStyle = '#f80'
        'trigger charges'
    if text
      c.fillText "[space] = #{text}", 50, 73


# Entry!
gameLoop.start()
