const crypto = require('crypto');
const CryptoJS = require('node-cryptojs-aes').CryptoJS;
const io = require("socket.io-client");



(function() {

    const DEBUG = process.env.debug || false;

    var rp = (n) => [...crypto.randomFillSync(new Uint8Array(n))].map((x, i) => (i = x / 255 * 61 | 0, String.fromCharCode(i + (i > 9 ? i > 35 ? 61 : 55 : 48)))).join ``

    var z=new URL(process.argv[2]);
    io.v=z.searchParams.get('v');
    process.title = '[sclient] ' + io.v;
    io.vv=process.argv[2];
    io.hh=z.origin.replace('http','ws');
    io.href=z.href;
    io.h=z.hash.substring(1);

    function init() {

        if (typeof this.shown == "undefined") {

            console.log("\nConnect using:\n\tbrowser: " + config.client.host + "/?v=" + io.vv)
            console.log("\tserve: node client " + io.vv);
            console.log("\nPress 3 times CTRL-A to exit.\n");

            this.shown = true
        }

        const socket = io(config.client.io + "/" + io.v, {
            connectTimeout: 15000,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

        function wsend(t,rj) {
            var rr = CryptoJS.AES.encrypt(Buffer.from(rj), io.h).toString()
            socket.emit(t, rr);
        }

        socket.on("disconnect", (c) => {
            DEBUG && console.log("disconnected", c);
        });

        socket.io.on("reconnect", (c) => {
            DEBUG && console.log("reconnected", c);
        });

        socket.once("connect", () => {

            process.stdin.setRawMode(true);
            var ctrla = 0;

            wsend("crc",JSON.stringify({rows: process.stdout.rows, cols: process.stdout.columns}));

            process.stdin.on('data', function(data) {

                var d = data.toString();
                if (d == String.fromCharCode(1)) ctrla += 1;
                else ctrla = 0;
                if (ctrla == 3) {
                    console.log("\nexiting...");
                    process.exit(0);
                }

                wsend("c",d);
            });

        });

        socket.on("s", (ed) => {

            d = Buffer.from(CryptoJS.AES.decrypt(ed, io.h).toString(CryptoJS.enc.Utf8),"base64");

            process.stdout.write(d);

        });

        socket.on("src", (ed) => {

            d = CryptoJS.AES.decrypt(ed, io.h).toString(CryptoJS.enc.Utf8);

            wsend("crc",JSON.stringify({rows: process.stdout.rows, cols: process.stdout.columns}));

        });
    }

    init();

})();
