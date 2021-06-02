/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// indexTest.coffee
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

const should = require("should");
const mut = require("../lib/index");

const CONTROL_FUNCTIONS = [ "isContinueLine", "isFieldLine", "parse", "stringify", "stripSignature" ];

describe("index", function() {
    it("should supply the LineStream class", function() {
        mut.LineStream.should.be.ok();
        return mut.LineStream.should.be.a.Function();
    });

    it("should supply the ParagraphStream class", function() {
        mut.ParagraphStream.should.be.ok();
        return mut.ParagraphStream.should.be.a.Function();
    });

    it("should supply a VERSION constant", () => mut.VERSION.should.equal("1.0.0"));

    return it("should supply some control parsing functions", function() {
        mut.should.have.properties(CONTROL_FUNCTIONS);
        return Array.from(CONTROL_FUNCTIONS).map((func) =>
            mut[func].should.be.a.Function());
    });
});

//----------------------------------------------------------------------
// end of indexTest.coffee
