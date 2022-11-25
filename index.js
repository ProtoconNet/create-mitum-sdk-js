#!/usr/bin/env node

import clc from "cli-color";

import fs, { ensureDirSync } from "fs-extra";
import rl from "readline-sync";
import replace from "replace";

import { execSync } from "child_process";

execSync(`pwd > pwd.tmp`);
const __dirname = fs.readFileSync("./pwd.tmp").toString("utf-8").trim();
const pn = __dirname.split("/");
execSync(`rm ./pwd.tmp`);

const pkg = {
	name: pn[pn.length - 1],
	version: "1.0.0",
	description: "",
	main: "index.js",
	type: "module",
	scripts: {
		test: "jest",
	},
	keywords: [],
	author: "",
	license: "",
	dependencies: {
		jest: "^29.0.3",
		bs58: "^5.0.0",
		"mitum-sdk": "^0.0.1",
	},
	devDependencies: {
		"@babel/core": "^7.19.1",
		"@babel/plugin-transform-modules-commonjs": "^7.18.6",
		"@babel/plugin-transform-runtime": "^7.19.1",
		"@babel/preset-env": "^7.19.1",
	},
};

let model = "currency";
let operations = [];

const printLoadBar = (percentage) => {
	process.stdout.write(
		clc.yellowBright(
			`(${percentage} / 100) ${"/".repeat(parseInt(percentage / 5))}\r`
		)
	);

	if (percentage === 100) {
		console.log("\n");
	}
};

const run = async () => {
	// print title
	console.log(
		clc.whiteBright("\nHello, world~ This is create-mitum-sdkjs! '◡'\n")
	);
	console.log(
		clc.whiteBright(
			"A new mitum sdk will be created in " +
				clc.underline.cyan(__dirname) +
				".\n"
		)
	);

	// get package info
	inputPackage();

	// creating package.json
	createPackageJson();

	createBabel();
	createMitumConfig();
	createAlias();
	createError();
	createOperations();
	createIndexJs();
	createReadme();

	printLoadBar(100);

	console.log(clc.whiteBright("It's done! (￣^￣)ゞ"));
};

const inputPackage = () => {
	const print = (nm, v) =>
		clc.whiteBright(`${nm}: `) +
		(v ? clc.italic.white(`(${v})`) + " " : "");

	console.log(clc.blueBright("::package info"));
	pkg.name = rl.question(print("package name", pkg.name)) || pkg.name;
	pkg.version = rl.question(print("version", pkg.version)) || pkg.version;
	pkg.description = rl.question(print("description", ""));
	pkg.license = rl.question(print("license", ""));
	pkg.keywords = rl
		.question(print("keywords", ""))
		.split(",")
		.filter((kw) => kw)
		.map((kw) => kw.trim());
	pkg.author = rl.question(print("author", ""));

	console.log(clc.blueBright("\n\n::model info"));
	model = rl.question(print("model name", model)) || model;
	model = model
		.trim()
		.toLowerCase()
		.replace(model.includes("-") ? /-/gi : /\s/gi, " ");
	operations = rl
		.question(print("operations", ""))
		.split(",")
		.filter((op) => op)
		.map((op) => {
			op = op.trim();
			op = op.toLowerCase();
			op = op.replace(op.includes("-") ? /-/gi : /\s/gi, " ");
			return op;
		});
};

const createPackageJson = () => {
	console.log(clc.whiteBright("\nConfiguring package.json...\n"));

	console.log(clc.blueBright("::package.json"));
	console.log(clc.whiteBright(JSON.stringify(pkg, null, 4)) + "\n");

	console.log(clc.blueBright("::model"));
	console.log(clc.whiteBright(model) + "\n");

	console.log(clc.blueBright("::operations"));
	console.log(clc.whiteBright(operations.join(", ")) + "\n");

	const done = rl.question(
		clc.whiteBright("<(^_^<) Shall we move on? ") +
			clc.italic.white("(yes/enter or ^C/no) ")
	);
	if (!done || done === "yes") {
		drawLoad();
	} else {
		clc.whiteBright("\nSee you later! (￣▽￣)/");
		process.exit(0);
	}

	fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(pkg, null, 4));

	console.log();
	printLoadBar(5);
};

const drawLoad = () => {
	const boxes = ["◰", "◳", "◲", "◱"];
	const box = (i) => clc.greenBright(boxes[i]);
	console.log(clc.whiteBright("\nI'm creating a package for you...\n\n\n"));
	console.log(
		clc.whiteBright(
			`                                _ ${box(3)} - __    |||`
		)
	);
	console.log(
		clc.whiteBright(
			`                              _          ${box(0)}  |||`
		)
	);
	console.log(
		clc.whiteBright(
			`... ${clc.cyan("~(ノ・・)ノ")} ${box(0)}    ${box(1)}    ${box(
				2
			)} __ ◬        ▉▉▉ |||\n\n\n`
		)
	);
};

const createBabel = () => {
	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/babel.config.cjs ${__dirname}/`
	);
	printLoadBar(10);
};

const createMitumConfig = () => {
	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/mitum.config.js ${__dirname}/`
	);
	printLoadBar(15);
};

const createAlias = () => {
	ensureDirSync(`${__dirname}/alias`);

	let alias = "";
	operations.forEach((op) => {
		const b = opBigKey(op);
		const m = opModelSmallKey();
		const s = opSmallKey(op);
		alias += `export const HINT_${b}_ITEM = "${m}-${s}-item"\n`;
		alias += `export const HINT_${b}_OPERATION_FACT = "${m}-${s}-operation-fact"\n`;
		alias += `export const HINT_${b}_OPERATION = "${m}-${s}-operation"\n\n`;
	});

	fs.writeFileSync(`${__dirname}/alias/operations.js`, alias);

	printLoadBar(20);
};

const opKey = (op) =>
	op
		.toLowerCase()
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
const opBigKey = (op) => `${op.toUpperCase().replace(/\s/gi, "_")}`;
const opSmallKey = (op) => `${op.toLowerCase().replace(/\s/gi, "-")}`;
const opModelKey = () =>
	model
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
const opModelSmallKey = () => `mitum-${model}`;

const createError = () => {
	ensureDirSync(`${__dirname}/base`);
	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/base/error.js ${__dirname}/base/`
	);
	printLoadBar(25);
};

const createOperations = () => {
	ensureDirSync(`${__dirname}/operations`);
	const modelPath = [`${__dirname}/operations/item.js`];

	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/operations/item.js ${__dirname}/operations/`
	);

	operations.forEach((op) => {
		const o = opKey(op);
		const b = opBigKey(op);
		const s = opSmallKey(op);

		execSync(
			`cp $(npm root -g)/create-mitum-sdkjs/copies/operations/operation.js ${__dirname}/operations/${s}.js`
		);
		execSync(
			`cp $(npm root -g)/create-mitum-sdkjs/copies/operations/operation.test.js ${__dirname}/operations/${s}.test.js`
		);

		replace({
			regex: "__OP__",
			replacement: o,
			paths: [
				`${__dirname}/operations/${s}.js`,
				`${__dirname}/operations/${s}.test.js`,
			],
			recursive: true,
			silent: true,
		});

		replace({
			regex: "__OPB__",
			replacement: b,
			paths: [`${__dirname}/operations/${s}.js`],
			recursive: true,
			silent: true,
		});

		replace({
			regex: "__OPS__",
			replacement: s,
			paths: [`${__dirname}/operations/${s}.test.js`],
			recursive: true,
			silent: true,
		});

		modelPath.push(`${__dirname}/operations/${s}.js`);
	});

	const m = opModelKey();
	replace({
		regex: "__MODEL__",
		replacement: m,
		paths: modelPath,
		recursive: true,
		silent: true,
	});

	printLoadBar(50);
};

const createIndexJs = () => {
	let imports = "";
	let classes = "{\n";

	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/index.js ${__dirname}/`
	);

	operations.map((op) => {
		const k = opKey(op);
		const s = opSmallKey(op);
		imports += `import { ${k}Item, ${k}Fact } from "./operations/${s}.js"\n`;
		classes += `\t${k}Item,\n\t${k}Fact,\n`;
	});
	classes += "};";

	replace({
		regex: "__IMPORT_OP__",
		replacement: imports,
		paths: [`${__dirname}/index.js`],
		recursive: true,
		silent: true,
	});

	replace({
		regex: "__MODEL__",
		replacement: opModelKey(),
		paths: [`${__dirname}/index.js`],
		recursive: true,
		silent: true,
	});

	replace({
		regex: "__IMPORT_OP__",
		replacement: imports,
		paths: [`${__dirname}/index.js`],
		recursive: true,
		silent: true,
	});

	replace({
		regex: "__OP_CLASSES__",
		replacement: classes,
		paths: [`${__dirname}/index.js`],
		recursive: true,
		silent: true,
	});

	printLoadBar(75);
};

const createReadme = () => {
	execSync(
		`cp $(npm root -g)/create-mitum-sdkjs/copies/README.md ${__dirname}/`
	);

    replace({
        regex: "__PACKAGE_NAME__",
		replacement: pkg.name,
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
    })

	replace({
		regex: "__MODEL__",
		replacement: opModelKey(),
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});

	replace({
		regex: "__MODELS__",
		replacement: opModelSmallKey(),
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});

	execSync(`node --version > ${__dirname}/node-v.tmp`);
	execSync(`npm --version > ${__dirname}/npm-v.tmp`);

	const nodeV = fs.readFileSync(`${__dirname}/node-v.tmp`).toString("utf-8").trim();
	const npmV = fs.readFileSync(`${__dirname}/npm-v.tmp`).toString("utf-8").trim();
	replace({
		regex: "__NODE_VERSION__",
		replacement: nodeV,
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});
	replace({
		regex: "__NPM_VERSION__",
		replacement: npmV,
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});
	execSync(`rm ${__dirname}/node-v.tmp`);
	execSync(`rm ${__dirname}/npm-v.tmp`);

	let indices = "\n";
	operations.forEach((op) => {
		const s = opSmallKey(op);
		indices += `|-|[${s}](#${s})|\n`;
	});
	replace({
		regex: "__OP_INDICES__",
		replacement: indices,
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});

	let readmes = "\n";
	operations.forEach((op) => {
		const k = opKey(op);
		const s = opSmallKey(op);
		const m = opModelKey();
		const ms = opModelSmallKey();

		readmes += `# ${s}\n\n`;
		readmes += `__${s}__ is an operation to ....\n\n`;
		readmes += `\`\`\`js\n`;
		readmes += `import { TimeStamp, ${m}, Operation } from "${ms}-sdk";\n\n`;
		readmes += `const token = new TimeStamp().UTC(); // any unique string\n`;
		readmes += `const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";\n`;
		readmes += `const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";\n\n`;
		readmes += `const item = new ${m}.${k}Item();\n`;
		readmes += `const fact = new ${m}.${k}Fact(token, senderAddress, [item]);\n\n`;
		readmes += `const memo = ""; // any string\n`;
		readmes += `const operation = new Operation(fact, memo, []);\n`;
		readmes += `operation.sign(senderPrivate);\n`;
		readmes += `\`\`\`\n\n`;
	});
	replace({
		regex: "__OP_READMES__",
		replacement: readmes,
		paths: [`${__dirname}/README.md`],
		recursive: true,
		silent: true,
	});

	printLoadBar(80);
};

run();
