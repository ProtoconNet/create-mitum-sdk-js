import { OperationFact, err } from "mitum-sdk";

import { __MODEL__Item } from "./item.js";

import {
	HINT___OPB___ITEM,
	HINT___OPB___OPERATION,
	HINT___OPB___OPERATION_FACT,
} from "../alias/operations.js";

import { EC_INVALID_ITEM } from "../base/error.js";

const { assert } = err;

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

    toString() {
        return "" + this.val;
    }
}

export class __OP__Fact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT___OPB___OPERATION_FACT, token, sender, token);

		items.forEach((item) =>
			assert(
				item instanceof __OP__Item,
				err.instance(EC_INVALID_ITEM, `not __OP__Item instance`)
			)
		);
	}

	get opHint() {
		return HINT___OPB___OPERATION;
	}
}
