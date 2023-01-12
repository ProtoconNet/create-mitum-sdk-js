# __PACKAGE_NAME__

____PACKAGE_NAME____ is Javascript SDK that helps create operations for __MODELS__ model.

You can create operations of the following models with this SDK:

* Mitum Currency
* Mitum Currency Extension
* Mitum __MODEL__

## Installation

This project has been developed in the following environments:

```sh
$ node --version
__NODE_VERSION__

$ npm --version
__NPM_VERSION__
```

You can install this package locally using this command:

```sh
$ npm i
```

You can install ____PACKAGE_NAME____ using this command:

```sh
$ npm i __MODELS__-sdk
```

## Test

Before testing, check `TEST_ID`, `TEST_NODE`, `TEST_GENESIS`, and `TEST_ACCOUNT` in [mitum.config.js](mitum.config.js).

You can test ____PACKAGE_NAME____ using this command:

```sh
$ npm test
```

## Index

||Title|
|---|---|
|1|[Generate KeyPairs](#generate-keypairs)|
|-|[Random KeyPair](#random-keypair)|
|-|[From private key](#from-private-key)|
|-|[From seed](#from-seed)|
|2|[Get address from public keys](#get-address-from-public-keys)|
|3|[Generate currency operations](#generate-currency-operations)|
|4|[Generate __MODEL_S__ operations](#generate-__MODEL_S__-operations)|
__OP_INDICES__
|5|[Generate seal](#generate-seal)|
|+|[Appendix](#appendix)|
|+|[License])(#license)|

To set the mitum version of all hints and the network id, refer to [Set version of hints](#set-version-of-hints) and [Set network id of operations](#set-network-id-of-operations).

To force certain signature types to be used for each operation, refer to [Force certain signature types](#force-certain-signature-types).

## Generate KeyPairs

____PACKAGE_NAME____ supports two signature methods:

- mitum1: v1
- mitum2: v2

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* private key: [key]mpr
* public key: [key]mpu 

The following functions are prepared for key pair generation.

```js
import { KPGen } from "__PACKAGE_NAME__";

// m1 key pair
var ekp1 = KPGen.random();
var ekp2 = KPGen.randomN(/* the number of keypairs */);
var ekp3 = KPGen.fromPrivateKey(/* string private key */);
var ekp4 = KPGen.fromSeed(/* string seed */);

// m2 key pair
const { m2 } = KPGen;
var skp1 = m2.random();
var skp2 = m2.randomN(/* the number of keypairs */);
var skp3 = m2.fromPrivateKey(/* string private key */);
var skp4 = m2.fromSeed(/* string seed */);
```

_If you need a key pair for m2 signatures, use `KPGen.m2.(function)` instead of `KPGen.(function)`._

### Random KeyPair

#### Get a random KeyPair

```js
import { KPGen } from "__PACKAGE_NAME__";

const keypair = KPGen.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr
const pubStr = pub.toString(); // 22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu
```

#### Get N random KeyPairs with an address

```js
import { KPGen } from "__PACKAGE_NAME__";

const n = 5

// keys: Keys[Keys] instance; with 5 MKey(pub, weight) and threshold
// keypairs: Array; 5 KeyPair(priv, pub)
const { keys, keypairs } = KPGen.randomN(5);

const address = keys.address // Address instance
```

### From private key

```js
import { KPGen } from "__PACKAGE_NAME__";

const keypair = KPGen.fromPrivateKey("KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr
const pubStr = pub.toString(); // r3W57ffVSjnyMFQ6132ZoPj1jnbFhoSFCnDYYRq2tXQVmpu
```

### From seed

The seed string length must be at least __36__.

```js
import { KPGen } from "__PACKAGE_NAME__";

const keypair = KPGen.fromSeed("Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // L1BpsqZVzgMhkVCCvR1pyFLHNxBPYi5758uFzPdeLpjejfLxzd7Xmpr
const pubStr = pub.toString(); // j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu
```

## Get address from public keys

Each general account in __Mitum Currency__ consists of the following elements:

* public keys
* weights: each weight is paired with a public key
* threshold
* address

The address is calculated based on the account's `public key`s, `weight`s, and `threshold`.

In the case of a __multi-sig__ account, the sum of the weights of all public keys that signed the operation must be greater than or equal to the threshold. Otherwise, the operation will not be processed.

Each weight and threshold range is __0 < weight, threshold <= 100__.
An account can have up to __10 public keys__.

* mitum general address: [address]mca 

To obtain an address from public keys, you must use the following classes:

```js
import { PubKey, Keys } from "__PACKAGE_NAME__";

var pub = new PubKey(/* public key; string */, /* weight; number */);
var keys = new Keys(/* pub keys; PubKey Array */, /* threshold; number */);
var address = keys.address.toString();
```

Let's do the following as an example.

* 5 public keys
* each weight: 20
* threshold: 60

Since __20 * 3 = 60__, you must sign the operation with at least __three keys__ when using this account to transfer the operation.

```js
import { PubKey, Keys } from "__PACKAGE_NAME__";

const pubs = [
  	{
    	weight: 20,
		key: "23RWZ9McmTt5EpPYdLBeGYDn7nwyEB6qiPdU8DMjZ3dnkmpu",
	},
	{
		weight: 20,
		key: "vcsQ2fYSU5YVW5zRtpACXSLHtppkjCUo3tJ5witmAyZPmpu",
	},
	{
		weight: 20,
		key: "23jEC2vNwdfJn7PAKcFjy5CTVmELWdiAm6ZENEMr62cnsmpu",
	},
	{
		weight: 20,
		key: "282UNbzEAZQf3GdWJRPUrSaHWF88u297WTQbxfkytpcTsmpu",
	},
	{
	  	weight: 20,
		key: "bkPHGdsHSzRGe3NZ2hkzTSPyJx42BRaXetzy1bgBmbaAmpu",
	},
]¸
const threshold = 60;

const mpubs = pubs.map(pub => new PubKey(pub.key, pub.weight));
const mkeys = new Keys(mpubs, threshold); // Keys[Keys] instance

const address = mkeys.address // Address instance;
const stringAddress = address.toString(); // string address
```

## Generate Currency Operations

See [mitum-sdk-js](https://github.com/ProtoconNet/mitum-sdk-js).

## Generate __MODEL__ Operations

____MODEL____ can handle a total of __COUNT__ operations.

__OPERATIONS__

See [Appendix](#appendix) for other instructions on how to use `Operation`.

__OP_READMES__

## Generate Seal

__seal__ is not used in mitum2. Therefore, only operations with __sig-type: DEFAULT or M1__ can be added to seal.

Here's how to create a seal:

```js
import { Seal } from "mitum-sdk";

const nodePrivateKey = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const seal = new Seal([operation0, operation1, operation2, ...]); // Operation instances or json objects
seal.sign(nodePrivateKey);

// seal.dict(); seal object
```

## Appendix

### Set version of hints

To change the mitum version of every objects, add the following code to the part where the app is initialized or required.

The default version is `v0.0.1`.

```js
import { useV } from "mitum-sdk";

useV("v0.0.2");
```

### Set network id of operations

To apply your network id to operations, add the following code to the part where the app is initialized or required.

The default id is `mitum`.

```js
import { useId } from "mitum-sdk";

useId("mainnet");
```

### Force certain signature types

To force certain signature types to be used, add the following code to the part where the app is initialized or required.

```js
import { SIG_TYPE, useSigType } from "mitum-sdk";

useSigType(SIG_TYPE.DEFAULT);
useSigType(SIG_TYPE.M1); // equal to SIG_TYPE.DEFAULT
useSigType(SIG_TYPE.M2); // signature used in mitum2
useSigType(SIG_TYPE.M2_NODE);
```

In addition, you can force certain signature types to be used for each operation.

```js
import { SIG_TYPE } from "mitum-sdk";

const op = new Operation(fact, memo);

op.sigType = SIG_TYPE.DEFAULT // or SIG_TYPE.M1
op.sigType = SIG_TYPE.M2;
op.sigType = SIG_TYPE.M2_NODE;// node signature used in mitum2
```

### Options and other methods for __Operation__

If __sig-type__ is one of __[DEFAULT, M1, M2]__, you don't need to include the option for the code `sign(priv, option)`.
Just leave it `null`.

However, if __sig-type__ is __M2_NODE__, you must include the option `{ node: "node address; string" }`.

```js
const operation = new Operation(/* fact, etc... */);

operation.sign(/* sender's private key */, /* sig option */); // DEFAULT, M1, M2
operation.sign(/* sender's private key */, { node: "node addres" }); // M2_NODE
```

* Set fact-signs without signing

Make sure to set `sig-type` before setting the fact-signs.

```js
operaiton.sigType = SIG_TYPE.DEFAULT; // [ DEFAULT | M1 | M2 | M2_NODE ]
operation.setFactSigns(/* FactSign instances */);
```

`FactSign` can be created by...

```js
import { FactSign } from "mitum-sdk";

const factSign = new FactSign(/* node address */, /* signer */, /* signature; buffer */, /* signed_at */);
```

* Send the operation directly to the network via Digest API.

```js
operation.request(/* digest api address */, /* headers */); // `headers` can be null or undefined
```

* You can export operation json to a file.

```js
operation.export(/* file path */);
```

The `request` and `export` methods are also available in __Seal__ instance.