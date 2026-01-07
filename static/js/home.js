// Three.js افکت خطوط برای بخش آمار
const vrt = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frg = `
precision highp float;

uniform float iTime;
uniform vec3  iRes;
uniform float spd;

uniform bool enT;
uniform bool enM;
uniform bool enB;

uniform int cntT;
uniform int cntM;
uniform int cntB;

uniform float dstT;
uniform float dstM;
uniform float dstB;

uniform vec3 posT;
uniform vec3 posM;
uniform vec3 posB;

uniform vec2 iMs;
uniform bool act;
uniform float rad;
uniform float str;
uniform float inf;

uniform bool prlx;
uniform float prlxStr;
uniform vec2 prlxOf;

const vec3 BLK = vec3(0.0);
const vec3 PNK = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLU = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rot(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 bgCol(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLU, BLK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PNK, BLK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

float wav(vec2 uv, float of, vec2 scr, vec2 ms, bool bnd) {
  float t = iTime * spd;
  float x_of = of;
  float x_mv = t * 0.1;
  float amp = sin(of + t * 0.2) * 0.3;
  float y = sin(uv.x + x_of + x_mv) * amp;

  if (bnd) {
    vec2 d = scr - ms;
    float inf = exp(-dot(d, d) * rad);
    float bndOf = (ms.y - scr.y) * inf * str * inf;
    y += bndOf;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragCol, in vec2 fragCrd) {
  vec2 base = (2.0 * fragCrd - iRes.xy) / iRes.y;
  base.y *= -1.0;
  
  if (prlx) {
    base += prlxOf;
  }

  vec3 col = vec3(0.0);
  vec3 b = bgCol(base);

  vec2 ms = vec2(0.0);
  if (act) {
    ms = (2.0 * iMs - iRes.xy) / iRes.y;
    ms.y *= -1.0;
  }
  
  if (enB) {
    for (int i = 0; i < cntB; ++i) {
      float fi = float(i);
      float t = fi / max(float(cntB - 1), 1.0);
      vec3 lnCol = mix(BLU, PNK, t) * 0.5;
      
      float ang = posB.z * log(length(base) + 1.0);
      vec2 ruv = base * rot(ang);
      col += lnCol * wav(
        ruv + vec2(dstB * fi + posB.x, posB.y),
        1.5 + 0.2 * fi,
        base,
        ms,
        act
      ) * 0.2;
    }
  }

  if (enM) {
    for (int i = 0; i < cntM; ++i) {
      float fi = float(i);
      float t = fi / max(float(cntM - 1), 1.0);
      vec3 lnCol = mix(BLU, PNK, t) * 0.5;
      
      float ang = posM.z * log(length(base) + 1.0);
      vec2 ruv = base * rot(ang);
      col += lnCol * wav(
        ruv + vec2(dstM * fi + posM.x, posM.y),
        2.0 + 0.15 * fi,
        base,
        ms,
        act
      );
    }
  }

  if (enT) {
    for (int i = 0; i < cntT; ++i) {
      float fi = float(i);
      float t = fi / max(float(cntT - 1), 1.0);
      vec3 lnCol = mix(BLU, PNK, t) * 0.5;
      
      float ang = posT.z * log(length(base) + 1.0);
      vec2 ruv = base * rot(ang);
      ruv.x *= -1.0;
      col += lnCol * wav(
        ruv + vec2(dstT * fi + posT.x, posT.y),
        1.0 + 0.2 * fi,
        base,
        ms,
        act
      ) * 0.1;
    }
  }

  fragCol = vec4(col, 1.0);
}

void main() {
  vec4 col = vec4(0.0);
  mainImage(col, gl_FragCoord.xy);
  gl_FragColor = col;
}
`;

// Three.js افکت ابریشمی برای هدر
const silkVrt = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const silkFrg = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

function initLn() {
    const cnv = document.getElementById('lnsBg');
    if (!cnv) return;

    const w = cnv.clientWidth;
    const h = cnv.clientHeight;

    const scn = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cam.position.z = 1;

    const rnd = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rnd.setSize(w, h);
    cnv.appendChild(rnd.domElement);

    const uni = {
        iTime: { value: 0 },
        iRes: { value: new THREE.Vector3(w, h, 1) },
        spd: { value: 1 },
        enT: { value: true },
        enM: { value: true },
        enB: { value: true },
        cntT: { value: 6 },
        cntM: { value: 6 },
        cntB: { value: 6 },
        dstT: { value: 0.05 },
        dstM: { value: 0.05 },
        dstB: { value: 0.05 },
        posT: { value: new THREE.Vector3(10, 0.5, -0.4) },
        posM: { value: new THREE.Vector3(5, 0, 0.2) },
        posB: { value: new THREE.Vector3(2, -0.7, 0.4) },
        iMs: { value: new THREE.Vector2(-1000, -1000) },
        act: { value: true },
        rad: { value: 5 },
        str: { value: -0.5 },
        inf: { value: 0 },
        prlx: { value: true },
        prlxStr: { value: 0.2 },
        prlxOf: { value: new THREE.Vector2(0, 0) }
    };

    const mat = new THREE.ShaderMaterial({
        uniforms: uni,
        vertexShader: vrt,
        fragmentShader: frg
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const msh = new THREE.Mesh(geo, mat);
    scn.add(msh);

    const clk = new THREE.Clock();
    const tgtMs = new THREE.Vector2(-1000, -1000);
    const curMs = new THREE.Vector2(-1000, -1000);
    const tgtPrlx = new THREE.Vector2(0, 0);
    const curPrlx = new THREE.Vector2(0, 0);

    function hndMs(e) {
        const rct = rnd.domElement.getBoundingClientRect();
        const x = e.clientX - rct.left;
        const y = e.clientY - rct.top;
        const dpr = rnd.getPixelRatio();
        tgtMs.set(x * dpr, (rct.height - y) * dpr);
        
        const cX = rct.width / 2;
        const cY = rct.height / 2;
        const oX = (x - cX) / rct.width;
        const oY = -(y - cY) / rct.height;
        tgtPrlx.set(oX * 0.2, oY * 0.2);
    }

    rnd.domElement.addEventListener('mousemove', hndMs);

    function rndLp() {
        uni.iTime.value = clk.getElapsedTime();
        curMs.lerp(tgtMs, 0.05);
        uni.iMs.value.copy(curMs);
        curPrlx.lerp(tgtPrlx, 0.05);
        uni.prlxOf.value.copy(curPrlx);
        rnd.render(scn, cam);
        requestAnimationFrame(rndLp);
    }
    rndLp();

    function hndRes() {
        const nwW = cnv.clientWidth;
        const nwH = cnv.clientHeight;
        rnd.setSize(nwW, nwH);
        uni.iRes.value.set(nwW, nwH, 1);
    }
    window.addEventListener('resize', hndRes);
}

function initHdrEff() {
    const cnv = document.getElementById('hdrEff');
    if (!cnv) return;

    const w = cnv.clientWidth;
    const h = cnv.clientHeight;

    const scn = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cam.position.z = 1;

    const rnd = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rnd.setSize(w, h);
    rnd.setClearColor(0x000000, 0);
    cnv.appendChild(rnd.domElement);

    const hexToRGB = (hex) => {
        hex = hex.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        return new THREE.Vector3(r, g, b);
    };

    const uni = {
        uTime: { value: 0 },
        uColor: { value: hexToRGB('#7B7481') },
        uSpeed: { value: 5 },
        uScale: { value: 1 },
        uRotation: { value: 0 },
        uNoiseIntensity: { value: 1.5 }
    };

    const mat = new THREE.ShaderMaterial({
        uniforms: uni,
        vertexShader: silkVrt,
        fragmentShader: silkFrg,
        transparent: true
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const msh = new THREE.Mesh(geo, mat);
    scn.add(msh);

    const clk = new THREE.Clock();

    function rndLp() {
        uni.uTime.value = clk.getElapsedTime() * 0.1;
        rnd.render(scn, cam);
        requestAnimationFrame(rndLp);
    }
    rndLp();

    function hndRes() {
        const nwW = cnv.clientWidth;
        const nwH = cnv.clientHeight;
        rnd.setSize(nwW, nwH);
    }
    window.addEventListener('resize', hndRes);
}

function cntAnm() {
    const nums = document.querySelectorAll('.num-s');
    const vals = [245, 189, 12, 100];
    const durs = [2000, 1800, 1500, 2200];
    
    nums.forEach((num, idx) => {
        const trg = vals[idx];
        const dur = durs[idx];
        const inc = trg / (dur / 16);
        let cur = 0;
        
        const upd = () => {
            cur += inc;
            const prog = cur / trg;
            const sz = 2.5 + (prog * 1.5);
            num.style.fontSize = `${sz}rem`;
            
            if (cur < trg) {
                num.textContent = Math.floor(cur);
                requestAnimationFrame(upd);
            } else {
                num.textContent = trg;
                num.style.fontSize = '4rem';
                num.classList.add('grw');
            }
        };
        
        upd();
    });
}

class Sld {
    constructor() {
        this.sds = document.querySelectorAll('.rev-sd');
        this.dts = document.querySelectorAll('.dot');
        this.prev = document.querySelector('.prev');
        this.next = document.querySelector('.next');
        this.idx = 0;
        this.tot = this.sds.length;
        
        this.init();
    }
    
    init() {
        this.prev.addEventListener('click', () => this.prevSd());
        this.next.addEventListener('click', () => this.nextSd());
        
        this.dts.forEach(dt => {
            dt.addEventListener('click', (e) => {
                const i = parseInt(e.target.dataset.idx);
                this.goTo(i);
            });
        });
        
        this.upd();
        
        setInterval(() => this.nextSd(), 5000);
    }
    
    upd() {
        this.sds.forEach((sd, i) => {
            sd.classList.remove('sd-act', 'sd-prev', 'sd-next');
            
            if (i === this.idx) {
                sd.classList.add('sd-act');
            } else if (i === (this.idx - 1 + this.tot) % this.tot) {
                sd.classList.add('sd-prev');
            } else if (i === (this.idx + 1) % this.tot) {
                sd.classList.add('sd-next');
            }
        });
        
        this.dts.forEach((dt, i) => {
            dt.classList.toggle('act', i === this.idx);
        });
    }
    
    nextSd() {
        this.idx = (this.idx + 1) % this.tot;
        this.upd();
    }
    
    prevSd() {
        this.idx = (this.idx - 1 + this.tot) % this.tot;
        this.upd();
    }
    
    goTo(i) {
        this.idx = i;
        this.upd();
    }
}

function initFrm() {
    const frm = document.getElementById('cntFrm');
    
    frm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const dat = {
            nam: document.getElementById('frm-n').value,
            eml: document.getElementById('frm-e').value,
            tel: document.getElementById('frm-t').value,
            sub: document.getElementById('frm-s').value,
            msg: document.getElementById('frm-msg').value
        };
        
        if (dat.nam && dat.eml && dat.msg) {
            alert('پیام شما با موفقیت ارسال شد! به زودی با شما تماس می‌گیریم.');
            frm.reset();
        } else {
            alert('لطفا فیلدهای ضروری را پر کنید.');
        }
    });
}

document.getElementById('btnH').addEventListener('click', function() {
    this.style.background = 'rgba(255, 255, 255, 0.3)';
    setTimeout(() => {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        alert('برای دریافت مشاوره رایگان با ما تماس بگیرید!');
    }, 300);
});

document.getElementById('btnH2').addEventListener('click', function() {
    this.style.background = 'rgba(255, 255, 255, 0.9)';
    setTimeout(() => {
        this.style.background = '#ffffff';
        alert('پروژه شما آغاز شد! به زودی با شما تماس می‌گیریم.');
    }, 300);
});

document.getElementById('btnA').addEventListener('click', function() {
    this.style.background = 'rgba(255, 255, 255, 0.3)';
    setTimeout(() => {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        alert('پروژه جدید شروع شد!');
    }, 300);
});

document.querySelectorAll('.itm-s').forEach(itm => {
    itm.addEventListener('mouseenter', function() {
        const num = this.querySelector('.num-s');
        num.style.transform = 'scale(1.1)';
    });
    
    itm.addEventListener('mouseleave', function() {
        const num = this.querySelector('.num-s');
        num.style.transform = 'scale(1)';
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const obs = new IntersectionObserver((ents) => {
        ents.forEach(ent => {
            if (ent.isIntersecting) {
                cntAnm();
                obs.unobserve(ent.target);
            }
        });
    }, { threshold: 0.3 });
    
    obs.observe(document.querySelector('.sec-p'));
    initLn();
    initHdrEff();
    new Sld();
    initFrm();
});