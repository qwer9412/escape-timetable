const time_table_input_id_format = "tablecell%row%,%col%"
const time_table_input_tag_str = "<input type='text' id='" + time_table_input_id_format + "' onchange='time_write(this)' size='20' style='width:100%; border: 0;'>"
const time_table_input_header_id_format = "head%col%"
const time_table_input_tag_str_header = "<input type='text' id='" + time_table_input_header_id_format + "' size='20' style='width:100%; border: 0;'>"

const time_pattern = /\d{4}/;

function change_table(click_id) {

    let table = document.getElementById('timetable');

    if (click_id == 'addCol') {

        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].insertCell(-1);
            table.rows[i].insertCell(-1);
        }
        let head_col_size = table.rows[0].getElementsByTagName('td').length
        let body_col_size = table.rows[1].getElementsByTagName('td').length
        table.rows[0].getElementsByTagName('td')[head_col_size - 2].colSpan = 2
        table.rows[0].getElementsByTagName('td')[head_col_size - 1].remove();

        // input 태그 삽입
        for (let i = 0; i < table.rows.length; i++) {

            if (i == 0) {
                head_col_size = table.rows[0].getElementsByTagName('td').length
                table.rows[0].getElementsByTagName('td')[head_col_size - 1].innerHTML += time_table_input_tag_str_header.replace("%col%", head_col_size - 1)
            } else {
                table.rows[i].getElementsByTagName('td')[body_col_size - 1].innerHTML
                    += time_table_input_tag_str.replace("%row%", i).replace("%col%", body_col_size - 1)
                table.rows[i].getElementsByTagName('td')[body_col_size - 2].innerHTML
                    += time_table_input_tag_str.replace("%row%", i).replace("%col%", body_col_size - 2)
            }
        }

    } else if (click_id == 'addRow') {

        let newRow = table.insertRow(-1);
        let row_size = table.rows.length
        for (let i = 0; i < table.rows[1].getElementsByTagName('td').length; i++) {
            newRow.insertCell(-1)
            table.rows[row_size - 1].getElementsByTagName('td')[i].innerHTML = time_table_input_tag_str.replace("%row%", row_size - 1).replace("%col%", i)
        }


    } else if (click_id == 'removeCol' && table.rows[0].getElementsByTagName('td').length > 1) {

        for (let i = 0; i < table.rows.length; i++) {
            if (i != 0) {
                table.rows[i].deleteCell(-1);
            }
            table.rows[i].deleteCell(-1);
        }

    } else if (click_id == 'removeRow' && table.rows.length > 2) {

        table.deleteRow(-1);

    }
}

function search_group() {

    // 검색 하기 전 화면 초기화
    clear_for_search()

    // 검색 시작
    let result = []
    let total_col = document.getElementById('timetable').rows[0].getElementsByTagName('td').length
    let total_row = document.getElementById('timetable').rows.length
    search_dfs(0, total_col, total_row, [], result)

    // 정렬
    result = line_up_result(result)

    // 출력
    show_result(result, total_col)
}

function clear_for_search() {
    // 기존 결과 테이블 제거
    var body = document.getElementsByTagName("body")[0]
    var result_table = document.getElementById("result_table")
    if (result_table != null) {
        body.removeChild(result_table)
    }
}

function time_write(time_tag) {

    if (time_tag == null || time_tag.value == null || time_tag.value == '') {
        return
    }

    var time = time_tag.value

    if (time.length != 4 || !time_pattern.test(time)) {
        alert('시간이 잘못 입력 되었습니다.\n입력 예시\n오전9시 -> 0900\n오후9시 -> 2100')
        time_tag.value = ''
    }
}

class TimeTable {

    constructor(row, col) {
        this.row = row
        this.col = col
        this.start_time = document.getElementById(time_table_input_id_format.replace("%row%", row).replace("%col%", col * 2)).value
        this.end_time = document.getElementById(time_table_input_id_format.replace("%row%", row).replace("%col%", col * 2 + 1)).value

        // 입력하지 않은 칸
        if (this.start_time == "" || this.end_time == "") {
            throw "INVALID_TIME"
        }
    }
}

function search_dfs(col, total_col, total_row, cur_table_list, result) {

    if (col == total_col) {
        if (check_possible_time(cur_table_list)) {
            result.push(cur_table_list.slice())
        }
        return
    }

    for (let i = 1; i < total_row; i++) {
        try {
            cur_table_list.push(new TimeTable(i, col))
        } catch (e) {
            continue
        }
        search_dfs(col + 1, total_col, total_row, cur_table_list, result)
        cur_table_list.pop()
    }
}

function check_possible_time(time_list_input) {

    let time_list = time_list_input.slice()
    time_list.sort(time_cmp)

    for (let i = 0; i < time_list.length - 1; i++) {
        if (time_list[i].end_time > time_list[i + 1].start_time) {
            return false
        }
    }

    return true
}

function time_cmp(time_table_a, time_table_b) {
    if (time_table_a.start_time < time_table_b.start_time) return -1
    if (time_table_a.start_time == time_table_b.start_time) return 0
    if (time_table_a.start_time > time_table_b.start_time) return 1
}

function line_up_result(result) {

    let order = document.getElementById('orderType').value

    if (order == 'termMin') {
        let result_with_term = []
        for (let i = 0; i < result.length; i++) {
            result_with_term.push(new TimeTableTerm(result[i]))
        }
        result_with_term.sort(function (a, b) { return a.term_sum - b.term_sum })
        result = []
        for (let i = 0; i < result_with_term.length; i++) {
            result.push(result_with_term[i].list)
        }
    } else if (order == 'startFast') {
        result.sort(function (a, b) { return get_min_start_time(a) - get_min_start_time(b) })
    } else if (order == 'startSlow') {
        result.sort(function (a, b) { return get_min_start_time(b) - get_min_start_time(a) })
    }

    return result
}

class TimeTableTerm {

    constructor(list) {
        this.list = list
        this.term_sum = 0

        let time_list = list.slice().sort(time_cmp)
        for (let i = 0; i < time_list.length - 1; i++) {
            let hour_term = time_list[i + 1].start_time.substr(0, 2) - time_list[i].end_time.substr(0, 2)
            let min_term = time_list[i + 1].start_time.substr(2, 2) - time_list[i].end_time.substr(2, 2)
            this.term_sum += hour_term * 60 + min_term
        }
    }
}

function get_min_start_time(list) {
    let min = list[0].start_time
    for (let i = 1; i < list.length; i++) {
        min = Math.min(min, list[i].start_time)
    }
    return min
}

function show_result(result, total_col) {

    var result_table = document.createElement("table")
    result_table.style.marginTop = "50px"
    result_table.id = "result_table"

    // 테마명
    var head_tr = document.createElement("tr")
    for (let i = 0; i < total_col; i++) {
        var td = document.createElement("td")
        td.setAttribute("colspan", "2")
        td.innerHTML = document.getElementById(time_table_input_header_id_format.replace("%col%", i)).value
        head_tr.appendChild(td)
    }
    result_table.appendChild(head_tr)

    // 시간
    for (let i = 0; i < result.length; i++) {
        var tr = document.createElement("tr")

        for (let j = 0; j < total_col; j++) {
            var start_td = document.createElement("td")
            var end_td = document.createElement("td")

            start_td.innerHTML = result[i][j].start_time
            end_td.innerHTML = result[i][j].end_time

            tr.appendChild(start_td)
            tr.appendChild(end_td)
        }
        result_table.appendChild(tr)
    }

    document.getElementsByTagName('body')[0].appendChild(result_table)
}