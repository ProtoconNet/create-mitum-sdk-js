import bs58 from "bs58";

import { Operation } from "mitum-sdk";

import { __OP__Item, __OP__Fact } from "./operation";
import { TEST_GENESIS } from "../mitum.config";

describe("test: __OPS__", () => {
	// test with mitum ecdsa keys
	it("case: ecdsa", () => {
		const items = [new __OP__Item()];
		const fact = new __OP__Fact(
			"/token/",
			TEST_GENESIS.ecdsa.address,
			items
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.ecdsa.private);

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});

	// test with mitum schnorr keys
	it("case: schnorr", () => {
		const items = [new __OP__Item()];
		const fact = new __OP__Fact(
			"/token/",
			TEST_GENESIS.schnorr.address,
			items
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.schnorr.private);

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});
});
