import React from 'react';
import Autocomplete from 'react-autocomplete';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      level: 18,
      word: '',
      path: '',
      tracks: []
    }

    this._fetchTracks = this._fetchTracks.bind(this);
    this.handleOnChangeLevel = this.handleOnChangeLevel.bind(this);
    this.handleOnChangeWord = this.handleOnChangeWord.bind(this);
    this.handleOnSelectAutocompleteWord = this.handleOnSelectAutocompleteWord.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 非同期でトラックリストを取得する
  _fetchTracks(level, word) {
    const url = '/api/track/list?level=' + this.state.level + '&word=' + word;
    const self = this;
    return new Promise(function(resolve, reject){
      fetch(url).then(function(res) {
        return res.json();
      }).then(function(json){
        self.setState({
          tracks: json
        })
        return json;
      }).then(function(json){
        resolve(json);
      }).catch(function(error){
        reject(error);
      });
    });
  }

  // フォームのlevelを変更した際に、levelを取得する
  handleOnChangeLevel(e) {
    const level = e.target.value;
    this.setState({
      level: e.target.value,
      word: '',
      path: '',
      tracks: []
    });
  }

  // フォームのwordを変更した際に、wordを取得し、非同期でtracksを取得する
  handleOnChangeWord(e) {
    const word = e.target.value;
    this.setState({
      word: word
    })
    if (word.length < 2) return;

    const level = this.state.level;
    this._fetchTracks(level, word);
  }

  // オートコンプリートでトラックを選択した際に、トラックの情報を取得してフォームに反映する
  handleOnSelectAutocompleteWord(track) {
    const name = track.name;
    const path = track.path;

    this.setState({
      word: name,
      path: path
    })
  }

  // フォームの送信処理
  handleSubmit(e) {
    e.preventDefault();

    const level = this.state.level;
    const path = this.state.path;
    const word = this.state.word;

    if (!level) return false;

    if (path) {
      // トラックが指定されている場合、譜面ページに飛ぶ
      window.open('http://www.sdvx.in' + path + '.htm', '_blank');
    } else {
      // トラックが指定されていない場合
      if (word) {
        // wordが入力されていたら、wordからトラックを推定し、譜面ページに飛ぶ
        this._fetchTracks(level, word).then(function(tracks){
          if (tracks && tracks.length > 0) {
            const track = tracks[0];
            window.open('http://www.sdvx.in' + track.path + '.htm', '_blank');
          }
        });
      } else {
        // 譜面一覧ページに飛ぶ
        window.open('http://www.sdvx.in/sort/sort_' + level + '.htm', '_blank');
      }
    }
    return false;
  }

  render() {
    const selectLevelStyle = {
      verticalAlign: 'middle',
      margin: '1 2%',
      padding: '0 2%',
      width: '16%',
      height: '24px',
      lineHeight: '24px',
      fontSize: '12px',
      backgroundColor: '#fafafaf',
      border: '1px solid #8888ff',
      borderRadius: '2px'
    };

    const autocompleteStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      width: '50%',
      height: '26px',
      border: '1px solid #8888ff'
    };

    const autocompleteInputStyle = {
      paddingLeft: '4%',
      width: '100%',
      height: '24px',
      lineHeight: '18px',
      fontSize: '12px'
    };

    const submitButtonStyle = {
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      margin: '0 3%',
      padding: '2px 2%',
      width: '24%',
      height: '26px',
      color: '#fff',
      backgroundColor: '#8888ff',
      border: '1px solid #8888ff',
      borderRadius: '4px'
    };

    return (
      <div>
        <h1>sdvxめも</h1>
        <h2 style={{margin:0, padding:10}}>譜面サイト検索</h2>
        <form onSubmit={this.handleSubmit} style={{margin:0, padding:10}}>
          <select value={this.state.level} onChange={this.handleOnChangeLevel} style={selectLevelStyle}>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
          </select>
          <Autocomplete
            items={this.state.tracks}
            value={this.state.word}
            getItemValue={(item) => item.name}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item.name}</div>
            }
            onChange={this.handleOnChangeWord}
            onSelect={(val, item) => this.handleOnSelectAutocompleteWord(item)}
            wrapperStyle={autocompleteStyle}
            menuStyle={autocompleteInputStyle}
          />
          <input type="submit" value="検索" style={submitButtonStyle} />
        </form>
        <h2>リンク集</h2>
        <ul>
          <li><a href="https://p.eagate.573.jp/game/sdvx/">KONAMI</a></li>
          <li><a href="http://bemaniwiki.com/index.php?SOUND%20VOLTEX%20IV%20HEAVENLY%20HAVEN">Wiki</a></li>
          <li><a href="http://www.sdvx.in/">譜面サイト</a></li>
          <li><a href="http://nearnoah.sakura.ne.jp/sdvxiv/">スコアツール</a></li>
        </ul>
      </div>
    );
  }
}
