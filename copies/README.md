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
|3|[Generate Currency Operations](#generate-currency-operations)|
|4|[Generate __MODEL__ Operations](#generate-__MODELSN-operations)|__OP_INDICES__
|+|[Appendix](#appendix)|
|+|[License])(#license)|

To set the mitum version of all hints and the network id, refer to [Set version of hints](#set-version-of-hints) and [Set network id of operations](#set-network-id-of-operations).

In addition, you can force the sdk to use extended msgs (which used in mitum2) to sign by set `forceExtendedMessage(true)`. See [Force to use extended messages](#force-to-use-extended-messages)

## Generate KeyPairs

____PACKAGE_NAME____ supports two signature methods:

- General ECDSA: v1
- Schnorr DSA: v2

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* private key: [key]mpr
* public key: [key]mpu 

The following functions are prepared for key pair generation.

```js
import { KPGen } from "__PACKAGE_NAME__";

// ecdsa key pair
var ekp1 = KPGen.random();
var ekp2 = KPGen.randomN(/* the number of keypairs */);
var ekp3 = KPGen.fromPrivateKey(/* string private key */);
var ekp4 = KPGen.fromSeed(/* string seed */);

// schnorr key pair
const { schnorr } = KPGen;
var skp1 = schnorr.random();
var skp2 = schnorr.randomN(/* the number of keypairs */);
var skp3 = schnorr.fromPrivateKey(/* string private key */);
var skp4 = schnorr.fromSeed(/* string seed */);
```

_If you need a key pair for schnorr signatures, use `KPGen.schnorr.(function)` instead of `KPGen.(function)`._

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

See [mitum-sdkjs](https://github.com/ProtoconNet/mitum-sdkjs).

## Generate __MODEL__ Operations
__OP_READMES__
## Appendix

### Set version of hints

To change the mitum version of every objects, add the following code to the part where the app is initialized.

The default version is `v0.0.1`.

```js
import { useV } from "__PACKAGE_NAME__";

useV("v0.0.2");
```

### Set network id of operations

To apply your network id to operations, add the following code to the part where the app is initialized.

The default id is `mitum`.

```js
import { usedId } from "__PACKAGE_NAME__";

useId("mainnet");
```

### Force to use extended messages

You can force the sdk to use extended msgs (which used in mitum2) for each signature.

```js
import { forceExtendedMessage } from "__PACKAGE_NAME__";

forceExtendedMessage(true);
```

### Options and other methods for __Operation__

* If you want to include the `signed_at` of the new `factsign` in the message to be signed, set it as follows before signing.

```js
const operation = new Operation(/* fact, etc... */);
operation.forceExtendedMessage = true
operation.sign(/* sender's private key */)
```

* Send the operation directly to the network via Digest API.

```js
operation.request(/* digest api address */, /* headers */); // `headers` can be null or undefined
```

* You can export operation json to a file.

```js
operation.export(/* file path */);
```

### About timestamp

__(1) Expression of timestamp__

For blocks, seals, signatures, etc., mitum uses expressions `yyyy-MM-dd HH:mm:ss.* +0000 UTC` and `yyyy-MM-ddTHH:mm:ss.*Z` as the default.

All other timezones are not allowed! Only +0000 timezone must be used for mitum.

For example,

a. When converting timestamps to byte format to generate block/seal/fact_sign hash
    - convert string `2021-11-16 01:53:30.518 +0000 UTC` to byte format

b. When are placed in block, seal, fact_sign of json files
    - convert the timestamp to `2021-11-16T01:53:30.518Z` and put it in json

To generate an operation hash, mitum concatenates byte arrays of network id, fact hash and each byte array of fact_sign.

And to generate each byte array of fact_sign, mitum concatenates byte arrays of signer, signature digest and signed_at.

Note that when converted to bytes, the format of `signed_at` is the same as `yyyy-MM-dd HH:mm:ss.* +0000 UTC`, but when put into json, it is displayed as `yyyy-MM-ddTHH:mm:ss.*Z`.

__(2) How many decimal places to be expressed?__

There is one more thing to note.

First, there is no need to pay attention to the decimal places in the 'ss.*' part of the timestamp.

Moreover, the timestamp can also be written without `.` or without decimal values below `.`.

However, when converting timestamps to byte format, you should not add unnecessary zero(0) to floating point representations in seconds(ss.*).

For example,

a. `2021-11-16T01:53:30.518Z` is converted to `2021-11-16 01:53:30.518 +0000 UTC` without any change of the time itself.

b. `2021-11-16T01:53:30.510Z` must be converted to `2021-11-16 01:53:30.51 +0000 UTC` when generating a hash.

c. `2021-11-16T01:53:30.000Z` must be converted to `2021-11-16T01:53:30 +0000 UTC` when generating a hash.

A timestamp with unnecessary zeros in the json file does not affect the processing of blocks, seals, or operations. Use caution when converting formats.

In addition, no matter how precise the time is entered, all timestamps within the mitum code only support precision up to milliseconds when converting to buffer.

For example, if you enter `2022-11-24T05:34:25.194332Z` in `signed_at`, the string `2022-11-24 05:34:25.194 +0000 UTC` is converted to a byte array to create a buffer of the fact signature.

## License