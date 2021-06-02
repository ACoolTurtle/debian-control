/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// paragraphStream.coffee
// Copyright 2019 Patrick Meade.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//----------------------------------------------------------------------

import { Transform } from "stream"

const LINE_START = "LINE_START"
const LINE_MIDDLE = "LINE_MIDDLE"

export default class ParagraphStream extends Transform {
  linebuffer: string
  parabuffer: string[]
  state: string
  constructor(options: any) {
    super(options || {})
    this.linebuffer = ""
    this.parabuffer = []
    this.state = LINE_START
  }

  _transform(
    chunk: { toString: () => any },
    encoding: any,
    callback: () => any
  ) {
    const chunkstr = chunk.toString()
    for (let c of Array.from(chunkstr)) {
      if (this.state === LINE_START) {
        if (c === "\n") {
          if (this.parabuffer.length > 0) {
            this.push(this.parabuffer.join(""))
            this.parabuffer = []
          }
        } else {
          this.state = LINE_MIDDLE
          this.linebuffer += c
        }
      } else {
        this.linebuffer += c
        if (c === "\n") {
          this.parabuffer.push(this.linebuffer)
          this.linebuffer = ""
          this.state = LINE_START
        }
      }
    }
    return callback()
  }

  _flush(callback: () => any) {
    if (this.linebuffer.length > 0) {
      this.parabuffer.push(this.linebuffer)
    }
    if (this.parabuffer.length > 0) {
      this.push(this.parabuffer.join(""))
    }
    return callback()
  }
}

//----------------------------------------------------------------------
// end of paragraphStream.coffee
