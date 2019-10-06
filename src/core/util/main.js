let s = module.exports = global.AppUtil={}

/**
 * @param len
 * @param radix
 * @returns {string}
 */
s.getUUID = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
        uuid = [], i;
    radix = radix || chars.length;
    len  = len || 16
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    return uuid.join('');
};