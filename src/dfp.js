(function (window,document) {
  // Create the TOUT global variable
  var TOUT = window.TOUT = window.TOUT || {};

  /* eslint-disable no-console */
  // Log out to the console that the Tout embed code is being loaded (for debugging purposes)
  if(console && console.log){
    console.log('Tout SDK: ' + (+new Date));
  }
  /* eslint-enable no-console */

  // Bail early if the sdk has already been loaded
  if (TOUT._sdkScriptTagParsedAt) { return; }

  // Save off when our sdk embed code was parsed, for two reasons:
  // 1) we can track page speed performance with analytics
  // 2) prevent the sdk from loading twice (see above)
  TOUT._sdkScriptTagParsedAt = new Date;

  // Set an embed code version for debugging purposes
  TOUT.EMBED_CODE_VERSION='1.2.0';

  // Setup embed code constants which can be overriden for testing purposes
  var sdkHost = TOUT.SDK_HOST || 'platform.tout.com',
    sdkProtocol = TOUT.SDK_PROTOCOL || ('https:' == window.location.protocol ? 'https:' : 'http:'),
    analyticsHost = TOUT.SDK_ANALYTICS_HOST || 'analytics.tout.com',
    analyticsProtocol = TOUT.SDK_ANALYTICS_PROTOCOL || sdkProtocol;

  // Setup an onReady handler which can save off any function calls until the sdk script tag has been loaded
  TOUT.onReady = TOUT.onReady || function (func) {
    TOUT._onReadyQueue = TOUT._onReadyQueue || [];
    TOUT._onReadyQueue.push(func);

    // return the instance for chainability
    return TOUT;
  };

  TOUT.fireSimpleAnalyticsPixel = function (trigger_name, attrs) {
    var img = new Image,
      url = analyticsProtocol + '//' + analyticsHost + '/events?trigger=' + trigger_name;

    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        url += '&' + attr + '=' + encodeURIComponent(attrs[attr]);
      }
    }

    img.src = url;
    return img;
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

      TOUT.fireSimpleAnalyticsPixel('sdk_log', {
        log_level: 'error',
        log_message: 'BRAND_UID_NOT_DEFINED',
        content_page_url: window.location.href,
        dfp_line_item_id: '%eaid!',
        dfp_advertiser_id: '%eadv!',
        dfp_order_id: '%ebuy!',
        dfp_creative_id: '%ecid!',
        dfp_environment_indicator: '%eenv!',
        dfp_ad_unit_id: '%epid!',
        dfp_highest_level_ad_unit_id: '%esid!',
        dfp_preview_mode: '%%PREVIEW_MODE%%',
        dfp_creative_width: '%%WIDTH%%',
        dfp_creative_height: '%%HEIGHT%%'
      });

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
    script.src = sdkProtocol + '//' + sdkHost + '/sdk/v1/' + brandUid + '.js';
    script.id = sdkScriptId;
    script.className = 'tout-sdk';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    // Fire an sdk_initialized event
    TOUT.fireSimpleAnalyticsPixel('sdk_initialized', {
      content_brand_uid: brandUid,
      sdk_embed_code_version: TOUT.EMBED_CODE_VERSION,
      content_page_url: window.location.href,
      dfp_line_item_id: '%eaid!',
      dfp_advertiser_id: '%eadv!',
      dfp_order_id: '%ebuy!',
      dfp_creative_id: '%ecid!',
      dfp_environment_indicator: '%eenv!',
      dfp_ad_unit_id: '%epid!',
      dfp_highest_level_ad_unit_id: '%esid!',
      dfp_preview_mode: '%%PREVIEW_MODE%%',
      dfp_creative_width: '%%WIDTH%%',
      dfp_creative_height: '%%HEIGHT%%'
    });

    // return the instance for chainability
    return TOUT;
  };
})(window.parent,window.parent.document);