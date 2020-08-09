const { getCF } = require("../redux/actions/auth-actions")

function isTranslateMalay() {
  //@enable_lang - set cf
  var CfForMalay = ["MDCW"];

  // dont translate for company page
  try {
    let isCompanyPage = location.href.indexOf("/app/company/") >= 0
    if (isCompanyPage) {
      return false;
    }
  } catch (err) { }

  try {
    let cf = getCF();
    if (CfForMalay.indexOf(cf) >= 0) {
      return true;
    }
  } catch (err) { }

  return false
}

//@enable_lang
function lang(input) {
  try {
    if (isTranslateMalay())
      if (LANG_MALAY[input]) {
        return LANG_MALAY[input]
      } else {
        // console.log('%c' + input + "", 'background: #d70303; color: #FFFFFF');
        untranslated[input] = "";
      }
  } catch (err) { }
  return input
}

module.exports = lang
