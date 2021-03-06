# 取引データ取得

```javascript
class MonaTransactionClient extends RestClient {
    constructor() { super() }
    async get(address) {
        const url = 'https://mpchain.info/api/cb/'
        const params = {
            "id": 0,
            "jsonrpc": "2.0",
            "method": "proxy_to_counterpartyd",
            "params": {
                "method": "search_raw_transactions", 
                "params": {
                    "address": address,
                }
            }
        }
        return await super.post(url, null, params)
    }
}
```

# 取引データ解析

```javascript
{
    id: 0,
    jsonrpc: "2.0",
    result: [], // 取引データ全件分の配列
}
```

　取引データは古い順に入っていた。

　記念すべき最初のresultをみてみる。私がモナを受け取ったときの取引情報だった。すなわち私「MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu」がモナレッジ作者らいう様「M9hY5XcC7MSD54DfqcEojiKm9QMgXeQhGK」から「1.14114」モナを受け取ったときの取引情報である。

```javascript
{
    "blockhash": "b25e87ea736c39df3a51c032aefc558f0f6851a602cc57d21b3cb38fc3ec465f",
    "blocktime": 1652234061,
    "confirmations": 34709,
    "hash": "483aa8414711bb71246f355240cb4a79a5292d8b7b152caca8c985b0c6e6acd0",
    "height": 2658711,
    "hex": "010000000103804fe9ad11c4485fbdc3b025dd68a6c99ae7ccd19b9d63e641f5b6e24be9e1010000006b483045022100b18c83115da395e12791b717b32aff754865cac478bb4e72ddde0f0e6c28b28d0220716c20fcd5151e4aeb8c2f898b9735713a596ff8daac03d7169e207c2e4e6743012103aedd2422519c7ea14e48116b571903c16d2b4657d4a3ffc0e35646cd7e53be3dffffffff02d03dcd06000000001976a91445fc13c9d3a0df34008291492c39e0efcdd220b888ac6a4d1606000000001976a91413bd7f2032c935652371722ae6d987f2f8135aac88ac00000000",
    "locktime": 0,
    "size": 226,
    "time": 1652234061,
    "txid": "483aa8414711bb71246f355240cb4a79a5292d8b7b152caca8c985b0c6e6acd0",
    "version": 1,
    "vin": [
        {
            "scriptSig": {
                "asm": "3045022100b18c83115da395e12791b717b32aff754865cac478bb4e72ddde0f0e6c28b28d0220716c20fcd5151e4aeb8c2f898b9735713a596ff8daac03d7169e207c2e4e6743[ALL] 03aedd2422519c7ea14e48116b571903c16d2b4657d4a3ffc0e35646cd7e53be3d",
                "hex": "483045022100b18c83115da395e12791b717b32aff754865cac478bb4e72ddde0f0e6c28b28d0220716c20fcd5151e4aeb8c2f898b9735713a596ff8daac03d7169e207c2e4e6743012103aedd2422519c7ea14e48116b571903c16d2b4657d4a3ffc0e35646cd7e53be3d"
            },
            "sequence": 4294967295,
            "txid": "e1e94be2b6f541e6639d9bd1cce79ac9a668dd25b0c3bd5f48c411ade94f8003",
            "vout": 1
        }
    ],
    "vout": [
        {
            "n": 0,
            "scriptPubKey": {
                "addresses": [
                    "MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu"
                ],
                "asm": "OP_DUP OP_HASH160 45fc13c9d3a0df34008291492c39e0efcdd220b8 OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a91445fc13c9d3a0df34008291492c39e0efcdd220b888ac",
                "reqSigs": 1,
                "type": "pubkeyhash"
            },
            "value": 1.14114
        },
        {
            "n": 1,
            "scriptPubKey": {
                "addresses": [
                    "M9hY5XcC7MSD54DfqcEojiKm9QMgXeQhGK"
                ],
                "asm": "OP_DUP OP_HASH160 13bd7f2032c935652371722ae6d987f2f8135aac OP_EQUALVERIFY OP_CHECKSIG",
                "hex": "76a91413bd7f2032c935652371722ae6d987f2f8135aac88ac",
                "reqSigs": 1,
                "type": "pubkeyhash"
            },
            "value": 1.02124906
        }
    ],
    "vsize": 226,
    "weight": 904
}
```

`vout`|意味
------|----
`[0]`|モナを受け取った人
`[1]`|モナを送った人

`vount`|意味|値の例
-------|----|------
`vout[0].scriptPubKey.address[0]`|モナを受け取った人のアドレス|`MEHCqJbgiNERCH3bRAtNSSD9uxPViEX1nu`
`vout[0].value`|受け取ったモナの量|`1.14114`
`vout[1].scriptPubKey.address[0]`|モナを送った人のアドレス|`M9hY5XcC7MSD54DfqcEojiKm9QMgXeQhGK`
`vout[1].value`|？（手数料にしては高い）|`1.02124906`

　`time`と`blocktime`は同じく`1652234061`だった。おそらくこれはエポックタイムと思われる。これを日時型に変換してフォーマットすれば、取引した日時を表示できると思われる。ただ、`time`と`blocktime`の違いがわからない。

# 表示

　とりあえず取引情報をリスト表示してみたい。

```
yyyy-MM-dd 〜 yyyy-MM-dd

支払総額：0.00000000 MONA  支払人数 000人
受取総額：0.00000000 MONA  受取人数 000人
　残高　：0.00000000 MONA  

出 yyyy-MM-dd HH:MM:SS ADDRESS MONA
入 yyyy-MM-dd HH:MM:SS ADDRESS MONA
...
```

　経済活動において、価値ある行動は支払いである。支払うためには所有している必要があり、所有するためには入手する必要があり、入手するためには、誰かにもらう必要がある。誰かが支払うのは、それに価値を見出すからだ。入手するには、誰かに価値を認めてもらえるだけの生産活動をしている必要がある。つまり支払った実績は、それだけ生産活動をしている証だ。そして経済における通貨の価値は、生産物にあり、生産物は生産活動によって生まれる。ならば生産者の生産活動こそが通貨の価値を生み出していることは明らかである。それをもって、支払額こそがその人のその通貨業界の中における価値の高さだと言える。その人の価値は、そのまま通貨全体の価値の一部を示す。

　ふつう、残高の多さが資産の多さを表し、それがその人の価値であるかのように思える。だが、支払うことなく、ただ貯め込むだけでは、次の生産活動に向かわない。自分にはもう生産力がなく、ただ消費することしかできない。だから今ある所持金を守ることしかしない。かつての栄光にすがるだけであり、次の生産活動につながらないのであれば、それは次の新しい価値を産まず、停滞するだけである。よって、残高よりも支払い総額こそ、そのユーザの価値を示す指標にふさわしいと言える。

　価値とは生産活動である。これは淘汰の仕組みそのものだ。これまで生産活動してきたその歴史は、たしかにそれ自体が価値だし、それをしてきた人の価値だ。けれど時間は進む。やがてそれはすぐ過去となる。重要なのは過去よりも今である。今よりも未来である。だから私たちは、過去よりも今よりもさらによくなるよう、常に邁進しつづけねばならない。そうした世界の厳しさが、そのまま経済システムとなる。

　指定したアドレスは、これまでいくら支払ったか。今、いくら持っていて、支払える可能性を残しているか。これまでどれだけ取引したか。それらの情報は、そのアドレス所持者の価値をも示す。それはとても恐ろしいことである。しかし幸いなことに、暗号通貨や、ましてモナコインは、なかば遊びのような側面もある。楽しみながら、できることをする。重苦しく考えず、気楽にやる。そうしたアプローチがとりやすい。参入しやすさは、そのまま発展しやすさにつながる。

支払|受取
----|----
だれが|だれが
いつ|いつ
だれに|だれから
いくら|いくら
支払ったか|受け取ったか

　これらの情報がトランザクションから得られる。私はこれに加えて、さらに次の情報がほしい。

* 何に対して

　何に対して価値を見出したのか。それがわかれば、誰がどんなことに対して「いいね！」と思ったのかわかる。たとえばどのページにある投げモナボタンから投げモナしたのか。それがわかれば、何を評価したのか絞れる。

　もし評価対象が明確になれば、より多くの評価を得るために何をすればいいか逆算できるかもしれない。けれどこれは本末転倒だと思っている。私は儲けたいのではなく、自分の好きなことをして生きたい。自分の好きなことを評価してもらえたら、それを続けることに対して肯定的に思える。これでいいのだと信じられる。私が欲しいのは、社会からの承認である。そのためには、まちがいなく自分の好きなことをする必要がある。一番大切なのはそこである。もし評価が得られなくとも、私にとっては好きなことであり価値あることだから、続けるだろう。けれど、もし、他の人にも認めてもらえたなら、それはより自信となって、好きなことに邁進できる根拠になるだろう。私がほしいのは、自分を信じられる根拠である。それは自分自身が知っているべきだし、他人から賛同も評価もされずとも説明できるべきだ。そのうえで、他人から賛同と評価をもらえたら、さらなる自身の補強になる。あくまで対価を得ることは、自分の生き方をより確かなものにするためのものであって、それがなければ生きられないようなものであってはならない。それでは自分の足で立つことができなくなる。そうなれば、自分は自分を生きているとは言えなくなってしまう。

* なぜ

　どうして、その対象に支払ったのか。その対象の何がよいと思ったのか。べつにそこを追求しても仕方ないと思う。でも、他人の価値観を理解できるきっかけいになるかもしれない。それが、なにか新しい気付きにつながるかもしれない。新しい価値が生まれるかもしれない。ただ、それは手間がかかるため、やりたい人だけやるのがいい。なので何をいいと思ったかについてはコメント欄にコメントするとか、自分で記事を書くとか、そうした形で表現できればいいと思っている。

　なぜその金額を支払ったのかについては所持金から支払わざるを得ないため、そこについて理由を問うても、あまり意味はないと思う。重要なのは自分の価値観である。それを自分で理解し、納得することが、喜びにつながるはず。そうした体験を得るために自問自答できればそれでいいと思う。



　そもそも通貨自体には何の価値もない。通貨をいくら手に入れたところでなんの意味も価値もない。カネの価値はいわば幻想である。それは暗号通貨だけでなく法定通貨も同じだ。特に今は経済が崩壊しつつあるので、その危うさを実感しやすい。これを機に、もっとお金を本質的にみてみたい。

　経済が崩壊している理由は、今の中央集権社会の歪みが明るみになり、信用できなくなったからだと思っている。また、私たちのやりたいことにそぐわないからだとも思う。権力を集中させ、思想を統一し、一元管理、支配する。そうしたやり方に、もはや私たちは賛同できない。多様化している価値観をみとめ、それらを活かすことで、持続可能社会をつくる。それこそ私たちが今すべきことだろう。


