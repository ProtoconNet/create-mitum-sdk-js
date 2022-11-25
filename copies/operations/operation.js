import bs58 from "bs58";

import { Fact, Address, util, err } from "mitum-sdk";

import { __MODEL__Item } from "./item.js";

import { MAX_ITEMS_IN_FACT } from "../mitum.config.js";
import {
	HINT___OPB___ITEM,
	HINT___OPB___OPERATION,
	HINT___OPB___OPERATION_FACT,
} from "../alias/operations.js";

import { EC_INVALID_ITEM, EC_INVALID_ITEMS } from "../base/error.js";

const { error, assert } = err;

export class __OP__Item extends __MODEL__Item {
	constructor(val) {
		super(HINT___OPB___ITEM);
		this.val = val;
	}

	bytes() {
		return Buffer.concat([this.val.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			val: this.val.dict(),
		};
	}
}

export class __OP__Fact extends Fact {
	constructor(token, sender, items) {
		super(HINT___OPB___OPERATION_FACT, token);
		this.sender = new Address(sender);

		assert(Array.isArray(items), error.type(EC_INVALID_ITEM, "not Array"));

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(EC_INVALID_ITEMS, "array size out of range")
		);

		items.forEach((item) =>
			assert(
				item instanceof __OP__Item,
				error.instance(EC_INVALID_ITEM, `not __OP__Item instance`)
			)
		);

		this.items = items;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			Buffer.concat(
				this.items.sort(util.sortBuf).map((item) => item.bytes())
			),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}

	get opHint() {
		return HINT___OPB___OPERATION;
	}
}
