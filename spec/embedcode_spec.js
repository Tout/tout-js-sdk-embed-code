describe("sdk embed code", function () {
  beforeEach(function () {
    // clear out the window.TOUT namespace;
    window.TOUT = undefined;

    // remove any prexisting script tags for the sdk
    var embedCodeEl = document.getElementById("tout-js-sdk");
    if (embedCodeEl) {
      embedCodeEl.parentNode.removeChild(embedCodeEl);
    }
  });

  describe("without running init", function () {
    beforeEach(function () {
      window.runToutSdkEmbedCode();
    });

    it("should save off the parsed at date", function () {
      expect(TOUT._sdkScriptTagParsedAt).toBeDefined();
      expect(TOUT._sdkScriptTagParsedAt instanceof Date).toBe(true);
    });

    it("should create an onReady function to store calls", function () {
      var callA = function () {
      };
      var callB = function () {
      };

      expect(TOUT._onReadyQueue).toBeUndefined();

      TOUT.onReady(callA);
      TOUT.onReady(callB);

      expect(TOUT._onReadyQueue).toEqual([callA, callB]);
    });

    it("should create an onReady function which returns window.TOUT", function () {
      expect(TOUT.onReady(function () {
      })).toBe(window.TOUT);
    });

    it("should define an init function", function () {
      expect(TOUT.init).toBeDefined();
    });

    describe("when the embed code is on the page twice", function () {
      it("shouldn't overwrite the embed code defined functions", function () {
        // set these to fake values
        TOUT._sdkScriptTagParsedAt = "fake parsed at";
        TOUT.onReady = "fake onReady";
        TOUT.init = "fake init";

        // load the embed code again
        window.runToutSdkEmbedCode();

        expect(TOUT._sdkScriptTagParsedAt).toBe("fake parsed at");
        expect(TOUT.onReady).toBe("fake onReady");
        expect(TOUT.init).toBe("fake init");
      });


    });
  });

  describe("calling init", function () {
    it("should insert a script tag with the given brand uid", function () {
      window.runToutSdkEmbedCode();
      TOUT.init("abcd");

      var el = document.getElementById("tout-js-sdk");
      expect(el).toBeDefined();
      expect(el.src.indexOf("//platform.tout.com/sdk/v1/abcd.js") > -1).toBeTruthy();
    });

    it("should return window.TOUT", function () {
      window.runToutSdkEmbedCode();

      expect(TOUT.init("abcd")).toBe(window.TOUT);
    });

    it("should save off any options passed in", function(){
      window.runToutSdkEmbedCode();
      TOUT.init("abcd", {foo: "bar"});

      expect(TOUT._initOptions).toEqual({foo: "bar"});
    });

    describe("calling init twice", function(){
      it("should not insert the embed code twice", function () {
        window.runToutSdkEmbedCode();
        TOUT.init("abcd");
        TOUT.init("abcd");

        var els = document.querySelectorAll("script.tout-sdk");
        expect(els.length).toBe(1);
      });

      it("should insert the embed code twice if forceInit is passed in an option", function(){
        window.runToutSdkEmbedCode();
        TOUT.init("abcd");
        TOUT.init("abcd", {forceInit: true});

        var els = document.querySelectorAll("script.tout-sdk");
        expect(els.length).toBe(2);
      });

      it("should return TOUT instance", function () {
        window.runToutSdkEmbedCode();
        TOUT.init("abcd");

        expect(TOUT.init("abcd")).toBe(TOUT);
      });
    });

    describe("using overrides", function () {
      beforeEach(function () {
        window.TOUT = window.TOUT || {};
      });

      it("should allow sdk host to be overridden", function () {
        TOUT.SDK_HOST = "example.org";

        window.runToutSdkEmbedCode();
        TOUT.init("abcd");

        var el = document.getElementById("tout-js-sdk");
        expect(el.src.indexOf("//example.org/sdk/v1/abcd.js") > -1).toBeTruthy();
      });

      it("should allow brand uid to be overridden", function () {
        TOUT.SDK_BRAND_UID = "xyz";

        window.runToutSdkEmbedCode();
        TOUT.init("abcd");

        var el = document.getElementById("tout-js-sdk");
        expect(el.src.indexOf("//platform.tout.com/sdk/v1/xyz.js") > -1).toBeTruthy();
      });
    });

    describe("validating brand uid", function () {
      beforeEach(function(){
        window.runToutSdkEmbedCode();
      });

      it("should bail early if brand uid is undefined", function () {
        TOUT.init();

        expect(document.getElementById("tout-js-sdk")).toBeNull();
      });

      it("should bail early if brand uid isn't a string", function () {
        TOUT.init({});

        expect(document.getElementById("tout-js-sdk")).toBeNull();
      });

      it("should bail early if brand uid is an empty string", function () {
        TOUT.init('');

        expect(document.getElementById("tout-js-sdk")).toBeNull();
      });

      it("should bail early if brand uid is the placeholder string in the documentation", function () {
        TOUT.init('PUT_YOUR_BRAND_UID_HERE');

        expect(document.getElementById("tout-js-sdk")).toBeNull();
      });

      it("should return the TOUT namespace when bailing early", function(){
        expect(TOUT.init()).toBe(TOUT);
      });
    });
  });
});

