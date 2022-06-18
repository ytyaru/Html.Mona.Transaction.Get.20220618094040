class MonaTransactionViewer {
    constructor(my) { // my: 自分のアドレス
        this.my = my
        //this.my = my || (window.hasOwnProperty('mpurse')) ? await window.mpurse.getAddress() : null
    }
    generate(json) {
        // json.result[0].vout
        return this.makeTerm(json)
             + '<br>'
             + this.makePayBalanceAmount(json)
             + '<br>'
             + this.makePayPeoplesTable(json)
    }
    makeTerm(json) { // 日時（最後の取引〜最初の取引）
        /*
        return this.#makeTime(Date.parse(json.result[json.result.length-1].time))
                + '〜'
                + this.#makeTime(Date.parse(json.result[0].time));
                */
        return this.#makeTime(new Date(json.result[json.result.length-1].time * 1000))
                + '〜'
                + this.#makeTime(new Date(json.result[0].time * 1000))
                + `　<span><span id="transaction-count">${json.result.length}</span>回</span>`
                + `（<span><span id="pay-count">${this.calcTotalPayCount(json)}</span>出</span>`
                + `　<span><span id="received-count">${this.calcTotalReceivedCount(json)}</span>入</span>）`
    }
    #makeTime(date) { // date型
        console.debug(date)
        const iso = date.toISOString()
        //const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
        const month = (date.getMonth()+1).toString().padStart(2, '0')
        const dates = date.getDate().toString().padStart(2, '0')
        //const hours = date.getHours().toString().padStart(2, '0')
        //const minutes = date.getMinutes().toString().padStart(2, '0')
        //const seconds = date.getSeconds().toString().padStart(2, '0')
        const format = `${date.getFullYear()}-${month}-${dates}`
        //const format = `${date.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`
        return `<time datetime="${iso}" title="${iso}">${format}</time>`
    }
    makePayBalanceAmount(json) {
        const pay = this.calcTotalPay(json)
        console.debug(pay)
        const received = this.calcTotalReceived(json)
        console.debug(received)
        const balance = this.calcBalance(received, pay) // received - pay
        console.debug(balance)
        return `<table><tr><th>支払総額</th><td class="num"><span id="total-pay">${pay.toFixed(8)}</span> MONA</td></tr><tr><th>受取総額</th><td class="num"><span id="balance">${received.toFixed(8)}</span> MONA</td></tr><tr><th>残高</th><td class="num"><span id="balance">${balance.toFixed(8)}</span> MONA</td></tr></table>`
    }
    /*
    makePayPeoplesTable(json) {
        const pays = this.makePayPeoples(json)
        const trs = []
        for (const [address, data] of pays) {
            const tdAddr = `<td class="user-total-pay-address">${address}</td>`
            const tdValues = `<td><span class="user-total-pay-amount">${data.map(d=>d.value).reduce((sum,v)=>sum+v).toFixed(8)}</span></td>`
            const tdHistory = `<td>${this.makePayWhenValueTable(data)}</td>`
            trs.push(`<tr>${tdAddr}${tdValues}${tdHistory}</tr>`)
        }
        return '<table><caption>支払</caption>' + trs.join('') + '</table>'
    }
    makePayWhenValueTable(data) {
        return '<table>' + data.map(d=>`<tr><td>${this.#makeTime(d.time)}</td><td class="num">${d.value.toFixed(8)} MONA</td></tr>`).join('') + '</table>'
    }
    makePayPeoples(json) {
        const addrs = new Map()
        for (const r of json.result.filter(r=>this.isPay(r.vout))) {
            const addr = r.vout[0].scriptPubKey.addresses[0]
            const data = (addrs.has(addr)) ? addrs.get(addr) : []
            data.push({time:new Date(r.time * 1000), value:r.vout[0].value})
            //const value = (addrs.has(addr)) ? addrs.get(addr) + : r.vout[0].value
            addrs.set(addr, data)
        }
        return addrs
    }
    */
    makePayPeoplesTable(json) {
        const pays = this.makePayPeoples(json)
        console.debug(pays)
        const trs = []
        for (const pay of pays) {
            const tdAddr = `<td class="user-total-pay-address">${pay.address}</td>`
            //const tdValues = `<td><span class="user-total-pay-amount">${data.map(d=>d.value).reduce((sum,v)=>sum+v).toFixed(8)}</span></td>`
            const tdValues = `<td><span class="user-total-pay-amount">${pay.sum.toFixed(8)}</span></td>`
            const tdHistory = `<td>${this.makePayWhenValueTable(pay.history)}</td>`
            trs.push(`<tr>${tdAddr}${tdValues}${tdHistory}</tr>`)
        }
        return '<table><caption>支払</caption>' + trs.join('') + '</table>'
    }
    makePayWhenValueTable(history) {
        return '<table>' + history.map(d=>`<tr><td>${this.#makeTime(d.time)}</td><td class="num">${d.value.toFixed(8)} MONA</td></tr>`).join('') + '</table>'
    }
    makePayPeoples(json) { return this.makePeoples(json.result.filter(r=>this.isPay(r.vout))) }
    makePeoples(results) {
        const datas = []
        for (const r of results) {
            const addr = r.vout[0].scriptPubKey.addresses[0]
            const i = datas.findIndex(a=>a.address==addr)
            const history = (-1 < i) ? datas[i].history : []
            const sum = (-1 < i) ? datas[i].sum : 0
            if (-1 < i) {
                datas[i].sum += r.vout[0].value
                datas[i].history.push({time:new Date(r.time * 1000), value:r.vout[0].value})
            }
            else {datas.push({address:addr, sum:r.vout[0].value, history:[{time:new Date(r.time * 1000), value:r.vout[0].value}]})}
            //datas.push({address:addr, sum:sum+r.vout[0].value, history:history})
            /*
            const history = (addrs.has(addr)) ? addrs.get(addr).history : []
            const sum = (addrs.has(addr)) ? addrs.get(addr).sum : 0
            history.push({time:new Date(r.time * 1000), value:r.vout[0].value})
            addrs.set(addr, {sum:sum+r.vout[0].value, history:history})
            */
        }
        return datas.sort((a,b)=>b.sum - a.sum)
        /*
        const addrs = new Map()
        for (const r of results) {
            const addr = r.vout[0].scriptPubKey.addresses[0]
            const history = (addrs.has(addr)) ? addrs.get(addr).history : []
            const sum = (addrs.has(addr)) ? addrs.get(addr).sum : 0
            history.push({time:new Date(r.time * 1000), value:r.vout[0].value})
            addrs.set(addr, {sum:sum+r.vout[0].value, history:history})
        }
        */
        //return new Map([...addrs.entries()].sort((a, b) => a[0] > b[0] ? 1 : -1));
        //return addrs.sort((a,b)=>b.sum - a.sum)
        //return addrs
    }

    calcTotalPayCount(json) { // 支払総回数を算出する
        return json.result.filter(r=>this.isPay(r.vout)).length
    }
    calcTotalReceivedCount(json) { // 受取総回数を算出する
        return json.result.filter(r=>!this.isPay(r.vout)).length
    }
    calcTotalPayPeoples(json) { // 支払アドレス数を算出する
        return json.result.filter(r=>this.isPay(r.vout)).length
    }
    calcTotalPay(json) { // 支払総額を算出する
        return json.result.filter(r=>this.isPay(r.vout)).map(r=>r.vout[0].value).reduce((sum,v)=>sum+v)
    }
    calcTotalReceived(json) { // 受取総額を算出する
        return json.result.filter(r=>!this.isPay(r.vout)).map(r=>r.vout[0].value).reduce((sum,v)=>sum+v)
    }
    calcBalance(received, pay) { // 残高を算出する
        return received - pay
    }
    isPay(vout) { // この取引情報は支払いであるか
        return (vout[1].scriptPubKey.addresses[0] == this.my)
    }
}
