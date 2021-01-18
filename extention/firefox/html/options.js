window.addEventListener('load', () => {
    //values 
    let standard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&'
    let keymap = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+/*-{}[]|:;?><.,~'" + '"'
    //function keys

    //io
    let key = document.getElementById('keyi')
    let myKeys = document.getElementById('keysm')
    let otherKeys = document.getElementById('keyso')
    let encrInput = document.getElementById('encr')
    let arrop = document.getElementById('arrop')
    let keyname = document.getElementById('namen')
    let keygens = document.getElementById('keygens')
    let genkey = document.getElementById('genkey')
    let email = document.getElementById('uemail')
    let codekey = document.getElementById('code')
    let output = document.getElementById('ot')
    let emailDis = document.getElementById("emot")
    let err = document.getElementById("err")
    let erro = document.getElementById('err0')
    let logtitle = document.getElementById("logtitle")
    let loginput = document.getElementById("loginput")
    let mk = document.getElementById('mk')
    let ok = document.getElementById('ok')
    let keyn = document.getElementById('keyn')
    let keynamen = document.getElementById('keynamen')
    let keysfound = document.getElementById('keysfound')
    let num = document.getElementById('num')

    //runners
    let autoserch = document.getElementById('autos')
    let submit = document.getElementById('submit')
    let decrypt = document.getElementById('dec')
    let encrypt = document.getElementById('enc')
    let switchio = [document.getElementById('switch'), 0]
    let generate = document.getElementById('generate')
    let add = document.getElementById('add')
    let reg = document.getElementById('reg')
    let sendCode = document.getElementById('si')
    let denied = document.getElementById('den')
    let logout = document.getElementById("logot")


    //display keys
    let key1 = [document.getElementById('gen'), 0]
    let key2 = [document.getElementById('key'), 0]
    let key3 = [document.getElementById('help'), 0]
    let key4 = [document.getElementById('info'), 0]

    let pkey1 = document.getElementById('pgen')
    let pkey2 = document.getElementById('pkey')
    let pkey3 = document.getElementById('phelp')
    let pkey4 = document.getElementById('pinfo')


    //display keys listener
    key1[0].addEventListener("mouseenter", () => hover(key1))
    key1[0].addEventListener("mouseleave", () => noHover(key1))
    key2[0].addEventListener("mouseenter", () => hover(key2))
    key2[0].addEventListener("mouseleave", () => noHover(key2))
    key3[0].addEventListener("mouseenter", () => hover(key3))
    key3[0].addEventListener("mouseleave", () => noHover(key3))
    key4[0].addEventListener("mouseenter", () => hover(key4))
    key4[0].addEventListener("mouseleave", () => noHover(key4))

    key1[0].addEventListener("click", 
        () => {clicked(["rgba(17, 33, 85, 0.651)", 1], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0]); 
        display("block", "none", "none", "none")}
    )
    key2[0].addEventListener("click", 
        () => {clicked(["rgba(0, 0, 0, 0)", 0], ["rgba(17, 33, 85, 0.651)", 1], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0]); 
        display("none", "block", "none", "none")}
    )
    key3[0].addEventListener("click", 
        () => {clicked(["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(17, 33, 85, 0.651)", 1], ["rgba(0, 0, 0, 0)", 0]); 
        display("none", "none", "block", "none")}
    )
    key4[0].addEventListener("click", 
        () => {clicked(["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(17, 33, 85, 0.651)", 1]); 
        display("none", "none", "none", "block")}
    )


    //function listeners
    submit.addEventListener('click', () => addKey())
    switchio[0].addEventListener('click', () => ioswitch())
    generate.addEventListener('click', () => generatek())
    add.addEventListener('click', () => addk())
    denied.addEventListener('click', () => deniedk())
    reg.addEventListener('click', () => register())
    sendCode.addEventListener('click', () => login())
    logout.addEventListener('click', () => logot())
    autoserch.addEventListener('click', () => as())
    decrypt.addEventListener('click', () => decryption())
    encrypt.addEventListener('click', () => encryption())


    //function valley

    //display functions
    async function found() {
        let {found} = await browser.storage.local.get('found')
        num.innerText = 'No keys found.'
        if (found.length !== 0) {
            num.innerText = 'Keys found: ' + found.length
            keysfound.innerHTML = ''
            for (let i = 0; i < found.length; i++) {
                let div = document.createElement('div')
                let p = document.createElement('p')
                let denb = document.createElement('button')
                let addb = document.createElement('button')
                p.innerText = found[i][0] + "|" + found[i][1]
                let style = 'border: 0; border-radius: 4px; margin: 0; padding: 0; width: 60px; height: 30px;'
                denb.innerText = "Deny"
                addb.innerText = "Add"
                denb.setAttribute("style", style + 'background-color: red;')
                addb.setAttribute("style", style + 'background-color: green;')
                denb.value = i
                denb.onclick = async function () {
                    found.splice(denb.value, 1) 
                    await browser.storage.local.set({found: found})
                }
                addb.value = found[i][0]+"|"+found[i][1]
                addb.onclick = async function () {
                    await addKey(addb.value)
                    found.splice(denb.value, 1) 
                    await browser.storage.local.set({found: found})
                }
                div.style.display = 'flex'
                div.style.justifyContent = 'space-between'
                div.style.alignItems = 'center'
                div.style.width = '90%'
                div.style.marginLeft = '5%'
                div.style.height = '50px'
                div.appendChild(p)
                div.appendChild(denb)
                div.appendChild(addb)
                keysfound.appendChild(div)
            }
        } else {
            keysfound.innerHTML = ''
        }
    }
    async function setKeysSelect() {
        keynamen.innerHTML = ''
        let optgm = document.createElement('optgroup')
        let optgk = document.createElement('optgroup')
        let {codes} = await browser.storage.local.get("codes")
        let myk = Object.keys(codes['my'])
        let otherk = Object.keys(codes['other'])
        optgm.setAttribute('label', 'My Keys')
        for (let i = 0; i < myk.length; i++) {
            let option = document.createElement('option')
            option.setAttribute("value", myk[i])
            option.innerText = myk[i]
            optgm.appendChild(option)
        }
        keynamen.appendChild(optgm)
        optgk.setAttribute('label', 'Other Keys')
        for (let i = 0; i < otherk.length; i++) {
            let option = document.createElement('option')
            option.setAttribute("value", otherk[i])
            option.innerText = otherk[i]
            optgk.appendChild(option)
        }
        keynamen.appendChild(optgk)
    }
    function ioswitch() {
        let i;
        let o;
        if (switchio[1] == 0) {
            switchio[1] = 1
            i = 'none';
            o = 'inline-block';
        } else {
            switchio[1] = 0
            i = 'inline-block';
            o = 'none';
        }
        encrInput.value = ''
        decrypt.style.display = i
        encrypt.style.display = o
        keyn.style.display = o
    }
    function display(a, b, c, d) {
        pkey1.style.display = a
        pkey2.style.display = b
        pkey3.style.display = c
        pkey4.style.display = d
    }
    function clicked(a, b, c, d) {
        key1[0].style.backgroundColor = a[0]
        key1[1] = a[1]
        key2[0].style.backgroundColor = b[0]
        key2[1] = b[1]
        key3[0].style.backgroundColor = c[0]
        key3[1] = c[1]
        key4[0].style.backgroundColor = d[0]
        key4[1] = d[1]
    }
    function hover (doc) {
        if (doc[1] !== 1) {
            doc[0].style.backgroundColor = "rgba(39, 52, 95, 0.37)"
        }
    }
    function noHover (doc) {
        if (doc[1] !== 1) {
            doc[0].style.backgroundColor = "rgba(0, 0, 0, 0)"
        }
    }
    async function init() {
        let a = await browser.storage.local.get('autoserch')
        a = a['autoserch']
        autoserch.checked = a
        unlock()
        displayKey()
        ioswitch()
        found()
        let {login} = await browser.storage.local.get('login')
        if (login !== undefined) {
            let res = await axios.post('http://localhost:3000/api/log', {key: login})
            if (res.data.status == 1) {
                if (res.data.my !== undefined && res.data.other !== undefined) { 
                    codes = {my: {}, other: {}}
                    for (let i = 0; i < res.data.my.length; i++) {
                        let e = res.data.my[i]
                        if (e !== undefined) {
                            e = e.split('|')
                            codes['my'][e[0]] = e[1]
                        }
                    }
                    for (let i = 0; i < res.data.other.length; i++) {
                        let e = res.data.other[i]
                        if (e !== undefined) {
                            e = e.split('|')
                            codes['other'][e[0]] = e[1]
                        }
                    }
                    await browser.storage.local.set({codes: codes})
                }
            }
        }
    }
    function addk() {
        keygens.style.display = 'none'
        addKey(add.value, 'my')
    }
    function deniedk() {
        keygens.style.display = 'none'
        removeKey(add.value)
        add.value = ''
    }
    async function unlock() {
        let {login} = await browser.storage.local.get("login")
        if (!login) {
            logtitle.style.display = 'block'
            loginput.style.display = 'block'
            clicked(["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(17, 33, 85, 0.651)", 1])
            display("none", "none", "none", "block")
            emailDis.innerText = 'Status: Not Logged in'
            logout.style.display = 'none'
            key1[0].style.display = 'none'
            key2[0].style.display = 'none'
            key3[0].style.display = 'none'
        } else {
            logtitle.style.display = 'none'
            loginput.style.display = 'none'
            clicked(["rgba(17, 33, 85, 0.651)", 1], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0], ["rgba(0, 0, 0, 0)", 0])
            display("block", "none", "none", "none")
            emailDis.innerText = 'Status: Logged in'
            logout.style.display = 'inline-block'
            key1[0].style.display = 'inline-block'
            key2[0].style.display = 'inline-block'
            key3[0].style.display = 'inline-block'
        }
    }
    async function displayKey() {
        myKeys.innerHTML = ""
        otherKeys.innerHTML = ""
        let {codes} = await browser.storage.local.get('codes')
        if (!codes) {
            codes = {my: { }, other: { }}
        }
        if (codes['my'].length !== 0 && Object.keys(codes['my']).length !== 0 && codes['my'] !== undefined) {
            mk.style.display = 'block'
            let ns = document.createElement('p')
            let ks = document.createElement('p')
            let dl = document.createElement('p')
            let br = document.createElement('br')
            
            let containerV = document.createElement('div')
            
            ns.innerText = 'Names'
            ks.innerText = 'Keys'
            dl.innerText = 'Delete'

            containerV.style.display = 'flex'
            containerV.style.justifyContent = 'space-between'
            containerV.style.alignItems = 'center'
            containerV.style.width = '93%'
            containerV.style.margin = '0 3%'

            containerV.appendChild(ns)
            containerV.appendChild(ks)
            containerV.appendChild(dl)
            myKeys.appendChild(containerV)
            myKeys.appendChild(br)
            for (let i in Object.keys(codes['my'])) {
                let keyeas = Object.keys(codes['my'])
                let n = document.createElement('p')
                let k = document.createElement('p')
                let br = document.createElement('br')
                let delbut = document.createElement('button')
                let container = document.createElement('div')
    
                container.setAttribute('class', keyeas[i] + 'keyid')
                container.style.display = 'flex'
                container.style.justifyContent = 'space-between'
                container.style.alignItems = 'center'
                container.style.width = '93%'
                container.style.margin = '0 3%'
    
                n.innerText = `${keyeas[i]}`
                k.innerText = `${codes['my'][keyeas[i]]}`
    
                delbut.setAttribute('value', keyeas[i] + 'keyid')
                delbut.onclick = function() {dellkey(this.value, 'my')}
                delbut.innerText = 'DELETE'
                delbut.style.color = 'white'
                delbut.style.borderRadius = '5px'
                delbut.style.backgroundColor = 'red'
                delbut.style.border = '0'
                delbut.style.width = '70px'
                delbut.style.height = '25px'
    
                br.setAttribute('class', keyeas[i] + 'keyid')
    
                container.appendChild(n)
                container.appendChild(k)
                container.appendChild(delbut)
                myKeys.appendChild(container)
                myKeys.appendChild(br)
            }
        } else {
            mk.style.display = 'none'
        }
        if (codes['other'].length !== 0 && Object.keys(codes['other']).length !== 0 && codes['other'] !== undefined) {
            ok.style.display = 'block'
            let ns = document.createElement('p')
            let ks = document.createElement('p')
            let dl = document.createElement('p')
            let br = document.createElement('br')
            
            let containerV = document.createElement('div')
            
            ns.innerText = 'Names'
            ks.innerText = 'Keys'
            dl.innerText = 'Delete'

            containerV.style.display = 'flex'
            containerV.style.justifyContent = 'space-between'
            containerV.style.alignItems = 'center'
            containerV.style.width = '93%'
            containerV.style.margin = '0 3%'

            containerV.appendChild(ns)
            containerV.appendChild(ks)
            containerV.appendChild(dl)
            myKeys.appendChild(containerV)
            myKeys.appendChild(br)
            for (let i in Object.keys(codes['other'])) {
                let keyeas = Object.keys(codes['other'])
                let n = document.createElement('p')
                let k = document.createElement('p')
                let br = document.createElement('br')
                let delbut = document.createElement('button')
                let container = document.createElement('div')
    
                container.setAttribute('class', keyeas[i] + 'keyid')
                container.style.display = 'flex'
                container.style.justifyContent = 'space-between'
                container.style.alignItems = 'center'
                container.style.width = '90%'
                container.style.margin = '0 5%'
    
                n.innerText = `Name: ${keyeas[i]}`
                k.innerText = `Key: ${codes['other'][keyeas[i]]}`
    
                delbut.setAttribute('value', keyeas[i] + 'keyid')
                delbut.onclick = function() {dellkey(this.value, 'other')}
                delbut.innerText = 'DELETE'
                delbut.style.color = 'white'
                delbut.style.backgroundColor = 'red'
                delbut.style.borderRadius = '5px'
                delbut.style.border = '0'
                delbut.style.width = '70px'
                delbut.style.height = '25px'
    
                br.setAttribute('class', keyeas[i] + 'keyid')
    
                container.appendChild(n)
                container.appendChild(k)
                container.appendChild(delbut)
                otherKeys.appendChild(container)
                otherKeys.appendChild(br)
            }
        } else {
            ok.style.display = 'none'
        }
    }

    //runner functions
    async function as() {
        if (autoserch.checked == true) {
            await browser.storage.local.set({autoserch: true})
        } else {
            await browser.storage.local.set({autoserch: false})
        }
    }
    async function generatek() {
        let kname = keyname.value
        let {login} = await browser.storage.local.get("login")
        axios({method: 'post', url: 'http://localhost:3000/api/code', data: {name: kname, verify: login}}).then( res => {
            if (res.data.status == 1) {
                keygens.style.display = 'block'
                genkey.innerText = res.data.code
                add.value = res.data.code
            } else {
                err.innerText = res.data.status
                setTimeout(() => {err.innerText = ""}, 5000)
            }
        })
    }
    async function dellkey(id, dir) {
        let el = document.getElementsByClassName(id)
        el[1].parentNode.removeChild(el[1])
        el[0].parentNode.removeChild(el[0])
        let {codes} = await browser.storage.local.get('codes')
        removeKey(id.substring(0, id.length - 5))
        delete codes[dir][id.substring(0, id.length - 5)]
        await browser.storage.local.set({codes: codes})
    }
    async function addKey(val = key.value, dir = 'other') {
        val = val.split("|")
        let {codes} = await browser.storage.local.get('codes')
        let {login} = await browser.storage.local.get('login')
        if (!codes) {
            codes = {}
        }
        if (Object.keys(codes).includes(val[0])) {
            err.innerText = 'Code has already been added'
            setTimeout(() => {err.innerText = ""}, 5000)
        } else {
            axios.post('http://localhost:3000/api/verify', {verify: login, code: val[0], key: val[1]}).then(async res => {
                console.log(res.data)
                if (res.data.status == 1) {
                    key.value = ''
                    codes[dir][val[0]] = val[1]
                    await browser.storage.local.set({codes: codes})
                    err.innerText = 'Code valid'
                    setTimeout(() => {err.innerText = ""}, 5000)
                } else {
                    err.innerText = res.data.status
                    setTimeout(() => {err.innerText = ""}, 5000)
                }
            })
        }
    }
    async function logot () {
        await browser.storage.local.set({codes: {}, login: undefined, autoserch: undefined})
    }
    async function login () {
        let res = await axios.post('http://localhost:3000/api/log', {key: codekey.value})
        if (res.data.status == 1) {
            output.innerText = 'Code valid'
            codes = {}
            if (res.data.my !== undefined) {
                codes['my'] = {}
                for (let i = 0; i < res.data.my.length; i++) {
                    let e = res.data.my[i]
                    e = e.split('|')
                    codes['my'][e[0]] = e[1]
                }
            }
            if (res.data.other !== undefined) {
                codes['other'] = {}
                for (let i = 0; i < res.data.other.length; i++) {
                    let e = res.data.other[i]
                    e = e.split('|')
                    codes['other'][e[0]] = e[1]
                }
            }
            console.log(codes)
            await browser.storage.local.set({codes: codes})
            await browser.storage.local.set({login: codekey.value})
            codekey.value = ''
            setTimeout(() => {output.innerText = ""}, 2000)
        } else {
            output.innerText = res.data.status
            setTimeout(() => {output.innerText = ""}, 5000)
        }
        
    }
    function register() {
        if (email.value == '') {
            output.innerText = 'Enter a valid email'
            setTimeout(() => {output.innerText = ""}, 2000)
        } else {
            axios.post('http://localhost:3000/api/reg', {email: email.value}).then( res => {
                if(res.data.status == 1) {
                    email.value = ''
                    output.innerText = 'Codes sent to your email'
                    setTimeout(() => {output.innerText = ""}, 5000)
                } else {
                    output.innerText = res.data.status
                    setTimeout(() => {output.innerText = ""}, 5000)
                }
            })
        }
    }
    async function removeKey(name) {
        let {login} = await browser.storage.local.get('login')
        console.log(name)
        name = name.split('|')
        axios.post('http://localhost:3000/api/del', {verify: login, code: name[0]}).then(res => {
            console.log(res.data.status)
        })
    }
    async function decryption () {
        let texten = encrInput.value;
        if (texten.includes("|") && texten.length > 5) {
            texten = texten.split("|");
            if (texten.length > 2) {
                let newSecVal = '';
                let e;
                for (let i = 1; i < texten.length; i++) {
                    newSecVal = newSecVal + texten[i]
                    e = i + 1
                    if (e < texten.length) {
                        newSecVal = newSecVal + "|"
                    }
                }
                texten[1] = newSecVal
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
            if (codesAll[texten[0]] !== undefined) {
                    let encrypted = texten[1];
                    let decrypted = '';
                    let code = codesAll[texten[0]];
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
                        console.log(fl, fk, keymap[coded], coded)
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
                    arrop.innerText = decrypted
                } else {
                    erro.innerText = 'You dont have the key for this!';
                    setTimeout(() => {erro.innerText = ''}, 2000);
                }
        } else {
            erro.innerText = 'Enter a valid encrypted text!';
            setTimeout(() => {erro.innerText = ''}, 2000);
        }
    }
    async function encryption () {
        let {codes} = await browser.storage.local.get("codes");
        let myk = Object.keys(codes['my']);
        let otherk = Object.keys(codes['other']);
        let codesAll = {};
        for (let i = 0; i < myk.length; i++) {
            codesAll[myk[i]] = codes['my'][myk[i]];
        }
        for (let i = 0; i < otherk.length; i++) {
            codesAll[otherk[i]] = codes['other'][otherk[i]];
        }
        if (codesAll[keynamen.options[keynamen.selectedIndex].value] !== undefined) {
            let encrypted = keynamen.options[keynamen.selectedIndex].value + "|";
            let code = codesAll[keynamen.options[keynamen.selectedIndex].value]
            let val = encrInput.value
            if (val.length > 4) {
                let codedIndexes = [];
                let e = 0;
                for (let i = 0; i < val.length; i++) {
                    let firstK = code[e]
                    let firstL = val[i]
                    let firstKI = standard.indexOf(firstK)
                    let firstLI
                    if (keymap.indexOf(firstLI) !== undefined) {
                        firstLI = keymap.indexOf(firstL)
                    } else {
                        firstKI = 0
                    }
                    let coded = firstKI + firstLI
                    codedIndexes.push(coded)
                    console.log(firstK, firstKI, firstL, firstLI, coded, keymap[coded])
                    if (e > 63) {
                        e = -1
                    }
                    e += 1;
                }
                for (let i = 0; i < codedIndexes.length; i++) {
                    let ci = codedIndexes[i]
                    if (ci + 1 > keymap.length) {
                        ci = ci - keymap.length
                    }
                    console.log(ci, keymap[ci])
                    encrypted = encrypted + keymap[ci]
                }
                arrop.innerText = encrypted
            } else {
                erro.innerText = 'The input text must be over 4 letters!!';
                setTimeout(() => {erro.innerText = ''}, 2000);
            }
        } else {
            erro.innerText = 'You dont have this key!!';
            setTimeout(() => {erro.innerText = ''}, 2000);
        }
    }


    init()

    browser.storage.onChanged.addListener((ch, ar) => {
        if (ar == 'local') {
            if (Object.keys(ch).includes('login')) {
                unlock()
            }
            if (Object.keys(ch).includes('codes')) {
                setKeysSelect()
                displayKey()
            }
            if (Object.keys(ch).includes('found')) {
                found()
            }
        }
    })
})


