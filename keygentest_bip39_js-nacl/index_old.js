var bip39 = require('bip39');
var nacl_factory = require('js-nacl');
// var EdDSA = require('elliptic').eddsa;
// var ec = new EdDSA('ed25519');

//Make key from random mnemonic
var mnemonic = bip39.generateMnemonic(); 

console.log('PassPhrase         '+ mnemonic);

//var key = ec.keyFromSecret(bip39.mnemonicToSeed(mnemonic));

var msg = 'cryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijkcryptografie is pijnlijk';

nacl_factory.instantiate(function (nacl) {
    //Generate private(signSk) and public(signPk) key
    const { signSk, signPk } = nacl.crypto_sign_seed_keypair(bip39.mnemonicToEntropy(mnemonic));
    
    //From byte array to hexcode to print without taking 4000 lines
    console.log('Private key:       '+ nacl.to_hex(signSk));
    console.log('Public key:        '+ nacl.to_hex(signPk));

    //Make adress 
    //Hash public key, take first 8 bytes
    var hash = Buffer.from(nacl.crypto_hash_sha256(nacl.crypto_hash_sha256(signPk)))
        .slice(0, 8);
    //Start with SNOW followed by the hex of the bytes
    var address = 'SNOW' + nacl.to_hex(hash);

    console.log('Adress:            ' + address);

    //Convert message to bytestring
    const msgBytes = Buffer.from(msg, 'utf8');
    
    //Sign message and package up into packet
    var packetBin = nacl.crypto_sign_detached(msgBytes, signSk);

    console.log('Packet:            '+nacl.to_hex(packetBin));

    //Decode message from packet with public key
    var hexStrin = nacl.crypto_sign_verify_detached(packetBin, msgBytes,signPk);
    
    console.log('Text:              '+hexStrin);

    //Convert hex to string
    var str = '';
    for (var i = 0; i < hexStrin.length; i += 2)
        str += String.fromCharCode(parseInt(hexStrin.substr(i, 2), 16));
    
    console.log('Text:              '+str);
});

