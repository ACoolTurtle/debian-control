/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// paragraphStreamTest.coffee
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

const fs = require("fs");
const should = require("should");

const mut = require("../lib/paragraphStream");

const PACKAGES_PARAGRAPHS = [ "bzflag-server", "bzip2", "bzip2-doc", "libbz2-1.0", "libbz2-dev", "bzr" ];
const SOURCES_PARAGRAPHS = [ "bzflag", "bzip2", "bzip2", "bzr" ];

describe("paragraphStream", function() {
    it("should supply a ParagraphStream class", function() {
        mut.ParagraphStream.should.be.ok();
        return mut.ParagraphStream.should.be.a.Function();
    });

    it("should break things down paragraph by paragraph", () => new Promise(function(resolve, reject) {
        const PACKAGES = PACKAGES_PARAGRAPHS.slice(0).reverse();
        const packages = fs.createReadStream("src/test/data/Packages-excerpt");
        const pps = new mut.ParagraphStream();
        pps.on("data", function(para) {
            para = para.toString();
            const name = PACKAGES.pop();
            if (para.indexOf(`Package: ${name}`) < 0) {
                return reject(new Error(`Unable to find - Package: ${name}`));
            }
        });
        pps.on("end", function() {
            if (PACKAGES.length === 0) { return resolve(true); }
        });
        return packages.pipe(pps);
    }));

    it("should break things down paragraph by paragraph again", () => new Promise(function(resolve, reject) {
        const SOURCES = SOURCES_PARAGRAPHS.slice(0).reverse();
        const sources = fs.createReadStream("src/test/data/Sources-excerpt");
        const sps = new mut.ParagraphStream();
        sps.on("data", function(para) {
            para = para.toString();
            const name = SOURCES.pop();
            if (para.indexOf(`Package: ${name}`) < 0) {
                return reject(new Error(`Unable to find - Package: ${name}`));
            }
        });
        sps.on("end", function() {
            if (SOURCES.length === 0) { return resolve(true); }
        });
        return sources.pipe(sps);
    }));

    return it("should not send empty paragraphs", () => new Promise(function(resolve, reject) {
        let numPackages = PACKAGES_PARAGRAPHS.length;
        const packages = fs.createReadStream("src/test/data/Packages-excerpt-extra-lines");
        const pps = new mut.ParagraphStream();
        pps.on("data", function(para) {
            numPackages--;
            if (numPackages < 0) { return reject(new Error("numPackages went negative")); }
        });
        pps.on("end", function() {
            if (numPackages === 0) { return resolve(true); }
        });
        return packages.pipe(pps);
    }));
});

//----------------------------------------------------------------------
// end of paragraphStreamTest.coffee
