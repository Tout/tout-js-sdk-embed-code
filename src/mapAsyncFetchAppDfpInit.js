(function(TOUT){
  var brandUid = 'PUT_YOUR_BRAND_UID_HERE';

  TOUT.mapAsyncFetchApp.init(brandUid);
  TOUT.init(brandUid);
  TOUT.mapAsyncFetchApp.fetch();
})(window.parent.TOUT);