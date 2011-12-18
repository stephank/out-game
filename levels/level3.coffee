module.exports =
  title: "let's see some footwork"
  start: [18, 36]
  walls: [
    [ 'hollow',
      72, 16
      28, 16
      28, 31
      15, 31
      15, 41
      28, 41
      28, 58
      72, 58 ]
    [ 'flat'
      38, 25
      38, 49 ]
    [ 'flat'
      62, 25
      62, 49 ]
    [ 'solid'
      43, 23
      43, 51
      57, 51
      57, 23 ]
  ]
  sentries: [
    [ { x: 33, y: 22, look: 90 }
      ['move', 33, 52 ]
      ['turn', 0 ]
      ['wait', 50 ]
      ['turn', 270 ]
      ['move', 33, 22 ]
      ['turn', 0 ]
      ['wait', 50 ]
      ['turn', 90 ] ]
    [ { x: 67, y: 52, look: 270 }
      ['move', 67, 22 ]
      ['turn', 180 ]
      ['wait', 50 ]
      ['turn', 90 ]
      ['move', 67, 52 ]
      ['turn', 180 ]
      ['wait', 50 ]
      ['turn', 270 ] ]
  ]
  charges: 2
