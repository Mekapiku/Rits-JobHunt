// ==UserScript==
// @name          Rits Job Hunt
// @namespace     http://mekapiku.info
// @description   CampusWebの面倒な表示から解き放たれよ
// @include       http://campusweb.ritsumei.ac.jp/campus/JCIFEVT01.do?*
// @include       https://campusweb.ritsumei.ac.jp/campus/JCIFEVT01.do?*
// ==/UserScript==

(function() {
    // XPathから要素にアクセス
    function $x(path, d) {
        if (!d) d = document;
        return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    // Google Calendarへの追加URLを作る
    function getPlanUrl(title, description, location, day, hour, minute) {
        // var form = $x('//body/form/center/table[4]/tbody/tr/td/table/tbody/tr/td');
        var year = $x('//body/form/center/table[4]/tbody/tr/td/table/tbody/tr/td/input').snapshotItem(0).value;
        var month = $x('//body/form/center/table[4]/tbody/tr/td/table/tbody/tr/td/input[2]').snapshotItem(0).value;
        var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), 0);

        var action  = "TEMPLATE";
        var text    = title;
        var desc    = description;
        var loc     = location;
        var startT  = formatToUTCDate(date);
        var endT    = null;

        if (endT == null) {
            endT = startT;
        }

        var dates = startT + '/' + endT;
        var trp = "true";

        var url = 'http://www.google.com/calendar/event?' +
            'action='   + action +
            '&text='    + encodeURIComponent(text)   +
            '&details=' + encodeURIComponent(desc)   +
            '&location='+ encodeURIComponent(loc)    +
            '&dates='   + dates +
            '&trp=true' + '&sprop=name:rits-job-hunt';

        return url;
    }

    function formatToUTCDate(date) {

        var _year   = date.getUTCFullYear().toString();
        var _month  = (date.getUTCMonth() + 1).toString();
        var _day    = date.getUTCDate().toString();
        var _hour   = date.getUTCHours().toString();
        var _minute = date.getMinutes().toString();

        if (_month.length == 1) {
            _month = "0" + _month;
        }
        if (_day.length == 1) {
            _day = "0" + _day;
        }
        if (_hour.length == 1) {
            _hour = "0" + _hour;
        }
        if (_minute.length == 1) {
            _minute = "0" + _minute;
        }

        return _year + _month + _day + 'T' + _hour + _minute + "00" +'Z';
    }

    // 追加するボタンの設定
    function Button(url) {
        var cal_cel = document.createElement("td");
        cal_cel.className="cal_button";
        cal_cel.setAttribute('valign', 'middle');
        
        var cal_btn = document.createElement("input");
        cal_btn.id = "cal_btn";
        cal_btn.type = "button";
        cal_btn.value = "GoogleCalendarに追加";
        cal_btn.setAttribute("onClick", "window.open(" + "'" + url + "'" + ")");
        
        cal_cel.appendChild(cal_btn);
        return cal_cel;
    }

    // DOMでアクセスする準備
    var cal_table = $x('//body/form/center/center/table[4]').snapshotItem(0);
    var table_body = cal_table.childNodes[1];
    var table_lines = table_body.childNodes;
    var title_row = table_lines[0];

    // 追加する列の設定
    var cal_row = document.createElement("td");
    cal_row.className="shcomthlist";
    cal_row.setAttribute('width', '150');
    cal_row.appendChild(document.createTextNode("Google Calendar"));
    title_row.appendChild(cal_row);

    // 以下の行にボタンを配置
    for (var i = 1; i < table_lines.length; i++) {
        if (table_lines[i].innerHTML != null) {
            // var _content = table_lines[i].textContent.replace(/\s|　/g, ",").replace(/,+/g, ",").split(",");
            var _day = table_lines[i].childNodes[1].textContent.replace(/^\s+|\s+$/g, "");
            var _start = table_lines[i].childNodes[7].textContent.replace(/^\s+|\s+$/g, "");
            var _hour = _start.split(':')[0];
            var _minute = _start.split(':')[1];
            var _location = table_lines[i].childNodes[9].textContent.replace(/^\s+|\s+$/g, "");
            var _category = table_lines[i].childNodes[11].textContent.replace(/^\s+|\s+$/g, "");
            var _title = table_lines[i].childNodes[13].textContent.replace(/^\s+|\s+$/g, "");

            table_lines[i].appendChild(new Button(getPlanUrl(_title, _category + _title, _location, _day, _hour, _minute)));
        }
    }
})();
