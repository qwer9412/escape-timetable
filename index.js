function change_table(click_id) {

    let table = document.getElementById('timetable');

    if (click_id == 'addCol') {

        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].insertCell(-1);
            table.rows[i].insertCell(-1);
        }
        let colSize = table.getElementsByTagName('tr')[0].getElementsByTagName('td').length
        table.getElementsByTagName('tr')[0].getElementsByTagName('td')[colSize-2].colSpan = 2
        table.getElementsByTagName('tr')[0].getElementsByTagName('td')[colSize-1].remove();

    } else if (click_id == 'addRow') {

        let newRow = table.insertRow(-1);
        for (let i = 0; i < table.getElementsByTagName('tr')[1].getElementsByTagName('td').length; i++) {
            newRow.insertCell(-1)
        }


    } else if (click_id == 'removeCol' && table.getElementsByTagName('tr')[0].getElementsByTagName('td').length > 1) { 

        for(let i = 0; i < table.rows.length; i++)  {
            if (i != 0) {
                table.rows[i].deleteCell(-1);
            }
            table.rows[i].deleteCell(-1);
          }

    } else if (click_id == 'removeRow' && table.getElementsByTagName('tr').length > 2) {

        table.deleteRow(-1);

    }
}