const { getCF } = require("../redux/actions/auth-actions")

//@enable_lang
function lang(input) {
  try {
    let cf = getCF();

    //@enable_lang - set cf
    if (["TEST"].indexOf(cf) >= 0)
      if (LANG_MALAY[input]) {
        return LANG_MALAY[input]
      } else {
        // console.log('%c' + input + "", 'background: #d70303; color: #FFFFFF');
        if (untranslated.indexOf(input) <= -1) {
          untranslated.push(input);
        }
      }
  } catch (err) {}

  return input

}

module.exports = lang
