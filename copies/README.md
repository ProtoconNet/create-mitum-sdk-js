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

Before testing, check `TEST_ID`, `TEST_NODE`, `TEST_GENESIS`, `TEST_ACCOUNT`, and etc in [mitum.config.js](mitum.config.js).

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
|6|[Add sign to operation json](#add-sign-to-operation-json)|
|+|[Appendix](#appendix)|
|+|[License](#license)|

To set the mitum version of all hints and the network id, refer to [Set version of hints](#set-version-of-hints) and [Set network id of operations](#set-network-id-of-operations).

## Generate KeyPairs

____PACKAGE_NAME____ supports two signature methods:

- mitum1: m1 (btc)
- mitum2: m2 (btc, ether)

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* btc private key: [key]mpr
* btc public key: [key]mpu 

* ether private key: [key]epr
* ether public key: [key]epu

The following functions are prepared for key pair generation.

```js
import { KPGen } from "__PACKAGE_NAME__";

// m1 btc key pair
var ekp1 = KPGen.random();
var ekp2 = KPGen.randomN(/* the number of keypairs */);
var ekp3 = KPGen.fromPrivateKey(/* string private key */);
var ekp4 = KPGen.fromSeed(/* string seed */);

// m2 btc key pair
const { m2 } = KPGen;
var skp1 = m2.random();
var skp2 = m2.randomN(/* the number of keypairs */);
var skp3 = m2.fromPrivateKey(/* string private key */);
var skp4 = m2.fromSeed(/* string seed */);

// m2 ether key pair
const { m2ether } = KPGen;
var ukp1 = m2ether.random();
var ukp2 = m2ether.randomN(/* the number of keypairs */);
var ukp3 = m2ether.fromPrivateKey(/* string private key */);
var ukp4 = m2ether.fromSeed(/* string seed */);
```

_If you need a key pair for m2 and m2-ether signatures, use `KPGen.m2.(function)` and `KPGen.m2ether.(function)` instead of `KPGen.(function)`._

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
var address = keys.address.toString(); // btc
var etherAddress = keys.etherAddress.toString(); // ether
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

const address = mkeys.address; // (btc) Address instance
const stringAddress = address.toString(); // btc type string address

const etherAddress = mkeys.etherAddress; // (ether) Address instance
const etherStringAddress = etherAddress.toString(); // ether type string address
```

## Generate Currency Operations

See [mitum-sdk-js](https://github.com/ProtoconNet/mitum-sdk-js).

## Generate __MODEL__ Operations

____MODEL____ can handle a total of __COUNT__ operations.

node operations:

__NODE_OPERATIONS__

general account operations:

__OPERATIONS__

See [Appendix](#appendix) for other instructions on how to use `Operation`.

__NODE_OP_READMES__

__OP_READMES__

## Generate Seal

__seal__ is not used in mitum2. Therefore, only operations with __sig-type: DEFAULT or M1__ can be added to seal.

Here's how to create a seal:

```js
import { Seal } from "__PACKAGE_NAME__";

const nodePrivateKey = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const seal = new Seal([operation0, operation1, operation2, ...]); // Operation instances or json objects
seal.sign(nodePrivateKey);

// seal.dict(); seal object
```

## Add sign to operation json

You can add a new signature to a operation json using __Signer__ class.

```js
import { Signer } from "__PACKAGE_NAME__";

const json = { /* your operation json */ };

const signer = new Signer("KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr");

const general = signer.sign(json); // m1 and m2 general operation
const m2node = signer.M2NodeSign(json, "node address"); // m2 node operation
```

## Appendix

### Is memo essential for operation generation?

For the operation of __mitum1__, the `memo` field is required and is always included in the seed bytes when the operation hash is created.

If there's no `memo` field or the value is `null`, it is considered an empty string.

On the other hand, for operation of __mitum2__, the `memo` field is considered an extra field and a field name other than `memo` is also available.

However, in this case, when you create an operation hash, all extra fields are not included in the seed bytes at all.

In other words, `memo` in __mitum1__ affects the operating hash value, but not at all in __mitum2__.

When you create an operation with __mitum-sdk__, if the `memo` value is empty or if you don't need it at all, you can omit the parameter, and you only need to insert the value if necessary.

For example:

```js
const operation = new Operation(fact); // memo = null || memo = ''
const operation = new Operation(fact, memo); // memo -> not empty
```

### Set version of hints

To change the mitum version of every objects, add the following code to the part where the app is initialized or required.

The default version is `v0.0.1`.

```js
import { useV } from "__PACKAGE_NAME__";

useV("v0.0.2");
```

### Set network id of operations

To apply your network id to operations, add the following code to the part where the app is initialized or required.

The default id is `mitum`.

```js
import { useId } from "__PACKAGE_NAME__";

useId("mainnet");
```

### Options and other methods for __Operation__

If your operation is for mitum1 and accounts of mitum2, you don't need to include the option for the code `sign(priv, option)`.
Just leave it `null`.

However, if the operation is a node operation(not account operation) of mitum2, you must include the option `{ node: "node address; string" }`.

```js
const operation = new Operation(/* fact, etc... */);

/* mitum1(account, node), mitum2(account) */
operation.sign(/* sender's private key */);
operation.sign(/* sender's private key */, null);

/* mitum2(node) */
operation.sign(/* sender's private key */, { node: "node addres" });
```

* Set fact-signs without signing

All fact-signs must have the same instance type(M1FactSign | M2FactSign | M2NodeFactSign).

```js
operation.setFactSigns(/* FactSign instances */);
```

`FactSign` can be created by...

```js
import { FactSign } from "__PACKAGE_NAME__";

const m1fs = new M1FactSign(/* signer */, /* signature; buffer */, /* signed_at */);
const m2fs = new M2FactSign(/* signer */, /* signature; buffer */, /* signed_at */);
const m2nodefs = new M2NodeFactSign(/* node address */, /* signer */, /* signature; buffer */, /* signed_at */);
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

## License

__LICENSE__