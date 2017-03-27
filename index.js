#!/usr/bin/env node

"use strict";

const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const argv = require('yargs').argv;
const toml = require('toml');
const concat = require('concat-stream');
const opn = require('opn');

if (!argv._[0]) { process.exit(1); }

const configPath = argv._[0];
const configDir = path.dirname(configPath);
const publicDir = path.join(argv.d || configDir, ".typeSXS_public");

fs.createReadStream(configPath, 'utf8').pipe(concat(function (data) {
	const config = toml.parse(data);

	if (!config.typefaces) { throw "[typefaces] not defined." }
	if (!config.articles) { throw "[articles] not defined." }
	if (!config.styles) { throw "[styles] not defined." }
	if (!config.samples) { throw "[samples] not defined." }
	if (!config.features) { throw "[features] not defined." }

	fs.copySync(path.join(__dirname, "public"), publicDir);

	let css = '';
	let json = {
		typefaces: {
			init_l: config.typefaces.init_l,
			init_r: config.typefaces.init_r
		},
		styles: {},
		articles: []
	};
	let fontid = 0
	for (let familyID in config.typefaces) {
		const family = config.typefaces[familyID];
		if (!family.name) continue;

		json.typefaces[familyID] = {
			name: family.name,
			key_l: '' + (family.key_l || ''),
			key_r: '' + (family.key_r || ''),
			supports: {},
		};

		for (let styleID in family) {
			const style = family[styleID];
			const weight = (config.styles[styleID] || {}).weight || 400;
			const fontStyle = (config.styles[styleID] || {}).style || "normal";

			if (style.local) {
				css += `@font-face {
					font-family : "${family.name}";
					font-weight : ${weight};
					font-style : ${fontStyle};
					src: local(${style.local});
				}`
				json.typefaces[familyID].supports[styleID] = true;
				fontid += 1;
				console.log("Registered font", family.name, weight, fontStyle);
				continue;
			} else if (style.src) {
				const fromPath = path.resolve(configDir, style.src);
				if (!fs.existsSync(fromPath)) continue;

				json.typefaces[familyID].supports[styleID] = true;
				const toPath = path.join(publicDir, "test-fonts", fontid + path.extname(style.src));
				const url = path.join("test-fonts", fontid + path.extname(style.src)).replace(/\\/g, '/');

				fs.copySync(fromPath, toPath);
				console.log("Copied font", fromPath, "->", toPath);


				const format = /\.woff2$/.test(style.src) ? 'woff2'
					: /\.woff$/.test(style.src) ? 'woff'
						: /\.otf$/.test(style.src) ? 'opentype'
							: /\.ttf$/.test(style.src) ? 'truetype'
								: 'unknown';

				css += `@font-face {
					font-family : "${family.name}";
					font-weight : ${weight};
					font-style : ${fontStyle};
					src: url(${url}) format("${format}");
				}`
				fontid += 1;
				console.log("Registered font", family.name, weight, fontStyle);
			}
		}
		const familySeq = (family.family_prefix || config.typefaces.family_prefix || []).map(x => '"' + x + '"')
			.concat([`"${family.name}"`])
			.concat((family.family_suffix || config.typefaces.family_suffix || []).map(x => '"' + x + '"'))
			.join(', ')
		css += `.${familyID}{ font-family: ${familySeq} }`
		css += `.${familyID} input, .${familyID} textarea { font-family: ${familySeq} }`
	}
	json.styles = config.styles;
	json.samples = config.samples;
	json.features = config.features;

	let articleID = 0;
	for (let article of config.articles) {
		if (!article.src) continue;
		const fromPath = path.resolve(configDir, article.src);
		if (!fs.existsSync(fromPath)) continue;

		const toPath = path.join(publicDir, 'articles', articleID + '.md');
		const url = path.join('articles', articleID + '.md').replace(/\\/g, '/');

		fs.copySync(fromPath, toPath);
		console.log("Copied article", fromPath, "->", toPath);
		json.articles.push({
			title: article.title,
			src: url
		});
		articleID += 1;
	}
	fs.writeFileSync(path.join(publicDir, 'fonts.css'), css);
	fs.writeFileSync(path.join(publicDir, 'config.json'), JSON.stringify(json));

	startServer();
}));

// Server
function startServer() {
	const serve = serveStatic(publicDir, { 'index': ['index.html', 'index.htm'] })
	const server = http.createServer(function onRequest(req, res) {
		serve(req, res, finalhandler(req, res))
	});
	server.listen(9876);

	openHomepage();
}

function openHomepage() {
	opn('http://localhost:9876/index.html');
}