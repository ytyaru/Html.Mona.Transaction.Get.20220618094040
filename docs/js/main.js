window.addEventListener('DOMContentLoaded', async(event) => {
    try {
        window.mpurse.updateEmitter.removeAllListeners()
          .on('stateChanged', async(isUnlocked) => { await init(); console.log(isUnlocked); })
          .on('addressChanged', async(address) => { await init(address); console.log(address); });
    } catch(e) { console.debug(e) }
    document.getElementById('get-transaction').addEventListener('click', async(event) => {
        const address = document.getElementById('address').value
        if (address) {
            const client = new MonaTransactionClient()
            const json = await client.get(address)
            document.getElementById('response').value = JSON.stringify(json)
            console.debug(json)
            const gen = new MonaTransactionViewer(address)
            document.getElementById('export-transaction').innerHTML = gen.generate(json)
        }
    });
    async function init(address=null) {
        if (window.hasOwnProperty('mpurse')) {
            document.getElementById('address').value = address || await window.mpurse.getAddress()
            document.getElementById('get-transaction').dispatchEvent(new Event('click'))
        }
    }
    /*
    async function initForm(addr=null) {
        const address = addr || (window.hasOwnProperty('mpurse')) ? await window.mpurse.getAddress() : null
        document.getElementById('address').value = address
        const register = new ProfileRegister()
        await getRegistCount(register)
        if (address) {
            const json = await register.get(address)
            console.debug(json)
            if (json && !json.hasOwnProperty('error')) {
                //showMyData(json.address, JSON.parse(json.profile))
                //json.profile = JSON.parse(json.profile)
                showMyData(json)
            }
        }
    }
    async function getRegistCount(register=null) {
        const r = register || new ProfileRegister()
        const json = await r.getCount()
        console.debug(json)
        document.getElementById('regist-count').innerText = json.count || 0
    }
    document.getElementById('regist').addEventListener('click', async(event) => {
        console.debug('登録ボタンを押した。')
        if (nothingRequired('address', 'アドレス')) { return }
        if (nothingRequired('name', '名前')) { return }
        const address = document.getElementById('address').value
        const j = makeProfileJson()
        delete j.address
        console.debug(j)
        const register = new ProfileRegister()
        const json = await register.post(document.getElementById('address').value, j)
        if (json.hasOwnProperty('method')) {
            if ('insert' == json.method) { // 新規追加なら登録者数を+1する
                document.getElementById('regist-count').value = parseInt(document.getElementById('regist-count').value) + 1
                Toaster.toast('登録しました！')
            } else if ('update' == json.method) {
                Toaster.toast('更新しました！')
            }
            //j.address = document.getElementById('address').value
            //showMyData(j)
            showMyData({address:address, profile:j})
        }
        console.debug(json)
        //const json = await register.post(j)
    });
    function nothingRequired(id, label) {
        //if ('' == document.getElementById(id).value.trim()) { Toaster.toast(`${label}を入力してください。`, true); return true; }
        console.log((document.getElementById(id).value) ? 'T' : 'F')
        if (!document.getElementById(id).value) { Toaster.toast(`${label}を入力してください。`, true); return true; }
        console.debug(`存在する:${label}`)
        return false
    }
    async function getProfile(address) {
        console.debug(address)
        //if (!window.hasOwnProperty('mpurse')) { return null }
        if (address) {
            const register = new ProfileRegister()
            const json = await register.get()
            //const client = new GoogleAppsScriptClient()
            //const json = await client.get()
            console.debug(json)
            console.debug(Array.isArray(json))
            const index = json.findIndex(d=>d.address == address)
            console.debug(json[index])
            if (-1 < index) { return json[index] }
        }
        return null
    }
    function showMyData(json) {
        console.debug(json)
        if (!json) { return }
        if (json.hasOwnProperty('error')) { return }
        const profile = (typeof json.profile === "string" || json.profile instanceof String) ? JSON.parse(json.profile) : json.profile
        console.debug(profile)
        document.getElementById('regist-form').reset()
        document.getElementById('address').value = json.address
        document.getElementById('url').value = profile.url
        document.getElementById('name').value = profile.name
        document.getElementById('avatar').value = profile.avatar
        document.getElementById('description').value = profile.description
        const fields = (profile.hasOwnProperty('fields')) ? profile.fields : null
        if (fields) {
            for (let i=0; i<fields.length; i++) {
                document.getElementById(`field-${i+1}-key`).value = fields[i].key
                document.getElementById(`field-${i+1}-value`).value = fields[i].value
            }
        }
        const gen = new ProfileGenerator()
        document.getElementById('html-profile').innerHTML = gen.generate(profile)
    }
    function makeLink(url, innerHtml=null) {
        const a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('rel', 'noopener noreferrer')
        if (innerHtml) { a.innerHTML = innerHtml }
        return a
    }
    function makeLink(url) { return `<a href="${url}" rel="noopener noreferrer">${url}</a>` }
    function makeAvatar(url, src, size) { return `<a href="${url}" rel="noopener noreferrer"><img src="${src}" width="${size}" height="${size}"></a>` }
    function makeDescription(description) {
        description = description.replace('\n', '<br>')
        return description 
    }
    function makeMpurseSendButton(address) { // マストドンのプロフィール情報にアドレスらしき文字列があれば投げモナボタンを配置する
        return (address) ? `<mpurse-send-button img-size="32" amount="0.04649000" to="${address}"></mpurse-send-button>` : ''
    }

    function makeProfileJson() {
        const address = document.getElementById('address').value
        const url = document.getElementById('url').value
        const name = document.getElementById('name').value
        const avatar = document.getElementById('avatar').value
        const description = document.getElementById('description').value
        const fields = []
        for (let i=0; i<4; i++) {
            const key = document.getElementById(`field-${i+1}-key`).value
            const value = document.getElementById(`field-${i+1}-value`).value
            if (key && value) { fields.push({key:key, value:value}) }
        }
        const json = {address:address, url:url, name:name, avatar:avatar, description:description}
        if (0 < fields.length) { json.fields = fields }
        return json
    }
    */
    document.addEventListener('mastodon_redirect_approved', async(event) => {
        console.debug('===== mastodon_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理（）
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('accounts' == event.detail.actions[i]) {
                const gen = new MastodonProfileGenerator(event.detail.domain)
                document.getElementById('export-mastodon').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('status' == event.detail.actions[i]) {
                const html = new Comment().mastodonResToComment(event.detail.results[i])
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('mastodon_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    /*
    document.getElementById('get-misskey-account-info').addEventListener('click', async(event) => {
        const domain = document.getElementById('misskey-instance').value
        if ('' == domain.trim()) { Toaster.toast(`インスタンスのドメイン名またはURLを入力してください。`, true); return; }
        if (await MisskeyInstance.isExist(domain)) {
            console.debug('指定したインスタンスは存在する')
            const authorizer = await MisskeyAuthorizer.get(domain, 'read:account')
            console.debug(authorizer)
            await authorizer.authorize(['i'], null)
        } else {
            Toaster.toast('指定したインスタンスは存在しません。', true)
        }
    });
    */
    document.addEventListener('misskey_redirect_approved', async(event) => {
        console.debug('===== misskey_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('i' == event.detail.actions[i]) {
                const gen = new MisskeyProfileGenerator(event.detail.domain)
                document.getElementById('export-misskey').innerHTML = gen.generate(event.detail.results[i])
            }
            else if ('note' == event.detail.actions[i]) {
                const html = new Comment().misskeyResToComment(event.detail.results[i].createdNote, event.detail.domain)
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('misskey_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    init()
    // mpurseアドレスのプロフィール情報を取得する
    //initForm()
    // リダイレクト認証後
    const reciverMastodon = new MastodonRedirectCallbackReciver()
    await reciverMastodon.recive()
    const reciverMisskey = new MisskeyRedirectCallbackReciver()
    await reciverMisskey.recive()
});

