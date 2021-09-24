const time_table_input_id_format = "tablecell%row%,%col%"
const time_table_input_tag_str = "<input type=\"number\" id=\"" + time_table_input_id_format + "\" onchange=\"time_write(this)\" size=\"20\" style=\"width:100%; border: 0;\">"
const time_table_input_tag_str_header = "<input type=\"text\" size=\"20\" style=\"width:100%; border: 0;\">"

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
                table.rows[0].getElementsByTagName('td')[head_col_size - 1].innerHTML += time_table_input_tag_str_header
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
    let result = []
    let total_col = document.getElementById('timetable').rows[0].getElementsByTagName('td').length
    let total_row = document.getElementById('timetable').rows.length
    search_dfs(0, total_col, total_row, [], result)

    for (let i = 0; i < result.length; i++) {
        console.log(result[i])
    }
}

function time_write(time) {

    if (time.value.length != 4) {
        alert('시간이 잘못 입력 되었습니다.\n입력 예시\n오전9시 -> 0900\n오후9시 -> 2100')
        time.value = ''
    }
}

class TimeTable {

    constructor(row, col) {
        this.row = row
        this.col = col
        this.start_time = document.getElementById(time_table_input_id_format.replace("%row%", row).replace("%col%", col * 2)).value
        this.end_time = document.getElementById(time_table_input_id_format.replace("%row%", row).replace("%col%", col * 2 + 1)).value

        // 입력하지 않은 칸
        if (this.start_time == "") {
            this.start_time = '-9999'
        }
        if (this.end_time == "") {
            this.end_time = '9999'
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
        cur_table_list.push(new TimeTable(i, col))
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