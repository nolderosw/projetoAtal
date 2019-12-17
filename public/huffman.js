const fs = require('fs');
const bh = require('./binaryHeap');
function HuffmanEncoding(str) {
  this.str = str;

  var count_chars = {};
  for (var i = 0; i < str.length; i++)
    if (str[i] in count_chars)
      count_chars[str[i]]++;
    else
      count_chars[str[i]] = 1;

  var pq = new bh(function (x) {
    return x[0];
  });
  for (var ch in count_chars)
    pq.push([count_chars[ch], ch]);

  while (pq.size() > 1) {
    var pair1 = pq.pop();
    var pair2 = pq.pop();
    pq.push([pair1[0] + pair2[0],
      [pair1[1], pair2[1]]
    ]);
  }

  var tree = pq.pop();
  this.encoding = {};
  this._generate_encoding(tree[1], "");

  this.encoded_string = ""
  for (var i = 0; i < this.str.length; i++) {
    this.encoded_string += this.encoding[str[i]];
  }
}

HuffmanEncoding.prototype._generate_encoding = function (ary, prefix) {
  if (ary instanceof Array) {
    this._generate_encoding(ary[0], prefix + "0");
    this._generate_encoding(ary[1], prefix + "1");
  } else {
    this.encoding[ary] = prefix;
  }
}

HuffmanEncoding.prototype.inspect_encoding = function () {
  for (var ch in this.encoding) {
    console.log("'" + ch + "': " + this.encoding[ch])
  }
}

HuffmanEncoding.prototype.get_encondig = function () {
  return this.encoding;
}

function decodeHuffman(encoded, encoding) {
  var rev_enc = {};
  for (var ch in encoding)
    rev_enc[encoding[ch]] = ch;
  var decoded = [];
  var pos = 0;
  while (pos < encoded.length) {
    var key = ""
    while (!(key in rev_enc)) {
      key += encoded[pos];
      pos++;
      if(pos > encoded.length)
        break;
    }
    decoded.push(Number(rev_enc[key]));
  }
  return decoded;
}
module.exports = {
  writeAudioFile: async function (arrayBufferAudio) {
    var huff = new HuffmanEncoding(arrayBufferAudio);
    let  e = huff.encoded_string;
    let tam = Math.ceil(Number(e.length) / 8); // tamanho do array de 8 bits vai ser o teto do tamanho da string gerada pelo codigo de huffman;
    var buff = new Uint8Array(tam); // array de inteiros de 8 bits cada em javascript
    function setBit(buffer, i, bit, value) { // funcao para escrever um determinado bit no array de inteiros
      if (value == 0) {
        buffer[i] &= ~(1 << bit);
      } else {
        buffer[i] |= (1 << bit);
      }
    }
    var bitCount = 0;
    var byteCount = 0;

    e.split('').forEach(function (value) {
      if (bitCount == 8) {
        byteCount += 1;
        bitCount = 0;
      }
      setBit(buff, byteCount, bitCount, Number(value));
      bitCount += 1;
    });

    fs.writeFileSync('./audio', buff, {
      encoding: null
    });
    fs.writeFileSync('./audioInfo.json', JSON.stringify(huff.get_encondig()), {
      encoding: null
    });
  },
  readAudioFile: function () {
    let contents = fs.readFileSync('./audio');
    let info = fs.readFileSync('./audioInfo.json');
    let buffer2 = new Uint8Array(contents);
    let infode = JSON.parse(info);
    let stringLength = Number(buffer2.length*8);

    
    function readBit(buffer, i, bit) { // funcao para ler um determinado bit do array de inteiros
      return (buffer[i] >> bit) % 2;
    }
    var bitCount = 0;
    var byteCount = 0;
    let stringDoArquivo = '';
    for (let i = 0; i < stringLength; i++) {
      if (bitCount == 8) {
        byteCount += 1;
        bitCount = 0;
      }
      stringDoArquivo += readBit(buffer2, byteCount, bitCount);
      bitCount += 1;
    }
    let tol = decodeHuffman(stringDoArquivo, infode);
    return tol
  }
};