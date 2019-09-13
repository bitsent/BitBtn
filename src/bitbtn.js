/*jshint esversion: 6 */
/*
 * ---------------------------------------------------------------------
 *  BitBtn
 *
 *  Copyright 2019 Aleksandar Dinkov
 *
 *  URL: http://www.d-project.com/
 *
 *  Licensed under the OPEN ONLY-BSV-SPECIFIC LICENSE (v0.3.0):
 *    https://github.com/Pipe-Cash/OPEN-BLOCKCHAIN-SPECIFIC-LICENSE/releases/tag/v0.3.0
 *
 * ---------------------------------------------------------------------
 */
bitbtn = (function bitbtn() {
  var SATOSHI_PER_BITCOIN = 100000000;
  var BITSENT_URL = "https://bitsent.net/";
  var BITSENT_RECOMMENDED_WALLETS_URL = "https://bitsent.net/wallets.html";

  function getTimestamp() {
    return (new Date().valueOf() / 1000) | 0;
  }

  var addCSS = (function() {
    var bitBtnStyle =
      ".bitbtn{position:relative;padding:.5em .75em;font-size:1em;line-height:1.5;display:inline-block;cursor:pointer;font-size:15px;font-weight:400;text-align:center;vertical-align:middle;white-space:nowrap;border-radius:1.5em;border:.3em ridge;border-color:#0054ad;background-color:#007bff;color:#fff}.bitbtn span{margin:0 .15em}@-webkit-keyframes bitbtn-spinner{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes bitbtn-spinner{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes bitbtn-border-success{to{border-color:#32cd32}}@keyframes bitbtn-border-success{to{border-color:#32cd32}}@-webkit-keyframes bitbtn-border-error{to{border-color:pink}}@keyframes bitbtn-border-error{to{border-color:pink}}.bitbtn .status-circle{width:.8em;height:.8em;display:inline-block;vertical-align:text-bottom;border:.2em solid transparent;border-color:transparent;background-color:#fff;border-radius:50%;-webkit-animation:none;animation:none}.bitbtn .status-circle.loading{border:.2em solid currentColor;border-right-color:transparent;background-color:transparent;border-radius:50%;-webkit-animation:bitbtn-spinner .75s linear infinite;animation:bitbtn-spinner .75s linear infinite}.bitbtn .status-circle.success{border-color:transparent;background-color:#a3fc1e}.bitbtn .status-circle.error{border-color:transparent;background-color:#fb91a3}.bitbtn .bitbtn-amount{font-size:1em;display:inline-block;background:#ffffff50;border-radius:10%;padding:0 3px}.bitbtn .bitbtn-not-work{background:#ddd;text-align:center;color:#000;display:none;position:absolute;left:0;top:3em;padding:10px;width:100%}.bitbtn .bitbtn-not-work.show{display:block}.bitbtn .small-text,.bitbtn-modal-container .small-text{font-size:.8em}.bitbtn-modal-container{background-color:#000;background-color:rgba(0,0,0,.4);position:fixed;left:0;top:0;width:100%;height:100%;display:none;z-index:2147483647;padding-top:100px;overflow:auto}.bitbtn-modal-container .modal-content{background-color:#fefefe;margin:auto;border:1px solid #888;width:500px;height:700px;max-width:70%;max-height:70vh;overflow-y:scroll;overflow-x:hidden}.bitbtn-modal-container .modal-header{display:block;background-color:#e6e6e6;position:sticky;top:0}.bitbtn-modal-container .modal-header button{padding:10px;background-color:#d1d1d1;border:0 none;margin:none}.bitbtn-modal-container .modal-header:hover button:hover{background-color:#b9b9b9}.bitbtn-modal-container .modal-header button.selected{background-color:#b9b9b9}.bitbtn-modal-container .modal-content .modal-body{padding:20px}.bitbtn-modal-container .close{color:#aaa;float:right;font-size:28px;font-weight:700}.bitbtn-modal-container .close:focus,.bitbtn-modal-container .close:hover{color:#000;text-decoration:none;cursor:pointer}.bitbtn-modal-container .wallet-list{list-style:none;display:flex;flex-wrap:wrap}.bitbtn-modal-container .wallet-list .wallet-item{display:inline-block;border:3px ridge #000;padding:1em 2em;margin:3px;text-align:center}.bitbtn-modal-container .wallet-list .wallet-item:hover{background:-moz-linear-gradient(-45deg,rgba(150,200,200,0) 0,rgba(150,200,200,1) 65%,rgba(150,200,200,0) 67%,rgba(150,200,200,0) 100%);background:-webkit-linear-gradient(-45deg,rgba(150,200,200,0) 0,rgba(150,200,200,1) 65%,rgba(150,200,200,0) 67%,rgba(150,200,200,0) 100%);background:linear-gradient(135deg,rgba(150,200,200,0) 0,rgba(150,200,200,1) 65%,rgba(150,200,200,0) 67%,rgba(150,200,200,0) 100%)}.bitbtn-modal-container .wallet-list .wallet-item img{height:3em}";

    var cssId = "bitbtn-css";

    function addCSS_asLink() {
      if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.media = "all";
        link.href = "btnStyle.css";

        head.appendChild(link);
      }
    }

    function addCSS_fromVariable() {
      if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.id = cssId;
        style.innerHTML = bitBtnStyle;
        head.appendChild(style);
      }
    }

    return function addCSS(debug) {
      if (debug) addCSS_asLink();
      else addCSS_fromVariable();
    };
  })();

  var getPrice = (function() {
    var coinGeckoSupportedFiats = [
      "usd",
      "aed",
      "ars",
      "aud",
      "bdt",
      "bhd",
      "bmd",
      "brl",
      "cad",
      "chf",
      "clp",
      "cny",
      "czk",
      "dkk",
      "eur",
      "gbp",
      "hkd",
      "huf",
      "idr",
      "ils",
      "inr",
      "jpy",
      "krw",
      "kwd",
      "lkr",
      "mmk",
      "mxn",
      "myr",
      "nok",
      "nzd",
      "php",
      "pkr",
      "pln",
      "rub",
      "sar",
      "sek",
      "sgd",
      "thb",
      "try",
      "twd",
      "uah",
      "vef",
      "vnd",
      "zar",
      "xdr",
      "xag",
      "xau"
    ];

    var coinGecko_BSV_id = "bitcoin-cash-sv";

    var coinGeckoAPI_priceURL =
      "https://api.coingecko.com/api/v3/simple/price" +
      "?ids=" +
      coinGecko_BSV_id +
      "&vs_currencies=" +
      encodeURIComponent(coinGeckoSupportedFiats.join(","));

    function saveToLocalStorage(str, name) {
      if (typeof Storage === "undefined") return;

      localStorage.setItem(name, str);
      localStorage.setItem(name + "_timestamp", getTimestamp());
    }

    function getFromLocalStorage(name, dataAgeThresholdSeconds) {
      if (typeof Storage === "undefined") return null;

      var _prevData = localStorage.getItem(name);
      var _prevDataTimestamp = localStorage.getItem(name + "_timestamp");

      if (!_prevData || !_prevDataTimestamp) return null;

      var now = getTimestamp();
      if (now - dataAgeThresholdSeconds > _prevDataTimestamp) return null; // data is too old

      if (now < _prevDataTimestamp) return null; // data is invalid

      return JSON.parse(_prevData);
    }

    function getCoingeckoPrices() {
      var prices = getFromLocalStorage("coinGeckoPrices", 60 * 10); // 10 minute sthreshold
      if (prices) return prices;

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", coinGeckoAPI_priceURL, false);
      xmlHttp.send(null);

      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var pricesString = xmlHttp.responseText;
        saveToLocalStorage(pricesString, "coinGeckoPrices");
        prices = JSON.parse(pricesString);
        return prices;
      } else throw new Error(xmlHttp.statusText);
    }

    function getPrice(currency) {
      currency = currency.toLowerCase().trim();

      if (!coinGeckoSupportedFiats.includes(currency))
        throw new Error("Unknown currency: " + currency);

      var coinGeckoPrices = getCoingeckoPrices();

      if (currency.toLowerCase() == "bsv") {
        return 1.0;
      } else {
        return coinGeckoPrices[coinGecko_BSV_id][currency];
      }
    }

    return getPrice;
  })();

  var browser = (function() {
    var b,
      ua = navigator.userAgent.match(
        /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i
      );
    if (
      navigator.userAgent.match(/Edge/i) ||
      navigator.userAgent.match(/Trident.*rv[ :]*11\./i)
    ) {
      b = "msie";
    } else {
      b = ua[1].toLowerCase();
    }
    return b;
  })();

  var os = (function() {
    /**
     * JavaScript OS Detection
     *
     * Code snippet taken from:
     * JavaScript Client Detection
     * (C) viazenetti GmbH (Christian Ludwig)
     */

    var nAgt = navigator.userAgent;

    var clientStrings = [
      {
        s: "Windows",
        r: /(Windows)/
      },
      {
        s: "Android",
        r: /Android/
      },
      {
        s: "Open BSD",
        r: /OpenBSD/
      },
      {
        s: "Sun OS",
        r: /SunOS/
      },
      {
        s: "Linux",
        r: /(Linux|X11)/
      },
      {
        s: "iOS",
        r: /(iPhone|iPad|iPod)/
      },
      {
        s: "Mac OS X",
        r: /Mac OS X/
      },
      {
        s: "Mac OS",
        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
      },
      {
        s: "QNX",
        r: /QNX/
      },
      {
        s: "UNIX",
        r: /UNIX/
      },
      {
        s: "BeOS",
        r: /BeOS/
      },
      {
        s: "OS/2",
        r: /OS\/2/
      }
    ];

    var os = "Unknown";
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }
    return os;
  })();

  var modalWindow = (function() {
    function createEl(tagName, classList, children, text) {
      var el = document.createElement(tagName);

      for (var i = 0; i < classList.length; i++) {
        var cl = classList[i];
        el.classList.add(cl);
      }

      for (var i = 0; i < children.length; i++) {
        var ch = children[i];
        el.appendChild(ch);
      }

      if (text) {
        var p = document.createElement("div");
        p.innerHTML = text;
        el.append(p);
      }
      return el;
    }

    function initModal() {
      var modalCloseBtn = createEl("span", ["close"], [], "×");
      var modalHeader = createEl("nav", ["modal-header"], []);
      var modalBody = createEl("div", ["modal-body"], []);

      var modal = createEl(
        "div",
        ["bitbtn-modal-container"],
        [
          createEl(
            "div",
            ["modal-content"],
            [modalCloseBtn, modalHeader, modalBody]
          )
        ]
      );

      modal.openTab = function(clickedBtn, tabClassName) {
        var buttons = modal.querySelectorAll(".modal-header button");
        for (var i = 0; i < buttons.length; i++)
          buttons[i].classList.remove("selected");
        clickedBtn.classList.add("selected");

        var tabs = modal.querySelectorAll(".tab");
        var show = modal.querySelector(".tab." + tabClassName);

        for (var i = 0; i < tabs.length; i++) tabs[i].style.display = "none";
        show.style.display = "block";
      };

      modal.clearTabs = function() {
        while (modalHeader.hasChildNodes())
          modalHeader.removeChild(modalHeader.lastChild);
        while (modalBody.hasChildNodes())
          modalBody.removeChild(modalBody.lastChild);
      };

      modal.addTab = function(title, tabClassName, childElements) {
        var navBtn = createEl("button", [], [], title);
        navBtn.onclick = function(e) {
          modal.openTab(navBtn, tabClassName);
        };
        modalHeader.appendChild(navBtn);

        var childrenAndTitle = childElements.slice();
        childrenAndTitle.unshift(createEl("h2", ["tab-title"], [], title));
        var tab = createEl("div", ["tab", tabClassName], childrenAndTitle);
        modalBody.appendChild(tab);
      };

      modal.clickFirstTab = function() {
        var firstTabBtn = modalHeader.querySelectorAll("button")[0];
        firstTabBtn.click();
      };
      modal.clickTab = function(index) {
        var tabBtn = modalHeader.querySelectorAll("button")[index];
        tabBtn.click();
      };

      return modal;
    }

    showModalASAP = (function showModalASAP() {
      function showModal(modal) {
        document.body.appendChild(modal);
        modal.style.display = "block";

        // when to remove
        modalCloseBtn = modal.querySelector(".close");
        modalCloseBtn.onclick = function(e) {
          removeAndShowNext(modal);
        };
        window.addEventListener("click", function(event) {
          if (event.target == modal) removeAndShowNext(modal);
        });
      }

      function removeAndShowNext(modal) {
        try {
          modal.parentNode.removeChild(modal);
        } finally {
          modalsToShow.shift();
          if (modalsToShow.length > 0) showModal(modalsToShow[0]);
        }
      }

      modalsToShow = [];

      function showModalASAP(modal) {
        (function() {
          isModalShown = modalsToShow.length > 0;
          modalsToShow.push(modal);
          if (!isModalShown) showModal(modal);
        })();
      }
      return showModalASAP;
    })();

    var altMessages = {
      bip21:
        "Looks like you don't have a wallet that supports 'BIP21' deep linking.",
      bip275:
        "Looks like you don't have a wallet that supports Bitcoin Request URI (BIP-275) deep linking."
    };

    var altMessage_bitsent =
      "You could add BitSent.NET as a handler for all 'bitcoin:' links. Just click the button bellow.";

    var altMessage_browserProtocolPoorSupport =
      "Keep in mind that this functionality is not supported on all browsers. Support is especially poor on mobile devices. If you are on a mobile device it is better to look for a wallet that supports this URI";

    function showAlternatives(uri, isMobile, uriType) {
      var modal = initModal();

      ////// OFFER BITSENT HANDLER //////
      var butcoinRequestLink = createEl(
        "a",
        ["bitcoin-uri"],
        [],
        "Payment Request Link"
      );
      butcoinRequestLink.rel = "noopener noreferrer";
      butcoinRequestLink.target = "_blank";
      butcoinRequestLink.href = uri;

      var iframeWrapper = createEl("div", ["bitsent-iframe"], []);
      iframeWrapper.id = "bitsentIFrameWrapper";
      iframeWrapper.style.display = "none";

      var addBitSentHandlerBtn = createEl(
        "button",
        [],
        [],
        "Add BitSent as Handler"
      );
      addBitSentHandlerBtn.onclick = function(e) {
        iframeWrapper.innerHTML = "<iframe src='" + BITSENT_URL + "'></iframe>";
      };

      modal.addTab("BitSent", "bitsent-handler-tab", [
        createEl("p", [], [], altMessages[uriType]),
        createEl("p", [], [], altMessage_bitsent),
        addBitSentHandlerBtn,
        iframeWrapper,
        createEl(
          "p",
          ["small-text"],
          [],
          altMessage_browserProtocolPoorSupport
        ),
        createEl(
          "p",
          [],
          [],
          "Once you are done, simply click on this link to try again:"
        ),
        butcoinRequestLink
      ]);

      ////// OFFER WALLET APPS //////

      var walletListLink = createEl(
        "a",
        ["wallet-list-link"],
        [],
        "BitSent's Reccomended Wallets"
      );
      walletListLink.href =
        BITSENT_RECOMMENDED_WALLETS_URL +
        "?os=" +
        encodeURIComponent(os) +
        "&uritype=" +
        encodeURIComponent(uriType);
      walletListLink.rel = "noopener noreferrer";
      walletListLink.target = "_blank";

      modal.addTab("Wallets", "wallets", [
        createEl("p", [], [], altMessages[uriType]),
        createEl(
          "p",
          [],
          [],
          "Check the list of wallets reccomended by BitSent.NET:"
        ),
        walletListLink
      ]);

      if (!isMobile) modal.clickTab(0);
      else modal.clickTab(1);

      showModalASAP(modal);
    }

    function showError(errorMessage) {
      var modal = initModal();
      modal.addTab("Error", "errorMessage", [
        createEl("p", [], [], errorMessage)
      ]);
      modal.clickTab(0);
      showModalASAP(modal);
    }

    modalWindow = {
      showAlternatives: showAlternatives,
      showError: showError
    };

    return modalWindow;
  })();

  function createBasicBtn() {
    var btn = document.createElement("a");
    btn.type = "button";
    btn.classList.add("bitbtn");
    if (os == "iOS" || os == "Android") {
      var portrait = screen.width < screen.height;
      var smallSide = portrait ? screen.width : screen.height;
      var bigSide = portrait ? screen.height : screen.width;

      if (0 < smallSide && smallSide < 500) {
        btn.classList.add("bitbtn-phone");
        // btn.style.fontSize = 0.5 + "cm";
        // btn.style.fontSize = 3.3 + "vmin";
      }
      if (499 < smallSide && smallSide < 1000) {
        btn.classList.add("bitbtn-tablet");
        // btn.style.fontSize = 0.3 + "cm";
        // btn.style.fontSize = 1.8 + "vmin";
      }
    }

    var spinner = document.createElement("span");
    spinner.classList.add("status-circle");
    spinner.role = "status";
    spinner.append(" ");

    btn.cleanupCircle = function() {
      spinner.classList.remove("success");
      spinner.classList.remove("error");
      spinner.classList.remove("loading");
    };

    btn.setCircleStatus = function(status) {
      btn.cleanupCircle();
      spinner.classList.add(status);
    };

    btn.showSuccessInCircle = function() {
      btn.setCircleStatus("success");
    };
    btn.showErrorInCircle = function() {
      btn.setCircleStatus("error");
    };
    btn.showLoadingInCircle = function() {
      btn.setCircleStatus("loading");
    };

    btn.appendChild(spinner);

    var amount = document.createElement("span");
    amount.classList.add("bitbtn-amount");
    btn.appendChild(amount);
    btn.setAmount = function(amountString) {
      amount.innerHTML = amountString;
    };
    btn.setAmount("Loading...");

    var label = document.createElement("span");
    label.classList.add("bitbtn-label");
    btn.appendChild(label);
    btn.setLabel = function(labelString) {
      label.innerHTML = labelString;
    };

    btn.appLink = "bitcoin:";
    btn.setURI = function(uri) {
      btn.appLink = uri;
      btn.href = uri;
    };

    var notWork = document.createElement("div");
    notWork.classList.add("bitbtn-not-work");
    notWork.append("Did it not work?");
    notWork.onclick = function(e) {
      e.stopPropagation();
      btn.showErrorInCircle();
      showAlternatives(btn);
    };
    btn.append(notWork);

    btn.showNotWork = function(seconds) {
      seconds = seconds || 3;
      seconds = parseFloat(seconds);
      notWork.classList.add("show");
      setTimeout(function() {
        notWork.classList.remove("show");
      }, seconds * 1000);
    };

    return btn;
  }

  ensureParamsAreValid = (function() {
    var outputParamNames = ["address", "amount", "currency", "script"];

    addrRegex = /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/;

    scriptData = /(0x)?([0-9]|[A-F]|[a-f])+\b/;

    function ensureParamsAreValid(params) {
      if (typeof params !== "object") {
        throw new TypeError("BitBtn params must be a object!");
      }

      if (!("label" in params)) {
        params.label = "Send";
      }
      if (typeof params.label !== "string") {
        throw new TypeError("BitBtn Label must be a string!");
      }

      if (!("network" in params)) {
        params.network = "bitcoin";
      }
      if (typeof params.network !== "string") {
        throw new TypeError("BitBtn network must be a string!");
      }

      if (!("paymentUrl" in params)) {
        params.paymentUrl = "https://api.bitsent.net/payments/pay";
      }
      if (typeof params.paymentUrl !== "string") {
        throw new TypeError("BitBtn paymentUrl must be a string!");
      }
      if (params.paymentUrl.length > 4000) {
        throw new RangeError(
          "BitBtn 'paymentUrl' cannot be longer than 4000 characters"
        );
      }

      if (!("creationTimestamp" in params)) {
        params.creationTimestamp = Math.floor(+new Date() / 1000);
      }
      if (typeof params.creationTimestamp !== "number") {
        throw new TypeError("BitBtn creationTimestamp must be a number!");
      }

      if (!("expirationTimestamp" in params)) {
        var _7days = 7 * 24 * 60 * 60;
        params.expirationTimestamp = Math.floor(+new Date() / 1000) + _7days;
      }
      if (typeof params.expirationTimestamp !== "number") {
        throw new TypeError("BitBtn expirationTimestamp must be a number!");
      }

      if (!("walletMemo" in params)) {
        params.walletMemo = "BitBtn Payment";
      }
      if (typeof params.walletMemo !== "string") {
        throw new TypeError("BitBtn 'walletMemo' must be a string.");
      }
      if (params.walletMemo.length > 50) {
        throw new RangeError(
          "BitBtn 'walletMemo' cannot be longer than 50 characters"
        );
      }

      if ("merchantData" in params) {
        if (typeof params.merchantData === "object") {
          params.merchantData = JSON.stringify(params.merchantData);
        } else {
          params.merchantData = params.merchantData.toString();
        }

        if (params.merchantData.length > 10000) {
          throw new RangeError(
            "BitBtn 'merchantData' cannot be longer than 10000 characters"
          );
        }
      }

      if (!("successMessage" in params)) {
        params.successMessage = "Done!";
      }
      if (typeof params.successMessage !== "string") {
        throw new TypeError("BitBtn SuccessMessage must be a string!");
      }

      if (!("onPayment" in params)) {
        params.onPayment = function(_) {};
      }
      if (typeof params.onPayment !== "function") {
        throw new TypeError("BitBtn onPayment must be a function!");
      }

      if (!("onError" in params)) {
        params.onError = function(_) {};
      }
      if (typeof params.onError !== "function") {
        throw new TypeError("BitBtn onError must be a function!");
      }

      if (!("bip21" in params)) {
        params.bip21 = false;
      }
      if (typeof params.bip21 !== "boolean") {
        throw new TypeError("BitBtn 'bip21' must be a boolean.");
      }

      if ("outputs" in params) {
        for (var i in outputParamNames) {
          if (outputParamNames[i] in params) {
            throw new Error(
              "BitBtn with outputs cannot also have the following params: " +
                params.join(", ")
            );
          }
        }
      } else {
        var _output = {};
        for (var i in outputParamNames) {
          if (outputParamNames[i] in params) {
            _output[outputParamNames[i]] = params[outputParamNames[i]];
          }
        }
        params.outputs = [_output];
      }

      if (params.bip21 === true) {
        if (params.outputs.length > 1) {
          throw new Error("Cannot have multiple outputs when using BIP21");
        }
      }

      if (!Array.isArray(params.outputs)) {
        throw new TypeError("BitBtn outputs must be an array of objects!");
      }

      for (var i in params.outputs) {
        var output = params.outputs[i];

        if (typeof output !== "object") {
          throw new TypeError("BitBtn outputs must be an array of objects!");
        }

        ensureOutputIsValid(output);
      }

      params.currency = params.outputs[0].currency;
      params.amount = 0;
      for (var i in params.outputs) {
        if (params.outputs[i].currency !== params.currency) {
          if (params.outputs[i].amount !== 0) {
            throw new Error("All outputs must use the same currency");
          }
        }
        params.amount += params.outputs[i].amount;
      }
    }

    function ensureOutputIsValid(output) {
      if (!("amount" in output)) {
        output.amount = 0.0;
      }
      if (typeof output.amount === "string") {
        output.amount = parseFloat(output.amount);
      }
      if (typeof output.amount !== "number") {
        throw new TypeError(
          "BitBtn output amount must be a positive number or 0!"
        );
      }
      if (output.amount === NaN || output.amount < 0) {
        throw new TypeError(
          "BitBtn output amount must be a positive number or 0!"
        );
      }

      if (!("currency" in output)) {
        output.currency = "bsv";
      }
      output.currency = output.currency.toLowerCase();

      if (typeof output.currency !== "string") {
        throw new TypeError("BitBtn currency must be a string!");
      }

      var price = 1;
      if (output.currency === "satoshi") price = SATOSHI_PER_BITCOIN;
      else if (output.currency !== "bsv") price = getPrice(output.currency);

      output.sats = Math.round((output.amount / price) * SATOSHI_PER_BITCOIN);

      if (!("address" in output)) {
        if ("paymail" in output) {
          throw new Error("BitBtn doesn't support paymail yet.");
          // TODO: Implement Paymail to Address convertion
        }
      }

      if ("address" in output && "script" in output) {
        throw new Error(
          "The same BitBtn output cannot have an address and a script at the same time."
        );
      }
      if (!("address" in output) && !("script" in output)) {
        throw new Error(
          "A BitBtn output must have either an address or a script."
        );
      }

      if ("address" in output) {
        if (typeof output.address !== "string") {
          throw new TypeError("BitBtn address must be a string.");
        }
        if (!addrRegex.test(output.address)) {
          throw new Error("BitBtn address appears invalid: " + output.address);
        }

        output.script = scripter.p2pkh(output.address);
      }

      if (!("script" in output)) {
        throw new Error(
          "BitBtn output doesn't have (or didn't generate) a script."
        );
      }

      output.script = output.script.trim().toLowerCase();
      ensureScriptIsHex(output);
    }

    var hexChars = "0123456789abcdef".split("");

    function ensureScriptIsHex(output) {
      var s = output.script;
      if (s.length % 2 != 0) {
        throw new SyntaxError(
          "BitBtn - Script cannot have an odd number of letters : " + s
        );
      }
      for (var i = 0; i < s.length; i++) {
        if (!hexChars.includes(s[i])) {
          throw new SyntaxError("BitBtn - Invalid script syntax : " + s);
        }
      }
    }

    return ensureParamsAreValid;
  })();

  var scripter = (function() {
    var base58Alphabet =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

    var to_b58 = function(
      B, //Uint8Array raw byte input
      A //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
    ) {
      var d = [],
        s = "",
        i,
        j,
        c,
        n;
      for (i in B) {
        (j = 0), (c = B[i]);
        s += c || s.length ^ i ? "" : A[0];
        while (j in d || c) {
          n = d[j];
          n = n ? n * 256 + c : c;
          c = (n / 58) | 0;
          d[j] = n % 58;
          j++;
        }
      }
      while (j--) s += A[d[j]];
      return s;
    };

    var from_b58 = function(
      S, //Base58 string
      A //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
    ) {
      var d = [],
        b = [],
        i,
        j,
        c,
        n;
      for (i in S) {
        (j = 0), (c = A.indexOf(S[i]));
        if (c < 0) return undefined;
        c || b.length ^ i ? i : b.push(0);
        while (j in d || c) {
          n = d[j];
          n = n ? n * 58 + c : c;
          c = n >> 8;
          d[j] = n % 256;
          j++;
        }
      }
      while (j--) b.push(d[j]);
      return new Uint8Array(b);
    };

    function toHexString(byteArray) {
      return Array.from(byteArray, function(byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      }).join("");
    }

    function hex2littleEndian(hexValue) {
      var hexParts = [];
      for (var i = 0; i < hexValue.length; i += 2)
        hexParts.push(hexValue.substr(i, 2));
      return hexParts.reverse().join("");
    }

    var _2bytesLimit = Math.pow(16, 4);
    var _4bytesLimit = Math.pow(16, 8);

    function hexValueInScript(hexString) {
      if (hexString.length % 2 == 1) hexString = "0" + hexString;

      var len = hexString.length / 2;

      if (hexString === "00")
        // OP_FALSE
        return "00";

      if (len < 76) return ("0" + len.toString(16)).slice(-2) + hexString;
      else if (76 <= len && len < 256)
        return "4c" + ("0" + len.toString(16)).slice(-2) + hexString;
      else if (256 <= len && len < _2bytesLimit)
        return (
          "4d" +
          hex2littleEndian(("000" + len.toString(16)).slice(-4)) +
          hexString
        );
      else if (_2bytesLimit <= len && len < _4bytesLimit)
        return (
          "4e" +
          hex2littleEndian(("0000000" + len.toString(16)).slice(-8)) +
          hexString
        );
    }

    function p2pkh(address) {
      var pub = from_b58(address, base58Alphabet);
      var pubCheckSum = pub.slice(21);
      var pubMain = pub.slice(1, 21);
      var pubHash160 = toHexString(pubMain);

      // TODO: Check the checksum and throw exception if address is invalid

      var resultScript = "76a9" + hexValueInScript(pubHash160) + "88ac";
      return resultScript;
    }

    function str2hex(str) {
      if (Array.isArray(str))
        return str.map(function(part) {
          return str2hex(part);
        });

      var result = "";
      for (var i = 0; i < str.length; i++) {
        var hex = str.charCodeAt(i).toString(16);
        result += ("0" + hex).slice(-2);
      }
      return result;
    }

    function op_return(hexValues, use_op_false) {
      if (use_op_false === undefined) use_op_false = true;

      if (typeof hexValues == "string") hexValues = [hexValues];
      if (!Array.isArray(hexValues))
        throw new Error(
          "op_return method expects an array of hexadecimal strings"
        );
      var resultScript = use_op_false ? "006a" : "6a";
      for (var i = 0; i < hexValues.length; i++) {
        resultScript = resultScript + hexValueInScript(hexValues[i]);
      }
      return resultScript;
    }

    return {
      p2pkh: p2pkh,
      op_return: op_return,
      str2hex: str2hex
    };
  })();

  function setBtnParams(btn, params) {
    ensureParamsAreValid(params);
    btn.params = params;

    var roundedAmount = Math.round(btn.params.amount * 100) / 100;
    btn.setAmount(roundedAmount + " " + btn.params.currency.toUpperCase());
    btn.setLabel(btn.params.label);

    if (btn.params.bip21 === true) {
      var out = btn.params.outputs[0];
      btn.setURI(
        "bitcoin:" +
          out.address +
          "?sv&amount=" +
          out.sats / SATOSHI_PER_BITCOIN +
          "&label=" +
          encodeURIComponent(btn.params.walletMemo)
      );
    } else {
      var outs = btn.params.outputs.map(function(o) {
        return {
          amount: o.sats,
          script: o.script
        };
      });
      var infoParams = [
        "req-bip275",
        "paymentUrl=" + encodeURIComponent(btn.params.paymentUrl),
        "network=" + encodeURIComponent(btn.params.network),
        "outputs=" + encodeURIComponent(JSON.stringify(outs)),
        "creationTimestamp=" + encodeURIComponent(btn.params.creationTimestamp),
        "expirationTimestamp=" +
          encodeURIComponent(btn.params.expirationTimestamp),
        "memo=" + encodeURIComponent(btn.params.walletMemo)
      ];
      if (btn.params.merchantData !== undefined)
        infoParams.push(
          "merchantData=" + encodeURIComponent(btn.params.merchantData)
        );

      btn.setURI("bitcoin:?" + infoParams.join("&"));
    }
  }

  openDeepUri = (function() {
    var notSupported = function(appLink) {
      console.error("App Links are not supported on this configuration");
    };

    var direct = function(appLink) {
      window.location = appLink;
    };

    var cta = direct; // BitBtn always acts in click events anyway.

    var iframe = function(appLink) {
      var iframeWithURI = document.createElement("iframe");
      iframeWithURI.style.display = "none";
      document.body.appendChild(iframeWithURI);
      if (iframeWithURI !== null) {
        iframeWithURI.src = appLink;
      }
    };

    var intentCta = function(appLink) {
      var linkScheme = appLink.substr(0, appLink.indexOf(":"));
      var linkPath = appLink.substr(appLink.indexOf(":") + 1);
      var intentUri =
        "intent:" + linkPath + "#Intent;scheme=" + linkScheme + ";end";
      direct(intentUri);
    };

    var final = iframe;
    if (os == "iOS") final = cta;
    else if (os == "Android") final = intentCta;
    else if (browser == "chrome") final = cta;

    return final;
  })();

  var appLinkOpened = false;
  var appLinkOpenedMaybe = false;

  function onAppLinkOpened() {
    appLinkOpened = true;
  }

  function onAppLinkOpenedMaybe() {
    appLinkOpenedMaybe = true;
  }

  window.addEventListener("pagehide", onAppLinkOpened, false);
  window.addEventListener("blur", onAppLinkOpened, false);
  window.addEventListener("beforeunload", onAppLinkOpenedMaybe, false);

  function openBitcoinUri(btn, success, failure) {
    var appLink = btn.appLink;
    if (!appLink) throw new TypeError("AppLink not present.");

    appLinkOpened = false;
    appLinkOpenedMaybe = false;

    openDeepUri(appLink);

    var timeout = setTimeout(function() {
      if (appLinkOpened) {
        btn.showNotWork(2);
        success();
      } else if (appLinkOpenedMaybe) {
        btn.showNotWork();
      } else {
        if (os == "iOS") {
          btn.showNotWork(5);
        } else {
          failure();
        }
      }
    }, 100);
  }

  function waitForPayment(btn) {
    // btn.showLoadingInCircle(); // TODO: uncomment when method is implemented

    if (btn.params.bip21)
      console.error(
        new Error(
          "BitBtn 'waitForPayment' cannot be implemented for BIP21 transactions!"
        )
      );

    // TODO: if btn.params.bip21 is false - query bitIndex for the payment

    // TODO: HOW to query BitIndex (for B):
    //          BitIndex has a non-standard script index endpoint in the roadmap.
    //          But... that might not be ready when it's time to implement this method.
    //
    //          If it is ready:
    //              Add an extra output to the outputs.
    //              It is an OP_Return output and it writes a random id (hash of some stuff?)
    //              wait for the output of this OP_return to appear and get the TX in which it comes
    //              If the TX contains all the right outputs, then the waiting is done.
    //              Otherwise - keep waiting.
    //
    //          If the non-standard TX index is NOT ready:
    //              Register an XPUB in BitIndex for tracking.
    //              When button is clicked, request a non-used address from the XPUB.
    //              Pass the "reserve" option to reserve this address for this user.
    //              Add an output to the outputs. The output sends dust to this address.
    //              Query BitIndex for the dust transaction output.
    //              Get the Transaction ID
    //              If the TX contains all the right outputs, then the waiting is done.
    //              Otherwise - keep waiting.
    //

    // TODO: if payment is successful, call the onPayment callback

    ////// FUTURE PLANS //////

    // TODO: possible improvement for the future:
    //          - try to check for double spend attempts
    //          - if TX appears, but another TX uses the same inputs
    //          - Show error in UI
    //          - call the error callback

    // TODO: possible improvement for the future:
    //          - check if payment was done with BTC or BCH istead.
    //          - if it was, auto-return the money
    //              and tell the user that he used the wrong Bitcoin
    //          - then call the error callback
  }

  function showAlternatives(btn) {
    // WARNING: I saw in internet that there are some problems with deeplinks on iOS
    //              It is possible that the button won't know if no iOS wallet is available.
    //
    // TODO:        Try to look for a workaround
    //                      or simply show a small link for 1 second
    //                      with text "wallet didn't open?"
    //                      If the user clicks it, then offer the modal window tabs
    //                      with iOS wallets that support the protocol being used.

    var isMobile = os === "iOS" || os === "Android";
    var uriType = btn.params.bip21 ? "bip21" : "bip275";

    waitForPayment(btn);

    modalWindow.showAlternatives(btn.appLink, isMobile, uriType);
  }

  function onBtnClick(btn) {
    openBitcoinUri(
      btn,
      (success = function() {
        if (btn.params.bip21 === true) {
          btn.showSuccessInCircle();
        } else {
          waitForPayment(btn);
        }
      }),
      (failure = function() {
        btn.showErrorInCircle();
        showAlternatives(btn);
        var onError = btn.params.onError || function(_) {};
        onError(
          new Error(
            "Did not detect app opening. " +
              "Assuming that the user doesn't have a matching app."
          )
        );
      })
    );
  }

  function create(container, params) {
    addCSS(params.debug);
    try {
      var btn = createBasicBtn();
      container.appendChild(btn);
      setBtnParams(btn, params);
      btn.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        onBtnClick(e.currentTarget);
      };
      return btn;
    } catch (e) {
      var onError = params.onError || function(_) {};
      modalWindow.showError(e);
      onError(e);
    }
  }

  return {
    create: create,
    getPrice: getPrice,
    scripter: scripter
  };
})();
