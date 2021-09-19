const QrCode = require('qrcode-svg');
const path = require('path');
const fs = require('fs');

const linkFor = {
    whatsapp: p => 'https://wa.me/' + p,
    signal: p => 'https://signal.me/#p/' + p
};

const args = process.argv.slice(2);
if (args.length !== 1) {
    throw Error('Need a phone number as single argument.');
}
const phoneNumber = args[0];
const encodedPhoneNumber = phoneNumber; // uriEncode(phoneNumber);

for (platform in linkFor) {
    if (linkFor.hasOwnProperty(platform)) {
        const link = linkFor[platform](encodedPhoneNumber);
        // const color = colors[platform];
        saveQrCode(link, pathTo(`qrcode-${platform}.svg`));
        fs.writeFileSync(pathTo(`${platform}-url.txt`), link);
    }
}

function uriEncode(text) {
    let result = '';
    for (const c of text) {
        result += '%' + c.charCodeAt(0).toString(16).toUpperCase();
    }
    return result;
}

function pathTo(filename) {
    return path.join(__dirname, filename);
}

function saveQrCode(content, path, color) {
    var code = new QrCode({
        content,
        padding: 0,
        width: 256,
        height: 256,
        color: color || "#333333",
        background: "#ffffff",
        ecl: "M",
        pretty: false,
    });
    code.save(path, err => {
        if (err) {
            throw err;
        }
    });
}
