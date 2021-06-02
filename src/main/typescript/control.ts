/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// control.coffee
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

const FIELD_LINE_SPEC = /^([^\s:]+):(.*)$/

export const isContinueLine = (text: string) =>
  text[0] === " " || text[0] === "\t"

export const isFieldLine = (text: string) => FIELD_LINE_SPEC.test(text)

export const parse = (text: string) => {
  text = stripSignature(text)
  text = text.trim()
  const lines = text.split("\n")
  const controlObj: { [x: string]: any } = {}
  let build: { [x: string]: any } = {}

  for (let line of lines) {
    if (isFieldLine(line)) {
      if (build.field != null) {
        controlObj[build["field"]] = build["value"]
        build = {}
      }
      const field = parseFieldLine(line)
      build["field"] = field ? field[1].trim() : null
      build["value"] = field ? field[2].trimLeft() : null
    }
    if (isContinueLine(line)) {
      if (!Array.isArray(build["value"])) {
        build["value"] = [build["value"]]
      }
      build["value"].push(line.trim())
    }
  }
  controlObj[build["field"]] = build["value"]
  return controlObj
}

export const parseFieldLine = (text: string) => FIELD_LINE_SPEC.exec(text)

export const stringify = (obj: { [x: string]: any }) => {
  const buffer = []
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      const firstValue = obj[key].shift()
      if (firstValue.trim().length > 0) {
        buffer.push(`${key}: ${firstValue}`)
      } else {
        buffer.push(`${key}:`)
      }
      for (let line of Array.from(obj[key])) {
        buffer.push(` ${line}`)
      }
    } else {
      buffer.push(`${key}: ${obj[key]}`)
    }
  }

  return buffer.join("\n")
}

export const stripSignature = (text: string) => {
  // check the message for PGP signature
  const trimmed = text.trim()
  const lines = trimmed.split("\n")
  if (lines[0] !== "-----BEGIN PGP SIGNED MESSAGE-----") {
    return text
  }
  // looks like we got one, so strip off the signature lines
  let state = "HEADER"
  const message = []
  for (let line of Array.from(lines)) {
    if (state === "HEADER") {
      if (line.trim().length === 0) {
        state = "MESSAGE"
      }
    } else {
      if (line.trim() === "-----BEGIN PGP SIGNATURE-----") {
        break
      } else {
        if (line.trim().length > 0) {
          message.push(line)
        }
      }
    }
  }
  // return the message part
  return message.join("\n")
}

//----------------------------------------------------------------------
// end of control.coffee
