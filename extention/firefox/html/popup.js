let ot = document.getElementById('output')
let sett = document.getElementById('set')
let logsc = document.getElementById('logsc')
let acc = document.getElementById('account')
let lookup = document.getElementById('lookup')

sett.addEventListener('click', () => browser.runtime.openOptionsPage())
acc.addEventListener('click', () => browser.runtime.openOptionsPage())

async function submit(val, dir = 'other') {
    val = val.split("|")
    let {codes} = await browser.storage.local.get('codes')
    let {login} = await browser.storage.local.get('login')
    if (!codes) {
        codes = {}
    }
    if (Object.keys(codes).includes(val[0])) {
        ot.innerText = 'Code has already been added'
        setTimeout(() => {ot.innerText = ""}, 5000)
    } else {
        axios.post('http://localhost:3000/api/verify', {verify: login, code: val[0], key: val[1]}).then(async res => {
            console.log(res.data)
            if (res.data.status == 1) {
                key.value = ''
                codes[dir][val[0]] = val[1]
                await browser.storage.local.set({codes: codes})
                ot.innerText = 'Code valid'
                setTimeout(() => {ot.innerText = ""}, 5000)
            } else {
                ot.innerText = res.data.status
                setTimeout(() => {ot.innerText = ""}, 5000)
            }
        })
    }
}

async function unlock() {
    let {login} = await browser.storage.local.get("login")
    if(!login) {
        lookup.style.display = 'none'
        scan.style.display = 'none'
        logsc.style.display = 'inline-block'
    } else {
        logsc.style.display = 'none'
        lookup.style.display = 'inline-block'
        scan.style.display = 'inline-block'
    }
}

async function found() {
    let {found} = await browser.storage.local.get('found') 
    if (found !== undefined && found.length !== 0) {
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
                await submit(addb.value)
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
            lookup.appendChild(div)
        }
    } else {
        lookup.innerHTML = ''
    }
}

async function init() {
    let {codes} = await browser.storage.local.get('codes')
    if (!codes) {
        codes = []
    }
    await browser.storage.local.set({codes: codes})
    unlock()
    found()
}

init().catch(err => console.log(err))


browser.storage.onChanged.addListener((ch, ar) => {
    if(ar == 'local') {
        if(ch['login'] !== undefined) {
            unlock()
        } 
        if (Object.keys(ch).includes('found')) {
            found()
        }
    }
})
