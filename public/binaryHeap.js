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
module.exports = BinaryHeap;