/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// lineStream.coffee
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

export default class LineStream extends Transform {
  buffer: Buffer
  constructor(options: any) {
    super(options || {})
    this.buffer = Buffer.alloc(0)
  }

  _transform(chunk: Uint8Array, encoding: any, callback: () => any) {
    this.buffer = Buffer.concat([this.buffer, chunk])
    while (true) {
      const nextLineEnding = this.buffer.indexOf("\n")
      if (nextLineEnding >= 0) {
        this.push(this.buffer.slice(0, nextLineEnding + 1))
        this.buffer = this.buffer.slice(nextLineEnding + 1)
      } else {
        break
      }
    }
    return callback()
  }

  _flush(callback: (arg0: null, arg1: Buffer) => any) {
    return callback(null, this.buffer)
  }
}

//----------------------------------------------------------------------
// end of lineStream.coffee
