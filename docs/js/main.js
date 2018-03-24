// https://jp.vuejs.org/v2/examples/todomvc.html
const STORAGE_KEY = 'todos-vuejs-demo'
let todoStorage = {
    fetch: function() {
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

const app = new Vue({
    el: '#todo',
    data: {
        todos: [],
        labels: [
            { value: -1, label: 'すべて' },
            { value: 0,  label: '作業中' },
            { value: 1,  label: '完了' }
        ],
        // 選択している labels の value を記憶するためのデータ
        // 初期値を「-1」つまり「すべて」にする
        current: -1
    },
    methods: {
        // ToDo 追加の処理
        doAdd: function(event, value) {
            // ref で名前を付けておいた要素を参照
            var comment = this.$refs.comment
            // 入力がなければ何もしないで return
            if (!comment.value.length) {
                return
            }
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })
            comment.value = ''
        },
        doChangeState: function(item) {
            item.state = item.state ? 0 : 1
        },
        doRemove: function(item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        },
        toLabel: function(state) {
            // ここでは ES6 を使わないので filter で代用
            var el = this.labels.filter(function(el) {
                return el.value === state
            })[0]
            // 一致する要素が見つかったら label を返す
            return el ? el.label : state
        }
    },
    watch: {
        // オプションを使う場合はオブジェクト形式にする
        todos: {
        // 引数はウォッチしているプロパティの変更後の値
            handler: function(todos) {
                todoStorage.save(todos)
            },
            // deep オプションでネストしているデータも監視できる
            deep: true
        }
    },
    created() {
        // インスタンス作成時に自動的に fetch() する
        this.todos = todoStorage.fetch()
    },
    computed: {
        computedTodos: function() {
            // データ current が -1 ならすべて
            // それ以外なら current と state が一致するものだけに絞り込む
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        }
    }
})