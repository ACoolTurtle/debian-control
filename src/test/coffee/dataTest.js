/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// dataTest.coffee
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

const EXTENDED_TIMEOUT = 10000;

const {exec} = require("child_process");
const fs = require("fs");
const {Readable} = require("stream");
const should = require("should");

const {ParagraphStream} = require("../lib/paragraphStream");
const {parse, stringify} = require("../lib/control");

const execAsync = command => new Promise((resolve, reject) => exec(command, function(err, stdout, stderr) {
    if (err != null) { return reject(err); }
    return resolve({stdout, stderr});
}));

xdescribe("data", function() {
    it("should unpack the data properly", function() {
        this.timeout(EXTENDED_TIMEOUT);
        await(execAsync("mkdir -p test/data"));
        await(execAsync("xz --decompress --to-stdout src/test/data/Packages.xz >test/data/Packages"));
        await(execAsync("xz --decompress --to-stdout src/test/data/Sources.xz >test/data/Sources"));
        return true;
    });

    it("should have 56805 paragraphs in Packages", function() {
        this.timeout(EXTENDED_TIMEOUT);
        return new Promise(function(resolve, reject) {
            let numPackages = 0;
            const packages = fs.createReadStream("test/data/Packages");
            const ps = new ParagraphStream();
            ps.on("data", para => numPackages++);
            ps.on("end", function() {
                if (numPackages === 56805) { return resolve(true); }
                return reject(new Error(`found ${numPackages} packages`));
            });
            return packages.pipe(ps);
        });
    });

    it("should have 28497 paragraphs in Sources", function() {
        this.timeout(EXTENDED_TIMEOUT);
        return new Promise(function(resolve, reject) {
            let numPackages = 0;
            const packages = fs.createReadStream("test/data/Sources");
            const ps = new ParagraphStream();
            ps.on("data", para => numPackages++);
            ps.on("end", function() {
                if (numPackages === 28497) { return resolve(true); }
                return reject(new Error(`found ${numPackages} packages`));
            });
            return packages.pipe(ps);
        });
    });

    it("should round trip the paragraphs in Packages", function() {
        this.timeout(EXTENDED_TIMEOUT);
        return new Promise(function(resolve, reject) {
            const numPackages = 0;
            const packages = fs.createReadStream("test/data/Packages");
            const ps = new ParagraphStream();
            ps.on("data", function(para) {
                para = para.toString().trim();
                const obj = parse(para);
                const control = stringify(obj);
                return control.should.eql(para);
            });
            ps.on("end", () => resolve(true));
            return packages.pipe(ps);
        });
    });

    return it("should round trip the paragraphs in Sources", function() {
        this.timeout(EXTENDED_TIMEOUT);
        return new Promise(function(resolve, reject) {
            const numPackages = 0;
            const packages = fs.createReadStream("test/data/Sources");
            const ps = new ParagraphStream();
            ps.on("data", function(para) {
                let x;
                para = para.toString().trim();
                let lines = para.split("\n");
                lines = ((() => {
                    const result = [];
                    for (x of Array.from(lines)) {                         result.push(x.trimRight());
                    }
                    return result;
                })());
                lines = ((() => {
                    const result1 = [];
                    for (x of Array.from(lines)) {                         result1.push(x.replace(/^\s+/, " "));
                    }
                    return result1;
                })());
                para = lines.join("\n");
                const obj = parse(para);
                const control = stringify(obj);
                return control.should.eql(para);
            });
            ps.on("end", () => resolve(true));
            return packages.pipe(ps);
        });
    });
});

//----------------------------------------------------------------------
// end of dataTest.coffee
