function cntAnm() {
    const nums = document.querySelectorAll('.num-st');
    const vals = [245, 189, 12, 100];
    const durs = [2000, 1800, 1500, 2200];
    
    nums.forEach((num, idx) => {
        const trg = vals[idx];
        const dur = durs[idx];
        const inc = trg / (dur / 16);
        let cur = 0;
        
        const updCnt = () => {
            cur += inc;
            const prog = cur / trg;
            const fntSz = 2.5 + (prog * 1.5);
            num.style.fontSize = `${fntSz}rem`;
            
            if (cur < trg) {
                num.textContent = Math.floor(cur);
                requestAnimationFrame(updCnt);
            } else {
                num.textContent = trg;
                num.style.fontSize = '4rem';
                num.classList.add('grw');
            }
        };
        
        updCnt();
    });
}

const obsOpt = {
    threshold: 0.3
};

const obs = new IntersectionObserver((ents) => {
    ents.forEach(ent => {
        if (ent.isIntersecting) {
            cntAnm();
            obs.unobserve(ent.target);
        }
    });
}, obsOpt);

obs.observe(document.querySelector('.sec-prj'));

document.getElementById('btnHdr').addEventListener('click', function() {
    this.style.background = 'rgba(255, 255, 255, 0.3)';
    this.style.borderColor = '#ffffff';
    
    setTimeout(() => {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        alert('برای دریافت مشاوره رایگان با ما تماس بگیرید!');
    }, 300);
});

document.getElementById('btnAct').addEventListener('click', function() {
    this.style.background = 'rgba(255, 255, 255, 0.3)';
    this.style.borderColor = '#ffffff';
    
    setTimeout(() => {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        alert('پروژه جدید شروع شد!');
    }, 300);
});

window.addEventListener('load', function() {
    const gifImg = document.querySelector('.gif-hold img');
    gifImg.onerror = function() {
        this.src = 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif';
    };
});

window.addEventListener('scroll', function() {
    const scr = window.pageYOffset;
    const hdrBg = document.querySelector('.hdr-bg');
    const gifBox = document.querySelector('.gif-box');
    
    const rt = scr * 0.5;
    hdrBg.style.transform = `scale(1.05) translateY(${rt}px)`;
    
    if (gifBox) {
        const gifRt = scr * 0.1;
        gifBox.style.transform = `translateY(calc(-50% + ${gifRt}px))`;
    }
});

document.querySelectorAll('.itm-st').forEach(itm => {
    itm.addEventListener('mouseenter', function() {
        const num = this.querySelector('.num-st');
        num.style.transform = 'scale(1.1)';
        num.style.transition = 'transform 0.3s ease';
    });
    
    itm.addEventListener('mouseleave', function() {
        const num = this.querySelector('.num-st');
        num.style.transform = 'scale(1)';
    });
});