import '../../css/base'
import App from '../module/App/App'
import router from '../module/Route/Route'

new Vue({
    el:'#app',
    router,
    render: h => h(App)
})
