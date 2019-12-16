const fs = require('fs');

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function (element) {
    // Adicione o novo elemento ao final da matriz.
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  },

  pop: function () {
    // Armazene o primeiro elemento para que possamos devolvê-lo mais tarde.
    var result = this.content[0];
    // Obter o elemento no final da matriz.
    var end = this.content.pop();
    // Se houver algum elemento, coloque o elemento final no
    // inicio.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function (node) {
    var length = this.content.length;
    // Para remover um valor, precisamos pesquisar na matriz para encontrá-lo
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      // Quando encontrado, o processo visto em 'pop' é repetido
      var end = this.content.pop();
      // Se o elemento que acionamos foi o que precisávamos remover,
      // estamos prontos.
      if (i == length - 1) break;
      // Caso contrário, substituímos o elemento removido pelo estourado 
      //e permitimos que ele flutue para cima ou para baixo, conforme apropriado.
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function () {
    return this.content.length;
  },

  bubbleUp: function (n) {
    // Busque o elemento que precisa ser movido.
    var element = this.content[n],
      score = this.scoreFunction(element);
    // Quando em 0, um elemento não pode subir mais.
    while (n > 0) {
      // Calcule o índice do elemento pai e busque-o.
      var parentN = Math.floor((n + 1) / 2) - 1,
        parent = this.content[parentN];
      // Se os pais têm uma pontuação menor, as coisas estão em ordem
      // e estamos prontos.

      if (score >= this.scoreFunction(parent))
        break;

      // Caso contrário, troque o pai pelo elemento atual e
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function (n) {
    // Procure o elemento alvo e sua pontuação.
    var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while (true) {
      // Calcule os índices dos elementos filho.
      var child2N = (n + 1) * 2,
        child1N = child2N - 1;
      // Isso é usado para armazenar a nova posição do elemento,
      // caso existam.
      var swap = null;
      //Se o primeiro filho existir (estiver dentro da matriz) ...
      if (child1N < length) {
        // Procure e calcule sua pontuação.
        var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);
        // Se a pontuação for menor que a do nosso elemento, precisamos trocar.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Faça as mesmas verificações para o outro nó.
      if (child2N < length) {
        var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // Não há necessidade de trocar mais.
      if (swap == null) break;

      // Caso contrário, troque e continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

function HuffmanEncoding(str) {
  this.str = str;

  var count_chars = {};
  for (var i = 0; i < str.length; i++)
    if (str[i] in count_chars)
      count_chars[str[i]]++;
    else
      count_chars[str[i]] = 1;

  var pq = new BinaryHeap(function (x) {
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
    console.log("tamanho da chegada: " + arrayBufferAudio.length);
    var huff = new HuffmanEncoding(arrayBufferAudio);
    //huff.inspect_encoding()

    let  e = huff.encoded_string;
    let tam = Math.ceil(Number(e.length) / 8); // tamanho do array de 8 bits vai ser o teto do tamanho da string gerada pelo codigo de huffman;
    var buff = new Uint8Array(tam); // array de inteiros de 8 bits cada em javascript
    console.log("tam: "+ tam);
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

    fs.writeFileSync('./lol', buff, {
      encoding: null
    });
    fs.writeFileSync('./lolInfo.json', JSON.stringify(huff.get_encondig()), {
      encoding: null
    });
  },
  readAudioFile: function () {
    let contents = fs.readFileSync('./lol');
    let info = fs.readFileSync('./lolInfo.json');
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
    console.log("tamanho do buff2 "+ buffer2.length);
    let tol = decodeHuffman(stringDoArquivo, infode);
    return tol
    /*stringLength = Number(buffer2[buffer2.byteLength - 1]);

    var bitCount = 0;
    var byteCount = 0;
    stringDoArquivo = '';
    for (let i = 0; i < stringLength; i++) {
      if (bitCount == 8) {
        byteCount += 1;
        bitCount = 0;
      }
      stringDoArquivo += readBit(buffer2, byteCount, bitCount);
      bitCount += 1;
    }*/
  }
};
/*
var s = [26, 69, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129, 223, 163, 159, 66, 134, 129]
console.log(s)

function readBit(buffer, i, bit) { // funcao para ler um determinado bit do array de inteiros
  return (buffer[i] >> bit) % 2;
}

function setBit(buffer, i, bit, value) { // funcao para escrever um determinado bit no array de inteiros
  if (value == 0) {
    buffer[i] &= ~(1 << bit);
  } else {
    buffer[i] |= (1 << bit);
  }
}
var huff = new HuffmanEncoding(s)
huff.inspect_encoding()

var e = huff.encoded_string;

let tam = Math.ceil(e.length / 8); // tamanho do array de 8 bits vai ser o teto do tamanho da string gerada pelo codigo de huffman

var buf = new Uint8Array(tam + 1); // array de inteiros de 8 bits cada em javascript
buf[tam] = e.length; //informacao do tamanho da string
let bitCount = 0;
let byteCount = 0;

e.split('').forEach(function (value) {
  if (bitCount == 8) {
    byteCount += 1;
    bitCount = 0;
  }
  setBit(buf, byteCount, bitCount, Number(value));
  bitCount += 1;
});
console.log('string do codigo: ' + e);

fs.writeFileSync('./lol', buf, {
  encoding: null
});
fs.writeFileSync('./lolInfo.json', JSON.stringify(huff.get_encondig()), {
  encoding: null
});

let contents = fs.readFileSync('./lol');
let info = fs.readFileSync('./lolInfo.json'); //mapeamento para huffman salvo em um arquivo .json

let buffer2 = new Uint8Array(contents);

stringLength = Number(buffer2.length-1);
let buffer3 = JSON.parse(info);

let bitCount2 = 0;
let byteCount2 = 0;
let stringDoArquivo = '';

for (let i = 0; i < stringLength; i++) {
  if (bitCount2 == 8) {
    byteCount2 += 1;
    bitCount2 = 0;
  }
  stringDoArquivo += readBit(buffer2, byteCount2, bitCount2);
  bitCount2 += 1;
}
/*
for (let i =0; i < stringLength; i++){
  stringDoArquivo += Number(buffer2[i]).toString(2);
}
console.log('string do arquivo: ' + stringDoArquivo);
var t = decodeHuffman(stringDoArquivo,buffer3);
//console.log(s)
console.log(t)
//console.log("String decodificada do arquivo é igual a String codificada antes do arquivo?", (stringDoArquivo == e));
*/