const { getCF } = require("../redux/actions/auth-actions")
const LANG_LOCAL_STORAGE = "lang";
const CfForMalay = ["MDCW"];
const MALAY = "Bahasa";
const ENGLISH = "English";

function isHasOtherLang() {
  try {
    let cf = getCF();
    if (CfForMalay.indexOf(cf) >= 0) {
      return true;
    }
  } catch (err) { }
  return false
}

function setLangStore(v) {
  window.localStorage.setItem(LANG_LOCAL_STORAGE, v);
}

function getLangStore() {
  return window.localStorage.getItem(LANG_LOCAL_STORAGE);
}

function isLangStoreEmpty() {
  let storeLang = getLangStore();
  return !storeLang ? true : false;
}

function isTranslateMalay() {
  //@enable_lang - set cf


  // 1. check if company page default to english
  try {
    let isCompanyPage = location.href.indexOf("/app/company/") >= 0
    if (isCompanyPage) {
      return false;
    }
  } catch (err) { }

  // 2. check if store
  try {
    let cf = getCF();
    if (CfForMalay.indexOf(cf) >= 0) {
      if (isLangStoreEmpty() || getLangStore() == MALAY) {
        return true;
      }
    }

  } catch (err) { }

  return false
}


function currentLang() {
  let r = "";
  if (isTranslateMalay()) {
    r = MALAY
  } else {
    r = ENGLISH
  }

  return r;
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

module.exports = {
  currentLang,
  isHasOtherLang,
  isTranslateMalay,
  setLangStore,
  getLangStore,
  isLangStoreEmpty,
  lang,
  MALAY,
  ENGLISH
}