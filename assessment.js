'use strict';
//↑宣言後の記述ミスをエラーとして表示してくれる機能を呼び出す記述。
// constは、一度しか代入できない定数で{}の中でしか機能しない、letは{}で囲まれた中(ブロックスコープ)でのみ使える変数
// {}の外で宣言すれば結果的にconstもletも結果的に{}の外でも使える
var userNameInput = document.getElementById('user-name');
var assessmentButton = document.getElementById('assessment');
var resultDivided = document.getElementById('result-area');
var tweetDivided = document.getElementById('tweet-area');

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

userNameInput.onkeydown = (event) => {
  if (event.key === 'Enter') {
    assessmentButton.onclick();
  }
};
assessmentButton.onclick = () => {
  const userName = userNameInput.value;
  if(userName.length === 0) {
    return;
  }
  // TODO 診断結果表示エリアの作成
  removeAllChildren(resultDivided);
  const header = document.createElement('h3');
  header.innerText = '診断結果';
  resultDivided.appendChild(header);

  const paragraph = document.createElement('p');
  const result = assessment(userName);
  paragraph.innerText = result;
  resultDivided.appendChild(paragraph);
  // TODO ツイートエリアの作成
  removeAllChildren(tweetDivided);
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag='
  + encodeURIComponent('あなたのいいところ')
  + '&ref_src=twsrc%5Etfw';

  anchor.setAttribute('href', hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text', result);
  anchor.innerText = 'Tweet #あなたのいいところ';
  tweetDivided.appendChild(anchor);

  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweetDivided.appendChild(script);
}
//↑無名関数という名前を持たない関数の記述法。それをassessmentButtonというオブジェクトのonclickというプロパティに設定することで、ボタンがクリックされた時に動くようにできる。
//無名関数はES6ではもっと簡単に書くことができ、functionという文字を決して、代わりに=>を書く。これをアロー関数と呼ぶ。
// return;は戻り値なしにそこで処理を終了するという意味。このような特定の処理の際に処理を終了させるような処置をガード句と呼ぶ。ifとelseを使って書くこともできるが、処理をさせたくない条件が増えた時に、ifの{}というスコープの入れ子が深くなってしまうため、それを避けて読みやすくするために使う。

// document.writeでは、<p>タグの中身</p>というHTMLを適用するのに、タグの内容をdocument.write('<p>タグの中身</p>');と記述する必要があり、後からタグの中身だけを変更したい場合などに手間取る。
// document.createElementを使うと、まず<p></p>のような要素を作成し、後からinnerTextプロパティを用いてタグの中身を設定できる。
// div要素を親としてh3の見出しを子要素として追加するのでappendChildという関数を使っている。

var answers = [
  '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
  '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
  '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
  '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
  '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
  '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
  '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
  '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
  '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
  '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
  '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
  '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
  '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
  '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
  '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
  '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
  '{userName}のいいところは優しさです。{userName}の優しい雰囲気や立ち振る舞いに多くの人が癒やされています。'
];

/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName
 * @return {string} 診断結果
 */

// ↑JSdocとよばれる形式のコメント。userNameという引数でユーザーの名前が文字列で渡され、戻り値は診断結果の文字列となる。

// 関数の内部の処理と、外部からうける出力や入力を定義している内外の境界を表す定義をインタフェースという。JSDocんp記述方法はDevDocsで使い方が解説されている。あくまでコメントなので、書かなくてもプログラムは動作するが、このような開式でインタフェースが定義されていると、プログラムがとても読みやすくなる。

function assessment(userName) {
  // 全文字のコード番号を取得してそれを足し合わせる
  let sumOfCharCode = 0;
  for (let i = 0; i < userName.length; i++) {
    sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);
  }
  // 文字のコード番号の合計を回数の数で割って添字の数値を求める
  const index = sumOfCharCode % answers.length;
  let result = answers[index];
  // {userName}をユーザーの名前に置き換える、{userName}という文字列自身に合うものを複数回適用する
  result = result.replace(/\{userName\}/g, userName);
  return result;
}

// テストを行う機能：console.assert。第一引数いは正しい時にtrueとなるテストしたい式を記入し、第二引数にはテストの結果が正しくなかった時に出したいメッセージを書く。
console.assert(
  assessment('太郎') === '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',
  '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
);
console.assert(
  assessment('太郎') === assessment('太郎'),'診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
);


// JSでifやwhileで受け取る値は、true以外の値でもほとんどの場合trueと評価されるが、false、null、undefined、空文字列''、数値の0、数値のNaN（非数という、数値にできないことを意味する特殊な値）などがある。
// ifやwhileの条件式に与えた時にtrueになる値のことをtruthyな値、falseになる値のことをfalsyな値と呼ぶ。
// URIとはインターネット上などにある情報やサービスを一意に識別するためのデータ形式で、Uniform Resource Identifier。インターネット上の場所に限定したものとして、URL（Uniform Resource Locator）と呼ぶこともある。
// httpsはURIのスキーム、twitter.comはホスト名、/intent/tweetはリソース名、?以降はクエリ
// URIのクエリに日本語のような半角英数以外の文字を含めるにはURIエンコードを使う。%で始まる16進数で表現することでクエリに含めるようにできる変換方法。パーセントコーディングということもある。
// encodeURIComponent関数で文字列をURIエンコードされたものへ変換、decodeURIComponent関数でURIエンコードされた文字列から元のものへ復元

// すでに作られたプログラムの動作や構造を解析することろリバースエンジニアリングという。

