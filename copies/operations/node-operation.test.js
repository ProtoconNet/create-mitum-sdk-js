import bs58 from "bs58";

import { Operation } from "mitum-sdk";

import { __OP__Fact } from "./__OPS__";
import { TEST_NODE } from "../mitum.config";

describe("test: __OPS__", () => {
	// test with mitum m1 keys
	it("case: m1", () => {
		const fact = new __OP__Fact("/token/");
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});

	// test with mitum m2 keys
	it("case: m2", () => {
		const fact = new __OP__Fact("/token/");
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m2, { node: "node address" });

		expect(bs58.encode(fact.hash)).toBe("/fact hash/");
	});
});
