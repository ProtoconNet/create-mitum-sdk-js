import bs58 from "bs58";

import { Fact } from "mitum-sdk";

import {
	HINT___OPB___OPERATION,
	HINT___OPB___OPERATION_FACT,
} from "../alias/operations.js";

export class __OP__Fact extends Fact {
	constructor(token) {
		super(HINT___OPB___OPERATION_FACT, token);
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([this.token.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
		};
	}

	get opHint() {
		return HINT___OPB___OPERATION;
	}
}
