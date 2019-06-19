![logo](https://raw.githubusercontent.com/bitsent/BitBtn/master/logo-text-transperant.png)

# BitBtn

An UI Button for interacting with **Bitcoin SV** wallets (written in pure JS - no dependencies)

License: **OPEN ONLY-BSV-SPECIFIC LICENSE**

# Importing

Get a released version from NPM : [![NPM version](https://badge.fury.io/js/bitbtn.svg)](https://npmjs.org/package/bitbtn)

Just import the minified version of the code in your website.

Everything is contained in 1 file (smaller than 50KB)

```html
    <script src="bitbtn.min.js"></script>
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

# How it works

- The button triggers a **BIP21 URI deep link**.
- It asks the OS of the user to open a program that knows how to open such URIs.
- If the user has a compatible Bitcoin SV wallet, he can make the payment.
- If the user has no Bitcoin wallet, he will be shown a modal window with alternatives.
- The alternatives include a list of reccomended wallets to download (for the OS of the user).
- If the user is on a desktop machine, a QR code is shown to scan with a mobile device.

# Known Issues

- Not tested on all browsers.
- Not tested on all devices.
- Recognising if the deep link succeeded or failed can be hard on iOS.
    - Testing & workaround is needed.
- While using BIP21, the button CAN NOT check if the payments were successful (due to race conditions).
    - Please perform such **checks in your own code** (by generating a separate bitcoin address for each user).
    - This is a temporary problem, and will be resolved when the **Output URI BIP** gets fully implemented.
