let sec = require('./security');

var message = 'This is a test message, ben jij ook klaar voor het STARTSEMESTER?';

var mnemonic = sec.GenerateMnemonic();

const {public, private} = sec.GenerateKeyPair(mnemonic);

var signature = sec.SignDetached(message, private);

var succes = sec.VerifyDetached(message, signature, public)

console.log("verified:            " + succes);