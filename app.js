(() => {
  "use strict";

  const CHAVE = "cartaz-vozes-negras-v1";
  const form = document.getElementById("form");
  const cartaz = document.getElementById("cartaz");
  const moldura = document.getElementById("moldura");
  const escala = document.getElementById("escala");
  const aviso = document.getElementById("aviso");
  const btnPdf = document.getElementById("btn-pdf");
  const selTamanho = document.getElementById("tamanho-pdf");
  const selFonteGeral = document.getElementById("fonte-geral");

  const CAMPOS_TEXTO = ["nome", "estado", "viveu", "obra1", "obra2", "obra3", "bio", "titulo", "poema", "eulirico", "figura", "turma", "professores", "represent"];
  const SAIDAS_TEXTO = ["nome", "estado", "viveu", "obra1", "obra2", "obra3", "bio", "titulo", "poema", "eulirico", "figura", "integrantes", "turma", "professores", "represent"];
  const IMAGENS = ["foto", "imgobra1", "imgobra2", "imgobra3", "imgbio"];
  // capa de livro: por padrão aparece inteira (sem cortar)
  const mostraInteira = (nome) => (nome.startsWith("imgobra") ? estado.inteira[nome] !== false : !!estado.inteira[nome]);

  // Fontes disponíveis (todas embutidas no app, funcionam sem internet)
  const FONTES = [
    { id: "carlito", nome: "Padrão (Calibri)", css: '"Carlito", Calibri, sans-serif' },
    { id: "lora", nome: "Lora (clássica, com serifa)", css: '"Lora", Georgia, serif' },
    { id: "merriweather", nome: "Merriweather (livro)", css: '"Merriweather", Georgia, serif' },
    { id: "courier", nome: "Courier Prime (máquina de escrever)", css: '"Courier Prime", "Courier New", monospace' },
    { id: "comic", nome: "Comic Neue (escolar)", css: '"Comic Neue", "Comic Sans MS", sans-serif' },
    { id: "patrick", nome: "Patrick Hand (letra de mão)", css: '"Patrick Hand", cursive' },
    { id: "caveat", nome: "Caveat (cursiva)", css: '"Caveat", cursive' },
    { id: "archivo", nome: "Archivo Black (destaque)", css: '"Archivo Black", "Arial Black", sans-serif' },
  ];
  const fonteCss = (id) => (FONTES.find((f) => f.id === id) || FONTES[0]).css;

  // Tamanhos em pontos (pt). "auto" = diminui sozinho até caber.
  const TAMANHOS_LETRA = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56];

  // Preenchidos automaticamente (podem ser trocados no formulário)
  const TEXTOS_PADRAO = { turma: "9º Ano E", professores: "Lucas Silva\nRonaldo Mendes\nLuzia Reinaldo" };
  // Cartaz de exemplo para mostrar aos alunos (as imagens são colocadas à mão).
  // Poema: "Fio partido", de Auta de Souza, em Horto (domínio público).
  const EXEMPLO = {
    "textos": {
      "nome": "Auta de Souza",
      "estado": "Rio Grande do Norte (Macaíba)",
      "viveu": "1876 – 1901",
      "obra1": "Horto (1900)",
      "obra2": "Nunca mais (poema)",
      "obra3": "Súplica (poema)",
      "bio": "Auta de Souza nasceu em Macaíba, no Rio Grande do Norte, em 12 de setembro de 1876. Perdeu a mãe e o pai ainda criança e foi criada pela avó materna. Estudou em um colégio de freiras francesas no Recife, onde aprendeu francês e teve contato com a literatura. Ainda adolescente, descobriu que tinha tuberculose e precisou deixar os estudos. Publicou poemas em jornais e revistas e, em 1900, lançou seu único livro, Horto, com prefácio de Olavo Bilac. Morreu em Natal, em 7 de fevereiro de 1901, com apenas 24 anos.",
      "represent": "Auta de Souza foi uma mulher negra que conquistou espaço na literatura brasileira no fim do século XIX, poucos anos depois da abolição da escravidão (1888), numa época de muito racismo e em que poucas mulheres conseguiam publicar livros. Seu livro Horto foi elogiado por Olavo Bilac, um dos poetas mais famosos do país, e ganhou várias edições. Hoje ela é lembrada como uma das primeiras grandes poetas negras do Brasil. Sua história mostra que a voz de mulheres negras sempre fez parte da nossa literatura, mesmo quando foi pouco reconhecida.",
      "titulo": "Fio partido",
      "poema": "Fugir à mágoa terrena\nE ao sonho, que faz sofrer,\nDeixar o mundo sem pena\nSerá morrer?\n\nFugir neste anseio infindo\nÀ treva do anoitecer,\nBuscar a aurora sorrindo\nSerá morrer?\n\nE ao grito que a dor arranca\nE o coração faz tremer,\nVoar uma pomba branca\nSerá morrer?\n\nII\n\nLá vai a pomba voando\nLivre, através dos espaços...\nSacode as asas cantando:\n\"Quebrei meus laços!\"\n\nAqui na amplidão liberta,\nQuem pode deter-me os passos?\nDeixei a prisão deserta,\nQuebrei meus laços!\n\nJesus, este vôo infindo\nHá de amparar-me nos braços\nEnquanto eu direi sorrindo:\nQuebrei meus laços!\n\nJaneiro, 1901",
      "eulirico": "O eu lírico é uma voz que sofre com as dores do mundo e pensa na morte. Na parte I, ele pergunta se fugir da mágoa, do sofrimento e da escuridão seria morrer. Na parte II, a alma aparece como uma pomba branca que voa livre e canta \"Quebrei meus laços!\", entregando-se a Jesus. A morte é vista com fé, como libertação. O poema foi escrito em janeiro de 1901, um mês antes da morte da poeta.",
      "figura": "Metáfora: a alma é representada como \"uma pomba branca\" que voa e se liberta (\"Quebrei meus laços!\"). Repetição (refrão): a pergunta \"Será morrer?\" fecha cada estrofe da parte I, e \"Quebrei meus laços!\" fecha cada estrofe da parte II. Anáfora: a palavra \"Fugir\" abre as duas primeiras estrofes."
    },
    "integrantes": [
      "Exemplo preparado pelos professores"
    ],
    "alinhamento": "center"
  };
  const estadoInicial = () => ({ textos: { ...TEXTOS_PADRAO }, integrantes: [""], imagens: {}, inteira: {}, alinhamento: "left", estilos: {} });
  let estado = estadoInicial();
  let modoPrevia = "limpo"; // "limpo" (sem linhas), "inteiro" (com a divisão das folhas) ou "partes"

  // ------------------------------------------------------------------
  // Armazenamento: textos no localStorage, imagens no IndexedDB
  // (imagens são grandes e estouravam o limite do localStorage)
  // ------------------------------------------------------------------
  const BD = (() => {
    let promessa = null;
    function abrir() {
      if (!promessa) {
        promessa = new Promise((resolve, reject) => {
          try {
            const req = indexedDB.open("cartaz-vozes-negras", 1);
            req.onupgradeneeded = () => req.result.createObjectStore("imagens");
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          } catch (e) { reject(e); }
        });
      }
      return promessa;
    }
    async function op(modo, fn) {
      const db = await abrir();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("imagens", modo);
        const req = fn(tx.objectStore("imagens"));
        tx.oncomplete = () => resolve(req && req.result);
        tx.onerror = () => reject(tx.error);
      });
    }
    return {
      salvar: (k, v) => op("readwrite", (s) => (v ? s.put(v, k) : s.delete(k))),
      ler: (k) => op("readonly", (s) => s.get(k)),
      limpar: () => op("readwrite", (s) => s.clear()),
    };
  })();

  function salvar() {
    const { imagens, ...semImagens } = estado;
    try { localStorage.setItem(CHAVE, JSON.stringify(semImagens)); } catch (_) { /* sem armazenamento */ }
  }
  function salvarImagem(nome) {
    BD.salvar(nome, estado.imagens[nome] || null).catch(() => {
      // Sem IndexedDB: tenta guardar junto com os textos
      try { localStorage.setItem(CHAVE + "-img-" + nome, estado.imagens[nome] || ""); } catch (_) {}
    });
  }
  async function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const salvo = JSON.parse(bruto);
        estado = { ...estadoInicial(), ...salvo, imagens: salvo.imagens || {} };
        estado.textos = { ...TEXTOS_PADRAO, ...(salvo.textos || {}) };
        // valores padrão de versões anteriores são atualizados
        if (estado.textos.turma === "9º ano") estado.textos.turma = TEXTOS_PADRAO.turma;
        if (["Lucas Silva e Ronaldo Mendes", "Lucas Silva\nRonaldo Mendes"].includes(estado.textos.professores)) estado.textos.professores = TEXTOS_PADRAO.professores;
        if (estado.textos.obra && !estado.textos.obra1) { estado.textos.obra1 = estado.textos.obra; delete estado.textos.obra; }
        if (!Array.isArray(salvo.integrantes)) {
          const antigos = ["int1", "int2", "int3"].map((k) => (estado.textos[k] || "").trim()).filter(Boolean);
          estado.integrantes = antigos.length ? antigos : [""];
        }
      }
    } catch (_) {}
    for (const nome of IMAGENS) {
      if (estado.imagens[nome]) continue;
      try {
        const url = (await BD.ler(nome)) || localStorage.getItem(CHAVE + "-img-" + nome);
        if (url) estado.imagens[nome] = url;
      } catch (_) {
        try { const url = localStorage.getItem(CHAVE + "-img-" + nome); if (url) estado.imagens[nome] = url; } catch (__) {}
      }
    }
    // versão anterior tinha só uma imagem de obra ("imgobra"): vira a obra 1
    if (!estado.imagens.imgobra1) {
      try {
        const antiga = await BD.ler("imgobra");
        if (antiga) {
          estado.imagens.imgobra1 = antiga;
          if (estado.inteira.imgobra === false) estado.inteira.imgobra1 = false;
          BD.salvar("imgobra1", antiga).then(() => BD.salvar("imgobra", null)).catch(() => {});
        }
      } catch (_) {}
    }
  }

  // ------------------------------------------------------------------
  // Pré-visualização
  // ------------------------------------------------------------------
  const saida = (nome) => cartaz.querySelector(`[data-saida="${nome}"]`);

  function textoDoCampo(nome) {
    if (nome === "integrantes") {
      // um nome por linha, em ordem alfabética
      return (estado.integrantes || []).map((n) => (n || "").trim().replace(/\s+/g, " ")).filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" })).join("\n");
    }
    return (estado.textos[nome] || "").replace(/\s+$/, "");
  }

  const tamanhoFixo = (el) => {
    const est = estado.estilos[el.dataset.grupo] || {};
    return est.tamanho && est.tamanho !== "auto" ? parseFloat(est.tamanho) : null;
  };

  // Principais obras: só aparecem as preenchidas (título ou imagem), centralizadas.
  // Se nenhuma estiver preenchida, mostra um espaço só, para o aluno ver onde vai.
  function atualizarObras() {
    const usadas = [1, 2, 3].filter((i) => (estado.textos["obra" + i] || "").trim() || estado.imagens["imgobra" + i]);
    const visiveis = usadas.length ? usadas : [1];
    [1, 2, 3].forEach((i) => { saida("obra" + i).closest(".obra").hidden = !visiveis.includes(i); });
    cartaz.querySelector(".obras-lista").style.gridTemplateColumns = `repeat(${visiveis.length}, minmax(0, 60mm))`;
  }

  function atualizarTexto(nome, ajustar = true) {
    const el = saida(nome);
    if (!el) return;
    const txt = textoDoCampo(nome);
    el.classList.toggle("vazio", !txt);
    el.textContent = txt || el.dataset.dica;
    el.style.fontFamily = fonteCss((estado.estilos[el.dataset.grupo] || {}).fonte);
    // muitos integrantes: a lista se divide em colunas (sempre de cima para baixo)
    if (nome === "integrantes") el.style.columnCount = String(Math.min(3, Math.max(1, Math.ceil(txt.split("\n").filter(Boolean).length / 5))));
    if (/^obra\d$/.test(nome)) atualizarObras();
    if (nome === "poema" || nome === "titulo") el.style.textAlign = estado.alinhamento === "center" ? "center" : "left";
    if (ajustar) ajustarLayout();
  }

  // As caixas crescem conforme o texto (cada coluna divide a sobra entre elas).
  // Só quando a coluna inteira não cabe é que a letra "Automático" diminui.
  // integrantes primeiro: a altura deles define quanto sobra para as colunas
  const AREAS = [document.getElementById("caixa-integrantes"), document.getElementById("caixa-turma"), document.getElementById("col-esq"), document.getElementById("col-dir")];
  const transbordaArea = (c) => c.scrollHeight > c.clientHeight + 1;

  function ajustarLayout() {
    AREAS.forEach((area) => {
      const campos = Array.from(area.querySelectorAll(".campo"));
      const auto = [];
      campos.forEach((el) => {
        const fixo = tamanhoFixo(el);
        if (fixo) el.style.fontSize = fixo + "pt";
        else auto.push(el);
      });
      const aplicar = (f) => auto.forEach((el) => {
        el.style.fontSize = Math.max(parseFloat(el.dataset.min), parseFloat(el.dataset.max) * f).toFixed(2) + "pt";
      });
      let f = 1;
      aplicar(f);
      const fMin = Math.min(1, ...auto.map((el) => parseFloat(el.dataset.min) / parseFloat(el.dataset.max)));
      while (transbordaArea(area) && f > fMin) {
        f = Math.max(fMin, f - 0.03);
        aplicar(f);
      }
      // Aviso no campo com mais texto desta área, se mesmo assim não coube
      const estourou = transbordaArea(area);
      let maior = null;
      campos.forEach((el) => {
        const n = textoDoCampo(el.dataset.saida).length;
        if (n && (!maior || n > textoDoCampo(maior.dataset.saida).length)) maior = el;
      });
      campos.forEach((el) => marcarEstouro(el.dataset.saida, estourou && el === maior));
    });
    agendarPartes();
  }

  function hostDoAviso(nome) {
    if (nome === "integrantes") return document.getElementById("lista-integrantes").parentElement;
    const alvo = form.elements[nome];
    return alvo ? alvo.closest("label") : null;
  }

  function marcarEstouro(nome, estourou) {
    const host = hostDoAviso(nome);
    if (!host) return;
    let span = host.querySelector(":scope > .estouro");
    if (estourou) {
      if (!span) { span = document.createElement("span"); span.className = "estouro"; host.appendChild(span); }
      span.textContent = "⚠ Os textos desta parte do cartaz não couberam e foram cortados. Resuma um pouco ou escolha uma letra menor.";
    } else if (span) {
      span.remove();
    }
  }

  function atualizarImagem(nome) {
    const el = saida(nome);
    const url = estado.imagens[nome];
    el.classList.toggle("vazio", !url);
    el.classList.toggle("inteira", mostraInteira(nome));
    el.style.backgroundImage = url ? `url("${url}")` : "";
    if (nome === "imgbio") { el.hidden = !url; ajustarLayout(); }
    if (nome.startsWith("imgobra")) { atualizarObras(); ajustarLayout(); }
    agendarPartes();

    const bloco = form.querySelector(`[data-img="${nome}"]`);
    const mini = bloco.querySelector(".miniatura");
    mini.style.backgroundImage = url ? `url("${url}")` : "";
    mini.classList.toggle("tem", !!url);
    bloco.querySelector(".escolher").textContent = url ? "Trocar imagem" : (nome === "foto" ? "Escolher foto" : "Escolher imagem");
    bloco.querySelector(".remover").hidden = !url;
    bloco.querySelector(".ajuste").hidden = !url;
    bloco.querySelector(".inteira").checked = mostraInteira(nome);
  }

  function atualizarTextos() {
    SAIDAS_TEXTO.forEach((n) => atualizarTexto(n, false));
    ajustarLayout();
  }

  function atualizarTudo() {
    SAIDAS_TEXTO.forEach((n) => atualizarTexto(n, false));
    IMAGENS.forEach(atualizarImagem);
    ajustarLayout();
  }

  // ------------------------------------------------------------------
  // Integrantes: lista livre (quantos forem necessários)
  // ------------------------------------------------------------------
  const listaIntegrantes = document.getElementById("lista-integrantes");

  function renderIntegrantes(focarIndice) {
    if (!Array.isArray(estado.integrantes) || !estado.integrantes.length) estado.integrantes = [""];
    listaIntegrantes.innerHTML = "";
    estado.integrantes.forEach((nome, i) => {
      const linha = document.createElement("div");
      linha.className = "linha-integrante";
      const input = document.createElement("input");
      input.type = "text"; input.maxLength = 60; input.value = nome || "";
      input.id = "integrante-" + (i + 1);
      input.setAttribute("aria-label", "Integrante " + (i + 1));
      input.placeholder = "Nome do integrante " + (i + 1);
      input.addEventListener("input", () => {
        estado.integrantes[i] = input.value;
        atualizarTexto("integrantes");
        salvar();
      });
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") { ev.preventDefault(); adicionarIntegrante(i + 1); }
      });
      const tirar = document.createElement("button");
      tirar.type = "button"; tirar.className = "btn btn-claro tirar"; tirar.textContent = "×";
      tirar.title = "Remover este integrante";
      tirar.setAttribute("aria-label", "Remover integrante " + (i + 1));
      tirar.addEventListener("click", () => {
        estado.integrantes.splice(i, 1);
        renderIntegrantes(Math.max(0, i - 1));
        atualizarTexto("integrantes");
        salvar();
      });
      linha.append(input, tirar);
      listaIntegrantes.appendChild(linha);
    });
    if (focarIndice != null) {
      const alvo = listaIntegrantes.querySelectorAll("input")[focarIndice];
      if (alvo) alvo.focus();
    }
  }

  function adicionarIntegrante(posicao) {
    const pos = posicao == null ? estado.integrantes.length : posicao;
    estado.integrantes.splice(pos, 0, "");
    renderIntegrantes(pos);
    salvar();
  }
  document.getElementById("btn-add-integrante").addEventListener("click", () => adicionarIntegrante());

  function ajustarEscala() {
    const larguraCartaz = cartaz.offsetWidth;
    if (!larguraCartaz) return;
    escala.style.transform = `scale(${moldura.clientWidth / larguraCartaz})`;
  }

  // ------------------------------------------------------------------
  // Controles de fonte e tamanho
  // ------------------------------------------------------------------
  function montarControlesDeLetra() {
    const opcoesFonte = FONTES.map((f) => `<option value="${f.id}" style="font-family:${f.css.replace(/"/g, "'")}">${f.nome}</option>`).join("");
    const opcoesTamanho = '<option value="auto">Automático (cabe na caixa)</option>' +
      TAMANHOS_LETRA.map((t) => `<option value="${t}">${t} pt</option>`).join("");

    selFonteGeral.innerHTML = '<option value="">— escolha —</option>' + opcoesFonte;
    selFonteGeral.addEventListener("change", () => {
      if (!selFonteGeral.value) return;
      form.querySelectorAll(".estilo").forEach((bloco) => {
        const g = bloco.dataset.grupo;
        estado.estilos[g] = { ...(estado.estilos[g] || {}), fonte: selFonteGeral.value };
      });
      sincronizarControles();
      atualizarTextos();
      salvar();
    });

    form.querySelectorAll(".estilo").forEach((bloco) => {
      const g = bloco.dataset.grupo;
      const sf = bloco.querySelector(".sel-fonte");
      const st = bloco.querySelector(".sel-tamanho");
      sf.innerHTML = opcoesFonte;
      st.innerHTML = opcoesTamanho;
      const aoMudar = () => {
        estado.estilos[g] = { fonte: sf.value, tamanho: st.value };
        selFonteGeral.value = "";
        SAIDAS_TEXTO.filter((n) => saida(n).dataset.grupo === g).forEach((n) => atualizarTexto(n, false));
        ajustarLayout();
        salvar();
      };
      sf.addEventListener("change", aoMudar);
      st.addEventListener("change", aoMudar);
    });
  }

  function sincronizarControles() {
    form.querySelectorAll(".estilo").forEach((bloco) => {
      const est = estado.estilos[bloco.dataset.grupo] || {};
      bloco.querySelector(".sel-fonte").value = est.fonte || "carlito";
      bloco.querySelector(".sel-tamanho").value = est.tamanho || "auto";
    });
  }

  // ------------------------------------------------------------------
  // Imagens: lê de várias formas (para funcionar em qualquer navegador),
  // reduz o tamanho e converte para JPEG leve
  // ------------------------------------------------------------------
  function carregarElementoImagem(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decodificação falhou"));
      img.src = src;
    });
  }
  function lerComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(arquivo);
    });
  }

  async function decodificar(arquivo) {
    // 1) createImageBitmap (rápido, corrige a orientação de fotos de celular)
    if (window.createImageBitmap) {
      try { return await createImageBitmap(arquivo, { imageOrientation: "from-image" }); } catch (_) {}
      try { return await createImageBitmap(arquivo); } catch (_) {}
    }
    // 2) <img> com URL temporária
    if (window.URL && URL.createObjectURL) {
      const url = URL.createObjectURL(arquivo);
      try { return await carregarElementoImagem(url); } catch (_) {} finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
    }
    // 3) <img> com data URL (funciona até quando os outros são bloqueados)
    return carregarElementoImagem(await lerComoDataUrl(arquivo));
  }

  async function prepararImagem(arquivo, ladoMax = 1800) {
    const img = await decodificar(arquivo);
    const lw = img.naturalWidth || img.width, lh = img.naturalHeight || img.height;
    if (!lw || !lh) throw new Error("imagem vazia");
    const f = Math.min(1, ladoMax / Math.max(lw, lh));
    const w = Math.max(1, Math.round(lw * f)), h = Math.max(1, Math.round(lh * f));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    if (img.close) img.close();
    return c.toDataURL("image/jpeg", 0.86);
  }

  const ehHeic = (a) => /heic|heif/i.test(a.type) || /\.(heic|heif)$/i.test(a.name || "");
  const pareceImagem = (a) => (a.type && a.type.startsWith("image/")) || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|jfif)$/i.test(a.name || "");

  async function receberArquivo(nome, arquivo) {
    if (!arquivo) return;
    if (!pareceImagem(arquivo)) {
      mostrarAviso("Esse arquivo não é uma imagem. Use uma foto em JPG ou PNG.", 5000);
      return;
    }
    mostrarAviso("Carregando imagem…");
    try {
      estado.imagens[nome] = await prepararImagem(arquivo);
      atualizarImagem(nome);
      salvarImagem(nome);
      mostrarAviso("Imagem adicionada ao cartaz ✔", 2500);
    } catch (e) {
      console.error(e);
      mostrarAviso(ehHeic(arquivo)
        ? "Fotos do iPhone em formato HEIC não abrem neste navegador. No iPhone, vá em Ajustes › Câmera › Formatos › “Mais compatível”, ou envie a foto como JPG."
        : "Não foi possível abrir essa imagem. Tente outra, de preferência em JPG ou PNG (ou tire um print da imagem e use o print).", 9000);
    }
  }

  function imagemDaTransferencia(dt) {
    if (!dt) return null;
    const arquivos = Array.from(dt.files || []);
    const arq = arquivos.find(pareceImagem);
    if (arq) return arq;
    for (const item of Array.from(dt.items || [])) {
      if (item.kind === "file" && item.type.startsWith("image/")) return item.getAsFile();
    }
    return null;
  }

  // Liga as áreas de imagem: botão, miniatura, área no cartaz, arrastar e soltar
  let ultimaAreaImagem = "foto";
  form.querySelectorAll(".campo-imagem").forEach((bloco) => {
    const nome = bloco.dataset.img;
    const input = bloco.querySelector(".arquivo");
    const abrirSeletor = () => { ultimaAreaImagem = nome; input.value = ""; input.click(); };

    bloco.querySelector(".escolher").addEventListener("click", abrirSeletor);
    bloco.querySelector(".miniatura").addEventListener("click", abrirSeletor);
    saida(nome).addEventListener("click", () => { if (!cartaz.classList.contains("exportando")) abrirSeletor(); });

    input.addEventListener("change", () => {
      const arquivo = input.files && input.files[0];
      receberArquivo(nome, arquivo).finally(() => { input.value = ""; });
    });

    [bloco, saida(nome)].forEach((zona) => {
      zona.addEventListener("dragover", (ev) => { ev.preventDefault(); zona.classList.add("arrastando"); });
      zona.addEventListener("dragleave", () => zona.classList.remove("arrastando"));
      zona.addEventListener("drop", (ev) => {
        ev.preventDefault();
        zona.classList.remove("arrastando");
        const arq = imagemDaTransferencia(ev.dataTransfer);
        if (arq) receberArquivo(nome, arq);
        else mostrarAviso("Arraste um arquivo de imagem salvo no computador (JPG ou PNG).", 5000);
      });
      zona.addEventListener("focusin", () => { ultimaAreaImagem = nome; });
      zona.addEventListener("pointerdown", () => { ultimaAreaImagem = nome; });
    });

    bloco.querySelector(".remover").addEventListener("click", () => {
      delete estado.imagens[nome];
      atualizarImagem(nome);
      salvarImagem(nome);
    });
    bloco.querySelector(".inteira").addEventListener("change", (ev) => {
      estado.inteira[nome] = ev.target.checked;
      atualizarImagem(nome);
      salvar();
    });
  });

  // Evita que o navegador abra a imagem quando ela é solta fora da área certa
  window.addEventListener("dragover", (ev) => ev.preventDefault());
  window.addEventListener("drop", (ev) => ev.preventDefault());

  // Colar imagem (Ctrl+V): vai para a última área de imagem usada
  document.addEventListener("paste", (ev) => {
    const arq = imagemDaTransferencia(ev.clipboardData);
    if (!arq) return;
    ev.preventDefault();
    receberArquivo(ultimaAreaImagem, arq);
  });

  // ------------------------------------------------------------------
  // Eventos do formulário
  // ------------------------------------------------------------------
  function preencherFormulario() {
    CAMPOS_TEXTO.forEach((k) => { if (form.elements[k]) form.elements[k].value = estado.textos[k] || ""; });
    form.elements["alinhamento"].value = estado.alinhamento || "left";
    sincronizarControles();
    renderIntegrantes();
  }

  form.addEventListener("input", (ev) => {
    const alvo = ev.target;
    if (!alvo.name || !CAMPOS_TEXTO.includes(alvo.name)) return;
    estado.textos[alvo.name] = alvo.value;
    atualizarTexto(alvo.name);
    salvar();
  });
  form.addEventListener("change", (ev) => {
    if (ev.target.name === "alinhamento") {
      estado.alinhamento = ev.target.value;
      atualizarTexto("titulo", false);
      atualizarTexto("poema");
      salvar();
    }
  });

  document.getElementById("btn-exemplo").addEventListener("click", async () => {
    const ok = await confirmar("Ver o exemplo da Auta de Souza?",
      "<p>O cartaz será preenchido com o exemplo da poeta <b>Auta de Souza</b> e o poema <b>Fio partido</b>.</p>" +
      "<p>O que já estiver preenchido neste navegador (textos e imagens) será substituído.</p>",
      "Carregar exemplo", "Cancelar");
    if (!ok) return;
    estado = estadoInicial();
    estado.textos = { ...estado.textos, ...EXEMPLO.textos };
    estado.integrantes = [...EXEMPLO.integrantes];
    estado.alinhamento = EXEMPLO.alinhamento;
    try { IMAGENS.forEach((n) => localStorage.removeItem(CHAVE + "-img-" + n)); } catch (_) {}
    BD.limpar().catch(() => {});
    salvar();
    preencherFormulario();
    atualizarTudo();
    window.scrollTo({ top: 0 });
    mostrarAviso("Exemplo carregado! Agora coloque as imagens: foto da poeta e capas das obras.", 6000);
  });

  document.getElementById("btn-limpar").addEventListener("click", async () => {
    if (!(await confirmar("Apagar tudo?", "Todos os textos e imagens do cartaz serão apagados.", "Apagar tudo", "Cancelar"))) return;
    estado = estadoInicial();
    try {
      localStorage.removeItem(CHAVE);
      IMAGENS.forEach((n) => localStorage.removeItem(CHAVE + "-img-" + n));
    } catch (_) {}
    BD.limpar().catch(() => {});
    selFonteGeral.value = "";
    preencherFormulario();
    atualizarTudo();
  });

  // Abas no celular
  document.querySelectorAll(".aba").forEach((aba) => {
    aba.addEventListener("click", () => {
      document.querySelectorAll(".aba").forEach((a) => a.classList.toggle("ativa", a === aba));
      document.body.classList.toggle("modo-preview", aba.dataset.mostrar === "preview");
      ajustarEscala();
      window.scrollTo({ top: 0 });
    });
  });

  // ------------------------------------------------------------------
  // Janela de diálogo própria (confirm/alert do navegador são bloqueados
  // quando o arquivo é aberto dentro de visualizações como Drive/WhatsApp)
  // ------------------------------------------------------------------
  const dialogo = document.getElementById("dialogo");
  function abrirDialogo(titulo, corpoHtml, botoes) {
    return new Promise((resolve) => {
      document.getElementById("dialogo-titulo").textContent = titulo;
      document.getElementById("dialogo-corpo").innerHTML = corpoHtml;
      const area = document.getElementById("dialogo-botoes");
      area.innerHTML = "";
      botoes.forEach((b) => {
        const el = document.createElement(b.href ? "a" : "button");
        if (b.href) {
          el.href = b.href;
          if (b.download) el.download = b.download;
          if (b.novaAba) { el.target = "_blank"; el.rel = "noopener"; }
        } else {
          el.type = "button";
        }
        el.className = b.principal ? "btn-principal" : "btn btn-claro";
        el.textContent = b.texto;
        el.addEventListener("click", () => {
          if (b.acao) b.acao();
          if (b.fecha !== false) { dialogo.hidden = true; resolve(b.valor); }
        });
        area.appendChild(el);
      });
      dialogo.hidden = false;
      (area.querySelector(".btn-principal") || area.firstChild).focus();
    });
  }
  const confirmar = (titulo, corpoHtml, sim, nao) =>
    abrirDialogo(titulo, corpoHtml, [{ texto: nao, valor: false }, { texto: sim, valor: true, principal: true }]);
  const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Publicado no claude.ai: downloads passam pelo recurso "downloads" da página
  const emClaude = !!(window.claude && typeof window.claude.use === "function");
  const downloadsClaude = emClaude
    ? Promise.resolve().then(() => window.claude.use("downloads")).catch(() => null)
    : Promise.resolve(null);
  const emVisualizacao = !emClaude && (() => { try { return window.self !== window.top; } catch (_) { return true; } })();
  if (emVisualizacao) document.getElementById("faixa-preview").hidden = false;

  // ------------------------------------------------------------------
  // Aviso
  // ------------------------------------------------------------------
  let timerAviso;
  function mostrarAviso(msg, ms) {
    clearTimeout(timerAviso);
    aviso.textContent = msg;
    aviso.hidden = false;
    if (ms) timerAviso = setTimeout(esconderAviso, ms);
  }
  function esconderAviso() { aviso.hidden = true; }

  // ------------------------------------------------------------------
  // Gerar PDF
  // ------------------------------------------------------------------
  const TAMANHOS = { a3: { w: 297, h: 420 }, a4: { w: 210, h: 297 } };

  // Cartaz no projeto: 500 x 732,5 mm. Impressão em 4 x 4 folhas A4 retrato.
  const CARTAZ_W = 500, CARTAZ_H = 732.5;
  const GRADE = 4;
  const PEDACO_W = CARTAZ_W / GRADE, PEDACO_H = CARTAZ_H / GRADE;   // pedaço do projeto em cada folha
  const A4 = { w: 210, h: 297 };
  const IMPRESSO_H = 285;                                             // altura impressa de cada pedaço (6 mm de margem)
  const IMPRESSO_W = IMPRESSO_H * PEDACO_W / PEDACO_H;                // ≈ 194,5 mm
  const MARGEM_X = (A4.w - IMPRESSO_W) / 2, MARGEM_Y = (A4.h - IMPRESSO_H) / 2;
  const LINHAS = ["A", "B", "C", "D"];
  const nomeFolha = (l, c) => LINHAS[l] + (c + 1);

  // Linhas e rótulos das folhas na pré-visualização
  (function montarGrade() {
    const grade = document.getElementById("grade-folhas");
    for (let i = 1; i < GRADE; i++) {
      const v = document.createElement("div"); v.className = "corte v"; v.style.left = (PEDACO_W * i) + "mm"; grade.appendChild(v);
      const h = document.createElement("div"); h.className = "corte h"; h.style.top = (PEDACO_H * i) + "mm"; grade.appendChild(h);
    }
    for (let l = 0; l < GRADE; l++) for (let c = 0; c < GRADE; c++) {
      const r = document.createElement("div"); r.className = "rotulo-folha"; r.textContent = nomeFolha(l, c);
      r.style.left = (PEDACO_W * c + 26) + "mm"; r.style.top = (PEDACO_H * l + 25) + "mm";
      if (c === 0) r.style.left = (PEDACO_W * c + 26) + "mm";
      grade.appendChild(r);
    }
    grade.hidden = true; // aparece só no modo "Com divisão das folhas"
  })();

  // ------------------------------------------------------------------
  // Pré-visualização "Impresso em partes": as 16 folhas como saem da impressora
  // ------------------------------------------------------------------
  const mesa = document.getElementById("mesa");
  const molduraPartes = document.getElementById("moldura-partes");
  const gradeFolhas = document.getElementById("grade-folhas");

  function montarPartes() {
    if (modoPrevia !== "partes") return;
    const base = cartaz.cloneNode(true);
    base.removeAttribute("id");
    base.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
    base.classList.add("exportando"); // igual ao impresso: sem dicas nem linhas
    const frag = document.createDocumentFragment();
    for (let l = 0; l < GRADE; l++) for (let c = 0; c < GRADE; c++) {
      const folha = document.createElement("div");
      folha.className = "folha-a4";
      folha.title = "Folha " + nomeFolha(l, c);
      const janela = document.createElement("div");
      janela.className = "janela";
      const escalaFolha = document.createElement("div");
      const copia = (l === GRADE - 1 && c === GRADE - 1) ? base : base.cloneNode(true);
      copia.style.position = "absolute";
      copia.style.left = (-PEDACO_W * c) + "mm";
      copia.style.top = (-PEDACO_H * l) + "mm";
      escalaFolha.appendChild(copia);
      janela.appendChild(escalaFolha);
      folha.appendChild(janela);
      ["se", "sd", "ie", "id"].forEach((m) => { const k = document.createElement("span"); k.className = "marca " + m; folha.appendChild(k); });
      const etq = document.createElement("div");
      etq.className = "etiqueta";
      etq.textContent = nomeFolha(l, c);
      folha.appendChild(etq);
      frag.appendChild(folha);
    }
    mesa.replaceChildren(frag);
    escalarPartes();
  }

  function escalarPartes() {
    if (modoPrevia !== "partes") return;
    const pxPorMm = cartaz.offsetWidth / CARTAZ_W;
    if (!pxPorMm) return;
    mesa.querySelectorAll(".janela").forEach((j) => {
      j.firstChild.style.transform = `scale(${j.clientWidth / (PEDACO_W * pxPorMm)})`;
    });
  }

  let timerPartes;
  function agendarPartes() {
    if (modoPrevia !== "partes") return;
    clearTimeout(timerPartes);
    timerPartes = setTimeout(montarPartes, 250);
  }

  function mudarModo(m) {
    modoPrevia = ["limpo", "inteiro", "partes"].includes(m) ? m : "limpo";
    document.querySelectorAll(".modo").forEach((b) => {
      const ativo = b.dataset.modo === modoPrevia;
      b.classList.toggle("ativo", ativo);
      b.setAttribute("aria-selected", ativo ? "true" : "false");
    });
    molduraPartes.hidden = modoPrevia !== "partes";
    // fora da tela (não oculto): o ajuste do texto continua medindo o cartaz
    moldura.classList.toggle("fora-da-tela", modoPrevia === "partes");
    gradeFolhas.hidden = modoPrevia !== "inteiro";
    try { localStorage.setItem(CHAVE + "-modo", modoPrevia); } catch (_) {}
    if (modoPrevia === "partes") montarPartes(); else ajustarEscala();
  }
  document.querySelectorAll(".modo").forEach((b) => b.addEventListener("click", () => mudarModo(b.dataset.modo)));
  window.addEventListener("resize", escalarPartes);
  if (window.ResizeObserver) new ResizeObserver(escalarPartes).observe(molduraPartes);

  function nomeArquivo() {
    const base = (estado.textos.nome || "cartaz").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
    const sufixo = selTamanho.value === "a4x16" ? "-16-folhas-A4" : "-" + selTamanho.value;
    return `vozes-negras-${base || "cartaz"}${sufixo}.pdf`;
  }

  function camposVazios() {
    const faltando = [];
    const rotulos = { nome: "Nome do poeta", bio: "Biografia", represent: "Representatividade", titulo: "Título do poema", poema: "Poema", eulirico: "Eu lírico", figura: "Figura de linguagem" };
    Object.keys(rotulos).forEach((k) => { if (!(estado.textos[k] || "").trim()) faltando.push(rotulos[k]); });
    if (!textoDoCampo("integrantes")) faltando.push("Integrantes");
    if (!estado.imagens.foto) faltando.push("Foto do poeta");
    return faltando;
  }

  let ultimoPdfUrl = null;

  // Desenha um elemento num canvas com a largura pedida (em px).
  // Se faltar memória (celulares), tenta de novo com menos resolução.
  let fatorMemoria = 1;
  async function capturar(elemento, alvoPx) {
    const larguraPx = elemento.offsetWidth;
    for (const fator of [1, 0.7, 0.5, 0.35].filter((f) => f <= fatorMemoria)) {
      try {
        const canvas = await window.html2canvas(elemento, {
          scale: (alvoPx * fator) / larguraPx,
          backgroundColor: "#F6E7D2",
          useCORS: true,
          logging: false,
        });
        const teste = canvas.getContext("2d").getImageData(canvas.width >> 1, canvas.height >> 1, 1, 1).data;
        if (canvas.width > 10 && teste[3] !== 0) { fatorMemoria = fator; return canvas; }
      } catch (e) {
        console.warn("Falhou com fator", fator, e);
      }
    }
    throw new Error("Não foi possível desenhar o cartaz (memória insuficiente).");
  }

  const recorte = (canvas, x, y, w, h) => {
    const c = document.createElement("canvas");
    c.width = Math.round(w); c.height = Math.round(h);
    c.getContext("2d").drawImage(canvas, x, y, w, h, 0, 0, c.width, c.height);
    return c;
  };

  // PDF de 1 página (prévia em A3/A4)
  async function pdfFolhaUnica(copia) {
    const t = TAMANHOS[selTamanho.value] || TAMANHOS.a4;
    const canvas = await capturar(copia, selTamanho.value === "a3" ? 2600 : 2480);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: [t.w, t.h], orientation: "portrait", compress: true });
    const proporcao = CARTAZ_W / CARTAZ_H;
    let w = t.w, h = t.w / proporcao;
    if (h > t.h) { h = t.h; w = h * proporcao; }
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", (t.w - w) / 2, (t.h - h) / 2, w, h, undefined, "FAST");
    return pdf;
  }

  // PDF do banner: mapa de montagem + 16 folhas A4 com marcas de corte
  async function pdfDezesseisFolhas(copia, palco) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

    // faixa = uma linha de 4 folhas (o cartaz inteiro de largura, 1/4 da altura)
    const faixa = document.createElement("div");
    faixa.style.cssText = `position:relative;overflow:hidden;width:${CARTAZ_W}mm;height:${PEDACO_H}mm;background:#F6E7D2`;
    palco.appendChild(faixa);
    copia.style.position = "absolute";
    copia.style.left = "0";
    faixa.appendChild(copia);

    // ~150 dpi no tamanho impresso
    const pxPorMmImpresso = 150 / 25.4;
    const alvoFaixaPx = Math.round(IMPRESSO_W * GRADE * pxPorMmImpresso);

    const miniatura = document.createElement("canvas");
    miniatura.width = 1000;
    miniatura.height = Math.round(1000 * CARTAZ_H / CARTAZ_W);
    const ctxMini = miniatura.getContext("2d");

    const folhas = [];
    for (let l = 0; l < GRADE; l++) {
      mostrarAviso(`Gerando o PDF… parte ${l + 1} de ${GRADE}`);
      copia.style.top = (-PEDACO_H * l) + "mm";
      const canvas = await capturar(faixa, alvoFaixaPx);
      ctxMini.drawImage(canvas, 0, Math.round(miniatura.height * l / GRADE), miniatura.width, Math.ceil(miniatura.height / GRADE));
      const pw = canvas.width / GRADE;
      for (let c = 0; c < GRADE; c++) {
        folhas.push({ l, c, img: recorte(canvas, pw * c, 0, pw, canvas.height).toDataURL("image/jpeg", 0.9) });
      }
    }

    // Página 1: mapa de montagem
    const titulo = "Vozes negras do Nordeste" + (estado.textos.nome ? " – " + estado.textos.nome : "");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(16); pdf.setTextColor(58, 30, 18);
    pdf.text("Mapa de montagem do banner (16 folhas A4)", 105, 16, { align: "center" });
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
    pdf.text(titulo, 105, 22, { align: "center" });
    const mapaH = 190, mapaW = mapaH * CARTAZ_W / CARTAZ_H, mapaX = (210 - mapaW) / 2, mapaY = 28;
    pdf.addImage(miniatura.toDataURL("image/jpeg", 0.85), "JPEG", mapaX, mapaY, mapaW, mapaH, undefined, "FAST");
    pdf.setDrawColor(31, 122, 140); pdf.setLineWidth(0.4);
    pdf.rect(mapaX, mapaY, mapaW, mapaH);
    for (let i = 1; i < GRADE; i++) {
      pdf.line(mapaX + mapaW * i / GRADE, mapaY, mapaX + mapaW * i / GRADE, mapaY + mapaH);
      pdf.line(mapaX, mapaY + mapaH * i / GRADE, mapaX + mapaW, mapaY + mapaH * i / GRADE);
    }
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
    for (let l = 0; l < GRADE; l++) for (let c = 0; c < GRADE; c++) {
      const cx = mapaX + mapaW * c / GRADE + 7.5, cy = mapaY + mapaH * l / GRADE + 5.5;
      pdf.setFillColor(31, 122, 140); pdf.roundedRect(cx - 6, cy - 4, 12, 8, 1.5, 1.5, "F");
      pdf.setTextColor(255, 255, 255); pdf.text(nomeFolha(l, c), cx, cy + 1.6, { align: "center" });
    }
    pdf.setTextColor(42, 26, 18); pdf.setFont("helvetica", "normal"); pdf.setFontSize(10.5);
    const tamanhoFinal = `${Math.round(IMPRESSO_W * GRADE / 10)} × ${Math.round(IMPRESSO_H * GRADE / 10)} cm`;
    const passos = [
      "1. Imprima as páginas 2 a 17 em papel A4, retrato, em TAMANHO REAL (100%).",
      "    Desmarque \"Ajustar à página\" na janela de impressão.",
      "2. Em cada folha, recorte a margem branca seguindo as marcas de corte dos cantos.",
      "3. Monte na ordem do mapa: linhas A, B, C, D de cima para baixo;",
      "    colunas 1, 2, 3, 4 da esquerda para a direita (A1 fica no canto de cima, à esquerda).",
      "4. Cole as folhas por trás com fita adesiva ou numa cartolina/papel pardo.",
      `Tamanho final do banner: cerca de ${tamanhoFinal}.`,
    ];
    passos.forEach((t, i) => pdf.text(t, 18, mapaY + mapaH + 10 + i * 6));

    // Páginas 2 a 17: uma folha para cada pedaço
    folhas.forEach(({ l, c, img }, i) => {
      pdf.addPage("a4", "portrait");
      pdf.addImage(img, "JPEG", MARGEM_X, MARGEM_Y, IMPRESSO_W, IMPRESSO_H, undefined, "FAST");
      // marcas de corte nos 4 cantos (fora da imagem)
      pdf.setDrawColor(120, 120, 120); pdf.setLineWidth(0.2);
      const x0 = MARGEM_X, y0 = MARGEM_Y, x1 = MARGEM_X + IMPRESSO_W, y1 = MARGEM_Y + IMPRESSO_H, m = 4.5, g = 0.8;
      [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]].forEach(([x, y, dx, dy]) => {
        pdf.line(x + dx * g, y, x + dx * m, y);
        pdf.line(x, y + dy * g, x, y + dy * m);
      });
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5); pdf.setTextColor(110, 110, 110);
      pdf.text(`Folha ${nomeFolha(l, c)}  ·  linha ${LINHAS[l]}, coluna ${c + 1}  ·  página ${i + 2} de 17  ·  imprimir em tamanho real (100%)`,
        105, A4.h - 1.8, { align: "center" });
    });
    return pdf;
  }

  function baixarAutomatico(url, nome) {
    try {
      const a = document.createElement("a");
      a.href = url; a.download = nome; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
    } catch (_) {}
  }

  async function gerarPdf() {
    const faltando = camposVazios();
    if (faltando.length) {
      const ok = await confirmar("Ainda falta preencher",
        "<ul>" + faltando.map((f) => "<li>" + escapar(f) + "</li>").join("") + "</ul>Quer gerar o PDF mesmo assim?",
        "Gerar mesmo assim", "Voltar e preencher");
      if (!ok) return;
    }
    if (!window.html2canvas || !window.jspdf) {
      erroPdf("As ferramentas de PDF não carregaram nesta página.");
      return;
    }

    btnPdf.disabled = true;
    btnPdf.textContent = "Gerando…";
    mostrarAviso("Gerando o PDF… isso pode levar alguns segundos.");
    const palco = document.createElement("div");
    palco.className = "palco-export";
    try {
      try { await document.fonts.ready; } catch (_) {}
      const copia = cartaz.cloneNode(true);
      copia.removeAttribute("id");
      copia.classList.add("exportando");
      palco.appendChild(copia);
      document.body.appendChild(palco);

      fatorMemoria = 1;
      const pdf = selTamanho.value === "a4x16" ? await pdfDezesseisFolhas(copia, palco) : await pdfFolhaUnica(copia);
      pdf.setProperties({ title: "Vozes negras do Nordeste" + (estado.textos.nome ? " – " + estado.textos.nome : "") });

      const blob = pdf.output("blob");
      if (ultimoPdfUrl) URL.revokeObjectURL(ultimoPdfUrl);
      ultimoPdfUrl = URL.createObjectURL(blob);
      const nome = nomeArquivo();
      esconderAviso();

      const dl = await downloadsClaude;
      if (dl) {
        await salvarPeloClaude(dl, blob, nome);
        return;
      }
      baixarAutomatico(ultimoPdfUrl, nome);

      abrirDialogo("PDF pronto! ✔",
        `<p>O download de <b>${escapar(nome)}</b> deve começar sozinho. Se não começar, clique em <b>Baixar PDF</b>.</p>` +
        (emVisualizacao ? '<p class="nota">⚠ O arquivo está aberto numa visualização, que pode bloquear downloads. Se nada funcionar, baixe o arquivo do cartaz e abra-o no Chrome ou Edge.</p>' : "") +
        '<p class="nota">No celular, o PDF fica em <b>Downloads</b> ou em <b>Arquivos</b>.</p>',
        [
          { texto: "Fechar", valor: null },
          { texto: "Imprimir / Salvar", acao: imprimir, fecha: true },
          { texto: "Abrir PDF", href: ultimoPdfUrl, novaAba: true, fecha: false },
          { texto: "Baixar PDF", href: ultimoPdfUrl, download: nome, principal: true, fecha: false },
        ]);
    } catch (e) {
      console.error(e);
      erroPdf(e && e.message ? e.message : String(e));
    } finally {
      palco.remove();
      btnPdf.disabled = false;
      btnPdf.textContent = "Gerar PDF";
    }
  }

  // Salvar pela página publicada (o visualizador pede confirmação ao aluno)
  async function salvarPeloClaude(dl, blob, nome) {
    try {
      await dl.save({ filename: nome, data: blob });
      abrirDialogo("PDF salvo! ✔",
        `<p>O arquivo <b>${escapar(nome)}</b> foi salvo.</p><p class="nota">No computador, procure na pasta <b>Downloads</b>. No celular, em <b>Downloads</b> ou <b>Arquivos</b>.</p>`,
        [{ texto: "Fechar", valor: null, principal: true }]);
    } catch (e) {
      const code = e && e.code;
      if (code === "declined" || code === "rate_limited") {
        abrirDialogo(code === "declined" ? "Download cancelado" : "Aguarde um instante",
          "<p>O PDF já está pronto. Clique em <b>Baixar PDF</b> para salvar.</p>",
          [{ texto: "Fechar", valor: null }, { texto: "Baixar PDF", principal: true, acao: () => salvarPeloClaude(dl, blob, nome) }]);
      } else {
        erroPdf("Este visualizador não permitiu salvar o arquivo (" + (code || "erro") + "). Baixe o arquivo do app e abra-o no Chrome ou Edge.");
      }
    }
  }

  function imprimir() {
    setTimeout(() => {
      try { window.print(); } catch (_) {}
    }, 100);
  }

  function erroPdf(detalhe) {
    esconderAviso();
    abrirDialogo("Não consegui gerar o PDF",
      "<p>Tente uma destas opções:</p><ul>" +
      "<li>Clique em <b>Imprimir / Salvar</b> e escolha <b>Salvar como PDF</b> como impressora.</li>" +
      "<li>Baixe o arquivo do cartaz e abra-o direto no <b>Chrome</b> ou <b>Edge</b> (não pela visualização do Drive, Classroom ou WhatsApp).</li>" +
      "<li>Use imagens menores e tente de novo.</li></ul>" +
      `<p class="nota">Detalhe do erro: ${escapar(detalhe)}</p>`,
      [{ texto: "Fechar", valor: null }, { texto: "Imprimir / Salvar", acao: imprimir, principal: true }]);
  }

  btnPdf.addEventListener("click", gerarPdf);

  // ------------------------------------------------------------------
  // App instalável (PWA): funciona sem internet e pode ir para a tela inicial
  // ------------------------------------------------------------------
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !emClaude) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
  const btnInstalar = document.getElementById("btn-instalar");
  let pedidoInstalacao = null;
  window.addEventListener("beforeinstallprompt", (ev) => {
    ev.preventDefault();
    pedidoInstalacao = ev;
    btnInstalar.hidden = false;
  });
  btnInstalar.addEventListener("click", async () => {
    if (!pedidoInstalacao) return;
    pedidoInstalacao.prompt();
    try { await pedidoInstalacao.userChoice; } catch (_) {}
    pedidoInstalacao = null;
    btnInstalar.hidden = true;
  });
  window.addEventListener("appinstalled", () => { btnInstalar.hidden = true; });

  // ------------------------------------------------------------------
  // Início
  // ------------------------------------------------------------------
  montarControlesDeLetra();
  window.addEventListener("resize", ajustarEscala);
  if (window.ResizeObserver) new ResizeObserver(ajustarEscala).observe(moldura);
  ajustarEscala();
  try { const m = localStorage.getItem(CHAVE + "-modo"); if (m && m !== "limpo") mudarModo(m); } catch (_) {}
  carregar().then(() => {
    preencherFormulario();
    atualizarTudo();
  });
  // Recalcula quando as fontes terminarem de carregar
  document.fonts.ready.then(() => { atualizarTudo(); ajustarEscala(); });
  // Fontes usadas só depois (ao trocar de fonte) também precisam de recálculo
  if (document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", atualizarTextos);
})();
