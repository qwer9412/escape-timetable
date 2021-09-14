const input_tag_str = "<input type=\"text\" name=\"text\" size=\"20\" style=\"width:100%; border: 0;\">"

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
                table.rows[0].getElementsByTagName('td')[head_col_size - 1].innerHTML += input_tag_str
            } else {
                table.rows[i].getElementsByTagName('td')[body_col_size - 1].innerHTML += input_tag_str
                table.rows[i].getElementsByTagName('td')[body_col_size - 2].innerHTML += input_tag_str
            }
        }

    } else if (click_id == 'addRow') {

        let newRow = table.insertRow(-1);
        let row_size = table.rows.length
        for (let i = 0; i < table.rows[1].getElementsByTagName('td').length; i++) {
            newRow.insertCell(-1)
            table.rows[row_size - 1].getElementsByTagName('td')[i].innerHTML += input_tag_str
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