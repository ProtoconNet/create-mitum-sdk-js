import bs58 from "bs58";

import { Operation } from "mitum-sdk";

import { __OP__Item, __OP__Fact } from "./operation";
import { TEST_GENESIS } from "../mitum.config";

describe("test: __OPS__", () => {
	// test with mitum m1 keys
	it("case: m1", () => {
		const items = [new __OP__Item()];
		const fact = new __OP__Fact(
			"/token/",
			TEST_GENESIS.m1.address,
			items
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});

	// test with mitum m2 keys
	it("case: m2", () => {
		const items = [new __OP__Item()];
		const fact = new __OP__Fact(
			"/token/",
			TEST_GENESIS.m2.address,
			items
		);
		const operation = new Operation(fact, "", []);
		operation.sign(TEST_GENESIS.m2.private);

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});
});
