(function (window, document) {
  // Create the TOUT global variable
  var TOUT = window.TOUT = window.TOUT || {};

  // Bail early if the sdk has already been loaded
  if (TOUT._sdkScriptTagParsedAt) { return; }

  // Save off when our sdk embed code was parsed, for two reasons:
  // 1) we can track page speed performance with analytics
  // 2) prevent the sdk from loading twice (see above)
  TOUT._sdkScriptTagParsedAt = new Date;

  // Set an embed code version for debugging purposes
  TOUT.EMBED_CODE_VERSION='1.1.2';

  // Setup embed code constants which can be overriden for testing purposes
  var sdkHost = TOUT.SDK_HOST || 'platform.tout.com',
    analyticsHost = TOUT.SDK_ANALYTICS_HOST || 'analytics.tout.com';

  // Setup an onReady handler which can save off any function calls until the sdk script tag has been loaded
  TOUT.onReady = function (func) {
    TOUT._onReadyQueue = TOUT._onReadyQueue || [];
    TOUT._onReadyQueue.push(func);

    // return the instance for chainability
    return TOUT;
  };

  TOUT.init = function (brandUid, options) {
    options = options || {};

    var sdkScriptId = 'tout-js-sdk';

    // Don't load the sdk script tag if it's already been loaded (and they aren't forcing us to init twice)
    if (document.getElementById(sdkScriptId) && !options.forceInit) {
      // return the instance for chainability
      return TOUT;
    }

    // Allow the brand uid to be overriden for testing purposes
    brandUid = TOUT.SDK_BRAND_UID || brandUid;

    // If brand uid isn't configured correctly, ping our analytics servers so Account Services can help that customer.
    if (typeof brandUid === 'undefined' || typeof brandUid !== 'string' || brandUid.length === 0 || brandUid.length > 7) {
      var image = new Image();
      image.src = 'http://' + analyticsHost + '/events?trigger=sdk_log&log_level=error&log_message=BRAND_UID_NOT_DEFINED&content_page_url=' + encodeURIComponent(window.location.href);

      if(console && console.error) {
        console.error('TOUT - Invalid Brand UID: ' + brandUid);
      }

      // return the instance for chainability
      return TOUT;
    }

    // Save off any optional configuration options, so we can use them later
    TOUT._initOptions = options;

    // Load the Tout SDK in an async manner
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//' + sdkHost + '/sdk/v1/' + brandUid + '.js';
    script.id = sdkScriptId;
    script.className = 'tout-sdk';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    // return the instance for chainability
    return TOUT;
  };
})(window, document);
