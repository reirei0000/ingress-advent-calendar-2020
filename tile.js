(function(){
  var start_time = new Date()
  var mondai_no = null;
  var narabi;
  var nokori;
  var gamename;
  var yoko = 10;
  var level = 50;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function start() {
    console.log("log click");
    console.log(touchtile)
    start_time = new Date()

    elm_btn_div = document.getElementById('btn_div');
    elm_btn_div.style.display = "none";

    elm_glyph = document.getElementById('btn_glyph');
    elm_karuta = document.getElementById('btn_karuta');
    elm_tatsuno = document.getElementById('btn_tatsuno');
    if (elm_glyph.checked) {
      gamename = "glyph"
      glyphs = touchtile.data.glyphs;
    } else if (elm_karuta.checked) {
      gamename = "ingresskaruta"
      glyphs = touchtile.data.ingresskaruta;
    } else if (elm_tatsuno.checked) {
      gamename = "portal"
      glyphs = touchtile.data.tatsuno;
    } else {
      gamename = "sakyu"
      glyphs = touchtile.data.sakyu;
    }

    max_mondai = glyphs.length > level ? level : glyphs.length;
    narabi = shuffle([...Array(glyphs.length)].map((_, v) => v)).concat([...Array(level)].map(v => -1));
    narabi = narabi.slice(0, level)

    scale = window.innerWidth / yoko * .95;

    hint = document.getElementById('btn_hint');

    main = document.getElementById('tileboard');
    main.innerHTML = "";
    narabi = narabi.map((v, i) => {
      waku = document.createElement("div")
      waku.style.float = "left";
      waku.style.width = `${scale | 0}px`;
      img = document.createElement("img")
      img.style.width = `${scale | 0}px`;
      if (i >= max_mondai) {
        img.src = `resources/${gamename}/bg.jpg`;
        name = ""
        id = -1;
      } else {
        img.src = `resources/${gamename}/${glyphs[v]['answer']}.jpg`;
        img.addEventListener('mousedown', function(e) { compare(e, glyphs[v]['answer']) }, false);
        img.addEventListener('touchstart', function(e) { compare(e, glyphs[v]['answer']) }, false);
        name = glyphs[v]['answer'];
        id = v;
      }
      waku.appendChild(img);
      lbl = document.createElement("div")
      lbl.style.width = `${scale | 0}px`;
      lbl.style.height = '24px';
      lbl.innerHTML = name.slice(0, 12);
      lbl.style.whiteSpace = "nowrap";
      lbl.className = "hint";
      waku.appendChild(lbl);

      main.appendChild(waku);
      return {"id": id, "img": waku};
    });

    nokori = narabi.filter((v) => v.id >= 0);
    mondai_no = null;
    console.log(narabi);
    console.log(nokori);

    change_hint()
    next();
  }

  function next() {
    if (mondai_no !== null) {
        nokori = nokori.filter(v => v.id !== mondai_no);
        narabi = narabi.map(v => v.id == mondai_no ? {"id": -1, "img": v.img} : v)
    }

    s = document.getElementById('btn_shuffle');
    if (s.checked) {
      narabi = shuffle(narabi)
      main = document.getElementById('tileboard');
      main.innerHTML = "";
    }
    console.log(narabi)
    narabi.forEach((v, i) => {
      if (s.checked) {
        main.appendChild(v.img);
      }
      console.log(v)
      if (v.id >= 0)
        v.img.style.visibility = "visible";
      else
        v.img.style.visibility = "hidden";
    });
    console.log(nokori)

    if (nokori.length == 0) {
      mondai_no = null;
      document.getElementById('question').innerHTML = ''
      name = gamename == 'glyph' ? 'グリフゲーム' : '非公式Ingressかるた(Ver2020)'
      cleartime = document.getElementById('time').innerHTML

      endboard = document.getElementById('endboard').innerHTML = `<br><br>クリア！<a href="https://twitter.com/share?url=https://reirei0000.github.io/ingress-advent-calendar-2020/&hashtags=ingadv2020,ingress&text=${name} クリアタイム: ${cleartime}">スコアをTweetする</a>`
      return
    }

    mondai_no = nokori[Math.floor(Math.random() * nokori.length)].id;
    console.log(`mondai_no=${mondai_no}`);
    document.getElementById('question').innerHTML = `${glyphs[mondai_no]['question']}`
  }

  function compare(e, tap) {
    console.log(tap);
    console.log(mondai_no);
    if (glyphs[mondai_no]['answer'] == tap)
        next();
  }

  function change_hint() {
    e = document.getElementById('btn_hint')
    console.log(e);
    Array.from(document.getElementsByClassName('hint')).forEach(v => {
      console.log(v);
      if (e.checked)
        v.className = 'hint';
      else
        v.className = 'hint nohint';
      })
  }
  function start_loop() {
    document.getElementById('btn_start').addEventListener('click', start, false);
    document.getElementById('btn_hint').addEventListener('change', change_hint, false);
    setInterval(loop, 16)
  }

  function loop() {
    if (mondai_no == null)
      return

    diff = new Date() - start_time;
    h = parseInt(diff / 1000 / 60 / 60 % 60); 
    m = parseInt(diff / 1000 / 60 % 60);
    s = parseInt(diff / 1000 % 60);
    mil = diff % 1000;
    document.getElementById('time').innerHTML = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(mil).padStart(3, "0")}`
  }

  window.addEventListener('load', start_loop, false);
})();
