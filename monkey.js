// ==UserScript==
// @name         补天_2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  补天 /Loo/submit 页面运行
// @author       北部
// @match        https://www.butian.net/Loo/submit
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* ==========  1. 日志区 + console 劫持（最小侵入） ========== */
    const LOG = (() => {
        let box, area;
        const init = () => {
            if (box) return;

            /* 容器 */
            box = document.createElement('div');
            box.id = 'beibu_ui';
            Object.assign(box.style, {
                position: 'fixed',
                inset: '8% auto 8% 0',
                width: '18.5%',
                background: 'rgba(0,0,0,.55)',
                display: 'none',               /* 默认隐藏 */
                flexDirection: 'column',
                zIndex: 9999
            });

            /* 6 按钮 */
            const cfg = ['信息补充', '弱口令', 'xss', 'csrf', 'sql注入', '逻辑漏洞'];
            cfg.forEach((txt, idx) => {
                const b = document.createElement('button');
                b.textContent = txt;
                b.style.cssText = 'height:36px;margin:0 0 6px 0;width:100%;cursor:pointer;font-size:14px;';
                b.onclick = () => btnActions[idx]();   /* 绑定对应动作 */
                box.appendChild(b);
            });

            /* 日志输出区 */
            area = document.createElement('div');
            area.style.cssText = 'flex:1;overflow-y:auto;height:120px;background:rgba(0,0,0,.6);color:#0f0;font:12px/1.4 monospace;padding:4px;white-space:pre-wrap;';
            box.appendChild(area);
            document.body.appendChild(box);
        };

        const write = (lv, ...args) => {
            init();
            const line = `${new Date().toLocaleTimeString()} [${lv}] ${args.map(i => typeof i === 'object' ? JSON.stringify(i) : i).join(' ')}`;
            const div = document.createElement('div');
            div.textContent = line;
            area.appendChild(div);
            area.scrollTop = area.scrollHeight;
        };

        /* 劫持原生 console */
        const lvMap = { log: 'LOG', warn: 'WARN', error: 'ERR' };
        ['log', 'warn', 'error'].forEach(l => {
            const raw = console[l];
            console[l] = (...a) => { write(lvMap[l], ...a); raw.apply(console, a); };
        });

        return { show: () => { init(); box.style.display = 'flex'; } };
    })();

    /* ==========  2. 6 按钮动作占位（后续你随便改） ========== */
    const btnActions = [
        main,
        weak_password,
        weak_xss,
        weak_csrf,
        weak_sql,
        weak_logical
    ];

    /* ==========  3. 原脚本完全不动，仅把 create_btn 扩一行 ========== */

    function create_btn() {
    // “控制台”开关
        const btn = document.createElement('button');
        btn.textContent = '控制台';
        btn.style.cssText = 'position:fixed; left:2%; top:2%; padding:6px 12px; font-size:13px;';
        btn.style.zIndex = 9999;
        btn.onclick = () => LOG.show();
        document.body.appendChild(btn);
    }

    /* ==========  4. 后面所有代码保持原样 ↓↓↓ ========== */


    console.log('当前处于补天提交页');
    const BASE = 'https://101.35.159.147'

    function ceshi(){
        /* ========== 用户可调参数 ========== */
        var btnBottom  = 1;      // 距离底部百分比
        var btnLeft    = 1;      // 距离左侧百分比
        var btnTop     = '';     // 距离顶部百分比（留空禁用）
        var btnRight   = '';     // 距离右侧百分比（留空禁用）

        var btnPadding = '12px 40px';  // 按钮内边距：'上下 左右'
        var btnFontSize = '10px';      // 字号，越大按钮越大
        /* ================================== */


        var btn = document.createElement('button');
        btn.id = 'myBtn';
        btn.textContent = '初始化';
        btn.style.cssText =
            'position:fixed;' +
            'padding:' + btnPadding + ';' +
            'font-size:' + btnFontSize + ';' +
            'background:rgba(0,0,0,.6)' +
            'color:#0f0' +
            'border:none;' +
            'border-radius:4px;' +
            'cursor:pointer;' +
            'z-index:9999';

        if(btnBottom !== '') btn.style.bottom = btnBottom + '%';
        if(btnLeft   !== '') btn.style.left   = btnLeft   + '%';
        if(btnTop    !== '') btn.style.top    = btnTop    + '%';
        if(btnRight  !== '') btn.style.right  = btnRight  + '%';

        btn.onclick = init_server;
        document.body.appendChild(btn);
    }

    function init_server(){
        window.open('https://101.35.159.147/api/ceshi')
    }



    function get_userinput() {


        var input_domain = document.querySelector('input[placeholder="输入所属域名或ip"]');
        var input_domain = input_domain.value;

        var input_url = document.querySelector('input[placeholder="URL格式：以http://或https://开头"]');
        var input_url = input_url.value;

        if (input_domain && input_url) {
            if (input_url.length > input_domain.length) {
                const input_data = input_url;
                console.log('get user input:', input_data);
                return { type: 1, data: input_data };
            } else if (input_url.length < input_domain.length) {
                const input_data = input_url;
                console.log('get user input:', input_data);
                return { type: 2, data: input_data };
            }
        } else if (input_domain) {
            const input_data = input_domain;
            console.log('get user input:', input_data);
            return { type: 2, data: input_data };
        } else if (input_url) {
            const input_data = input_url;
            console.log('get user input:', input_data);
            return { type: 1, data: input_data };
        } else {
            console.log('未获取到用户输入');
        }
    };


    async function get_maindomain(input_data){
        const res = await fetch(`${BASE}/api/main_domain`, {

                method: 'POST',
                // 1. 改成简单类型
                headers: { 'Content-Type': 'text/plain' },
                // 2. body 里还是 JSON 字符串，后端按字符串接收再 JSON.parse 即可
                body: JSON.stringify({ url: input_data })
            });
            const result = await res.json();
            console.log('后端返回：', result);
            return result
    };


    async function get_domainicp(input_data) {
        const res = await fetch(`${BASE}/api/icp`, {
            method: 'POST',
            // 1. 改成简单类型
            headers: { 'Content-Type': 'text/plain' },
            // 2. body 里还是 JSON 字符串，后端按字符串接收再 JSON.parse 即可
            body: JSON.stringify({ domain: input_data })
        });
        if (res.status === 500){
            console.log('服务端500错误')
            return {}
        }
        const result = await res.json();
        console.log('后端返回：', result);
        return result
    };


    async function get_input_ICP(input_data){
        console.log('正在获取相关企业ICP:',input_data)

        if (input_data.type == 1){
            var domain = await get_maindomain(input_data.data)
            domain = await domain.domain_main
            console.log(domain)

            var ICP_name = await get_domainicp(domain)
            if(ICP_name){
                ICP_name = await ICP_name[domain]
                console.log(ICP_name)
                return {'icp':ICP_name,'type':1,'maindomain':domain}
            }else{
                return '服务端错误'
            }


        }else if (input_data.type == 2){
            var ICP_name = await get_domainicp(input_data.data)
            ICP_name = await ICP_name[input_data.data]
            if(ICP_name){
                console.log(ICP_name)
                return {'icp':ICP_name,'type':0}
            }else{
                return '服务端错误'
            };

        };
    };


    async function fill_input(name_ICP){
        if(name_ICP.maindomain){
            var csmc_input = document.querySelector('input[placeholder="请选择"][name="company_name"][style="width: 200px"]')
            csmc_input.value = name_ICP.icp
            console.log('csmc已填入')

            var domainorip = document.querySelector('input[placeholder="输入所属域名或ip"]');
            domainorip.value = name_ICP.maindomain
            console.log('domainoricp已填入')


        }else{
            var csmc_input = document.querySelector('input[placeholder="请选择"][name="company_name"][style="width: 200px"]')
            csmc_input.value = name_ICP.icp
            console.log('csmc已填入')
        }
    }


    function select_input(){
        // 设置权重
        var br = document.querySelector('select[name="weight"]')
        br.value = '1';
        console.log('权重已设置')

        // 设置危害
        var level = document.querySelector('select[name="level"][id="level"]')
        level.value = '1';
        console.log('危害已选择')

        // 设置活动，默认取第一个存在的值
        var hd = document.querySelector('select[name="active_id"][class="sel"]')
        var option_list = hd.options
        // console.log(hd,option_list)
        for (var i=0;i<option_list.length;i++){
            if (option_list[i].value && option_list[i].value.trim() !== ''){
                hd.value = option_list[i].value;
                console.log('活动值已设置')
                break;
            }
        };

        // 设置任务
        var rw = document.querySelector('select[name="mission_id"]')
        var rw_option_list = rw.options
        // console.log(rw_option_list)
        for (var i=0;i<rw_option_list.length;i++){
            if (rw_option_list[i].value && rw_option_list[i].value.trim() !== ''){
                rw.value = rw_option_list[i].value;
                console.log(rw_option_list[i])
                console.log('任务值已设置')
                break;
            }
        };

    };


    async function type_input(tag_name){
        // 获取企业类型
        const res = await fetch(`${BASE}/api/message_get`, {
            method: 'POST',
            // 1. 改成简单类型
            headers: { 'Content-Type': 'text/plain' },
            // 2. body 里还是 JSON 字符串，后端按字符串接收再 JSON.parse 即可
            body: JSON.stringify({ 'name': tag_name })
        });

        var result = await res.json();
        console.log(result)
        // 选择标签
        var type_select = document.querySelector('select[id="industry1"][name="industryLoo1"]')
        var type_options = type_select.options
        // console.log('已获取选择标签:',type_options)
        for (var i=0;i<type_options.length;i++){
            if (type_options[i].textContent == result['type']){
                type_select.value = type_options[i].value
            }
        };
        type_select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))

        // 选择子选项

        var sub_select
        sub_select = document.querySelector('p[id="industry2"]')


        // 获取动态加载
        const timer = setInterval(() => {
            const labels = sub_select.querySelectorAll('label');
            if (labels.length) {          // 每200毫秒秒检测一次
                console.log('企业类型 子选项标签已加载');

                console.log(sub_select,labels)
                clearInterval(timer);

                setTimeout(function(){
                    for (var i=0;i<2;i++){
                    labels[i].click()
                    console.log(`企业类型子标签${i}已点击`)
                    };
                    console.log('企业类型子标签已点击')
                },3000);



            }
        }, 200);

    };


    async function address_input(tag_name){
        const res = await fetch(`${BASE}/api/address_get`, {
            method: 'POST',
            // 1. 改成简单类型
            headers: { 'Content-Type': 'text/plain' },
            // 2. body 里还是 JSON 字符串，后端按字符串接收再 JSON.parse 即可
            body: JSON.stringify({ 'name': tag_name })
        });

        var result = await res.json();
        console.log('已获取服务端响应:',result)

        // 省
        const PV_tag = document.querySelector('select[id="selec1"][name="province"]')
        // console.log('已获取选择标签:',PV_tag)
        var pv_options = PV_tag.options;
        for (var i = 0;i < pv_options.length;i++){
            if(pv_options[i].value == result.PV){
                PV_tag.value = pv_options[i].value
                console.log('省级地址已选择')
            };
        };
        PV_tag.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))

        // 市
        const ct_tag = document.querySelector('select[name="city"][id="selec2"]')
        const timer_ct = setInterval(() => {
            const ct_options = ct_tag.querySelectorAll('option');
            // console.log(ct_options)
            for (let i=0;i<ct_options.length;i++){
                if(ct_options[i].value !== '请选择' && ct_options[i].value.slice(0, 2) == result.CT.slice(0, 2)){
                    clearInterval(timer_ct);
                    console.log('已获取选择标签:',ct_options[i].value)

                    setTimeout(function(){
                        ct_tag.value = ct_options[i].value;
                        ct_tag.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
                        console.log('市级地址已选择')
                    },3000)

                }
            }

        }, 200);

        //区
        const dq_tag = document.querySelector('select[name="county"][id="selec3"]')
        const timer_dq = setInterval(() => {
            const dq_options = dq_tag.querySelectorAll('option');
            // console.log(dq_options)
            for (let i=0;i<dq_options.length;i++){
                if(dq_options[i].value !== '请选择' && dq_options[i].value.slice(0, 2) == result.DQ.slice(0, 2)){
                    clearInterval(timer_dq);
                    console.log('已获取选择标签:',dq_options[i].value)

                    setTimeout(function(){
                        dq_tag.value = dq_options[i].value;
                        dq_tag.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
                        console.log('区级地址已选择')
                    },3000)

                }
            }

        }, 200);


    };


    async function main() {
        create_btn();
        select_input()
        // 获取用户输入 { type: 2, data: input_data }
        const input_data = get_userinput()

        // ICP备案查询{'icp':ICP_name,'type':1,'maindomain':domain}
        var name_ICP =  await get_input_ICP(input_data)
        console.log(name_ICP)

        // 三要素填写
        fill_input(name_ICP)

        // 选择企业类型
        type_input(name_ICP.icp)

        // 选择企业地址
        address_input(name_ICP.icp)

    };


    // 获取服务器响应
    async function get_path(url){
        const res = await fetch(`${BASE}/api/get_path`, {
            method: 'POST',
            // 1. 改成简单类型
            headers: { 'Content-Type': 'text/plain' },
            // 2. body 里还是 JSON 字符串，后端按字符串接收再 JSON.parse 即可
            body: JSON.stringify({ 'url': url })
        });

        var result = await res.json();
        console.log('已获取服务端响应:',result.path)
        return result.path
    };


    async function weak_input(weak_type,explain,suggest){
        var input_url = document.querySelector('input[placeholder="URL格式：以http://或https://开头"]');
        var url = input_url.value;

        // 获取漏洞标题标签
        const weak_title = document.querySelector('input[placeholder="单位名称+漏洞类型，如：某单位存在SQL注入漏洞"]')

        // 漏洞类型标签
        var weaktype_input = document.querySelector('select[id="lootypesel2"][class="sel2"]')

        // 获取描述标签
        const weak_description = document.querySelector('textarea[name="description"][id="description"]')

        //获取修复标签
        const weak_suggest = document.querySelector('textarea[id="repair_suggest"][name="repair_suggest"]')

        // 获取路径
        var path = await get_path(url)
        console.log(path)

        // 获取公司名
        var ICP_name = document.querySelector('input[name="company_name"][placeholder="请选择"]').value
        if (ICP_name == "" ){
            await main()
            ICP_name = document.querySelector('input[name="company_name"][placeholder="请选择"]').value
        }

        // 类型
        const weak_name = document.querySelector(`select[id="lootypesel2"][class="sel2"] option[value="${weak_type}"]`).textContent.trim()
        weaktype_input.value = weak_type
        weaktype_input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
        console.log('漏洞类型已选择')


        // 标题

        weak_title.value = `${ICP_name}/线上业务系统${path}接口存在${weak_name}漏洞`

        console.log('漏洞标题已键入')

        // 描述
        weak_description.click()
        weak_description.value = `${ICP_name}/线上业务系统${path}接口${explain}`
        weak_description.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
        var message = document.getElementById('tpl_def_description');
        message.style.display = 'none';


        //修复
        weak_suggest.value = suggest

    }


    async function weak_password(){

        const explain = '接口存在弱口令漏洞,攻击者可通过暴力破解、字典攻击等方式轻易获取账户控制权，导致未授权访问、数据泄露或系统被完全控制。'
        const suggest = '强制启用12位复杂度密码+2FA，定期审计并禁用默认/弱口令。'
        weak_input('67',explain,suggest);

    }


    async function weak_sql(){

        const explain = '接口存在SQL注入漏洞，攻击者可通过构造恶意SQL语句绕过身份验证，实现未授权访问、敏感数据批量窃取或远程执行系统命令。'
        const suggest = '全站启用参数化查询/预编译语句，严格限制数据库账户权限，部署WAF与RASP进行实时拦截，定期执行SQL注入基线扫描。'
        weak_input('2',explain,suggest);

    }


    async function weak_xss(){

        const explain = '接口未对用户输入做转义，恶意脚本可注入页面，劫持会话或跳转到钓鱼站。'
        const suggest = '输出时统一转义，开启内容安全策略，文件上传单独域名存储。'
        weak_input('1',explain,suggest);

    }


    async function weak_csrf(){

        const explain = '接口缺乏CSRF防护，攻击者可伪造已登录用户的身份，在第三方站点发起恶意请求，导致资金转账、密码修改等高危操作被执行。'
        const suggest = '全敏感接口加入一次性Anti-CSRF Token并校验Referer/Origin，Cookie显式设置SameSite=Strict，关键操作再引入二次确认或验证码。'
        weak_input('8',explain,suggest);

    }


    async function weak_logical(){

        const explain = '接口业务判断不严谨，攻击者可通过篡改字段或重复提交，实现越权、超额等异常操作。'
        const suggest = '服务端再验状态与权限，关键步骤加幂等校验，并留存日志备查。'
        weak_input('8',explain,suggest);

    }








    /* ==========  5. 入口 ========== */
    ceshi();
    create_btn();
})();