let bg = document.createElement('button')
let scan = document.createElement('button')
let divdrag = document.createElement('div')
let standard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&'
let keymap = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+/*-{}[]|:;?><.,~'" + '"'
let onPage = false

async function init () {
    let {login} = await browser.storage.local.get('login')
    if(login !== undefined) {
        bg.style.position = 'fixed'
        bg.style.display = 'none'
        bg.style.top = '4px'
        bg.style.right = '25%'
        bg.style.zIndex = '999999'
        bg.style.background = 'rgb(0, 10, 32)'
        bg.style.width = '50px'
        bg.style.height = '50px'
        bg.style.border = '0'
        bg.style.borderRadius = '50%'
        bg.style.color = 'lightblue'
        bg.style.fontSize = '20px'

        document.body.appendChild(bg)

        scan.setAttribute('style', 'background-color: rgb(13, 13, 219); color: white; position: relative; border: 0; border-radius: 3px; width: 60px; height: 25px; margin: 0; margin-bottom: 10px; padding: 0;')
        scan.innerText = 'Scan'
        scan.onclick = function () {
            if(onPage) {    
                search(); 
                detect()
            }
        }
        divdrag.appendChild(scan)
        divdrag.setAttribute('style', 'position: fixed;background-color:  rgb(3, 17, 48); min-width: 80px; min-height: 25px; padding: 10px; border-radius: 5px; text-align: center; padding-top: 20px; z-index: 99999; left: 75%; top: -48px;')
        divdrag.setAttribute('id', '^$dragMenu$^')
        divdrag.onmouseover = function () {divdrag.style.top = '0px'}
        divdrag.onmouseout = function () {divdrag.style.top = '-48px'}
        document.body.appendChild(divdrag)
        /*divdrag.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            if (divdrag.offsetTop < -48) {
                divdrag.style.top = '-48px'
            }
            if (divdrag.offsetTop > window.innerHeight) {
                divdrag.style.top = (window.innerHeight - 50) + 'px'
            }
            if (divdrag.offsetLeft < 0) {
                divdrag.style.left = '0px'
            }
            if (divdrag.offsetLeft > (window.innerWidth - 100)) {
                divdrag.style.left = (window.innerWidth - 100) + 'px'
            }
            divdrag.style.top = (divdrag.offsetTop - pos2) + "px";
            divdrag.style.left = (divdrag.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }*/

    }
}

async function search (doc = document.body.children) {
    for(let i = 0; i < doc.length; i++) {
        if (doc[i].innerHTML.includes('$hex') && doc[i].innerHTML.includes('||') && doc[i].innerHTML.includes('--')) {
            let inTotal = [];
            let result = [];
            let split1 = doc[i].innerHTML.split("--$||");
            inTotal.push(split1[0]);
            for(let x = 1; x < split1.length; x++) {
                let split2 = split1[x].split('||$--');
                    inTotal.push(split2[0]);
                    inTotal.push(split2[1]);
            }
            for (let r = 1; r < inTotal.length; r++) {
                result.push(inTotal[r]);
                r += 1;
            }
            for (let e = 0; e < result.length; e++) {
                result[e] = result[e].split('|')
                if (result[e].length > 2) {
                    console.log(result[e])
                    result.splice(e, 1)
                }
            }
            let {codes} = await browser.storage.local.get('codes')
            let codesAll = {}
            for (let e = 0; e < Object.keys(codes['my']).length; e++) {
                codesAll[Object.keys(codes['my'])[e]] = codes['my'][Object.keys(codes['my'])[e]]
            }
            for (let e = 0; e < Object.keys(codes['other']).length; e++) {
                codesAll[Object.keys(codes['other'])[e]] = codes['other'][Object.keys(codes['other'])[e]]
            }
            for (let e = 0; e < result.length; e++) {
                if (Object.keys(codesAll).includes(result[e][0])) {
                    result.splice(e, 1)
                }
            }
            if (result.length !== 0) {
                await browser.storage.local.set({found: result})
            }
        }
    }
}

async function decrypt (text) {
    console.log('helloo')
    text = text.split('|')
    if (text.length > 2) {
        let newSecVal = '';
        let e;
        for (let i = 1; i < text.length; i++) {
            newSecVal = newSecVal + text[i]
            e = i + 1
            if (e < text.length) {
                newSecVal = newSecVal + "|"
            }
        }
        text[1] = newSecVal
    }
    let {codes} = await browser.storage.local.get("codes");
    let myk = Object.keys(codes['my']);
    let otherk = Object.keys(codes['other']);
    let codesAll = {}
    for (let i = 0; i < myk.length; i++) {
        codesAll[myk[i]] = codes['my'][myk[i]];
    }
    for (let i = 0; i < otherk.length; i++) {
        codesAll[otherk[i]] = codes['other'][otherk[i]];
    }
    if (codesAll[text[0]] !== undefined) {
        let encrypted = text[1];
        let decrypted = ' ';
        let code = codesAll[text[0]];
        let codedIndexes = [];
        let e = 0;
        for (let i = 0; i < encrypted.length; i++) {
            let fk = code[e]
            let fl = encrypted[i]
            let fki = standard.indexOf(fk)
            let fli;
            if (keymap.indexOf(fl) !== undefined) {
                fli = keymap.indexOf(fl)
            } else {
                fli = 0
            }
            let coded = fli - fki
            codedIndexes.push(coded)
            if (e > 63) {
                e = -1
            }
            e += 1
        }
        for (let i = 0; i < codedIndexes.length; i++) {
            let ci = codedIndexes[i]
            if (ci < 0) {
                ci = ci + keymap.length
            }
            decrypted = decrypted + keymap[ci]
        }
        return decrypted
    } else {
        return ' no keys '
    }
}

async function detect () {
    let doc = []
    doc.push(
    ...document.getElementsByTagName('a'), 
    ...document.getElementsByTagName('p'),
    ...document.getElementsByTagName('h1'),
    ...document.getElementsByTagName('h2'),
    ...document.getElementsByTagName('h3'),
    ...document.getElementsByTagName('h4'),
    ...document.getElementsByTagName('h5'),
    ...document.getElementsByTagName('h6'),
    ...document.getElementsByTagName('label'),
    ...document.getElementsByTagName('title'),
    ...document.getElementsByTagName('button'),
    ...document.getElementsByTagName('option'),
    )
    for (let i = 0; i < doc.length; i++) {
        if(doc[i].innerHTML.includes('-$%$-')) {
            let encrypt = doc[i].innerHTML;
            encrypt = encrypt.split("-$%$-");
            let indexList = [];
            let decrypted = ' ';
            for (let e = 1; e < encrypt.length; e++) {
                if (encrypt[e].includes('|')) {
                    indexList.push( await decrypt(encrypt[e]))
                }
                e++
            }
            let x = 0;
            for (let e = 1; e < encrypt.length; e++) {
                encrypt[e] = indexList[x]
                x++
                e++
            }
            for (let e = 0; e < encrypt.length; e++) {
                decrypted = decrypted +  encrypt[e]
            }
            doc[i].innerHTML = decrypted
        }
    }
}

init()

bg.addEventListener('click', () => bg.style.display = 'none')
document.body.addEventListener('mouseenter', () => onPage = true)
document.body.addEventListener('mouseleave', () => onPage = false)
document.body.addEventListener('change', () => {search(); detect()})

setTimeout(async () => {
    if (onPage) {
        let {autoserch} = await browser.storage.local.get('autoserch')
        if (autoserch == true) {
            search()   
        }
        detect()
    }
},5000)


browser.storage.onChanged.addListener( async (ch, ar) => {
    if (ar == 'local') {
        if (Object.keys(ch).includes('found') && onPage) {
            let l = ch.found.newValue.length
            if (l !== 0) {
                bg.innerText = l
                bg.style.display = 'block'
            } else {
                bg.style.display = 'none'
            }
        }
    }
})
