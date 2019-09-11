![logo](https://raw.githubusercontent.com/bitsent/BitBtn/master/logo-text-transperant.png)

# BitBtn

An UI Button for interacting with **Bitcoin SV** wallets (written in pure JS - no dependencies)

License: **OPEN ONLY-BSV-SPECIFIC LICENSE**

The button has two modes of work:

Bitcoin Request URI ([bip275 link](https://github.com/moneybutton/bips/blob/master/bip-0275.mediawiki))
and BIP21 ([bip21 link](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki))

Request URI is the default.

# Demonstration

> // TODO: Insert demonstration video

# Importing

Get a released version from NPM : [![NPM version](https://badge.fury.io/js/bitbtn.svg)](https://npmjs.org/package/bitbtn)

Just import the minified version of the code in your website.

Everything is contained in 1 file (smaller than 50KB)

```html
<script src="bitbtn.min.js"></script>
```

Alternatively you can import from **jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/bitbtn@latest/src/bitbtn.js"></script>
```

# Usage

```js
btn = bitbtn.create(
    document.getElementById("location-for-the-bitcoin-button"),
    {
        label: "Pay!",
        address: "1CiesvEUNg9sVm8ekhMrGyATvEnH5YU9wh",
        amount: 1.247,
        currency: "USD",
        onError: function (error) { console.log(error); },
    });
```

![BTN](https://raw.githubusercontent.com/bitsent/BitBtn/master/btn.PNG)

# Supported Currencies

BitBtn uses CoinGecko for price discovery. It supports many FIAT currencies:

"usd", "aed", "ars", "aud", "bdt", "bhd", "bmd",
"brl", "cad", "chf", "clp", "cny", "czk", "dkk",
"eur", "gbp", "hkd", "huf", "idr", "ils", "inr",
"jpy", "krw", "kwd", "lkr", "mmk", "mxn", "myr",
"nok", "nzd", "php", "pkr", "pln", "rub", "sar",
"sek", "sgd", "thb", "try", "twd", "uah", "vef",
"vnd", "zar", "xdr", "xag", "xau"

And of course "BSV" and "SATS" are supported too.

# Advanced Usage

This example creates a button that pays $1 to an address, pays $0.247 to a script (p2pkh to the same address) and creates an OP_RETURN message.

```js
btn = bitbtn.create(
    document.getElementById("location-for-the-bitcoin-button"),
    {
        label: "Complex Pay!",
        walletMemo: "BitBtn Payment Request"
        outputs: [
            {
                address: "1CiesvEUNg9sVm8ekhMrGyATvEnH5YU9wh",
                amount: 1,
                currency: "USD",
            },
            {
                script: bitbtn.scripter.p2pkh("1CiesvEUNg9sVm8ekhMrGyATvEnH5YU9wh"),
                amount: 0.247,
                currency: "USD"
            },
            {
                script: bitbtn.scripter.op_return(
                    bitbtn.scripter.str2hex([
                        "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
                        "BitBtn is Awesome!"
                    ])),
                amount: 0
            },
        ],
        onError: function (error) { console.log(error); },
    });
```

# BIP21 Usage

The button also supports BIP21 deep links for backwards compatibility. To use a BIP21 button, simply set the 'bip21' property to true.

```js
btn = bitbtn.create(
    document.getElementById("location-for-the-bitcoin-button"),
    {
        label: "Pay!",
        address: "1CiesvEUNg9sVm8ekhMrGyATvEnH5YU9wh",
        amount: 1.247,
        currency: "USD",
        bip21: true,
        onError: function (error) { console.log(error); },
    });
```

# Configuration

## Parameters

| Parameter | Type | Default Value | Description |
|---|---|---|---|
| address | Bitcoin Address |  | A valid Bitcoin Address. |
| script | Hex Output Script |  | A valid Bitcoin Output Script (in hexadecimal form) |
| amount | Decimal Number | 0 | How much of the specified currency to include in the Bitcoin Output |
| currency | String | "BSV" | Which currency should the Bitcoins be denominated in. See the list of supported currencies. |
| bip21 | Boolean | false | If set to true, the  |
| creationTimestamp | Epoch Time | current timestamp | Time of creation of the payment request. (For BIP-275 payments) |
| expirationTimestamp | Epoch Time | 7 days from now | Time of expiration of the payment request. (For BIP-275 payments) |
| label | String | "Send" | The text that will be displayed on the button itself. |
| network | String | "bitcoin" | The network (for BIP-275 payments). It is advisible to leave the default value here. Only change it if you know what you are doing. |
| outputs | Array |  | An array of outputs objects (explained bellow). |
| paymentUrl | URL | https://api.bitsent.net/payments/pay | A url of the recipient of the BIP-270 payment. |
| onError | Callback | empty callback | This method will be called if something goes wrong. |
| **Debug** |
| debug | Boolean | false | A setting used when debugging the button. |
| **Not Implemented** |
| paymail | Paymail Address |  | A valid paymail address. **(Not supported yet...)** |
| onPayment | Callback | empty callback | This method will be called after a successful payment is verified **(Not supported yet...)** |
| successMessage | String | "Done!" | Once a payment is successfully verified, this string will be displayed on the button, instead of the label. **(Not supported yet...)** |


## Output Objects

An output object in the 'outputs' array can have these properties: address, script, paymail, amount, currency

Their types, default values and descriptions were already explained above.

## Restrictions

- If the property "outputs" is set, the properties address, script, paymail, amount and currency must be null. If the property "outputs" is NOT set, a single output will be generated from the listed properties.

- Both in outputs and in the base parameters it is forbidden to set more than one of address/paymail/script at the same time. A Bitcoin Output can only have ONE destination.

- If multiple outputs are specified, they must have the same currency.

# Customization

You can change how the button looks, by including a CSS file with the right ID.

```html
    <link rel="stylesheet" href="custom-bitbtn-style.css" id="bitbtn-css">
```

The BitBtn scripts adds a default style for the buttons if the element with this ID is not present. If it is, BitBtn will not touch the style of the button.
This allows for some pretty cool customization.

> When designing new stylesheets, please make sure that the button remains functional.
Please make sure that the style looks good on all browsers, operating systems and screen sizes.
Keep in mind that devices with the same physical screen size can have vastly different resolutions.

See the customization in action at [The Style Preview Page](https://raw.githack.com/bitsent/BitBtn/master/styles/style_preview.html)

# Testing

BitBtn needs more testing.
There are no automated tests yet.
Manual testing is the main type of testing.

To test manually, please follow [This Link to the Manual Test Page](https://raw.githack.com/bitsent/BitBtn/master/test/manual/manual.html) and follow the instructions.

If you see an error, take a screenshot and include it in a GitHub Issue.
...Or you can just tweet it at me (@bitcoinsofia)

# How it works

- The button triggers a **URI deep link**.
- It asks the OS of the user to open a program that knows how to open such URIs.
- If the user has a compatible Bitcoin SV wallet, he can make the payment.
- If the user has no Bitcoin wallet, he will be shown a modal window with alternatives.
- The alternatives include a list of recommended wallets to download (for the OS of the user).
- If the user is on a desktop machine, a QR code may be shown (to scan with a mobile device).

# Known Issues

- Not tested on all browsers.
- Not tested on all devices.
- Recognising if the deep link succeeded or failed can be hard on iOS.
    - A workaround with a pop-up message is used.
- While using BIP21, the button **CAN NOT** check if the payments were successful (due to race conditions).
    - Please perform such **checks in your own code** (by generating a separate bitcoin address for each user).
    - This problem, can be resolved with the **Request URI BIP**, where control outputs can be added for marking the payment.

# Notes

- The button looks bad on mobile devices if the HTML document doesn't have a meta tag like: ``` <meta name="viewport" content="width=device-width, initial-scale=1"> ```
Make sure to add that tag to your website.
