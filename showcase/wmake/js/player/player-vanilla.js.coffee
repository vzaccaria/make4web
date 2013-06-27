# showtty.js - a building block for viewing tty animations
# Copyright 2008 Jack Christopher Kastorff
#
# Changes:
# ========          
# Mon Aug  8 13:59:40 CEST 2011 Coder of Salvation: added callback in showTTYURL
# Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added callback in showTTY 
# Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added 'instance' property in holder obj (to enable play/pause)
# Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: moved wild variables clut & t to top of file
# Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added keyframes array  to holder object
# Mon Aug  8 13:59:40 CEST 2011 Coder of Salvation: ttyplayer now has unique id, and accesible by global 'window' object
#                                                                                                   access it by: var ttyplay = window[ "showtty_"+ yourelement_id_name ]
#
console.log "Begin!"
clut =
  0: "#000"
  1: "#D00"
  2: "#0D0"
  3: "#DD0"
  4: "#00D"
  5: "#D0D"
  6: "#0DD"
  7: "#DDD"

t = 0
playing = false
repeatString = (str, rep) ->
  outstr = ""
  i = 0

  while i < rep
    outstr += str
    i++
  outstr

makeTable = (width, height) ->
  table = document.createElement("div")
  arr = []
  j = 1

  while j <= height
    row = document.createElement("div")
    arrrow = []
    row.style.fontFamily = "\"ProFont\", \"Luxi Mono\", \"Monaco\", \"Courier\", \"Courier new\", monospace"
    row.style.margin = "0"
    row.style.padding = "0"
    row.style.wordSpacing = "0"
    row.style.height = "1.3em"
    i = 1

    while i <= width
      charelem = document.createElement("pre")
      
      # charelem.style.backgroundColor = '#000';
      # charelem.style.color = '#FFF';
      charelem.style.display = "inline"
      charelem.style.fontWeight = "normal"
      charelem.style.fontSize = "12px"
      charelem.style.textDecoration = "none"
      charelem.style.letterSpacing = "0"
      charelem.style.margin = "0"
      charelem.style.padding = "0 0 0.2em 0"
      charelem.appendChild document.createTextNode(" ")
      row.appendChild charelem
      arrrow.push charelem
      i++
    table.appendChild row
    arr.push arrrow
    j++
  arr: arr
  elem: table

setTextChunk = (tb, r, index, stx) ->
  i = 0

  while i < r.length
    c = r.charAt(i)
    tb.arr[index][i + stx].firstChild.replaceData 0, 1, c
    i++

setBoldChunk = (tb, r, index, stx) ->
  i = 0

  while i < r.length
    tb.arr[index][i + stx].style.fontWeight = (if r.charAt(i) is 0 then "normal" else "bold")
    i++

setUnderlineChunk = (tb, r, index, stx) ->
  i = 0

  while i < r.length
    tb.arr[index][i + stx].style.textDecoration = (if r.charAt(i) is 0 then "none" else "underline")
    i++

setFcolorChunk = (tb, r, index, stx) ->
  i = 0

  while i < r.length
    tb.arr[index][i + stx].style.color = clut[r.charAt(i)]
    i++

setBcolorChunk = (tb, r, index, stx) ->
  i = 0

  while i < r.length
    tb.arr[index][i + stx].style.backgroundColor = clut[r.charAt(i)]
    i++

loadIFrame = (tb, rowcaches, fr, width, height) ->
  d = uncompressIFrameBlock(fr.d, width)
  i = 0

  while i < d.length
    setTextChunk tb, d[i], i, 0
    rowcaches.d[i] = d[i]
    i++
  B = uncompressIFrameBlock(fr.B, width)
  i = 0

  while i < B.length
    setBoldChunk tb, B[i], i, 0
    rowcaches.B[i] = B[i]
    i++
  U = uncompressIFrameBlock(fr.U, width)
  i = 0

  while i < U.length
    setUnderlineChunk tb, U[i], i, 0
    rowcaches.U[i] = U[i]
    i++
  f = uncompressIFrameBlock(fr.f, width)
  i = 0

  while i < f.length
    setFcolorChunk tb, f[i], i, 0
    rowcaches.f[i] = f[i]
    i++
  b = uncompressIFrameBlock(fr.b, width)
  i = 0

  while i < b.length
    setBcolorChunk tb, b[i], i, 0
    rowcaches.b[i] = b[i]
    i++

uncompressIFrameBlock = (d, width) ->
  uncomp = []
  last = null
  i = 0

  while i < d.length
    uncomprow = null
    if typeof d[i] is "array" or typeof d[i] is "object"
      if d[i][0] is "r"
        uncomprow = d[i][1]
      else if d[i][0] is "a"
        uncomprow = repeatString(d[i][1], width)
      else
        throw new Error("bad iframe data: subarray is not valid")
    else if typeof d[i] is "string" and d[i] is "d"
      uncomprow = last
    else
      throw new Error("bad iframe data: unknown " + (typeof d[i]) + " in array")
    uncomp.push uncomprow
    last = uncomprow
    i++
  uncomp

loadPFrame = (table, rowcaches, fr, width, height) ->
  diffPushGeneric table, annotatedPFrameBlock(fr.d, width), rowcaches.d, setTextChunk  if fr.d
  diffPushGeneric table, annotatedPFrameBlock(fr.B, width), rowcaches.B, setBoldChunk  if fr.B
  diffPushGeneric table, annotatedPFrameBlock(fr.U, width), rowcaches.U, setUnderlineChunk  if fr.U
  diffPushGeneric table, annotatedPFrameBlock(fr.f, width), rowcaches.f, setFcolorChunk  if fr.f
  diffPushGeneric table, annotatedPFrameBlock(fr.b, width), rowcaches.b, setBcolorChunk  if fr.b

diffPushGeneric = (table, d, rowcache, set) ->
  
  # convert everything to line operations
  i = 0

  while i < d.length
    e = d[i]
    if e[0] is "cp"
      set table, rowcache[e[1]], e[2], 0
      rowcache[e[2]] = rowcache[e[1]]
    else if e[0] is "char"
      r = e[1]
      v = rowcache[r]
      da = v.slice(0, e[2]) + e[3] + v.slice(e[2] + 1)
      set table, e[3], e[1], e[2]
      rowcache[r] = da
    else if e[0] is "chunk"
      r = e[1]
      v = rowcache[r]
      da = v.slice(0, e[2]) + e[4] + v.slice(e[3] + 1)
      set table, e[4], e[1], e[2]
      rowcache[r] = da
    else if e[0] is "line"
      set table, e[2], e[1], 0
      rowcache[e[1]] = e[2]
    else
      throw new Error("unknown p-frame item type " + e[0] + ", len " + e.length)
    i++

annotatedPFrameBlock = (frame, width) ->
  ann = []
  i = 0

  while i < frame.length
    e = frame[i]
    if e[0] is "cp"
      ann.push e
    else if e.length is 2
      
      # raw line
      if typeof e[1] is "string"
        ann.push ["line", e[0], e[1]]
      else if e[1][0] is "a"
        ann.push ["line", e[0], repeatString(e[1][1], width)]
      else
        throw new Error("p-frame corrupted: invalid 2-len")
    else if e.length is 3
      
      # char
      ann.push ["char", e[0], e[1], e[2]]
    else if e.length is 4
      
      # chunk
      if typeof e[3] is "string"
        ann.push ["chunk", e[0], e[1], e[2], e[3]]
      else if e[3][0] is "a"
        ann.push ["chunk", e[0], e[1], e[2], repeatString(e[3][1], e[2] - e[1] + 1)]
      else
        throw new Error("p-frame corrupted: invalid 4-len")
    else
      throw new Error("p-frame corrupted: no such thing as a " + e.length + "-len")
    i++
  ann

handleCursor = (table, bgcache, curpos, dx, dy) ->
  if typeof dx is "number" or typeof dy is "number"
    
    # make sure the old cursor position has been overwritten
    setBcolorChunk table, bgcache[curpos[1] - 1].charAt(curpos[0] - 1), curpos[1] - 1, curpos[0] - 1
    curpos[0] = dx  if typeof dx is "number"
    curpos[1] = dy  if typeof dy is "number"
  
  # draw the cursor
  table.arr[curpos[1] - 1][curpos[0] - 1].style.backgroundColor = "#FFF"

stop = (holder) ->
  playing = false
  clearTimeout holder.idTimeout

play = (holder) ->
  playing = true
  
  # we re-initialize the timeadd-value so all the framerelated calculations are correct again
  holder.timeadd = (new Date).getTime() / 1000 - holder.timeline[holder.nextframe].t
  animateNextFrame holder

animateNextFrame = (holder) ->
  fr = holder.timeline[holder.nextframe]
  if fr.i
    loadIFrame holder.table, holder.rowcaches, fr, holder.width, holder.height
  else
    loadPFrame holder.table, holder.rowcaches, fr, holder.width, holder.height
  handleCursor holder.table, holder.rowcaches.b, holder.curpos, fr.x, fr.y
  holder.nextframe++
  if (holder.timeline.length > holder.nextframe) and holder.playing
    wait = holder.timeadd + holder.timeline[holder.nextframe].t - (new Date).getTime() / 1000
    if wait < 0
      
      # we're out of date! try to catch up.
      animateNextFrame holder
    else
      holder.idTimeout = setTimeout(->
        animateNextFrame holder
      , wait * 750)

makeCache = (ch, wid, hei) ->
  c = []
  y = 0

  while y < hei
    c.push repeatString(ch, wid)
    y++
  c


###
scrubTTY - scrubs back/forward to the nearest keyframe
###
scrubTTY = (frame, holder) ->
  keyframe = false
  i = 0

  while i < holder.keyframes.length
    if holder.keyframes[i] > frame and i isnt holder.keyframes.length - 1
      keyframe = holder.keyframes[i]
      break
    i++
  unless keyframe
    console.log "no keyframe data within acceptable range found"
  else
    holder.instance.nextframe = keyframe

resetTTY = (holder) ->
  holder.time = 0
  holder.nextframe = 0
  holder.curpos = [1, 1]
  holder.timeadd = (new Date).getTime() / 1000 - holder.timeline[0].t

showTTY = (elem, data, onLoadCallBack) ->
  elem.removeChild elem.firstChild  while elem.firstChild
  width = data.width
  height = data.height
  timeline = data.timeline
  keyframes = []
  
  # *FIXME* possible attempt to retrieve keyframes 
  # the idea was to search for y==1 occurences, but 
  # this does definately not assure a total redraw 
  # possible solution: find 'total redraw' (key)frames
  i = 0

  while i < data.timeline.length
    keyframes.push i  if data.timeline[i].y is 1
    i++
  table = makeTable(width, height)
  elem.appendChild table.elem
  holder =
    instance: this
    width: width
    height: height
    timeline: timeline
    keyframes: keyframes
    table: table
    nextframe: 0
    time: 0
    rowcaches:
      d: makeCache(" ", width, height)
      f: makeCache("7", width, height)
      b: makeCache("0", width, height)
      B: makeCache("0", width, height)
      U: makeCache("0", width, height)

    curpos: [1, 1]
    timeadd: (new Date).getTime() / 1000 - timeline[0].t

  resetTTY holder # just to be sure
  uid = "showtty_" + elem.id
  window[uid] = holder
  onLoadCallBack true  if onLoadCallBack
  play holder

showTTYURL = (elem, url, onLoadCallBack) ->
  showText = (text) ->
    elem.removeChild elem.firstChild  while elem.firstChild
    elem.appendChild document.createTextNode(text)

  showText "Loading terminal session.." # + url);
  req = new XMLHttpRequest()
  req.open "GET", url, true
  req.onreadystatechange = ->
    if req.readyState is 4 and req.status is 200
      data = eval("(" + req.responseText + ")")
      if typeof data is "undefined"
        showText "Error: didn't get tty data from " + url
        req = null
        return
      onLoadCallBack true  if onLoadCallBack
      showTTY elem, data
    else if req.readyState is 4 and req.status isnt 200
      onLoadCallBack false  if onLoadCallBack
      showText "Error: couldn't retrieve " + url + ", got status code " + @status
      req = null

  req.send null

###
File:        playterm.js
Author:      Leon van Kammen | The Coder of Salvation <info@leon.vankammen.eu>
Date:        Thu Aug 18 12:56:32 2011

player frontend

Changelog:

[Thu Aug 18 12:56:32 2011]
refactored online version to standalone version

@todo description
- get scrubbing to work (this is hard since terminalcharacters are not 'videoframes')
- get bigger viewing modes like 120x35 stable & working

Usage example:
<code>
// some code
</code>

@package PLAYTERM
@version 1.0.1
@copyright 2011 Coder of Salvation
@author Coder of Salvation, sqz <info@leon.vankammen.eu>
@license PLAYTERM-WALLIX-001

%license%
###
___trace = (msg, alert) ->
  _trace msg, alert  if tracelevel > 1
__trace = (msg, alert) ->
  _trace msg, alert  if tracelevel > 1
_trace = (msg, alert) ->
  return  if window and window.location.hash isnt `undefined` and window.location.hash isnt "#debug"
  window.alert msg  if tracelevel and alert
  console.log msg  if tracelevel and window.console isnt `undefined`
  msg
_assert = (expr, msg, alert) ->
  _trace msg, alert  unless expr
  expr
tracelevel = 3
playterm_player = window.playterm_player =
  
  #******** the recording data
  data: eval(
    width: "80"
    height: "24"
    timeline: [
      d: [["r", "leon@dev:/tmp/xdebug$                                                           "], ["a", " "], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      x: 23
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 1
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337588.00801
      i: 1
    ,
      y: 1
      d: [[0, 22, "h"]]
      x: 24
      t: 1330337588.5411
    ,
      y: 1
      d: [[0, 23, "i"]]
      x: 25
      t: 1330337588.57557
    ,
      y: 1
      d: [[0, 24, "!"]]
      x: 26
      t: 1330337588.87967
    ,
      y: 1
      d: [[0, 24, " "]]
      x: 25
      t: 1330337589.39171
    ,
      y: 1
      d: [[0, 23, " "]]
      x: 24
      t: 1330337589.54368
    ,
      y: 1
      d: [[0, 22, " "]]
      x: 23
      t: 1330337589.70823
    ,
      y: 1
      d: [[0, 22, "p"]]
      x: 24
      t: 1330337590.13204
    ,
      y: 1
      d: [[0, 23, "h"]]
      x: 25
      t: 1330337590.2529
    ,
      y: 1
      d: [[0, 24, "p"]]
      x: 26
      t: 1330337590.35298
    ,
      y: 1
      x: 27
      t: 1330337590.41693
    ,
      y: 1
      d: [[0, 26, "d"]]
      x: 28
      t: 1330337590.56083
    ,
      y: 1
      d: [[0, 27, "e"]]
      x: 29
      t: 1330337590.72087
    ,
      y: 1
      d: [[0, 28, "v"]]
      x: 30
      t: 1330337590.87238
    ,
      y: 1
      d: [[0, 29, "e"]]
      x: 31
      t: 1330337590.93694
    ,
      y: 1
      d: [[0, 30, "l"]]
      x: 32
      t: 1330337590.97276
    ,
      y: 1
      d: [[0, 31, "o"]]
      x: 33
      t: 1330337591.18496
    ,
      y: 1
      d: [[0, 32, "p"]]
      x: 34
      t: 1330337591.24497
    ,
      y: 1
      d: [[0, 33, "i"]]
      x: 35
      t: 1330337591.44513
    ,
      y: 1
      d: [[0, 34, "n"]]
      x: 36
      t: 1330337591.72122
    ,
      y: 1
      d: [[0, 35, "g"]]
      x: 38
      t: 1330337591.74501
    ,
      y: 1
      d: [[0, 37, "i"]]
      x: 39
      t: 1330337591.91691
    ,
      y: 1
      d: [[0, 38, "s"]]
      x: 40
      t: 1330337592.04497
    ,
      y: 1
      x: 41
      t: 1330337592.11719
    ,
      y: 1
      d: [[0, 40, "f"]]
      x: 42
      t: 1330337592.25734
    ,
      y: 1
      d: [[0, 41, "u"]]
      x: 43
      t: 1330337592.32105
    ,
      y: 1
      d: [[0, 42, "n"]]
      x: 44
      t: 1330337592.39303
    ,
      y: 1
      d: [[0, 43, "!"]]
      x: 45
      t: 1330337592.64532
    ,
      y: 1
      d: [[0, 44, 45, "^C"]]
      x: 47
      t: 1330337593.38661
    ,
      y: 2
      d: [[1, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337593.38696
    ,
      y: 2
      d: [[1, 22, "p"]]
      x: 24
      t: 1330337594.25677
    ,
      y: 2
      d: [[1, 23, "h"]]
      x: 25
      t: 1330337594.39306
    ,
      y: 2
      d: [[1, 24, "p"]]
      x: 26
      t: 1330337594.58553
    ,
      y: 2
      x: 27
      t: 1330337595.29801
    ,
      y: 2
      d: [[1, 26, "b"]]
      x: 28
      t: 1330337595.49798
    ,
      y: 2
      d: [[1, 27, "u"]]
      x: 29
      t: 1330337595.57812
    ,
      y: 2
      d: [[1, 28, "g"]]
      x: 30
      t: 1330337595.6301
    ,
      y: 2
      d: [[1, 29, "s"]]
      x: 31
      t: 1330337595.73834
    ,
      y: 2
      x: 32
      t: 1330337595.8303
    ,
      y: 2
      d: [[1, 31, "i"]]
      x: 33
      t: 1330337595.97451
    ,
      y: 2
      d: [[1, 32, "f"]]
      x: 34
      t: 1330337596.0905
    ,
      y: 2
      x: 35
      t: 1330337596.17057
    ,
      y: 2
      d: [[1, 34, "n"]]
      x: 36
      t: 1330337596.38681
    ,
      y: 2
      d: [[1, 35, "o"]]
      x: 37
      t: 1330337596.3906
    ,
      y: 2
      d: [[1, 36, "t"]]
      x: 38
      t: 1330337596.4945
    ,
      y: 2
      x: 39
      t: 1330337596.56675
    ,
      y: 2
      d: [[1, 38, "f"]]
      x: 40
      t: 1330337596.7948
    ,
      y: 2
      d: [[1, 39, "u"]]
      x: 41
      t: 1330337596.85453
    ,
      y: 2
      d: [[1, 40, "n"]]
      x: 42
      t: 1330337596.91882
    ,
      y: 2
      d: [[1, 41, "!"]]
      x: 43
      t: 1330337597.17899
    ,
      y: 2
      d: [[1, 42, 43, "^C"]]
      x: 45
      t: 1330337597.74332
    ,
      y: 3
      d: [[2, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337597.74363
    ,
      y: 3
      d: [[2, 22, "p"]]
      x: 24
      t: 1330337598.54382
    ,
      y: 3
      d: [[2, 23, "h"]]
      x: 25
      t: 1330337598.63963
    ,
      y: 3
      d: [[2, 24, "p"]]
      x: 26
      t: 1330337598.73149
    ,
      y: 3
      x: 27
      t: 1330337598.82773
    ,
      y: 3
      d: [[2, 26, "x"]]
      x: 28
      t: 1330337598.96853
    ,
      y: 3
      d: [[2, 27, "d"]]
      x: 29
      t: 1330337599.13864
    ,
      y: 3
      d: [[2, 28, "e"]]
      x: 30
      t: 1330337599.87617
    ,
      y: 3
      d: [[2, 29, "b"]]
      x: 31
      t: 1330337600.04791
    ,
      y: 3
      d: [[2, 30, "u"]]
      x: 32
      t: 1330337600.33203
    ,
      y: 3
      d: [[2, 31, "g"]]
      x: 33
      t: 1330337600.33366
    ,
      y: 3
      x: 34
      t: 1330337600.59186
    ,
      y: 3
      d: [[2, 33, "i"]]
      x: 35
      t: 1330337600.5919
    ,
      y: 3
      d: [[2, 34, "s"]]
      x: 36
      t: 1330337600.71632
    ,
      y: 3
      x: 37
      t: 1330337600.80502
    ,
      y: 3
      d: [[2, 36, "a"]]
      x: 38
      t: 1330337601.94929
    ,
      y: 3
      x: 39
      t: 1330337602.0574
    ,
      y: 3
      d: [[2, 38, "f"]]
      x: 40
      t: 1330337602.16136
    ,
      y: 3
      d: [[2, 39, "u"]]
      x: 41
      t: 1330337602.27323
    ,
      y: 3
      d: [[2, 40, "n"]]
      x: 42
      t: 1330337602.39722
    ,
      y: 3
      x: 43
      t: 1330337602.4251
    ,
      y: 3
      d: [[2, 42, "m"]]
      x: 44
      t: 1330337602.62923
    ,
      y: 3
      d: [[2, 43, "o"]]
      x: 45
      t: 1330337602.70925
    ,
      y: 3
      d: [[2, 44, "d"]]
      x: 46
      t: 1330337602.80128
    ,
      y: 3
      d: [[2, 45, "u"]]
      x: 47
      t: 1330337602.9934
    ,
      y: 3
      d: [[2, 46, "l"]]
      x: 48
      t: 1330337603.04506
    ,
      y: 3
      d: [[2, 47, "e"]]
      x: 49
      t: 1330337603.2219
    ,
      y: 3
      x: 50
      t: 1330337603.96222
    ,
      y: 3
      d: [[2, 49, "f"]]
      x: 51
      t: 1330337604.0739
    ,
      y: 3
      d: [[2, 50, "o"]]
      x: 52
      t: 1330337604.16988
    ,
      y: 3
      d: [[2, 51, "r"]]
      x: 53
      t: 1330337604.25409
    ,
      y: 3
      x: 54
      t: 1330337604.3221
    ,
      y: 3
      d: [[2, 53, "p"]]
      x: 55
      t: 1330337604.43402
    ,
      y: 3
      d: [[2, 54, "h"]]
      x: 56
      t: 1330337604.52193
    ,
      y: 3
      d: [[2, 55, "p"]]
      x: 57
      t: 1330337604.61808
    ,
      y: 3
      d: [[2, 56, "!"]]
      x: 58
      t: 1330337604.84626
    ,
      y: 3
      d: [[2, 57, 58, "^C"]]
      x: 60
      t: 1330337605.34255
    ,
      y: 4
      d: [[3, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337605.34404
    ,
      y: 4
      d: [[3, 22, "h"]]
      x: 24
      t: 1330337605.95588
    ,
      y: 4
      d: [[3, 23, "o"]]
      x: 25
      t: 1330337606.00766
    ,
      y: 4
      d: [[3, 24, "w"]]
      x: 26
      t: 1330337606.07161
    ,
      y: 4
      d: [[3, 25, "e"]]
      x: 27
      t: 1330337606.23675
    ,
      y: 4
      d: [[3, 26, "v"]]
      x: 28
      t: 1330337606.33237
    ,
      y: 4
      d: [[3, 27, "e"]]
      x: 29
      t: 1330337606.4974
    ,
      y: 4
      d: [[3, 28, "r"]]
      x: 30
      t: 1330337606.50923
    ,
      y: 4
      d: [[3, 29, "."]]
      x: 31
      t: 1330337606.60913
    ,
      y: 4
      d: [[3, 30, "."]]
      x: 32
      t: 1330337606.78118
    ,
      y: 4
      d: [[3, 31, "o"]]
      x: 33
      t: 1330337606.96553
    ,
      y: 4
      d: [[3, 32, "n"]]
      x: 34
      t: 1330337607.04511
    ,
      d: [["r", "leon@dev:/tmp/xdebug$ php developing is fun!^C                                  "], ["r", "leon@dev:/tmp/xdebug$ php bugs if not fun!^C                                    "], ["r", "leon@dev:/tmp/xdebug$ php xdebug is a fun module for php!^C                     "], ["r", "leon@dev:/tmp/xdebug$ however..on                                               "], ["a", " "], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      x: 35
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 4
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337607.11317
      i: 1
    ,
      y: 4
      d: [[3, 34, "t"]]
      x: 36
      t: 1330337607.43855
    ,
      y: 4
      d: [[3, 35, 36, "he"]]
      x: 39
      t: 1330337607.4387
    ,
      y: 4
      d: [[3, 38, "c"]]
      x: 40
      t: 1330337607.57404
    ,
      y: 4
      d: [[3, 39, "m"]]
      x: 41
      t: 1330337607.91898
    ,
      y: 4
      d: [[3, 40, "d"]]
      x: 42
      t: 1330337608.01874
    ,
      y: 4
      d: [[3, 41, "l"]]
      x: 43
      t: 1330337608.19479
    ,
      y: 4
      d: [[3, 42, "i"]]
      x: 44
      t: 1330337608.27461
    ,
      y: 4
      d: [[3, 43, "n"]]
      x: 45
      t: 1330337608.35073
    ,
      y: 4
      d: [[3, 44, "e"]]
      x: 46
      t: 1330337608.41492
    ,
      y: 4
      d: [[3, 45, "."]]
      x: 47
      t: 1330337608.58256
    ,
      y: 4
      d: [[3, 46, "."]]
      x: 48
      t: 1330337608.73858
    ,
      y: 4
      d: [[3, 47, "t"]]
      x: 49
      t: 1330337608.85478
    ,
      y: 4
      d: [[3, 48, "h"]]
      x: 50
      t: 1330337608.97895
    ,
      y: 4
      d: [[3, 49, "e"]]
      x: 51
      t: 1330337609.03085
    ,
      y: 4
      d: [[3, 50, "r"]]
      x: 52
      t: 1330337609.09923
    ,
      y: 4
      d: [[3, 51, "e"]]
      x: 53
      t: 1330337609.22707
    ,
      y: 4
      d: [[3, 52, "'"]]
      x: 54
      t: 1330337609.4711
    ,
      y: 4
      d: [[3, 53, "s"]]
      x: 55
      t: 1330337609.55896
    ,
      y: 4
      x: 56
      t: 1330337609.76368
    ,
      y: 4
      d: [[3, 55, "a"]]
      x: 57
      t: 1330337610.15175
    ,
      y: 4
      x: 58
      t: 1330337610.31589
    ,
      y: 4
      d: [[3, 57, "g"]]
      x: 59
      t: 1330337610.44787
    ,
      y: 4
      d: [[3, 58, "r"]]
      x: 60
      t: 1330337610.53161
    ,
      y: 4
      d: [[3, 59, "e"]]
      x: 61
      t: 1330337610.57579
    ,
      y: 4
      d: [[3, 60, "a"]]
      x: 62
      t: 1330337610.74082
    ,
      y: 4
      d: [[3, 61, "t"]]
      x: 63
      t: 1330337610.86352
    ,
      y: 4
      x: 64
      t: 1330337610.92359
    ,
      y: 4
      d: [[3, 63, "u"]]
      x: 65
      t: 1330337611.04764
    ,
      y: 4
      d: [[3, 64, "t"]]
      x: 66
      t: 1330337611.50545
    ,
      y: 4
      d: [[3, 65, "i"]]
      x: 67
      t: 1330337611.56533
    ,
      y: 4
      d: [[3, 66, "l"]]
      x: 68
      t: 1330337611.68923
    ,
      y: 4
      d: [[3, 67, "i"]]
      x: 69
      t: 1330337611.76509
    ,
      y: 4
      d: [[3, 68, "t"]]
      x: 70
      t: 1330337611.85324
    ,
      y: 4
      d: [[3, 69, "y"]]
      x: 71
      t: 1330337611.96515
    ,
      y: 4
      d: [[3, 70, 71, "^C"]]
      x: 73
      t: 1330337612.23803
    ,
      y: 5
      d: [[4, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337612.23835
    ,
      y: 5
      d: [[4, 22, "c"]]
      x: 24
      t: 1330337612.45392
    ,
      y: 5
      d: [[4, 23, "a"]]
      x: 25
      t: 1330337612.57028
    ,
      y: 5
      d: [[4, 24, "l"]]
      x: 26
      t: 1330337612.6821
    ,
      y: 5
      d: [[4, 25, "l"]]
      x: 27
      t: 1330337612.83044
    ,
      y: 5
      d: [[4, 26, "e"]]
      x: 28
      t: 1330337612.89856
    ,
      y: 5
      d: [[4, 27, "d"]]
      x: 29
      t: 1330337613.05437
    ,
      y: 5
      x: 30
      t: 1330337613.18646
    ,
      y: 5
      d: [[4, 29, "'"]]
      x: 31
      t: 1330337613.78681
    ,
      y: 5
      d: [[4, 30, "x"]]
      x: 32
      t: 1330337614.01504
    ,
      y: 5
      d: [[4, 31, "d"]]
      x: 33
      t: 1330337614.17542
    ,
      y: 5
      d: [[4, 32, "e"]]
      x: 34
      t: 1330337614.3281
    ,
      y: 5
      d: [[4, 33, "b"]]
      x: 35
      t: 1330337614.38411
    ,
      y: 5
      d: [[4, 34, "u"]]
      x: 36
      t: 1330337614.46797
    ,
      y: 5
      d: [[4, 35, "g"]]
      x: 37
      t: 1330337614.55588
    ,
      y: 5
      d: [[4, 36, "'"]]
      x: 38
      t: 1330337614.6881
    ,
      y: 5
      x: 39
      t: 1330337614.77602
    ,
      y: 5
      d: [[4, 38, "!"]]
      x: 40
      t: 1330337615.47394
    ,
      y: 5
      d: [[4, 39, 40, "^C"]]
      x: 42
      t: 1330337616.29879
    ,
      y: 6
      d: [[5, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337616.2991
    ,
      y: 6
      d: [[5, 22, "*"]]
      x: 24
      t: 1330337617.36799
    ,
      y: 6
      d: [[5, 23, "D"]]
      x: 25
      t: 1330337617.54134
    ,
      y: 6
      d: [[5, 24, "I"]]
      x: 26
      t: 1330337617.65995
    ,
      y: 6
      d: [[5, 25, "S"]]
      x: 27
      t: 1330337617.74939
    ,
      y: 6
      d: [[5, 26, "C"]]
      x: 28
      t: 1330337617.86556
    ,
      y: 6
      d: [[5, 27, "A"]]
      x: 29
      t: 1330337618.0933
    ,
      y: 6
      d: [[5, 27, " "]]
      x: 28
      t: 1330337618.70253
    ,
      y: 6
      d: [[5, 27, "L"]]
      x: 29
      t: 1330337618.96441
    ,
      y: 6
      d: [[5, 28, "A"]]
      x: 30
      t: 1330337619.0845
    ,
      y: 6
      d: [[5, 29, "I"]]
      x: 31
      t: 1330337619.21751
    ,
      y: 6
      d: [[5, 30, "M"]]
      x: 32
      t: 1330337619.43086
    ,
      y: 6
      d: [[5, 31, "E"]]
      x: 33
      t: 1330337619.5148
    ,
      y: 6
      d: [[5, 32, "R"]]
      x: 34
      t: 1330337619.59484
    ,
      y: 6
      d: [[5, 33, "*"]]
      x: 35
      t: 1330337619.85479
    ,
      y: 6
      x: 36
      t: 1330337620.0312
    ,
      y: 6
      d: [[5, 35, "I"]]
      x: 37
      t: 1330337620.33902
    ,
      y: 6
      x: 38
      t: 1330337620.41481
    ,
      y: 6
      d: [[5, 37, "m"]]
      x: 39
      t: 1330337620.61539
    ,
      y: 6
      d: [[5, 38, 39, "na"]]
      x: 41
      t: 1330337620.66337
    ,
      y: 6
      d: [[5, 40, "d"]]
      x: 42
      t: 1330337620.73534
    ,
      y: 6
      d: [[5, 40, " "]]
      x: 41
      t: 1330337621.16344
    ,
      y: 6
      d: [[5, 39, " "]]
      x: 40
      t: 1330337621.30741
    ,
      y: 6
      d: [[5, 38, " "]]
      x: 39
      t: 1330337621.46723
    ,
      y: 6
      d: [[5, 38, "a"]]
      x: 40
      t: 1330337621.55949
    ,
      y: 6
      d: [[5, 39, "d"]]
      x: 41
      t: 1330337621.65942
    ,
      y: 6
      d: [[5, 40, "e"]]
      x: 42
      t: 1330337621.72744
    ,
      y: 6
      x: 43
      t: 1330337621.88338
    ,
      y: 6
      d: [[5, 42, "t"]]
      x: 44
      t: 1330337621.95136
    ,
      y: 6
      d: [[5, 43, "h"]]
      x: 45
      t: 1330337622.03575
    ,
      y: 6
      d: [[5, 44, "i"]]
      x: 46
      t: 1330337622.09974
    ,
      y: 6
      d: [[5, 45, "s"]]
      x: 47
      t: 1330337622.19567
    ,
      y: 6
      x: 48
      t: 1330337622.26771
    ,
      y: 6
      d: [[5, 47, "u"]]
      x: 49
      t: 1330337623.47615
    ,
      y: 6
      d: [[5, 48, "t"]]
      x: 50
      t: 1330337623.56425
    ,
      y: 6
      d: [[5, 49, "i"]]
      x: 51
      t: 1330337623.67228
    ,
      y: 6
      d: [[5, 50, "l"]]
      x: 52
      t: 1330337623.76836
    ,
      y: 6
      d: [[5, 51, "i"]]
      x: 53
      t: 1330337623.85245
    ,
      y: 6
      d: [[5, 52, "t"]]
      x: 54
      t: 1330337623.94144
    ,
      y: 6
      d: [[5, 53, "y"]]
      x: 55
      t: 1330337624.07647
    ,
      y: 6
      x: 56
      t: 1330337624.15759
    ,
      y: 6
      d: [[5, 55, ":"]]
      x: 57
      t: 1330337624.43776
    ,
      y: 6
      d: [[5, 56, ")"]]
      x: 58
      t: 1330337624.67791
    ,
      y: 7
      d: [[5, 57, 58, "^C"], [6, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337624.95027
    ,
      y: 7
      d: [[6, 22, "o"]]
      x: 24
      t: 1330337625.51029
    ,
      d: [["r", "leon@dev:/tmp/xdebug$ php developing is fun!^C                                  "], ["r", "leon@dev:/tmp/xdebug$ php bugs if not fun!^C                                    "], ["r", "leon@dev:/tmp/xdebug$ php xdebug is a fun module for php!^C                     "], ["r", "leon@dev:/tmp/xdebug$ however..on the cmdline..there's a great utility^C        "], ["r", "leon@dev:/tmp/xdebug$ called 'xdebug' !^C                                       "], ["r", "leon@dev:/tmp/xdebug$ *DISCLAIMER* I made this utility :)^C                     "], ["r", "leon@dev:/tmp/xdebug$ ok                                                        "], ["a", " "], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      x: 25
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 7
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337625.56617
      i: 1
    ,
      y: 7
      d: [[6, 24, "."]]
      x: 26
      t: 1330337625.76638
    ,
      y: 7
      d: [[6, 25, "."]]
      x: 27
      t: 1330337625.91015
    ,
      y: 8
      d: [[6, 26, 27, "^C"], [7, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337626.78778
    ,
      y: 8
      d: [[7, 22, "c"]]
      x: 24
      t: 1330337627.98162
    ,
      y: 8
      d: [[7, 23, "h"]]
      x: 25
      t: 1330337628.06567
    ,
      y: 8
      d: [[7, 24, "e"]]
      x: 26
      t: 1330337628.12998
    ,
      y: 8
      d: [[7, 25, "c"]]
      x: 27
      t: 1330337628.23812
    ,
      y: 8
      d: [[7, 26, "k"]]
      x: 28
      t: 1330337628.25006
    ,
      y: 8
      x: 29
      t: 1330337628.31001
    ,
      y: 8
      d: [[7, 28, "t"]]
      x: 30
      t: 1330337628.47428
    ,
      y: 8
      d: [[7, 29, "h"]]
      x: 31
      t: 1330337628.53798
    ,
      y: 8
      d: [[7, 30, "i"]]
      x: 32
      t: 1330337628.58987
    ,
      y: 8
      d: [[7, 31, "s"]]
      x: 33
      t: 1330337628.67394
    ,
      y: 8
      x: 34
      t: 1330337628.77424
    ,
      y: 8
      d: [[7, 33, "o"]]
      x: 35
      t: 1330337628.94212
    ,
      y: 8
      d: [[7, 34, "u"]]
      x: 36
      t: 1330337629.01386
    ,
      y: 8
      d: [[7, 35, "t"]]
      x: 37
      t: 1330337629.07806
    ,
      y: 8
      d: [[7, 36, "."]]
      x: 38
      t: 1330337629.23449
    ,
      y: 8
      d: [[7, 37, "."]]
      x: 39
      t: 1330337629.32213
    ,
      y: 8
      d: [[7, 38, "w"]]
      x: 40
      t: 1330337629.45401
    ,
      y: 8
      d: [[7, 39, "e"]]
      x: 41
      t: 1330337629.52601
    ,
      y: 8
      x: 42
      t: 1330337629.60589
    ,
      y: 8
      d: [[7, 41, "h"]]
      x: 43
      t: 1330337629.89424
    ,
      y: 8
      d: [[7, 42, "a"]]
      x: 44
      t: 1330337629.95022
    ,
      y: 8
      d: [[7, 43, "v"]]
      x: 45
      t: 1330337630.06618
    ,
      y: 8
      d: [[7, 44, "e"]]
      x: 46
      t: 1330337630.13822
    ,
      y: 8
      x: 47
      t: 1330337630.21501
    ,
      y: 8
      d: [[7, 46, "s"]]
      x: 48
      t: 1330337630.45552
    ,
      y: 8
      d: [[7, 47, "o"]]
      x: 49
      t: 1330337630.50729
    ,
      y: 8
      d: [[7, 48, "m"]]
      x: 50
      t: 1330337630.55949
    ,
      y: 8
      d: [[7, 49, "e"]]
      x: 51
      t: 1330337630.63552
    ,
      y: 8
      x: 52
      t: 1330337630.73942
    ,
      y: 8
      d: [[7, 51, "p"]]
      x: 53
      t: 1330337630.8915
    ,
      y: 8
      d: [[7, 52, "h"]]
      x: 54
      t: 1330337630.96339
    ,
      y: 8
      d: [[7, 53, "p"]]
      x: 55
      t: 1330337631.06798
    ,
      y: 8
      x: 56
      t: 1330337631.16801
    ,
      y: 8
      d: [[7, 55, "c"]]
      x: 57
      t: 1330337631.29593
    ,
      y: 8
      d: [[7, 56, "o"]]
      x: 58
      t: 1330337631.40831
    ,
      y: 8
      d: [[7, 57, "d"]]
      x: 59
      t: 1330337631.50796
    ,
      y: 8
      d: [[7, 58, "e"]]
      x: 60
      t: 1330337631.61649
    ,
      y: 8
      d: [[7, 59, 60, "^C"]]
      x: 62
      t: 1330337631.98858
    ,
      y: 9
      d: [[8, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337631.98988
    ,
      y: 9
      d: [[8, 22, "v"]]
      x: 24
      t: 1330337632.24882
    ,
      y: 9
      d: [[8, 23, "i"]]
      x: 25
      t: 1330337632.32842
    ,
      y: 9
      x: 26
      t: 1330337632.38443
    ,
      y: 9
      d: [[8, 25, "t"]]
      x: 27
      t: 1330337632.5325
    ,
      y: 9
      d: [[8, 26, "e"]]
      x: 28
      t: 1330337632.58038
    ,
      y: 9
      d: [[8, 27, 32, "st.php"]]
      x: 35
      t: 1330337633.04775
    ,
      y: 10
      x: 1
      t: 1330337633.52191
    ,
      y: 24
      x: 1
      t: 1330337633.57379
    ,
      y: 24
      x: 1
      t: 1330337633.582
    ,
      y: 24
      d: [["cp", 9, 0], ["cp", 0, 1], ["cp", 0, 2], ["cp", 0, 3], ["cp", 0, 4], ["cp", 0, 5], ["cp", 0, 6], ["cp", 0, 7], ["cp", 0, 8], [23, 0, 9, "\"test.php\""]]
      x: 11
      t: 1330337633.67292
    ,
      y: 7
      b: [[22, ["a", "4"]]]
      d: [[0, 0, 1, "<?"], [2, 0, 79, "+--  9 lines: class flap{-------------------------------------------------------"], [4, 0, 79, "+--  5 lines: class flop{-------------------------------------------------------"], [6, 0, 79, "+--  8 lines: $f = new flop();--------------------------------------------------"], [8, 0, 1, "?>"], [9, 0, "~"], ["cp", 9, 10], ["cp", 9, 11], ["cp", 9, 12], ["cp", 9, 13], ["cp", 9, 14], ["cp", 9, 15], ["cp", 9, 16], ["cp", 9, 17], ["cp", 9, 18], ["cp", 9, 19], ["cp", 9, 20], ["cp", 9, 21], [22, 0, 64, "/tmp/xdebug/test.php [unix][036][24][0019,0001][67%][ mapping 1 ]"], [23, 11, 20, "28L, 265Cc"]]
      x: 1
      f: [[0, 0, 1, ["a", "6"]], ["cp", 0, 8], [9, ["a", "4"]], ["cp", 9, 10], ["cp", 9, 11], ["cp", 9, 12], ["cp", 9, 13], ["cp", 9, 14], ["cp", 9, 15], ["cp", 9, 16], ["cp", 9, 17], ["cp", 9, 18], ["cp", 9, 19], ["cp", 9, 20], ["cp", 9, 21]]
      B: [[0, 0, 1, ["a", "1"]], [2, ["a", "1"]], ["cp", 2, 4], ["cp", 2, 6], ["cp", 0, 8], ["cp", 2, 9], ["cp", 2, 10], ["cp", 2, 11], ["cp", 2, 12], ["cp", 2, 13], ["cp", 2, 14], ["cp", 2, 15], ["cp", 2, 16], ["cp", 2, 17], ["cp", 2, 18], ["cp", 2, 19], ["cp", 2, 20], ["cp", 2, 21], ["cp", 2, 22]]
      t: 1330337633.70523
    ,
      y: 7
      b: [[6, 0, 59, ["a", "4"]]]
      d: [[6, 1, 59, "q436f+q6b75+q6b64+q6b72+q6b6c+q2332+q2334+q2569+q2a37+q6b31"]]
      x: 61
      t: 1330337634.04375
    ,
      y: 6
      d: [[22, 29, 34, "00][00"], [22, 40, "8"], [22, 49, "4"]]
      x: 1
      t: 1330337634.38826
    ,
      y: 5
      d: [[22, 29, 34, "99][63"], [22, 40, "3"], [22, 48, 49, "46"]]
      x: 1
      t: 1330337634.53638
    ,
      y: 4
      d: [[22, 29, 34, "00][00"], [22, 40, "2"], [22, 49, "2"]]
      x: 1
      t: 1330337634.69625
    ,
      y: 3
      d: [[22, 29, 34, "99][63"], [22, 39, 40, "03"], [22, 48, 49, "10"]]
      x: 1
      t: 1330337634.85588
    ,
      y: 2
      d: [[22, 29, 34, "00][00"], [22, 40, "2"], [22, 48, 64, "7%][ mapping 1 ] "]]
      x: 1
      t: 1330337635.02419
    ,
      y: 3
      d: [[22, 29, 34, "99][63"], [22, 40, "3"], [22, 48, 64, "10%][ mapping 1 ]"]]
      x: 1
      t: 1330337635.30514
    ,
      y: 3
      b: [["cp", 0, 6]]
      d: [[2, 0, 79, "class flap{                                                                     "], [4, 0, 79, "  public $f;                                                                    "], [6, 0, 79, "  function foo(){                                                               "], [7, 4, 19, "print(\"flip\\n\");"], [8, 0, 19, "    $this->f->foo();"], [9, 0, 2, "  }"], [10, 0, "}"], ["cp", 1, 11], [12, 0, 79, "+--  5 lines: class flop{-------------------------------------------------------"], ["cp", 1, 13], [14, 0, 79, "+--  8 lines: $f = new flop();--------------------------------------------------"], ["cp", 1, 15], [16, 0, 1, "?>"], [22, 28, 34, "108][6C"], [22, 45, "2"]]
      x: 2
      f: [[2, 0, 4, ["a", "6"]], [2, 10, "6"], [4, 2, 7, ["a", "6"]], [6, 14, 16, ["a", "6"]], [7, 9, "6"], [7, 15, 18, "6676"], [8, 0, 1, ["a", "7"]], [8, 9, 18, "6676677766"], [9, 0, 79, "77677777777777777777777777777777777777777777777777777777777777777777777777777777"], [10, 0, 79, "67777777777777777777777777777777777777777777777777777777777777777777777777777777"], ["cp", 1, 11], ["cp", 1, 12], ["cp", 1, 13], ["cp", 1, 14], ["cp", 1, 15], ["cp", 0, 16]]
      B: [[2, 5, 79, "000001000000000000000000000000000000000000000000000000000000000000000000000"], [4, 0, 1, ["a", "0"]], [4, 8, 79, ["a", "0"]], [6, 0, 1, ["a", "0"]], [6, 10, 79, "0000111000000000000000000000000000000000000000000000000000000000000000"], [7, 4, 18, "111111011111101"], [8, 0, 1, ["a", "0"]], [8, 9, 18, "1101100011"], [9, 0, 79, "00100000000000000000000000000000000000000000000000000000000000000000000000000000"], [10, 1, 79, ["a", "0"]], ["cp", 1, 11], ["cp", 1, 13], ["cp", 1, 15], ["cp", 0, 16]]
      t: 1330337635.8041
    ,
      y: 4
      d: [[22, 28, 34, "000][00"], [22, 40, "4"], [22, 45, 49, "1][14"]]
      x: 1
      t: 1330337636.57931
    ,
      y: 5
      d: [[22, 29, 33, "32][2"], [22, 40, "5"], [22, 45, 49, "2][17"]]
      x: 2
      t: 1330337637.05543
    ,
      y: 6
      d: [[22, 29, 33, "00][0"], [22, 40, "6"], [22, 45, 49, "1][21"]]
      x: 1
      t: 1330337637.10738
    ,
      y: 7
      d: [[22, 29, 33, "32][2"], [22, 40, "7"], [22, 45, 49, "2][25"]]
      x: 2
      t: 1330337637.15924
    ,
      y: 8
      d: [[22, 40, "8"], [22, 49, "8"]]
      x: 2
      t: 1330337637.20717
    ,
      y: 9
      d: [[22, 40, "9"], [22, 48, 49, "32"]]
      x: 2
      t: 1330337637.25516
    ,
      y: 10
      d: [[22, 39, 40, "10"], [22, 49, "5"]]
      x: 2
      t: 1330337637.30719
    ,
      y: 11
      b: [[2, 10, "6"], [10, 0, "6"]]
      d: [[22, 28, 34, "125][7D"], [22, 40, "1"], [22, 45, 49, "1][39"]]
      x: 1
      t: 1330337638.07577
    ,
      y: 12
      b: [["cp", 0, 2], ["cp", 0, 10]]
      d: [[22, 28, 34, "000][00"], [22, 40, "2"], [22, 48, 49, "42"]]
      x: 1
      t: 1330337639.17365
    ,
      y: 13
      d: [[22, 28, 34, "108][6C"], [22, 40, "3"], [22, 49, "6"]]
      x: 1
      t: 1330337639.27141
    ,
      y: 13
      d: [[12, 0, 79, "class flop{                                                                     "], ["cp", 6, 13], [14, 0, 79, "    print(\"flop\\n\");                                                            "], ["cp", 9, 15], ["cp", 10, 16], ["cp", 1, 17], [18, 0, 79, "+--  8 lines: $f = new flop();--------------------------------------------------"], ["cp", 1, 19], [20, 0, 1, "?>"], [22, 28, 34, "097][61"], [22, 45, "3"]]
      x: 3
      f: [["cp", 2, 12], ["cp", 6, 13], ["cp", 7, 14], ["cp", 9, 15], ["cp", 10, 16], ["cp", 1, 17], ["cp", 1, 18], ["cp", 1, 19], ["cp", 0, 20]]
      B: [["cp", 2, 12], ["cp", 6, 13], ["cp", 7, 14], ["cp", 9, 15], ["cp", 10, 16], ["cp", 1, 17], ["cp", 1, 19], ["cp", 0, 20]]
      t: 1330337639.8192
    ,
      y: 14
      d: [[22, 28, 34, "102][66"], [22, 40, "4"], [22, 48, 49, "50"]]
      x: 3
      t: 1330337640.15303
    ,
      y: 15
      d: [[22, 28, 34, "032][20"], [22, 40, "5"], [22, 49, "3"]]
      x: 3
      t: 1330337640.42102
    ,
      y: 16
      b: [[13, 16, "6"], [15, 2, "6"]]
      d: [[22, 28, 34, "125][7D"], [22, 40, "6"], [22, 49, "7"]]
      x: 3
      t: 1330337640.6059
    ,
      y: 17
      b: [[12, 10, "6"], ["cp", 0, 13], ["cp", 0, 15], [16, 0, "6"]]
      d: [[22, 40, "7"], [22, 45, 49, "1][60"]]
      x: 1
      t: 1330337640.77398
    ,
      y: 17
      x: 1
      t: 1330337641.11116
    ,
      y: 17
      d: [[22, 28, 34, "000][00"], [22, 45, "2"], [23, 0, 20, "-- INSERT --         "]]
      x: 2
      B: [[23, 0, 11, ["a", "1"]]]
      t: 1330337641.11147
    ,
      y: 23
      d: [["cp", 1, 18], [19, 0, 79, "+--  8 lines: $f = new flop();--------------------------------------------------"], ["cp", 1, 20], [22, 22, 67, "+][unix][000][00][0018,0001][62%][ mapping 1 ]"]]
      x: 69
      f: [["cp", 1, 20]]
      B: [["cp", 1, 18], ["cp", 21, 19], ["cp", 1, 20]]
      t: 1330337641.24679
    ,
      y: 18
      b: [["cp", 0, 12], ["cp", 0, 16]]
      x: 1
      t: 1330337641.2505
    ,
      y: 19
      d: [["cp", 1, 19], [20, 0, 79, "+--  8 lines: $f = new flop();--------------------------------------------------"]]
      x: 1
      B: [["cp", 1, 19], ["cp", 21, 20]]
      t: 1330337641.42237
    ,
      y: 19
      d: [[22, 43, "9"], [22, 52, "3"]]
      x: 1
      t: 1330337641.42308
    ,
      y: 19
      d: [[18, 0, "j"], [22, 48, "2"]]
      x: 2
      t: 1330337641.79112
    ,
      y: 19
      d: [[18, 1, "u"], [22, 48, "3"]]
      x: 3
      t: 1330337641.95869
    ,
      y: 19
      d: [[18, 2, "s"], [22, 48, "4"]]
      x: 4
      t: 1330337641.99478
    ,
      y: 19
      d: [[18, 3, "t"], [22, 48, "5"]]
      x: 5
      t: 1330337642.08271
    ,
      y: 19
      d: [[22, 48, "6"]]
      x: 6
      t: 1330337642.131
    ,
      y: 19
      d: [[18, 5, "s"], [22, 48, "7"]]
      x: 7
      t: 1330337642.25605
    ,
      y: 19
      d: [[18, 6, "o"], [22, 48, "8"]]
      x: 8
      t: 1330337642.48839
    ,
      y: 19
      d: [[18, 7, "m"], [22, 48, "9"]]
      x: 9
      t: 1330337642.52074
    ,
      y: 19
      d: [[18, 8, "e"], [22, 47, 48, "10"]]
      x: 10
      t: 1330337642.61736
    ,
      y: 19
      d: [[22, 48, "1"]]
      x: 11
      t: 1330337642.76128
    ,
      y: 19
      d: [[18, 10, "s"], [22, 48, "2"]]
      x: 12
      t: 1330337642.8573
    ,
      y: 19
      d: [[18, 11, "i"]]
      x: 13
      t: 1330337642.92968
    ,
      y: 19
      d: [[22, 48, "3"]]
      x: 13
      t: 1330337642.93799
    ,
      y: 19
      d: [[18, 12, "m"], [22, 48, "4"]]
      x: 14
      t: 1330337642.98911
    ,
      y: 19
      d: [[18, 13, "p"], [22, 48, "5"]]
      x: 15
      t: 1330337643.12125
    ,
      y: 19
      d: [[18, 14, "l"], [22, 48, "6"]]
      x: 16
      t: 1330337643.18536
    ,
      y: 19
      d: [[18, 15, "e"], [22, 48, "7"]]
      x: 17
      t: 1330337643.2655
    ,
      d: [["r", "<?                                                                              "], ["a", " "], ["r", "class flap{                                                                     "], ["a", " "], ["r", "  public $f;                                                                    "], ["a", " "], ["r", "  function foo(){                                                               "], ["r", "    print(\"flip\\n\");                                                            "], ["r", "    $this->f->foo();                                                            "], ["r", "  }                                                                             "], ["r", "}                                                                               "], ["a", " "], ["r", "class flop{                                                                     "], ["r", "  function foo(){                                                               "], ["r", "    print(\"flop\\n\");                                                            "], ["r", "  }                                                                             "], ["r", "}                                                                               "], ["a", " "], ["r", "just some simple                                                                "], ["a", " "], ["r", "+--  8 lines: $f = new flop();--------------------------------------------------"], ["r", "~                                                                               "], ["r", "/tmp/xdebug/test.php [+][unix][000][00][0019,0018][63%][ mapping 1 ]            "], ["r", "-- INSERT --                                                                    "]]
      x: 18
      B: [["r", "11000000000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], ["r", "11111000001000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], ["r", "00111111000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], ["r", "00111111110000111000000000000000000000000000000000000000000000000000000000000000"], ["r", "00001111110111111010000000000000000000000000000000000000000000000000000000000000"], ["r", "00000000011011000110000000000000000000000000000000000000000000000000000000000000"], ["r", "00100000000000000000000000000000000000000000000000000000000000000000000000000000"], ["r", "10000000000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], ["r", "11111000001000000000000000000000000000000000000000000000000000000000000000000000"], ["r", "00111111110000111000000000000000000000000000000000000000000000000000000000000000"], ["r", "00001111110111111010000000000000000000000000000000000000000000000000000000000000"], ["r", "00100000000000000000000000000000000000000000000000000000000000000000000000000000"], ["r", "10000000000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", "d", ["a", "1"], "d", "d", ["r", "11111111111100000000000000000000000000000000000000000000000000000000000000000000"]]
      y: 19
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", ["a", "4"], ["a", "0"]]
      f: [["r", "66777777777777777777777777777777777777777777777777777777777777777777777777777777"], ["a", "7"], ["r", "66666777776777777777777777777777777777777777777777777777777777777777777777777777"], ["a", "7"], ["r", "77666666777777777777777777777777777777777777777777777777777777777777777777777777"], ["a", "7"], ["r", "77777777777777666777777777777777777777777777777777777777777777777777777777777777"], ["r", "77777777767777766767777777777777777777777777777777777777777777777777777777777777"], ["r", "77777777766766777667777777777777777777777777777777777777777777777777777777777777"], ["r", "77677777777777777777777777777777777777777777777777777777777777777777777777777777"], ["r", "67777777777777777777777777777777777777777777777777777777777777777777777777777777"], ["a", "7"], ["r", "66666777776777777777777777777777777777777777777777777777777777777777777777777777"], ["r", "77777777777777666777777777777777777777777777777777777777777777777777777777777777"], ["r", "77777777767777766767777777777777777777777777777777777777777777777777777777777777"], ["r", "77677777777777777777777777777777777777777777777777777777777777777777777777777777"], ["r", "67777777777777777777777777777777777777777777777777777777777777777777777777777777"], ["a", "7"], "d", "d", "d", ["a", "4"], ["a", "7"], "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337643.36129
      i: 1
    ,
      y: 19
      d: [[18, 17, "c"], [22, 48, "9"]]
      x: 19
      t: 1330337643.4814
    ,
      y: 19
      d: [[18, 18, "l"]]
      x: 20
      t: 1330337643.6015
    ,
      y: 19
      b: [[19, 16, 31, ["a", "7"]]]
      d: [[19, 17, 21, "class"], [23, 3, 42, "Keyword completion (^N^P) The only match"]]
      x: 20
      f: [[19, 16, 31, ["a", "0"]]]
      B: [[23, 12, 42, ["a", "1"]]]
      t: 1330337643.60562
    ,
      y: 20
      b: [["cp", 0, 19]]
      d: [[18, 19, "a"], ["cp", 1, 19]]
      x: 17
      f: [["cp", 1, 19]]
      t: 1330337643.69622
    ,
      y: 19
      b: [[19, 16, 31, ["a", "7"]]]
      d: [[19, 17, 21, "class"], [22, 47, 48, "20"]]
      x: 21
      f: [[19, 16, 31, ["a", "0"]]]
      t: 1330337643.69637
    ,
      y: 20
      b: [["cp", 0, 19]]
      d: [[18, 20, "s"], ["cp", 1, 19]]
      x: 17
      f: [["cp", 1, 19]]
      t: 1330337643.85206
    ,
      y: 19
      b: [[19, 16, 31, ["a", "7"]]]
      d: [[19, 17, 21, "class"], [22, 48, "1"]]
      x: 22
      f: [[19, 16, 31, ["a", "0"]]]
      t: 1330337643.85224
    ,
      y: 20
      b: [["cp", 0, 19]]
      d: [[18, 21, "s"], ["cp", 1, 19]]
      x: 17
      f: [[18, 17, 21, ["a", "6"]], ["cp", 1, 19]]
      B: [[18, 17, 21, ["a", "1"]]]
      t: 1330337643.96028
    ,
      y: 19
      b: [[19, 16, 31, ["a", "7"]]]
      d: [[19, 17, 21, "class"], [22, 48, "2"]]
      x: 23
      f: [[19, 16, 31, ["a", "0"]]]
      t: 1330337643.96049
    ,
      y: 20
      b: [["cp", 0, 19]]
      d: [[18, 22, "e"], ["cp", 1, 19]]
      x: 17
      f: [["cp", 1, 18], ["cp", 1, 19]]
      B: [["cp", 1, 18]]
      t: 1330337644.06412
    ,
      y: 19
      d: [[22, 48, "4"]]
      x: 24
      t: 1330337644.06792
    ,
      y: 19
      d: [[18, 23, "s"]]
      x: 25
      t: 1330337644.17288
    ,
      y: 19
      d: [[22, 48, "5"], [23, 3, 42, "INSERT --                               "]]
      x: 25
      B: [[23, 12, 42, ["a", "0"]]]
      t: 1330337644.18146
    ,
      y: 19
      d: [[18, 24, "."], [22, 48, "6"]]
      x: 26
      t: 1330337644.32556
    ,
      y: 19
      d: [[18, 25, "."], [22, 48, "7"]]
      x: 27
      t: 1330337644.47767
    ,
      y: 19
      d: [[18, 26, "."], [22, 48, "8"]]
      x: 28
      t: 1330337644.61358
    ,
      y: 19
      d: [[18, 27, "a"], [22, 48, "9"]]
      x: 29
      t: 1330337644.98322
    ,
      y: 19
      d: [[18, 28, "n"]]
      x: 30
      t: 1330337645.06327
    ,
      y: 19
      d: [[22, 47, 48, "30"]]
      x: 30
      t: 1330337645.07157
    ,
      y: 19
      d: [[18, 29, "d"], [22, 48, "1"]]
      x: 31
      t: 1330337645.14303
    ,
      y: 19
      d: [[22, 48, "2"]]
      x: 32
      t: 1330337645.24706
    ,
      y: 19
      d: [[18, 31, "o"], [22, 48, "3"]]
      x: 33
      t: 1330337645.48004
    ,
      y: 19
      d: [[18, 32, 33, "ms"], [22, 48, "5"]]
      x: 35
      t: 1330337645.50408
    ,
      y: 19
      d: [[18, 34, "e"], [22, 48, "6"]]
      x: 36
      t: 1330337645.85626
    ,
      y: 19
      d: [[22, 48, "7"]]
      x: 37
      t: 1330337645.88802
    ,
      y: 19
      x: 37
      t: 1330337646.20437
    ,
      y: 19
      d: [[22, 48, "6"]]
      x: 36
      t: 1330337646.21285
    ,
      y: 19
      d: [[18, 34, " "]]
      x: 35
      t: 1330337646.33613
    ,
      y: 19
      d: [[22, 48, "5"]]
      x: 35
      t: 1330337646.34453
    ,
      y: 19
      d: [[18, 33, " "]]
      x: 34
      t: 1330337646.50019
    ,
      y: 19
      d: [[22, 48, "4"]]
      x: 34
      t: 1330337646.50856
    ,
      y: 19
      d: [[18, 32, " "], [22, 48, "3"]]
      x: 33
      t: 1330337646.65199
    ,
      y: 19
      d: [[18, 31, " "], [22, 48, "2"]]
      x: 32
      t: 1330337646.81229
    ,
      y: 19
      d: [[18, 31, "s"], [22, 48, "3"]]
      x: 33
      t: 1330337646.92806
    ,
      y: 19
      d: [[18, 32, "o"]]
      x: 34
      t: 1330337647.04841
    ,
      y: 19
      b: [[19, 30, 45, ["a", "7"]]]
      d: [[18, 33, "m"], [19, 31, 34, "some"], [22, 48, "4"], [23, 3, 42, "Keyword completion (^N^P) The only match"]]
      x: 35
      f: [[19, 30, 45, ["a", "0"]]]
      B: [[23, 12, 42, ["a", "1"]]]
      t: 1330337647.08314
    ,
      y: 20
      b: [["cp", 0, 19]]
      d: [[18, 34, "e"], ["cp", 1, 19]]
      x: 31
      f: [["cp", 1, 19]]
      t: 1330337647.16699
    ,
      y: 19
      b: [[19, 30, 45, ["a", "7"]]]
      d: [[19, 31, 34, "some"], [22, 48, "5"]]
      x: 36
      f: [[19, 30, 45, ["a", "0"]]]
      t: 1330337647.1858
    ,
      y: 19
      x: 36
      t: 1330337647.26291
    ,
      y: 19
      b: [["cp", 0, 19]]
      d: [["cp", 1, 19], [22, 48, "7"], [23, 3, 42, "INSERT --                               "]]
      x: 37
      f: [["cp", 1, 19]]
      B: [[23, 12, 42, ["a", "0"]]]
      t: 1330337647.271
    ,
      y: 19
      d: [[18, 36, "m"], [22, 48, "8"]]
      x: 38
      t: 1330337647.62085
    ,
      y: 19
      d: [[18, 37, "a"]]
      x: 39
      t: 1330337647.6724
    ,
      y: 19
      d: [[22, 48, "9"]]
      x: 39
      t: 1330337647.68094
    ,
      y: 19
      d: [[18, 38, "i"], [22, 47, 48, "40"]]
      x: 40
      t: 1330337647.80089
    ,
      y: 19
      d: [[18, 39, "n"], [22, 48, "1"]]
      x: 41
      t: 1330337647.86091
    ,
      y: 19
      d: [[18, 40, "c"], [22, 48, "2"]]
      x: 42
      t: 1330337647.96486
    ,
      y: 19
      d: [[18, 41, "o"], [22, 48, "3"]]
      x: 43
      t: 1330337648.08091
    ,
      y: 19
      d: [[18, 42, "d"], [22, 48, "4"]]
      x: 44
      t: 1330337648.15647
    ,
      y: 19
      d: [[18, 43, "e"], [22, 48, "5"]]
      x: 45
      t: 1330337648.30104
    ,
      y: 19
      d: [["cp", 1, 23]]
      x: 44
      B: [["cp", 1, 23]]
      t: 1330337648.63241
    ,
      y: 19
      x: 44
      t: 1330337648.98456
    ,
      y: 19
      d: [[22, 31, 37, "101][65"], [22, 48, "4"]]
      x: 44
      t: 1330337648.9898
    ,
      y: 19
      d: [["cp", 1, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 0, 1, "?>"], [22, 31, 37, "000][00"], [22, 47, 52, "01][65"]]
      x: 1
      f: [["cp", 21, 20], ["cp", 0, 21]]
      B: [["cp", 20, 19], ["cp", 0, 21]]
      t: 1330337649.12161
    ,
      y: 19
      x: 1
      t: 1330337649.1228
    ,
      y: 19
      d: [["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 19, 21], [22, 32, 37, "36][24"], [22, 52, "7"]]
      x: 1
      f: [["cp", 20, 19], ["cp", 0, 20], ["cp", 19, 21]]
      B: [["cp", 19, 18], ["cp", 0, 20], ["cp", 18, 21]]
      t: 1330337649.59348
    ,
      y: 19
      x: 1
      t: 1330337649.59466
    ,
      y: 19
      d: [[18, 0, 79, "$f = new flop();                                                                "], [19, 0, 15, "$a = new flap();"], [20, 0, 10, "$a->f = $f;"], ["cp", 1, 21], [22, 31, 37, "102][66"], [22, 48, "2"]]
      x: 2
      f: [[18, 13, 14, ["a", "6"]], [19, 0, 15, "7777777777777667"], [20, 0, 3, "7766"], ["cp", 1, 21]]
      B: [[18, 0, 79, "00000111000001100000000000000000000000000000000000000000000000000000000000000000"], [19, 0, 15, "0000011100000110"], [20, 0, 3, "0011"], ["cp", 1, 21]]
      t: 1330337650.00515
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 0, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 0, 10], ["cp", 12, 11], ["cp", 5, 12], ["cp", 14, 13], ["cp", 8, 14], ["cp", 9, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 0, 20], [21, 0, 28, "for( $i = 0; $i < 10; $i++ ){"], [22, 31, 37, "097][61"], [22, 42, 43, "20"], [22, 51, 52, "71"]]
      x: 2
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 0, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 0, 10], ["cp", 1, 11], ["cp", 5, 12], ["cp", 6, 13], ["cp", 8, 14], ["cp", 9, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 0, 20], [21, 3, "6"], [21, 27, 28, ["a", "6"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 0, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 0, 10], ["cp", 1, 11], ["cp", 5, 12], ["cp", 6, 13], ["cp", 8, 14], ["cp", 9, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 0, 20], [21, 3, "1"], [21, 10, "1"], [21, 18, 19, ["a", "1"]], [21, 27, 28, ["a", "1"]]]
      t: 1330337650.6498
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 1, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 1, 9], ["cp", 11, 10], ["cp", 4, 11], ["cp", 13, 12], ["cp", 7, 13], ["cp", 8, 14], ["cp", 1, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 1, 19], ["cp", 21, 20], [21, 0, 28, "  $f->foo();                 "], [22, 43, "1"], [22, 52, "5"]]
      x: 2
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 1, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 1, 9], ["cp", 0, 10], ["cp", 4, 11], ["cp", 5, 12], ["cp", 7, 13], ["cp", 8, 14], ["cp", 1, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 1, 19], ["cp", 21, 20], [21, 3, 10, "76677766"], [21, 27, 28, ["a", "7"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 1, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 1, 9], ["cp", 0, 10], ["cp", 4, 11], ["cp", 5, 12], ["cp", 7, 13], ["cp", 8, 14], ["cp", 1, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 1, 19], ["cp", 21, 20], [21, 3, 9, "0110001"], [21, 18, 19, ["a", "0"]], [21, 27, 28, ["a", "0"]]]
      t: 1330337650.80152
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 3, 10], ["cp", 12, 11], ["cp", 6, 12], ["cp", 7, 13], ["cp", 0, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 3, "a"], [22, 32, 37, "00][00"], [22, 43, "2"], [22, 48, 52, "1][78"]]
      x: 1
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 3, 10], ["cp", 4, 11], ["cp", 6, 12], ["cp", 7, 13], ["cp", 0, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 3, 10], ["cp", 4, 11], ["cp", 6, 12], ["cp", 7, 13], ["cp", 0, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20]]
      t: 1330337650.95726
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 9, 8], ["cp", 2, 9], ["cp", 11, 10], ["cp", 5, 11], ["cp", 6, 12], ["cp", 1, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 1, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 6, 21], [22, 31, 37, "111][6F"], [22, 43, "3"], [22, 48, 52, "2][82"]]
      x: 2
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 9, 8], ["cp", 2, 9], ["cp", 3, 10], ["cp", 5, 11], ["cp", 6, 12], ["cp", 1, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 1, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 6, 21]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 9, 8], ["cp", 2, 9], ["cp", 3, 10], ["cp", 5, 11], ["cp", 6, 12], ["cp", 1, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 1, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 6, 21]]
      t: 1330337651.12113
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 8, 7], ["cp", 1, 8], ["cp", 10, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 0, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 5, 20], ["cp", 0, 21], [22, 31, 37, "032][20"], [22, 43, "4"], [22, 52, "5"]]
      x: 2
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 8, 7], ["cp", 1, 8], ["cp", 2, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 0, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 5, 20], ["cp", 0, 21]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 8, 7], ["cp", 1, 8], ["cp", 2, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 0, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 5, 20], ["cp", 0, 21]]
      t: 1330337651.29714
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 0, 7], ["cp", 9, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 5, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 4, 19], ["cp", 5, 20], [21, 0, 1, "?>"], [22, 43, "5"], [22, 52, "9"]]
      x: 2
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 0, 7], ["cp", 1, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 5, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 4, 19], ["cp", 5, 20], [21, 0, 1, ["a", "6"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 0, 7], ["cp", 1, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 5, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 5, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 4, 19], ["cp", 5, 20], [21, 0, 1, ["a", "1"]]]
      t: 1330337651.48108
    ,
      y: 20
      b: [[16, 28, "6"], [19, 0, "6"]]
      d: [[22, 31, 37, "125][7D"], [22, 43, "6"], [22, 48, 52, "1][92"]]
      x: 1
      t: 1330337651.64714
    ,
      y: 21
      b: [["cp", 0, 16], ["cp", 0, 19]]
      d: [[22, 31, 37, "000][00"], [22, 43, "7"], [22, 52, "6"]]
      x: 1
      t: 1330337651.90605
    ,
      y: 24
      d: [[23, 0, ":"]]
      x: 2
      t: 1330337652.90113
    ,
      y: 24
      x: 2
      t: 1330337652.9013
    ,
      y: 24
      d: [[23, 1, "w"]]
      x: 2
      t: 1330337653.02195
    ,
      y: 24
      d: [[23, 2, "q"]]
      x: 4
      t: 1330337653.10591
    ,
      y: 24
      x: 1
      t: 1330337653.23005
    ,
      y: 24
      b: [["cp", 22, 21], ["cp", 0, 22]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 4, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 3, 18], ["cp", 4, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 67, "\"test.php\" 28L, 265C written                                        "], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 0, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 4, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 3, 18], ["cp", 4, 19], ["cp", 21, 20], ["cp", 4, 21]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 0, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 4, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 4, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 3, 18], ["cp", 4, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 4, 22]]
      t: 1330337653.24357
    ,
      y: 24
      d: [[23, 22, "n"]]
      x: 24
      t: 1330337653.69853
    ,
      y: 24
      d: [[23, 23, "o"]]
      x: 25
      t: 1330337653.75484
    ,
      y: 24
      d: [[23, 24, "t"]]
      x: 26
      t: 1330337653.83515
    ,
      y: 24
      x: 27
      t: 1330337654.00734
    ,
      y: 24
      d: [[23, 26, "v"]]
      x: 28
      t: 1330337654.40347
    ,
      y: 24
      d: [[23, 27, 29, "ery"]]
      x: 31
      t: 1330337654.43175
    ,
      y: 24
      x: 32
      t: 1330337654.49149
    ,
      y: 24
      d: [[23, 31, "e"]]
      x: 33
      t: 1330337654.9761
    ,
      y: 24
      d: [[23, 32, "x"]]
      x: 34
      t: 1330337655.17599
    ,
      y: 24
      d: [[23, 33, "c"]]
      x: 35
      t: 1330337655.43251
    ,
      y: 24
      d: [[23, 34, "i"]]
      x: 36
      t: 1330337655.58467
    ,
      y: 24
      d: [[23, 35, "t"]]
      x: 37
      t: 1330337655.93325
    ,
      y: 24
      d: [[23, 36, 38, "ing"]]
      x: 40
      t: 1330337655.96207
    ,
      y: 24
      d: [[23, 39, "."]]
      x: 41
      t: 1330337656.09786
    ,
      y: 24
      d: [[23, 40, "."]]
      x: 42
      t: 1330337656.24213
    ,
      y: 24
      d: [[23, 41, 42, "^C"]]
      x: 44
      t: 1330337657.23021
    ,
      y: 24
      b: [["cp", 21, 20], ["cp", 0, 21]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 3, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 2, 17], ["cp", 3, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 42, ["a", " "]]]
      x: 23
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 3, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 2, 17], ["cp", 3, 18], ["cp", 20, 19], ["cp", 3, 20]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 3, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 3, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 2, 17], ["cp", 3, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 3, 21]]
      t: 1330337657.23077
    ,
      y: 24
      d: [[23, 22, "p"]]
      x: 24
      t: 1330337657.68275
    ,
      y: 24
      d: [[23, 23, "h"]]
      x: 25
      t: 1330337657.79057
    ,
      y: 24
      d: [[23, 24, "p"]]
      x: 26
      t: 1330337657.88256
    ,
      y: 24
      x: 27
      t: 1330337657.93457
    ,
      y: 24
      d: [[23, 26, "t"]]
      x: 28
      t: 1330337658.15071
    ,
      y: 24
      d: [[23, 27, "e"]]
      x: 29
      t: 1330337658.22267
    ,
      y: 24
      d: [[23, 28, 33, "st.php"]]
      x: 36
      t: 1330337658.43492
    ,
      y: 24
      b: [["cp", 20, 19], ["cp", 0, 20]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 2, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 1, 16], ["cp", 2, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], ["cp", 2, 23]]
      x: 1
      f: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 2, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 1, 16], ["cp", 2, 17], ["cp", 19, 18], ["cp", 2, 19]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 2, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 2, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 1, 16], ["cp", 2, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 2, 20]]
      t: 1330337658.84683
    ,
      y: 24
      b: [["cp", 0, 19]]
      d: [[0, 0, 3, "flip"], [1, 0, 3, "flop"], ["cp", 1, 2], ["cp", 0, 3], ["cp", 1, 4], ["cp", 1, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 1, 8], ["cp", 0, 9], ["cp", 1, 10], ["cp", 1, 11], ["cp", 0, 12], ["cp", 1, 13], ["cp", 1, 14], ["cp", 0, 15], ["cp", 1, 16], ["cp", 1, 17], ["cp", 0, 18], ["cp", 1, 19], ["cp", 1, 20], ["cp", 0, 21], ["cp", 1, 22], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      f: [["cp", 2, 0], ["cp", 0, 1], ["cp", 0, 3], ["cp", 0, 4], ["cp", 0, 5], ["cp", 0, 6], ["cp", 0, 7], ["cp", 0, 9], ["cp", 0, 10], ["cp", 0, 11], ["cp", 0, 13], ["cp", 0, 14], ["cp", 0, 15], ["cp", 0, 16], ["cp", 0, 18]]
      B: [["cp", 2, 0], ["cp", 0, 1], ["cp", 0, 3], ["cp", 0, 4], ["cp", 0, 5], ["cp", 0, 6], ["cp", 0, 7], ["cp", 0, 9], ["cp", 0, 10], ["cp", 0, 11], ["cp", 0, 13], ["cp", 0, 14], ["cp", 0, 15], ["cp", 0, 16], ["cp", 0, 18], ["cp", 0, 19]]
      t: 1330337658.89286
    ,
      y: 24
      d: [[23, 22, "a"]]
      x: 24
      t: 1330337660.07099
    ,
      y: 24
      d: [[23, 23, "n"]]
      x: 25
      t: 1330337660.23105
    ,
      d: [["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ and                                                       "]]
      x: 26
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337660.327
      i: 1
    ,
      y: 24
      x: 27
      t: 1330337660.49922
    ,
      y: 24
      d: [[23, 26, "i"]]
      x: 28
      t: 1330337660.5433
    ,
      y: 24
      d: [[23, 27, "t"]]
      x: 29
      t: 1330337660.62763
    ,
      y: 24
      x: 30
      t: 1330337660.72362
    ,
      y: 24
      d: [[23, 29, "w"]]
      x: 31
      t: 1330337660.87179
    ,
      y: 24
      d: [[23, 30, "o"]]
      x: 32
      t: 1330337660.93601
    ,
      y: 24
      d: [[23, 31, "r"]]
      x: 33
      t: 1330337661.29185
    ,
      y: 24
      d: [[23, 32, 33, "ks"]]
      x: 35
      t: 1330337661.29216
    ,
      y: 24
      d: [[23, 34, "."]]
      x: 36
      t: 1330337661.36544
    ,
      y: 24
      d: [[23, 35, "."]]
      x: 37
      t: 1330337661.50527
    ,
      y: 24
      d: [[23, 36, 37, "^C"]]
      x: 39
      t: 1330337661.95115
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 2, 11], ["cp", 0, 12], ["cp", 2, 14], ["cp", 0, 15], ["cp", 2, 17], ["cp", 0, 18], ["cp", 2, 20], ["cp", 0, 21], ["cp", 23, 22], [23, 22, 37, ["a", " "]]]
      x: 23
      t: 1330337661.95172
    ,
      y: 24
      d: [[23, 22, "o"]]
      x: 24
      t: 1330337662.37922
    ,
      y: 24
      d: [[23, 23, "k"]]
      x: 25
      t: 1330337662.42731
    ,
      y: 24
      d: [[23, 24, "."]]
      x: 26
      t: 1330337662.66336
    ,
      y: 24
      d: [[23, 25, "."]]
      x: 27
      t: 1330337662.81578
    ,
      y: 24
      d: [[23, 26, "s"]]
      x: 28
      t: 1330337663.28007
    ,
      y: 24
      d: [[23, 27, "u"]]
      x: 29
      t: 1330337663.42796
    ,
      y: 24
      d: [[23, 28, "p"]]
      x: 30
      t: 1330337663.60391
    ,
      y: 24
      d: [[23, 29, "p"]]
      x: 31
      t: 1330337663.72798
    ,
      y: 24
      d: [[23, 30, "o"]]
      x: 32
      t: 1330337663.77608
    ,
      y: 24
      d: [[23, 31, "s"]]
      x: 33
      t: 1330337663.86376
    ,
      y: 24
      d: [[23, 32, "e"]]
      x: 34
      t: 1330337664.16001
    ,
      y: 24
      x: 35
      t: 1330337664.1602
    ,
      y: 24
      d: [[23, 34, "w"]]
      x: 36
      t: 1330337664.32799
    ,
      y: 24
      d: [[23, 35, "e"]]
      x: 37
      t: 1330337664.43593
    ,
      y: 24
      x: 38
      t: 1330337664.56802
    ,
      y: 24
      d: [[23, 37, "w"]]
      x: 39
      t: 1330337664.87203
    ,
      y: 24
      d: [[23, 38, "a"]]
      x: 40
      t: 1330337665.25296
    ,
      y: 24
      d: [[23, 39, 40, "nt"]]
      x: 43
      t: 1330337665.28475
    ,
      y: 24
      d: [[23, 42, "s"]]
      x: 44
      t: 1330337665.49299
    ,
      y: 24
      d: [[23, 43, "o"]]
      x: 45
      t: 1330337665.55278
    ,
      y: 24
      d: [[23, 44, "m"]]
      x: 46
      t: 1330337665.58477
    ,
      y: 24
      d: [[23, 45, "e"]]
      x: 47
      t: 1330337665.70095
    ,
      y: 24
      x: 48
      t: 1330337665.81682
    ,
      y: 24
      d: [[23, 47, "s"]]
      x: 49
      t: 1330337666.95108
    ,
      y: 24
      d: [[23, 48, "t"]]
      x: 50
      t: 1330337667.05899
    ,
      y: 24
      d: [[23, 49, "a"]]
      x: 51
      t: 1330337667.15105
    ,
      y: 24
      d: [[23, 50, "t"]]
      x: 52
      t: 1330337667.28292
    ,
      y: 24
      d: [[23, 51, "s"]]
      x: 53
      t: 1330337667.71531
    ,
      y: 24
      d: [[23, 52, "!"]]
      x: 54
      t: 1330337667.87917
    ,
      y: 24
      d: [[23, 53, 54, "^C"]]
      x: 56
      t: 1330337668.43923
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 1, 13], ["cp", 0, 14], ["cp", 1, 16], ["cp", 0, 17], ["cp", 1, 19], ["cp", 0, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 54, ["a", " "]]]
      x: 23
      t: 1330337668.43977
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337669.0036
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337669.2033
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337669.36749
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337669.52345
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337669.60351
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337669.69523
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 0, 9], ["cp", 1, 10], ["cp", 0, 12], ["cp", 1, 13], ["cp", 0, 15], ["cp", 1, 16], ["cp", 0, 18], ["cp", 1, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337670.17973
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 2, 11], ["cp", 0, 12], ["cp", 2, 14], ["cp", 0, 15], ["cp", 2, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 27, "Usage:                      "]]
      x: 1
      t: 1330337670.19203
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 1, 13], ["cp", 0, 14], ["cp", 1, 16], ["cp", 0, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 15, "    xdebug start"]]
      x: 1
      t: 1330337670.26431
    ,
      y: 24
      d: [["cp", 0, 1], ["cp", 4, 2], ["cp", 0, 4], ["cp", 2, 5], ["cp", 0, 7], ["cp", 2, 8], ["cp", 0, 10], ["cp", 2, 11], ["cp", 0, 13], ["cp", 2, 14], ["cp", 18, 16], ["cp", 19, 17], ["cp", 20, 18], ["cp", 21, 19], ["cp", 22, 20], [21, 0, 17, "    xdebug profile"], [22, 11, 15, "trace"]]
      x: 1
      t: 1330337670.29865
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 0, 19, "    xdebug summarize"], ["cp", 23, 20], [21, 0, 50, "type 'xdebug --manual' to see the manual + examples"], ["cp", 20, 22], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337670.33631
    ,
      y: 24
      d: [[23, 22, "t"]]
      x: 24
      t: 1330337671.13609
    ,
      y: 24
      d: [[23, 23, "h"]]
      x: 25
      t: 1330337671.2526
    ,
      y: 24
      d: [[23, 24, "i"]]
      x: 26
      t: 1330337671.30042
    ,
      y: 24
      d: [[23, 25, "s"]]
      x: 27
      t: 1330337671.38845
    ,
      y: 24
      x: 28
      t: 1330337671.48044
    ,
      y: 24
      d: [[23, 27, "i"]]
      x: 29
      t: 1330337671.62044
    ,
      y: 24
      d: [[23, 28, "s"]]
      x: 30
      t: 1330337671.72442
    ,
      y: 24
      x: 31
      t: 1330337671.84073
    ,
      y: 24
      d: [[23, 30, "t"]]
      x: 32
      t: 1330337671.95274
    ,
      y: 24
      d: [[23, 31, "h"]]
      x: 33
      t: 1330337672.03265
    ,
      y: 24
      d: [[23, 32, "e"]]
      x: 34
      t: 1330337672.1647
    ,
      y: 24
      x: 35
      t: 1330337672.21268
    ,
      y: 24
      d: [[23, 34, "c"]]
      x: 36
      t: 1330337672.34203
    ,
      y: 24
      d: [[23, 35, "o"]]
      x: 37
      t: 1330337672.44897
    ,
      y: 24
      d: [[23, 36, "m"]]
      x: 38
      t: 1330337672.57344
    ,
      y: 24
      d: [[23, 37, "m"]]
      x: 39
      t: 1330337672.705
    ,
      y: 24
      d: [[23, 38, "a"]]
      x: 40
      t: 1330337672.86892
    ,
      y: 24
      d: [[23, 39, "n"]]
      x: 41
      t: 1330337672.93297
    ,
      y: 24
      d: [[23, 40, "d"]]
      x: 42
      t: 1330337673.07688
    ,
      y: 24
      d: [[23, 41, "."]]
      x: 43
      t: 1330337673.18491
    ,
      y: 24
      d: [[23, 42, "."]]
      x: 44
      t: 1330337673.34218
    ,
      y: 24
      d: [[23, 43, 44, "^C"]]
      x: 46
      t: 1330337674.92261
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 0, 9], ["cp", 1, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 19, 21], ["cp", 23, 22], [23, 22, 44, ["a", " "]]]
      x: 23
      t: 1330337674.92316
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337675.63592
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337675.92778
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337676.15676
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337676.30141
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337676.36517
    ,
      y: 24
      d: [["cp", 13, 23]]
      x: 29
      t: 1330337676.42517
    ,
      y: 24
      x: 30
      t: 1330337676.54506
    ,
      y: 24
      d: [[23, 29, "s"]]
      x: 31
      t: 1330337676.64903
    ,
      y: 24
      d: [[23, 30, "t"]]
      x: 32
      t: 1330337676.78905
    ,
      y: 24
      d: [[23, 31, "a"]]
      x: 33
      t: 1330337676.88519
    ,
      y: 24
      d: [[23, 32, "r"]]
      x: 34
      t: 1330337676.97319
    ,
      y: 24
      d: [[23, 33, "t"]]
      x: 35
      t: 1330337677.05783
    ,
      y: 24
      x: 36
      t: 1330337678.06248
    ,
      y: 24
      d: [[23, 35, "i"]]
      x: 37
      t: 1330337679.33178
    ,
      y: 24
      d: [[23, 36, "s"]]
      x: 38
      t: 1330337679.44763
    ,
      y: 24
      x: 39
      t: 1330337679.52761
    ,
      y: 24
      d: [[23, 38, "t"]]
      x: 40
      t: 1330337679.69958
    ,
      y: 24
      d: [[23, 39, "o"]]
      x: 41
      t: 1330337679.76346
    ,
      y: 24
      x: 42
      t: 1330337679.84362
    ,
      y: 24
      d: [[23, 41, "t"]]
      x: 43
      t: 1330337680.19653
    ,
      y: 24
      d: [[23, 42, "r"]]
      x: 44
      t: 1330337680.26856
    ,
      y: 24
      d: [[23, 43, "i"]]
      x: 45
      t: 1330337680.3566
    ,
      d: [["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ and it works..^C                                          "], ["r", "leon@dev:/tmp/xdebug$ ok..suppose we want some stats!^C                         "], ["r", "leon@dev:/tmp/xdebug$ xdebug                                                    "], ["r", "Usage:                                                                          "], ["r", "    xdebug start                                                                "], ["r", "    xdebug profile                                                              "], ["r", "    xdebug trace                                                                "], ["r", "    xdebug summarize                                                            "], ["a", " "], ["r", "type 'xdebug --manual' to see the manual + examples                             "], ["a", " "], ["r", "leon@dev:/tmp/xdebug$ this is the command..^C                                   "], ["r", "leon@dev:/tmp/xdebug$ xdebug start is to trig                                   "]]
      x: 46
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337680.4645
      i: 1
    ,
      y: 24
      d: [[23, 45, "g"]]
      x: 47
      t: 1330337680.62468
    ,
      y: 24
      d: [[23, 46, "e"]]
      x: 48
      t: 1330337680.67257
    ,
      y: 24
      d: [[23, 47, "r"]]
      x: 49
      t: 1330337680.74855
    ,
      y: 24
      x: 50
      t: 1330337680.85667
    ,
      y: 24
      d: [[23, 49, "a"]]
      x: 51
      t: 1330337681.23272
    ,
      y: 24
      x: 52
      t: 1330337681.23292
    ,
      y: 24
      d: [[23, 51, "d"]]
      x: 53
      t: 1330337681.35255
    ,
      y: 24
      d: [[23, 52, "e"]]
      x: 54
      t: 1330337681.55302
    ,
      y: 24
      d: [[23, 53, "b"]]
      x: 55
      t: 1330337681.65715
    ,
      y: 24
      d: [[23, 54, "u"]]
      x: 56
      t: 1330337681.71692
    ,
      y: 24
      d: [[23, 55, "g"]]
      x: 57
      t: 1330337681.833
    ,
      y: 24
      d: [[23, 56, "g"]]
      x: 58
      t: 1330337681.94081
    ,
      y: 24
      d: [[23, 57, "i"]]
      x: 59
      t: 1330337682.04132
    ,
      y: 24
      d: [[23, 58, "n"]]
      x: 60
      t: 1330337682.11339
    ,
      y: 24
      d: [[23, 59, "g"]]
      x: 61
      t: 1330337682.1906
    ,
      y: 24
      x: 62
      t: 1330337682.39976
    ,
      y: 24
      d: [[23, 61, "s"]]
      x: 63
      t: 1330337682.70356
    ,
      y: 24
      d: [[23, 62, "e"]]
      x: 64
      t: 1330337682.86407
    ,
      y: 24
      d: [[23, 63, "s"]]
      x: 65
      t: 1330337682.98388
    ,
      y: 24
      d: [[23, 64, "s"]]
      x: 66
      t: 1330337683.17588
    ,
      y: 24
      d: [[23, 65, "i"]]
      x: 67
      t: 1330337683.19169
    ,
      y: 24
      d: [[23, 66, "o"]]
      x: 68
      t: 1330337683.28003
    ,
      y: 24
      d: [[23, 67, "n"]]
      x: 69
      t: 1330337683.38786
    ,
      y: 24
      x: 70
      t: 1330337683.43988
    ,
      y: 24
      d: [[23, 69, "i"]]
      x: 71
      t: 1330337684.58291
    ,
      y: 24
      d: [[23, 70, "n"]]
      x: 72
      t: 1330337684.64101
    ,
      y: 24
      x: 73
      t: 1330337684.72325
    ,
      y: 24
      d: [[23, 72, "v"]]
      x: 74
      t: 1330337686.07869
    ,
      y: 24
      d: [[23, 73, "i"]]
      x: 75
      t: 1330337686.14268
    ,
      y: 24
      d: [[23, 74, "m"]]
      x: 76
      t: 1330337686.18658
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 18, 20], ["cp", 22, 21], [22, 22, 76, "xdebug start is to trigger a debugging session in vim^C"], [23, 22, 74, ["a", " "]]]
      x: 23
      t: 1330337686.90741
    ,
      y: 24
      d: [[23, 22, "o"]]
      x: 24
      t: 1330337687.29519
    ,
      y: 24
      d: [[23, 23, "r"]]
      x: 25
      t: 1330337687.36405
    ,
      y: 24
      x: 26
      t: 1330337687.47207
    ,
      y: 24
      d: [[23, 25, "a"]]
      x: 27
      t: 1330337687.8765
    ,
      y: 24
      d: [[23, 26, "n"]]
      x: 28
      t: 1330337687.96409
    ,
      y: 24
      d: [[23, 27, "o"]]
      x: 29
      t: 1330337688.0718
    ,
      y: 24
      d: [[23, 28, "t"]]
      x: 30
      t: 1330337688.13624
    ,
      y: 24
      d: [[23, 29, "h"]]
      x: 31
      t: 1330337688.24794
    ,
      y: 24
      d: [[23, 30, "e"]]
      x: 32
      t: 1330337688.34822
    ,
      y: 24
      d: [[23, 31, "r"]]
      x: 33
      t: 1330337688.39588
    ,
      y: 24
      x: 34
      t: 1330337688.48789
    ,
      y: 24
      d: [[23, 33, "I"]]
      x: 35
      t: 1330337689.3132
    ,
      y: 24
      d: [[23, 34, "D"]]
      x: 36
      t: 1330337689.35708
    ,
      y: 24
      d: [[23, 35, "E"]]
      x: 37
      t: 1330337689.55296
    ,
      y: 24
      x: 38
      t: 1330337689.74496
    ,
      y: 24
      d: [[23, 37, "l"]]
      x: 39
      t: 1330337689.89696
    ,
      y: 24
      d: [[23, 38, "i"]]
      x: 40
      t: 1330337689.95294
    ,
      y: 24
      d: [[23, 39, "k"]]
      x: 41
      t: 1330337690.12542
    ,
      y: 24
      d: [[23, 40, "e"]]
      x: 42
      t: 1330337690.19746
    ,
      y: 24
      x: 43
      t: 1330337690.29323
    ,
      y: 24
      d: [[23, 42, "Z"]]
      x: 44
      t: 1330337690.66573
    ,
      y: 24
      d: [[23, 43, "e"]]
      x: 45
      t: 1330337690.91116
    ,
      y: 24
      d: [[23, 44, 45, "nd"]]
      x: 47
      t: 1330337691.2733
    ,
      y: 24
      d: [[23, 46, "/"]]
      x: 48
      t: 1330337691.31726
    ,
      y: 24
      d: [[23, 47, "E"]]
      x: 49
      t: 1330337691.84772
    ,
      y: 24
      d: [[23, 48, "c"]]
      x: 50
      t: 1330337692.03587
    ,
      y: 24
      d: [[23, 49, "l"]]
      x: 51
      t: 1330337692.13179
    ,
      y: 24
      d: [[23, 50, "i"]]
      x: 52
      t: 1330337692.28797
    ,
      y: 24
      d: [[23, 51, "p"]]
      x: 53
      t: 1330337692.35173
    ,
      y: 24
      d: [[23, 52, "s"]]
      x: 54
      t: 1330337692.42378
    ,
      y: 24
      d: [[23, 53, "e"]]
      x: 55
      t: 1330337692.55176
    ,
      y: 24
      x: 56
      t: 1330337692.6517
    ,
      y: 24
      d: [[23, 55, "e"]]
      x: 57
      t: 1330337692.88381
    ,
      y: 24
      d: [[23, 56, "t"]]
      x: 58
      t: 1330337693.02786
    ,
      y: 24
      d: [[23, 57, "c"]]
      x: 59
      t: 1330337693.25619
    ,
      y: 24
      d: [[23, 58, "."]]
      x: 60
      t: 1330337693.40424
    ,
      y: 24
      d: [[23, 59, "."]]
      x: 61
      t: 1330337693.54861
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 17, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 76, "or another IDE like Zend/Eclipse etc..^C               "], [23, 22, 59, ["a", " "]]]
      x: 23
      t: 1330337693.97274
    ,
      y: 24
      d: [[23, 22, "p"]]
      x: 24
      t: 1330337695.37399
    ,
      y: 24
      d: [[23, 23, "r"]]
      x: 25
      t: 1330337695.44191
    ,
      y: 24
      d: [[23, 24, "o"]]
      x: 26
      t: 1330337695.55486
    ,
      y: 24
      d: [[23, 25, "f"]]
      x: 27
      t: 1330337695.64679
    ,
      y: 24
      d: [[23, 26, "i"]]
      x: 28
      t: 1330337695.72665
    ,
      y: 24
      d: [[23, 27, "l"]]
      x: 29
      t: 1330337695.89874
    ,
      y: 24
      d: [[23, 28, "e"]]
      x: 30
      t: 1330337695.90296
    ,
      y: 24
      x: 31
      t: 1330337695.96428
    ,
      y: 24
      d: [[23, 30, "a"]]
      x: 32
      t: 1330337696.0926
    ,
      y: 24
      d: [[23, 31, "n"]]
      x: 33
      t: 1330337696.1647
    ,
      y: 24
      d: [[23, 32, "d"]]
      x: 34
      t: 1330337696.26882
    ,
      y: 24
      x: 35
      t: 1330337696.36878
    ,
      y: 24
      d: [[23, 34, "t"]]
      x: 36
      t: 1330337696.56486
    ,
      y: 24
      d: [[23, 35, "r"]]
      x: 37
      t: 1330337696.62884
    ,
      y: 24
      d: [[23, 36, "a"]]
      x: 38
      t: 1330337696.84276
    ,
      y: 24
      d: [[23, 37, "c"]]
      x: 39
      t: 1330337696.95858
    ,
      y: 24
      d: [[23, 38, "e"]]
      x: 40
      t: 1330337697.09999
    ,
      y: 24
      x: 41
      t: 1330337697.22811
    ,
      y: 24
      d: [[23, 40, "a"]]
      x: 42
      t: 1330337697.58126
    ,
      y: 24
      d: [[23, 41, "r"]]
      x: 43
      t: 1330337697.71733
    ,
      y: 24
      d: [[23, 42, "e"]]
      x: 44
      t: 1330337697.77715
    ,
      y: 24
      x: 45
      t: 1330337697.84518
    ,
      y: 24
      d: [[23, 44, "m"]]
      x: 46
      t: 1330337697.96091
    ,
      y: 24
      d: [[23, 45, "o"]]
      x: 47
      t: 1330337698.00099
    ,
      y: 24
      d: [[23, 46, "r"]]
      x: 48
      t: 1330337698.12924
    ,
      y: 24
      d: [[23, 47, "e"]]
      x: 49
      t: 1330337698.13288
    ,
      y: 24
      x: 50
      t: 1330337698.23312
    ,
      y: 24
      d: [[23, 49, "i"]]
      x: 51
      t: 1330337700.70516
    ,
      y: 24
      d: [[23, 50, "n"]]
      x: 52
      t: 1330337700.8054
    ,
      y: 24
      d: [[23, 51, "f"]]
      x: 53
      t: 1330337700.82544
    ,
      d: [["r", "flop                                                                            "], ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ and it works..^C                                          "], ["r", "leon@dev:/tmp/xdebug$ ok..suppose we want some stats!^C                         "], ["r", "leon@dev:/tmp/xdebug$ xdebug                                                    "], ["r", "Usage:                                                                          "], ["r", "    xdebug start                                                                "], ["r", "    xdebug profile                                                              "], ["r", "    xdebug trace                                                                "], ["r", "    xdebug summarize                                                            "], ["a", " "], ["r", "type 'xdebug --manual' to see the manual + examples                             "], ["a", " "], ["r", "leon@dev:/tmp/xdebug$ this is the command..^C                                   "], ["r", "leon@dev:/tmp/xdebug$ xdebug start is to trigger a debugging session in vim^C   "], ["r", "leon@dev:/tmp/xdebug$ or another IDE like Zend/Eclipse etc..^C                  "], ["r", "leon@dev:/tmp/xdebug$ profile and trace are more info                           "]]
      x: 54
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337700.96143
      i: 1
    ,
      y: 24
      d: [[23, 53, "r"]]
      x: 55
      t: 1330337701.03351
    ,
      y: 24
      d: [[23, 54, "m"]]
      x: 56
      t: 1330337701.14277
    ,
      y: 24
      d: [[23, 55, "a"]]
      x: 57
      t: 1330337701.27756
    ,
      y: 24
      d: [[23, 56, "t"]]
      x: 58
      t: 1330337701.36577
    ,
      y: 24
      d: [[23, 57, "i"]]
      x: 59
      t: 1330337701.42946
    ,
      y: 24
      d: [[23, 58, "o"]]
      x: 60
      t: 1330337702.31793
    ,
      y: 24
      d: [[23, 59, "n"]]
      x: 62
      t: 1330337703.15551
    ,
      y: 24
      d: [[23, 61, "f"]]
      x: 63
      t: 1330337703.4716
    ,
      y: 24
      d: [[23, 62, "o"]]
      x: 64
      t: 1330337703.55205
    ,
      y: 24
      d: [[23, 63, "c"]]
      x: 65
      t: 1330337703.68018
    ,
      y: 24
      d: [[23, 64, "u"]]
      x: 66
      t: 1330337703.7766
    ,
      y: 24
      d: [[23, 65, "s"]]
      x: 67
      t: 1330337703.90018
    ,
      y: 24
      d: [[23, 66, "e"]]
      x: 68
      t: 1330337703.9763
    ,
      y: 24
      d: [[23, 67, "d"]]
      x: 69
      t: 1330337704.16483
    ,
      y: 24
      x: 70
      t: 1330337704.77324
    ,
      y: 24
      d: [[23, 69, "c"]]
      x: 71
      t: 1330337706.39549
    ,
      y: 24
      d: [[23, 70, "o"]]
      x: 72
      t: 1330337706.48737
    ,
      y: 24
      d: [[23, 71, "m"]]
      x: 73
      t: 1330337706.72322
    ,
      y: 24
      d: [[23, 72, "d"]]
      x: 74
      t: 1330337706.82088
    ,
      y: 24
      d: [[23, 73, "s"]]
      x: 75
      t: 1330337706.94453
    ,
      y: 24
      d: [[23, 73, " "]]
      x: 74
      t: 1330337707.5091
    ,
      y: 24
      d: [[23, 72, " "]]
      x: 73
      t: 1330337707.66103
    ,
      y: 24
      d: [[23, 71, " "]]
      x: 72
      t: 1330337707.83361
    ,
      y: 24
      d: [[23, 70, " "]]
      x: 71
      t: 1330337707.98152
    ,
      y: 24
      d: [[23, 70, "m"]]
      x: 72
      t: 1330337708.18549
    ,
      y: 24
      d: [[23, 71, "d"]]
      x: 73
      t: 1330337708.25382
    ,
      y: 24
      d: [[23, 72, "s"]]
      x: 74
      t: 1330337708.29334
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 16, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 74, "profile and trace are more information focused cmds^C"], [23, 22, 72, ["a", " "]]]
      x: 23
      t: 1330337708.74592
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337710.30341
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337710.47097
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337710.61913
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337710.69928
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337710.76064
    ,
      y: 24
      d: [["cp", 10, 23]]
      x: 29
      t: 1330337710.87247
    ,
      y: 24
      x: 30
      t: 1330337710.94468
    ,
      y: 24
      d: [[23, 29, "p"]]
      x: 31
      t: 1330337712.65914
    ,
      y: 24
      d: [[23, 30, "r"]]
      x: 32
      t: 1330337712.71929
    ,
      y: 24
      d: [[23, 31, "o"]]
      x: 33
      t: 1330337712.81119
    ,
      y: 24
      d: [[23, 32, "f"]]
      x: 34
      t: 1330337712.92297
    ,
      y: 24
      d: [[23, 33, "i"]]
      x: 35
      t: 1330337713.01111
    ,
      y: 24
      d: [[23, 34, "l"]]
      x: 36
      t: 1330337713.0589
    ,
      y: 24
      d: [[23, 35, "e"]]
      x: 37
      t: 1330337713.15173
    ,
      y: 24
      x: 38
      t: 1330337713.27613
    ,
      y: 24
      d: [[23, 37, "t"]]
      x: 39
      t: 1330337715.30738
    ,
      y: 24
      d: [[23, 38, "e"]]
      x: 40
      t: 1330337715.37515
    ,
      y: 24
      d: [[23, 39, 44, "st.php"]]
      x: 47
      t: 1330337715.5674
    ,
      y: 24
      d: [[23, 46, "o"]]
      x: 48
      t: 1330337717.12324
    ,
      y: 24
      d: [[23, 47, "u"]]
      x: 49
      t: 1330337717.18316
    ,
      y: 24
      d: [[23, 48, "t"]]
      x: 50
      t: 1330337717.26578
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 15, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], ["cp", 15, 23]]
      x: 1
      t: 1330337718.3346
    ,
      y: 24
      d: [["cp", 7, 4], ["cp", 8, 5], ["cp", 9, 6], ["cp", 10, 7], ["cp", 11, 8], ["cp", 12, 9], ["cp", 13, 10], ["cp", 14, 11], ["cp", 15, 12], ["cp", 16, 13], ["cp", 12, 14], ["cp", 18, 15], ["cp", 19, 16], ["cp", 20, 17], ["cp", 21, 18], ["cp", 22, 19], [20, 0, 61, "[x] starting xdebug session with options:                     "], [21, 0, 74, "[x]   idekey                    : leon                                     "], [22, 0, 48, "[x]   remote_host               : localhost      "]]
      x: 1
      t: 1330337718.38106
    ,
      y: 24
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 6, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 10, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 8, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 0, 48, "[x]   show_exception_trace      : 0              "], [20, 4, 40, "  show_local_vars           : 0      "], [21, 6, 19, "show_mem_delta"], [21, 34, 37, "1   "], [22, 6, 17, "trace_format"], [22, 34, 42, "0        "]]
      x: 1
      t: 1330337718.42534
    ,
      y: 24
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 6, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 4, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 6, 25, "trace_options       "], [20, 6, 29, "var_display_max_children"], [20, 34, 35, "10"], [21, 6, 25, "var_display_max_data"], [21, 34, 36, "512"], [22, 6, 26, "var_display_max_depth"], [22, 34, "3"]]
      x: 1
      t: 1330337718.46957
    ,
      y: 24
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 0, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 10, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 6, 20, "profiler_enable"], [19, 34, "1"], [20, 6, 29, "profiler_output_dir     "], [20, 34, 35, ". "], [21, 6, 25, "profiler_output_name"], [21, 34, 39, "out.cg"], ["cp", 0, 22]]
      x: 1
      t: 1330337718.50284
    ,
      y: 24
      d: [[0, 0, 3, "flip"], [1, 0, 50, "flop                                               "], ["cp", 1, 2], ["cp", 0, 3], ["cp", 1, 4], ["cp", 1, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 1, 8], ["cp", 0, 9], ["cp", 1, 10], ["cp", 1, 11], ["cp", 0, 12], ["cp", 1, 13], ["cp", 1, 14], ["cp", 0, 15], ["cp", 1, 16], ["cp", 1, 17], ["cp", 0, 18], ["cp", 1, 19], ["cp", 1, 20], ["cp", 0, 21], ["cp", 1, 22], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337718.54486
    ,
      y: 24
      d: [[23, 22, "l"]]
      x: 24
      t: 1330337720.45172
    ,
      y: 24
      d: [[23, 23, "s"]]
      x: 25
      t: 1330337720.51529
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 2, 11], ["cp", 0, 12], ["cp", 2, 14], ["cp", 0, 15], ["cp", 2, 17], ["cp", 0, 18], ["cp", 2, 20], ["cp", 0, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337720.61515
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 1, 13], ["cp", 0, 14], ["cp", 1, 16], ["cp", 0, 17], ["cp", 1, 19], ["cp", 0, 20], ["cp", 22, 21], [22, 0, 23, "out.cg  test.php  xdebug"], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337720.62153
    ,
      y: 24
      d: [[23, 22, "o"]]
      x: 24
      t: 1330337722.4964
    ,
      y: 24
      d: [[23, 23, "u"]]
      x: 25
      t: 1330337722.79806
    ,
      y: 24
      d: [[23, 24, 25, "t."]]
      x: 27
      t: 1330337722.7982
    ,
      y: 24
      d: [[23, 26, "c"]]
      x: 28
      t: 1330337722.89382
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337723.11413
    ,
      y: 24
      x: 30
      t: 1330337723.51533
    ,
      y: 24
      d: [[23, 29, "i"]]
      x: 31
      t: 1330337723.5391
    ,
      y: 24
      d: [[23, 30, "s"]]
      x: 32
      t: 1330337723.61542
    ,
      y: 24
      x: 33
      t: 1330337723.71138
    ,
      y: 24
      d: [[23, 32, "g"]]
      x: 34
      t: 1330337723.99217
    ,
      y: 24
      d: [[23, 33, "e"]]
      x: 35
      t: 1330337724.07959
    ,
      y: 24
      d: [[23, 34, "n"]]
      x: 36
      t: 1330337724.20793
    ,
      y: 24
      d: [[23, 35, "e"]]
      x: 37
      t: 1330337724.53588
    ,
      y: 24
      d: [[23, 36, 37, "ra"]]
      x: 39
      t: 1330337724.55955
    ,
      y: 24
      d: [[23, 38, "t"]]
      x: 40
      t: 1330337724.71986
    ,
      y: 24
      d: [[23, 39, "e"]]
      x: 41
      t: 1330337724.79172
    ,
      y: 24
      d: [[23, 40, "d"]]
      x: 42
      t: 1330337724.94817
    ,
      y: 24
      d: [[23, 41, "."]]
      x: 43
      t: 1330337725.09633
    ,
      y: 24
      d: [[23, 42, "."]]
      x: 44
      t: 1330337725.24443
    ,
      y: 24
      d: [[23, 43, "y"]]
      x: 45
      t: 1330337725.62559
    ,
      y: 24
      d: [[23, 44, "o"]]
      x: 46
      t: 1330337725.71359
    ,
      y: 24
      d: [[23, 45, "u"]]
      x: 47
      t: 1330337726.03773
    ,
      y: 24
      d: [[23, 47, 48, "ca"]]
      x: 50
      t: 1330337726.06156
    ,
      y: 24
      d: [[23, 49, "n"]]
      x: 51
      t: 1330337726.12155
    ,
      y: 24
      x: 52
      t: 1330337726.21353
    ,
      y: 24
      d: [[23, 51, "l"]]
      x: 53
      t: 1330337726.68969
    ,
      y: 24
      d: [[23, 52, "o"]]
      x: 54
      t: 1330337726.85397
    ,
      y: 24
      d: [[23, 53, "a"]]
      x: 55
      t: 1330337726.92178
    ,
      y: 24
      d: [[23, 54, "d"]]
      x: 56
      t: 1330337727.04624
    ,
      y: 24
      x: 57
      t: 1330337727.05018
    ,
      y: 24
      d: [[23, 56, "t"]]
      x: 58
      t: 1330337727.41823
    ,
      y: 24
      d: [[23, 57, "h"]]
      x: 59
      t: 1330337727.49394
    ,
      y: 24
      d: [[23, 58, "i"]]
      x: 60
      t: 1330337727.52608
    ,
      y: 24
      d: [[23, 59, "s"]]
      x: 61
      t: 1330337727.63024
    ,
      y: 24
      x: 62
      t: 1330337727.6977
    ,
      y: 24
      d: [[23, 61, "i"]]
      x: 63
      t: 1330337727.91016
    ,
      y: 24
      d: [[23, 62, "n"]]
      x: 64
      t: 1330337728.01
    ,
      y: 24
      d: [[23, 63, "t"]]
      x: 65
      t: 1330337728.17414
    ,
      y: 24
      d: [[23, 64, "o"]]
      x: 66
      t: 1330337728.28223
    ,
      y: 24
      x: 67
      t: 1330337728.35146
    ,
      d: [["r", "flop                                                                            "], ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ ls                                                        "], ["r", "out.cg  test.php  xdebug                                                        "], ["r", "leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "]]
      x: 69
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337728.73149
      i: 1
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 0, 9], ["cp", 1, 10], ["cp", 0, 12], ["cp", 1, 13], ["cp", 0, 15], ["cp", 1, 16], ["cp", 0, 18], ["cp", 1, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 67, ["a", " "]]]
      x: 23
      t: 1330337728.7318
    ,
      y: 24
      d: [[23, 22, "c"]]
      x: 24
      t: 1330337729.08343
    ,
      y: 24
      d: [[23, 23, "a"]]
      x: 25
      t: 1330337729.20733
    ,
      y: 24
      d: [[23, 24, "c"]]
      x: 26
      t: 1330337729.60349
    ,
      y: 24
      d: [[23, 25, "h"]]
      x: 27
      t: 1330337729.82372
    ,
      y: 24
      d: [[23, 26, "e"]]
      x: 28
      t: 1330337730.30352
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337730.53998
    ,
      y: 24
      d: [[23, 28, "r"]]
      x: 30
      t: 1330337730.62385
    ,
      y: 24
      d: [[23, 29, "i"]]
      x: 31
      t: 1330337730.75285
    ,
      y: 24
      d: [[23, 30, "n"]]
      x: 32
      t: 1330337730.82078
    ,
      y: 24
      d: [[23, 31, "d"]]
      x: 33
      t: 1330337730.92109
    ,
      y: 24
      d: [[23, 32, "."]]
      x: 34
      t: 1330337731.04504
    ,
      y: 24
      d: [[23, 33, "."]]
      x: 35
      t: 1330337731.19313
    ,
      y: 24
      d: [[23, 34, "o"]]
      x: 36
      t: 1330337731.35766
    ,
      y: 24
      d: [[23, 35, "r"]]
      x: 37
      t: 1330337731.46175
    ,
      y: 24
      x: 38
      t: 1330337731.57769
    ,
      y: 24
      d: [[23, 37, "g"]]
      x: 39
      t: 1330337731.87763
    ,
      y: 24
      d: [[23, 38, "e"]]
      x: 40
      t: 1330337731.95351
    ,
      y: 24
      d: [[23, 39, "n"]]
      x: 41
      t: 1330337732.0616
    ,
      y: 24
      d: [[23, 40, "e"]]
      x: 42
      t: 1330337732.14153
    ,
      y: 24
      d: [[23, 41, "r"]]
      x: 43
      t: 1330337732.42986
    ,
      y: 24
      d: [[23, 42, 43, "at"]]
      x: 45
      t: 1330337732.42995
    ,
      y: 24
      d: [[23, 44, "e"]]
      x: 46
      t: 1330337732.52177
    ,
      y: 24
      x: 47
      t: 1330337732.71792
    ,
      y: 24
      d: [[23, 46, "p"]]
      x: 48
      t: 1330337732.9179
    ,
      y: 24
      d: [[23, 47, "n"]]
      x: 49
      t: 1330337733.0938
    ,
      y: 24
      d: [[23, 47, " "]]
      x: 48
      t: 1330337733.41803
    ,
      y: 24
      d: [[23, 46, " "]]
      x: 47
      t: 1330337733.57813
    ,
      y: 24
      d: [[23, 46, "."]]
      x: 48
      t: 1330337733.79823
    ,
      y: 24
      d: [[23, 47, "p"]]
      x: 49
      t: 1330337734.01388
    ,
      y: 24
      d: [[23, 48, "n"]]
      x: 50
      t: 1330337734.10174
    ,
      y: 24
      d: [[23, 49, "g"]]
      x: 51
      t: 1330337734.21001
    ,
      y: 24
      d: [[23, 50, "s"]]
      x: 52
      t: 1330337735.19039
    ,
      y: 24
      x: 53
      t: 1330337735.30656
    ,
      y: 24
      d: [[23, 52, "w"]]
      x: 54
      t: 1330337735.51451
    ,
      y: 24
      d: [[23, 53, "i"]]
      x: 55
      t: 1330337735.61845
    ,
      y: 24
      d: [[23, 54, "t"]]
      x: 56
      t: 1330337735.7461
    ,
      y: 24
      d: [[23, 55, "h"]]
      x: 57
      t: 1330337735.82626
    ,
      y: 24
      x: 58
      t: 1330337735.91405
    ,
      y: 24
      d: [[23, 57, "x"]]
      x: 59
      t: 1330337736.52818
    ,
      y: 24
      d: [[23, 58, "d"]]
      x: 60
      t: 1330337736.69258
    ,
      y: 24
      d: [[23, 59, "e"]]
      x: 61
      t: 1330337736.84057
    ,
      y: 24
      d: [[23, 60, "b"]]
      x: 62
      t: 1330337736.95241
    ,
      y: 24
      d: [[23, 61, "u"]]
      x: 63
      t: 1330337737.10473
    ,
      y: 24
      d: [[23, 62, "g"]]
      x: 64
      t: 1330337737.10478
    ,
      y: 24
      d: [[23, 63, "t"]]
      x: 65
      t: 1330337737.60512
    ,
      y: 24
      d: [[23, 64, "o"]]
      x: 66
      t: 1330337737.71706
    ,
      y: 24
      d: [[23, 65, "o"]]
      x: 67
      t: 1330337737.86551
    ,
      y: 24
      d: [[23, 66, "l"]]
      x: 68
      t: 1330337738.03913
    ,
      y: 24
      d: [[23, 67, "k"]]
      x: 69
      t: 1330337738.26148
    ,
      y: 24
      d: [[23, 68, "i"]]
      x: 70
      t: 1330337738.49471
    ,
      y: 24
      d: [[23, 69, "t"]]
      x: 71
      t: 1330337738.71447
    ,
      y: 24
      d: [[23, 70, 71, "^C"]]
      x: 73
      t: 1330337739.30788
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 2, 11], ["cp", 0, 12], ["cp", 2, 14], ["cp", 0, 15], ["cp", 2, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 71, ["a", " "]]]
      x: 23
      t: 1330337739.30928
    ,
      y: 24
      d: [[23, 22, "o"]]
      x: 24
      t: 1330337739.96384
    ,
      y: 24
      d: [[23, 23, "r"]]
      x: 25
      t: 1330337740.11209
    ,
      y: 24
      d: [[23, 24, "."]]
      x: 26
      t: 1330337740.26141
    ,
      y: 24
      d: [[23, 25, "."]]
      x: 27
      t: 1330337740.38951
    ,
      y: 24
      d: [[23, 26, "."]]
      x: 28
      t: 1330337740.5228
    ,
      y: 24
      d: [[23, 27, "j"]]
      x: 29
      t: 1330337740.75572
    ,
      y: 24
      d: [[23, 28, "u"]]
      x: 30
      t: 1330337740.91549
    ,
      y: 24
      d: [[23, 29, "s"]]
      x: 31
      t: 1330337740.96759
    ,
      y: 24
      d: [[23, 30, "t"]]
      x: 32
      t: 1330337741.03992
    ,
      y: 24
      x: 33
      t: 1330337741.35577
    ,
      y: 24
      d: [[23, 32, "d"]]
      x: 34
      t: 1330337741.39963
    ,
      y: 24
      d: [[23, 33, "o"]]
      x: 35
      t: 1330337741.49958
    ,
      y: 24
      x: 36
      t: 1330337741.55169
    ,
      y: 24
      d: [[23, 35, "t"]]
      x: 37
      t: 1330337741.69566
    ,
      y: 24
      d: [[23, 36, "h"]]
      x: 38
      t: 1330337741.81562
    ,
      y: 24
      d: [[23, 37, "i"]]
      x: 39
      t: 1330337741.81951
    ,
      y: 24
      d: [[23, 38, "s"]]
      x: 40
      t: 1330337741.90778
    ,
      y: 24
      d: [[23, 39, ":"]]
      x: 41
      t: 1330337742.65049
    ,
      y: 24
      d: [[23, 40, 41, "^C"]]
      x: 43
      t: 1330337742.96383
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 1, 13], ["cp", 0, 14], ["cp", 1, 16], ["cp", 0, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 41, ["a", " "]]]
      x: 23
      t: 1330337742.96413
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337744.75771
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337744.86176
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337745.07407
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337745.07785
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337745.15386
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337745.19408
    ,
      y: 24
      x: 30
      t: 1330337745.28992
    ,
      y: 24
      d: [[23, 29, "s"]]
      x: 31
      t: 1330337745.50202
    ,
      y: 24
      d: [[23, 30, "u"]]
      x: 32
      t: 1330337745.50587
    ,
      y: 24
      d: [[23, 31, "m"]]
      x: 33
      t: 1330337745.67812
    ,
      y: 24
      d: [[23, 32, "m"]]
      x: 34
      t: 1330337745.82211
    ,
      y: 24
      d: [[23, 33, "a"]]
      x: 35
      t: 1330337746.14629
    ,
      y: 24
      d: [[23, 34, "r"]]
      x: 36
      t: 1330337746.32194
    ,
      y: 24
      d: [[23, 35, "i"]]
      x: 37
      t: 1330337746.47396
    ,
      y: 24
      d: [[23, 36, "z"]]
      x: 38
      t: 1330337746.60611
    ,
      y: 24
      d: [[23, 37, "e"]]
      x: 39
      t: 1330337746.88618
    ,
      y: 24
      x: 40
      t: 1330337747.468
    ,
      y: 24
      d: [[23, 39, "o"]]
      x: 41
      t: 1330337748.12386
    ,
      y: 24
      d: [[23, 40, "u"]]
      x: 42
      t: 1330337748.18765
    ,
      y: 24
      d: [[23, 41, "t"]]
      x: 43
      t: 1330337748.29973
    ,
      y: 24
      d: [[23, 42, "."]]
      x: 44
      t: 1330337748.40784
    ,
      y: 24
      d: [[23, 43, "c"]]
      x: 45
      t: 1330337748.59171
    ,
      y: 24
      d: [[23, 44, "f"]]
      x: 46
      t: 1330337748.82777
    ,
      y: 24
      d: [[23, 45, "g"]]
      x: 47
      t: 1330337749.05189
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 0, 9], ["cp", 1, 10], ["cp", 0, 12], ["cp", 1, 13], ["cp", 0, 15], ["cp", 1, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337749.90166
    ,
      d: [["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ ls                                                        "], ["r", "out.cg  test.php  xdebug                                                        "], ["r", "leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "], ["r", "leon@dev:/tmp/xdebug$ cachegrind..or generate .pngs with xdebugtoolkit^C        "], ["r", "leon@dev:/tmp/xdebug$ or...just do this:^C                                      "], ["r", "leon@dev:/tmp/xdebug$ xdebug summarize out.cfg                                  "], ["r", "cat: out.cfg: No such file or directory                                         "], ["r", "times    call                                                                   "], ["r", "========================================================                        "], ["r", "(please wait..summarizing)                                                      "], ["r", "leon@dev:/tmp/xdebug$                                                           "]]
      x: 23
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337749.93057
      i: 1
    ,
      y: 24
      d: [["cp", 18, 23]]
      x: 47
      t: 1330337752.34036
    ,
      y: 24
      d: [[23, 45, " "]]
      x: 46
      t: 1330337753.04568
    ,
      y: 24
      d: [[23, 44, " "]]
      x: 45
      t: 1330337753.20552
    ,
      y: 24
      d: [[23, 44, "g"]]
      x: 46
      t: 1330337753.71763
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337754.11764
    ,
      y: 24
      d: [["cp", 12, 9], ["cp", 13, 10], ["cp", 14, 11], ["cp", 15, 12], ["cp", 16, 13], ["cp", 17, 14], ["cp", 18, 15], ["cp", 19, 16], ["cp", 20, 17], ["cp", 21, 18], ["cp", 22, 19], ["cp", 16, 20], ["cp", 17, 21], ["cp", 18, 22]]
      x: 1
      t: 1330337754.1364
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 15, 19], ["cp", 16, 20], ["cp", 17, 21], [22, 0, 30, "40         test.php:flop->foo()"]]
      x: 1
      t: 1330337754.2064
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 8, 6], ["cp", 9, 7], ["cp", 10, 8], ["cp", 11, 9], ["cp", 12, 10], ["cp", 13, 11], ["cp", 14, 12], ["cp", 15, 13], ["cp", 16, 14], ["cp", 17, 15], ["cp", 18, 16], ["cp", 13, 17], ["cp", 14, 18], ["cp", 15, 19], ["cp", 22, 20], [21, 0, 30, "20         test.php:flap->foo()"], [22, 0, 1, "1 "], [22, 20, 30, "{main}()   "], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337754.20836
    ,
      y: 24
      d: [[23, 22, "h"]]
      x: 24
      t: 1330337755.86217
    ,
      y: 24
      d: [[23, 23, "e"]]
      x: 25
      t: 1330337755.94997
    ,
      y: 24
      d: [[23, 24, "r"]]
      x: 26
      t: 1330337756.09823
    ,
      y: 24
      d: [[23, 25, "e"]]
      x: 27
      t: 1330337756.28224
    ,
      y: 24
      x: 28
      t: 1330337757.22237
    ,
      y: 24
      d: [[23, 27, "y"]]
      x: 29
      t: 1330337757.40634
    ,
      y: 24
      d: [[23, 28, "o"]]
      x: 30
      t: 1330337757.48613
    ,
      y: 24
      d: [[23, 29, "u"]]
      x: 31
      t: 1330337757.57823
    ,
      y: 24
      x: 32
      t: 1330337757.67019
    ,
      y: 24
      d: [[23, 31, "c"]]
      x: 33
      t: 1330337757.89036
    ,
      y: 24
      d: [[23, 32, "a"]]
      x: 34
      t: 1330337757.9502
    ,
      y: 24
      d: [[23, 33, "n"]]
      x: 35
      t: 1330337758.03012
    ,
      y: 24
      x: 36
      t: 1330337758.11043
    ,
      y: 24
      d: [[23, 35, "s"]]
      x: 37
      t: 1330337758.47435
    ,
      y: 24
      d: [[23, 36, "e"]]
      x: 38
      t: 1330337758.67445
    ,
      y: 24
      d: [[23, 37, "e"]]
      x: 39
      t: 1330337758.83436
    ,
      y: 24
      x: 40
      t: 1330337759.94625
    ,
      y: 24
      d: [[23, 39, "f"]]
      x: 41
      t: 1330337760.10254
    ,
      y: 24
      d: [[23, 40, "l"]]
      x: 42
      t: 1330337760.21469
    ,
      y: 24
      d: [[23, 41, "o"]]
      x: 43
      t: 1330337760.37858
    ,
      y: 24
      d: [[23, 42, "p"]]
      x: 44
      t: 1330337760.44272
    ,
      y: 24
      x: 45
      t: 1330337760.75049
    ,
      y: 24
      x: 44
      t: 1330337760.92655
    ,
      y: 24
      d: [[23, 43, "("]]
      x: 45
      t: 1330337761.3708
    ,
      y: 24
      d: [[23, 44, ")"]]
      x: 46
      t: 1330337761.43855
    ,
      y: 24
      x: 47
      t: 1330337761.58645
    ,
      y: 24
      d: [[23, 46, "w"]]
      x: 48
      t: 1330337761.75847
    ,
      y: 24
      d: [[23, 47, "a"]]
      x: 49
      t: 1330337761.87459
    ,
      y: 24
      d: [[23, 48, "s"]]
      x: 50
      t: 1330337761.93053
    ,
      y: 24
      x: 51
      t: 1330337762.01909
    ,
      y: 24
      d: [[23, 50, "c"]]
      x: 52
      t: 1330337762.18656
    ,
      y: 24
      d: [[23, 51, "a"]]
      x: 53
      t: 1330337762.36252
    ,
      y: 24
      d: [[23, 52, "l"]]
      x: 54
      t: 1330337762.40257
    ,
      y: 24
      d: [[23, 53, 55, "led"]]
      x: 57
      t: 1330337762.78671
    ,
      y: 24
      x: 58
      t: 1330337762.88281
    ,
      y: 24
      d: [[23, 57, "4"]]
      x: 59
      t: 1330337763.15603
    ,
      y: 24
      d: [[23, 58, "0"]]
      x: 60
      t: 1330337763.29613
    ,
      y: 24
      x: 61
      t: 1330337763.46879
    ,
      y: 24
      d: [[23, 60, "t"]]
      x: 62
      t: 1330337763.74495
    ,
      y: 24
      d: [[23, 61, "i"]]
      x: 63
      t: 1330337763.75281
    ,
      y: 24
      d: [[23, 62, "m"]]
      x: 64
      t: 1330337763.91278
    ,
      y: 24
      d: [[23, 63, "e"]]
      x: 65
      t: 1330337763.98885
    ,
      y: 24
      d: [[23, 64, "s"]]
      x: 66
      t: 1330337764.15694
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 12, 16], ["cp", 13, 17], ["cp", 14, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 66, "leon@dev:/tmp/xdebug$ here you can see flop() was called 40 times^C"], [23, 22, 64, ["a", " "]]]
      x: 23
      t: 1330337764.60194
    ,
      y: 24
      d: [[23, 22, "w"]]
      x: 24
      t: 1330337764.90245
    ,
      y: 24
      d: [[23, 23, "i"]]
      x: 25
      t: 1330337765.01462
    ,
      y: 24
      d: [[23, 24, "t"]]
      x: 26
      t: 1330337765.1307
    ,
      y: 24
      d: [[23, 25, "h"]]
      x: 27
      t: 1330337765.19462
    ,
      y: 24
      x: 28
      t: 1330337765.25072
    ,
      y: 24
      d: [[23, 27, "c"]]
      x: 29
      t: 1330337765.41872
    ,
      y: 24
      d: [[23, 28, "o"]]
      x: 30
      t: 1330337765.47838
    ,
      y: 24
      d: [[23, 29, "m"]]
      x: 31
      t: 1330337765.64662
    ,
      y: 24
      d: [[23, 30, "p"]]
      x: 32
      t: 1330337765.80654
    ,
      y: 24
      d: [[23, 31, "l"]]
      x: 33
      t: 1330337765.95836
    ,
      y: 24
      d: [[23, 32, 33, "ex"]]
      x: 35
      t: 1330337766.25484
    ,
      y: 24
      x: 36
      t: 1330337766.34644
    ,
      y: 24
      d: [[23, 35, "a"]]
      x: 37
      t: 1330337767.81871
    ,
      y: 24
      d: [[23, 36, "p"]]
      x: 38
      t: 1330337767.90636
    ,
      y: 24
      d: [[23, 37, "p"]]
      x: 39
      t: 1330337768.31049
    ,
      y: 24
      d: [[23, 38, "l"]]
      x: 40
      t: 1330337768.78659
    ,
      y: 24
      d: [[23, 39, "i"]]
      x: 41
      t: 1330337768.94667
    ,
      y: 24
      d: [[23, 40, "c"]]
      x: 42
      t: 1330337769.05048
    ,
      y: 24
      d: [[23, 41, "a"]]
      x: 43
      t: 1330337769.11047
    ,
      y: 24
      d: [[23, 42, 45, "tion"]]
      x: 47
      t: 1330337769.479
    ,
      y: 24
      d: [[23, 46, "s"]]
      x: 48
      t: 1330337769.59066
    ,
      y: 24
      x: 49
      t: 1330337769.73093
    ,
      y: 24
      d: [[23, 48, "t"]]
      x: 50
      t: 1330337770.31108
    ,
      y: 24
      d: [[23, 49, "h"]]
      x: 51
      t: 1330337770.80866
    ,
      y: 24
      d: [[23, 50, "e"]]
      x: 52
      t: 1330337770.92053
    ,
      y: 24
      d: [[23, 51, "s"]]
      x: 53
      t: 1330337771.10865
    ,
      y: 24
      d: [[23, 52, "e"]]
      x: 55
      t: 1330337771.44485
    ,
      y: 24
      d: [[23, 54, "n"]]
      x: 56
      t: 1330337771.46854
    ,
      y: 24
      d: [[23, 55, "u"]]
      x: 57
      t: 1330337771.54046
    ,
      y: 24
      d: [[23, 56, "m"]]
      x: 58
      t: 1330337771.75246
    ,
      y: 24
      d: [[23, 57, "b"]]
      x: 59
      t: 1330337771.91681
    ,
      y: 24
      d: [[23, 58, "e"]]
      x: 60
      t: 1330337771.97654
    ,
      y: 24
      d: [[23, 59, "r"]]
      x: 61
      t: 1330337772.14474
    ,
      y: 24
      d: [[23, 60, "s"]]
      x: 62
      t: 1330337772.20445
    ,
      y: 24
      x: 63
      t: 1330337772.30459
    ,
      y: 24
      d: [[23, 62, "c"]]
      x: 64
      t: 1330337772.45255
    ,
      y: 24
      d: [[23, 63, "a"]]
      x: 65
      t: 1330337772.52068
    ,
      y: 24
      d: [[23, 64, "n"]]
      x: 66
      t: 1330337772.58059
    ,
      y: 24
      x: 67
      t: 1330337772.65269
    ,
      y: 24
      d: [[23, 66, "b"]]
      x: 68
      t: 1330337772.83282
    ,
      y: 24
      d: [[23, 67, "e"]]
      x: 69
      t: 1330337772.88881
    ,
      y: 24
      d: [[23, 68, "c"]]
      x: 70
      t: 1330337773.01676
    ,
      y: 24
      d: [[23, 69, "o"]]
      x: 71
      t: 1330337773.10472
    ,
      y: 24
      d: [[23, 70, "m"]]
      x: 72
      t: 1330337773.15655
    ,
      y: 24
      d: [[23, 71, "e"]]
      x: 73
      t: 1330337773.22933
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 11, 15], ["cp", 12, 16], ["cp", 13, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 73, "with complex applications these numbers can become^C"], [23, 22, 71, ["a", " "]]]
      x: 23
      t: 1330337773.58648
    ,
      y: 24
      d: [[23, 22, "q"]]
      x: 24
      t: 1330337773.87776
    ,
      d: [["r", "flop                                                                            "], "d", ["r", "flip                                                                            "], ["r", "flop                                                                            "], ["r", "leon@dev:/tmp/xdebug$ ls                                                        "], ["r", "out.cg  test.php  xdebug                                                        "], ["r", "leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "], ["r", "leon@dev:/tmp/xdebug$ cachegrind..or generate .pngs with xdebugtoolkit^C        "], ["r", "leon@dev:/tmp/xdebug$ or...just do this:^C                                      "], ["r", "leon@dev:/tmp/xdebug$ xdebug summarize out.cfg                                  "], ["r", "cat: out.cfg: No such file or directory                                         "], ["r", "times    call                                                                   "], ["r", "========================================================                        "], ["r", "(please wait..summarizing)                                                      "], ["r", "leon@dev:/tmp/xdebug$ xdebug summarize out.cg                                   "], ["r", "times    call                                                                   "], ["r", "========================================================                        "], ["r", "(please wait..summarizing)                                                      "], ["r", "40         test.php:flop->foo()                                                 "], ["r", "20         test.php:flap->foo()                                                 "], ["r", "1          test.php:{main}()                                                    "], ["r", "leon@dev:/tmp/xdebug$ here you can see flop() was called 40 times^C             "], ["r", "leon@dev:/tmp/xdebug$ with complex applications these numbers can become^C      "], ["r", "leon@dev:/tmp/xdebug$ qu                                                        "]]
      x: 25
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337773.98969
      i: 1
    ,
      y: 24
      d: [[23, 24, "i"]]
      x: 26
      t: 1330337774.04575
    ,
      y: 24
      d: [[23, 25, "t"]]
      x: 27
      t: 1330337774.15773
    ,
      y: 24
      d: [[23, 26, "e"]]
      x: 28
      t: 1330337774.22978
    ,
      y: 24
      x: 29
      t: 1330337774.43035
    ,
      y: 24
      d: [[23, 28, "i"]]
      x: 30
      t: 1330337774.74254
    ,
      y: 24
      d: [[23, 29, "m"]]
      x: 31
      t: 1330337774.86238
    ,
      y: 24
      d: [[23, 30, "p"]]
      x: 32
      t: 1330337775.00697
    ,
      y: 24
      d: [[23, 31, "o"]]
      x: 33
      t: 1330337775.05085
    ,
      y: 24
      d: [[23, 32, "r"]]
      x: 34
      t: 1330337775.11506
    ,
      y: 24
      d: [[23, 33, "t"]]
      x: 35
      t: 1330337775.25097
    ,
      y: 24
      d: [[23, 34, "a"]]
      x: 36
      t: 1330337775.78705
    ,
      y: 24
      d: [[23, 35, "n"]]
      x: 37
      t: 1330337775.93486
    ,
      y: 24
      d: [[23, 36, "t"]]
      x: 38
      t: 1330337776.03506
    ,
      y: 24
      d: [[23, 37, "."]]
      x: 39
      t: 1330337776.19629
    ,
      y: 24
      d: [[23, 38, "."]]
      x: 40
      t: 1330337776.3402
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 10, 14], ["cp", 11, 15], ["cp", 12, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 73, "quite important..^C                                 "], [23, 22, 38, ["a", " "]]]
      x: 23
      t: 1330337776.85248
    ,
      y: 24
      d: [[23, 22, "o"]]
      x: 24
      t: 1330337777.20034
    ,
      y: 24
      d: [[23, 23, "k"]]
      x: 25
      t: 1330337777.27627
    ,
      y: 24
      d: [[23, 24, "."]]
      x: 26
      t: 1330337777.64821
    ,
      y: 24
      d: [[23, 25, "."]]
      x: 27
      t: 1330337777.79627
    ,
      y: 24
      d: [[23, 26, "w"]]
      x: 28
      t: 1330337777.97625
    ,
      y: 24
      d: [[23, 27, "h"]]
      x: 29
      t: 1330337778.09625
    ,
      y: 24
      d: [[23, 28, "a"]]
      x: 30
      t: 1330337778.14849
    ,
      y: 24
      d: [[23, 29, "t"]]
      x: 31
      t: 1330337778.30039
    ,
      y: 24
      d: [[23, 30, "s"]]
      x: 32
      t: 1330337778.4816
    ,
      y: 24
      x: 33
      t: 1330337778.68998
    ,
      y: 24
      d: [[23, 32, "e"]]
      x: 34
      t: 1330337778.85013
    ,
      y: 24
      d: [[23, 33, "n"]]
      x: 35
      t: 1330337778.8696
    ,
      y: 24
      d: [[23, 34, "x"]]
      x: 36
      t: 1330337779.05763
    ,
      y: 24
      d: [[23, 34, " "]]
      x: 35
      t: 1330337779.48566
    ,
      y: 24
      d: [[23, 33, " "]]
      x: 34
      t: 1330337779.64161
    ,
      y: 24
      d: [[23, 32, " "]]
      x: 33
      t: 1330337779.78972
    ,
      y: 24
      d: [[23, 32, "n"]]
      x: 34
      t: 1330337780.03758
    ,
      y: 24
      d: [[23, 33, "e"]]
      x: 35
      t: 1330337780.09368
    ,
      y: 24
      d: [[23, 34, "x"]]
      x: 36
      t: 1330337780.29365
    ,
      y: 24
      d: [[23, 35, "t"]]
      x: 37
      t: 1330337780.49785
    ,
      y: 24
      d: [[23, 36, "."]]
      x: 38
      t: 1330337780.60155
    ,
      y: 24
      d: [[23, 37, "."]]
      x: 39
      t: 1330337780.74178
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 9, 13], ["cp", 10, 14], ["cp", 11, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 40, "ok..whats next..^C "], [23, 22, 37, ["a", " "]]]
      x: 23
      t: 1330337780.97003
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337781.48963
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337781.67753
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337781.8257
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337781.9137
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337781.9696
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337782.04546
    ,
      y: 24
      x: 30
      t: 1330337782.15365
    ,
      y: 24
      d: [[23, 29, "t"]]
      x: 31
      t: 1330337782.36569
    ,
      y: 24
      d: [[23, 30, "r"]]
      x: 32
      t: 1330337782.36965
    ,
      y: 24
      d: [[23, 31, "a"]]
      x: 33
      t: 1330337782.53771
    ,
      y: 24
      d: [[23, 32, "c"]]
      x: 34
      t: 1330337782.61766
    ,
      y: 24
      d: [[23, 33, "e"]]
      x: 35
      t: 1330337782.71786
    ,
      y: 24
      x: 36
      t: 1330337782.86198
    ,
      y: 24
      d: [[23, 35, "t"]]
      x: 37
      t: 1330337785.61857
    ,
      y: 24
      d: [[23, 36, "e"]]
      x: 38
      t: 1330337785.67429
    ,
      y: 24
      d: [[23, 37, 42, "st.php"]]
      x: 45
      t: 1330337785.871
    ,
      y: 24
      d: [[23, 44, 46, "out"]]
      x: 48
      t: 1330337787.05058
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 8, 12], ["cp", 9, 13], ["cp", 10, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337790.75689
    ,
      y: 24
      d: [["cp", 2, 0], ["cp", 3, 1], ["cp", 4, 2], ["cp", 5, 3], ["cp", 6, 4], ["cp", 7, 5], ["cp", 8, 6], ["cp", 9, 7], ["cp", 10, 8], ["cp", 11, 9], ["cp", 6, 10], ["cp", 7, 11], ["cp", 8, 12], ["cp", 15, 13], ["cp", 16, 14], ["cp", 17, 15], ["cp", 18, 16], ["cp", 19, 17], ["cp", 20, 18], ["cp", 21, 19], ["cp", 22, 20], [21, 0, 40, "[x] starting xdebug session with options:"], [22, 0, 46, "[x]   idekey                    : leon         "]]
      x: 1
      t: 1330337790.79798
    ,
      y: 24
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 6, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 0, 42, "[x]   remote_host               : localhost"], [20, 0, 46, "[x]   show_exception_trace      : 0            "], [21, 4, 40, "  show_local_vars           : 0      "], [22, 6, 19, "show_mem_delta"], [22, 34, 37, "1   "]]
      x: 1
      t: 1330337790.8432
    ,
      y: 24
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 9, 5], ["cp", 10, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 6, 17, "trace_format"], [19, 34, 42, "0        "], [20, 6, 25, "trace_options       "], [21, 6, 29, "var_display_max_children"], [21, 34, 35, "10"], [22, 6, 25, "var_display_max_data"], [22, 34, 36, "512"]]
      x: 1
      t: 1330337790.88772
    ,
      y: 24
      d: [["cp", 5, 1], ["cp", 6, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 10, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 6, 26, "var_display_max_depth"], [19, 34, "3"], [20, 13, 22, "utput_name"], [20, 34, 36, "out"], [21, 6, 29, "trace_output_dir        "], [21, 34, 35, ". "], ["cp", 23, 22]]
      x: 1
      t: 1330337790.9207
    ,
      y: 24
      d: [[0, 0, 25, "flip                      "], [1, 0, 3, "flop"], [1, 11, 30, ["a", " "]], ["cp", 1, 2], ["cp", 0, 3], ["cp", 1, 4], ["cp", 1, 5], ["cp", 0, 6], ["cp", 1, 7], ["cp", 1, 8], ["cp", 0, 9], ["cp", 1, 10], ["cp", 1, 11], ["cp", 0, 12], ["cp", 1, 13], ["cp", 1, 14], ["cp", 0, 15], ["cp", 1, 16], ["cp", 1, 17], ["cp", 0, 18], ["cp", 1, 19], ["cp", 1, 20], ["cp", 0, 21], ["cp", 1, 22], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337790.96604
    ,
      y: 24
      d: [[23, 22, "l"]]
      x: 24
      t: 1330337792.47463
    ,
      y: 24
      d: [[23, 23, "s"]]
      x: 25
      t: 1330337792.53844
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 2, 5], ["cp", 0, 6], ["cp", 2, 8], ["cp", 0, 9], ["cp", 2, 11], ["cp", 0, 12], ["cp", 2, 14], ["cp", 0, 15], ["cp", 2, 17], ["cp", 0, 18], ["cp", 2, 20], ["cp", 0, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337792.64653
    ,
      y: 24
      d: [["cp", 2, 1], ["cp", 0, 2], ["cp", 1, 4], ["cp", 0, 5], ["cp", 1, 7], ["cp", 0, 8], ["cp", 1, 10], ["cp", 0, 11], ["cp", 1, 13], ["cp", 0, 14], ["cp", 1, 16], ["cp", 0, 17], ["cp", 1, 19], ["cp", 0, 20], ["cp", 22, 21], [22, 0, 37, "out.cg  out.trace.xt  test.php  xdebug"], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337792.65317
    ,
      y: 24
      d: [[23, 22, "v"]]
      x: 24
      t: 1330337794.57497
    ,
      y: 24
      d: [[23, 23, "i"]]
      x: 25
      t: 1330337794.63492
    ,
      y: 24
      x: 26
      t: 1330337794.73905
    ,
      y: 24
      d: [[23, 25, "o"]]
      x: 27
      t: 1330337794.89904
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337794.98296
    ,
      y: 24
      x: 28
      t: 1330337795.13416
    ,
      y: 24
      d: [[23, 27, 28, "t."]]
      x: 30
      t: 1330337795.13443
    ,
      y: 24
      d: [[23, 29, "t"]]
      x: 31
      t: 1330337795.7709
    ,
      y: 24
      d: [[23, 30, "r"]]
      x: 32
      t: 1330337795.85903
    ,
      y: 24
      d: [[23, 31, 36, "ace.xt"]]
      x: 39
      t: 1330337796.08148
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 0, 3], ["cp", 1, 4], ["cp", 0, 6], ["cp", 1, 7], ["cp", 0, 9], ["cp", 1, 10], ["cp", 0, 12], ["cp", 1, 13], ["cp", 0, 15], ["cp", 1, 16], ["cp", 0, 18], ["cp", 1, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, ["a", " "]]]
      x: 1
      t: 1330337796.55106
    ,
      y: 24
      x: 1
      t: 1330337796.60303
    ,
      y: 24
      x: 1
      t: 1330337796.61137
    ,
      y: 24
      d: [["cp", 23, 0], ["cp", 0, 1], ["cp", 0, 2], ["cp", 0, 3], ["cp", 0, 4], ["cp", 0, 5], ["cp", 0, 6], ["cp", 0, 7], ["cp", 0, 8], ["cp", 0, 9], ["cp", 0, 10], ["cp", 0, 11], ["cp", 0, 12], ["cp", 0, 13], ["cp", 0, 14], ["cp", 0, 15], ["cp", 0, 16], ["cp", 0, 17], ["cp", 0, 18], ["cp", 0, 19], ["cp", 0, 20], ["cp", 0, 21], ["cp", 0, 22], [23, 0, 13, "\"out.trace.xt\""]]
      x: 15
      t: 1330337796.6993
    ,
      y: 1
      b: [[0, 0, 59, ["a", "4"]], [22, ["a", "4"]]]
      d: [[0, 0, 59, "+q436f+q6b75+q6b64+q6b72+q6b6c+q2332+q2334+q2569+q2a37+q6b31"], [1, 4, 9, "0.0012"], [1, 15, 29, "638744   +13264"], [1, 35, 79, "-> include(/tmp/xdebug/test.php) Command line"], [2, 1, 6, "code:1"], [3, 4, 9, "0.0013"], [3, 15, 20, "640104"], [3, 25, 29, "+1360"], [3, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [4, 4, 9, "0.0016"], [4, 15, 20, "640104"], [4, 28, 29, "+0"], [4, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [5, 4, 9, "0.0018"], [5, 15, 20, "640104"], [5, 28, 29, "+0"], [5, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [6, 4, 9, "0.0019"], [6, 15, 20, "640104"], [6, 28, 29, "+0"], [6, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [7, 4, 9, "0.0020"], [7, 15, 20, "640104"], [7, 28, 29, "+0"], [7, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [8, 4, 9, "0.0021"], [8, 15, 20, "640104"], [8, 28, 29, "+0"], [8, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [9, 4, 9, "0.0023"], [9, 15, 20, "640104"], [9, 28, 29, "+0"], [9, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [10, 4, 9, "0.0024"], [10, 15, 20, "640104"], [10, 28, 29, "+0"], [10, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [11, 4, 9, "0.0025"], [11, 15, 20, "640104"], [11, 28, 29, "+0"], [11, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [12, 4, 9, "0.0026"], [12, 15, 20, "640104"], [12, 28, 29, "+0"], [12, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [13, 4, 9, "0.0028"], [13, 15, 20, "640104"], [13, 28, 29, "+0"], [13, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [14, 4, 9, "0.0029"], [14, 15, 20, "640104"], [14, 28, 29, "+0"], [14, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [15, 4, 9, "0.0030"], [15, 15, 20, "640104"], [15, 28, 29, "+0"], [15, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [16, 4, 9, "0.0031"], [16, 15, 20, "640104"], [16, 28, 29, "+0"], [16, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [17, 4, 9, "0.0032"], [17, 15, 20, "640104"], [17, 28, 29, "+0"], [17, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [18, 4, 9, "0.0034"], [18, 15, 20, "640104"], [18, 28, 29, "+0"], [18, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [19, 4, 9, "0.0035"], [19, 15, 20, "640104"], [19, 28, 29, "+0"], [19, 37, 74, "-> flap->foo() /tmp/xdebug/test.php:25"], [20, 4, 9, "0.0036"], [20, 15, 20, "640104"], [20, 28, 29, "+0"], [20, 39, 75, "-> flop->foo() /tmp/xdebug/test.php:9"], [21, 4, 9, "0.0037"], [21, 15, 20, "640104"], [21, 28, 29, "+0"], [21, 37, 74, "-> flop->foo() /tmp/xdebug/test.php:24"], [22, 0, 67, "/tmp/xdebug/out.trace.xt [unix][084][54][0001,0001][2%][ mapping 1 ]"], [23, 15, 25, "36L, 2547Cc"]]
      x: 61
      B: [[0, 0, 59, ["a", "1"]], [22, ["a", "1"]]]
      t: 1330337796.73527
    ,
      y: 2
      d: [[22, 33, 38, "32][20"], [22, 44, "2"], [22, 52, "5"]]
      x: 1
      t: 1330337798.54499
    ,
      y: 4
      d: [[22, 44, "3"], [22, 52, "8"]]
      x: 1
      t: 1330337799.0489
    ,
      y: 5
      d: [[22, 44, "4"], [22, 52, 68, "11%][ mapping 1 ]"]]
      x: 1
      t: 1330337799.14868
    ,
      y: 7
      d: [[22, 44, "6"], [22, 53, "6"]]
      x: 1
      t: 1330337799.19673
    ,
      y: 8
      d: [[22, 44, "7"], [22, 53, "9"]]
      x: 1
      t: 1330337799.24873
    ,
      y: 9
      d: [[22, 44, "8"], [22, 52, 53, ["a", "2"]]]
      x: 1
      t: 1330337799.29687
    ,
      y: 10
      d: [[22, 44, "9"], [22, 53, "5"]]
      x: 1
      t: 1330337799.36477
    ,
      y: 11
      d: [[22, 43, 44, "10"], [22, 53, "7"]]
      x: 1
      t: 1330337799.42472
    ,
      y: 12
      d: [[22, 44, "1"], [22, 52, 53, "30"]]
      x: 1
      t: 1330337799.48086
    ,
      y: 13
      d: [[22, 44, "2"], [22, 53, "3"]]
      x: 1
      t: 1330337799.52496
    ,
      y: 14
      d: [[22, 44, "3"], [22, 53, "6"]]
      x: 1
      t: 1330337799.5732
    ,
      y: 15
      d: [[22, 44, "4"], [22, 53, "8"]]
      x: 1
      t: 1330337799.62498
    ,
      y: 19
      d: [[22, 44, "8"], [22, 52, 53, "50"]]
      x: 1
      t: 1330337799.84936
    ,
      y: 19
      b: [["cp", 1, 0]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "8"], [21, 42, "a"], [21, 74, "5"], [22, 44, "9"], [22, 53, "2"], [23, ["a", " "]]]
      x: 1
      B: [["cp", 1, 0]]
      t: 1330337799.87691
    ,
      y: 18
      d: [["cp", 2, 0], ["cp", 3, 1], ["cp", 4, 2], ["cp", 5, 3], ["cp", 6, 4], ["cp", 7, 5], ["cp", 8, 6], ["cp", 9, 7], ["cp", 10, 8], ["cp", 11, 9], ["cp", 12, 10], ["cp", 13, 11], ["cp", 14, 12], ["cp", 15, 13], ["cp", 16, 14], ["cp", 17, 15], ["cp", 18, 16], ["cp", 19, 17], ["cp", 20, 18], ["cp", 21, 19], [20, 8, 9, "40"], [20, 37, 75, "  -> flop->foo() /tmp/xdebug/test.php:9"], [21, 8, 9, "41"], [21, 42, "o"], [21, 74, "4"], [22, 43, 44, "20"], [22, 53, "5"]]
      x: 1
      t: 1330337799.92481
    ,
      y: 19
      d: [[22, 44, "1"], [22, 53, "8"]]
      x: 1
      t: 1330337799.98108
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "2"], [21, 42, "a"], [21, 74, "5"], [22, 44, "2"], [22, 52, 53, "61"]]
      x: 1
      t: 1330337800.02883
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "3"], [21, 37, 75, "  -> flop->foo() /tmp/xdebug/test.php:9"], [22, 44, "3"], [22, 53, "3"]]
      x: 1
      t: 1330337800.07675
    ,
      d: [["r", "    0.0019     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0020     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0021     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0023     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0024     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0025     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0026     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0028     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0029     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0030     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0031     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0032     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0034     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0035     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0036     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0037     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0038     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0040     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0041     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0042     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0043     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0044     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "/tmp/xdebug/out.trace.xt [unix][032][20][0024,0001][66%][ mapping 1 ]           "], ["a", " "]]
      x: 1
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", ["a", "1"], ["a", "0"]]
      y: 19
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", ["a", "4"], ["a", "0"]]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337800.12868
      i: 1
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "6"], [21, 42, "a"], [21, 74, "5"], [22, 44, "5"], [22, 53, "9"]]
      x: 1
      t: 1330337800.17685
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "7"], [21, 37, 75, "  -> flop->foo() /tmp/xdebug/test.php:9"], [22, 44, "6"], [22, 52, 53, "72"]]
      x: 1
      t: 1330337800.2251
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "8"], [21, 37, 75, "-> flop->foo() /tmp/xdebug/test.php:24 "], [22, 44, "7"], [22, 53, "5"]]
      x: 1
      t: 1330337800.27673
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "9"], [21, 42, "a"], [21, 74, "5"], [22, 44, "8"], [22, 53, "7"]]
      x: 1
      t: 1330337800.3292
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 8, 9, "51"], [21, 37, 75, "  -> flop->foo() /tmp/xdebug/test.php:9"], [22, 44, "9"], [22, 52, 53, "80"]]
      x: 1
      t: 1330337800.38069
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 9, "2"], [21, 16, 20, "33816"], [21, 25, 29, "-6288"], [21, 35, 76, "-> xdebug_stop_trace() Command line code:1"], [22, 43, 44, "30"], [22, 53, "3"]]
      x: 1
      t: 1330337800.43673
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 19, 20, "80"], [21, 25, 29, ["a", " "]], [21, 35, 76, ["a", " "]], [22, 44, "1"], [22, 53, "6"]]
      x: 1
      t: 1330337800.48506
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], [21, 0, 32, "TRACE END   [2012-02-27 10:16:30]"], [22, 44, "2"], [22, 53, "8"]]
      x: 1
      t: 1330337800.53333
    ,
      y: 19
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 23, 21], [22, 44, "3"], [22, 52, 53, "91"]]
      x: 1
      t: 1330337800.58515
    ,
      y: 20
      d: [[22, 44, "4"], [22, 53, "4"]]
      x: 1
      t: 1330337800.63295
    ,
      y: 21
      d: [[22, 33, 38, "84][54"], [22, 44, "5"], [22, 53, "7"]]
      x: 1
      t: 1330337800.68466
    ,
      y: 22
      d: [[22, 33, 38, "00][00"], [22, 44, "6"], [22, 52, 69, "100%][ mapping 1 ]"]]
      x: 1
      t: 1330337800.73672
    ,
      y: 21
      d: [[22, 33, 38, "84][54"], [22, 44, "5"], [22, 52, 69, "97%][ mapping 1 ] "]]
      x: 1
      t: 1330337801.66111
    ,
      y: 17
      d: [[0, 0, 32, "TRACE START [2012-02-27 10:16:30]"], [0, 37, 74, ["a", " "]], [1, 8, 9, "12"], [1, 16, 19, "3874"], [1, 24, 29, "+13264"], [1, 35, 79, "-> include(/tmp/xdebug/test.php) Command line"], [2, 1, 9, "code:1   "], [2, 15, 20, ["a", " "]], [2, 28, 29, ["a", " "]], [2, 39, 75, ["a", " "]], [3, 8, 9, "13"], [3, 25, 28, "+136"], [4, 8, 9, "16"], [5, 8, 9, "18"], [6, 8, 9, "19"], [7, 8, 9, "20"], [8, 8, 9, "21"], [9, 8, 9, "23"], [10, 8, 9, "24"], [11, 8, 9, "25"], [12, 8, 9, "26"], [13, 8, 9, "28"], [14, 8, 9, "29"], [22, 33, 38, "48][30"], [22, 43, 44, "16"], [22, 49, 53, "5][44"]]
      x: 5
      t: 1330337802.48126
    ,
      y: 17
      x: 5
      t: 1330337802.61659
    ,
      y: 24
      d: [[23, 0, ":"]]
      x: 2
      t: 1330337803.44899
    ,
      y: 24
      x: 2
      t: 1330337803.44907
    ,
      y: 24
      d: [[23, 1, "q"]]
      x: 3
      t: 1330337803.55668
    ,
      y: 24
      x: 1
      t: 1330337803.65284
    ,
      y: 24
      d: [[23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337803.66238
    ,
      y: 24
      d: [[23, 22, "n"]]
      x: 24
      t: 1330337804.13288
    ,
      y: 24
      d: [[23, 23, "i"]]
      x: 25
      t: 1330337804.20047
    ,
      y: 24
      d: [[23, 24, "c"]]
      x: 26
      t: 1330337804.28086
    ,
      y: 24
      d: [[23, 25, "e"]]
      x: 27
      t: 1330337804.3528
    ,
      y: 24
      d: [[23, 26, "."]]
      x: 28
      t: 1330337804.42488
    ,
      y: 24
      d: [[23, 27, "."]]
      x: 29
      t: 1330337804.57276
    ,
      y: 24
      d: [[23, 28, "h"]]
      x: 30
      t: 1330337804.77679
    ,
      y: 24
      d: [[23, 29, "e"]]
      x: 31
      t: 1330337804.90465
    ,
      y: 24
      d: [[23, 30, "r"]]
      x: 32
      t: 1330337804.92457
    ,
      y: 24
      d: [[23, 31, "e"]]
      x: 33
      t: 1330337804.98863
    ,
      y: 24
      x: 34
      t: 1330337805.0806
    ,
      y: 24
      d: [[23, 33, "w"]]
      x: 35
      t: 1330337805.23274
    ,
      y: 24
      d: [[23, 34, "e"]]
      x: 36
      t: 1330337805.42092
    ,
      y: 24
      x: 37
      t: 1330337805.62477
    ,
      y: 24
      d: [[23, 36, "c"]]
      x: 38
      t: 1330337805.91271
    ,
      y: 24
      d: [[23, 37, "a"]]
      x: 39
      t: 1330337806.00064
    ,
      y: 24
      d: [[23, 38, "n"]]
      x: 40
      t: 1330337806.06057
    ,
      y: 24
      x: 41
      t: 1330337806.36904
    ,
      y: 24
      d: [[23, 40, "s"]]
      x: 42
      t: 1330337806.41696
    ,
      y: 24
      d: [[23, 41, "e"]]
      x: 43
      t: 1330337806.56479
    ,
      y: 24
      d: [[23, 42, "e"]]
      x: 44
      t: 1330337806.72075
    ,
      y: 24
      x: 45
      t: 1330337806.80885
    ,
      y: 24
      d: [[23, 44, "t"]]
      x: 46
      t: 1330337806.92864
    ,
      y: 24
      d: [[23, 45, "h"]]
      x: 47
      t: 1330337807.04086
    ,
      y: 24
      d: [[23, 46, "e"]]
      x: 48
      t: 1330337807.12462
    ,
      y: 24
      x: 49
      t: 1330337807.26479
    ,
      y: 24
      d: [[23, 48, "w"]]
      x: 50
      t: 1330337807.54099
    ,
      y: 24
      d: [[23, 49, "o"]]
      x: 51
      t: 1330337807.6486
    ,
      y: 24
      d: [[23, 50, "r"]]
      x: 52
      t: 1330337807.73672
    ,
      y: 24
      d: [[23, 51, "k"]]
      x: 53
      t: 1330337807.82473
    ,
      y: 24
      d: [[23, 52, "f"]]
      x: 54
      t: 1330337807.92088
    ,
      y: 24
      d: [[23, 53, "l"]]
      x: 55
      t: 1330337808.0287
    ,
      y: 24
      d: [[23, 54, "o"]]
      x: 56
      t: 1330337808.21016
    ,
      y: 24
      d: [[23, 55, "w"]]
      x: 57
      t: 1330337808.32174
    ,
      y: 24
      x: 58
      t: 1330337808.58749
    ,
      y: 24
      d: [[23, 57, "a"]]
      x: 59
      t: 1330337808.71911
    ,
      y: 24
      d: [[23, 58, "n"]]
      x: 60
      t: 1330337808.79929
    ,
      y: 24
      d: [[23, 59, "d"]]
      x: 61
      t: 1330337808.88736
    ,
      y: 24
      x: 62
      t: 1330337808.98717
    ,
      y: 24
      d: [[23, 61, "o"]]
      x: 63
      t: 1330337809.12724
    ,
      y: 24
      d: [[23, 62, "r"]]
      x: 64
      t: 1330337809.18331
    ,
      y: 24
      d: [[23, 63, "d"]]
      x: 65
      t: 1330337809.32348
    ,
      y: 24
      d: [[23, 64, "e"]]
      x: 66
      t: 1330337809.48741
    ,
      y: 24
      d: [[23, 65, "r"]]
      x: 67
      t: 1330337809.59128
    ,
      y: 24
      x: 68
      t: 1330337809.61922
    ,
      y: 24
      d: [[23, 67, "o"]]
      x: 69
      t: 1330337809.82727
    ,
      y: 24
      d: [[23, 68, "f"]]
      x: 70
      t: 1330337809.92319
    ,
      y: 24
      x: 71
      t: 1330337810.01523
    ,
      y: 24
      d: [[23, 70, "a"]]
      x: 72
      t: 1330337810.41135
    ,
      y: 24
      d: [[23, 71, "l"]]
      x: 73
      t: 1330337810.50723
    ,
      y: 24
      d: [[23, 72, "l"]]
      x: 74
      t: 1330337810.64352
    ,
      y: 24
      b: [["cp", 22, 21], ["cp", 0, 22]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 74, "leon@dev:/tmp/xdebug$ nice..here we can see the workflow and order of all^C"], [23, 22, 72, ["a", " "]]]
      x: 23
      B: [["cp", 22, 21], ["cp", 0, 22]]
      t: 1330337810.94489
    ,
      y: 24
      d: [[23, 22, "c"]]
      x: 24
      t: 1330337811.18734
    ,
      y: 24
      d: [[23, 23, "a"]]
      x: 25
      t: 1330337811.28766
    ,
      y: 24
      d: [[23, 24, "l"]]
      x: 26
      t: 1330337811.42339
    ,
      y: 24
      d: [[23, 25, "l"]]
      x: 27
      t: 1330337811.57534
    ,
      y: 24
      d: [[23, 26, "s"]]
      x: 28
      t: 1330337811.65132
    ,
      y: 24
      d: [[23, 27, "."]]
      x: 29
      t: 1330337811.88336
    ,
      y: 24
      d: [[23, 28, "."]]
      x: 30
      t: 1330337812.03533
    ,
      y: 24
      d: [[23, 29, "g"]]
      x: 31
      t: 1330337812.5553
    ,
      y: 24
      d: [[23, 30, "r"]]
      x: 32
      t: 1330337812.66337
    ,
      y: 24
      d: [[23, 31, "e"]]
      x: 33
      t: 1330337812.72728
    ,
      y: 24
      d: [[23, 32, "a"]]
      x: 34
      t: 1330337812.87137
    ,
      y: 24
      d: [[23, 33, "t"]]
      x: 35
      t: 1330337813.00323
    ,
      y: 24
      x: 36
      t: 1330337813.08341
    ,
      y: 24
      d: [[23, 35, "f"]]
      x: 37
      t: 1330337813.25158
    ,
      y: 24
      d: [[23, 36, "o"]]
      x: 38
      t: 1330337813.39633
    ,
      y: 24
      d: [[23, 37, "r"]]
      x: 39
      t: 1330337813.42756
    ,
      y: 24
      x: 40
      t: 1330337813.51134
    ,
      y: 24
      d: [[23, 39, "i"]]
      x: 41
      t: 1330337813.75171
    ,
      y: 24
      d: [[23, 40, "n"]]
      x: 42
      t: 1330337813.83555
    ,
      y: 24
      d: [[23, 41, "s"]]
      x: 43
      t: 1330337813.93129
    ,
      y: 24
      d: [[23, 42, "p"]]
      x: 44
      t: 1330337814.06343
    ,
      y: 24
      d: [[23, 43, "e"]]
      x: 45
      t: 1330337814.38733
    ,
      y: 24
      d: [[23, 44, "c"]]
      x: 46
      t: 1330337814.52325
    ,
      y: 24
      d: [[23, 45, "t"]]
      x: 47
      t: 1330337814.7154
    ,
      y: 24
      d: [[23, 46, "i"]]
      x: 48
      t: 1330337814.79148
    ,
      y: 24
      d: [[23, 47, "o"]]
      x: 49
      t: 1330337814.87152
    ,
      y: 24
      d: [[23, 48, "n"]]
      x: 50
      t: 1330337814.96742
    ,
      d: [["r", "    0.0012     638744   +13264     -> include(/tmp/xdebug/test.php) Command line"], ["r", " code:1                                                                         "], ["r", "    0.0013     640104    +1360       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0016     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0018     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0019     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0020     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0021     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0023     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0024     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0025     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0026     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0028     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0029     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0048     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "], ["r", "    0.0049     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "], ["r", "    0.0051     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "], ["r", "    0.0052     633816    -6288     -> xdebug_stop_trace() Command line code:1   "], ["r", "    0.0052     633880                                                           "], ["r", "TRACE END   [2012-02-27 10:16:30]                                               "], ["a", " "], ["r", "/tmp/xdebug/out.trace.xt [unix][048][30][0016,0005][44%][ mapping 1 ]           "], ["r", "leon@dev:/tmp/xdebug$ nice..here we can see the workflow and order of all^C     "], ["r", "leon@dev:/tmp/xdebug$ calls..great for inspection.                              "]]
      x: 51
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", ["a", "1"], ["a", "0"], "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", ["a", "4"], ["a", "0"], "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337815.20346
      i: 1
    ,
      y: 24
      d: [[23, 50, "."]]
      x: 52
      t: 1330337815.35933
    ,
      y: 24
      d: [[23, 51, 52, "^C"]]
      x: 54
      t: 1330337815.67152
    ,
      y: 24
      b: [["cp", 21, 20], ["cp", 0, 21]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 52, ["a", " "]]]
      x: 23
      B: [["cp", 21, 20], ["cp", 0, 21]]
      t: 1330337815.67181
    ,
      y: 24
      d: [[23, 22, "t"]]
      x: 24
      t: 1330337818.11972
    ,
      y: 24
      d: [[23, 23, "h"]]
      x: 25
      t: 1330337818.23538
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337818.32352
    ,
      y: 24
      d: [[23, 25, "r"]]
      x: 27
      t: 1330337818.43525
    ,
      y: 24
      d: [[23, 26, "e"]]
      x: 28
      t: 1330337818.49933
    ,
      y: 24
      x: 29
      t: 1330337818.77541
    ,
      y: 24
      d: [[23, 28, "a"]]
      x: 30
      t: 1330337818.89136
    ,
      y: 24
      d: [[23, 29, "r"]]
      x: 31
      t: 1330337819.01167
    ,
      y: 24
      d: [[23, 30, "e"]]
      x: 32
      t: 1330337819.07554
    ,
      y: 24
      x: 33
      t: 1330337819.13922
    ,
      y: 24
      d: [[23, 32, "l"]]
      x: 34
      t: 1330337819.28339
    ,
      y: 24
      d: [[23, 33, "o"]]
      x: 35
      t: 1330337819.45144
    ,
      y: 24
      d: [[23, 34, "t"]]
      x: 36
      t: 1330337819.51927
    ,
      y: 24
      x: 37
      t: 1330337819.61958
    ,
      y: 24
      d: [[23, 36, "o"]]
      x: 38
      t: 1330337819.75939
    ,
      y: 24
      d: [[23, 37, "f"]]
      x: 39
      t: 1330337819.85944
    ,
      y: 24
      x: 40
      t: 1330337819.93958
    ,
      y: 24
      d: [[23, 39, "w"]]
      x: 41
      t: 1330337820.15949
    ,
      y: 24
      d: [[23, 40, "a"]]
      x: 42
      t: 1330337820.29527
    ,
      y: 24
      d: [[23, 41, "y"]]
      x: 43
      t: 1330337820.41987
    ,
      y: 24
      d: [[23, 42, "s"]]
      x: 44
      t: 1330337820.75147
    ,
      y: 24
      x: 45
      t: 1330337820.75151
    ,
      y: 24
      d: [[23, 44, "t"]]
      x: 46
      t: 1330337820.88347
    ,
      y: 24
      d: [[23, 45, "o"]]
      x: 47
      t: 1330337820.91148
    ,
      y: 24
      x: 48
      t: 1330337821.03542
    ,
      y: 24
      d: [[23, 47, "a"]]
      x: 49
      t: 1330337821.1913
    ,
      y: 24
      d: [[23, 48, "l"]]
      x: 50
      t: 1330337821.29538
    ,
      y: 24
      d: [[23, 49, "t"]]
      x: 51
      t: 1330337821.55542
    ,
      y: 24
      d: [[23, 50, "e"]]
      x: 52
      t: 1330337821.71151
    ,
      y: 24
      d: [[23, 51, "r"]]
      x: 53
      t: 1330337821.7874
    ,
      y: 24
      x: 54
      t: 1330337821.88754
    ,
      y: 24
      d: [[23, 53, "t"]]
      x: 55
      t: 1330337821.99541
    ,
      y: 24
      d: [[23, 54, "h"]]
      x: 56
      t: 1330337822.0756
    ,
      y: 24
      d: [[23, 55, "e"]]
      x: 57
      t: 1330337822.17957
    ,
      y: 24
      x: 58
      t: 1330337822.28742
    ,
      y: 24
      d: [[23, 57, "o"]]
      x: 59
      t: 1330337822.38762
    ,
      y: 24
      d: [[23, 58, "u"]]
      x: 60
      t: 1330337822.45555
    ,
      y: 24
      d: [[23, 59, "t"]]
      x: 61
      t: 1330337822.50738
    ,
      y: 24
      d: [[23, 60, "p"]]
      x: 62
      t: 1330337822.6077
    ,
      y: 24
      d: [[23, 61, "u"]]
      x: 63
      t: 1330337822.68744
    ,
      y: 24
      d: [[23, 62, "t"]]
      x: 64
      t: 1330337822.77944
    ,
      y: 24
      x: 65
      t: 1330337822.90769
    ,
      y: 24
      d: [[23, 64, "f"]]
      x: 66
      t: 1330337823.17167
    ,
      y: 24
      d: [[23, 65, "o"]]
      x: 67
      t: 1330337823.23547
    ,
      y: 24
      d: [[23, 65, " "]]
      x: 66
      t: 1330337823.62343
    ,
      y: 24
      d: [[23, 64, " "]]
      x: 65
      t: 1330337823.71546
    ,
      y: 24
      d: [[23, 64, "o"]]
      x: 66
      t: 1330337824.16762
    ,
      y: 24
      d: [[23, 65, "f"]]
      x: 67
      t: 1330337824.2594
    ,
      y: 24
      x: 68
      t: 1330337824.35151
    ,
      y: 24
      d: [[23, 67, "t"]]
      x: 69
      t: 1330337824.47573
    ,
      y: 24
      d: [[23, 68, "h"]]
      x: 70
      t: 1330337824.54519
    ,
      y: 24
      d: [[23, 69, "i"]]
      x: 71
      t: 1330337824.5971
    ,
      y: 24
      d: [[23, 70, "s"]]
      x: 72
      t: 1330337824.92505
    ,
      y: 24
      b: [["cp", 20, 19], ["cp", 0, 20]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 72, "there are lot of ways to alter the output of this^C"], [23, 22, 70, ["a", " "]]]
      x: 23
      B: [["cp", 20, 19], ["cp", 0, 20]]
      t: 1330337825.06218
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337825.75796
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337825.9339
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337826.11799
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337826.25008
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337826.32616
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337826.41417
    ,
      y: 24
      x: 30
      t: 1330337826.56211
    ,
      y: 24
      d: [[23, 29, "u"]]
      x: 31
      t: 1330337826.90613
    ,
      y: 24
      d: [[23, 30, "t"]]
      x: 32
      t: 1330337827.01007
    ,
      y: 24
      d: [[23, 31, "l"]]
      x: 33
      t: 1330337827.1941
    ,
      y: 24
      d: [[23, 31, " "]]
      x: 32
      t: 1330337827.92202
    ,
      y: 24
      d: [[23, 31, "i"]]
      x: 33
      t: 1330337828.17019
    ,
      y: 24
      d: [[23, 32, "l"]]
      x: 34
      t: 1330337828.30612
    ,
      y: 24
      d: [[23, 33, "i"]]
      x: 35
      t: 1330337828.40603
    ,
      y: 24
      d: [[23, 34, "t"]]
      x: 36
      t: 1330337828.52997
    ,
      y: 24
      d: [[23, 35, "y"]]
      x: 37
      t: 1330337828.6745
    ,
      y: 24
      b: [["cp", 19, 18], ["cp", 0, 19]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], ["cp", 17, 23]]
      x: 1
      B: [["cp", 19, 18], ["cp", 0, 19]]
      t: 1330337829.08442
    ,
      y: 24
      b: [["cp", 18, 17], ["cp", 0, 18]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 35, "Usage:                              "]]
      x: 1
      B: [["cp", 18, 17], ["cp", 0, 18]]
      t: 1330337829.09406
    ,
      y: 24
      b: [["cp", 17, 16], ["cp", 0, 17]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 0, 15, "    xdebug start"]]
      x: 1
      B: [["cp", 17, 16], ["cp", 0, 17]]
      t: 1330337829.16734
    ,
      y: 24
      b: [["cp", 16, 14], ["cp", 0, 16]]
      d: [["cp", 2, 0], ["cp", 3, 1], ["cp", 4, 2], ["cp", 5, 3], ["cp", 6, 4], ["cp", 7, 5], ["cp", 8, 6], ["cp", 9, 7], ["cp", 10, 8], ["cp", 11, 9], ["cp", 12, 10], ["cp", 13, 11], ["cp", 14, 12], ["cp", 15, 13], ["cp", 16, 14], ["cp", 17, 15], ["cp", 18, 16], ["cp", 19, 17], ["cp", 20, 18], ["cp", 21, 19], ["cp", 22, 20], [21, 0, 17, "    xdebug profile"], [22, 11, 15, "trace"]]
      x: 1
      B: [["cp", 16, 14], ["cp", 0, 16]]
      t: 1330337829.20226
    ,
      y: 24
      b: [["cp", 14, 10], ["cp", 0, 14]]
      d: [["cp", 4, 0], ["cp", 5, 1], ["cp", 6, 2], ["cp", 7, 3], ["cp", 8, 4], ["cp", 9, 5], ["cp", 10, 6], ["cp", 11, 7], ["cp", 12, 8], ["cp", 13, 9], ["cp", 14, 10], ["cp", 15, 11], ["cp", 16, 12], ["cp", 17, 13], ["cp", 18, 14], ["cp", 19, 15], ["cp", 20, 16], ["cp", 21, 17], ["cp", 22, 18], [19, 0, 19, "    xdebug summarize"], ["cp", 9, 20], [21, 0, 50, "type 'xdebug --manual' to see the manual + examples"], ["cp", 9, 22], [23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      B: [["cp", 14, 10], ["cp", 0, 14]]
      t: 1330337829.23906
    ,
      y: 24
      d: [[23, 22, "x"]]
      x: 24
      t: 1330337830.691
    ,
      y: 24
      d: [[23, 23, "d"]]
      x: 25
      t: 1330337830.92685
    ,
      y: 24
      d: [[23, 24, "e"]]
      x: 26
      t: 1330337831.08716
    ,
      y: 24
      d: [[23, 25, "b"]]
      x: 27
      t: 1330337831.23929
    ,
      y: 24
      d: [[23, 26, "u"]]
      x: 28
      t: 1330337831.29878
    ,
      y: 24
      d: [[23, 27, "g"]]
      x: 29
      t: 1330337831.37899
    ,
      y: 24
      x: 30
      t: 1330337831.51911
    ,
      y: 24
      d: [[23, 29, "-"]]
      x: 31
      t: 1330337831.66691
    ,
      y: 24
      d: [[23, 30, "-"]]
      x: 32
      t: 1330337831.8189
    ,
      y: 24
      d: [[23, 31, "m"]]
      x: 33
      t: 1330337832.03491
    ,
      y: 24
      d: [[23, 32, "a"]]
      x: 34
      t: 1330337832.17107
    ,
      y: 24
      d: [[23, 33, "n"]]
      x: 35
      t: 1330337832.24712
    ,
      y: 24
      d: [[23, 34, "u"]]
      x: 36
      t: 1330337832.33497
    ,
      y: 24
      d: [[23, 35, "a"]]
      x: 37
      t: 1330337832.51139
    ,
      y: 24
      d: [[23, 36, "l"]]
      x: 38
      t: 1330337832.67901
    ,
      y: 24
      b: [["cp", 10, 9], ["cp", 0, 10]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 8, 19], ["cp", 21, 20], ["cp", 8, 21], ["cp", 23, 22], ["cp", 8, 23]]
      x: 1
      B: [["cp", 10, 9], ["cp", 0, 10]]
      t: 1330337833.06305
    ,
      y: 24
      b: [["cp", 9, 8], ["cp", 0, 9]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 7, 18], ["cp", 20, 19], ["cp", 7, 20], ["cp", 22, 21], [22, 0, 36, "(please wait..)                      "]]
      x: 1
      B: [["cp", 9, 8], ["cp", 0, 9]]
      t: 1330337833.07779
    ,
      y: 1
      b: [["cp", 0, 8]]
      d: [["cp", 7, 0], ["cp", 0, 1], ["cp", 0, 2], ["cp", 0, 3], ["cp", 0, 4], ["cp", 0, 5], ["cp", 0, 6], ["cp", 0, 8], ["cp", 0, 9], ["cp", 0, 10], ["cp", 0, 11], ["cp", 0, 12], ["cp", 0, 13], ["cp", 0, 14], ["cp", 0, 15], ["cp", 0, 16], ["cp", 0, 17], ["cp", 0, 19], ["cp", 0, 21], ["cp", 0, 22]]
      x: 1
      B: [["cp", 0, 8]]
      t: 1330337833.16843
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [[0, 0, 8, "XDEBUG(1)"], [0, 22, 56, "User Contributed Perl Documentation"], [0, 69, 77, "XDEBUG(1)"], [2, 0, 3, "NAME"], [3, 10, 76, "xdebug - a cmdline utility to easify developing/testing with xdebug"], [5, 0, 7, "SYNOPSIS"], [6, 10, 78, "This utility demystifies the wonderfull world of XDebug's commandline"], [7, 0, 5, "usage,"], [8, 10, 67, "and requires no fiddling with php.ini configuration files."], [10, 0, 10, "DESCRIPTION"], [11, 7, 71, "This XDebug utility easifies (automated) multi-user profiling and"], [12, 7, 74, "tracing of php code. It also lets you configure XDebug's settings on"], [13, 7, 14, "the fly."], [15, 0, 2, "WHY"], [16, 7, 62, "Quickly outputting stats on the cmdline is always handy."], [18, 0, 7, "EXAMPLES"], [19, 7, 38, "Examples: xdebug start index.php"], [20, 17, 71, "xdebug start index.php out-%p remote_host=84.34.34.23\""], [21, 17, 76, "xdebug start index.php out-%p remote_host=`echo $SSH_CLIENT"], [22, 7, 22, "| sed s/ .*//g`\""], [23, 1, 59, "Manual page xdebug.1 line 1 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [[2, 0, 3, ["a", "1"]], [5, 0, 7, ["a", "1"]], [10, 0, 10, ["a", "1"]], [15, 0, 2, ["a", "1"]], ["cp", 5, 18]]
      t: 1330337833.21778
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESC                                                        "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337834.64711
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 0, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 0, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 0, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 7, 61, "          xdebug trace index.php trace collect_params=4"], [23, 1, 59, "Manual page xdebug.1 line 2 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 2, 1], ["cp", 0, 2], ["cp", 5, 4], ["cp", 0, 5], ["cp", 10, 9], ["cp", 0, 10], ["cp", 15, 14], ["cp", 0, 15], ["cp", 4, 17], ["cp", 0, 18]]
      t: 1330337834.64849
    ,
      d: [["a", " "], ["r", "NAME                                                                            "], ["r", "          xdebug - a cmdline utility to easify developing/testing with xdebug   "], ["a", " "], ["r", "SYNOPSIS                                                                        "], ["r", "          This utility demystifies the wonderfull world of XDebug's commandline "], ["r", "usage,                                                                          "], ["r", "          and requires no fiddling with php.ini configuration files.            "], ["a", " "], ["r", "DESCRIPTION                                                                     "], ["r", "       This XDebug utility easifies (automated) multi-user profiling and        "], ["r", "       tracing of php code. It also lets you configure XDebug's settings on     "], ["r", "       the fly.                                                                 "], ["a", " "], ["r", "WHY                                                                             "], ["r", "       Quickly outputting stats on the cmdline is always handy.                 "], ["a", " "], ["r", "EXAMPLES                                                                        "], ["r", "       Examples: xdebug start index.php                                         "], ["r", "                 xdebug start index.php out-%p remote_host=84.34.34.23\"        "], ["r", "                 xdebug start index.php out-%p remote_host=`echo $SSH_CLIENT   "], ["r", "       | sed s/ .*//g`\"                                                         "], ["r", "                 xdebug trace index.php trace collect_params=4                  "], ["r", " ESC                                                                            "]]
      x: 5
      B: [["a", "0"], ["r", "11110000000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", ["r", "11111111000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", "d", "d", ["r", "11111111111000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", "d", "d", ["r", "11100000000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", ["r", "11111111000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337835.02706
      i: 1
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 2, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 2, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 2, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 7, 61, "show_mem_delta=1\"                                      "], [23, 1, 59, "Manual page xdebug.1 line 5 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 4, 3], ["cp", 1, 4], ["cp", 9, 8], ["cp", 1, 9], ["cp", 14, 13], ["cp", 1, 14], ["cp", 3, 16], ["cp", 1, 17]]
      t: 1330337835.02715
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESC                                                        "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337835.24715
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 1, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 1, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 1, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 7, 49, "          xdebug profile index.php out-%p\""], [23, 1, 59, "Manual page xdebug.1 line 6 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3], ["cp", 8, 7], ["cp", 0, 8], ["cp", 13, 12], ["cp", 0, 13], ["cp", 2, 15], ["cp", 0, 16]]
      t: 1330337835.24727
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESCO                                                       "]]
      x: 6
      f: [["cp", 0, 23]]
      t: 1330337835.543
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 0, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 0, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 0, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 42, 70, "tmp; xdebug summarize tmp.cg\""], [23, 1, 59, "Manual page xdebug.1 line 7 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 2, 1], ["cp", 0, 2], ["cp", 7, 6], ["cp", 0, 7], ["cp", 12, 11], ["cp", 0, 12], ["cp", 1, 14], ["cp", 0, 15]]
      t: 1330337835.5431
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESC                                                        "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337835.77905
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 4, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 4, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 17, 70, "ARGV=\"http://foo.com/slug?name=value\" xdebug trace    "], [23, 1, 59, "Manual page xdebug.1 line 8 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 6, 5], ["cp", 1, 6], ["cp", 11, 10], ["cp", 1, 11], ["cp", 0, 13], ["cp", 1, 14]]
      t: 1330337835.77915
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESCO                                                       "]]
      x: 6
      f: [["cp", 0, 23]]
      t: 1330337835.96303
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 3, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 3, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 7, 66, "src/index.php out-%p\"                                      "], [23, 1, 59, "Manual page xdebug.1 line 9 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 5, 4], ["cp", 0, 5], ["cp", 10, 9], ["cp", 0, 10], ["cp", 13, 12], ["cp", 0, 13]]
      t: 1330337835.96309
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESC                                                        "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337836.16297
    ,
      y: 24
      b: [[23, 0, 59, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 2, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 2, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 2, 22], [23, 1, 59, "Manual page xdebug.1 line 9 (press h for help or q to quit)"]]
      x: 61
      f: [[23, 0, 59, ["a", "0"]]]
      B: [["cp", 4, 3], ["cp", 0, 4], ["cp", 9, 8], ["cp", 0, 9], ["cp", 12, 11], ["cp", 0, 12]]
      t: 1330337836.16313
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 59, "ESCO                                                       "]]
      x: 6
      f: [["cp", 0, 23]]
      t: 1330337836.35111
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 1, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 1, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 1, 21], [22, 22, 79, "^-- hint: to emulate webrequests: in php parse $argv[0] in"], [23, 1, 60, "Manual page xdebug.1 line 10 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 3, 2], ["cp", 0, 3], ["cp", 8, 7], ["cp", 0, 8], ["cp", 11, 10], ["cp", 0, 11]]
      t: 1330337836.35128
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESC                                                         "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337836.53089
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 0, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 0, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 0, 20], ["cp", 22, 21], [22, 0, 79, "to your $_SERVER variable                                                       "], [23, 1, 60, "Manual page xdebug.1 line 11 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 2, 1], ["cp", 0, 2], ["cp", 7, 6], ["cp", 0, 7], ["cp", 10, 9], ["cp", 0, 10]]
      t: 1330337836.531
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESC                                                         "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337836.76318
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 4, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 4, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 4, 22], [23, 1, 60, "Manual page xdebug.1 line 12 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 6, 5], ["cp", 1, 6], ["cp", 9, 8], ["cp", 1, 9]]
      t: 1330337836.76324
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESC                                                         "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337837.46712
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 3, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 3, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 3, 21], [22, 7, 26, "Some XDebug options:"], [23, 1, 60, "Manual page xdebug.1 line 13 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 5, 4], ["cp", 0, 5], ["cp", 8, 7], ["cp", 0, 8]]
      t: 1330337837.4673
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESC                                                         "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337837.891
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 2, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 2, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 2, 20], ["cp", 22, 21], [22, 7, 44, "          - show_exception_trace=[0|1]"], [23, 1, 60, "Manual page xdebug.1 line 14 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 4, 3], ["cp", 0, 4], ["cp", 7, 6], ["cp", 0, 7]]
      t: 1330337837.89111
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESCO                                                        "]]
      x: 6
      f: [["cp", 0, 23]]
      t: 1330337838.83921
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 1, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 1, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 1, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 24, 44, "local_vars=[0|1]     "], [23, 1, 60, "Manual page xdebug.1 line 15 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 3, 2], ["cp", 0, 3], ["cp", 6, 5], ["cp", 0, 6]]
      t: 1330337838.83929
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESC                                                         "]]
      x: 5
      f: [["cp", 0, 23]]
      t: 1330337839.27526
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 0, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 0, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 0, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 24, 39, "mem_delta=[0|1] "], [23, 1, 60, "Manual page xdebug.1 line 16 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 2, 1], ["cp", 0, 2], ["cp", 5, 4], ["cp", 0, 5]]
      t: 1330337839.27544
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [[23, 1, 60, "ESCO                                                        "]]
      x: 6
      f: [["cp", 0, 23]]
      t: 1330337839.47919
    ,
      y: 24
      b: [[23, 0, 60, ["a", "7"]]]
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 2, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 2, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 19, 38, ["a", " "]], [23, 1, 60, "Manual page xdebug.1 line 17 (press h for help or q to quit)"]]
      x: 62
      f: [[23, 0, 60, ["a", "0"]]]
      B: [["cp", 1, 0], ["cp", 2, 1], ["cp", 4, 3], ["cp", 1, 4]]
      t: 1330337839.47926
    ,
      y: 24
      b: [["cp", 0, 23]]
      d: [["cp", 2, 23]]
      x: 1
      f: [["cp", 0, 23]]
      t: 1330337840.17909
    ,
      y: 24
      d: [[23, 0, 20, "leon@dev:/tmp/xdebug$"]]
      x: 23
      t: 1330337840.18489
    ,
      y: 24
      d: [[23, 22, "j"]]
      x: 24
      t: 1330337842.6871
    ,
      y: 24
      d: [[23, 23, "u"]]
      x: 25
      t: 1330337842.87924
    ,
      y: 24
      d: [[23, 24, "s"]]
      x: 26
      t: 1330337842.96308
    ,
      y: 24
      d: [[23, 25, "t"]]
      x: 27
      t: 1330337843.05515
    ,
      y: 24
      x: 28
      t: 1330337843.12287
    ,
      y: 24
      d: [[23, 27, "f"]]
      x: 29
      t: 1330337843.33919
    ,
      y: 24
      d: [[23, 28, "i"]]
      x: 30
      t: 1330337843.44728
    ,
      y: 24
      d: [[23, 29, "f"]]
      x: 31
      t: 1330337843.77523
    ,
      y: 24
      d: [[23, 29, " "]]
      x: 30
      t: 1330337844.10707
    ,
      y: 24
      d: [[23, 29, "d"]]
      x: 31
      t: 1330337844.20716
    ,
      y: 24
      d: [[23, 30, "d"]]
      x: 32
      t: 1330337844.34319
    ,
      y: 24
      d: [[23, 31, "l"]]
      x: 33
      t: 1330337844.41945
    ,
      y: 24
      d: [[23, 32, "e"]]
      x: 34
      t: 1330337844.53556
    ,
      y: 24
      x: 35
      t: 1330337844.64346
    ,
      y: 24
      d: [[23, 34, "a"]]
      x: 36
      t: 1330337845.08355
    ,
      y: 24
      x: 37
      t: 1330337845.15938
    ,
      y: 24
      d: [[23, 36, "b"]]
      x: 38
      t: 1330337845.33596
    ,
      y: 24
      d: [[23, 37, "i"]]
      x: 39
      t: 1330337845.45168
    ,
      y: 24
      d: [[23, 38, "t"]]
      x: 40
      t: 1330337845.47552
    ,
      y: 24
      x: 41
      t: 1330337845.56354
    ,
      y: 24
      d: [[23, 40, "w"]]
      x: 42
      t: 1330337845.82332
    ,
      y: 24
      d: [[23, 41, "i"]]
      x: 43
      t: 1330337845.8993
    ,
      y: 24
      d: [[23, 42, "t"]]
      x: 44
      t: 1330337846.04395
    ,
      y: 24
      d: [[23, 43, "h"]]
      x: 45
      t: 1330337846.12355
    ,
      y: 24
      x: 46
      t: 1330337846.1438
    ,
      y: 24
      d: [[23, 45, "i"]]
      x: 47
      t: 1330337846.33976
    ,
      y: 24
      d: [[23, 46, "t"]]
      x: 48
      t: 1330337846.44
    ,
      y: 24
      d: [[23, 47, "."]]
      x: 49
      t: 1330337846.60417
    ,
      y: 24
      d: [[23, 48, "."]]
      x: 50
      t: 1330337846.75219
    ,
      y: 24
      d: [[23, 49, "I"]]
      x: 51
      t: 1330337847.14539
    ,
      y: 24
      x: 52
      t: 1330337847.22557
    ,
      y: 24
      d: [[23, 51, "f"]]
      x: 53
      t: 1330337847.40554
    ,
      y: 24
      d: [[23, 52, "i"]]
      x: 54
      t: 1330337847.4814
    ,
      y: 24
      d: [[23, 53, "n"]]
      x: 55
      t: 1330337847.53356
    ,
      y: 24
      d: [[23, 54, "d"]]
      x: 56
      t: 1330337847.64146
    ,
      y: 24
      x: 57
      t: 1330337847.72957
    ,
      y: 24
      d: [[23, 56, "i"]]
      x: 58
      t: 1330337847.92965
    ,
      y: 24
      d: [[23, 57, "t"]]
      x: 59
      t: 1330337848.1376
    ,
      y: 24
      x: 60
      t: 1330337848.26159
    ,
      y: 24
      d: [[23, 59, "v"]]
      x: 61
      t: 1330337848.44152
    ,
      y: 24
      d: [[23, 60, "e"]]
      x: 62
      t: 1330337848.52954
    ,
      y: 24
      d: [[23, 61, "r"]]
      x: 63
      t: 1330337848.57754
    ,
      y: 24
      d: [[23, 62, "y"]]
      x: 64
      t: 1330337848.65757
    ,
      y: 24
      x: 65
      t: 1330337848.73757
    ,
      y: 24
      d: [[23, 64, "u"]]
      x: 66
      t: 1330337849.15355
    ,
      y: 24
      d: [[23, 65, "s"]]
      x: 67
      t: 1330337849.24938
    ,
      y: 24
      d: [[23, 66, "e"]]
      x: 68
      t: 1330337849.34563
    ,
      y: 24
      d: [[23, 67, "f"]]
      x: 69
      t: 1330337849.51335
    ,
      y: 24
      d: [[23, 68, "u"]]
      x: 70
      t: 1330337849.59755
    ,
      y: 24
      d: [[23, 69, "l"]]
      x: 71
      t: 1330337849.75364
    ,
      y: 24
      d: [[23, 70, "l"]]
      x: 72
      t: 1330337849.90953
    ,
      y: 24
      d: [[23, 71, 72, "^C"]]
      x: 74
      t: 1330337850.13759
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 1, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 1, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 72, ["a", " "]]]
      x: 23
      B: [["cp", 1, 0], ["cp", 3, 2], ["cp", 0, 3]]
      t: 1330337850.13791
    ,
      y: 24
      d: [[23, 22, "I"]]
      x: 24
      t: 1330337850.98574
    ,
      y: 24
      x: 25
      t: 1330337851.04944
    ,
      y: 24
      d: [[23, 24, "c"]]
      x: 26
      t: 1330337851.53363
    ,
      y: 24
      d: [[23, 25, "a"]]
      x: 27
      t: 1330337851.58964
    ,
      y: 24
      d: [[23, 26, "n"]]
      x: 28
      t: 1330337851.66575
    ,
      y: 24
      x: 29
      t: 1330337851.73371
    ,
      y: 24
      d: [[23, 28, "e"]]
      x: 30
      t: 1330337851.92961
    ,
      y: 24
      d: [[23, 29, "a"]]
      x: 31
      t: 1330337852.06158
    ,
      y: 24
      d: [[23, 30, "s"]]
      x: 32
      t: 1330337852.19769
    ,
      y: 24
      d: [[23, 31, "i"]]
      x: 33
      t: 1330337852.34565
    ,
      y: 24
      d: [[23, 32, "l"]]
      x: 34
      t: 1330337852.42161
    ,
      y: 24
      d: [[23, 33, "y"]]
      x: 35
      t: 1330337852.59385
    ,
      y: 24
      x: 36
      t: 1330337852.67375
    ,
      y: 24
      d: [[23, 35, "a"]]
      x: 37
      t: 1330337853.07376
    ,
      y: 24
      d: [[23, 36, 37, "lt"]]
      x: 39
      t: 1330337853.07385
    ,
      y: 24
      d: [[23, 38, "e"]]
      x: 40
      t: 1330337853.13777
    ,
      y: 24
      d: [[23, 39, "r"]]
      x: 41
      t: 1330337853.2136
    ,
      d: [["r", "       Quickly outputting stats on the cmdline is always handy.                 "], ["a", " "], ["r", "EXAMPLES                                                                        "], ["r", "       Examples: xdebug start index.php                                         "], ["r", "                 xdebug start index.php out-%p remote_host=84.34.34.23\"        "], ["r", "                 xdebug start index.php out-%p remote_host=`echo $SSH_CLIENT   "], ["r", "       | sed s/ .*//g`\"                                                         "], ["r", "                 xdebug trace index.php trace collect_params=4                  "], ["r", "       show_mem_delta=1\"                                                        "], ["r", "                 xdebug profile index.php out-%p\"                              "], ["r", "                 xdebug profile index.php tmp; xdebug summarize tmp.cg\"         "], ["r", "                 ARGV=\"http://foo.com/slug?name=value\" xdebug trace             "], ["r", "       src/index.php out-%p\"                                                   "], ["a", " "], ["r", "                      ^-- hint: to emulate webrequests: in php parse $argv[0] in"], ["r", "to your $_SERVER variable                                                       "], ["a", " "], ["r", "       Some XDebug options:                                                     "], ["r", "                 - show_exception_trace=[0|1]                                   "], ["r", "                 - show_local_vars=[0|1]                                        "], ["r", "                 - show_mem_delta=[0|1]                                         "], ["r", "                 -                                                              "], ["r", "leon@dev:/tmp/xdebug$ just fiddle a bit with it..I find it very usefull^C       "], ["r", "leon@dev:/tmp/xdebug$ I can easily alter                                        "]]
      x: 42
      B: [["a", "0"], "d", ["r", "11111111000000000000000000000000000000000000000000000000000000000000000000000000"], ["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337853.32155
      i: 1
    ,
      y: 24
      d: [[23, 41, "x"]]
      x: 43
      t: 1330337854.52305
    ,
      y: 24
      d: [[23, 42, "d"]]
      x: 44
      t: 1330337854.59497
    ,
      y: 24
      d: [[23, 43, "e"]]
      x: 45
      t: 1330337854.73919
    ,
      y: 24
      d: [[23, 44, "b"]]
      x: 46
      t: 1330337854.79914
    ,
      y: 24
      d: [[23, 45, "u"]]
      x: 47
      t: 1330337854.85099
    ,
      y: 24
      d: [[23, 46, "g"]]
      x: 48
      t: 1330337854.94279
    ,
      y: 24
      x: 49
      t: 1330337855.01483
    ,
      y: 24
      d: [[23, 48, "s"]]
      x: 50
      t: 1330337855.1508
    ,
      y: 24
      d: [[23, 49, "e"]]
      x: 51
      t: 1330337855.37514
    ,
      y: 24
      d: [[23, 50, "t"]]
      x: 52
      t: 1330337855.59917
    ,
      y: 24
      d: [[23, 51, "t"]]
      x: 53
      t: 1330337855.75518
    ,
      y: 24
      d: [[23, 52, "i"]]
      x: 54
      t: 1330337855.84316
    ,
      y: 24
      d: [[23, 53, "n"]]
      x: 55
      t: 1330337855.93895
    ,
      y: 24
      d: [[23, 54, "g"]]
      x: 56
      t: 1330337855.95903
    ,
      y: 24
      d: [[23, 55, "s"]]
      x: 57
      t: 1330337856.14286
    ,
      y: 24
      x: 58
      t: 1330337856.28708
    ,
      y: 24
      d: [[23, 57, "w"]]
      x: 59
      t: 1330337856.52707
    ,
      y: 24
      d: [[23, 58, "i"]]
      x: 60
      t: 1330337856.61892
    ,
      y: 24
      d: [[23, 59, "t"]]
      x: 61
      t: 1330337856.72362
    ,
      y: 24
      d: [[23, 60, "h"]]
      x: 62
      t: 1330337856.94336
    ,
      y: 24
      d: [[23, 61, 62, "ou"]]
      x: 64
      t: 1330337856.955
    ,
      y: 24
      d: [[23, 63, "t"]]
      x: 65
      t: 1330337857.04079
    ,
      y: 24
      x: 66
      t: 1330337857.33917
    ,
      y: 24
      d: [[23, 65, 66, "^C"]]
      x: 68
      t: 1330337857.71919
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 0, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 0, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 66, ["a", " "]]]
      x: 23
      B: [["cp", 2, 1], ["cp", 0, 2]]
      t: 1330337857.7195
    ,
      y: 24
      d: [[23, 22, "f"]]
      x: 24
      t: 1330337859.015
    ,
      y: 24
      d: [[23, 23, "i"]]
      x: 25
      t: 1330337859.11905
    ,
      y: 24
      d: [[23, 24, "d"]]
      x: 26
      t: 1330337859.25109
    ,
      y: 24
      d: [[23, 25, "d"]]
      x: 27
      t: 1330337859.35519
    ,
      y: 24
      d: [[23, 26, "l"]]
      x: 28
      t: 1330337859.56718
    ,
      y: 24
      d: [[23, 27, "i"]]
      x: 29
      t: 1330337859.58699
    ,
      y: 24
      d: [[23, 28, "n"]]
      x: 30
      t: 1330337859.67497
    ,
      y: 24
      d: [[23, 29, "g"]]
      x: 31
      t: 1330337859.75516
    ,
      y: 24
      x: 32
      t: 1330337859.94773
    ,
      y: 24
      d: [[23, 31, "w"]]
      x: 33
      t: 1330337860.36363
    ,
      y: 24
      d: [[23, 32, "i"]]
      x: 34
      t: 1330337860.47565
    ,
      y: 24
      d: [[23, 33, "t"]]
      x: 35
      t: 1330337860.58368
    ,
      y: 24
      d: [[23, 34, "h"]]
      x: 36
      t: 1330337860.7037
    ,
      y: 24
      x: 37
      t: 1330337860.72374
    ,
      y: 24
      d: [[23, 36, "p"]]
      x: 38
      t: 1330337860.8759
    ,
      y: 24
      d: [[23, 37, "h"]]
      x: 39
      t: 1330337860.99152
    ,
      y: 24
      d: [[23, 38, "p"]]
      x: 40
      t: 1330337861.1156
    ,
      y: 24
      d: [[23, 39, "."]]
      x: 41
      t: 1330337861.52368
    ,
      y: 24
      d: [[23, 40, "i"]]
      x: 42
      t: 1330337861.80785
    ,
      y: 24
      d: [[23, 41, "n"]]
      x: 43
      t: 1330337861.88759
    ,
      y: 24
      d: [[23, 42, "i"]]
      x: 44
      t: 1330337862.06797
    ,
      y: 24
      x: 45
      t: 1330337862.57585
    ,
      y: 24
      d: [[23, 44, "("]]
      x: 46
      t: 1330337862.79968
    ,
      y: 24
      d: [[23, 45, "y"]]
      x: 47
      t: 1330337863.03569
    ,
      y: 24
      d: [[23, 46, "o"]]
      x: 48
      t: 1330337863.11168
    ,
      y: 24
      d: [[23, 47, "u"]]
      x: 49
      t: 1330337863.21181
    ,
      y: 24
      x: 50
      t: 1330337863.26354
    ,
      y: 24
      d: [[23, 49, "d"]]
      x: 51
      t: 1330337863.66379
    ,
      y: 24
      d: [[23, 50, 52, "ont"]]
      x: 54
      t: 1330337863.70757
    ,
      y: 24
      x: 55
      t: 1330337863.83174
    ,
      y: 24
      d: [[23, 54, "w"]]
      x: 56
      t: 1330337863.96368
    ,
      y: 24
      d: [[23, 55, "a"]]
      x: 57
      t: 1330337864.08765
    ,
      y: 24
      d: [[23, 56, "n"]]
      x: 58
      t: 1330337864.17576
    ,
      y: 24
      d: [[23, 57, "t"]]
      x: 59
      t: 1330337864.30376
    ,
      y: 24
      x: 60
      t: 1330337864.37212
    ,
      y: 24
      d: [[23, 59, "t"]]
      x: 61
      t: 1330337864.50777
    ,
      y: 24
      d: [[23, 60, "h"]]
      x: 62
      t: 1330337864.62759
    ,
      y: 24
      d: [[23, 61, "a"]]
      x: 63
      t: 1330337864.7076
    ,
      y: 24
      d: [[23, 62, "t"]]
      x: 64
      t: 1330337864.8196
    ,
      y: 24
      x: 65
      t: 1330337864.90377
    ,
      y: 24
      d: [[23, 64, "o"]]
      x: 66
      t: 1330337865.0518
    ,
      y: 24
      d: [[23, 65, "n"]]
      x: 67
      t: 1330337865.13968
    ,
      y: 24
      x: 68
      t: 1330337865.19565
    ,
      y: 24
      d: [[23, 67, "a"]]
      x: 69
      t: 1330337865.59584
    ,
      y: 24
      x: 70
      t: 1330337865.71185
    ,
      y: 24
      d: [[23, 69, "l"]]
      x: 71
      t: 1330337865.84828
    ,
      y: 24
      d: [[23, 70, "i"]]
      x: 72
      t: 1330337865.93573
    ,
      y: 24
      d: [[23, 71, "v"]]
      x: 73
      t: 1330337866.0037
    ,
      y: 24
      d: [[23, 72, "e"]]
      x: 74
      t: 1330337866.07571
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 11, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 74, "fiddling with php.ini (you dont want that on a live^C"], [23, 22, 72, ["a", " "]]]
      x: 23
      B: [["cp", 1, 0], ["cp", 2, 1]]
      t: 1330337866.50812
    ,
      y: 24
      d: [[23, 22, "d"]]
      x: 24
      t: 1330337867.22387
    ,
      y: 24
      d: [[23, 22, " "]]
      x: 23
      t: 1330337867.74391
    ,
      y: 24
      d: [[23, 22, "s"]]
      x: 24
      t: 1330337867.83576
    ,
      y: 24
      d: [[23, 23, "e"]]
      x: 25
      t: 1330337868.00791
    ,
      y: 24
      d: [[23, 24, 27, "rver"]]
      x: 29
      t: 1330337868.32821
    ,
      y: 24
      d: [[23, 28, ")"]]
      x: 30
      t: 1330337868.75204
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 10, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 74, "server)^C                                            "], [23, 22, 28, ["a", " "]]]
      x: 23
      B: [["cp", 1, 0]]
      t: 1330337869.38435
    ,
      y: 24
      d: [[23, 22, 23, "al"]]
      x: 25
      t: 1330337870.05277
    ,
      y: 24
      d: [[23, 24, "s"]]
      x: 26
      t: 1330337870.08027
    ,
      y: 24
      d: [[23, 25, "o"]]
      x: 27
      t: 1330337870.22033
    ,
      y: 24
      d: [[23, 26, "."]]
      x: 28
      t: 1330337870.84458
    ,
      y: 24
      d: [[23, 27, "."]]
      x: 29
      t: 1330337870.98446
    ,
      y: 24
      d: [[23, 28, "i"]]
      x: 30
      t: 1330337871.19716
    ,
      y: 24
      d: [[23, 29, "t"]]
      x: 31
      t: 1330337871.2845
    ,
      y: 24
      x: 32
      t: 1330337871.36851
    ,
      y: 24
      d: [[23, 31, "w"]]
      x: 33
      t: 1330337871.51673
    ,
      y: 24
      d: [[23, 32, "o"]]
      x: 34
      t: 1330337871.61235
    ,
      y: 24
      d: [[23, 33, "r"]]
      x: 35
      t: 1330337871.71644
    ,
      y: 24
      d: [[23, 34, "k"]]
      x: 36
      t: 1330337871.77239
    ,
      y: 24
      d: [[23, 35, "s"]]
      x: 37
      t: 1330337871.89293
    ,
      y: 24
      x: 38
      t: 1330337872.02028
    ,
      y: 24
      d: [[23, 37, "p"]]
      x: 39
      t: 1330337872.32469
    ,
      y: 24
      d: [[23, 38, "e"]]
      x: 40
      t: 1330337872.38452
    ,
      y: 24
      d: [[23, 39, "r"]]
      x: 41
      t: 1330337872.44465
    ,
      d: [["r", "       Examples: xdebug start index.php                                         "], ["r", "                 xdebug start index.php out-%p remote_host=84.34.34.23\"        "], ["r", "                 xdebug start index.php out-%p remote_host=`echo $SSH_CLIENT   "], ["r", "       | sed s/ .*//g`\"                                                         "], ["r", "                 xdebug trace index.php trace collect_params=4                  "], ["r", "       show_mem_delta=1\"                                                        "], ["r", "                 xdebug profile index.php out-%p\"                              "], ["r", "                 xdebug profile index.php tmp; xdebug summarize tmp.cg\"         "], ["r", "                 ARGV=\"http://foo.com/slug?name=value\" xdebug trace             "], ["r", "       src/index.php out-%p\"                                                   "], ["a", " "], ["r", "                      ^-- hint: to emulate webrequests: in php parse $argv[0] in"], ["r", "to your $_SERVER variable                                                       "], ["a", " "], ["r", "       Some XDebug options:                                                     "], ["r", "                 - show_exception_trace=[0|1]                                   "], ["r", "                 - show_local_vars=[0|1]                                        "], ["r", "                 - show_mem_delta=[0|1]                                         "], ["r", "                 -                                                              "], ["r", "leon@dev:/tmp/xdebug$ just fiddle a bit with it..I find it very usefull^C       "], ["r", "leon@dev:/tmp/xdebug$ I can easily alter xdebug settings without ^C             "], ["r", "leon@dev:/tmp/xdebug$ fiddling with php.ini (you dont want that on a live^C     "], ["r", "leon@dev:/tmp/xdebug$ server)^C                                                 "], ["r", "leon@dev:/tmp/xdebug$ also..it works perf                                       "]]
      x: 42
      B: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      y: 24
      b: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      f: [["a", "7"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      U: [["a", "0"], "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d", "d"]
      t: 1330337872.59814
      i: 1
    ,
      y: 24
      d: [[23, 41, 42, "ec"]]
      x: 44
      t: 1330337873.39408
    ,
      y: 24
      d: [[23, 43, "t"]]
      x: 45
      t: 1330337873.57382
    ,
      y: 24
      d: [[23, 44, "l"]]
      x: 46
      t: 1330337873.68987
    ,
      y: 24
      d: [[23, 45, "y"]]
      x: 47
      t: 1330337873.79796
    ,
      y: 24
      x: 48
      t: 1330337873.974
    ,
      y: 24
      d: [[23, 47, "i"]]
      x: 49
      t: 1330337874.29029
    ,
      y: 24
      d: [[23, 48, "f"]]
      x: 50
      t: 1330337874.37799
    ,
      y: 24
      x: 51
      t: 1330337874.46999
    ,
      y: 24
      d: [[23, 50, "y"]]
      x: 52
      t: 1330337874.59384
    ,
      y: 24
      d: [[23, 51, "o"]]
      x: 53
      t: 1330337874.66593
    ,
      y: 24
      d: [[23, 52, "u"]]
      x: 54
      t: 1330337874.74595
    ,
      y: 24
      x: 55
      t: 1330337874.84214
    ,
      y: 24
      d: [[23, 54, "w"]]
      x: 56
      t: 1330337875.23409
    ,
      y: 24
      d: [[23, 55, "a"]]
      x: 57
      t: 1330337875.40613
    ,
      y: 24
      d: [[23, 56, "n"]]
      x: 58
      t: 1330337875.49814
    ,
      y: 24
      d: [[23, 57, "t"]]
      x: 59
      t: 1330337875.62185
    ,
      y: 24
      x: 60
      t: 1330337875.69399
    ,
      y: 24
      d: [[23, 59, "t"]]
      x: 61
      t: 1330337875.81009
    ,
      y: 24
      d: [[23, 60, "o"]]
      x: 62
      t: 1330337875.90192
    ,
      y: 24
      x: 63
      t: 1330337875.96216
    ,
      y: 24
      d: [[23, 62, "t"]]
      x: 64
      t: 1330337876.51406
    ,
      y: 24
      d: [[23, 63, 65, "rig"]]
      x: 67
      t: 1330337876.54184
    ,
      y: 24
      d: [[23, 66, "g"]]
      x: 68
      t: 1330337876.6901
    ,
      y: 24
      d: [[23, 67, "e"]]
      x: 69
      t: 1330337876.73409
    ,
      y: 24
      d: [[23, 68, "r"]]
      x: 70
      t: 1330337876.80216
    ,
      y: 24
      d: [[23, 69, 70, "^C"]]
      x: 72
      t: 1330337877.35018
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 12, 11], ["cp", 9, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], ["cp", 23, 22], [23, 22, 70, ["a", " "]]]
      x: 23
      t: 1330337877.35048
    ,
      y: 24
      d: [[23, 22, "r"]]
      x: 24
      t: 1330337878.49005
    ,
      y: 24
      d: [[23, 23, "e"]]
      x: 25
      t: 1330337878.54614
    ,
      y: 24
      d: [[23, 24, "m"]]
      x: 26
      t: 1330337878.60196
    ,
      y: 24
      d: [[23, 25, "o"]]
      x: 27
      t: 1330337878.67403
    ,
      y: 24
      d: [[23, 26, "t"]]
      x: 28
      t: 1330337878.75786
    ,
      y: 24
      d: [[23, 27, "e"]]
      x: 29
      t: 1330337878.80989
    ,
      y: 24
      x: 30
      t: 1330337880.14206
    ,
      y: 24
      d: [[23, 29, "s"]]
      x: 31
      t: 1330337880.42215
    ,
      y: 24
      d: [[23, 30, "e"]]
      x: 32
      t: 1330337881.03406
    ,
      y: 24
      d: [[23, 31, "s"]]
      x: 33
      t: 1330337881.23399
    ,
      y: 24
      d: [[23, 32, "s"]]
      x: 34
      t: 1330337881.37015
    ,
      y: 24
      d: [[23, 33, "i"]]
      x: 35
      t: 1330337881.52221
    ,
      y: 24
      d: [[23, 34, "o"]]
      x: 36
      t: 1330337881.60611
    ,
      y: 24
      d: [[23, 35, "n"]]
      x: 37
      t: 1330337881.72207
    ,
      y: 24
      d: [[23, 36, "s"]]
      x: 38
      t: 1330337881.85434
    ,
      y: 24
      d: [[23, 37, ","]]
      x: 39
      t: 1330337883.91136
    ,
      y: 24
      x: 40
      t: 1330337883.99902
    ,
      y: 24
      d: [[23, 39, "o"]]
      x: 41
      t: 1330337884.18727
    ,
      y: 24
      d: [[23, 40, "r"]]
      x: 42
      t: 1330337884.27116
    ,
      y: 24
      x: 43
      t: 1330337884.37113
    ,
      y: 24
      d: [[23, 42, "m"]]
      x: 44
      t: 1330337884.51528
    ,
      y: 24
      d: [[23, 43, "u"]]
      x: 45
      t: 1330337884.70732
    ,
      y: 24
      d: [[23, 44, "l"]]
      x: 46
      t: 1330337884.85161
    ,
      y: 24
      d: [[23, 45, "t"]]
      x: 47
      t: 1330337885.07937
    ,
      y: 24
      d: [[23, 46, "i"]]
      x: 48
      t: 1330337885.21112
    ,
      y: 24
      d: [[23, 47, "-"]]
      x: 49
      t: 1330337885.45135
    ,
      y: 24
      d: [[23, 48, "u"]]
      x: 50
      t: 1330337885.73146
    ,
      y: 24
      d: [[23, 49, "s"]]
      x: 51
      t: 1330337885.80726
    ,
      y: 24
      d: [[23, 50, "e"]]
      x: 52
      t: 1330337885.8594
    ,
      y: 24
      d: [[23, 51, "r"]]
      x: 53
      t: 1330337885.91915
    ,
      y: 24
      x: 54
      t: 1330337886.37143
    ,
      y: 24
      d: [[23, 53, 54, "se"]]
      x: 56
      t: 1330337886.75552
    ,
      y: 24
      d: [[23, 55, "s"]]
      x: 57
      t: 1330337886.81535
    ,
      y: 24
      d: [[23, 56, "s"]]
      x: 58
      t: 1330337886.97133
    ,
      y: 24
      d: [[23, 57, "i"]]
      x: 59
      t: 1330337887.06724
    ,
      y: 24
      d: [[23, 58, "o"]]
      x: 60
      t: 1330337887.15925
    ,
      y: 24
      d: [[23, 59, "n"]]
      x: 61
      t: 1330337887.26751
    ,
      y: 24
      d: [[23, 60, "s"]]
      x: 62
      t: 1330337887.87945
    ,
      y: 24
      d: [[23, 61, "."]]
      x: 63
      t: 1330337888.07522
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 11, 10], ["cp", 8, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 70, "remote sessions, or multi-user sessions.^C       "], [23, 22, 61, ["a", " "]]]
      x: 23
      t: 1330337888.49178
    ,
      y: 24
      d: [[23, 22, "e"]]
      x: 24
      t: 1330337889.28746
    ,
      y: 24
      d: [[23, 23, "n"]]
      x: 25
      t: 1330337889.37554
    ,
      y: 24
      d: [[23, 24, "j"]]
      x: 26
      t: 1330337889.57947
    ,
      y: 24
      d: [[23, 25, "o"]]
      x: 27
      t: 1330337889.65939
    ,
      y: 24
      d: [[23, 26, "y"]]
      x: 28
      t: 1330337889.89156
    ,
      y: 24
      d: [[23, 27, "!"]]
      x: 29
      t: 1330337890.33956
    ,
      y: 24
      d: [["cp", 1, 0], ["cp", 2, 1], ["cp", 3, 2], ["cp", 4, 3], ["cp", 5, 4], ["cp", 6, 5], ["cp", 7, 6], ["cp", 8, 7], ["cp", 9, 8], ["cp", 10, 9], ["cp", 7, 10], ["cp", 12, 11], ["cp", 13, 12], ["cp", 14, 13], ["cp", 15, 14], ["cp", 16, 15], ["cp", 17, 16], ["cp", 18, 17], ["cp", 19, 18], ["cp", 20, 19], ["cp", 21, 20], ["cp", 22, 21], [22, 22, 63, "enjoy!^C                                  "], [23, 22, 27, ["a", " "]]]
      x: 23
      t: 1330337890.95571
    ,
      y: 24
      d: [[23, 22, "e"]]
      x: 24
      t: 1330337891.22336
    ,
      y: 24
      d: [[23, 23, "x"]]
      x: 25
      t: 1330337891.56334
    ,
      y: 24
      d: [[23, 24, "i"]]
      x: 26
      t: 1330337891.71932
    ,
      y: 24
      d: [[23, 25, "t"]]
      x: 27
      t: 1330337891.84352
    ,
      y: 24
      d: [["cp", 2, 0], ["cp", 3, 1], ["cp", 4, 2], ["cp", 5, 3], ["cp", 6, 4], ["cp", 7, 5], ["cp", 8, 6], ["cp", 9, 7], ["cp", 5, 8], ["cp", 11, 9], ["cp", 12, 10], ["cp", 13, 11], ["cp", 14, 12], ["cp", 15, 13], ["cp", 16, 14], ["cp", 17, 15], ["cp", 18, 16], ["cp", 19, 17], ["cp", 20, 18], ["cp", 21, 19], ["cp", 22, 20], ["cp", 23, 21], [22, 0, 29, "exit                          "], ["cp", 5, 23]]
      x: 1
      t: 1330337892.0692
    ]
  )
  
  # eval( {$data} ),
  datafile: false
  
  # styles: ".playterm { overflow:hidden; font-size:12px;font-family:monospace,Courier New; line-height:15px; background-color:#000000; border:1px solid #555; padding:10px 10px 10px 10px;border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; -moz-box-shadow: 5px 6px 21px #DDD; -webkit-box-shadow: 5px 6px 21px #DDD; box-shadow: 5px 6px 21px #DDD; -ms-filter: \"progid:DXImageTransform.Microsoft.Shadow(Strength=21, Direction=110, Color='#DDDDDD')\"; filter: progid:DXImageTransform.Microsoft.Shadow(Strength=21, Direction=110, Color='#DDDDDD'); }.playterm pre {font-family:monospace,Courier New,Courier,Arial; }.playterm_button {position:absolute;cursor:pointer;overflow:hidden}.playterm_transport{height:27px; overflow:hidden; position:absolute;}.playterm_skin{height:27px}.playterm_transportbar{background-color:#ff5a4b;height:20px;width:0px; position:absolute;margin:382px 10px 0px 10px }.playterm_embed{font-family:Verdana,Arial; font-size:10px; position:absolute; width:482px; height:68px; text-align:center; color:#555}.playterm_more{height:18px;line-height:0px;padding:0;position:absolute;text-indent:15px;width:99px;cursor:pointer}.playterm_more a:link, .playterm_more a:visited, .playterm a:hover, .playterm a:active {text-decoration:none;line-height:8px;font-family:Verdana,Arial; font-size:10px; color:#ff5a4b;font-weight:bold;margin:0;padding:0}.playterm_embed:hover{color:#FFF} .pluginbutton { width:49px; height:41px; padding:16px; text-align:center; background-color:#444;font-family:Verdana,Arial; color:#777; font-size:12px;line-height:19px; font-weight:bold; float:right; position:absolute} .pluginbutton:hover{ background-color:#666; color:#FFF; } .playtermcurved { border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; }",
  styles: ""
  
  #********* global conf
  parent: false
  uid: false
  args:
    playtermpath: false
    embed: false
    file: false
    size: "80x24"

  
  #********* states
  buttons: 0 # number of buttons
  loaded: false
  state:
    playing: false
    pause: false

  idUpdate: -1
  
  #********** etc
  # div element containing jsttyplay
  terminal: false
  sizes:
    "80x24":
      
      # width: "560px",
      height: "430px"

    
    # marginTop: "0px",
    # // marginTop: "430px",dd
    # playbutton: "84px 10px 10px 170px",
    # moreMargin: "438px 0px 0px 0px",
    # embedMargin: "319px 0px 0px 45px",
    # buttonMargin: "10px 0px 0px 200px",
    # transport: { width: "582px", 
    # skin: "url({$playtermpath}/gfx/playterm.skin.gif) no-repeat"
    # },
    # transportbar: { range: [105,566], 
    # width: 460,
    # margin: "430px 0px 0px 10px",
    # start: 109 }
    "120x35":
      width: "851px"
      height: "589px"
      marginTop: "599px"
      playbutton: "177px 10px 10px 326px"
      embedMargin: "434px 0px 0px 190px"
      moreMargin: "607px 0px 0px 0px"
      transport:
        width: "873px"
        skin: "url({$playtermpath}/gfx/playterm.skin-120.gif) no-repeat"

      transportbar:
        range: [105, 761]
        margin: "603px 0px 0px 10px"
        width: 740
        start: 109

  
  #********** onliner shortcuts for getElementById() and pseudo smarty template engine
  $: (id) ->
    el = document.getElementById(id)
    tags = ["div", "img", "span", "form", "b", "a", "i", "u", "td", "table"]
    if el and el.id isnt id and el.name is id
      for i of tags
        els = document.getElementsByTagName(tags[i])
        for j of els
          return els[j]  if els[j].id is id
    el

  tplVars: {}
  smartyAssign: (varname, value) ->
    @tplVars[varname] = value

  smartyFetch: (content) ->
    for key of @tplVars
      reg = new RegExp("\\{\\$" + key + "\\}", "g")
      content = content.replace(reg, @tplVars[key])
    reg = new RegExp("\\{\\$[A-Za-z0-9_-]*\\}", "g")
    content = content.replace(reg, "")
    content

  init: (id) ->
    
    # var parent         = this.getParentDOMId();
    parent = document.getElementById(id)
    @uid = (new Date()).getTime()
    
    # mark scripttag as inited 
    return  unless _assert(parent isnt `undefined`, "parent is null")
    return  unless _assert(@getArguments(parent), "something is wrong with the class-attribute which prevents further loading")
    return  unless _assert(parent.parentNode isnt `undefined`, "PLAYTERM PLAYER could not be initialized", true)
    
    # we are ready to go, set extra mark in classname to prevent double scan on uninitialized script-tags by getParentDOMId()
    parent.className = "inited_" + parent.className
    
    # draw the player canvas 
    return  unless _assert(String(parent.parentNode.tagName).toLowerCase() is "div", "javascript is not embedded in div", true)
    @initLayout parent.parentNode
    console.log "just initialized"

  getArguments: (parent) ->
    
    # set default playtermpath
    @args.playtermpath = document.location.href.substr(0, document.location.href.lastIndexOf("/")) + "/"
    
    # lets set static playtermpath if we are not local
    @args.playtermpath = (if window.baseurl isnt `undefined` then baseurl + "/lib/playterm/js" else "http://www.playterm.org/lib/playterm/js")  if String(parent.id).match("playterm-")?
    parent.className = parent.className.replace(/^\s+/, "").replace(/\s+$/, "") # poor man's trim() function
    args = parent.className.split(" ")
    i = 0

    while i < args.length
      keyvalue = args[i].split(":")
      unless _assert(keyvalue.length is 2, "key/value pair not correctly formatted in class-attribute 'key:value key:value'")
        @args.playtermpath = "http://www.playterm.org/lib/playterm/js"
        @args.size = "80x24"
      __trace keyvalue
      switch keyvalue[0]
        
        # set path to playterm-source
        when "playtermpath"
          @args.playtermpath = @args.playtermpath + keyvalue[1]
        when "file"
          @args.file = keyvalue[1]
        when "embed"
          @args.embed = (keyvalue[1] isnt "false")
        when "size"
          @args.size = keyvalue[1]  if _assert(keyvalue[1] is "80x24" or keyvalue[1] is "120x35", "size-value can only by 80x24 or 120x35")
      i++
    @smartyAssign "playtermpath", @args.playtermpath
    _trace @args
    true

  initLayout: (parent) ->
    return  unless _assert(parent, "initLayout got no parent")
    playterm_player.parent = parent
    css = document.createElement("style")
    terminal = @terminal = document.createElement("div")
    playbutton = document.createElement("img")
    skin = document.createElement("div")
    transport = document.createElement("div")
    more = document.createElement("div")
    embed = document.createElement("div")
    moreLink = document.createElement("a")
    moreText = document.createTextNode("more!  |  ")
    liveLink = document.createElement("a")
    liveText = document.createTextNode("live!")
    transportbar = document.createElement("div")
    cleardiv = document.createElement("div")
    IE6 = navigator.userAgent.toLowerCase().indexOf("msie 6") isnt -1
    
    # webservice feature: if not processed by smarty, set playtermpatha
    @styles = @smartyFetch(@styles)
    _trace @sizes
    cleardiv.style.clear = "both"
    cleardiv.style.marginBottom = "28px"
    css.setAttribute "type", "text/css"
    if css.styleSheet # IE
      css.styleSheet.cssText = @styles
    # WORLD
    else
      css.appendChild document.createTextNode(@styles)
    playbutton_img = "/img/512Px-478.png"
    
    # webservice feature: if not processed by smarty, set playtermpath
    # playbutton_img = this.smartyFetch( playbutton_img );
    
    # playbutton.src           = playbutton_img;
    # playbutton.className     = "playterm_button";
    # playbutton.id            = "playterm_button_player_"+this.uid;
    # playbutton.onclick       = this.togglePlay;
    transport.className = "playterm_transport"
    transport.id = "playterm_transport_player_" + @uid
    transportbar.className = "playterm_transportbar"
    transportbar.id = "playterm_transportbar_player_" + @uid
    if @args.embed
      moreLink.appendChild moreText
      liveLink.appendChild liveText
      more.className = "playterm_more"
      moreLink.setAttribute "href", "http://www.playterm.org"
      moreLink.setAttribute "target", "_blank"
      liveLink.setAttribute "href", "http://www.playterm.org/live"
      liveLink.setAttribute "target", "_blank"
      more.appendChild moreLink
      more.appendChild liveLink
      embed.className = "playterm_embed"
      embed.id = "playterm-embed-" + @uid
      
      # do not change line below, or it will break the online search/replace engine
      embed.innerHTML = "<b>EMBED:</b> " + @hex2str("0a266c743b6469762667743b266c743b7363726970742069643d2671756f743b706c61797465726d2d4d6a41784d6930774d6939345a4756696457643064486c795a574d744d544d7a4d444d7a4e7a6b344e4877344d4867794e413d3d2671756f743b20747970653d2671756f743b746578742f6a6176617363726970742671756f743b207372633d2671756f743b687474703a2f2f706c61797465726d2e6f72672f6a732f3f686173683d4d6a41784d6930774d6939345a4756696457643064486c795a574d744d544d7a4d444d7a4e7a6b344e4877344d4867794e413d3d2671756f743b20636c6173733d2671756f743b73697a653a38307832342671756f743b2667743b266c743b2f7363726970742667743b266c743b2f6469762667743b0a")
    skin.className = "playterm_skin"
    skin.id = "playterm_skin_player"
    transport.appendChild skin
    transport.onclick = @onScrub
    terminal.className = "playterm"
    
    # set sizespecific properties
    profile = @args.size
    
    # skin.style.background     = this.smartyFetch( this.sizes[ profile ].transport.skin );
    terminal.style.width = @sizes[profile].width
    terminal.style.height = @sizes[profile].height
    
    # if( this.args.embed ){
    #   embed.style.margin        = this.sizes[ profile ].embedMargin;
    #   more.style.margin         = this.sizes[ profile ].moreMargin;
    # }
    #if( navigator.userAgent.toLowerCase().indexOf('msie') != -1 ){
    #  terminal.style.width      = ( parseInt( String(terminal.style.width).replace('px') ) + 22 ) +"px"
    #  terminal.style.height      = ( parseInt( String(terminal.style.height).replace('px') ) + 20 ) +"px"
    #}
    # transport.style.width     = this.sizes[ profile ].transport.width;
    # transport.style.marginTop = this.sizes[ profile ].marginTop;
    # transportbar.style.margin = this.sizes[ profile ].transportbar.margin;
    # playbutton.style.margin   = this.sizes[ profile ].playbutton;
    terminal.id = "playterm-instance-" + @uid
    terminal.onmousedown = false
    
    # terminal.onmouseover = this.showTransport;
    # parent.appendChild( transportbar );
    # parent.appendChild( transport );
    # parent.appendChild( more );
    # parent.appendChild( playbutton );
    # if( this.args.embed ) parent.appendChild( embed );
    parent.appendChild css
    parent.appendChild terminal
    parent.appendChild cleardiv

  getParentDOMId: ->
    scripts = document.getElementsByTagName("script")
    for i of scripts
      matchId = (String(scripts[i].id).match("playterm-")?)
      matchFile = (String(scripts[i].className).match("file:")?)
      inited = (String(scripts[i].className).match("inited")?)
      return scripts[i]  if (matchId or matchFile) and not inited

  showTransport: ->
    me = playterm_player
    me.$("playterm_transport_player_" + me.uid).style.display = "block"
    me.$("playterm_transportbar_player_" + me.uid).style.display = "block"

  togglePlay: (e) ->
    __trace "togglePlay()"
    me = playterm_player
    rightclick = undefined
    unless me.state.playing
      return  unless _assert(me.args.file or me.data, "no data")
      tty = window["showtty_" + me.terminal.id]
      player_reached_end = (tty and tty.timeline.length is tty.nextframe)
      if player_reached_end
        __trace "player reached end, resetting"
        tty.instance.resetTTY tty
      
      # load or continue recording
      if not me.state.pause and not player_reached_end
        me.loadRecording()
      else
        tty.instance.play tty
      
      # handle states and hide/show button
      # me.$( 'playterm_button_player_'+me.uid ).style.display = "none";
      # if( me.args.embed ) me.$( 'playterm-embed-'+me.uid ).style.display = "none";
      me.idUpdate = setInterval(me.update, 300)
      me.state.playing = true
      me.state.pause = false
      me.terminal.onmousedown = me.togglePlay
    else
      me.reset true
      me.terminal.onmousedown = false
    
    # handle if rightclick
    me.onRightClick e

  loadRecording: ->
    __trace "loadRecording()"
    
    # determine whether to load external recording or integrated recording 
    me = playterm_player
    onLoadedTTYURL = (e) ->
      playterm_player.onLoaded e, true

    onLoadedTTY = (e) ->
      playterm_player.onLoaded e

    return showTTYURL(me.$("playterm-instance-" + me.uid), me.args.file, onLoadedTTYURL)  if me.args.file and not me.loaded
    showTTY me.$("playterm-instance-" + me.uid), me.data, onLoadedTTY  if me.data

  onRightClick: (e) ->
    e = window.event  unless e
    if e
      rightclick = false
      if e.which
        rightclick = (e.which is 3)
      else rightclick = (e.button is 2)  if e.button
      alert "PLAYTERM.ORG\n===========\n\nServing the community to share knowledge\n\n( powered by jsttyplay )\n( http://encryptio.com/code/jsttyplay )"  if rightclick

  hex2str: (h) ->
    r = ""
    i = (if (h.substr(0, 2) is "0x") then 2 else 0)

    while i < h.length
      r += String.fromCharCode(parseInt(h.substr(i, 2), 16))
      i += 2
    r

  update: ->
    me = playterm_player
    tty = window["showtty_" + me.terminal.id]
    return  unless _assert(tty, "no tty")
    
    # move transport bar
    # var o = (me.sizes[ me.args.size ].transportbar.width / tty.timeline.length) * tty.nextframe;
    # me.$( "playterm_transportbar_player_"+me.uid ).style.width = me.sizes[ me.args.size ].transportbar.start + o +"px";
    me.reset()  if tty.timeline.length is tty.nextframe

  
  # __trace("update() "+ tty.nextframe );
  addButton: (html, callback) ->

  
  # create buttondiv
  # var me = playterm_player;
  # var div        = document.createElement("div"); 
  # var playerid   = "playterm-instance-"+window.playterm_player.uid;
  # div.className  = "ptbutton playtermcurved";
  # div.innerHTML  = "raw text";
  # div.onclick    = callback;
  #       var profile               = me.args.size;
  # //          div.style.margin    = me.sizes[ profile ].buttonMargin;
  #             //div.style.marginTop =  (me.buttons*85) + "px";
  #             // add to buttoncontainer   
  #             me.parent.appendChild(div);
  #             me.buttons++;
  #         },
  reset: (pause) ->
    __trace "reset()"
    me = playterm_player
    tty = window["showtty_" + me.terminal.id]
    tty.instance.stop tty
    return  unless _assert(tty, "no tty")
    
    # me.$( 'playterm_button_player_'+me.uid ).style.display = "block";
    # if( me.args.embed ) me.$( 'playterm-embed-'+me.uid ).style.display = "block";
    me.state.playing = false
    me.state.pause = pause
    clearInterval me.idUpdate

  onScrub: (e) ->
    _trace "scrub disabled"

  
  #if( !playterm_player.state.playing || !tty ) return _trace("not playing..no tty..no scrub..returning");
  #var tty = window[ "showtty_"+ playterm_player.terminal.id ];
  #if( !_assert( e.target, "no target with mouseevent") ) return;
  #if( !tty ) return _trace("no tty no scrub..returning");
  #var offset    = e.offsetX;
  #var range     = playterm_player.sizes[ playterm_player.args.size ].transportbar.range[ "80x24" ];
  #var roffset   = offset - range[0];
  #roffset       = roffset > range[1] ? range[1] : roffset;
  #var maxoffset = range[1]-range[0];
  #var frames    = tty.timeline.length-1;
  #var frame     = parseInt( (frames/maxoffset) * roffset );
  #playterm_player.reset(true);
  #tty.instance.scrubTTY( frame, tty );
  #_trace( "offset = "+offset+" frames = "+frames+" roffset = "+roffset+" new frame:"+frame); 
  onLoaded: (succes, autoplay) ->
    __trace "onLoaded()"
    me = playterm_player
    if succes
      me.loaded = true
      me.togglePlay()  if autoplay
    else
      _trace "could not load recording..please come back later. Sorry!", true

window.playterm_player = playterm_player
